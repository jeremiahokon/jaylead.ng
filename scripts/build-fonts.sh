#!/usr/bin/env sh
# Rebuild the shipped woff2 files from the sources in src/fonts/.
#
# The cast (font study, 28 Sep 2026: Fraunces, Bespoke Slab, Zodiak, Bitter,
# Young Serif and Cabinet Grotesk set against the logo):
# - Bespoke Slab (Fontshare, ITF Free Font Licence) for display. Its heavy
#   slab italic shares the Jaylead wordmark's weight and ball terminals, and
#   the roman reads earthy and agricultural rather than corporate. Roman and
#   italic are pinned to 700 each, which keeps the drawn-in naira sign exact.
# - Lexend (OFL) for text: designed with reading-proficiency research to cut
#   visual crowding, open and wide at small sizes, with a plain zero (the
#   slashed zero in Atkinson Hyperlegible, also tested, turned every price
#   into noise). Weight 400 to 700.
#
# Three files. Neither family ships U+20A6, so scripts/add-naira.py strikes
# it from each face's own N.
#
# Requires: pip install fonttools brotli
set -eu
cd "$(dirname "$0")/.."

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

GLYPHS='U+0020-007E,U+00A0,U+00B7,U+00D7,U+2013,U+2018,U+2019,U+201C,U+201D,U+2026,U+20A6,U+2212'

python -m fontTools.varLib.instancer src/fonts/BespokeSlab-Variable.ttf wght=700 -o "$WORK/display.ttf" >/dev/null
python -m fontTools.varLib.instancer src/fonts/BespokeSlab-VariableItalic.ttf wght=700 -o "$WORK/display-italic.ttf" >/dev/null
python -m fontTools.varLib.instancer 'src/fonts/Lexend[wght].ttf' wght=400:700 -o "$WORK/text.ttf" >/dev/null

for f in display display-italic text; do python scripts/add-naira.py "$WORK/$f.ttf"; done

python -m fontTools.subset "$WORK/display.ttf" --output-file=src/fonts/bespoke-slab.woff2 \
  --flavor=woff2 --layout-features='kern,liga,lnum,pnum,tnum' --unicodes="$GLYPHS"
python -m fontTools.subset "$WORK/display-italic.ttf" --output-file=src/fonts/bespoke-slab-italic.woff2 \
  --flavor=woff2 --layout-features='kern,liga,lnum,pnum' --unicodes="$GLYPHS"
python -m fontTools.subset "$WORK/text.ttf" --output-file=src/fonts/lexend.woff2 \
  --flavor=woff2 --layout-features='kern,liga,tnum,case' --unicodes="$GLYPHS"

ls -l src/fonts/*.woff2
