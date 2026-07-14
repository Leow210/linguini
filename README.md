# Linguini

A local-first, AI-powered language-learning platform — structured lesson generation, an embedded tutor, role-play chat practice, and cross-device sync, built from scratch with no frontend framework.

**Live demo:** <https://linguini-16g.pages.dev> — try the sample lessons with zero setup, or add any LLM API key (or a local model) in the Models tab to generate your own.

---

## Why

Most language apps flatten everything to one level: grammar gets oversimplified, pronunciation becomes "sounds like...", and IPA, morphology, and glossing are off the table. Linguini was built to be the opposite — a maximally customizable AI learning tool that meets you where you are. A **teaching-style switch** runs every generation in either *linguistic* mode (IPA, morphological breakdowns, precise terminology for those with the background) or *plain* mode (no jargon, simple analogies for those without). Combined with free-form plan prompts, per-lesson refinement notes, editable everything, and swappable models per task, it produces real lesson plans that don't dumb down the content unless you ask them to.

## What it does

- **Plan generation** — one prompt (*"Advanced Korean for TOPIK II"*) becomes a 20–30 lesson curriculum with per-lesson grammar concepts and starter vocab.
- **Full lesson pages** — each lesson expands on demand into grammar sections with inline examples and translations, a vocabulary table with IPA, reference alphabet charts for phonetic lessons (Hangul, hiragana, Cyrillic...), and exercises marked by an AI checker.
- **Practice** — every lesson ships a role-play scenario that seeds a chat with a character bot; each user message is answered in character *and* run through a separate correction model.
- **Tutor** — a per-lesson Q&A chat embedded in the page.
- **Vocab bank** — every word from every lesson, aggregated, searchable, linked back to its source.
- **Multilingual UI** — English, 日本語, 繁體中文, 简体中文, 한국어, Español. The UI language also steers generation: explanations and corrections are written in it while the target language stays untouched.
- **Accounts & sync (optional)** — sign in to sync all state across web and Android; skip it and everything stays on-device.

## Bring your own model

Five independent LLM routes — plan outline, lesson body, quiz/scenario, role-play chat, error checking — each pointing at any provider: Claude, OpenAI, Gemini, DeepSeek, Kimi, OpenRouter, or a local LM Studio / Ollama instance. Heavy lifting can go to a strong model while per-message correction runs on something small and fast.

## Technical highlights

- **Zero-framework frontend.** Vanilla JS/HTML/CSS, no build step, no runtime dependencies. State → render functions → DOM, done by hand.
- **Whole backend in one stdlib file.** `server.py` (pure Python, no pip installs) serves the app, persists state, and proxies LLM calls so browser CORS never gets in the way.
- **Deliberately simple storage.** The entire app state is one JSON document in SQLite, with a human-readable JSON mirror that doubles as an automatic backup/restore path. Single-user app; a relational schema would buy nothing.
- **Hosted flavor.** The same frontend deploys as static files on Cloudflare Pages, with a single Pages Function replicating the LLM proxy.
- **Sync done small.** Supabase email auth + one row per user guarded by row-level security; last-write-wins with debounced pushes and pull-on-focus. No sync framework.
- **Provider abstraction in code, not a library.** OpenAI-compatible wire format by default, with in-code translation to Anthropic's Messages API (system promotion, auth-header style, response shape).
- **Resilient generation.** A tolerant JSON repair pass recovers truncated LLM output — partial-but-valid lessons instead of hard errors.
- **Prompt-enforced pedagogy.** A per-language script policy (native script vs. romanization by learner level) and a UI-language directive are injected into every prompt builder.
- **i18n at 310 keys × 6 locales**, dictionary-driven with scripted completeness checks.
- **Android.** A WebView wrapper bundles the same web files into an APK, with a small in-process Java HTTP server standing in for `server.py` (persistence via SharedPreferences, same LLM proxy contract).

## Run it locally

```sh
python3 server.py    # http://127.0.0.1:5173 — Python stdlib only, nothing to install
```

## Layout

```
├── index.html / styles.css / app.js   # the whole frontend (paper-notebook theme)
├── i18n.js                            # 6-locale dictionary + t()
├── samples.js                         # localized sample lessons (landing page)
├── sync.js                            # Supabase auth + cross-device sync
├── server.py                          # static + state + LLM proxy (stdlib)
├── functions/api/chat.js              # Cloudflare Pages Function: hosted proxy
├── deploy.sh                          # stage + deploy to Cloudflare Pages
└── android/                           # WebView wrapper + in-process Java server
```
