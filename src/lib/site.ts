/**
 * The one canonical origin, shared by metadata, JSON-LD, the sitemap, robots
 * and llms.txt so none of them can name a different host. The brief fixes
 * www.jayleadagro.com as canonical (apex redirects to www at the host), so a
 * Vercel preview URL is never used as the canonical, only NEXT_PUBLIC_SITE_URL.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.jayleadagro.com'
).replace(/\/$/, '');

/** Absolute URL for a site path. */
export const absolute = (path = '/') =>
  `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * About 100 bytes of meta keywords. Google ignores the tag; it stays as the
 * checked-in record of the phrases the site is meant to win (brief 13.4).
 */
export const siteKeywords = [
  'oil palm investment Nigeria',
  'farmland investment Nigeria',
  'agricultural land for sale Osun',
  'agro estate Osun',
  'real estate Ilorin',
];
