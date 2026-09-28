/**
 * Sanity CDN URLs with the editor's hotspot as the crop focus and
 * auto=format (AVIF/WebP negotiated by the CDN). Used by the Photo component
 * for Studio images; local seed images go through next/image instead.
 */
import type { Img } from '@/lib/types';

export const isSanityImage = (src: string) =>
  src.startsWith('https://cdn.sanity.io/');

export function sanityUrl(
  img: Pick<Img, 'src' | 'hotspot'>,
  width: number,
  aspect?: number
): string {
  const url = new URL(img.src);

  url.searchParams.set('w', String(width));
  url.searchParams.set('q', '72');
  url.searchParams.set('auto', 'format');

  if (aspect) {
    url.searchParams.set('h', String(Math.round(width / aspect)));
    url.searchParams.set('fit', 'crop');

    if (img.hotspot) {
      url.searchParams.set('crop', 'focalpoint');
      url.searchParams.set('fp-x', img.hotspot.x.toFixed(3));
      url.searchParams.set('fp-y', img.hotspot.y.toFixed(3));
    }
  } else {
    url.searchParams.set('fit', 'max');
  }

  return url.toString();
}

export function sanitySrcSet(
  img: Pick<Img, 'src' | 'hotspot' | 'width'>,
  aspect?: number
): string {
  return [480, 720, 960, 1440]
    .filter((w) => w <= img.width * 1.1)
    .map((w) => `${sanityUrl(img, w, aspect)} ${w}w`)
    .join(', ');
}
