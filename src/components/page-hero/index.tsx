/**
 * Inner-page opener: breadcrumb, a numbered micro-caps line, a large Boska
 * headline that rises word by word on load (CSS only), an optional lede and
 * CTA row. Pass `title` as parts so one phrase can take the sun italic.
 */
import type { ReactNode } from 'react';

import { Breadcrumb } from '@/components/breadcrumb';
import { SplitWords } from '@/components/split-words';

import type { Crumb } from '@/lib/jsonld';
import { cn } from '@/lib/utils';

type Part = { text: string; className?: string; breakAfter?: boolean };

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  children,
  tone = 'light',
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: Part[];
  lede?: ReactNode;
  children?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <section
      className={cn(
        tone === 'dark' ? 'on-ink bg-ink text-bone grain' : '',
        className
      )}
    >
      <div className="mx-auto max-w-[96rem] px-(--gutter) pt-10 pb-20 md:pt-14 md:pb-28">
        <Breadcrumb crumbs={crumbs} />
        {eyebrow ? (
          <p
            className="micro load-fade mt-16 opacity-80 md:mt-24"
            style={{ '--i': 0 } as React.CSSProperties}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            'font-display text-hero max-w-[20ch]',
            eyebrow ? 'mt-6' : 'mt-16 md:mt-24'
          )}
        >
          <SplitWords parts={title} />
        </h1>
        {lede ? (
          <div
            className="text-lede measure load-fade mt-10 opacity-85"
            style={{ '--i': 2 } as React.CSSProperties}
          >
            {lede}
          </div>
        ) : null}
        {children ? (
          <div
            className="load-fade mt-10"
            style={{ '--i': 3 } as React.CSSProperties}
          >
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
