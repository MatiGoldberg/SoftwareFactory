#!/usr/bin/env bash
# Builds published/agentic-pdlc.pdf from document/ (sections + diagrams).
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d node_modules ]; then
  npm install
  npx playwright install chromium
fi
npm run build
