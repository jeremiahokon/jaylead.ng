/**
 * The questions for one topic, set beside a heading. Each page shows the FAQ
 * group that belongs to it (the separate /faq page was folded in, owner's
 * request), and adds the same items to its FAQPage JSON-LD.
 */
import type { ReactNode } from 'react';

import { FaqList } from '@/components/faq-list';
import { PaymentSafety } from '@/components/payment-safety';
import { SectionHead } from '@/components/section-head';

import type { FaqItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export function FaqSection({
  items,
  title,
  index,
  id,
  withPaymentSafety,
  tone = 'deep',
  after,
}: {
  items: FaqItem[];
  title: ReactNode;
  index?: string;
  id?: string;
  withPaymentSafety?: boolean;
  tone?: 'deep' | 'plain';
  after?: ReactNode;
}) {
  if (!items.length) return null;

  return (
    <section id={id} className={cn(tone === 'deep' && 'bg-bone-deep')}>
      <div className="mx-auto grid max-w-[96rem] gap-14 px-(--gutter) py-28 md:py-40 lg:grid-cols-[1fr_1.7fr]">
        <div>
          <SectionHead index={index} eyebrow="Questions" title={title} />
          {after}
        </div>
        <div>
          <FaqList items={items} />
          {withPaymentSafety ? <PaymentSafety className="mt-8" /> : null}
        </div>
      </div>
    </section>
  );
}
