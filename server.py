#!/usr/bin/env python3
import json
import os
import ssl
import sqlite3
import sys
import traceback
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError


def build_ssl_context():
    """Build an SSL context that finds CA roots even when Python's default
    bundle isn't installed (common on macOS python.org Python)."""
    # 1. Try Python's built-in default verify paths
    cafile = ssl.get_default_verify_paths().openssl_cafile
    if cafile and os.path.exists(cafile):
        return ssl.create_default_context()
    # 2. Try certifi if importable
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        pass
    # 3. Try common macOS / Linux locations
    for candidate in [
        "/etc/ssl/cert.pem",
        "/etc/ssl/certs/ca-certificates.crt",
        "/usr/local/etc/openssl/cert.pem",
        "/opt/homebrew/etc/openssl@3/cert.pem",
    ]:
        if os.path.exists(candidate):
            return ssl.create_default_context(cafile=candidate)
    # 4. Last resort: default context (may fail; user sees clear error)
    return ssl.create_default_context()


SSL_CONTEXT = build_ssl_context()


DEFAULT_TARGET = "http://127.0.0.1:1234/v1/chat/completions"
DATA_DIR = Path(__file__).with_name("data")
STATE_FILE = DATA_DIR / "app-state.json"
DB_FILE = DATA_DIR / "linguini.sqlite3"
LEGACY_DB_FILE = DATA_DIR / "lumalingua.sqlite3"
STATE_KEY = "app_state"


_BOOT_RESTORE_DONE = False


def _has_real_state(value):
    """True if a JSON state string looks like real saved data (not empty/init)."""
    if not value:
        return False
    stripped = value.strip()
    if stripped in ("", "{}"):
        return False
    return len(stripped) > 50


def _read_state_row():
    """Read the current app_state row; returns the JSON string or None."""
    try:
        with sqlite3.connect(DB_FILE) as c:
            row = c.execute("SELECT value FROM app_state WHERE key = ?", (STATE_KEY,)).fetchone()
        return row[0] if row else None
    except sqlite3.Error:
        return None


def _import_state(payload):
    """Upsert the app_state row from a JSON string."""
    with sqlite3.connect(DB_FILE) as c:
        c.execute(
            """
            INSERT INTO app_state (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP
            """,
            (STATE_KEY, payload),
        )


def _boot_restore_from_backup():
    """If the SQLite is empty/missing, restore from the JSON mirror or legacy SQLite."""
    if _has_real_state(_read_state_row()):
        return  # DB already has real data; nothing to do
    # 1. JSON mirror (written on every save)
    if STATE_FILE.exists():
        try:
            payload = STATE_FILE.read_text(encoding="utf-8")
            if _has_real_state(payload):
                _import_state(payload)
                print(f"[init] Restored app_state from {STATE_FILE}", file=sys.stderr, flush=True)
                return
        except Exception as exc:
            print(f"[init] Could not restore from JSON mirror: {exc}", file=sys.stderr, flush=True)
    # 2. Legacy SQLite from earlier rename
    if LEGACY_DB_FILE.exists() and LEGACY_DB_FILE != DB_FILE:
        try:
            with sqlite3.connect(LEGACY_DB_FILE) as c:
                row = c.execute("SELECT value FROM app_state WHERE key = ?", (STATE_KEY,)).fetchone()
            if row and _has_real_state(row[0]):
                _import_state(row[0])
                print(f"[init] Restored app_state from {LEGACY_DB_FILE}", file=sys.stderr, flush=True)
                return
        except Exception as exc:
            print(f"[init] Could not restore from legacy SQLite: {exc}", file=sys.stderr, flush=True)


