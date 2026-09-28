/**
 * Builds each page's single JSON-LD @graph (brief 13.2): WebSite, WebPage,
 * BreadcrumbList, the business as RealEstateAgent (also Organization), plus
 * whatever the page adds (Product/Offer, BlogPosting, VideoObject, FAQPage).
 * No review or rating markup, and no return, yield or interest figures ever.
 */
import { toPlainText } from '@portabletext/toolkit';

import { absolute, siteKeywords, siteUrl } from '@/lib/site';
import type { FaqItem, Plot, Post, SiteSettings, Video } from '@/lib/types';

export const id = (fragment: string) => `${siteUrl}/#${fragment}`;

export type Crumb = { name: string; path: string };

export function businessNode(s: SiteSettings) {
  return {
    '@type': ['RealEstateAgent', 'Organization'],
    '@id': id('business'),
    name: s.companyName,
    legalName: s.legalName,
    alternateName: ['Jaylead', 'Jaylead Agro'],
    slogan: s.tagline,
    description: s.mission,
    url: siteUrl,
    logo: absolute('/brand/jaylead-mark-512.png'),
    image: absolute('/images/office-logo-wall.webp'),
    telephone: s.phoneE164,
    email: s.email,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CAC RC',
      value: s.rcNumber,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${s.address.line1}, ${s.address.landmarkDirections}`,
      addressLocality: s.address.city,
      addressRegion: 'Kwara',
      addressCountry: 'NG',
    },
    ...(s.address.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: s.address.geo.lat,
            longitude: s.address.geo.lng,
          },
        }
      : {}),
    hasMap: s.address.mapsUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: s.officeHours[0]?.opens ?? '09:00',
        closes: s.officeHours[0]?.closes ?? '17:00',
      },
    ],
    areaServed: [
      { '@type': 'State', name: 'Kwara' },
      { '@type': 'State', name: 'Osun' },
      { '@type': 'Country', name: 'Nigeria' },
    ],
    founder: {
      '@type': 'Person',
      name: 'Adetunji Jacob Ogunyemi',
      jobTitle: 'Managing Director',
    },
    currenciesAccepted: 'NGN',
    keywords: siteKeywords.join(', '),
    sameAs: s.socials.map((x) => x.url),
  };
}

export function faqNode(faqs: FaqItem[], pagePath: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${absolute(pagePath)}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: toPlainText(f.answer) },
    })),
  };
}

export function offerNode(plot: Plot) {
  const availability = {
    available: 'https://schema.org/InStock',
    reserved: 'https://schema.org/LimitedAvailability',
    sold: 'https://schema.org/SoldOut',
  }[plot.status];

  return {
    '@type': 'Product',
    '@id': `${absolute(`/marketplace/${plot.slug}`)}#product`,
    name: plot.title,
    description: `${plot.sizeLabel} of titled farmland with ${plot.trees} Supergene oil palms at ${plot.estateName}, Osun State. Planted and managed by Jaylead AgriEstate.`,
    category: 'Agricultural land',
    brand: { '@id': id('business') },
    image: plot.thumbnail ? absolute(plot.thumbnail.src) : undefined,
    url: absolute(`/marketplace/${plot.slug}`),
    ...(plot.priceMode === 'on-request'
      ? {}
      : {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'NGN',
            price: plot.price,
            availability,
            seller: { '@id': id('business') },
            url: absolute(`/marketplace/${plot.slug}`),
          },
        }),
  };
}

export function videoNode(v: Video) {
  return {
    '@type': 'VideoObject',
    '@id': `${v.canonicalUrl}#video`,
    name: v.title,
    description: v.summary ?? v.title,
    thumbnailUrl: v.poster
      ? absolute(v.poster.src)
      : absolute('/brand/jaylead-mark-512.png'),
    ...(v.publishedOn ? { uploadDate: v.publishedOn } : {}),
    embedUrl: v.embedUrl.replace('?autoplay=1', ''),
    url: v.canonicalUrl,
  };
}

export function postNode(p: Post) {
  return {
    '@type': 'BlogPosting',
    '@id': `${absolute(`/blog/${p.slug}`)}#post`,
    headline: p.title,
    description: p.excerpt,
    image: p.coverImage.src.startsWith('http')
      ? p.coverImage.src
      : absolute(p.coverImage.src),
    datePublished: p.publishedAt,
    dateModified: p.updatedAt ?? p.publishedAt,
    author: { '@type': 'Person', name: p.author.name, jobTitle: p.author.role },
    publisher: { '@id': id('business') },
    articleSection: p.category.title,
    mainEntityOfPage: absolute(`/blog/${p.slug}`),
    inLanguage: 'en-NG',
  };
}

export function pageGraph(opts: {
  settings: SiteSettings;
  path: string;
  title: string;
  description: string;
  crumbs?: Crumb[];
  type?: string;
  extra?: object[];
}) {
  const url = absolute(opts.path);
  const crumbs = opts.crumbs ?? [];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': id('website'),
        url: siteUrl,
        name: opts.settings.companyName,
        inLanguage: 'en-NG',
        publisher: { '@id': id('business') },
      },
      {
        '@type': opts.type ?? 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: opts.title,
        description: opts.description,
        isPartOf: { '@id': id('website') },
        about: { '@id': id('business') },
        inLanguage: 'en-NG',
        ...(crumbs.length
          ? { breadcrumb: { '@id': `${url}#breadcrumb` } }
          : {}),
      },
      ...(crumbs.length
        ? [
            {
              '@type': 'BreadcrumbList',
              '@id': `${url}#breadcrumb`,
              itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map(
                (c, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  name: c.name,
                  item: absolute(c.path),
                })
              ),
            },
          ]
        : []),
      businessNode(opts.settings),
      ...(opts.extra ?? []),
    ],
  };
}
