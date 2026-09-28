/**
 * FAQ seed, verbatim from brief 16.2. This one collection feeds the visible
 * FAQ, FAQPage JSON-LD and /llms.txt. Answers the client still owes carry the
 * brief's placeholder wording, which is true as written.
 */
import type { FaqItem } from '@/lib/types';

import { pt } from './pt';

type Row = [FaqItem['group'], string, string[], boolean?];

const rows: Row[] = [
  [
    'Company and trust',
    'Is Jaylead legally registered?',
    [
      'Yes. Jaylead AgriEstate Limited is registered with the Corporate Affairs Commission (RC 9492571), is SCUML certified and has a validated TIN. You can check our registration on the [CAC public search](https://search.cac.gov.ng/).',
    ],
  ],
  [
    'Company and trust',
    'Where is your office?',
    [
      'Tipper Garage Roundabout, beside Mazabs Event Centre, Tanke, Ilorin, Kwara State. We’re open Monday to Friday, 9am to 5pm, and you’re welcome to visit.',
    ],
  ],
  [
    'Company and trust',
    'How do I pay safely?',
    [
      'Pay only into the corporate account of Jaylead AgriEstate Limited. We will never ask you to pay into a personal account. Before any transfer, call +234 916 099 2539 to confirm the account details.',
    ],
  ],
  [
    'Company and trust',
    'What are the risks?',
    [
      'This is farming, so results depend on weather, pests, yields and palm oil prices, and the first harvest could come later than planned. Land can take time to sell. Returns are not guaranteed. Read our [risk disclosure](/legal/risk-disclosure) and ask us anything before you commit.',
    ],
  ],
  [
    'Owning a plot',
    'What exactly do I own?',
    [
      'Titled farmland and the palm trees on it. It is your land, not a share or a unit in a fund.',
    ],
    true,
  ],
  [
    'Owning a plot',
    'What documents do I receive?',
    [
      'A Deed of Assignment, Certificate of Allocation, Registered Survey and Layout Plan.',
    ],
    true,
  ],
  [
    'Owning a plot',
    'How much does a plot cost?',
    [
      '1 acre with 60 Supergene palms is ₦4,000,000. 1 hectare with 150 palms is ₦10,000,000. Prices can change, so confirm the current price with us before paying.',
    ],
    true,
  ],
  [
    'Owning a plot',
    'Are there annual or maintenance fees?',
    ['No. There are no annual fees.'],
  ],
  [
    'Owning a plot',
    'When do I start earning?',
    ['Palm oil income starts from year 3 and is paid yearly.'],
    true,
  ],
  [
    'Owning a plot',
    'How is revenue shared between me and Jaylead?',
    [
      'A larger percentage of your farm’s revenue is yours. We share the exact split in your agreement and in our brochure.',
    ],
  ],
  [
    'Owning a plot',
    'Is my income guaranteed?',
    [
      'No. Your income comes from what your plot actually produces and what palm oil sells for. What you do own for certain is the land, backed by your title documents.',
    ],
    true,
  ],
  [
    'Owning a plot',
    'Do I need farming experience?',
    ['No. We plant, manage, harvest, process and sell.'],
  ],
  [
    'Owning a plot',
    'Can I sell, transfer or pass the land to my children?',
    [
      'Yes. The title is yours to keep, sell, transfer or leave to your children.',
    ],
  ],
  [
    'Owning a plot',
    'Are instalment plans available?',
    [
      'Yes. You can pay in full or by instalments; we share the terms when you enquire.',
    ],
  ],
  [
    'Owning a plot',
    'What are Supergene palms?',
    [
      'A high-yield oil palm variety. Oil palms are productive for 25 to 30 years.',
    ],
  ],
  [
    'Owning a plot',
    'Where is the estate?',
    [
      'Palm Grove Estate is in Osun State. We share the exact location when you book an inspection.',
    ],
  ],
  [
    'Investing in the project',
    'What’s the difference between owning a plot and investing in the project?',
    [
      'Owning a plot means you buy specific, titled land that we farm for you. Investing in the project means you fund Jaylead’s farming operation under Option A or Option B, without buying a specific plot.',
    ],
  ],
  [
    'Investing in the project',
    'What’s the difference between Option A and Option B?',
    [
      'Option A shares in the farm’s output over the long term and is open to 3 investors. Option B is a fixed-term loan with an agreed interest rate and a clean exit. See the [Invest page](/invest) for full terms.',
    ],
  ],
  [
    'Investing in the project',
    'Is my investment guaranteed?',
    [
      'No. Returns depend on real farm performance and are not a government-guaranteed deposit. Your terms are set by your signed agreement. We provide full documentation and welcome independent audits, and we encourage you to take independent advice.',
    ],
  ],
  [
    'Visiting and contact',
    'Can I visit the land before I buy?',
    [
      'Yes. Book a site inspection on WhatsApp or through the form, and we’ll arrange a date.',
    ],
    true,
  ],
  [
    'Visiting and contact',
    'How do I get started?',
    [
      'Chat with us on WhatsApp or call +234 916 099 2539. We’ll send the brochure, answer your questions and arrange an inspection or office visit.',
    ],
  ],
  [
    'Realtors',
    'How do I become a Jaylead realtor?',
    [
      'Apply on the [Become a Realtor](/become-a-realtor) page, complete the Jaylead Realty Academy training and start earning commission on closed sales.',
    ],
  ],
  [
    'NYSC',
    'Can corps members serve at Jaylead?',
    [
      'Yes. Jaylead is a Place of Primary Assignment with placements across 11 departments. See the [NYSC page](/nysc).',
    ],
  ],
];

export const faqSeed: FaqItem[] = rows.map(
  ([group, question, answer, showOnHome], i) => ({
    _id: `faq-${i + 1}`,
    question,
    answer: pt(...answer),
    group,
    order: i + 1,
    showOnHome: Boolean(showOnHome),
  })
);

/** Display order of the FAQ groups (llms.txt and any grouped listing). */
export const faqGroups: FaqItem['group'][] = [
  'Company and trust',
  'Owning a plot',
  'Investing in the project',
  'Visiting and contact',
  'Realtors',
  'NYSC',
];
