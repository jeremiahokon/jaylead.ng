/**
 * Invest (brief 9.8; D1, D10, D11, D12). Customer or investor first, then
 * Option A against Option B as a plain table. While the CMS switch
 * investPage.figuresVisible is off (the default until written legal/SEC
 * advice is recorded), every percentage and naira figure reads "Terms
 * shared privately by an advisor" and the illustrative calculator is not
 * rendered. "Before you invest" is always visible, at body size.
 */
import Link from 'next/link';

import type { Metadata } from 'next';

import { CtaBand } from '@/components/cta-band';
import { FaqSection } from '@/components/faq-section';
import { JsonLd } from '@/components/json-ld';
import { MotionScope } from '@/components/motion';
import { OptionACalculator } from '@/components/option-a-calculator';
import { PageHero } from '@/components/page-hero';
import { PaymentSafety } from '@/components/payment-safety';
import { RichText } from '@/components/rich-text';
import { SectionHead } from '@/components/section-head';
import { TrustBlock } from '@/components/trust-block';
import { TrustLine } from '@/components/trust-line';
import { CtaGroup, WhatsAppLink } from '@/components/whatsapp-cta';

import { getFaqs, getInvestOptions, getInvestPage } from '@/lib/content';
import { faqNode } from '@/lib/jsonld';
import type { InvestOption } from '@/lib/types';
import { utils } from '@/lib/utils';

const title = 'Investment Options: Own a Plot or Fund the Project';

const description =
  'Compare owning a plot with investing in Jaylead’s farming operation under Option A or Option B.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/invest' },
  openGraph: { title, description, url: '/invest' },
};

const PRIVATE = 'Terms shared privately by an advisor';

function rows(
  a: InvestOption | undefined,
  b: InvestOption | undefined,
  show: boolean
): [string, string, string][] {
  const fig = (v: string | undefined) => (show && v ? v : PRIVATE);

  return [
    ['Who it is for', a?.whoItsFor ?? '', b?.whoItsFor ?? ''],
    [
      'Amount',
      fig(
        a?.minAmount && a.maxAmount
          ? `${utils.format.naira(a.minAmount)} to ${utils.format.naira(a.maxAmount)}`
          : undefined
      ),
      'Agreed per loan',
    ],
    [
      'Yearly payout',
      fig(
        a?.yearlyRatePercent
          ? `${a.yearlyRatePercent}% of the amount invested, paid yearly, until ${a.recoveryMultiple}x the amount has been paid out`
          : undefined
      ),
      b?.fixedRateText ?? 'Agreed fixed interest rate',
    ],
    [
      'After recovery',
      fig(
        a?.royaltyRatePercent
          ? `${a.royaltyRatePercent}% of the original amount, paid yearly, for the remaining project life (up to ${a.projectLifeYears} years)`
          : undefined
      ),
      'None: the loan is repaid and closed',
    ],
    [
      'Duration',
      a?.projectLifeYears
        ? `Up to ${a.projectLifeYears} years`
        : 'Project life',
      b?.termText ?? 'Agreed loan term',
    ],
    ['Exit', a?.exitText ?? '', b?.exitText ?? ''],
    [
      'Availability',
      a?.investorCap ? `Available to ${a.investorCap} investors` : 'Limited',
      'Open',
    ],
  ];
}

