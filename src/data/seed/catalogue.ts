/**
 * The offer and the trust facts: estate, plots, documents, credentials,
 * invest options, departments, team and stats (brief 3.3, 3.4, 5.2 to 5.12).
 * Figures match the brief exactly. Anything the client has not confirmed is
 * either left out or switched off (headlineStatsConfirmed, figuresVisible).
 */
import type {
  Credential,
  Department,
  DocumentType,
  Estate,
  InvestOption,
  InvestPage,
  Plot,
  Stat,
  TeamMember,
} from '@/lib/types';

import { images } from '@/data/images';

import { pt } from './pt';

export const documentsSeed: DocumentType[] = [
  {
    _id: 'doc-deed',
    name: 'Deed of Assignment',
    plainExplanation:
      'The legal document that transfers the land from Jaylead to you. It is the proof that the plot is yours.',
  },
  {
    _id: 'doc-allocation',
    name: 'Certificate of Allocation',
    plainExplanation:
      'Confirms which exact plot in the estate has been allocated to you, so no one else can be sold the same land.',
  },
  {
    _id: 'doc-survey',
    name: 'Registered Survey',
    plainExplanation:
      'A surveyor’s plan with the boundaries and beacon points of your plot, registered so the measurements can be checked.',
  },
  {
    _id: 'doc-layout',
    name: 'Layout Plan',
    plainExplanation:
      'The map of the whole estate showing where your plot sits, its access and its neighbours.',
  },
];

export const estatesSeed: Estate[] = [
  {
    _id: 'estate-palm-grove',
    name: 'Palm Grove Estate',
    slug: 'palm-grove',
    state: 'Osun State',
    summary:
      'Titled oil-palm farmland in Osun State, planted and fully managed by Jaylead. Buy by the acre or the hectare, receive your documents, and earn from the palm oil your plot produces from year 3.',
    body: pt(
      'Palm Grove Estate is Jaylead’s first managed oil-palm estate. You buy titled farmland and the Supergene oil palms planted on it. Jaylead prepares the land, plants, maintains, harvests, processes the fruit into crude palm oil and sells it. A larger percentage of your farm’s revenue is yours.',
      'You own land, not a share or a unit in a fund. It can be sold, transferred or passed to your children, and there are no annual fees.'
    ),
    headlineStats: { totalAcres: 100, totalTrees: 4200 },
    headlineStatsConfirmed: false,
    palmVariety: 'Supergene',
    incomeStartYear: 3,
    productiveLifeText: '25 to 30 years',
    documents: documentsSeed,
    gallery: [
      images['aerial-fields'],
      images['aerial-perimeter'],
      images['aerial-site'],
      images['young-palm'],
      images['palm-grove-jos'],
    ],
    heroImage: images['aerial-fields'],
    aerialVideoId: 'instagram:DdZEAqaKey0',
    seo: {
      title: 'Palm Grove Estate, Osun State: Managed Oil Palm Plots',
      description:
        '1 acre (60 trees) from ₦4,000,000 or 1 hectare (150 trees) for ₦10,000,000, fully managed, titled land.',
    },
  },
];

export const plotsSeed: Plot[] = [
  {
    _id: 'plot-1-acre',
    title: 'Palm Grove Estate: 1 Acre Plot',
    slug: 'palm-grove-1-acre',
    estateSlug: 'palm-grove',
    estateName: 'Palm Grove Estate',
    sizeLabel: '1 Acre',
    sizeInAcres: 1,
    trees: 60,
    price: 4_000_000,
    priceMode: 'fixed',
    status: 'available',
    paymentOptions: 'Full payment or instalment plan. Terms shared on enquiry.',
    thumbnail: images['young-palm'],
    gallery: [
      images['aerial-fields'],
      images['young-palm'],
      images['plantation-undergrowth'],
    ],
    whatsappTemplateKey: 'plot',
    order: 1,
  },
  {
    _id: 'plot-1-hectare',
    title: 'Palm Grove Estate: 1 Hectare Plot',
    slug: 'palm-grove-1-hectare',
    estateSlug: 'palm-grove',
    estateName: 'Palm Grove Estate',
    sizeLabel: '1 Hectare',
    sizeInAcres: 2.471,
    trees: 150,
    price: 10_000_000,
    priceMode: 'fixed',
    status: 'available',
    paymentOptions: 'Full payment or instalment plan. Terms shared on enquiry.',
    thumbnail: images['palm-grove-jos'],
    gallery: [
      images['aerial-perimeter'],
      images['palm-grove-jos'],
      images['plantation-drone'],
    ],
    whatsappTemplateKey: 'plot',
    order: 2,
  },
];

