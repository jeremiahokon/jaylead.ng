/**
 * Every Sanity read goes through here. Results are cached with 'use cache'
 * and cacheLife('max'), tagged by document type, and only expire when the
 * webhook in src/app/api/revalidate calls revalidateTag. In Draft Mode (the
 * Studio's Presentation preview) the cache is bypassed and drafts are read
 * with the viewer token.
 */
import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';
import type { QueryParams } from 'next-sanity';

import { client } from './client';

export async function sanityFetch<T>(
  query: string,
  params: QueryParams,
  tags: string[]
): Promise<T> {
  'use cache';
  cacheLife('max');
  cacheTag(...tags);

  const { isEnabled } = await draftMode();
  const token = process.env.SANITY_API_READ_TOKEN;

  if (isEnabled && token) {
    return client.fetch<T>(query, params, {
      token,
      perspective: 'drafts',
      useCdn: false,
      stega: false,
    });
  }

  return client.fetch<T>(query, params);
}
