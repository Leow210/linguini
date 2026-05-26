# Linguini

A tangled little notebook for languages — a single-user, local-first language-learning app with structured lessons, an in-lesson tutor chat, role-play practice with character chatbots, and a global vocab bank. Runs as a web app on a local server, or as a packaged Android WebView.

Linguini routes its LLM calls to whichever models you configure. Bring your own keys (Claude, OpenAI, Gemini, DeepSeek, Kimi, OpenRouter) or run everything against a local LM Studio / Ollama instance — five separate routes let you mix and match.

---

## Run on web

```sh
python3 server.py
```

Open <http://127.0.0.1:5173>.

That's the whole setup. The server is pure Python stdlib (no `pip install` step) — it serves the static frontend, persists state to SQLite, and proxies LLM requests so browser CORS isn't a problem.

> **macOS Python from python.org users:** if outbound HTTPS to Claude/OpenAI fails with `502 Bad Gateway`, your Python doesn't have a CA bundle installed. server.py tries certifi as a fallback automatically. If it can't find any bundle, run `/Applications/Python\ 3.12/Install\ Certificates.command` once.

---

## Configure your models

Open the **Models** tab. There are five routes; each can point to a different provider:

| Route | Used by | Suggested setup |
| --- | --- | --- |
| **Plan outline** | New-plan generation (lesson titles + concepts) | Any small/fast model — output is tiny |
| **Lesson generation** | Full lesson body (sections, vocab, alphabet) | Your strongest model — this does the heavy lifting |
| **Quiz & scenario** | Exercises + practice scenario | Mid-tier or same as lesson |
| **Role-play chat** | Character chatbot + lesson tutor Q&A | Conversational model, can be local |
| **Error checking** | Answer/correction checking | Small fast model — runs after every chat message |

Each panel has a **Preset** dropdown that auto-fills endpoint and a sensible default model:

- **LM Studio** — `http://127.0.0.1:1234/v1/chat/completions`
- **OpenAI** — `https://api.openai.com/v1/chat/completions`
- **Anthropic Claude** — native `https://api.anthropic.com/v1/messages` (translation handled in code; no proxy needed)
- **OpenRouter** — `https://openrouter.ai/api/v1/chat/completions` (one key, every model)
- **Google Gemini** — `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`
- **DeepSeek** — `https://api.deepseek.com/v1/chat/completions`
- **Kimi / Moonshot** — `https://api.moonshot.ai/v1/chat/completions`

Each panel also has **Apply to all routes** — fill out one panel and clone it to the rest with one click. Hit **Save settings** when you're done.

---

## Plans & lessons

1. Pick a target language and skill level in the left sidebar.
2. Type a one-line plan prompt (e.g. *"Advanced Korean for TOPIK II Level 6"*) and hit **Generate plan**.
3. You get back a plan with 20–30 lesson outlines — each has a title, a grammar concept (the tag), a 2-3 sentence description, and a few starter words.

Click any lesson in the sidebar to open it. Lessons live in two modes:

**Study mode** is the reading view:

- **Stub view** (before expansion): description + starter vocab + a *Generate full lesson* button.
- **Expanded view** (after expansion):
  - A reference alphabet chart at the top if it's a phonetic / alphabet lesson (Hangul, hiragana, Cyrillic, etc.)
  - Multiple sections — each rule introduced with an inline example in the target language plus translation (no batched "examples" section at the end)
  - Vocabulary table with IPA, part of speech, example sentences
  - Exercises — each with a textarea where you type your answer and a **Check** button that runs the answer through the correction route. Returns a green "Nice." stamp or a coral "Not quite." with a friendly correction.
  - A purple **Practice scenario** card with a *Start role-play* button that jumps to a fresh chat seeded with the scenario.
  - An **Ask the tutor** panel — a chat embedded in the lesson, conversation persists per-lesson.

**Edit mode** lets you hand-tune any field: lesson title, grammar concept, description, sections, vocab rows, exercises.

### Generation flow

Lesson expansion runs in two LLM calls:

1. **Lesson body** (lesson route) — intro, sections, vocab, alphabet. Awaits, then renders so you can start reading.
2. **Exercises + scenario** (quiz/scenario route) — fires in the background; an italic *"Building exercises..."* placeholder sits where they'll go. When it returns, exercises appear and the scenario card slides in.

**Regenerate** does the same two phases (lesson route first, then quiz route) and replaces old exercises/scenario with fresh ones. You can optionally provide a refinement note (e.g. *"more focus on -seru/-saseru contrasts"*) that's appended to the prompt.

### Script policy

Linguini enforces a per-language script policy in every prompt:

- Latin-alphabet languages: no-op.
- Non-Latin scripts at **Absolute beginner / Beginner**: native script with brief romanization in parens on first encounter.
- Non-Latin scripts at **Lower intermediate or above**: native script only. **No romaji, no pinyin, no Jyutping, no Romanized Korean.** IPA still allowed in vocab/sound sections.
- Hints in exercises are suppressed at beginner levels (would make quizzes trivial).

---

## Vocab bank

