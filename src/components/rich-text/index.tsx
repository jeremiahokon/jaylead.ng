/**
 * Portable Text renderer for posts, estate bodies, FAQ answers and legal
 * copy. Internal links stay in-tab; external links open safely. Video blocks
 * resolve to the same tap-to-load facade as everywhere else.
 */
import Link from 'next/link';

import { PortableText, type PortableTextComponents } from '@portabletext/react';

import { Photo } from '@/components/photo';

import type { Img, RichText as RichTextValue } from '@/lib/types';
import { cn } from '@/lib/utils';

export function RichText({
  value,
  className,
  renderVideo,
}: {
  value: RichTextValue | undefined;
  className?: string;
  renderVideo?: (url: string) => React.ReactNode;
}) {
  if (!value?.length) return null;

  const components: PortableTextComponents = {
    marks: {
      link: ({ value: v, children }) => {
        const href = (v?.href as string) ?? '#';

        return href.startsWith('/') ? (
          <Link href={href}>{children}</Link>
        ) : (
          <a href={href} target="_blank" rel="noopener">
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value: v }) => (
        <Photo
          image={v as Img}
          sizes="(min-width: 768px) 680px, 100vw"
          showCaption
          className="my-8"
        />
      ),
      callout: ({ value: v }) => (
        <aside className="border-oil text-ink my-8 border-l pl-5 italic">
          {(v as { text: string }).text}
        </aside>
      ),
      videoRef: ({ value: v }) =>
        renderVideo ? (
          <div className="my-8 max-w-sm">
            {renderVideo((v as { url: string }).url)}
          </div>
        ) : null,
    },
  };

  return (
    <div className={cn('prose', className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
