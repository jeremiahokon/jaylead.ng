/**
 * The zod-free half of the form definitions: lead types, the interest list,
 * success copy and the form state shape. The client form imports only this
 * file, so zod never ships to the browser.
 */
import type { WhatsappTemplateKey } from '@/lib/types';

export const leadTypes = [
  'inspection',
  'contact',
  'realtor',
  'nysc',
  'brochure-callback',
  'newsletter',
  'plot-enquiry',
] as const;
export type LeadType = (typeof leadTypes)[number];

export const interests = [
  'Buying a plot',
  'Investing: Option A',
  'Investing: Option B',
  'Becoming a realtor',
  'NYSC placement',
  'Media and press',
  'Other',
] as const;

export const templateFor: Record<LeadType, WhatsappTemplateKey> = {
  inspection: 'inspection',
  contact: 'general',
  realtor: 'realtor',
  nysc: 'nysc',
  'brochure-callback': 'brochure',
  newsletter: 'general',
  'plot-enquiry': 'plot',
};

export const successCopy: Record<LeadType, string> = {
  inspection: 'Request received. Tap below to confirm on WhatsApp.',
  contact:
    'Message received. We reply Monday to Friday, 9am to 5pm. Tap below to continue on WhatsApp.',
  realtor:
    'Application received. Our team will contact you within 3 to 5 working days.',
  nysc: 'Request received. We’ll be in touch about placement.',
  'brochure-callback':
    'Thanks. We’ll call you back. Or get the brochure on WhatsApp now.',
  newsletter: 'You’re on the list for farm updates.',
  'plot-enquiry': 'Enquiry received. Tap below to continue on WhatsApp.',
};

export type FormState = {
  status: 'idle' | 'ok' | 'error';
  message?: string;
  errors?: Record<string, string>;
  whatsappHref?: string;
  values?: Record<string, string>;
};
