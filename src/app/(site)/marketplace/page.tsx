/**
 * Marketplace: the one page for Palm Grove Estate (brief 9.5, with 9.7 estate
 * and 9.14 brochure folded in at the owner's request). The aerial, the plots
 * and prices, what you own, the four documents, the "What you'd own"
 * calculator (static table without JS), location and gallery, the brochure
 * (WhatsApp, PDF when uploaded, call-back form), owning-a-plot questions, who
 * you are dealing with, and Farm Updates.
 */
import type { Metadata } from 'next';

import { AerialPlayer } from '@/components/aerial-player';
import { WatchPill } from '@/components/aerial-player/watch-pill';
import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { LeadForm } from '@/components/lead-form';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';
import { PaymentSafety } from '@/components/payment-safety';
import { Photo } from '@/components/photo';
import { PlotCalculator } from '@/components/plot-calculator';
import { PlotPanel, plotPrice } from '@/components/plot-card';
import { PostCard } from '@/components/post-card';
import { PricesUpdated } from '@/components/prices-updated';
import { RichText } from '@/components/rich-text';
import { SectionHead } from '@/components/section-head';
import { TrustBlock } from '@/components/trust-block';
import { TrustLine } from '@/components/trust-line';
import { CtaGroup, WhatsAppLink } from '@/components/whatsapp-cta';

import {
  getEstateDocuments,
  getFaqs,
  getMainEstate,
  getPlots,
  getPosts,
  getSettings,
  getVideo,
} from '@/lib/content';
import { faqNode, offerNode, videoNode } from '@/lib/jsonld';
import { utils } from '@/lib/utils';

import { images } from '@/data/images';

/**
 * Title and description: the estate's SEO fields in the Studio when set,
 * else built from the live plots so prices in Google follow the Studio.
 */
