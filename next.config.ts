import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,

  experimental: {
    turbopackFileSystemCacheForDev: true,
    // First visits arrive from Instagram bios and WhatsApp shares on budget
    // Android over mobile data: inline the sheet instead of a blocking request.
    inlineCss: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'], // first Accept match wins
    deviceSizes: [640, 750, 828, 1080, 1280, 1600],
    imageSizes: [96, 160, 256, 384],
    qualities: [70, 75],
    minimumCacheTTL: 31_536_000,
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },

  // Pages folded into the main ones (owner, 28 Sep 2026). Permanent, so old
  // shared links and search results land on the page that now holds the content.
  async redirects() {
    return [
      { source: '/faq', destination: '/#questions', permanent: true },
      { source: '/faqs', destination: '/#questions', permanent: true },
      { source: '/how-it-works', destination: '/why-us', permanent: true },
      {
        source: '/estates/:slug',
        destination: '/marketplace',
        permanent: true,
      },
      {
        source: '/brochure',
        destination: '/marketplace#brochure',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
