/**
 * Section opener in the register style: a numbered micro-caps line and a
 * Boska headline. Pass `title` as nodes to put one phrase in the oil italic.
 */
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: 'h1' | 'h2';
  size?: 'display' | 'title' | 'hero';
  className?: string;
  id?: string;
  reveal?: boolean;
};

const sizes = {
  display: 'text-display',
  title: 'text-title',
  hero: 'text-hero',
} as const;

export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  as: H = 'h2',
  size = 'display',
  className,
  id,
  reveal = true,
}: Props) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className="micro mb-6 flex items-center gap-4 opacity-80">
          {index ? <span className="tabular">{index}</span> : null}
          {index ? (
            <span aria-hidden className="h-px w-10 bg-current opacity-40" />
          ) : null}
          <span>{eyebrow}</span>
        </p>
      ) : null}
      <H
        id={id}
        data-motion={reveal ? 'lines' : undefined}
        className={cn('font-display', sizes[size])}
      >
        {title}
      </H>
      {lede ? (
        <div className="text-lede measure mt-6 opacity-85">{lede}</div>
      ) : null}
    </div>
  );
}
