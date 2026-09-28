/** Everything is crawlable except the Studio, the API routes and the form confirmation. */
import type { MetadataRoute } from 'next';

import { absolute, siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api', '/thank-you'],
      },
    ],
    sitemap: absolute('/sitemap.xml'),
    host: siteUrl,
  };
}
