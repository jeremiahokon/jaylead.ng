/**
 * Root layout: html, fonts and site-wide metadata only. Page chrome lives in
 * app/(site)/layout.tsx so the Studio at /studio renders bare.
 *
 * Three font files, 30 KB together, each with a drawn-in naira sign (see
 * scripts/build-fonts.sh): Bespoke Slab roman and italic for display (its
 * heavy slab italic matches the Jaylead wordmark), Lexend for text (built
 * for reading proficiency).
 */
import localFont from 'next/font/local';

import type { Metadata, Viewport } from 'next';

import { siteKeywords, siteUrl } from '@/lib/site';

import './globals.css';

const slab = localFont({
  src: [
    { path: '../fonts/bespoke-slab.woff2', weight: '700', style: 'normal' },
    {
      path: '../fonts/bespoke-slab-italic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-slab',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});

const lexend = localFont({
  src: '../fonts/lexend.woff2',
  weight: '400 700',
  variable: '--font-lexend',
  display: 'swap',
  adjustFontFallback: 'Arial',
});

const title = 'Jaylead AgriEstate: Titled Oil Palm Farmland in Osun, Nigeria';

const description =
  'Own titled oil-palm farmland from ₦4,000,000. We plant and manage it; you earn from the harvest from year 3. CAC registered, RC 9492571.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: '%s' },
  description,
  keywords: siteKeywords,
  applicationName: 'Jaylead AgriEstate',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Jaylead AgriEstate',
    locale: 'en_NG',
    title,
    description,
    url: '/',
  },
  twitter: { card: 'summary_large_image', title, description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0d3924',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NG"
      data-scroll-behavior="smooth"
      className={`${slab.variable} ${lexend.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
