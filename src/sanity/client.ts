/**
 * The read client (CDN, published content only) and, server-side, a write
 * client for leads. The write token never leaves the server: this module is
 * imported only from server files and scripts.
 */
import { createClient } from 'next-sanity';

import { apiVersion, dataset, isSanityConfigured, projectId } from './env';

export const client = createClient({
  projectId: isSanityConfigured ? projectId : 'unset',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

/** Server-only: saves form submissions as `lead` documents. */
export function writeClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!isSanityConfigured || !token) return null;

  return client.withConfig({ token, useCdn: false });
}
