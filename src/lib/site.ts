/**
 * The one canonical origin, shared by metadata, JSON-LD, the sitemap, robots,
 * llms.txt and the legal pages so none of them can name a different host.
 * The owner chose jayleadng-weld.vercel.app (29 Sep 2026). When
 * www.jayleadagro.com goes live, change CANONICAL (or set
 * NEXT_PUBLIC_SITE_URL in Vercel) and every URL follows. Branch preview URLs
 * are never used as the canonical.
 */
const CANONICAL = 'https://jayleadng-weld.vercel.app';

/**
 * Tolerates the ways the variable arrives from a host dashboard: unset,
 * empty, or typed without the protocol ("jayleadng-weld.vercel.app"). Anything that
 * still isn't a URL falls back to the canonical origin instead of failing
 * the build.
 */
function resolveSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();

  if (!value) return CANONICAL;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  return URL.canParse(withProtocol) ? new URL(withProtocol).origin : CANONICAL;
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

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

/** The bare host for running text: "jayleadng-weld.vercel.app". */
export const siteHost = new URL(siteUrl).host;
