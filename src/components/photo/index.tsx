/**
 * Every image on the site. Local seed images go through next/image (AVIF/WebP
 * ladder, blur placeholder); Sanity images use the Sanity CDN with the
 * editor's hotspot. Stock or AI images (isRealSitePhoto false) are always
 * captioned "Illustration" so they are never passed off as the real estate.
 */
import Image from 'next/image';

import type { Img } from '@/lib/types';
import { cn } from '@/lib/utils';

import { isSanityImage, sanitySrcSet, sanityUrl } from '@/sanity/image';

type Props = {
  image: Img;
  sizes: string;
  /** width / height of the frame; the image covers it. */
  aspect?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Show the caption line under the image (illustration label always shows). */
  showCaption?: boolean;
  captionClassName?: string;
};

export function Photo({
  image,
  sizes,
  aspect,
  priority,
  className,
  imgClassName,
  showCaption,
  captionClassName,
}: Props) {
  const illustration = image.isRealSitePhoto === false;
  const caption = showCaption ? image.caption : undefined;
  const label = illustration ? (caption ?? 'Illustration') : caption;
  const ratio = aspect ?? image.width / image.height;

  return (
    <figure className={cn('relative', className)}>
      <div
        className="bg-bone-deep relative overflow-hidden"
        style={{ aspectRatio: String(ratio) }}
      >
        {isSanityImage(image.src) ? (
          <img
            src={sanityUrl(image, 960, aspect)}
            srcSet={sanitySrcSet(image, aspect)}
            sizes={sizes}
            alt={image.alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              imgClassName
            )}
          />
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={image.lqip ? 'blur' : 'empty'}
            blurDataURL={image.lqip}
            className={cn('object-cover', imgClassName)}
          />
        )}
        {illustration && !showCaption ? (
          <span className="micro text-bone bg-ink/55 absolute bottom-3 left-3 px-2 py-1 !text-[0.625rem] backdrop-blur-sm">
            Illustration
          </span>
        ) : null}
      </div>
      {label && showCaption ? (
        <figcaption className={cn('micro mt-3 opacity-70', captionClassName)}>
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