async function seo() {
  const [estate, plots] = await Promise.all([getMainEstate(), getPlots()]);
  const name = estate?.name ?? 'Palm Grove Estate';
  const where = estate?.state ?? 'Osun State';

  const offer = plots
    .filter((p) => p.status !== 'sold')
    .map((p) => `${p.sizeLabel} (${p.trees} trees) ${plotPrice(p)}`)
    .join(' or ');

  return {
    title:
      estate?.seo?.title || `${name} Marketplace: Oil Palm Plots in ${where}`,
    description:
      estate?.seo?.description ||
      `${offer ? `${offer} at ` : ''}${name}, ${where}: titled, planted and fully managed by Jaylead.`,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await seo();

  return {
    title,
    description,
    alternates: { canonical: '/marketplace' },
    openGraph: { title, description, url: '/marketplace' },
  };
}

export default async function Marketplace() {
  const [plots, settings, estate, faqs, posts, { title, description }] =
    await Promise.all([
      getPlots(),
      getSettings(),
      getMainEstate(),
      getFaqs(),
      getPosts(),
      seo(),
    ]);

  const documents = await getEstateDocuments(estate);

  const aerial = await getVideo(estate?.aerialVideoId);

  const crumbs = [{ name: 'Marketplace', path: '/marketplace' }];
  const owning = faqs.filter((f) => f.group === 'Owning a plot');

  const updates = posts
    .filter((p) => p.category.slug === 'farm-updates')
    .slice(0, 3);

  const place = [estate?.town, estate?.lga, estate?.state ?? 'Osun State']
    .filter(Boolean)
    .join(', ');

  const hero = estate?.heroImage ?? images['aerial-fields'];

  const calcPlots = plots
    .filter((p) => p.priceMode !== 'on-request' && p.status !== 'sold')
    .map((p) => ({
      key: p._id,
      sizeLabel: p.sizeLabel,
      sizeInAcres: p.sizeInAcres,
      trees: p.trees,
      price: p.price,
    }));

  return (
    <MotionScope>
      <JsonLd
        path="/marketplace"
        title={title}
        description={description}
        crumbs={crumbs}
        type="CollectionPage"
        extra={[
          ...plots.map(offerNode),
          ...(aerial ? [videoNode(aerial)] : []),
          faqNode(owning, '/marketplace'),
        ]}
      />

      <PageHero
        crumbs={crumbs}
        eyebrow={`${estate?.name ?? 'Palm Grove Estate'} · ${place} · Now selling`}
        title={[
          { text: 'Own your plot.' },
          { text: 'We plant.', className: 'em-oil' },
          { text: 'You earn.' },
        ]}
        lede={
          estate?.summary ??
          'Browse available oil-palm plots. Every listing shows size, price, tree count and the documents you receive.'
        }
      >
        <CtaGroup>
          <WhatsAppLink template="brochure" magnetic>
            Get the brochure on WhatsApp
          </WhatsAppLink>
          <WhatsAppLink template="inspection" variant="ghost">
            Book a site inspection
          </WhatsAppLink>
        </CtaGroup>
        <TrustLine className="mt-10" />
      </PageHero>

      {/* The land. */}
      <section className="px-(--gutter) pb-24">
        <AerialPlayer
          src={estate?.aerialFileUrl ?? '/video/aerial.mp4'}
          poster={hero.src}
          className="group relative mx-auto block max-w-[110rem] overflow-hidden"
        >
          <div className="overflow-hidden">
            <div data-motion="unmask">
              <Photo image={hero} sizes="100vw" aspect={16 / 8} priority />
            </div>
          </div>
          <WatchPill className="absolute bottom-5 left-5 md:right-8 md:bottom-8 md:left-auto" />
          <span className="sr-only">Play the aerial video</span>
        </AerialPlayer>
      </section>

      {/* Plots and prices. */}
      <section
        id="plots"
        className="mx-auto max-w-[96rem] px-(--gutter) pb-28 md:pb-40"
      >
        <SectionHead
          index="01"
          eyebrow="Plots and prices"
          title="Choose your size."
        />
        <div
          data-motion="tilt"
          className="mt-14 grid gap-16 md:grid-cols-2 md:gap-10"
        >
          {plots.map((p) => (
            <PlotPanel key={p._id} plot={p} />
          ))}
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <PricesUpdated />
          <PaymentSafety />
        </div>
      </section>

      {/* What you own. */}
      {estate ? (
        <section className="mx-auto grid max-w-[96rem] gap-12 px-(--gutter) pb-28 md:grid-cols-[1fr_1.2fr] md:pb-40">
          <SectionHead
            index="02"
            eyebrow="What you own"
            title={
              <>
                Land and the palms on it.{' '}
                <span className="em-oil">Not a share.</span>
              </>
            }
          />
          <div>
            <RichText value={estate.body} />
            <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-current/20 pt-8">
              {[
                ['Palm variety', estate.palmVariety],
                ['Income from', `Year ${estate.incomeStartYear}`],
                ['Productive life', estate.productiveLifeText],
                ['Annual fees', 'None'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="micro opacity-60">{k}</dt>
                  <dd className="font-display mt-2 text-3xl">{v}</dd>
                </div>
              ))}
              {estate.headlineStatsConfirmed &&
              estate.headlineStats?.totalAcres ? (
                <div>
                  <dt className="micro opacity-60">Estate size</dt>
                  <dd
                    className="font-display mt-2 text-3xl"
                    data-motion="counter"
                  >
                    {estate.headlineStats.totalAcres} acres
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </section>
      ) : null}

      {/* The four documents. */}
      <section className="on-ink bg-ink text-bone grain">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
          <SectionHead
            index="03"
            eyebrow="Your documents"
            title={
              <>
                Four papers, <span className="em-oil">in your name.</span>
              </>
            }
          />
          <ol
            data-motion="tilt"
            className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4"
          >
            {documents.map((d, i) => (
              <li key={d._id} className="border-t border-current/25 pt-6">
                <p className="micro tabular text-sand">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display mt-4 text-3xl">{d.name}</h3>
                <p className="text-small text-sand mt-4">
                  {d.plainExplanation}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Calculator. */}
      <section className="bg-bone-deep">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-24 md:py-36">
          <SectionHead
            index="04"
            eyebrow="Calculator"
            title={
              <>
                What you’d <span className="em-oil">own.</span>
              </>
            }
            className="mb-14"
          />
          <PlotCalculator
            plots={calcPlots}
            whatsappNumber={settings.whatsappNumber}
            pricesUpdated={utils.format.monthYear(settings.pricesUpdated)}
            documents={documents.map((d) => d.name)}
          />
          <noscript>
            <table className="mt-10 w-full text-left">
              <caption className="micro mb-3 text-left">Plot options</caption>
              <thead>
                <tr>
                  <th scope="col">Plot</th>
                  <th scope="col">Price</th>
                  <th scope="col">Oil palms</th>
                </tr>
              </thead>
              <tbody>
                {plots.map((p) => (
                  <tr key={p._id}>
                    <td>{p.sizeLabel}</td>
                    <td>{plotPrice(p)}</td>
                    <td>{p.trees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </noscript>
        </div>
      </section>

      {/* Location and gallery. */}
      <section className="mx-auto grid max-w-[96rem] gap-12 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
        <SectionHead index="05" eyebrow="Location" title={place} />
        <div className="text-lede self-end">
          {estate?.mapUrl ? (
            <a
              href={estate.mapUrl}
              target="_blank"
              rel="noopener"
              className="link-under"
            >
              Open the estate in Google Maps
            </a>
          ) : (
            <p className="opacity-85">
              The exact location is shared when you book an inspection.
            </p>
          )}
          <div className="mt-8">
            <WhatsAppLink template="inspection">
              Book a site inspection
            </WhatsAppLink>
          </div>
        </div>
      </section>
      {estate?.gallery.length ? (
        <section aria-label="Gallery" className="pb-28">
          <div data-motion-rail className="px-(--gutter)">
            <ul data-motion-track className="gap-4 md:gap-6">
              {estate.gallery.map((img, i) => (
                <li
                  key={img.src + i}
                  data-motion-item
                  className="w-[82vw] shrink-0 md:w-[46vw] lg:w-[34vw]"
                >
                  <Photo
                    image={img}
                    sizes="(min-width: 1024px) 34vw, 82vw"
                    aspect={4 / 5}
                    showCaption
                    className="overflow-hidden"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* The brochure. */}
      <section id="brochure" className="bg-bone-deep">
        <div className="mx-auto grid max-w-[96rem] gap-16 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
          <div>
            <SectionHead
              index="06"
              eyebrow="The brochure"
              title={
                <>
                  Everything, <span className="em-oil">on paper.</span>
                </>
              }
              lede={
                estate?.brochureUrl
                  ? 'Plots and prices, your four title documents, how we plant and manage the land, and how income is paid.'
                  : 'Our brochure is being updated. Ask on WhatsApp and we’ll send it to you directly.'
              }
            />
            <div className="mt-10">
              <CtaGroup>
                <WhatsAppLink template="brochure">
                  Get it on WhatsApp
                </WhatsAppLink>
                {estate?.brochureUrl ? (
                  <a
                    href={estate.brochureUrl}
                    download
                    className="pill pill-ghost"
                  >
                    Download PDF
                    {estate.brochureSizeLabel
                      ? ` (${estate.brochureSizeLabel})`
                      : ''}
                  </a>
                ) : null}
              </CtaGroup>
            </div>
            <div className="mt-14 max-w-sm overflow-hidden">
              <Photo
                image={images['palm-grove-pricing-card']}
                sizes="(min-width: 768px) 24rem, 100vw"
                showCaption
              />
            </div>
          </div>
          <div className="md:self-end">
            <p className="font-display text-title">Want a call back?</p>
            <LeadForm
              sourcePage="/marketplace"
              defaults={{ goal: 'Own a plot' }}
              className="mt-8"
            />
          </div>
        </div>
      </section>

      {/* Questions. */}
      {owning.length ? (
        <section className="mx-auto grid max-w-[96rem] gap-14 px-(--gutter) py-28 md:py-40 lg:grid-cols-[1fr_1.7fr]">
          <SectionHead index="07" eyebrow="Questions" title="Owning a plot." />
          <div>
            <FaqList items={owning} />
            <PaymentSafety className="mt-8" />
          </div>
        </section>
      ) : null}

      <section className="bg-bone-deep">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-24 md:py-36">
          <TrustBlock />
        </div>
      </section>

      {updates.length ? (
        <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
          <SectionHead
            index="08"
            eyebrow="Farm updates"
            title="From the land."
          />
          <div
            data-motion="tilt"
            className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {updates.map((p) => (
              <PostCard key={p._id} post={p} showExcerpt={false} />
            ))}
          </div>
        </section>
      ) : null}

      <CtaBand
        title={
          <>
            Come and see <span className="em-oil">the land.</span>
          </>
        }
        lede="Every plot can be inspected before you pay anything."
      >
        <WhatsAppLink template="inspection">
          Book a site inspection
        </WhatsAppLink>
      </CtaBand>
    </MotionScope>
  );
}
