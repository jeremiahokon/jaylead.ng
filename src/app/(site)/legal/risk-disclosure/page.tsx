/** Risk disclosure (brief 9.15). Draft for legal review. */
import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';
import { RichText } from '@/components/rich-text';

import { getInvestPage } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Risk Disclosure: Jaylead AgriEstate',
  description:
    'The risks of owning managed farmland and investing in Jaylead’s farming operation.',
  alternates: { canonical: '/legal/risk-disclosure' },
};

export default async function Risk() {
  const page = await getInvestPage();

  return (
    <LegalPage
      path="/legal/risk-disclosure"
      title="Risk Disclosure"
      description="The risks, stated plainly."
      draftNote="Draft for legal review"
      updated="28 September 2026"
    >
      <p>
        Owning farmland that Jaylead manages, or investing in Jaylead’s farming
        operation, carries real risks. Please read them before you commit any
        money, and take independent advice.
      </p>
      <h2>Agricultural risk</h2>
      <p>
        Weather, pests, disease and soil conditions affect how well palms grow
        and how much fruit they bear. Yields vary from year to year and from
        plot to plot.
      </p>
      <h2>Price risk</h2>
      <p>
        Income comes from selling crude palm oil. Palm oil prices move with the
        market, so the same harvest can earn more in one year and less in
        another.
      </p>
      <h2>Timing risk</h2>
      <p>
        We plan for income from year 3, but the first harvest can come later
        than planned.
      </p>
      <h2>Liquidity</h2>
      <p>
        Land is not cash. Selling or transferring a plot takes time, and there
        may not be a buyer at the price you want when you want to sell.
      </p>
      <h2>Returns are not guaranteed</h2>
      <p>
        Neither farm income nor investment returns are guaranteed, and neither
        is a bank deposit. Your terms are set by your signed agreement, not by
        this website.
      </p>
      {page.riskDisclosure?.length ? (
        <>
          <h2>Investing in the project</h2>
          <RichText value={page.riskDisclosure} />
        </>
      ) : null}
    </LegalPage>
  );
}
