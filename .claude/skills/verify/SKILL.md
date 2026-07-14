---
name: verify
description: Build/launch/drive recipe for verifying Linguini changes end-to-end
---

# Verifying Linguini

## Launch

```sh
python3 server.py          # serves http://127.0.0.1:5173 (static + /api/state + /api/chat)
```

No build step. The app is index.html + styles.css + app.js + i18n.js + sync.js, loaded as plain scripts.

## Drive (headless browser)

Playwright works well: `npm install playwright` in a scratch dir (browsers are cached in ~/Library/Caches/ms-playwright). Drive `http://127.0.0.1:5173`, screenshot, and use `page.evaluate` — app globals (`state`, `t`, `proxyEndpointFor`, prompt builders) are all reachable from the console.

## ⚠️ Gotchas — read before driving

- **`data/` is the user's REAL state.** server.py serves and persists `data/app-state.json` + `linguini.sqlite3`. A fresh headless profile has empty localStorage, so it hydrates the real server state, and every UI action **saves back to the user's real data**. Either point the server at a temp `data/` (copy the repo, or temporarily move `data/` aside), or scrupulously delete every artifact you create — by unique id, not by title (default titles like "Russian custom plan" can collide with the user's own plans).
- **Clicking any Generate button spends real API credits** if that route points at a paid provider (check the Models tab / `state.routes` first). The user's planner/lesson routes have pointed at DeepSeek with a live key.
- **The loading badge intercepts pointer events** while a generation is in flight — clicks near the bottom of the page will time out until it clears.
- LM Studio often listens on 127.0.0.1:1234, so "unreachable local model" probes may actually reach a live model.
- Auto-accepting `confirm()` dialogs will really delete things. Prefer `dialog.dismiss()` when you only need the dialog text.

## What to check after i18n-affecting changes

- Switch all 6 App-language values (en/ja/zh-Hant/zh-Hans/ko/es); `<html lang>` must follow; reload must persist.
- Missing dictionary keys render as the raw key (`x.y`) — easy to grep visually.
- Key-set completeness: every locale in i18n.js must have the exact key set of `I18N.en`; every `t("...")` in app.js and `data-i18n*` in index.html must resolve (script this with a node one-liner).
- `uiLanguageDirective()` must be `""` in en and must appear in every system prompt builder otherwise.
