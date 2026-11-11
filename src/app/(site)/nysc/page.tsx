/**
 * NYSC (brief 9.10). Kept live without the word "accredited" in the
 * headline until the PPA accreditation letter is supplied and the NYSC
 * credential is set to "shown".
 */
import type { Metadata } from 'next';

import { FaqSection } from '@/components/faq-section';
import { JsonLd } from '@/components/json-ld';
import { LeadForm } from '@/components/lead-form';
import { Marquee } from '@/components/marquee';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';
import { SectionHead } from '@/components/section-head';
import { CtaGroup, WhatsAppLink } from '@/components/whatsapp-cta';

import { getCredentials, getDepartments, getFaqs } from '@/lib/content';
import { faqNode } from '@/lib/jsonld';

const title = 'NYSC Corps Members: Serve at Jaylead AgriEstate, Ilorin';

const description =
  'Place of Primary Assignment across 11 departments at Jaylead AgriEstate in Tanke, Ilorin, Kwara State.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/nysc' },
  openGraph: { title, description, url: '/nysc' },
};

const why = [
  'Real responsibility in a growing company, from week one',
  'Experience across agriculture, real estate, finance and technology',
  'Mentorship from the leadership team',
  'A professional office in Tanke, Ilorin',
];

const how = [
  'Request placement using the form or WhatsApp',
  'Share your call-up letter and posting details',
  'Meet the team for a short conversation',
  'Receive your acceptance letter for your PPA',
];

export default async function Nysc() {
  const [departments, creds, faqs] = await Promise.all([
    getDepartments(),
    getCredentials(),
    getFaqs(),
  ]);

  const nyscFaqs = faqs.filter((f) => f.group === 'NYSC');

  const nysc = creds.find((c) => /nysc/i.test(c.name));
  const accredited = nysc?.status === 'shown';
  const crumbs = [{ name: 'NYSC', path: '/nysc' }];

  return (
    <MotionScope>
      <JsonLd
        path="/nysc"
        title={title}
        description={description}
        crumbs={crumbs}
        extra={[faqNode(nyscFaqs, '/nysc')]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="NYSC · Place of Primary Assignment"
        title={
          accredited
            ? [
                { text: 'An approved PPA,' },
                { text: 'with real work', className: 'em-oil' },
                { text: `across ${departments.length} departments.` },
              ]
            : [
                { text: 'Serve your NYSC year' },
                { text: 'at Jaylead.', className: 'em-oil' },
              ]
        }
        lede={`Placements across ${departments.length} departments at our office in Tanke, Ilorin.`}
      >
        <CtaGroup>
          <a href="#placement" className="pill">
            Request placement
          </a>
          <WhatsAppLink template="nysc" variant="ghost">
            Ask on WhatsApp
          </WhatsAppLink>
        </CtaGroup>
      </PageHero>

      <Marquee items={departments.map((d) => d.name)} />

      <section className="mx-auto grid max-w-384 gap-16 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
        <div>
          <SectionHead
            index="01"
            eyebrow="Why serve at Jaylead"
            title="Work that counts."
          />
          <ol
            data-motion="stagger"
            className="mt-12 border-t border-current/20"
          >
            {why.map((t, i) => (
              <li
                key={t}
                className="flex gap-6 border-b border-current/15 py-5"
              >
                <span className="micro tabular pt-1.5 opacity-60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-lede">{t}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SectionHead
            index="02"
            eyebrow="Accreditation"
            title="Check first."
            size="title"
          />
          <p className="text-lede mt-6 opacity-85">
            {accredited
              ? 'Jaylead AgriEstate is an approved NYSC Place of Primary Assignment.'
              : 'Our PPA accreditation letter will be published here. Until then, ask us for verification before you commit.'}
          </p>
          {nysc?.documentUrl ? (
            <a href={nysc.documentUrl} className="link-under mt-4 inline-block">
              Download the accreditation letter
            </a>
          ) : null}
          <div className="mt-6">
            <WhatsAppLink template="nysc" variant="text">
              Request verification
            </WhatsAppLink>
          </div>
          <p className="micro mt-14 opacity-70">How to apply for placement</p>
          <ol className="mt-4 border-t border-current/20">
            {how.map((t, i) => (
              <li
                key={t}
                className="flex gap-6 border-b border-current/15 py-4"
              >
                <span className="micro tabular pt-1 opacity-60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="placement" className="bg-bone-deep">
        <div className="mx-auto grid max-w-384 gap-16 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
          <SectionHead
            index="03"
            eyebrow="Placement"
            title={
              <>
                Request a <span className="em-oil">placement.</span>
              </>
            }
          />
          <LeadForm
            submitLabel="Send my request"
            sourcePage="/nysc"
            defaults={{ goal: 'NYSC placement' }}
          />
        </div>
      </section>

      <FaqSection
        index="04"
        title="For corps members."
        items={nyscFaqs}
        tone="plain"
      />
    </MotionScope>
  );
}
