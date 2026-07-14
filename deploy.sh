#!/usr/bin/env bash
# Deploy Linguini to Cloudflare Pages.
#
# One-time setup:
#   npx wrangler login
#   npx wrangler pages project create linguini
#
# Then every deploy is just:  ./deploy.sh
#
# Only the whitelisted web files are staged into dist/ — server.py, android/,
# and especially data/ (your saved state + API keys) never leave this machine.
# wrangler picks up the sibling functions/ directory (the /api/chat proxy)
# automatically because we deploy from the repo root.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf dist
mkdir dist
cp index.html styles.css app.js i18n.js sync.js dist/

npx wrangler pages deploy dist --project-name linguini
