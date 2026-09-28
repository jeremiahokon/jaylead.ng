/**
 * The offer, set as a ledger. PlotLedger renders each plot as one wide,
 * typographic row (size in Boska, trees, price, two actions) that slides in
 * from alternating sides. PlotPanel is the taller Marketplace listing with a
 * photo. Prices come from the CMS through the one naira formatter.
 */
import Link from 'next/link';

import { Photo } from '@/components/photo';
import { WhatsAppLink } from '@/components/whatsapp-cta';

import type { Plot } from '@/lib/types';
import { cn, utils } from '@/lib/utils';

export function plotPrice(plot: Plot) {
  if (plot.priceMode === 'on-request') return 'Price on request';

  return `${plot.priceMode === 'from' ? 'From ' : ''}${utils.format.naira(plot.price)}`;
}

const status = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
} as const;

const vars = (p: Plot) => ({
  plot: `${p.sizeLabel} plot`,
  price: plotPrice(p),
  trees: String(p.trees),
});

export function PlotLedger({
  plots,
  className,
}: {
  plots: Plot[];
  className?: string;
}) {
  return (
    <ol
      data-motion="slide"
      className={cn('border-t border-current/20', className)}
    >
      {plots.map((p, i) => (
        <li
          key={p._id}
          className="grid gap-x-8 gap-y-5 border-b border-current/20 py-10 lg:grid-cols-12 lg:items-end lg:py-14"
        >
          <p className="micro tabular opacity-60 lg:col-span-1">
            {String(i + 1).padStart(2, '0')}
          </p>
          <div className="lg:col-span-4">
            <h3 className="font-display text-figure">{p.sizeLabel}</h3>
            <p className="micro mt-3 opacity-70">
              {p.estateName} · {status[p.status]}
            </p>
          </div>
          <p className="lg:col-span-2">
            <span className="font-display tabular text-4xl">{p.trees}</span>
            <span className="micro ml-2 opacity-70">oil palms</span>
          </p>
          <p className="font-display tabular min-w-0 text-[clamp(2rem,3.4vw,3.25rem)] leading-none whitespace-nowrap lg:col-span-5 lg:text-right">
            {plotPrice(p)}
          </p>
          {/* Actions get their own row, so a long price can never run into them. */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:col-span-11 lg:col-start-2 lg:justify-end">
            <WhatsAppLink
              template={p.whatsappTemplateKey}
              vars={vars(p)}
              variant="text"
            >
              Chat about this plot
            </WhatsAppLink>
            <Link href={`/marketplace/${p.slug}`} className="link-draw micro">
              Details
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PlotPanel({
  plot,
  className,
}: {
  plot: Plot;
  className?: string;
}) {
  return (
    <article className={cn('group flex flex-col', className)}>
      <Link
        href={`/marketplace/${plot.slug}`}
        className="block overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        {plot.thumbnail ? (
          <Photo
            image={plot.thumbnail}
            sizes="(min-width: 768px) 50vw, 100vw"
            aspect={4 / 3}
            imgClassName="transition-transform duration-[1400ms] ease-(--ease-out-expo) group-hover:scale-[1.04]"
          />
        ) : null}
      </Link>
      <div className="mt-6 flex items-baseline justify-between gap-4 border-b border-current/20 pb-4">
        <h2 className="font-display text-title">
          <Link href={`/marketplace/${plot.slug}`}>{plot.sizeLabel}</Link>
        </h2>
        <p className="micro opacity-70">{status[plot.status]}</p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="micro opacity-60">Price</dt>
          <dd className="font-display tabular mt-1 text-3xl">
            {plotPrice(plot)}
          </dd>
        </div>
        <div>
          <dt className="micro opacity-60">Supergene oil palms</dt>
          <dd className="font-display tabular mt-1 text-3xl">{plot.trees}</dd>
        </div>
      </dl>
      <p className="text-small mt-4 opacity-75">
        Zero annual fees · Four title documents · Palm oil income from year 3
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <WhatsAppLink template={plot.whatsappTemplateKey} vars={vars(plot)}>
          Chat about this plot
        </WhatsAppLink>
        <Link
          href={`/marketplace/${plot.slug}`}
          className="pill pill-ghost group"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
