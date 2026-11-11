/**
 * Server-side validation (zod) for the two forms. Plain constants live in
 * ./fields so the client form never bundles zod.
 */
import { z } from 'zod';

import { utils } from '@/lib/utils';

import {
  basedIn,
  goals,
  landSizes,
  type LeadType,
  nonBuyerGoals,
  timelines,
} from './fields';

const name = z.string().trim().min(2, 'Please enter your full name.').max(120);

const phone = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const e164 = utils.contact.normalisePhone(v);

    if (!e164)
      ctx.addIssue({
        code: 'custom',
        message:
          'Enter your phone number, for example 0803 123 4567, or +44 7700 900123 from abroad.',
      });

    return e164 ?? v;
  });

const email = z.union([
  z.literal(''),
  z.string().trim().email('That email address doesn’t look right.'),
]);

/** An unanswered radio group is absent from the form data, not "". */
const choice = <T extends readonly [string, ...string[]]>(
  options: T,
  message: string
) => z.enum(options, { message });

const optionalChoice = <T extends readonly [string, ...string[]]>(options: T) =>
  z.enum(options).optional();

export const schemas = {
  enquiry: z
    .object({
      goal: choice(goals, 'Choose what brings you here.'),
      landSize: optionalChoice(landSizes),
      timeline: optionalChoice(timelines),
      basedIn: choice(basedIn, 'Tell us where you are based.'),
      name,
      phone,
      email,
      preferredDate: z
        .union([
          z.literal(''),
          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.'),
        ])
        .optional()
        .default(''),
      message: z.string().trim().max(2000).optional().default(''),
    })
    .superRefine(
      (d, ctx) => {
        if (nonBuyerGoals.includes(d.goal)) return;
        if (!d.landSize)
          ctx.addIssue({
            code: 'custom',
            path: ['landSize'],
            message: 'Choose a size, or “Not sure yet”.',
          });
        if (!d.timeline)
          ctx.addIssue({
            code: 'custom',
            path: ['timeline'],
            message: 'Choose a time, or “Just exploring”.',
          });
      },
      // Run even when other fields fail, so every unanswered question is
      // flagged on the first submit. Only goal, landSize and timeline are read.
      { when: () => true }
    )
    // Drop answers the chosen goal hides: land and timing mean nothing for
    // a realtor or NYSC enquiry (a page may have preselected them), and a
    // visit date only counts for a visit.
    .transform((d) => ({
      ...d,
      ...(nonBuyerGoals.includes(d.goal)
        ? { landSize: undefined, timeline: undefined }
        : {}),
      preferredDate: d.goal === 'Visit the farm' ? d.preferredDate : '',
    })),
  newsletter: z.object({
    email: z.string().trim().email('Enter your email address.'),
  }),
} satisfies Record<LeadType, z.ZodType>;

export {
  type FormState,
  type Goal,
  type LeadType,
  leadTypes,
  successMessage,
  whatsappFor,
} from './fields';
