/**
 * /llms.txt: a plain summary for AI assistants (brief 13.3): the company,
 * its confirmed facts, the offer, key pages, and every FAQ question and
 * answer from the same collection the visible FAQ and FAQPage JSON-LD use.
 */
import { toPlainText } from '@portabletext/toolkit';

import {
  getFaqGroups,
  getPlots,
  getSettings,
  getShownCredentials,
} from '@/lib/content';
import { absolute } from '@/lib/site';
import { utils } from '@/lib/utils';

export async function GET() {
  const [s, plots, groups, creds] = await Promise.all([
    getSettings(),
    getPlots(),
    getFaqGroups(),
    getShownCredentials(),
  ]);

  const lines = [
    `# ${s.companyName}`,
    '',
    `> ${s.mission}`,
    '',
    `${s.legalName} sells titled oil-palm farmland at Palm Grove Estate, Osun State, Nigeria, and plants, manages, harvests, processes and sells the palm oil for the owners. Palm oil income is paid yearly from year 3. There are no annual fees. Returns are not guaranteed.`,
    '',
    '## Facts',
    `- Legal name: ${s.legalName}`,
    `- CAC registration: RC ${s.rcNumber} (verify: ${s.cacVerifyUrl})`,
    `- Registrations: ${creds.map((c) => c.shortName).join(', ')}`,
    `- Managing Director: Adetunji Jacob Ogunyemi`,
    `- Office: ${s.address.line1}, ${s.address.landmarkDirections}, ${s.address.city}, ${s.address.state}`,
    `- Hours: ${utils.format.hours(s.officeHours)} (WAT)`,
    `- Phone and WhatsApp: ${s.phoneDisplay}`,
    `- Email: ${s.email}`,
    `- Website: ${absolute('/')}`,
    ...s.socials.map((x) => `- ${x.platform}: ${x.url}`),
    '',
    `## The offer (prices updated ${utils.format.monthYear(s.pricesUpdated)}; confirm before paying)`,
    ...plots.map(
      (p) =>
        `- ${p.sizeLabel} at ${p.estateName}: ${p.priceMode === 'on-request' ? 'price on request' : utils.format.naira(p.price)}, ${p.trees} Supergene oil palms, status ${p.status}. ${absolute(`/marketplace/${p.slug}`)}`
    ),
    '- Documents with every plot: Deed of Assignment, Certificate of Allocation, Registered Survey, Layout Plan',
    '- Productive life of the palms: 25 to 30 years',
    '- Payment: full payment or instalment plan, terms shared on enquiry, into the corporate account only',
    '',
    '## Key pages',
    `- Marketplace and Palm Grove Estate: ${absolute('/marketplace')}`,
    `- Why Jaylead: ${absolute('/why-us')}`,
    `- Invest (Option A and Option B): ${absolute('/invest')}`,
    `- Become a Realtor: ${absolute('/become-a-realtor')}`,
    `- NYSC placements: ${absolute('/nysc')}`,
    `- Contact: ${absolute('/contact')}`,
    `- Risk disclosure: ${absolute('/legal/risk-disclosure')}`,
    '',
    '## Frequently asked questions',
    ...groups.flatMap((g) => [
      '',
      `### ${g.group}`,
      ...g.items.flatMap((f) => [
        '',
        `Q: ${f.question}`,
        `A: ${toPlainText(f.answer)}`,
      ]),
    ]),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
