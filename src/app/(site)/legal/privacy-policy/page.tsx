/** Privacy policy (brief 9.15, D16): Nigeria Data Protection Act 2023. Draft for the client's review. */
import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';

import { getSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Privacy Policy: Jaylead AgriEstate',
  description:
    'What Jaylead AgriEstate collects through this website, why, and how to ask for it to be deleted.',
  alternates: { canonical: '/legal/privacy-policy' },
};

export default async function Privacy() {
  const s = await getSettings();

  return (
    <LegalPage
      path="/legal/privacy-policy"
      title="Privacy Policy"
      description="How this website handles your details."
      draftNote="Draft for the client’s review"
      updated="28 September 2026"
    >
      <p>
        This policy explains what {s.legalName} (“Jaylead”, “we”) collects
        through www.jayleadagro.com, why, and what you can ask us to do with it.
        It is written to meet the Nigeria Data Protection Act 2023.
      </p>
      <h2>What we collect</h2>
      <p>
        Only what you type into our forms: your name, phone or WhatsApp number,
        email address, location, preferred inspection date, the plot you are
        interested in and your message. Realtor applications also ask about
        prior sales experience.
      </p>
      <h2>Why we collect it</h2>
      <p>
        To reply to you, arrange inspections and office visits, send the
        brochure you asked for, and process realtor or NYSC applications. We do
        not sell your details or use them for advertising.
      </p>
      <h2>Where it is stored and who sees it</h2>
      <p>
        Form submissions are stored in our content management system (Sanity),
        which only authorised Jaylead staff can open. If email alerts are
        switched on, a copy is sent to our company inbox.
      </p>
      <h2>How long we keep it</h2>
      <p>
        We propose keeping enquiries for up to 24 months after our last
        conversation with you, then deleting them (period to be confirmed by
        Jaylead). If you become a customer, records are kept as the law and your
        agreement require.
      </p>
      <h2>Cookies and tracking</h2>
      <p>
        This website uses no tracking or advertising cookies and no analytics.
        Videos from Instagram, TikTok or YouTube do not load until you tap to
        play one; once you do, that platform may set its own cookies under its
        own privacy policy.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete the details we hold about you, or
        withdraw your consent, at any time. Email{' '}
        <a href={`mailto:${s.email}`}>{s.email}</a> or message us on WhatsApp at{' '}
        {s.phoneDisplay}. You may also complain to the Nigeria Data Protection
        Commission.
      </p>
      <h2>Contact</h2>
      <p>
        {s.legalName}, RC {s.rcNumber}, {s.address.line1},{' '}
        {s.address.landmarkDirections}, {s.address.city}, {s.address.state}.
      </p>
    </LegalPage>
  );
}
