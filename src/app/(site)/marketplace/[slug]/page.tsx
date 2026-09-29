/**
 * Plot detail (brief 9.6): the listing as a register entry. Gallery rail,
 * the overview table, payment options with the safety line directly below,
 * the three asks (chat, full pricing, inspection form), who you are dealing
 * with, and the related FAQ. Product + Offer JSON-LD, never any yield.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { LeadForm } from '@/components/lead-form';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';
import { PaymentSafety } from '@/components/payment-safety';
import { Photo } from '@/components/photo';
import { plotPrice } from '@/components/plot-card';
import { PricesUpdated } from '@/components/prices-updated';
import { SectionHead } from '@/components/section-head';
import { TrustBlock } from '@/components/trust-block';
import { TrustLine } from '@/components/trust-line';
import { CtaGroup, WhatsAppLink } from '@/components/whatsapp-cta';

import {
  getEstate,
  getEstateDocuments,
  getFaqs,
  getPlot,
  getPlots,
} from '@/lib/content';
import { faqNode, offerNode } from '@/lib/jsonld';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPlots()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plot = await getPlot((await params).slug);

  if (!plot) return {};
  const title = `${plot.title}: ${plot.trees} Oil Palms, Osun State`;
  const description = `${plot.sizeLabel} of titled farmland at ${plot.estateName}, Osun State, with ${plot.trees} Supergene oil palms. ${plotPrice(plot)}. Fully managed by Jaylead; palm oil income from year 3.`;

  return {
    title,
    description,
    alternates: { canonical: `/marketplace/${plot.slug}` },
    openGraph: { title, description, url: `/marketplace/${plot.slug}` },
  };
}

const status = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
} as const;

export default async function PlotPage({ params }: Props) {
  const { slug } = await params;

  const [plot, faqs] = await Promise.all([getPlot(slug), getFaqs()]);

  if (!plot) notFound();
  const estate = await getEstate(plot.estateSlug);
  const documents = await getEstateDocuments(estate);
  const related = faqs.filter((f) => f.group === 'Owning a plot').slice(0, 6);

  const crumbs = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: plot.sizeLabel, path: `/marketplace/${plot.slug}` },
  ];

  const vars = {
    plot: `${plot.sizeLabel} plot`,
    price: plotPrice(plot),
    trees: String(plot.trees),
  };

  const location = [estate?.state ?? 'Osun State', estate?.lga]
    .filter(Boolean)
    .join(', ');

  const rows: [string, string][] = [
    ['Asset type', 'Oil palm plot, titled land'],
    ['Size', `${plot.sizeLabel} (${plot.sizeInAcres} acres)`],
    [
      'Oil palms',
      `${plot.trees} ${estate?.palmVariety ?? 'Supergene'} oil palms`,
    ],
    ['Location', `${plot.estateName}, ${location}`],
    ['Price', plotPrice(plot)],
    [
      'Income start',
      `Year ${estate?.incomeStartYear ?? 3}, from crude palm oil`,
    ],
    ['Legal documents', documents.map((d) => d.name).join(', ')],
    ['Annual fees', 'None'],
    ['Status', status[plot.status]],
  ];

  return (
    <MotionScope>
      <JsonLd
        path={`/marketplace/${plot.slug}`}
        title={plot.title}
        description={`${plot.sizeLabel} with ${plot.trees} oil palms at ${plot.estateName}.`}
        crumbs={crumbs}
        type="ItemPage"
        extra={[offerNode(plot), faqNode(related, `/marketplace/${plot.slug}`)]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={`${plot.estateName} · ${status[plot.status]}`}
        title={[
          { text: plot.sizeLabel },
          { text: `${plot.trees} palms.`, className: 'em-oil' },
        ]}
        lede={
          <>
            <span className="font-display tabular text-figure block">
              {plotPrice(plot)}
            </span>
            <span className="mt-4 block">
              Titled farmland at {plot.estateName}, {location}, planted and
              fully managed by Jaylead.
            </span>
          </>
        }
      >
        <CtaGroup>
          <WhatsAppLink
            template={plot.whatsappTemplateKey}
            vars={vars}
            magnetic
          >
            Chat about this plot
          </WhatsAppLink>
          <WhatsAppLink template="plot-pricing" vars={vars} variant="ghost">
            Request full pricing and payment plan
          </WhatsAppLink>
        </CtaGroup>
        <TrustLine className="mt-10" />
      </PageHero>

      {plot.gallery.length ? (
        <section aria-label="Gallery" className="pb-24">
          <div data-motion-rail className="px-(--gutter)">
            <ul data-motion-track className="gap-4 md:gap-6">
              {plot.gallery.map((img, i) => (
                <li
                  key={img.src + i}
                  data-motion-item
                  className="w-[82vw] shrink-0 md:w-[52vw] lg:w-[40vw]"
                >
                  <Photo
                    image={img}
                    sizes="(min-width: 1024px) 40vw, 82vw"
                    aspect={4 / 3}
                    showCaption
                    className="overflow-hidden"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-[96rem] gap-16 px-(--gutter) pb-24 md:pb-36 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <SectionHead
            index="01"
            eyebrow="Overview"
            title="The register entry."
            size="title"
          />
          <dl className="mt-10 border-t border-current/20">
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 border-b border-current/15 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
              >
                <dt className="micro pt-1 opacity-60">{k}</dt>
                <dd
                  className={
                    k === 'Price' ? 'font-display tabular text-2xl' : ''
                  }
                >
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-12">
            <p className="micro opacity-60">Payment options</p>
            <p className="font-display mt-3 text-2xl">{plot.paymentOptions}</p>
            <PaymentSafety className="mt-6" />
            <PricesUpdated className="mt-4" />
          </div>
        </div>
        <div id="inspection">
          <SectionHead
            index="02"
            eyebrow="See it first"
            title={
              <>
                Book a site <span className="em-oil">inspection.</span>
              </>
            }
            size="title"
          />
          <LeadForm
            type="inspection"
            submitLabel="Request an inspection"
            sourcePage={`/marketplace/${plot.slug}`}
            defaults={{ plot: plot.sizeLabel }}
            className="mt-10"
          />
        </div>
      </section>

      <section className="bg-bone-deep">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-24 md:py-36">
          <TrustBlock />
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4">
            {estate ? (
              <Link
                href="/marketplace"
                className="link-draw font-display text-2xl"
              >
                About {estate.name}
              </Link>
            ) : null}
            <Link
              href="/marketplace#brochure"
              className="link-draw font-display text-2xl"
            >
              The brochure
            </Link>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="mx-auto grid max-w-[96rem] gap-14 px-(--gutter) py-24 md:py-36 lg:grid-cols-[1fr_1.7fr]">
          <SectionHead index="03" eyebrow="Questions" title="Owning a plot." />
          <FaqList items={related} />
        </section>
      ) : null}
    </MotionScope>
  );
}
