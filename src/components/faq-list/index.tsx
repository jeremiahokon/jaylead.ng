/**
 * FAQ on native <details>: keyboard and screen-reader accessible, works with
 * JavaScript off, indexable. The same items feed FAQPage JSON-LD and
 * /llms.txt. Typographic: the question in Boska, a plus sign that turns.
 */
import { RichText } from '@/components/rich-text';

import type { FaqItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export function FaqList({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  return (
    <div className={cn('border-t border-current/15', className)}>
      {items.map((f, i) => (
        <details
          key={f._id}
          className="faq-item group border-b border-current/15"
        >
          <summary className="flex min-h-16 items-baseline gap-5 py-6 md:gap-8">
            <span className="micro tabular w-8 shrink-0 opacity-60">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-display flex-1 text-2xl leading-tight md:text-3xl">
              {f.question}
            </span>
            <span
              aria-hidden
              className="faq-mark font-display text-3xl leading-none"
            >
              +
            </span>
          </summary>
          <RichText value={f.answer} className="pb-8 pl-13 md:pl-16" />
        </details>
      ))}
    </div>
  );
}
