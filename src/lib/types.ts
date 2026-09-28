/**
 * The content model the pages render, shaped exactly as the GROQ projections
 * in src/sanity/queries.ts return it, so seed data and live Sanity data are
 * interchangeable behind src/lib/content.ts. Field names follow brief
 * section 5.
 */
import type { PortableTextBlock } from '@portabletext/types';

export type RichText = PortableTextBlock[];

/** A resolved image: local (/images/...) or Sanity CDN, always with alt. */
export type Img = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** False for stock or AI images: rendered with the caption "Illustration". */
  isRealSitePhoto?: boolean;
  caption?: string;
  /** Sanity hotspot, 0 to 1, used as the crop focal point. */
  hotspot?: { x: number; y: number };
  /** Tiny blurred placeholder (data URL). */
  lqip?: string;
};

export type WhatsappTemplateKey =
  | 'general'
  | 'brochure'
  | 'plot'
  | 'plot-pricing'
  | 'inspection'
  | 'office-visit'
  | 'invest-a'
  | 'invest-b'
  | 'invest-compare'
  | 'realtor'
  | 'nysc'
  | 'post'
  | 'faq';

export type SiteSettings = {
  companyName: string;
  legalName: string;
  rcNumber: string;
  mission: string;
  missionShort: string;
  tagline: string;
  positioningLine: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  email: string;
  salesEmail: string;
  hrEmail: string;
  mediaEmail: string;
  address: {
    line1: string;
    landmarkDirections: string;
    city: string;
    state: string;
    mapsUrl: string;
    mapImage?: Img;
    geo?: { lat: number; lng: number };
  };
  officeHours: { days: string; opens: string; closes: string }[];
  whatsappReplyNote: string;
  socials: { platform: SocialPlatform; url: string }[];
  whatsappTemplates: {
    key: WhatsappTemplateKey;
    label: string;
    message: string;
  }[];
  paymentSafety: {
    accountName?: string;
    bankName?: string;
    safetyText: string;
  };
  announcementBar?: { enabled: boolean; text: string; link?: string };
  showFaithValues: boolean;
  faithValues: { title: string; description: string; reference: string }[];
  creedText?: string;
  pricesUpdated: string;
  cacVerifyUrl: string;
  whatsappChannelUrl?: string;
};

export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'linkedin'
  | 'youtube'
  | 'x';

export type EstateStatus = 'selling' | 'planting' | 'producing' | 'coming-soon';

export type DocumentType = {
  _id: string;
  name: string;
  plainExplanation: string;
  sampleImage?: Img;
};

export type Estate = {
  _id: string;
  name: string;
  slug: string;
  state: string;
  lga?: string;
  town?: string;
  status: EstateStatus;
  summary: string;
  body?: RichText;
  headlineStats?: { totalAcres?: number; totalTrees?: number };
  headlineStatsConfirmed: boolean;
  palmVariety: string;
  incomeStartYear: number;
  productiveLifeText: string;
  documents: DocumentType[];
  timeline: { label: string; description: string }[];
  gallery: Img[];
  heroImage?: Img;
  brochureUrl?: string;
  brochureSizeLabel?: string;
  mapUrl?: string;
  mapImage?: Img;
  aerialVideoId?: string;
  seo?: Seo;
  hidden?: boolean;
  updatedAt?: string;
};

export type PlotStatus = 'available' | 'reserved' | 'sold';

export type Plot = {
  _id: string;
  title: string;
  slug: string;
  estateSlug: string;
  estateName: string;
  sizeLabel: string;
  sizeInAcres: number;
  trees: number;
  price: number;
  priceMode: 'fixed' | 'from' | 'on-request';
  status: PlotStatus;
  paymentOptions: string;
  thumbnail?: Img;
  gallery: Img[];
  whatsappTemplateKey: WhatsappTemplateKey;
  order: number;
  updatedAt?: string;
};

export type InvestOption = {
  _id: string;
  key: 'option-a' | 'option-b';
  name: string;
  tagline: string;
  whoItsFor: string;
  minAmount?: number;
  maxAmount?: number;
  yearlyRatePercent?: number;
  recoveryMultiple?: number;
  royaltyRatePercent?: number;
  projectLifeYears?: number;
  investorCap?: number;
  fixedRateText?: string;
  termText?: string;
  exitText: string;
  body: string[];
  whatsappTemplateKey: WhatsappTemplateKey;
};

export type InvestPage = {
  figuresVisible: boolean;
  legalReviewConfirmedOn?: string;
  riskDisclosure?: RichText;
};

export type Credential = {
  _id: string;
  name: string;
  shortName: string;
  value: string;
  verifyUrl?: string;
  documentUrl?: string;
  status: 'shown' | 'pending';
  order: number;
};

export type Stat = {
  _id: string;
  label: string;
  value: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate?: string;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  description: string;
};

export type Author = {
  _id: string;
  name: string;
  role: string;
  photo?: Img;
  slug: string;
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: Img;
  body: RichText;
  category: Category;
  estateSlug?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  seo?: Seo;
  faq?: { question: string; answer: string }[];
  recordedOn?: string;
  recordedAt?: string;
  relatedPlotSlug?: string;
};

export type FaqGroup =
  | 'Company and trust'
  | 'Owning a plot'
  | 'Investing in the project'
  | 'Realtors'
  | 'NYSC'
  | 'Visiting and contact';

export type FaqItem = {
  _id: string;
  question: string;
  answer: RichText;
  group: FaqGroup;
  order: number;
  showOnHome: boolean;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  photo?: Img;
  bio: string;
  order: number;
};

export type Department = { _id: string; name: string; order: number };

export type VideoPlacement =
  | 'home-hero-aerial'
  | 'founder-story'
  | 'proof-strip'
  | 'how-it-works'
  | 'about-office'
  | 'estate';

export type Video = {
  /** platform:id, stable across the file and Sanity. */
  key: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  id: string;
  canonicalUrl: string;
  embedUrl: string;
  title: string;
  poster?: Img;
  aspect: '9:16' | '4:5' | '1:1' | '16:9';
  duration?: string;
  summary?: string;
  publishedOn?: string;
  account: 'brand' | 'founder';
  featured: boolean;
  placements: VideoPlacement[];
  estateSlug?: string;
  /** Where the entry came from; Sanity wins when both define one. */
  source: 'file' | 'sanity';
};

export type Seo = { title?: string; description?: string };
