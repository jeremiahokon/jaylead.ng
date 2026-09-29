'use server';

/**
 * Saves every form submission as a `lead` document in Sanity (brief 11) and
 * hands the visitor to WhatsApp with the same details. Works without
 * JavaScript: the form posts normally and, when the client flag is absent,
 * the action redirects to /thank-you carrying the WhatsApp link.
 *
 * Guards: a honeypot field, a basic per-IP rate limit (5 per 10 minutes per
 * server instance), zod validation. If Sanity or email are not configured,
 * the visitor still gets the WhatsApp handoff; a lead is never lost silently.
 */
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getSettings } from '@/lib/content';
import {
  type FormState,
  type LeadType,
  leadTypes,
  schemas,
  successMessage,
  templateFor,
} from '@/lib/forms/schema';
import { utils } from '@/lib/utils';

import { writeClient } from '@/sanity/client';

const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);

  recent.push(now);
  hits.set(ip, recent);

  return recent.length > 5;
}

/** Office hours for the success message, from Site settings. */
const hoursText = async () =>
  utils.format.hours((await getSettings()).officeHours);

async function notify(type: LeadType, data: Record<string, string>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;

  if (!key || !to) return;

  const body = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Jaylead website <onboarding@resend.dev>',
      to: [to],
      subject: `New ${type} lead: ${data.name ?? data.email ?? ''}`,
      text: body,
    }),
  }).catch((e) => console.error('[lead] email failed', e));
}

export async function submitLead(
  _prev: FormState,
  form: FormData
): Promise<FormState> {
  const type = String(form.get('type')) as LeadType;
  const withJs = form.get('js') === '1';

  if (!leadTypes.includes(type))
    return { status: 'error', message: 'Unknown form.' };

  const raw = Object.fromEntries(
    [...form.entries()]
      .filter(([k]) => typeof k === 'string')
      .map(([k, v]) => [k, String(v)])
  );

  // Honeypot: real people never see or fill this field.
  if (raw.company)
    return { status: 'ok', message: successMessage(type, await hoursText()) };

  const ip =
    (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';

  if (limited(ip))
    return {
      status: 'error',
      message:
        'Too many submissions. Please try again in a few minutes, or message us on WhatsApp.',
      values: raw,
    };

  const parsed = schemas[type].safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};

    for (const issue of parsed.error.issues)
      errors[String(issue.path[0])] ??= issue.message;

    return {
      status: 'error',
      errors,
      message: 'Please check the highlighted fields.',
      values: raw,
    };
  }

  const data = parsed.data as Record<string, string>;

  const settings = await getSettings();

  const wa = utils.contact.whatsappHref(settings, templateFor[type], {
    date: data.preferredDate
      ? utils.format.date(data.preferredDate)
      : undefined,
    plot: data.plot || undefined,
  });

  const client = writeClient();

  if (client) {
    await client
      .create({
        _type: 'lead',
        type:
          type === 'contact' && data.interest?.startsWith('Investing: Option A')
            ? 'invest-a'
            : type === 'contact' &&
                data.interest?.startsWith('Investing: Option B')
              ? 'invest-b'
              : type,
        status: 'new',
        name: data.name,
        phone: data.phone,
        email: data.email,
        location: data.location,
        preferredDate: data.preferredDate || undefined,
        plot: data.plot,
        interest: data.interest,
        message: data.message,
        experience: data.experience
          ? `${data.experience}${data.experienceDetail ? `: ${data.experienceDetail}` : ''}`
          : undefined,
        sourcePage: raw.sourcePage,
        createdAt: new Date().toISOString(),
      })
      .catch((e) => console.error('[lead] Sanity write failed', e));
  } else {
    console.warn(
      '[lead] Sanity not configured; lead handed to WhatsApp only',
      type
    );
  }

  await notify(type, data);

  if (!withJs)
    redirect(
      `/thank-you?type=${encodeURIComponent(type)}&wa=${encodeURIComponent(wa)}`
    );

  return {
    status: 'ok',
    message: successMessage(type, await hoursText()),
    whatsappHref: wa,
  };
}