The **Vocab** tab aggregates every vocab word from every lesson in every plan, grouped by language, searchable. Each row shows the word, IPA, translation, example, and a clickable link back to its source lesson.

- Click **+ Add word** to add a standalone vocab entry not tied to a lesson (language dropdown, term, translation, IPA, POS, example).
- Click **×** on any row to delete it (removes from its source lesson or from your saved-words list).

---

## Role-play practice

The **Role-play** tab is a multi-chat workspace. Each chat is its own session with its own language, character, scenario, scenario text, test focus, difficulty, and message history.

- The **chat tabs** bar sits above the practice setup. "+ New chat" creates a fresh session. Click any past chat to load it. "×" deletes (with confirm).
- **Practice this** on a lesson always creates a *new* chat with that lesson's language, the lesson's scenario (or a generated fallback), `testFocus = lesson.grammar`, and difficulty set from the plan level (Absolute beginner → A1, Lower intermediate → B1, etc.). Difficulty stays editable.
- Each user message runs two LLM calls: one to the character (chat route), one to the correction model (correction route). Corrections only appear if there's a real, useful error.

### Characters lab

The **Characters** tab is a small CRUD for character chatbots — name, role, personality, teaching style. Three friendly defaults ship: Mira (warm tutor), Ren (cafe role-play), Sana (grammar archivist). Add your own; switch the active character per-chat from the setup form.

---

## Storage

Linguini uses SQLite from Python's standard library — no `pip install`, no database service, no migrations.

- **`data/linguini.sqlite3`** — single-row key/value store. The entire app state (plans, lessons, vocab, savedWords, chats, characters, scenarios, model routes) is one JSON document under the `app_state` key.
- **`data/app-state.json`** — human-readable mirror, rewritten on every save. Grep this when you want to inspect or back up.
- **localStorage** — browser-side fallback if the server isn't running.

**Auto-restore on boot:** if `linguini.sqlite3` is missing or empty (e.g., disk loss, manual deletion), startup reads the JSON mirror back into the database. If both are gone, it falls back to a legacy `lumalingua.sqlite3` if one is still around. The mirror is the backup.

**Why one JSON blob?** The app is single-user and the data is small enough that a relational schema buys nothing. Backing up = `cp data/linguini.sqlite3 backup.sqlite3`.

---

## Android

The `android/` directory has a WebView wrapper that bundles the same HTML/CSS/JS into an APK. It includes a small in-process Java HTTP server (`StarlitLocalServer.java`) that handles state persistence (via SharedPreferences) and LLM proxying — the same `X-LLM-Auth-Style: anthropic` header is honoured, so Claude direct works on Android too.

Build the debug APK:

```sh
cd android
./build-apk.sh
```

Output:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

To connect Android to a local LM Studio on your laptop:

1. Put phone and computer on the same Wi-Fi.
2. Start LM Studio's OpenAI-compatible server with LAN access enabled.
3. Find your computer's LAN IP (`ifconfig | grep "inet "` on macOS).
4. In the Android app's Models tab, set the relevant route's endpoint to:
   ```
   http://YOUR-LAN-IP:1234/v1/chat/completions
   ```

For API providers (Claude/OpenAI/etc.), no LAN config needed — Android reaches them directly over HTTPS.

---

## Routes, providers, and the proxy

When you submit a generation request:

1. The frontend builds a JSON body — OpenAI Chat Completions format by default. If the configured endpoint is `api.anthropic.com`, the frontend translates: system messages get moved into a top-level `system` field, `max_tokens: 8192` is set (Anthropic requires it), and `temperature` defaults to `1.0` if unset.
2. The browser POSTs to `/api/chat?target=<endpoint>` with `X-LLM-API-Key` and `X-LLM-Auth-Style` headers.
3. `server.py` (or the Android local server) sees `X-LLM-Auth-Style: anthropic` and sends `x-api-key` + `anthropic-version` headers; otherwise it sends `Authorization: Bearer`.
4. Response is parsed accordingly — `content[0].text` for Anthropic, `choices[0].message.content` for OpenAI-compat.
5. The proxy also runs a tolerant JSON repair pass: if a generation truncates mid-lesson, the parser finds the last complete object and closes any open braces/arrays so you get partial-but-valid output rather than a hard error.

---

## Project layout

```
.
├── README.md
├── server.py              # Python HTTP server: static + state + LLM proxy
├── index.html             # Web app shell
├── styles.css             # Paper-notebook theme
├── app.js                 # All client logic — state, render, prompts
├── data/
│   ├── linguini.sqlite3   # Single-row state store
│   └── app-state.json     # Human-readable mirror
└── android/
    ├── build-apk.sh
    └── app/
        ├── build.gradle
        └── src/main/...   # WebView wrapper + Java local server
```

---

## What's it for, again?

You pick a language. Linguini drafts a multi-week plan. You open a lesson, the AI fleshes it out into a real teaching page with examples and a vocab table. You take a quiz, get marked. You ask the embedded tutor a question. You jump into a role-play with a character to use what you learned. Every word you see ends up in your vocab bank. Everything saves locally. No accounts, no cloud.
