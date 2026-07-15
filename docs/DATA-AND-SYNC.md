# Linguini — Data model, persistence, and sync

Companion to [ARCHITECTURE.md](ARCHITECTURE.md). This document covers the shape of the state document, the normalization layer, the three persistence tiers, and the Supabase account-sync protocol.

## Design position

Linguini is a single-user app whose entire dataset — a few plans, a few hundred vocab words, some chats — fits comfortably in a few hundred kilobytes. So the data model is deliberately primitive: **one JSON document** holds everything, every store persists that whole document, and "sync" means copying the document around with last-write-wins. No schema migrations, no per-entity endpoints, no operational transforms. The cost (rewriting a few hundred KB on save) is invisible at this scale; the benefit is that every persistence question has the same one-sentence answer.

## The state document

```
state = {
  language, level, pedagogyStyle, uiLanguage,     // current selections
  currentPlanId, currentLessonId, currentLessonMode,
  currentCharacterId, currentChatId,
  plans: [ Plan ],
  savedWords: [ SavedWord ],                      // vocab added outside lessons
  chats: [ Chat ],
  characters: [ Character ],                      // merged over shipped defaults
  scenarios: [ Scenario ],                        //   "        "        "
  routes: { planner, lesson, practice, chat, correction },  // each {endpoint, model, apiKey}
  providerProfiles: { ... }                       // per-provider remembered endpoint/model/key
}

Plan     = { id, title, language, level, focus, notes, lessons: [Lesson] }
Lesson   = { id, title, grammar, description, intro, sections: [{id, heading, body}],
             alphabet: [{id, character, ipa, name, romanization, note, group}],
             vocab: [{id, term, translation, ipa, pos, example, notes}],
             exercises: [{id, kind, prompt, answer, hint, userAnswer, feedback}],
             scenario: {title, details} | null,
             qa: [...],                            // per-lesson tutor chat history
             expanded: bool }                      // stub vs. full teaching page
Chat     = { id, title, language, characterId, scenarioId, scenarioText,
             difficulty, testFocus, messages: [...] }
```

Notes on the shape:

- `language` values are always the **English names** from the `LANGUAGES` list; they feed prompts directly. Localization happens only at display time (`languageLabel`).
- `exercises[].feedback` stores the correction model's verdict `{ok, text}` next to the learner's `userAnswer`, so marked quizzes survive reloads.
- `characters` and `scenarios` are seeded by `mergeById(defaults, saved)` on every load: shipped defaults appear even in old saves, user edits (matched by id) win over defaults, and user-created entries pass through untouched.
- `routes[].apiKey` means **API keys live inside the state document**. This is a deliberate trade-off — see the security section.

### Normalization

Nothing enters `state` raw. `loadState()` runs every persisted or remote document through `withDefaults()`, and every entity has a normalizer (`normalizePlan`, `normalizeLesson`, `normalizeSection`, `normalizeAlphabetEntry`, `normalizeVocab`, `normalizeExercise`, `normalizeChat`, …) that fills missing fields with defaults, generates ids (`cryptoId(prefix)` → `prefix-timestamp-random`), and coerces shapes. The same normalizers process LLM output, so a model that omits `hint` or returns `concept` instead of `grammar` (`migrateLegacyLesson` handles old field names) still yields a valid lesson. This is what makes "one JSON blob, no migrations" safe in practice: the normalizers *are* the migration layer, applied idempotently on every read.

## Persistence tiers

`saveState()` writes to all applicable tiers on every mutation:

```
saveState()
 ├─ localStorage[STORAGE_KEY] = JSON(state)          // always, synchronously
 ├─ POST /api/state                                  // only when HAS_STATE_SERVER
 └─ LinguiniSync.schedulePush(state)                 // only when signed in (1.5s debounce)
```

### Tier 1 — localStorage

Always written, always the boot baseline. On the hosted site (no state server), it *is* local persistence.

### Tier 2 — the local state server (`server.py`)

`GET/POST /api/state` reads/writes a **single-row key/value SQLite store** (`data/linguini.sqlite3`, one JSON document under the `app_state` key) and rewrites a human-readable mirror `data/app-state.json` on every save. The mirror is greppable, diffable, and doubles as the backup: on boot, if the SQLite file is missing or effectively empty (`_has_real_state` checks for actual content, not just a row), `_boot_restore_from_backup()` restores from the JSON mirror, falling back to a legacy `lumalingua.sqlite3` if one is still around. Backup strategy: `cp data/linguini.sqlite3 somewhere-safe`.

Boot hydration order matters and is deterministic:

1. `loadState()` from localStorage (synchronous, before first render).
2. `hydrateStateFromServer()` overlays `/api/state` if it has real content — so on localhost the server copy beats a stale browser profile (a fresh incognito window sees your data).
3. If signed in, `LinguiniSync.pull()` overlays the cloud row — remote wins on boot.

Each overlay goes through `withDefaults()` and re-derives the session variables (`activeLessonId` etc.) from the incoming document.

### Tier 3 — Supabase (accounts + cross-device sync)

See the next section.

## Supabase sync (`sync.js`, ~160 lines)

