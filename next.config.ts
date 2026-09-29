import type { NextConfig } from 'next';

const env = process.env;

const nextConfig: NextConfig = {
  cacheComponents: true,

  // The Vercel Sanity integration can be installed with another prefix; copy
  // whichever name it used into the public ones the browser Studio reads.
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      env.SANITY_PROJECT_ID ||
      env.SANITY_STUDIO_API_PROJECT_ID ||
      '',
    NEXT_PUBLIC_SANITY_DATASET:
      env.NEXT_PUBLIC_SANITY_DATASET ||
      env.SANITY_DATASET ||
      env.SANITY_STUDIO_API_DATASET ||
      'production',
  },

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
};

export default nextConfig;
