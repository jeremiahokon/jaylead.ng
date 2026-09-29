/**
 * Sanity connection settings, read once. On Vercel the Sanity integration
 * provides these (NEXT_PUBLIC_SANITY_PROJECT_ID and _DATASET, with
 * SANITY_PROJECT_ID / SANITY_DATASET as server-side copies); locally they
 * come from .env.local (`vercel env pull`, see docs/sanity/env-setup.md).
 * next.config.ts copies whichever is set into the NEXT_PUBLIC_ names so the
 * browser Studio sees the same project. `isSanityConfigured` is false until
 * there is a project id; every accessor in src/lib/content.ts then uses the
 * typed seed.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_API_PROJECT_ID ||
  '';
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  process.env.SANITY_STUDIO_API_DATASET ||
  'production';
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-28';
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
