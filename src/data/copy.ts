/**
 * Fixed page copy shared by more than one page: the six steps, the timeline
 * wording, the land vs shares rows and the Why Us comparison. Business facts
 * (prices, trees, documents) are not here; they come from the CMS.
 */
export const steps = [
  {
    verb: 'Buy',
    title: 'Buy your plot',
    body: 'Choose 1 acre or 1 hectare at Palm Grove Estate and pay in full or by instalments. Every payment goes to the corporate account.',
    when: 'Day one',
  },
  {
    verb: 'Receive',
    title: 'Receive your documents',
    body: 'Your Deed of Assignment, Certificate of Allocation, Registered Survey and Layout Plan, in your name.',
    when: 'After payment',
  },
  {
    verb: 'Plant',
    title: 'We plant',
    body: 'Our agriculture team prepares the land and plants Supergene oil palms on your plot.',
    when: 'Planting season',
  },
  {
    verb: 'Manage',
    title: 'We manage',
    body: 'Weeding, fertilising and care, handled for you. No staff to hire and nothing to supervise.',
    when: 'Years 1 and 2',
  },
  {
    verb: 'Harvest',
    title: 'We harvest, process and sell',
    body: 'The fruit is harvested, processed into crude palm oil and sold by Jaylead.',
    when: 'From year 3',
  },
  {
    verb: 'Earn',
    title: 'You earn yearly from year 3',
    body: 'Your share of the palm oil revenue is paid yearly, for the productive life of the palms: 25 to 30 years.',
    when: 'Every year',
  },
] as const;

export const landVsShares = {
  intro: 'It isn’t about which is better. It’s about which one fits your goal.',
  columns: ['A Palm Grove plot', 'Shares in a listed company'],
  rows: [
    [
      'What you own',
      'Titled farmland and the palms on it, with four documents in your name',
      'A small part of a company',
    ],
    [
      'What produces the income',
      'Palm fruit, processed into crude palm oil and sold yearly from year 3',
      'Company profits, paid as dividends when the board decides',
    ],
    [
      'Your involvement',
      'None day to day: Jaylead plants, manages, harvests and sells',
      'None day to day: you watch the price',
    ],
    [
      'Can you pass it on',
      'Yes: sell, transfer or leave the land to your children',
      'Yes: shares can be sold or inherited',
    ],
    [
      'What it depends on',
      'Weather, yields and palm oil prices',
      'The company’s performance and the market',
    ],
  ],
} as const;

export const whyUsDifference = [
  [
    'Sells vacant land; no income until you resell',
    'Your land is farmed; income comes yearly from year 3',
  ],
  [
    'Informal or undocumented',
    'CAC registered (RC 9492571), SCUML certified, TIN validated',
  ],
  [
    'You develop the land yourself',
    'Jaylead plants, farms and manages everything',
  ],
  [
    'A one-time transaction',
    'A long relationship for the productive life of the palms (25 to 30 years)',
  ],
  ['Limited transparency', 'Independent audits welcome'],
] as const;

export const values = [
  {
    title: 'Transparency',
    body: 'Independent audits welcome. Every plot comes with full legal paperwork.',
  },
  { title: 'Longevity', body: 'We plan in decades, not quick flips.' },
  {
    title: 'Shared prosperity',
    body: 'Owners, staff, realtors and Nigeria’s food supply grow together.',
  },
  {
    title: 'Compliance first',
    body: 'CAC, SCUML and TIN were done before growth, not after.',
  },
] as const;

/** The thirty-year horizontal chapter on Home and How it works. */
export const years = [
  {
    year: '0',
    title: 'You buy',
    body: 'Choose 1 acre or 1 hectare at Palm Grove Estate. Pay in full or by instalments, into the company account only.',
  },
  {
    year: '0',
    title: 'Your papers',
    body: 'Deed of Assignment, Certificate of Allocation, Registered Survey and Layout Plan, in your name.',
  },
  {
    year: '1',
    title: 'We plant',
    body: 'Our agriculture team prepares the land and plants Supergene oil palms on your plot.',
  },
  {
    year: '2',
    title: 'We tend',
    body: 'Weeding, fertilising and care. No staff to hire, nothing to supervise.',
  },
  {
    year: '3',
    title: 'First harvest',
    body: 'The palms bear fruit. We harvest it, press it into crude palm oil and sell it.',
  },
  {
    year: '4+',
    title: 'Every year after',
    body: 'Your share of the palm oil revenue, paid yearly. A larger percentage of your farm’s revenue is yours.',
  },
  {
    year: '30',
    title: 'A legacy',
    body: 'Oil palms produce for 25 to 30 years. The land stays yours to keep, sell or leave to your children.',
  },
] as const;

/** Who does what, on Why Us (from the old /how-it-works page). */
export const whoDoesWhat: [string, string[]][] = [
  [
    'What you do',
    [
      'Choose your plot size',
      'Pay into the company account',
      'Keep your four title documents safe',
      'Visit whenever you like',
      'Receive your yearly share',
    ],
  ],
  [
    'What Jaylead does',
    [
      'Prepare and plant the land',
      'Weed, fertilise and maintain it',
      'Harvest the fruit',
      'Process it into crude palm oil',
      'Sell the oil and report to owners',
    ],
  ],
];
