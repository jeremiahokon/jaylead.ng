/**
 * Become a Realtor (brief 9.9, D14): the Jaylead Realty Academy. Certified,
 * never "licensed"; commission rates are not published until the client
 * supplies them.
 */
import type { Metadata } from 'next';

import { CtaBand } from '@/components/cta-band';
import { FaqSection } from '@/components/faq-section';
import { JsonLd } from '@/components/json-ld';
import { LeadForm } from '@/components/lead-form';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';
import { SectionHead } from '@/components/section-head';
import { CtaGroup, WhatsAppLink } from '@/components/whatsapp-cta';

import { getFaqs } from '@/lib/content';
import { faqNode } from '@/lib/jsonld';

const title = 'Become a Realtor: Jaylead Realty Academy, Ilorin';

const description =
  'Training and commission for people who want to sell land-backed agriculture with Jaylead.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/become-a-realtor' },
  openGraph: { title, description, url: '/become-a-realtor' },
};

const why = [
  [
    'An easier conversation',
    'Titled, income-producing farmland is easier to explain than raw land, and every buyer can inspect it.',
  ],
  [
    'Structured training',
    'The product, the paperwork and the sales process, taught properly before you sell.',
  ],
  [
    'Commission on every closed sale',
    'Paid on each sale you close. The structure is shared when you join.',
  ],
  [
    'Ongoing support',
    'Our Sales and Customer Relations teams back you on every enquiry.',
  ],
];

const modules = [
  'Understanding agro real estate and land-backed assets',
  'The oil palm model: planting, harvest and income from year 3',
  'Title documents and how to explain them honestly',
  'The Jaylead sales process, from first chat to signed agreement',
];

const who = [
  'Students looking for flexible income',
  'Professionals who want a second income stream',
  'Career changers moving into real estate',
  'Existing agents who want an agricultural product',
];

const steps = [
  'Apply using the form below',
  'Speak with our team',
  'Complete the Jaylead Realty Academy training',
  'Get certified as a Jaylead Realty Partner',
  'Start selling, with our support',
];

export default async function Realtor() {
  const realtorFaqs = (await getFaqs()).filter((f) => f.group === 'Realtors');
  const crumbs = [{ name: 'Become a Realtor', path: '/become-a-realtor' }];

  const list = (items: string[]) => (
    <ol data-motion="stagger" className="border-t border-current/20">
      {items.map((t, i) => (
        <li key={t} className="flex gap-6 border-b border-current/15 py-5">
          <span className="micro tabular pt-1.5 opacity-60">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-lede">{t}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <MotionScope>
      <JsonLd
        path="/become-a-realtor"
        title={title}
        description={description}
        crumbs={crumbs}
        extra={[faqNode(realtorFaqs, '/become-a-realtor')]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Jaylead Realty Academy"
        title={[
          { text: 'Sell land.' },
          { text: 'Sell legacy.', className: 'em-oil' },
          { text: 'Earn on every sale.' },
        ]}
        lede="The Jaylead Realty Academy trains everyday Nigerians (students, professionals, career changers) to become confident, certified Jaylead Realty Partners. No prior experience needed."
      >
        <CtaGroup>
          <a href="#apply" className="pill">
            Apply now
          </a>
          <WhatsAppLink template="realtor" variant="ghost">
            Chat on WhatsApp
          </WhatsAppLink>
        </CtaGroup>
      </PageHero>

      <section className="mx-auto max-w-[96rem] px-(--gutter) pb-28 md:pb-40">
        <SectionHead
          index="01"
          eyebrow="Why sell with Jaylead"
          title="A product you can stand behind."
        />
        <ul
          data-motion="tilt"
          className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4"
        >
          {why.map(([h, b]) => (
            <li key={h} className="border-t border-current/25 pt-6">
              <h3 className="font-display text-3xl">{h}</h3>
              <p className="text-small mt-4 opacity-85">{b}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="on-ink bg-ink text-bone grain">
        <div className="mx-auto grid max-w-[96rem] gap-16 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
          <div>
            <SectionHead
              index="02"
              eyebrow="What the academy covers"
              title="Four modules."
            />
            <div className="mt-12">{list(modules)}</div>
          </div>
          <div>
            <SectionHead
              index="03"
              eyebrow="Who should apply"
              title="You, probably."
            />
            <div className="mt-12">{list(who)}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[96rem] gap-16 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
        <div>
          <SectionHead index="04" eyebrow="How it works" title="Five steps." />
          <div className="mt-12">{list(steps)}</div>
        </div>
        <div id="apply">
          <SectionHead
            index="05"
            eyebrow="Apply"
            title={
              <>
                Join the <span className="em-oil">academy.</span>
              </>
            }
            size="title"
          />
          <LeadForm
            type="realtor"
            submitLabel="Send my application"
            sourcePage="/become-a-realtor"
            className="mt-10"
          />
        </div>
      </section>

      <FaqSection index="06" title="For new realtors." items={realtorFaqs} />

      <CtaBand
        title={
          <>
            Questions <span className="em-oil">first?</span>
          </>
        }
      >
        <WhatsAppLink template="realtor">Chat on WhatsApp</WhatsAppLink>
      </CtaBand>
    </MotionScope>
  );
}
