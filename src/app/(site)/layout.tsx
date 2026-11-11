/**
 * Public site chrome: skip link, header, footer and eased scrolling. No
 * persistent bottom bar or floating button (the owner removed both; see
 * docs/design-direction.md): WhatsApp lives in the header and every CTA.
 */
import { Suspense } from 'react';

import { Analytics } from '@/components/analytics';
import { DraftPreview } from '@/components/draft-preview';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SmoothScroll } from '@/components/smooth-scroll';

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="bg-ink text-bone micro sr-only z-[60] px-4 py-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      {/* usePathname inside: Suspense keeps the chrome prerendered on any route with an unknown param */}
      <Suspense fallback={null}>
        <SmoothScroll />
      </Suspense>
      <Suspense fallback={null}>
        <DraftPreview />
      </Suspense>
      <Analytics />
    </>
  );
}
