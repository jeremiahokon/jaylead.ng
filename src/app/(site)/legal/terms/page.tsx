/** Website terms (brief 9.15). */
import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';

import { getSettings } from '@/lib/content';
import { siteHost } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms: Jaylead AgriEstate',
  description: 'The terms for using the Jaylead AgriEstate website.',
  alternates: { canonical: '/legal/terms' },
};

export default async function Terms() {
  const s = await getSettings();

  return (
    <LegalPage
      path="/legal/terms"
      title="Website Terms"
      description="Terms for using this website."
      draftNote="Draft for the client’s review"
      updated="28 September 2026"
    >
      <p>
        These terms cover your use of {siteHost}, run by {s.legalName} (RC{' '}
        {s.rcNumber}).
      </p>
      <h2>Information, not an offer</h2>
      <p>
        This website describes our plots and investment options in general
        terms. Any purchase or investment is governed only by the individual
        agreement you sign with Jaylead, not by anything on this website.
      </p>
      <h2>Prices</h2>
      <p>
        Prices shown are correct as of the “Prices updated” date beside them and
        can change. We confirm the current price and payment terms with you
        before any payment.
      </p>
      <h2>Paying safely</h2>
      <p>{s.paymentSafety.safetyText}</p>
      <h2>Returns and risk</h2>
      <p>
        Farm income and investment returns depend on real farm performance and
        are not guaranteed. Please read our{' '}
        <a href="/legal/risk-disclosure">risk disclosure</a>.
      </p>
      <h2>Content</h2>
      <p>
        Words, photos and videos on this site belong to Jaylead or are used with
        permission. Images marked “Illustration” are not photos of our estates.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${s.email}`}>{s.email}</a>{' '}
        or {s.phoneDisplay}.
      </p>
    </LegalPage>
  );
}
