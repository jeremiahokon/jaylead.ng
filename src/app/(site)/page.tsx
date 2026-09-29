/**
 * Home: "a cinematic land register" (docs/design-direction.md). A quiet,
 * typographic scroll with two signature scenes: the aerial field plane that
 * tilts up out of the hero, and thirty years moving sideways. Everything it
 * must prove (the price, the papers, who you are dealing with, how to pay
 * safely) is here, set in type rather than piled into cards.
 */
import Link from 'next/link';

import type { Metadata } from 'next';

import { AerialPlayer } from '@/components/aerial-player';
import { WatchPill } from '@/components/aerial-player/watch-pill';
import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { LandVsShares } from '@/components/land-vs-shares';
import { Marquee } from '@/components/marquee';
import { MotionScope } from '@/components/motion';
import { PaymentSafety } from '@/components/payment-safety';
import { Photo } from '@/components/photo';
import { PlayMark } from '@/components/play-mark';
import { PlotLedger } from '@/components/plot-card';
import { PostCard } from '@/components/post-card';
import { PricesUpdated } from '@/components/prices-updated';
import { SectionHead } from '@/components/section-head';
import { SplitWords } from '@/components/split-words';
import { TrustBlock } from '@/components/trust-block';
import { VideoCard } from '@/components/video-card';
import { ReplyNote, WhatsAppLink } from '@/components/whatsapp-cta';
import { YearsScene } from '@/components/years-scene';

import {
  getDepartments,
  getFaqs,
  getMainEstate,
  getPlots,
  getPosts,
  getSettings,
  getShownCredentials,
  getStats,
  getVideosFor,
} from '@/lib/content';
import { faqNode, videoNode } from '@/lib/jsonld';
import type { Post, Video } from '@/lib/types';
import { utils } from '@/lib/utils';

import { images } from '@/data/images';

const title = 'Jaylead AgriEstate: Titled Oil Palm Farmland in Osun, Nigeria';

/** Built from the live plots and settings, so a price change in the Studio reaches Google too. */
async function describe() {
  const [plots, settings] = await Promise.all([getPlots(), getSettings()]);

  const prices = plots
    .filter((p) => p.priceMode !== 'on-request')
    .map((p) => p.price);

  const from = prices.length
    ? ` from ${utils.format.naira(Math.min(...prices))}`
    : '';

  return `Own titled oil-palm farmland${from}. We plant and manage it; you earn from the harvest from year 3. CAC registered, RC ${settings.rcNumber}.`;
}

export async function generateMetadata(): Promise<Metadata> {
  const description = await describe();

  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { title, description, url: '/' },
  };
}

/** A field-record video, titled and linked by its related post when set. */
function ProofCard({ video, post }: { video: Video; post?: Post }) {
  return (
    <>
      <VideoCard
        video={video}
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
        showSummary={false}
        meta={utils.format.date(video.publishedOn ?? '')}
      />
      {post ? (
        <Link
          href={`/blog/${post.slug}`}
          className="font-display mt-2 block text-xl leading-snug"
        >
          {post.title}
        </Link>
      ) : null}
    </>
  );
}

