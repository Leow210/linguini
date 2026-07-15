# Linguini — Architecture

This document explains how the app is put together: the runtime targets, the frontend's rendering model, the LLM pipeline, the prompt system, and the i18n machinery. Its companion, [DATA-AND-SYNC.md](DATA-AND-SYNC.md), covers the state document, persistence tiers, and the Supabase sync protocol.

## The one-paragraph version

Linguini is a single-page app written in framework-free JavaScript (`app.js`, ~3,000 lines) with no build step. All application data lives in one JSON state document that is re-rendered wholesale after every mutation. LLM calls are described by five user-configurable *routes* and travel through whichever proxy the current runtime provides. The same five frontend files run unchanged in three environments: a stdlib-only Python dev server, Cloudflare Pages, and an Android WebView.

## Runtime targets

| | Static files | State persistence | LLM proxy |
|---|---|---|---|
| **Local** (`server.py`) | `SimpleHTTPRequestHandler` | `GET/POST /api/state` → SQLite + JSON mirror | `POST /api/chat?target=…` |
| **Hosted** (Cloudflare Pages) | Pages CDN | localStorage / Supabase only (no state server) | Pages Function `functions/api/chat.js` |
| **Android** (WebView wrapper) | bundled assets (`copyWebAssets` gradle task) | in-process Java server → SharedPreferences | same Java server, same header contract |

The frontend detects its environment with a single boolean: `HAS_STATE_SERVER = LOCAL_HOSTS.includes(window.location.hostname)`. Everything else adapts off that flag — there are no build-time configurations or environment files.

`server.py` is intentionally pure stdlib (`http.server`, `sqlite3`, `urllib`): cloning the repo and running `python3 server.py` is the entire setup. It serves the static files, persists state, and forwards LLM requests (translating the pseudo-auth headers described below). It also carries a certifi fallback for python.org macOS installs whose Python lacks a CA bundle.

## Frontend structure

### Files

```
index.html    static shell: sidebar, four workspace views, auth gate, top-action buttons
styles.css    paper-notebook theme; CSS custom properties in :root
app.js        all logic: state, normalizers, render functions, prompts, LLM calls, events
i18n.js       I18N dictionary (6 locales × 310 keys), t(), applyStaticTranslations()
samples.js    SAMPLE_PLANS_BY_LOCALE — view-only demo lessons per UI language
sync.js       LinguiniSync module: Supabase auth + pull/push (see companion doc)
```

Load order matters only in that `app.js` comes last; the others define globals (`I18N`, `t`, `SAMPLE_PLANS_BY_LOCALE`, `LinguiniSync`) that `app.js` consumes.

### The state → render loop

There is exactly one mutable application state object (`const state = loadState()`) plus a handful of session-only variables that deliberately do *not* persist:

- `activeView` — which workspace tab is showing
- `showLanding` / `sampleLessonPreview` — Home-button landing mode and view-only sample previews
- `authMode` — sign-in vs. register mode of the auth gate

The rendering model is "re-render everything from state": `render()` calls ten `renderX()` functions (plans list, plan editor, chat tabs, role-play setup, messages, characters, vocab bank, account panel, …), each of which rebuilds its DOM subtree with `replaceChildren()` and vanilla `document.createElement`. There is no virtual DOM and no diffing; the app is single-user and the DOM is small enough that full rebuilds are imperceptible. Event handlers follow one convention: **mutate `state` → `saveState()` → `render()`**.

DOM references are collected once at startup into the `els` map (`els.languageSelect`, `els.lessonStudyContainer`, …). Anything not in `els` is queried ad hoc.

### Boot sequence (`init()` at the bottom of app.js)

1. `bindEvents()` — all listeners, bound once (dynamic rows bind at render time).
2. `refreshLocale()` — set `<html lang>`, translate static DOM.
3. `hydrateStateFromServer()` — if `HAS_STATE_SERVER`, overlay `/api/state` onto the localStorage-loaded state.
4. If signed in: `LinguiniSync.pull()` and overlay the remote row (remote wins on boot).
5. `refreshLocale()` again (the overlay may have changed the UI language), then `render()`.
6. Show the auth gate if sync is configured, the user is signed out, and they haven't dismissed it before.

### Navigation

