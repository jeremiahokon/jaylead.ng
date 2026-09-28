'use client';

import { useState } from 'react';

import { utils } from '@/lib/utils';

/**
 * "What you'd own" (brief 10.1). Steppers for 1-acre and 1-hectare plots,
 * 0 to 10 each; shows the total price, trees, area, the four documents and
 * "Palm oil income from year 3". It never shows income, yield or returns.
 * The no-JS fallback is the static table rendered beside it by the page.
 */
type PlotLite = {
  key: string;
  sizeLabel: string;
  sizeInAcres: number;
  trees: number;
  price: number;
};

export function PlotCalculator({
  plots,
  whatsappNumber,
  pricesUpdated,
  documents,
}: {
  plots: PlotLite[];
  whatsappNumber: string;
  pricesUpdated: string;
  documents: string[];
}) {
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(plots.map((p, i) => [p.key, i === 0 ? 1 : 0]))
  );

  const set = (key: string, n: number) =>
    setQty((q) => ({ ...q, [key]: Math.max(0, Math.min(10, n)) }));

  const total = plots.reduce((a, p) => a + p.price * (qty[p.key] ?? 0), 0);
  const trees = plots.reduce((a, p) => a + p.trees * (qty[p.key] ?? 0), 0);

  const acres = plots.reduce(
    (a, p) => a + p.sizeInAcres * (qty[p.key] ?? 0),
    0
  );

  const selection = plots
    .filter((p) => qty[p.key])
    .map((p) => `${qty[p.key]} × ${p.sizeLabel}`)
    .join(', ');

  const message = `Hello Jaylead, I used the calculator on your website. I'm interested in ${selection || 'a plot'} at Palm Grove Estate: ${utils.format.naira(total)} in total, ${trees} trees. Please confirm the current price and payment options.`;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div>
        {plots.map((p) => (
          <div
            key={p.key}
            className="flex items-center justify-between gap-6 border-b border-current/15 py-6"
          >
            <div>
              <p className="font-display text-3xl">{p.sizeLabel}</p>
              <p className="micro mt-2 opacity-70">
                {utils.format.naira(p.price)} · {p.trees} palms
              </p>
            </div>
            <div
              className="flex items-center gap-3"
              role="group"
              aria-label={`${p.sizeLabel} plots`}
            >
              <button
                type="button"
                onClick={() => set(p.key, (qty[p.key] ?? 0) - 1)}
                className="hover:bg-ink hover:text-bone grid size-12 place-items-center rounded-full border border-current/25 text-2xl transition-colors active:scale-95"
                aria-label={`One fewer ${p.sizeLabel} plot`}
              >
                −
              </button>
              <output
                className="font-display tabular w-10 text-center text-3xl"
                aria-live="polite"
              >
                {qty[p.key] ?? 0}
              </output>
              <button
                type="button"
                onClick={() => set(p.key, (qty[p.key] ?? 0) + 1)}
                className="hover:bg-ink hover:text-bone grid size-12 place-items-center rounded-full border border-current/25 text-2xl transition-colors active:scale-95"
                aria-label={`One more ${p.sizeLabel} plot`}
              >
                +
              </button>
            </div>
          </div>
        ))}
        <p className="text-small mt-6 opacity-75">
          Prices updated {pricesUpdated}. Confirm before paying.
        </p>
      </div>

      <div className="bg-ink text-bone on-ink p-8 md:p-12">
        <p className="micro text-sand">What you’d own</p>
        <p
          className="font-display tabular mt-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-none"
          aria-live="polite"
        >
          {utils.format.naira(total)}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-current/15 pt-6">
          <div>
            <dt className="micro text-sand">Oil palms</dt>
            <dd className="font-display tabular mt-1 text-3xl">{trees}</dd>
          </div>
          <div>
            <dt className="micro text-sand">Land</dt>
            <dd className="font-display tabular mt-1 text-3xl">
              {acres.toFixed(acres % 1 ? 2 : 0)} ac
              <span className="text-sand ml-2 text-base">
                ({(acres / 2.471).toFixed(2)} ha)
              </span>
            </dd>
          </div>
        </dl>
        <p className="micro text-sand mt-8">Documents, per plot</p>
        <p className="text-small mt-2">{documents.join(' · ')}</p>
        <p className="text-small text-oil-light mt-6">
          Palm oil income from year 3
        </p>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener"
          className="pill mt-8"
        >
          Send this to Jaylead on WhatsApp
        </a>
      </div>
    </div>
  );
}
