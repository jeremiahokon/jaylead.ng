/**
 * Footer (brief 7.6): a closing typographic statement, then Explore,
 * Company and Legal as word lists, Get in touch with the landmark address,
 * credentials in micro caps, the payment-safety line and the legal line,
 * with the founder's "2 + 2 = 22" once, small. Socials are words, not icons,
 * and only appear when their URL is set.
 */
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { PaymentSafety } from '@/components/payment-safety';

import { buildYear } from '@/lib/build-year';
import { getSettings, getShownCredentials } from '@/lib/content';
import type { SocialPlatform } from '@/lib/types';
import { utils } from '@/lib/utils';

const socialName: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'X',
};

const columns: [string, [string, string][]][] = [
  [
    'Explore',
    [
      ['Home', '/'],
      ['Marketplace', '/marketplace'],
      ['Invest', '/invest'],
      ['Why Us', '/why-us'],
      ['Blog', '/blog'],
    ],
  ],
  [
    'Company',
    [
      ['About', '/about'],
      ['Become a Realtor', '/become-a-realtor'],
      ['NYSC', '/nysc'],
      ['Contact', '/contact'],
    ],
  ],
  [
    'Legal',
    [
      ['Privacy Policy', '/legal/privacy-policy'],
      ['Terms', '/legal/terms'],
      ['Risk Disclosure', '/legal/risk-disclosure'],
    ],
  ],
];

export async function SiteFooter() {
  const s = await getSettings();
  const creds = await getShownCredentials();
  const year = await buildYear();

  return (
    <footer className="on-ink bg-ink text-bone grain">
      <div className="mx-auto max-w-[96rem] px-(--gutter) pt-24 pb-10">
        <p className="font-display text-display max-w-[16ch]">
          Real assets. <span className="em-oil">Real harvests.</span> Real
          legacy.
        </p>

        <div className="mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,0.8fr)_1.3fr]">
          <div>
            <Logo tone="light" className="h-9" />
            <p className="text-small text-sand mt-6 max-w-xs">
              {s.missionShort}
            </p>
            {s.socials.length ? (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {s.socials.map(({ platform, url }) => (
                  <li key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener"
                      className="micro link-draw"
                    >
                      {socialName[platform]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {columns.map(([title, links]) => (
            <div key={title}>
              <h2 className="micro text-mist">{title}</h2>
              <ul className="mt-5 grid gap-2.5">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="link-draw text-small">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="micro text-mist">Get in touch</h2>
            <address className="text-small mt-5 grid gap-3 not-italic">
              <p>
                {s.address.line1}, {s.address.landmarkDirections},{' '}
                {s.address.city}, {s.address.state}.{' '}
                <a
                  href={s.address.mapsUrl}
                  target="_blank"
                  rel="noopener"
                  className="link-under text-oil-light"
                >
                  Open in Google Maps
                </a>
              </p>
              <p>
                <a
                  href={utils.contact.telHref(s.phoneE164)}
                  className="tabular link-draw"
                >
                  {s.phoneDisplay}
                </a>
                <span className="text-mist"> · </span>
                <a
                  href={utils.contact.whatsappHref(s, 'general')}
                  target="_blank"
                  rel="noopener"
                  className="link-draw"
                >
                  WhatsApp
                </a>
              </p>
              <p>
                <a href={`mailto:${s.email}`} className="link-draw break-all">
                  {s.email}
                </a>
              </p>
              <p className="text-sand">
                {utils.format.hours(s.officeHours)} (WAT)
              </p>
              <p className="text-sand">
                Led by Adetunji Jacob Ogunyemi, Managing Director.{' '}
                <a
                  href={s.cacVerifyUrl}
                  target="_blank"
                  rel="noopener"
                  className="link-under text-bone"
                >
                  Verify RC {s.rcNumber} on CAC
                </a>
              </p>
            </address>
          </div>
        </div>

        <ul
          className="micro text-sand mt-16 flex flex-wrap gap-x-8 gap-y-2"
          aria-label="Registrations"
        >
          {creds.map((c) => (
            <li key={c._id}>
              {c.name.startsWith('CAC')
                ? `${c.shortName} · ${c.value}`
                : c.shortName}
            </li>
          ))}
          <li>Independent audits welcome</li>
        </ul>

        <PaymentSafety className="text-sand mt-8" />

        <div className="micro text-mist mt-12 flex flex-col gap-3 border-t border-current/15 pt-6 md:flex-row md:justify-between">
          <p>
            © {year} {s.legalName}. RC {s.rcNumber}. All rights reserved.
          </p>
          <p>
            Built by{' '}
            <a
              href="https://jeremiahokon.online"
              target="_blank"
              rel="noopener"
              className="link-under text-bone"
            >
              Jeremiah Okon
            </a>
          </p>
          <p className="tabular">2 + 2 = 22: our partnership maths</p>
        </div>
      </div>
    </footer>
  );
}