def init_database():
    global _BOOT_RESTORE_DONE
    DATA_DIR.mkdir(exist_ok=True)
    # Legacy rename if the new file is missing entirely (first migration from LumaLingua)
    if LEGACY_DB_FILE.exists() and not DB_FILE.exists():
        LEGACY_DB_FILE.rename(DB_FILE)
    with sqlite3.connect(DB_FILE) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS app_state (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
    # Restore from backup sources once per process startup, only if DB is empty
    if not _BOOT_RESTORE_DONE:
        _BOOT_RESTORE_DONE = True
        _boot_restore_from_backup()


def read_state():
    init_database()
    with sqlite3.connect(DB_FILE) as connection:
        row = connection.execute("SELECT value FROM app_state WHERE key = ?", (STATE_KEY,)).fetchone()
    if row:
        return row[0].encode("utf-8")
    if STATE_FILE.exists():
        return STATE_FILE.read_bytes()
    return b"{}"


def write_state(data):
    init_database()
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    with sqlite3.connect(DB_FILE) as connection:
        connection.execute(
            """
            INSERT INTO app_state (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP
            """,
            (STATE_KEY, payload),
        )
    STATE_FILE.write_text(payload, encoding="utf-8")


class ChatProxyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/state":
            self.send_json_state()
            return
        super().do_GET()

    def do_HEAD(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/state":
            payload_length = len(read_state())
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(payload_length))
            self.end_headers()
            return
        super().do_HEAD()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/state":
            self.save_json_state()
            return
        if parsed.path != "/api/chat":
            self.send_error(404, "Unknown endpoint")
            return

        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length)
        target = parse_qs(parsed.query).get("target", [DEFAULT_TARGET])[0]

        request = Request(
            target,
            data=body,
            method="POST",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )
        api_key = self.headers.get("X-LLM-API-Key")
        auth_style = (self.headers.get("X-LLM-Auth-Style") or "").lower()
        if auth_style == "anthropic":
            request.add_header("anthropic-version", "2023-06-01")
            if api_key:
                request.add_header("x-api-key", api_key)
        elif api_key:
            request.add_header("Authorization", f"Bearer {api_key}")

        try:
            with urlopen(request, context=SSL_CONTEXT) as response:
                payload = response.read()
                self.send_response(response.status)
                self.send_header("Content-Type", response.headers.get("Content-Type", "application/json"))
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
        except HTTPError as error:
            payload = error.read()
            try:
                preview = payload.decode("utf-8", errors="replace")[:500]
            except Exception:
                preview = "<binary>"
            print(f"[proxy] HTTPError {error.code} from {target}: {preview}", file=sys.stderr, flush=True)
            self.send_response(error.code)
            self.send_header("Content-Type", error.headers.get("Content-Type", "text/plain"))
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except URLError as error:
            reason = str(error.reason)
            print(f"[proxy] URLError reaching {target}: {reason}", file=sys.stderr, flush=True)
            traceback.print_exc(file=sys.stderr)
            hint = ""
            if "certificate" in reason.lower() or "ssl" in reason.lower():
                hint = (
                    " (Looks like an SSL certificate problem. If you're on macOS Python from python.org, "
                    "run \"Install Certificates.command\" from /Applications/Python\\ 3.X/ once.)"
                )
            message = f"Could not reach {target}: {reason}{hint}".encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(message)))
            self.end_headers()
            self.wfile.write(message)
        except Exception as error:
            print(f"[proxy] Unexpected error reaching {target}: {error}", file=sys.stderr, flush=True)
            traceback.print_exc(file=sys.stderr)
            message = f"Proxy crashed: {error}".encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(message)))
            self.end_headers()
            self.wfile.write(message)

    def send_json_state(self):
        payload = read_state()
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def save_json_state(self):
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length)
        try:
            data = json.loads(body.decode("utf-8") or "{}")
            write_state(data)
        except (json.JSONDecodeError, OSError) as error:
            message = f"Could not save state: {error}".encode("utf-8")
            self.send_response(400)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(message)))
            self.end_headers()
            self.wfile.write(message)
            return

        payload = b'{"ok": true}'
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


if __name__ == "__main__":
    init_database()
    server = ThreadingHTTPServer(("127.0.0.1", 5173), ChatProxyHandler)
    print("Serving Linguini on http://127.0.0.1:5173")
    print(f"Proxying /api/chat to {DEFAULT_TARGET} by default")
    print(f"Saving app state to {DB_FILE}")
    server.serve_forever()