The four workspace views are plain `<section class="view">` elements toggled by `switchView()`. The landing page is not a separate view: it is the plans view rendering `buildOnboarding()` (getting-started steps + sample library) whenever no plan is selected or `showLanding` is set. The Home button, the brand mark, and the wordmark all call `goHome()`; selecting/creating/deleting a plan calls `leaveLanding()`. Sample lessons render through the normal lesson-study renderer but from a throwaway plan object that is never inserted into `state` (see the samples section of the companion doc).

## The LLM pipeline

### Five routes

`state.routes` holds five independent route configs — `planner`, `lesson`, `practice`, `chat`, `correction` — each `{ endpoint, model, apiKey }`. The Models tab edits them; presets fill endpoint + default model for LM Studio, OpenAI, Anthropic, OpenRouter, Gemini (OpenAI-compat endpoint), DeepSeek, Kimi, and Z.ai (GLM). The split exists so the expensive work (lesson bodies) can run on a strong model while high-frequency work (per-message correction) runs on something small or local.

### One entry point: `askRoute(kind, messages, temperature, maxTokens)`

Every LLM call in the app goes through this function. It does four jobs:

1. **Wire format.** Messages are built in OpenAI Chat Completions shape. If the route's endpoint matches `api.anthropic.com`, `askRoute` translates: system messages are concatenated into a top-level `system` field, remaining turns are mapped to user/assistant, `max_tokens` defaults to 8192 (required by the Messages API), and `temperature` defaults to 1.0.
2. **Auth style.** Proxied requests carry pseudo-headers — `X-LLM-API-Key` and `X-LLM-Auth-Style: anthropic|bearer` — which the proxy (server.py, the Pages Function, or the Android server) translates into real `x-api-key`/`anthropic-version` or `Authorization: Bearer` headers. Unproxied Anthropic calls go direct from the browser with `anthropic-dangerous-direct-browser-access: true`.
3. **Routing** via `proxyEndpointFor()` — see the table below.
4. **Response parsing.** Anthropic: concatenated `content[].text` blocks; OpenAI-compat: `choices[0].message.content`. Empty content raises a localized error naming the route, provider, host, and model, so a misconfigured route tells the user exactly which panel to fix.

### Proxy routing (`proxyEndpointFor`)

The interesting inversion is that *who proxies what* flips between environments:

| Environment | Local model (127.0.0.1:1234) | Remote provider |
|---|---|---|
| Local server / Android | proxied through `/api/chat` (off-origin) | proxied through `/api/chat` |
| Hosted (Pages) | **direct from the browser** — the Function cannot reach the user's machine; localhost is exempt from mixed-content blocking (LM Studio must enable CORS) | proxied through the Function (CORS) |

The Pages Function additionally refuses non-HTTPS and loopback targets, so it cannot be used as an open relay into someone's private network.

### JSON repair (`parseModelJson` → `repairTruncatedJson`)

Structured generations (plans, lesson bodies, exercises) ask the model for a JSON object. Parsing is defensive, in escalating steps: strip code fences → find the first `{` → `JSON.parse` → retry with trailing commas removed → **truncation repair**. The repair walks the text once, tracking string/escape state and brace depth, and records every position where a value closed; it then tries progressively earlier close positions, snipping the text there, removing dangling commas, and appending whatever closers are still on the stack, until a candidate parses. The effect: a lesson generation that ran out of tokens mid-vocab-table yields the sections that did complete instead of a hard failure. Everything that comes back then passes through the normalizers (`normalizeLesson` etc. — see companion doc), so missing fields become defaults rather than crashes.

## Generation flows

**Plan generation** (planner route): one call returning `{title, focus, lessons[]}` where each lesson is a stub — title, grammar concept, description, starter vocab. Stubs render with a *Generate full lesson* button.

**Lesson expansion** (`expandLesson`) is two sequential calls by design, because the routes may point at different models:

1. **Lesson route** — intro, sections, vocab, alphabet. Awaited, then rendered, so the user can start reading immediately.
2. **Practice route** — exercises + role-play scenario, fired in the background while an italic "Building exercises…" placeholder holds the spot. On return, exercises appear and the scenario card renders.

