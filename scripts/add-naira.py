"""Draw a naira sign (U+20A6) into a font that ships without one.

Boska and General Sans both stop at the euro in the currency block. This
site is a Nigerian price list, so every price needs a naira glyph in the same
face; falling back to a system font for one character next to Boska figures
is visible and cheap to avoid. (Carried over from the Tribes build.)

The glyph is the font's own 'N' with two horizontal bars struck through it,
which is what the naira sign is. Bar thickness is derived from the N's own
stem so it belongs to the face rather than being an arbitrary hairline.

In the variable font the glyph carries no gvar deltas, so it renders at the
default master (wght 400) at every weight. Prices are set at one weight, and a
20-unit stem difference at 17px is not visible. If the design ever sets naira
at 600, revisit this.

Usage: python scripts/add-naira.py <font.ttf>
"""

import sys

from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont


def bar_width(coords, cap):
    """How thick the struck-through bars should be.

    The N's own stem is the right reference, but a serifed N's leftmost points
    are the serif bracket, which measures a few units wide and would give a
    hairline. Cap height is the reliable floor: currency bars sit around 5.5% of
    it across most faces, and Marcellus at 2048 upm needs that scaling as much
    as DM Sans at 1000 does.
    """
    xs = sorted({x for x, _ in coords})
    stem = xs[1] - xs[0] if len(xs) > 1 else 0

    return round(max(stem * 0.62, cap * 0.055))


def main(path):
    font = TTFont(path)
    glyf, hmtx, cmap_best = font['glyf'], font['hmtx'], font.getBestCmap()

    # gvar decompiles against the glyph count, so it has to be read before the
    # new glyph exists or it asserts on the mismatch.
    gvar = font['gvar'] if 'gvar' in font else None

    n_name = cmap_best[ord('N')]
    n_glyph = glyf[n_name]
    coords = [(p[0], p[1]) for p in n_glyph.coordinates]

    xmin, xmax = n_glyph.xMin, n_glyph.xMax
    ymin, ymax = n_glyph.yMin, n_glyph.yMax
    cap = ymax - ymin
    bar = bar_width(coords, cap)

    # Bars sit either side of the optical centre, clear of the cap line and
    # baseline so the N still reads as an N.
    lower = ymin + round(cap * 0.33)
    upper = ymin + round(cap * 0.57)
    overhang = round((xmax - xmin) * 0.06)
    left, right = xmin - overhang, xmax + overhang

    pen = TTGlyphPen(None)
    n_glyph.draw(pen, glyf)
    # Clockwise, like TrueType outer contours: a counter-clockwise bar would
    # knock holes where it crosses the N's strokes.
    for y in (lower, upper):
        pen.moveTo((left, y))
        pen.lineTo((left, y + bar))
        pen.lineTo((right, y + bar))
        pen.lineTo((right, y))
        pen.closePath()

    # glyf.__setitem__ appends to the shared glyph order for us.
    glyf['naira'] = pen.glyph()
    glyf['naira'].recalcBounds(glyf)
    hmtx['naira'] = hmtx[n_name]

    if gvar is not None:
        # No deltas: the glyph renders at the default master at every weight.
        gvar.variations['naira'] = []

    # HVAR has no row for the new glyph and would break subsetting; without
    # it, browsers take advances from gvar's phantom points instead.
    if 'HVAR' in font:
        del font['HVAR']

    for table in font['cmap'].tables:
        if table.isUnicode():
            table.cmap[0x20A6] = 'naira'

    font.save(path)
    print(f'{path}: naira added from {n_name} (bar {bar}u, cap {cap}u)')


if __name__ == '__main__':
    main(sys.argv[1])