export default async function Home() {
  const [
    settings,
    estate,
    plots,
    posts,
    faqs,
    stats,
    creds,
    founder,
    proof,
    departments,
  ] = await Promise.all([
    getSettings(),
    getMainEstate(),
    getPlots(),
    getPosts(),
    getFaqs(),
    getStats(),
    getShownCredentials(),
    getVideosFor('founder-story'),
    getVideosFor('proof-strip'),
    getDepartments(),
  ]);

  const available = plots.filter((p) => p.status !== 'sold');
  const priced = plots.filter((p) => p.priceMode !== 'on-request');

  const fromPrice = priced.length
    ? Math.min(...priced.map((p) => p.price))
    : undefined;

  const description = await describe();
  const aerialSrc = estate?.aerialFileUrl ?? '/video/aerial.mp4';

  // Never an empty Questions section: fall back to the first six.
  const picked = faqs.filter((f) => f.showOnHome);
  const homeFaqs = picked.length ? picked : faqs.slice(0, 6);
  const founderVideo = founder[0];

  // Field record: the newest two "proof-strip" videos, each linking to its
  // related post when one is set.
  const [firstProof, secondProof] = proof.slice(0, 2).map((video) => ({
    video,
    post: posts.find((p) => p._id === video.relatedPostId),
  }));

  const trustLine = [
    ...creds.map((c) =>
      c.name.startsWith('CAC') ? `${c.shortName}, ${c.value}` : c.shortName
    ),
    'Independent audits welcome',
  ];

  return (
    <MotionScope>
      <JsonLd
        path="/"
        title={title}
        description={description}
        extra={[
          faqNode(homeFaqs, '/'),
          ...(founderVideo ? [videoNode(founderVideo)] : []),
        ]}
      />

      {/* Hero: the promise, then the land rising into view (scene "field"). */}
      <div data-pin-spacer>
        <section data-scene="field" className="relative overflow-hidden">
          <div
            data-field-copy
            className="mx-auto max-w-[96rem] px-(--gutter) pt-8 md:pt-12"
          >
            <div
              className="micro load-fade flex flex-wrap justify-between gap-x-8 gap-y-2 opacity-80"
              style={{ '--i': 0 } as React.CSSProperties}
            >
              <p>
                {estate?.name ?? 'Palm Grove Estate'} ·{' '}
                {estate?.state ?? 'Osun State'}
              </p>
              <p className="tabular">
                {fromPrice ? `From ${utils.format.naira(fromPrice)} · ` : ''}
                Palm oil income from year 3
              </p>
            </div>
            <h1 className="font-display mt-8 text-[clamp(2.6rem,6.3vw,7rem)] leading-[0.95] tracking-[-0.03em] md:mt-10">
              <SplitWords
                parts={[
                  { text: 'Own titled farmland.', breakAfter: true },
                  {
                    text: 'We farm it.',
                    className: 'em-oil',
                    breakAfter: true,
                  },
                  { text: 'You earn from the harvest.' },
                ]}
              />
            </h1>
            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1fr_auto] md:items-end">
              <p
                className="text-lede measure load-fade opacity-85"
                style={{ '--i': 2 } as React.CSSProperties}
              >
                Palm Grove Estate, Osun State: titled oil-palm plots
                {fromPrice ? ` from ${utils.format.naira(fromPrice)}` : ''},
                planted and fully managed by Jaylead. Palm oil income from year
                3.
              </p>
              <div
                className="load-fade"
                style={{ '--i': 3 } as React.CSSProperties}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <WhatsAppLink template="brochure" magnetic>
                    Get the brochure on WhatsApp
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
                </div>
                <ReplyNote className="mt-4" />
              </div>
            </div>
            <p
              className="micro load-fade mt-8 flex flex-wrap gap-x-6 gap-y-2 opacity-70"
              style={{ '--i': 4 } as React.CSSProperties}
            >
              {trustLine.map((t) => (
                <span key={t}>{t}</span>
              ))}
              <a href="#land-vs-shares" className="link-under text-oil">
                How land compares to shares
              </a>
            </p>
          </div>

          <div data-field-wrap className="stage-3d mt-14 md:mt-20">
            <div data-field-plane className="relative mx-auto max-w-[110rem]">
              <AerialPlayer
                src={aerialSrc}
                poster={images['aerial-fields'].src}
                className="group relative block"
              >
                <Photo
                  image={images['aerial-fields']}
                  sizes="100vw"
                  priority
                  aspect={16 / 8}
                  className="overflow-hidden"
                />
                <span
                  data-field-veil
                  aria-hidden
                  className="bg-ink pointer-events-none absolute inset-0 opacity-15"
                />
                <span className="from-ink/70 absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 bg-gradient-to-t to-transparent p-5 pt-16 sm:flex-row sm:items-end sm:justify-between md:p-10">
                  <span
                    data-field-caption
                    className="micro text-bone max-w-[22ch] leading-relaxed"
                  >
                    Jaylead farmland from the air, September 2026
                  </span>
                  <WatchPill />
                </span>
              </AerialPlayer>
            </div>
          </div>
        </section>
      </div>

      <Marquee
        items={[
          'Titled land',
          'Zero annual fees',
          'Supergene oil palms',
          'Palm oil income from year 3',
          'Fully managed',
        ]}
      />

      {/* Why palm oil: one statement, inking in as you read. */}
      <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-44">
        <p className="micro mb-10 opacity-70">Why palm oil</p>
        <p
          data-motion="ink"
          className="font-display text-statement max-w-[28ch]"
        >
          Nigeria has the land and the climate to grow its own palm oil, yet it
          still imports a large share of what it uses. That gap is the
          opportunity: put your money into productive land instead of letting it
          sit idle.
        </p>
        {stats.length ? (
          <dl
            data-motion="stagger"
            className="mt-20 grid gap-10 border-t border-current/15 pt-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {stats.map((s) => (
              <div key={s._id}>
                <dt className="micro opacity-70">{s.label}</dt>
                <dd className="font-display text-figure mt-3">{s.value}</dd>
                <dd className="text-small mt-3 opacity-70">
                  Source:{' '}
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noopener"
                    className="link-draw"
                  >
                    {s.sourceName}
                  </a>
                  {s.sourceDate ? `, ${utils.format.date(s.sourceDate)}` : ''}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {/* The offer, as a ledger. */}
      <section
        id="plots"
        className="mx-auto max-w-[96rem] px-(--gutter) pb-28 md:pb-40"
      >
        <SectionHead
          index="01"
          eyebrow="The offer"
          title={
            <>
              Your land. <span className="em-oil">Your harvest.</span> Your
              legacy.
            </>
          }
        />
        <PlotLedger plots={available} className="mt-16" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <PricesUpdated />
            <Link
              href="/marketplace"
              className="group link-draw mt-5 inline-block font-medium"
            >
              View the marketplace
            </Link>
          </div>
          <PaymentSafety />
        </div>
      </section>

      {/* Thirty years, sideways (scene "years"). */}
      <YearsScene
        heading={
          <>
            Thirty years, <span className="em-oil">one</span> decision.
          </>
        }
      />

      {/* Who you are dealing with. */}
      <section className="bg-bone-deep">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
          <SectionHead
            index="02"
            eyebrow="The register"
            title={
              <>
                Real people, a real office,{' '}
                <span className="em-oil">real papers.</span>
              </>
            }
            className="mb-16"
          />
          <TrustBlock />
        </div>
      </section>

      {/* Field proof: dated work, drifting at different depths. */}
      <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-44">
        <SectionHead
          index="03"
          eyebrow="Field record"
          title={
            <>
              Not just promises. <span className="em-oil">Proof.</span>
            </>
          }
          lede="Dated work from the land, as it happens. Every entry links to its Farm Update."
        />
        <ol className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {firstProof ? (
            <li data-motion="depth" data-motion-depth="0.2">
              <ProofCard {...firstProof} />
            </li>
          ) : null}
          <li data-motion="depth" data-motion-depth="0.6" className="lg:mt-24">
            <Link
              href="/blog/land-inspection-malete-kwara"
              className="group block"
            >
              <div className="overflow-hidden">
                <Photo
                  image={images['cover-malete-land-inspection']}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
                  aspect={4 / 5}
                  imgClassName="transition-transform duration-[1400ms] ease-(--ease-out-expo) group-hover:scale-[1.05]"
                />
              </div>
              <p className="micro mt-4 opacity-70">
                Land inspection · Malete, Kwara · 8 September 2026
              </p>
              <p className="font-display mt-2 text-xl leading-snug">
                Inside our land inspection in Malete, Kwara
              </p>
            </Link>
          </li>
          {secondProof ? (
            <li data-motion="depth" data-motion-depth="0.3" className="lg:mt-8">
              <ProofCard {...secondProof} />
            </li>
          ) : null}
          <li data-motion="depth" data-motion-depth="0.8" className="lg:mt-36">
            <AerialPlayer
              src={aerialSrc}
              poster={images['aerial-fields'].src}
              className="group relative block overflow-hidden"
            >
              <Photo
                image={images['aerial-site']}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
                aspect={4 / 5}
                imgClassName="transition-transform duration-[1400ms] ease-(--ease-out-expo) group-hover:scale-[1.05]"
              />
              <span aria-hidden className="bg-ink/20 absolute inset-0" />
              <PlayMark />
              <span className="sr-only">Play the aerial video</span>
            </AerialPlayer>
            <p className="micro mt-4 opacity-70">
              Drone aerial · 17 September 2026
            </p>
            <p className="font-display mt-2 text-xl leading-snug">
              Fourteen seconds over Jaylead farmland
            </p>
          </li>
        </ol>
      </section>

      {/* The founder. */}
      {founderVideo ? (
        <section className="on-ink bg-ink text-bone grain">
          <div className="mx-auto grid max-w-[96rem] gap-14 px-(--gutter) py-28 md:grid-cols-[minmax(0,26rem)_1fr] md:items-center md:gap-24 md:py-40">
            <div data-motion="tilt">
              <VideoCard
                video={founderVideo}
                sizes="(min-width: 768px) 416px, 100vw"
                className="[&_p]:text-sand"
              />
            </div>
            <div>
              <p className="micro text-sand">Our story</p>
              <blockquote className="font-display text-display mt-8">
                <p data-motion="lines">
                  “A personal agenda over time grew to become a{' '}
                  <span className="em-oil">collective</span> agenda.”
                </p>
              </blockquote>
              <p className="text-sand mt-10">
                <span className="text-bone font-medium">
                  Adetunji Jacob Ogunyemi
                </span>
                , Managing Director
              </p>
              <Link
                href="/about"
                className="group link-draw micro mt-10 inline-block"
              >
                About Jaylead
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Two ways in, then land vs shares. */}
      <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-44">
        <SectionHead
          index="04"
          eyebrow="Two ways in"
          title="Own a plot, or fund the project."
        />
        <ul className="mt-16 border-t border-current/20">
          {[
            {
              href: '/marketplace',
              label: 'Own a plot',
              body: 'Buy titled farmland in Palm Grove Estate. We plant and manage it. You earn from what it produces.',
            },
            {
              href: '/invest',
              label: 'Fund the project',
              body: 'Invest in Jaylead’s farming operation under Option A (a share of the farm’s output) or Option B (a fixed-term loan with a clean exit).',
            },
          ].map((w) => (
            <li key={w.href} className="border-b border-current/20">
              <Link
                href={w.href}
                className="group grid gap-4 py-10 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-12 md:py-14"
              >
                <span className="font-display text-display transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-x-4">
                  {w.label}
                </span>
                <span className="text-lede opacity-80">{w.body}</span>
                <span
                  aria-hidden
                  className="micro text-oil border-oil/40 group-hover:bg-oil group-hover:text-bone rounded-full border px-5 py-3 transition-colors duration-300"
                >
                  Explore
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div id="land-vs-shares" className="mt-32 md:mt-44">
          <SectionHead
            index="05"
            eyebrow="Land or shares"
            title={
              <>
                Two different things <span className="em-oil">to own.</span>
              </>
            }
            lede="It isn’t about which is better. It’s about which one fits your goal. Neither is risk-free, and returns from either are not guaranteed."
          />
          <div data-motion="reveal" className="mt-14">
            <LandVsShares />
          </div>
          <Link
            href="/blog/palm-grove-vs-dangote-ipo"
            className="group link-draw mt-8 inline-block font-medium"
          >
            Read: Palm Grove vs Dangote IPO
          </Link>
        </div>
      </section>

      {/* Work with us: the realtor academy and NYSC placements. */}
      <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
        <SectionHead
          index="06"
          eyebrow="Work with us"
          title={
            <>
              Sell with us, <span className="em-oil">or serve with us.</span>
            </>
          }
        />
        <div data-motion="tilt" className="mt-16 grid gap-6 md:grid-cols-2">
          <Link
            href="/become-a-realtor"
            className="group on-ink bg-ink text-bone grain flex min-h-[26rem] flex-col p-8 md:p-12"
          >
            <p className="micro text-sand">Jaylead Realty Academy</p>
            <h3 className="font-display text-title mt-6 max-w-[16ch]">
              Earn while you help others build{' '}
              <span className="em-oil">generational wealth.</span>
            </h3>
            <p className="text-sand mt-6 mb-10 max-w-md">
              Training to become a certified Jaylead Realty Partner, with
              commission on every closed sale. No experience needed.
            </p>
            <span className="pill mt-auto self-start">Become a realtor</span>
          </Link>
          <Link
            href="/nysc"
            className="group bg-bone-deep flex min-h-[26rem] flex-col p-8 md:p-12"
          >
            <p className="micro opacity-70">
              NYSC · Place of Primary Assignment
            </p>
            <h3 className="font-display text-title mt-6 max-w-[16ch]">
              Serve your NYSC year <span className="em-oil">at Jaylead.</span>
            </h3>
            <p className="mt-6 mb-10 max-w-md opacity-85">
              Corps members work across {departments.length} departments, from
              agriculture and real estate to finance and technology, at our
              office in Tanke, Ilorin.
            </p>
            <span className="pill mt-auto self-start">Request a placement</span>
          </Link>
        </div>
      </section>

      {/* Questions. */}
      <section id="questions" className="bg-bone-deep">
        <div className="mx-auto grid max-w-[96rem] gap-14 px-(--gutter) py-28 md:py-40 lg:grid-cols-[1fr_1.7fr]">
          <div>
            <SectionHead
              index="07"
              eyebrow="Questions"
              title="What people ask before they buy."
            />
            <div className="mt-10">
              <WhatsAppLink template="faq" variant="text">
                Ask us something else
              </WhatsAppLink>
            </div>
          </div>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      {/* Latest from the farm. */}
      {posts.length ? (
        <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              index="08"
              eyebrow="From the farm"
              title="Latest from the farm."
            />
            <Link href="/blog" className="group link-draw micro">
              All Farm Updates
            </Link>
          </div>
          <div
            data-motion="tilt"
            className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.slice(0, 3).map((p) => (
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
        lede={`Book a site inspection at Palm Grove Estate, or visit our office at ${settings.address.line1}, ${settings.address.landmarkDirections}, ${settings.address.city}.`}
      >
        <WhatsAppLink template="inspection" magnetic>
          Book a site inspection
        </WhatsAppLink>
        <WhatsAppLink template="office-visit" variant="ghost">
          Visit our office
        </WhatsAppLink>
      </CtaBand>
    </MotionScope>
  );
}