The entire backend is **one table** guarded by row-level security — there are no server functions, no triggers, no edge workers:

```sql
create table public.app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.app_state enable row level security;
create policy "Users manage own state" on public.app_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

`sync.js` talks to Supabase's REST surfaces directly with `fetch` — no SDK. The publishable (anon) key ships in the file and is safe to commit: it grants only what RLS allows, i.e. each authenticated user can read and write exactly their own row, and anonymous requests see nothing (verified: an anon `select` returns `[]`).

### Auth

- Email/password against `/auth/v1/signup` and `/auth/v1/token?grant_type=password`. The project has email confirmation disabled, so signup returns a session immediately (`signUp` falls back to `signIn` if a session isn't returned).
- The session (`access_token`, `refresh_token`, `expires_at`, user id/email) is stored in localStorage under `linguini-session-v1`.
- `token()` returns the access token, transparently refreshing via `grant_type=refresh_token` when within 60s of expiry. A failed refresh (revoked/stale session) degrades gracefully to signed-out — localStorage keeps working, nothing is lost.

### Protocol: last write wins, whole document

- **Push**: `POST /rest/v1/app_state` with `Prefer: resolution=merge-duplicates` (an upsert on the `user_id` PK) carrying `{user_id, state, updated_at: now}`. Saves are debounced ~1.5 s (`schedulePush`), so a burst of edits becomes one write; `flushPush` fires immediately when the tab goes hidden.
- **Pull**: `GET /rest/v1/app_state?select=state,updated_at&user_id=eq.<id>`. The caller compares `updated_at` against the last value seen (`lastSyncedAt`) and only applies + re-renders when the row actually changed.
- **Pull triggers**: boot, successful sign-in, and `visibilitychange` → visible when the last pull is more than 60 s old. There is no realtime channel — for a single human switching devices, pull-on-focus is indistinguishable from live sync and costs nothing.
- **First-login merge** (`performAuth`): after auth, pull once. If a cloud row exists, it wins (the device is treated as new); if none exists, the device's local state is pushed up as the initial copy. This is the only "conflict policy" beyond last-write-wins, and it runs exactly once per sign-in.

### What syncs

Everything in the state document — plans, lessons, vocab, chats, characters, scenarios, **and the model routes including API keys**. Syncing keys is what makes a second device work instantly after sign-in (your phone gets your routes without re-entering keys). The trade-off is explicit: your keys live in your Supabase row, protected by your account password and RLS. Users who don't want that can simply not sign in — signed out, keys never leave the device.

### Security posture, summarized

- The anon key is public by design; RLS is the actual boundary (`for all using/with check auth.uid() = user_id`).
- `data/` (SQLite + mirror, containing keys) is gitignored and excluded from the deploy staging dir; `deploy.sh` copies an explicit whitelist of web files only.
- The hosted LLM proxy forwards user-supplied keys per-request and stores nothing; it also rejects non-HTTPS and loopback targets so it can't be aimed at internal networks.
- Passwords are never stored by the app; only Supabase's tokens are.

## Sample lessons are not data

The landing page's sample library (`samples.js`, `SAMPLE_PLANS_BY_LOCALE`) renders through the normal lesson renderer but is **deliberately kept out of every persistence tier**. `openSampleLesson()` builds a throwaway plan via `normalizePlan()` and parks it in the session variable `sampleLessonPreview`; `renderPlanEditor()` prefers that preview over `currentPlan()`. Nothing is pushed into `state.plans`, `saveState()` is not called, and consequently nothing reaches localStorage, `/api/state`, or Supabase — verified in the browser test suite by driving previews across all six locales and asserting zero persisted plans. The preview object is normalized once per open (not per render) so exercise feedback earned inside a preview survives re-renders for the duration of the session, then evaporates.

Samples are also per-locale content, not translated chrome: each UI language has its own three fully-written lessons, and the lesson that would teach the UI's own language is replaced by an English one (ja/ko/es UIs get an English café lesson).

## Android persistence

The WebView wrapper ships the same web files (bundled by the `copyWebAssets` gradle task) and runs a small in-process Java HTTP server that impersonates `server.py`: same `/api/state` contract (backed by SharedPreferences instead of SQLite) and same `/api/chat` proxy honoring `X-LLM-Auth-Style`. Because the WebView origin is a localhost URL, `HAS_STATE_SERVER` is true and the frontend behaves exactly as it does against the Python server — the frontend cannot tell the difference, which is the point.

## Failure modes and how they're absorbed

| Failure | Behavior |
|---|---|
| State server down / hosted site | `hydrateStateFromServer` no-ops; localStorage is authoritative |
| Supabase unreachable at boot | pull is caught and ignored; local state stands |
| Access token expired | silent refresh; failed refresh degrades to signed-out |
| Push fails (offline) | caught and dropped; the next save re-schedules a full-document push, so nothing is ever partially synced |
| SQLite file deleted | boot restore from `app-state.json` mirror, then legacy DB |
| LLM returns truncated JSON | client-side repair recovers the complete prefix (see ARCHITECTURE.md) |
| LLM omits fields / legacy shapes | normalizers fill defaults; `migrateLegacyLesson` maps old field names |