**Regenerate** (`regenerateLesson`) runs the same two phases against the existing lesson — wipe-and-replace lesson body first, then wipe exercises/scenario and refresh them via the practice route — optionally steered by a user-supplied refinement note appended to the prompt. If the practice route fails (e.g. unconfigured endpoint), the failure is logged, not swallowed, so the user learns which route needs attention.

**Role-play chat**: each user message triggers *two* calls — the chat route replies in character; the correction route checks the learner's message and must answer exactly `No correction needed.` (matched in code) when there's nothing worth flagging, so trivial nitpicks don't clutter the chat. The tutor panel embedded in each lesson is the chat route with a lesson-specific system prompt and per-lesson persisted Q&A history.

## The prompt system

Every system prompt is assembled from composable policy fragments:

- **`scriptPolicy(language, level)`** — the pedagogically load-bearing one. Latin-script languages: no-op. Non-Latin script at beginner levels: native script with brief romanization in parentheses on first encounter only. Lower-intermediate and above: native script *only*, with per-language reinforcement (no romaji; no pinyin/Jyutping in body text — allowed only in the IPA column of vocab tables; Hangul only; Cyrillic only; RTL scripts native only). IPA stays allowed for pronunciation teaching.
- **`pedagogyPolicy(style)`** — the "linguistic" (IPA, morphology, glossing terminology) vs. "plain" (no jargon, analogies) switch, threaded through every generation.
- **`uiLanguageDirective()`** — empty string for English UIs; otherwise instructs the model to write explanations, instructions, translations, and feedback in the UI language while keeping the target language and the JSON wire format untouched. Appended to every prompt builder (plan, lesson, practice, tutor, chat, correction).
- Exercise **hints are suppressed at beginner levels**, where they would trivially give the answer away.

## i18n

`i18n.js` holds a flat dictionary per locale (`I18N.en`, `I18N.ja`, `I18N["zh-Hant"]`, `I18N["zh-Hans"]`, `I18N.ko`, `I18N.es`), 310 keys each. `t(key, params)` does locale → English → raw-key fallback with `{param}` interpolation. Static DOM is tagged with `data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-title`, and `data-i18n-aria-label`; `applyStaticTranslations()` sweeps all five on locale change. Dynamic DOM built in render functions calls `t()` directly, so a locale switch is just `refreshLocale()` + `render()`.

Two conventions keep stored data and display separate:

- **Language names**: stored values (plan.language, prompts) are always the English names in `LANGUAGES`; `languageLabel(name)` looks up `lang.<English name>` for display and falls back to the English name. The target-language dropdown also drops the current UI language from the list (`UI_TARGET_EXCLUDE`), keeping the current selection if it would otherwise vanish.
- **Shipped defaults** (characters Mira/Ren/Sana, the default scenarios): `defaultText()` translates a field at display time *only while the stored value still equals the shipped English text* — the moment a user edits a default, their edit wins everywhere.

The invariant that keeps this maintainable: every locale must have exactly the key set of `I18N.en`, and every `t("…")` literal, `data-i18n*` attribute, and dynamically-built key family must resolve. Both checks are scripted (see `.claude/skills/verify/SKILL.md`) and run before shipping i18n-affecting changes.

## The auth gate

A full-screen overlay (`#authGate`) with sign-in/register modes over `LinguiniSync`. It appears on boot only when all three hold: sync is configured, no session exists, and the user has never dismissed it (`linguini-auth-gate-seen-v1` in localStorage). "Continue without an account" preserves the local-first contract — nothing about the app requires an account. The person button in the top-action cluster reopens the gate when signed out and jumps to the Models-tab account panel when signed in. Both the gate and the panel funnel through one `performAuth(mode, email, password)` which also handles the first-login merge (companion doc).

## UI shell details worth knowing

- The top-action cluster (Home / globe / account) is `position: fixed` top-right on desktop, with `.workspace-header { padding-right }` reserving space beneath it and the loading badge moved below it. Under 980px it becomes `position: absolute` inside the padded brand row, so it scrolls away with the page and can never cover content on phones.
- The globe menu is pure CSS (`:hover` / `:focus-within` on `.ui-lang`), with an invisible `::before` bridge covering the gap between button and menu so the pointer can cross without collapsing it. Option clicks `blur()` so touch/keyboard users collapse it too.
- The loading badge intercepts pointer events while a generation is in flight — by design, as a soft mutex on the bottom of the page.
