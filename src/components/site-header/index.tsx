/**
 * Header (brief 7.1), quiet and typographic. Desktop: the logo, seven links
 * in micro caps (all direct links, no dropdown), the phone number and the
 * "Talk to an advisor" pill. Mobile: the logo and a "Menu" toggle that opens
 * a full-height panel with no JavaScript (a <details> element). The header
 * stays put while scrolling: no hide-and-show, which fought the smooth scroll.
 */
import Link from 'next/link';

import { Logo } from '@/components/logo';

import { getSettings } from '@/lib/content';
import { utils } from '@/lib/utils';

import { MenuCloser } from './menu-closer';
import { nav } from './nav';

export async function SiteHeader() {
  const s = await getSettings();
  const wa = utils.contact.whatsappHref(s, 'general');

  const bar =
    s.announcementBar?.enabled && s.announcementBar.text
      ? s.announcementBar
      : null;

  const mobileLinks = nav;

  return (
    <>
      {bar ? (
        <div className="announcement-bar bg-ink text-bone micro px-(--gutter) py-2.5 text-center">
          {bar.link ? (
            <Link href={bar.link} className="link-draw">
              {bar.text}
            </Link>
          ) : (
            bar.text
          )}
        </div>
      ) : null}
      <header className="site-header bg-bone sticky top-0 z-40 shadow-[0_1px_0_var(--color-rule)]">
        <div className="mx-auto flex h-(--header-h) max-w-[96rem] items-center justify-between gap-6 px-(--gutter)">
          <Link
            href="/"
            className="shrink-0"
            aria-label="Jaylead AgriEstate, home"
          >
            <Logo className="h-8 md:h-9" />
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="micro link-draw py-3">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-6 xl:flex">
            <a
              href={utils.contact.telHref(s.phoneE164)}
              className="micro tabular link-draw whitespace-nowrap"
            >
              {s.phoneDisplay}
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              className="pill group min-h-11 px-5 text-sm whitespace-nowrap"
            >
              Talk to an advisor
            </a>
          </div>

          <details id="mobile-menu" className="mobile-menu xl:hidden">
            <summary className="micro flex min-h-11 items-center gap-3 px-1">
              <span className="[.mobile-menu[open]_&]:hidden">Menu</span>
              <span className="hidden [.mobile-menu[open]_&]:inline">
                Close
              </span>
              <span aria-hidden className="flex w-6 flex-col gap-1.5">
                <span className="h-px w-full bg-current transition-transform duration-500 [.mobile-menu[open]_&]:translate-y-[3.5px] [.mobile-menu[open]_&]:rotate-45" />
                <span className="h-px w-full bg-current transition-transform duration-500 [.mobile-menu[open]_&]:-translate-y-[3.5px] [.mobile-menu[open]_&]:-rotate-45" />
              </span>
            </summary>
            <div
              className="mobile-menu-panel on-ink bg-ink text-bone fixed inset-x-0 top-(--header-h) bottom-0 z-50 flex flex-col overflow-y-auto px-(--gutter) pt-8 pb-10"
              data-lenis-prevent
            >
              <nav aria-label="Mobile">
                <ul>
                  {mobileLinks.map((item, i) => (
                    <li
                      key={item.href + item.label}
                      className="overflow-hidden border-b border-current/15"
                    >
                      <Link
                        href={item.href}
                        className="menu-link font-display flex min-h-16 items-center justify-between text-4xl"
                        style={{ '--i': i } as React.CSSProperties}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto grid gap-3 pt-10">
                <a href={wa} target="_blank" rel="noopener" className="pill">
                  Talk to an advisor on WhatsApp
                </a>
                <a
                  href={utils.contact.telHref(s.phoneE164)}
                  className="pill pill-ghost tabular"
                >
                  Call {s.phoneDisplay}
                </a>
                <p className="micro text-sand mt-2">{s.whatsappReplyNote}</p>
              </div>
            </div>
          </details>
          <MenuCloser id="mobile-menu" />
        </div>
      </header>
    </>
  );
}
