/**
 * Contact (brief 9.13, D15): WhatsApp first, call second, email third, then
 * the office with landmark directions and a Google Maps link (no map iframe
 * on load), the enquiry form (explicitly secondary), the inspection form,
 * and who you are dealing with.
 */
import type { Metadata } from 'next';

import { FaqSection } from '@/components/faq-section';
import { JsonLd } from '@/components/json-ld';
import { LeadForm } from '@/components/lead-form';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';
import { Photo } from '@/components/photo';
import { SectionHead } from '@/components/section-head';
import { TrustBlock } from '@/components/trust-block';
import { ReplyNote } from '@/components/whatsapp-cta';

import { getFaqs, getSettings } from '@/lib/content';
import { faqNode } from '@/lib/jsonld';
import { cn, utils } from '@/lib/utils';

import { images } from '@/data/images';

const title = 'Contact Jaylead AgriEstate: Tanke, Ilorin, Kwara State';

const description =
  'WhatsApp or call +234 916 099 2539, or visit our office beside Mazabs Event Centre, Tanke, Ilorin.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: { title, description, url: '/contact' },
};

export default async function Contact() {
  const [s, faqs] = await Promise.all([getSettings(), getFaqs()]);

  const visitFaqs = faqs.filter(
    (f) => f.group === 'Visiting and contact' || f.group === 'Company and trust'
  );

  const crumbs = [{ name: 'Contact', path: '/contact' }];

  const channels = [
    {
      label: 'WhatsApp',
      value: 'Chat with an advisor',
      href: utils.contact.whatsappHref(s, 'general'),
      external: true,
    },
    {
      label: 'Call',
      value: s.phoneDisplay,
      href: utils.contact.telHref(s.phoneE164),
    },
    { label: 'Email', value: s.email, href: `mailto:${s.email}` },
  ];

  return (
    <MotionScope>
      <JsonLd
        path="/contact"
        title={title}
        description={description}
        crumbs={crumbs}
        type="ContactPage"
        extra={[faqNode(visitFaqs, '/contact')]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Contact"
        title={[
          { text: 'Let’s talk about' },
          { text: 'growing your wealth.', className: 'em-oil' },
        ]}
      />

      <section className="mx-auto max-w-[96rem] px-(--gutter) pb-24">
        <ul className="border-t border-current/20">
          {channels.map((c, i) => (
            <li key={c.label} className="border-b border-current/20">
              <a
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener' : undefined}
                className="group grid gap-2 py-8 md:grid-cols-[4rem_12rem_1fr] md:items-baseline md:gap-8 md:py-12"
              >
                <span className="micro tabular opacity-60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="micro opacity-80">{c.label}</span>
                <span
                  className={cn(
                    'font-display tabular transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-x-3',
                    c.label === 'Email'
                      ? 'text-[clamp(1.5rem,3.4vw,3.25rem)] break-words'
                      : 'text-display'
                  )}
                >
                  {c.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <ReplyNote className="mt-6" />
      </section>

      <section className="bg-bone-deep">
        <div className="mx-auto grid max-w-[96rem] gap-14 px-(--gutter) py-28 md:grid-cols-2 md:py-40">
          <div>
            <SectionHead
              index="01"
              eyebrow="The office"
              title={
                <>
                  Beside Mazabs Event Centre,{' '}
                  <span className="em-oil">Tanke.</span>
                </>
              }
            />
            <address className="text-lede mt-10 grid gap-3 not-italic">
              <p>
                {s.address.line1}, {s.address.landmarkDirections},{' '}
                {s.address.city}, {s.address.state}.
              </p>
              <p className="opacity-80">
                {utils.format.hours(s.officeHours)} (WAT).
              </p>
            </address>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={s.address.mapsUrl}
                target="_blank"
                rel="noopener"
                className="pill"
              >
                Open in Google Maps
              </a>
              <a
                href={utils.contact.whatsappHref(s, 'office-visit')}
                target="_blank"
                rel="noopener"
                className="pill pill-ghost"
              >
                Plan a visit on WhatsApp
              </a>
            </div>
          </div>
          <a
            href={s.address.mapsUrl}
            target="_blank"
            rel="noopener"
            aria-label="Open the office location in Google Maps"
            className="group block overflow-hidden"
          >
            {s.address.mapImage ? (
              <Photo
                image={s.address.mapImage}
                sizes="(min-width: 768px) 45vw, 100vw"
                aspect={4 / 3}
              />
            ) : (
              <Photo
                image={images['office-logo-wall']}
                sizes="(min-width: 768px) 45vw, 100vw"
                aspect={4 / 3}
                imgClassName="transition-transform duration-[1400ms] group-hover:scale-[1.04]"
              />
            )}
          </a>
        </div>
      </section>

      <section
        id="inspection"
        className="mx-auto grid max-w-[96rem] gap-14 px-(--gutter) py-28 md:grid-cols-[1fr_1.3fr] md:gap-20 md:py-40"
      >
        <div className="md:sticky md:top-28 md:self-start">
          <SectionHead
            index="02"
            eyebrow="Prefer to write?"
            title={
              <>
                Tell us what <span className="em-oil">you’re after.</span>
              </>
            }
            lede="Four quick taps, then your number. To book a site inspection, choose “Visit the farm”."
            size="title"
          />
        </div>
        <LeadForm sourcePage="/contact" />
      </section>

      <FaqSection
        index="03"
        title="Visiting, paying and trust."
        items={visitFaqs}
        withPaymentSafety
        tone="plain"
      />

      <section className="bg-bone-deep">
        <div className="mx-auto max-w-[96rem] px-(--gutter) py-24 md:py-36">
          <TrustBlock />
        </div>
      </section>
    </MotionScope>
  );
}
