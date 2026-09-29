/**
 * Form confirmation for the no-JavaScript path (brief 9.16): the lead action
 * redirects here with the WhatsApp link that carries the visitor's details.
 * Only wa.me links are accepted, so the page can't be used as an open redirect.
 */
import { Suspense } from 'react';
import Link from 'next/link';

import type { Metadata } from 'next';

import { getSettings } from '@/lib/content';
import { type LeadType, leadTypes, successMessage } from '@/lib/forms/fields';
import { utils } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Thank you: Jaylead AgriEstate',
  robots: { index: false },
};

async function Message({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; wa?: string }>;
}) {
  const { type, wa } = await searchParams;
  const hours = utils.format.hours((await getSettings()).officeHours);

  const copy = leadTypes.includes(type as LeadType)
    ? successMessage(type as LeadType, hours)
    : 'Thank you. We’ll be in touch.';

  const href = wa?.startsWith('https://wa.me/') ? wa : undefined;

  return (
    <>
      <p className="text-lede measure mt-8 opacity-85">{copy}</p>
      {href ? (
        <a href={href} className="pill mt-10">
          Continue on WhatsApp
        </a>
      ) : null}
    </>
  );
}

export default function ThankYou({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; wa?: string }>;
}) {
  return (
    <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-40">
      <h1 className="font-display text-hero">
        Thank <span className="em-oil">you.</span>
      </h1>
      <Suspense
        fallback={
          <p className="text-lede mt-8">Thank you. We’ll be in touch.</p>
        }
      >
        <Message searchParams={searchParams} />
      </Suspense>
      <Link href="/" className="link-under mt-10 block">
        Back to the home page
      </Link>
    </section>
  );
}
