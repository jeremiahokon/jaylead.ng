/**
 * Sends /api/revalidate the same signed request a Sanity webhook sends, so the
 * route can be tested before Sanity can reach the site.
 *   pnpm webhook:test                     -> localhost:3000, _type "post"
 *   pnpm webhook:test plot                -> another document type
 *   pnpm webhook:test post https://...    -> a deployed site
 *   BAD_SIGNATURE=1 pnpm webhook:test     -> expect 401
 */
import { createHmac } from 'node:crypto';

const [type = 'post', base = 'http://localhost:3000'] = process.argv.slice(2);
const secret = process.env.SANITY_REVALIDATE_SECRET;
if (!secret) throw new Error('SANITY_REVALIDATE_SECRET is not set');

const body = JSON.stringify({ _type: type, slug: null });
const t = Date.now();
const key = process.env.BAD_SIGNATURE ? 'wrong-secret' : secret;
const v1 = createHmac('sha256', key).update(`${t}.${body}`).digest('base64url');

const res = await fetch(new URL('/api/revalidate', base), {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'sanity-webhook-signature': `t=${t},v1=${v1}`,
  },
  body,
});

console.log(res.status, await res.text());
