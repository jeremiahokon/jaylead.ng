/**
 * Sanity connection settings, read once. `isSanityConfigured` is false until
 * .env.local has a project id (docs/sanity/env-setup.md); every accessor in
 * src/lib/content.ts falls back to the typed seed while it is false.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-28';
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
