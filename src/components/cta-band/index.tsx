/**
 * The closing statement on every page: forest ink, a headline set very
 * large, and the page's CTAs (rendered on the server).
 */
import type { ReactNode } from 'react';

import { ReplyNote } from '@/components/whatsapp-cta';

import { cn } from '@/lib/utils';

export function CtaBand({
  title,
  lede,
  children,
  className,
}: {
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn('on-ink bg-ink text-bone grain overflow-hidden', className)}
    >
      <div className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
        <h2 data-motion="lines" className="font-display text-hero max-w-[12ch]">
          {title}
        </h2>
        {lede ? (
          <p className="text-lede text-sand measure mt-8">{lede}</p>
        ) : null}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {children}
        </div>
        <ReplyNote className="text-sand mt-5" />
      </div>
    </section>
  );
}
