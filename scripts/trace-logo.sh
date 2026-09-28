#!/usr/bin/env bash
# Traces the Jaylead logo from the JPEG lockup into crisp SVGs, one potrace
# pass per brand colour. Temporary until the client supplies vector files.
#
#   public/brand/jaylead-logo.svg        mark + wordmark (header)
#   public/brand/jaylead-logo-light.svg  the same for dark surfaces (footer)
#   scripts/brand/jaylead-mark.svg       mark only (source for the icons)
#
# The crop keeps a margin on every side so no letter is clipped, and the
# "Agriestate Limited" subline is erased with a box that starts right of the
# y's tail and below the wordmark baseline, so the J hook and y tail survive.
#
# Usage: bash scripts/trace-logo.sh   (needs ImageMagick and potrace)
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=jaylead_ng/site-assets/brand/logo-lockup-tagline.jpg
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Lockup region at 4x: 830x250 px of the source, starting at (185, 325).
magick "$SRC" -crop 830x250+185+325 +repage -resize 400% "$TMP/full.png"
W=3320; H=1000
# Subline: x >= 500, y >= 180 in crop pixels, so x >= 2000, y >= 720 at 4x.
magick "$TMP/full.png" -fill white -draw "rectangle 2000,720 $W,$H" "$TMP/nosub.png"

layer() { # in out-svg source-hex out-hex fuzz
  magick "$1" -fuzz "$5%" -fill black -opaque "#$3" -fill white +opaque black -statistic Median 5x5 "$TMP/l.pbm"
  potrace "$TMP/l.pbm" -s -t 60 -O 0.5 --flat -C "#$4" -o "$2"
}
group() { python3 -c "import re,sys; print(re.search(r'<g.*?</g>', open(sys.argv[1]).read(), re.S).group(0))" "$1"; }

build() { # in out viewbox [light]
  local in=$1 out=$2 vb=$3 light=${4:-}
  layer "$in" "$TMP/gold.svg" FFCA32 FDCB32 9
  layer "$in" "$TMP/sun.svg" FF8C2F FF8F33 9
  layer "$in" "$TMP/leaf.svg" 04AC4C 12AA56 10
  local parts
  parts="$(group "$TMP/gold.svg")$(group "$TMP/sun.svg")$(group "$TMP/leaf.svg")"
  if [ -n "$light" ]; then
    # The mark keeps its green; the wordmark turns bone. Split at x = 1000.
    magick "$in" -fill white -draw "rectangle 1000,0 $W,$H" "$TMP/markonly.png"
    magick "$in" -fill white -draw "rectangle 0,0 1000,$H" "$TMP/wordonly.png"
    layer "$TMP/markonly.png" "$TMP/pm.svg" 006847 046647 10
    layer "$TMP/wordonly.png" "$TMP/pw.svg" 006847 F1ECDF 10
    parts="<circle cx=\"513\" cy=\"503\" r=\"434\" fill=\"#F1ECDF\"/>$parts$(group "$TMP/pm.svg")$(group "$TMP/pw.svg")"
  else
    layer "$in" "$TMP/palm.svg" 006847 046647 10
    parts="$parts$(group "$TMP/palm.svg")"
  fi
  printf '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s">%s</svg>\n' "$vb" "$parts" > "$out"
}

build "$TMP/nosub.png" public/brand/jaylead-logo.svg "0 0 $W $H"
build "$TMP/nosub.png" public/brand/jaylead-logo-light.svg "0 0 $W $H" light
magick "$TMP/full.png" -crop 980x${H}+0+0 +repage "$TMP/mark.png"
build "$TMP/mark.png" scripts/brand/jaylead-mark.svg "0 0 980 $H"
ls -l public/brand/*.svg scripts/brand/*.svg
