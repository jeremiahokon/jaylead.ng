/**
 * Site settings seed (brief 5.1, 3.1, 7.5, 8). Every value is confirmed in
 * the brief or the owner's PDF; nothing here is invented. This is what the
 * site shows until Sanity is connected, and what `pnpm seed` loads into it.
 */
import type { SiteSettings } from '@/lib/types';

export const settingsSeed: SiteSettings = {
  companyName: 'Jaylead AgriEstate',
  legalName: 'Jaylead AgriEstate Limited',
  rcNumber: '9492571',
  mission:
    "To create generational wealth and a secure financial future by putting people's money to work in real, land-backed agriculture that grows Nigeria's food supply today and keeps producing for decades.",
  missionShort:
    'Real, land-backed agriculture that grows Nigeria’s food supply and keeps producing for decades.',
  tagline: 'Real Assets. Real Harvests. Real Legacy.',
  phoneDisplay: '+234 916 099 2539',
  phoneE164: '+2349160992539',
  whatsappNumber: '2349160992539',
  email: 'jayleadagriestate@gmail.com',
  address: {
    line1: 'Tipper Garage Roundabout',
    landmarkDirections: 'beside Mazabs Event Centre, Tanke',
    city: 'Ilorin',
    state: 'Kwara State',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Mazabs+Event+Centre+Tipper+Garage+Tanke+Ilorin',
  },
  officeHours: [{ days: 'Monday to Friday', opens: '09:00', closes: '17:00' }],
  whatsappReplyNote: 'We reply on WhatsApp Monday to Friday, 9am to 5pm.',
  socials: [
    { platform: 'instagram', url: 'https://www.instagram.com/jaylead_ng/' },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@jaylead_ng' },
  ],
  whatsappTemplates: [
    {
      key: 'general',
      label: 'General',
      message:
        "Hello Jaylead, I saw your website and I'd like to know more about owning farmland with you.",
    },
    {
      key: 'brochure',
      label: 'Brochure',
      message: 'Hello Jaylead, please send me the Palm Grove Estate brochure.',
    },
    {
      key: 'plot',
      label: 'Plot enquiry',
      message:
        "Hello Jaylead, I'm interested in the {plot} ({price}, {trees} trees) at Palm Grove Estate. Please send me the brochure and payment details.",
    },
    {
      key: 'plot-pricing',
      label: 'Plot pricing',
      message:
        'Hello Jaylead, please send me the current price and instalment options for the {plot} at Palm Grove Estate.',
    },
    {
      key: 'inspection',
      label: 'Site inspection',
      message:
        "Hello Jaylead, I'd like to book a site inspection at Palm Grove Estate, Osun. Preferred date: {date}.",
    },
    {
      key: 'office-visit',
      label: 'Office visit',
      message:
        "Hello Jaylead, I'd like to visit your office in Tanke, Ilorin. When is a good time?",
    },
    {
      key: 'invest-a',
      label: 'Invest: Option A',
      message:
        "Hello Jaylead, I'd like to talk to an advisor about Option A (Ownership Returns).",
    },
    {
      key: 'invest-b',
      label: 'Invest: Option B',
      message:
        "Hello Jaylead, I'd like to talk to an advisor about Option B (Fixed Loan).",
    },
    {
      key: 'invest-compare',
      label: 'Invest: compare',
      message:
        "Hello Jaylead, I'd like help deciding between owning a plot and investing in the project.",
    },
    {
      key: 'realtor',
      label: 'Realtor',
      message:
        "Hello Jaylead, I'm interested in joining the Jaylead Realty Academy.",
    },
    {
      key: 'nysc',
      label: 'NYSC',
      message:
        "Hello Jaylead, I'm a corps member and I'd like to ask about serving at Jaylead (PPA).",
    },
    {
      key: 'post',
      label: 'Blog post',
      message:
        'Hello Jaylead, I just read "{title}" on your website and I have a question.',
    },
    {
      key: 'faq',
      label: 'FAQ',
      message:
        "Hello Jaylead, I have a question that isn't answered on your website.",
    },
  ],
  paymentSafety: {
    safetyText:
      'Pay only into the corporate account of Jaylead AgriEstate Limited. We will never ask you to pay into a personal account. Before any transfer, call our office line, +234 916 099 2539, to confirm the account details.',
  },
  announcementBar: { enabled: false, text: '' },
  showFaithValues: false,
  faithValues: [],
  pricesUpdated: '2026-09-01',
  cacVerifyUrl: 'https://search.cac.gov.ng/',
};
