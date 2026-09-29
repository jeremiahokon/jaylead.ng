/**
 * Server-side validation (zod) for each lead type. Plain constants live in
 * ./fields so the client form never bundles zod.
 */
import { z } from 'zod';

import { interests, type LeadType } from './fields';

const name = z.string().trim().min(2, 'Please enter your full name.').max(120);

const phone = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const e164 = utils.contact.normalisePhone(v);

    if (!e164)
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a Nigerian phone number, for example 0803 123 4567.',
      });

    return e164 ?? v;
  });

const email = z.union([
  z.literal(''),
  z.string().trim().email('That email address doesn’t look right.'),
]);

const text = (max: number) => z.string().trim().max(max).optional().default('');

export const schemas = {
  inspection: z.object({
    name,
    phone,
    preferredDate: z.string().trim().min(1, 'Choose a preferred date.'),
    plot: text(80),
  }),
  contact: z.object({
    name,
    phone,
    email,
    interest: z.enum(interests),
    message: z.string().trim().min(5, 'Please add a short message.').max(2000),
  }),
  realtor: z.object({
    name,
    phone,
    email: z.string().trim().email('Enter your email address.'),
    location: z.string().trim().min(2, 'Enter your city and state.').max(120),
    experience: z.enum(['yes', 'no']),
    experienceDetail: text(400),
    message: z.string().trim().min(5, 'Tell us briefly why.').max(1000),
  }),
  nysc: z.object({
    name,
    phone,
    email,
    location: text(120),
    message: text(1000),
  }),
  'brochure-callback': z.object({ name, phone }),
  newsletter: z.object({
    email: z.string().trim().email('Enter your email address.'),
  }),
  'plot-enquiry': z.object({
    name,
    phone,
    plot: text(80),
    message: text(1000),
  }),
} satisfies Record<LeadType, z.ZodType>;

export {
  type FormState,
  type LeadType,
  leadTypes,
  successMessage,
  templateFor,
} from './fields';
import { utils } from '@/lib/utils';
