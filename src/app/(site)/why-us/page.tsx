/**
 * Why Us (brief 9.2): the credibility page for cautious buyers. The
 * difference as a two-column table, the credentials register with verify
 * links, how it works (who does what, the explainer video; folded in from
 * the old /how-it-works page), how the land earns, the honest risk note, the
 * mission, and the company-and-trust questions.
 */
import Link from 'next/link';

import type { Metadata } from 'next';

import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';
import { Photo } from '@/components/photo';
import { SectionHead } from '@/components/section-head';
import { VideoCard } from '@/components/video-card';
import { WhatsAppLink } from '@/components/whatsapp-cta';

import {
  getCredentials,
  getEstate,
  getFaqs,
  getSettings,
  getVideosFor,
} from '@/lib/content';
import { faqNode, videoNode } from '@/lib/jsonld';
import { utils } from '@/lib/utils';

import { whoDoesWhat, whyUsDifference } from '@/data/copy';
import { images } from '@/data/images';

const title = 'Why Jaylead AgriEstate: Verified, Land-Backed Agriculture';

const description =
  'CAC registered, SCUML certified, with full land documents on every plot. See how Jaylead differs from typical land sales.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/why-us' },
  openGraph: { title, description, url: '/why-us' },
};

export default async function WhyUs() {
  const [creds, estate, settings, faqs, videos] = await Promise.all([
    getCredentials(),
    getEstate('palm-grove'),
    getSettings(),
    getFaqs(),
    getVideosFor('how-it-works'),
  ]);

  const trustFaqs = faqs.filter((f) => f.group === 'Company and trust');
  const video = videos[0];

  const shown = creds.filter((c) => c.status === 'shown');
  const crumbs = [{ name: 'Why Us', path: '/why-us' }];

  return (
    <MotionScope>
      <JsonLd
        path="/why-us"
        title={title}
        description={description}
        crumbs={crumbs}
        extra={[
          faqNode(trustFaqs, '/why-us'),
          ...(video ? [videoNode(video)] : []),
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Why Jaylead"
        title={[
          { text: 'Real land.' },
          { text: 'Real compliance.', className: 'em-oil' },
          { text: 'Real harvests.' },
        ]}
        lede="Jaylead is a CAC-registered agribusiness with titled land, a working farm plan and documented terms for every buyer."
      />

      <section className="mx-auto max-w-[96rem] px-(--gutter) pb-28 md:pb-40">
        <SectionHead
          index="01"
          eyebrow="Our difference"
          title="Not another land sale."
        />
        <div data-motion="reveal" className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">
              A typical land-sale operator compared with Jaylead AgriEstate
            </caption>
            <thead>
              <tr className="border-b border-current/25">
                <th
                  scope="col"
                  className="font-display py-5 pr-8 text-2xl opacity-55 md:text-3xl"
                >
                  A typical land-sale operator
                </th>
                <th
                  scope="col"
                  className="font-display py-5 text-2xl md:text-3xl"
                >
                  Jaylead AgriEstate
                </th>
              </tr>
            </thead>
            <tbody>
              {whyUsDifference.map(([them, us]) => (
                <tr key={us} className="border-b border-current/15">
                  <td className="py-6 pr-8 align-top line-through decoration-current/30 opacity-55">
                    {them}
                  </td>
                  <td className="text-lede py-6 align-top">{us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-bone-deep">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
          <SectionHead
            index="02"
            eyebrow="Credentials"
            title={
              <>
                Check us. <span className="em-oil">We’d rather you did.</span>
              </>
            }
          />
          <ul
            data-motion="stagger"
            className="mt-14 border-t border-current/20"
          >
            {shown.map((c) => (
              <li
                key={c._id}
                className="grid gap-3 border-b border-current/20 py-7 md:grid-cols-[1.2fr_1fr_auto] md:items-baseline md:gap-10"
              >
                <p className="font-display text-3xl">{c.name}</p>
                <p className="opacity-80">{c.value}</p>
                {c.verifyUrl ? (
                  <a
                    href={c.verifyUrl}
                    target="_blank"
                    rel="noopener"
                    className="micro link-under"
                  >
                    Verify
                  </a>
                ) : (
                  <a
                    href={utils.contact.whatsappHref(settings, 'general')}
                    target="_blank"
                    rel="noopener"
                    className="micro link-under"
                  >
                    Request verification
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40"
      >
        <SectionHead
          index="03"
          eyebrow="How it works"
          title={
            <>
              You own the land.{' '}
              <span className="em-oil">We do the farming.</span>
            </>
          }
        />
        <div className="mt-14 grid gap-14 md:grid-cols-2">
          {whoDoesWhat.map(([heading, list]) => (
            <div key={heading}>
              <h3 className="font-display border-b border-current/25 pb-4 text-3xl">
                {heading}
              </h3>
              <ol data-motion="stagger">
                {list.map((item, i) => (
                  <li
                    key={item}
                    className="flex gap-6 border-b border-current/15 py-5"
                  >
                    <span className="micro tabular pt-1.5 opacity-60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-lede">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        {video ? (
          <div className="mt-20 grid gap-12 md:grid-cols-[minmax(0,22rem)_1fr] md:items-center">
            <div data-motion="tilt">
              <VideoCard
                video={video}
                sizes="(min-width: 768px) 352px, 100vw"
              />
            </div>
            <p className="font-display text-title max-w-[18ch]">
              What a managed plantation{' '}
              <span className="em-oil">gives you</span>, in 37 seconds.
            </p>
          </div>
        ) : null}
      </section>

      <section className="on-ink bg-ink text-bone grain">
        <div className="mx-auto grid max-w-[96rem] gap-16 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
          <div>
            <SectionHead
              index="04"
              eyebrow="How your land earns"
              title={
                <>
                  One crop, <span className="em-oil">decades of oil.</span>
                </>
              }
            />
            <p className="text-lede text-sand mt-8">
              Supergene oil palms start producing crude palm oil from year{' '}
              {estate?.incomeStartYear ?? 3} and stay productive for{' '}
              {estate?.productiveLifeText ?? '25 to 30 years'}. Jaylead
              processes and sells the oil; you receive your share yearly.
            </p>
            {estate?.headlineStatsConfirmed &&
            estate.headlineStats?.totalTrees ? (
              <p
                className="font-display text-figure mt-10"
                data-motion="counter"
              >
                {estate.headlineStats.totalTrees.toLocaleString('en-NG')} palms
              </p>
            ) : null}
          </div>
          <div>
            <p className="micro text-sand">Fully managed, zero hassle</p>
            <p className="font-display mt-6 text-3xl leading-tight md:text-4xl">
              You don’t hire staff, buy equipment, negotiate with buyers or
              supervise anything.
            </p>
            <p className="text-sand mt-6">
              Jaylead’s Agriculture, Project Management and Finance teams run
              the farm and report to owners.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[96rem] gap-16 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
        <div>
          <SectionHead
            index="05"
            eyebrow="See it for yourself"
            title="Come and look."
          />
          <p className="text-lede mt-8 opacity-85">
            Site inspections, office visits, Farm Updates on the{' '}
            <Link href="/blog" className="link-under">
              blog
            </Link>{' '}
            and on Instagram.
          </p>
          <div className="mt-8 overflow-hidden">
            <div data-motion="unmask">
              <Photo
                image={images['aerial-perimeter']}
                sizes="(min-width: 768px) 45vw, 100vw"
                aspect={16 / 10}
              />
            </div>
          </div>
        </div>
        <div className="md:pt-40">
          <SectionHead
            index="06"
            eyebrow="What could go wrong"
            title="Honestly."
            size="title"
          />
          <p className="text-lede mt-6 opacity-85">
            Yields depend on weather, pests and palm oil prices. Harvests can
            come later than planned, and land takes time to sell. Returns are
            not guaranteed.
          </p>
          <Link
            href="/legal/risk-disclosure"
            className="link-under mt-6 inline-block"
          >
            Read the risk disclosure
          </Link>
          <p className="font-display em-oil mt-16 text-3xl leading-tight">
            Every plot sold and every tree planted helps close Nigeria’s palm
            oil gap while building a legacy that outlives the owner.
          </p>
        </div>
      </section>

      {trustFaqs.length ? (
        <section className="bg-bone-deep">
          <div className="mx-auto grid max-w-[96rem] gap-14 px-(--gutter) py-28 md:py-40 lg:grid-cols-[1fr_1.7fr]">
            <SectionHead
              index="07"
              eyebrow="Questions"
              title="Can we trust you?"
            />
            <FaqList items={trustFaqs} />
          </div>
        </section>
      ) : null}

      <CtaBand
        title={
          <>
            Ask us <span className="em-oil">anything.</span>
          </>
        }
      >
        <WhatsAppLink template="general">Talk to an advisor</WhatsAppLink>
        <Link href="/marketplace" className="pill pill-ghost">
          View the marketplace
        </Link>
      </CtaBand>
    </MotionScope>
  );
}