export const credentialsSeed: Credential[] = [
  {
    _id: 'cred-cac',
    name: 'CAC Registration',
    shortName: 'CAC registered',
    value: 'RC 9492571',
    verifyUrl: 'https://search.cac.gov.ng/',
    status: 'shown',
    order: 1,
  },
  {
    _id: 'cred-scuml',
    name: 'SCUML Certificate',
    shortName: 'SCUML certified',
    value: 'Special Control Unit against Money Laundering',
    status: 'shown',
    order: 2,
  },
  {
    _id: 'cred-tin',
    name: 'Tax Identification Number',
    shortName: 'TIN validated',
    value: 'Federal Inland Revenue Service',
    status: 'shown',
    order: 3,
  },
  {
    _id: 'cred-naic',
    name: 'NAIC Farm Asset Insurance',
    shortName: 'NAIC insured',
    value: 'Nigerian Agricultural Insurance Corporation',
    status: 'pending',
    order: 4,
  },
  {
    _id: 'cred-nysc',
    name: 'NYSC Place of Primary Assignment',
    shortName: 'NYSC PPA',
    value: 'Approved place of primary assignment',
    status: 'pending',
    order: 5,
  },
];

export const investOptionsSeed: InvestOption[] = [
  {
    _id: 'invest-option-a',
    key: 'option-a',
    name: 'Option A: Ownership Returns',
    tagline: 'A share of the farm’s long-term output.',
    whoItsFor: 'Investors who want a share of the farm’s long-term output',
    minAmount: 10_000_000,
    maxAmount: 25_000_000,
    yearlyRatePercent: 40,
    recoveryMultiple: 2,
    royaltyRatePercent: 5,
    projectLifeYears: 30,
    investorCap: 3,
    exitText: 'Royalty continues for the project’s life',
    body: [
      'Under Option A you fund Jaylead’s farming operation and share in what it produces over the long term. You are not buying a specific plot.',
      'You receive a yearly payout of a set percentage of the amount you invested until twice that amount has been paid out. After that, a smaller yearly royalty continues for the remaining life of the project.',
      'Option A is open to a small number of investors. Every term is set by your signed agreement.',
    ],
    whatsappTemplateKey: 'invest-a',
  },
  {
    _id: 'invest-option-b',
    key: 'option-b',
    name: 'Option B: Fixed Loan',
    tagline: 'A fixed-term return and a clean exit.',
    whoItsFor: 'Investors who want a fixed-term return and a clean exit',
    fixedRateText: 'Agreed fixed interest rate',
    termText: 'Agreed loan term',
    exitText: 'Clean exit once principal and interest are repaid',
    body: [
      'Under Option B you lend to Jaylead’s farming operation for an agreed term at an agreed fixed interest rate.',
      'When the principal and interest have been repaid, the loan is closed. There is no ongoing royalty and no further obligation on either side.',
    ],
    whatsappTemplateKey: 'invest-b',
  },
];

export const investPageSeed: InvestPage = {
  figuresVisible: false,
  riskDisclosure: pt(
    'Returns depend on the farm’s real performance: weather, yields and palm oil prices. They are not guaranteed and are not a bank deposit. Your terms are set by your signed agreement, not by this website. Please read the documents carefully and seek independent advice before committing funds.'
  ),
};

export const departmentsSeed: Department[] = [
  'Project Management',
  'Agriculture',
  'Real Estate',
  'Business Development',
  'Sales and Marketing',
  'Media and Content',
  'Administration',
  'Finance',
  'Customer Relations',
  'Technology and Automation',
  'Research and Strategy',
].map((name, i) => ({ _id: `dept-${i + 1}`, name, order: i + 1 }));

export const teamSeed: TeamMember[] = [
  {
    _id: 'team-md',
    name: 'Adetunji Jacob Ogunyemi',
    role: 'Managing Director',
    photo: images['founder-portrait-suit'],
    bio: 'A software engineer turned project manager and Scrum Master, Adetunji leads Jaylead’s strategy and operations from the Ilorin office. He has spoken at DevFest Ilorin 2025 and the AWS student symposium in Ilorin (2024).',
    order: 1,
  },
];

/** Market stats seed as drafts in Sanity; none render until a source is published. */
export const statsSeed: Stat[] = [];
