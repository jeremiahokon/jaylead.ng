/** 404 (brief 9.16): short, with the three ways forward. */
import Link from 'next/link';

import { getSettings } from '@/lib/content';
import { utils } from '@/lib/utils';

export default async function NotFound() {
  const s = await getSettings();

  return (
    <section className="mx-auto max-w-[96rem] px-(--gutter) py-28 md:py-44">
      <p className="micro opacity-70">404</p>
      <h1 className="font-display text-hero mt-6 max-w-[14ch]">
        This plot <span className="em-oil">isn’t on the map.</span>
      </h1>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/marketplace" className="pill">
          See the marketplace
        </Link>
        <Link href="/contact" className="pill pill-ghost">
          Contact us
        </Link>
        <a
          href={utils.contact.whatsappHref(s, 'general')}
          target="_blank"
          rel="noopener"
          className="pill pill-ghost"
        >
          Ask on WhatsApp
        </a>
      </div>
    </section>
  );
}
