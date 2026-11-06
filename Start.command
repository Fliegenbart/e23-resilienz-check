#!/bin/zsh
cd "$(dirname "$0")" || exit 1
if ! command -v npm >/dev/null 2>&1; then
  echo "Bitte Node.js ab 22.12 installieren. Siehe README.md."
  read -r "reply?Enter zum Schließen."
  exit 1
fi
if [[ ! -d node_modules ]]; then
  npm ci --no-audit --no-fund || exit 1
fi
npm run dev
