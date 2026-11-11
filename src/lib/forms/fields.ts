/**
 * The zod-free half of the form definitions: the one central enquiry form's
 * questions, success copy and the form state shape. The client form imports
 * only this file, so zod never ships to the browser.
 *
 * Every page uses the same enquiry form (owner's call, November 2026); a
 * page only preselects answers. The newsletter box on the blog is the one
 * other form: an email sign-up, not an enquiry.
 */
import type { WhatsappTemplateKey } from '@/lib/types';

export const leadTypes = ['enquiry', 'newsletter'] as const;
export type LeadType = (typeof leadTypes)[number];

/** Question 1. Its answer files the lead and picks the WhatsApp message. */
export const goals = [
  'Own a plot',
  'Invest: Option A',
  'Invest: Option B',
  'Visit the farm',
  'Become a realtor',
  'NYSC placement',
  'Just researching',
] as const;
export type Goal = (typeof goals)[number];

/** Goals that are not buying land: the land and timing questions hide. */
export const nonBuyerGoals: readonly Goal[] = [
  'Become a realtor',
  'NYSC placement',
];

export const landSizes = [
  '1 Acre',
  '1 Hectare',
  'More than 1 hectare',
  'Not sure yet',
] as const;

export const timelines = [
  'This month',
  '1 to 3 months',
  'Later this year',
  'Just exploring',
] as const;

export const basedIn = ['In Nigeria', 'Outside Nigeria'] as const;

export const templateForGoal: Record<Goal, WhatsappTemplateKey> = {
  'Own a plot': 'plot',
  'Invest: Option A': 'invest-a',
  'Invest: Option B': 'invest-b',
  'Visit the farm': 'inspection',
  'Become a realtor': 'realtor',
  'NYSC placement': 'nysc',
  'Just researching': 'general',
};

/**
 * The WhatsApp message for an enquiry, from Site settings → WhatsApp
 * templates. A sized plot gets the plot message; "Own a plot" without a size
 * asks for the brochure. Returns the template key and the plot wording.
 */
export function whatsappFor(goal?: Goal, landSize?: string) {
  const sized = landSize === '1 Acre' || landSize === '1 Hectare';

  const key: WhatsappTemplateKey = !goal
    ? 'general'
    : goal === 'Own a plot' && !sized
      ? 'brochure'
      : templateForGoal[goal];

  return { key, plot: sized ? `${landSize} plot` : undefined };
}

/** `{hours}` is filled from Site settings → Office hours by the caller. */
export const successCopy: Record<LeadType, string> = {
  enquiry:
    'Thank you, we have your details. We reply {hours}. Tap below to continue on WhatsApp.',
  newsletter: 'You’re on the list for farm updates.',
};

/** The success message for a form, with the office hours filled in. */
export const successMessage = (type: LeadType, hours: string) =>
  successCopy[type].replace('{hours}', hours);

export type FormState = {
  status: 'idle' | 'ok' | 'error';
  message?: string;
  errors?: Record<string, string>;
  whatsappHref?: string;
  values?: Record<string, string>;
};
