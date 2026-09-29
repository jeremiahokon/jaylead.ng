/**
 * Config for the `sanity` CLI (pnpm exec sanity ...): schema deploys, CORS
 * origins, datasets. Reads the same project as the site, from .env.local
 * when it exists (`vercel env pull .env.local`).
 */
import { existsSync } from 'node:fs';
import { defineCliConfig } from 'sanity/cli';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const env = process.env;

export default defineCliConfig({
  api: {
    projectId:
      env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      env.SANITY_PROJECT_ID ||
      env.SANITY_STUDIO_API_PROJECT_ID,
    dataset:
      env.NEXT_PUBLIC_SANITY_DATASET || env.SANITY_DATASET || 'production',
  },
});