export default async function Invest() {
  const [options, page, faqs] = await Promise.all([
    getInvestOptions(),
    getInvestPage(),
    getFaqs(),
  ]);

  const a = options.find((o) => o.key === 'option-a');
  const b = options.find((o) => o.key === 'option-b');
  const show = page.figuresVisible;
  const crumbs = [{ name: 'Invest', path: '/invest' }];

  return (
    <MotionScope>
      <JsonLd
        path="/invest"
        title={title}
        description={description}
        crumbs={crumbs}
        extra={[
          faqNode(
            faqs.filter((f) => f.group === 'Investing in the project'),
            '/invest'
          ),
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Invest"
        title={[
          { text: 'Two ways in.', breakAfter: true },
          { text: 'One mission:', className: 'em-oil' },
          { text: 'your money, working the land.' },
        ]}
      >
        <CtaGroup>
          <WhatsAppLink template="invest-compare" magnetic>
            Help me choose
          </WhatsAppLink>
        </CtaGroup>
        <TrustLine className="mt-10" />
      </PageHero>

      <section className="mx-auto max-w-[96rem] px-(--gutter) pb-28 md:pb-40">
        <SectionHead
          index="01"
          eyebrow="Customer or investor?"
          title="Which route fits you."
        />
        <div className="mt-14 grid border-t border-current/20 md:grid-cols-2">
          <div className="border-b border-current/20 py-10 md:border-r md:pr-12">
            <h3 className="font-display text-title">If you want to own land</h3>
            <p className="text-lede mt-5 opacity-85">
              You buy a plot in a size that suits you. The land is yours,
              Jaylead plants and manages it, and you earn yearly from what it
              produces for as long as the palms are productive.
            </p>
            <Link href="/marketplace" className="pill mt-8">
              Browse available plots
            </Link>
          </div>
          <div className="border-b border-current/20 py-10 md:pl-12">
            <h3 className="font-display text-title">
              If you want to invest in the project
            </h3>
            <p className="text-lede mt-5 opacity-85">
              You are not buying a specific plot. You are funding Jaylead’s
              farming operation under Option A or Option B.
            </p>
            <a href="#options" className="pill pill-ghost mt-8">
              Compare Option A and Option B
            </a>
          </div>
        </div>
      </section>

      <section id="options" className="bg-bone-deep">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
          <SectionHead
            index="02"
            eyebrow="Side by side"
            title={
              <>
                Option A <span className="em-oil">or</span> Option B.
              </>
            }
          />
          <div data-motion="reveal" className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left">
              <caption className="sr-only">
                Option A compared with Option B
              </caption>
              <thead>
                <tr className="border-b border-current/25">
                  <td className="w-[20%] py-5" />
                  <th scope="col" className="font-display py-5 pr-6 text-3xl">
                    {a?.name ?? 'Option A'}
                  </th>
                  <th scope="col" className="font-display py-5 pr-6 text-3xl">
                    {b?.name ?? 'Option B'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows(a, b, show).map(([label, va, vb]) => (
                  <tr key={label} className="border-b border-current/15">
                    <th
                      scope="row"
                      className="micro py-6 pr-6 align-top font-bold opacity-70"
                    >
                      {label}
                    </th>
                    <td
                      className={`py-6 pr-6 align-top ${va === PRIVATE ? 'italic opacity-70' : ''}`}
                    >
                      {va}
                    </td>
                    <td className="py-6 pr-6 align-top">{vb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[96rem] gap-20 px-(--gutter) py-28 md:py-40 lg:grid-cols-2">
        {[a, b].filter(Boolean).map((o) => (
          <article key={o!._id}>
            <p className="micro opacity-70">
              {o!.key === 'option-a'
                ? 'Option A in detail'
                : 'Option B in detail'}
            </p>
            <h2 data-motion="lines" className="font-display text-display mt-6">
              {o!.name.replace(/^Option [AB]: /, '')}
            </h2>
            <p className="font-display em-oil mt-4 text-2xl">{o!.tagline}</p>
            <div className="text-lede mt-8 grid gap-5 opacity-85">
              {o!.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-10">
              <WhatsAppLink
                template={o!.whatsappTemplateKey}
              >{`Talk to an advisor about ${o!.key === 'option-a' ? 'Option A' : 'Option B'}`}</WhatsAppLink>
            </div>
          </article>
        ))}
      </section>

      {show &&
      a?.minAmount &&
      a.maxAmount &&
      a.yearlyRatePercent &&
      a.recoveryMultiple &&
      a.royaltyRatePercent &&
      a.projectLifeYears ? (
        <section className="mx-auto max-w-[96rem] px-(--gutter) pb-28">
          <SectionHead
            index="03"
            eyebrow="Option A"
            title="Illustrative example, not a promise"
            size="title"
          />
          <div className="mt-12">
            <OptionACalculator
              min={a.minAmount}
              max={a.maxAmount}
              terms={{
                yearlyRatePercent: a.yearlyRatePercent,
                recoveryMultiple: a.recoveryMultiple,
                royaltyRatePercent: a.royaltyRatePercent,
                projectLifeYears: a.projectLifeYears,
              }}
            />
          </div>
        </section>
      ) : null}

      <section className="on-ink bg-ink text-bone grain">
        <div className="mx-auto grid max-w-[96rem] gap-16 px-(--gutter) py-28 md:py-40 lg:grid-cols-2">
          <div>
            <SectionHead
              index="04"
              eyebrow="How to start"
              title="Five steps, all on paper."
            />
            <ol className="mt-12 border-t border-current/20">
              {[
                'Speak with an advisor.',
                'Review the legal documentation for your option.',
                'Get independent advice.',
                'Complete payment into the company account (full or instalment, per your agreement).',
                'Receive your documents and onboarding pack, including when and how payments reach you.',
              ].map((s, i) => (
                <li
                  key={s}
                  className="flex gap-6 border-b border-current/20 py-5"
                >
                  <span className="micro tabular text-oil-light pt-1.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-lede">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div id="before-you-invest">
            <p className="micro text-oil-light">Before you invest</p>
            <RichText
              value={page.riskDisclosure}
              className="text-bone [&_p]:!text-bone mt-6 !text-xl"
            />
            <Link
              href="/legal/risk-disclosure"
              className="link-under text-bone mt-6 inline-block"
            >
              Read the full risk disclosure
            </Link>
            <PaymentSafety className="text-sand mt-12" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[96rem] px-(--gutter) py-24 md:py-36">
        <TrustBlock />
      </section>

      <FaqSection
        index="05"
        title="Investing in the project."
        items={faqs.filter((f) => f.group === 'Investing in the project')}
        withPaymentSafety
      />

      <CtaBand
        title={
          <>
            Talk it through <span className="em-oil">first.</span>
          </>
        }
        lede="An advisor will walk you through the terms, the documents and the risks before anything is signed."
      >
        <WhatsAppLink template="invest-a">About Option A</WhatsAppLink>
        <WhatsAppLink template="invest-b" variant="ghost">
          About Option B
        </WhatsAppLink>
      </CtaBand>
    </MotionScope>
  );
}
