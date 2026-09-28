#!/usr/bin/env bash
# Renders scripts/opengraph-image.html to the two 1200x630 share cards with
# the site's real fonts, through headless Chrome. Usage: pnpm og
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --allow-file-access-from-files --virtual-time-budget=4000 --window-size=1200,630 \
  --screenshot="$TMP/og.png" "file://$PWD/scripts/opengraph-image.html" >/dev/null 2>&1
magick "$TMP/og.png" -strip -quality 84 -sampling-factor 4:2:0 src/app/opengraph-image.jpg
cp src/app/opengraph-image.jpg src/app/twitter-image.jpg
rm -rf "$TMP"
ls -la src/app/opengraph-image.jpg src/app/twitter-image.jpg
