/**
 * Sanity webhook (docs/sanity/api-routes.md). Verifies the HMAC signature
 * with SANITY_REVALIDATE_SECRET, then expires the cache tag for the changed
 * document's type. 'max' serves the old page once while the new one builds.
 */
import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret)
    return new Response('Revalidation is not configured', { status: 500 });

  const { isValidSignature, body } = await parseBody<{
    _type?: string;
    slug?: string;
  }>(request, secret, true);

  if (!isValidSignature)
    return new Response('Invalid signature', { status: 401 });
  if (!body?._type) return new Response('Missing _type', { status: 400 });

  revalidateTag(body._type, 'max');

  return Response.json({
    revalidated: true,
    type: body._type,
    slug: body.slug ?? null,
  });
}
