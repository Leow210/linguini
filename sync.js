"use strict";

/* -------------------- Supabase account sync --------------------
 * Cross-device sync: one row per user in public.app_state holding the whole
 * app-state JSON, protected by row-level security. See README ("Accounts &
 * sync") for the one-time Supabase project setup and the SQL to paste.
 *
 * Fill these two constants in from your Supabase project's Settings → API.
 * Both are safe to commit and ship publicly — the anon key only grants what
 * row-level security allows, i.e. each signed-in user sees their own row.
 */
const SUPABASE_URL = "";      // e.g. "https://abcdefgh.supabase.co"
const SUPABASE_ANON_KEY = ""; // the long "anon / public" key

const SYNC_SESSION_KEY = "linguini-session-v1";

const LinguiniSync = (() => {
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem(SYNC_SESSION_KEY) || "null");
  } catch {
    session = null;
  }
  let lastSyncedAt = null; // updated_at of the last row we saw or wrote
  let lastPullAt = 0;      // ms timestamp of the last pull attempt
  let pushTimer = null;

  const isConfigured = () => !!(SUPABASE_URL && SUPABASE_ANON_KEY);

  function saveSession(next) {
    session = next;
    if (next) localStorage.setItem(SYNC_SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SYNC_SESSION_KEY);
  }

  function sbFetch(path, options = {}) {
    return fetch(SUPABASE_URL + path, {
      ...options,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
  }

  function normalizeSession(data) {
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
      user: { id: data.user?.id || session?.user?.id, email: data.user?.email || session?.user?.email }
    };
  }

  async function authRequest(path, body) {
    const response = await sbFetch(path, { method: "POST", body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error_description || data.msg || data.message || `Auth error ${response.status}`);
    }
    return data;
  }

  async function signUp(email, password) {
    const data = await authRequest("/auth/v1/signup", { email, password });
    // With "Confirm email" disabled, signup returns a full session.
    if (data.access_token) saveSession(normalizeSession(data));
    return !!data.access_token;
  }

  async function signIn(email, password) {
    const data = await authRequest("/auth/v1/token?grant_type=password", { email, password });
    saveSession(normalizeSession(data));
  }

  async function signOut() {
    if (session) {
      sbFetch("/auth/v1/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` }
      }).catch(() => {});
    }
    saveSession(null);
    lastSyncedAt = null;
  }

  async function token() {
    if (!session || !isConfigured()) return null;
    if (session.expires_at - 60 > Date.now() / 1000) return session.access_token;
    try {
      const data = await authRequest("/auth/v1/token?grant_type=refresh_token", {
        refresh_token: session.refresh_token
      });
      saveSession(normalizeSession(data));
      return session.access_token;
    } catch {
      // Stale/revoked session: fall back to signed-out (localStorage keeps working)
      saveSession(null);
      return null;
    }
  }

  async function pull() {
    const accessToken = await token();
    if (!accessToken) return null;
    lastPullAt = Date.now();
    const response = await sbFetch(
      `/rest/v1/app_state?select=state,updated_at&user_id=eq.${session.user.id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) return null;
    const rows = await response.json();
    const row = rows[0] || null;
    if (row) lastSyncedAt = row.updated_at;
    return row;
  }

  async function push(stateDoc) {
    const accessToken = await token();
    if (!accessToken) return;
    const updatedAt = new Date().toISOString();
    const response = await sbFetch("/rest/v1/app_state", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Prefer: "resolution=merge-duplicates"
      },
      body: JSON.stringify({ user_id: session.user.id, state: stateDoc, updated_at: updatedAt })
    });
    if (response.ok) lastSyncedAt = updatedAt;
  }

  function schedulePush(stateDoc) {
    if (!session) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(stateDoc).catch(() => {}), 1500);
  }

  function flushPush(stateDoc) {
    if (!session) return;
    clearTimeout(pushTimer);
    push(stateDoc).catch(() => {});
  }

  return {
    isConfigured,
    isSignedIn: () => !!session,
    userEmail: () => session?.user?.email || "",
    lastSyncedAt: () => lastSyncedAt,
    lastPullAt: () => lastPullAt,
    signUp,
    signIn,
    signOut,
    pull,
    push,
    schedulePush,
    flushPush
  };
})();
