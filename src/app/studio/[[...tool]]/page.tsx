/**
 * The embedded Sanity Studio at /studio. Only this route loads it, so none of
 * its code reaches the public pages. Not indexed; login is Sanity's own.
 * Deep Studio URLs (/studio/structure/...) are client routes: the shell is
 * prerendered once at /studio and the Studio router takes over.
 */
import { Suspense } from 'react';
import { connection } from 'next/server';

import type { Metadata } from 'next';

import { Studio } from './studio';

export { viewport } from 'next-sanity/studio';

export const metadata: Metadata = {
  title: 'Jaylead Studio',
  robots: { index: false, follow: false },
  referrer: 'same-origin',
};

/** Marks the Studio as request-time so its fallback shell never blocks the build. */
async function RequestTime() {
  await connection();

  return null;
}

export default function StudioPage() {
  return (
    <>
      <Suspense>
        <RequestTime />
      </Suspense>
      <Studio />
    </>
  );
}
