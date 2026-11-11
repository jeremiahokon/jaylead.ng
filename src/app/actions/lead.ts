'use server';

/**
 * Saves every form submission as a `lead` document in Sanity, where it lands
 * on the Leads board as "New", emails the team when Resend is configured,
 * and hands the visitor to WhatsApp with a message matching their answer. Works without
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
  type Goal,
  type LeadType,
  leadTypes,
  schemas,
  successMessage,
  whatsappFor,
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

async function notify(data: Record<string, string | undefined>) {
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
      subject: `New lead: ${data.goal ?? 'Farm updates'}, ${data.name ?? data.email ?? ''}`,
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

  const data = parsed.data as Record<string, string | undefined>;
  const goal = data.goal as Goal | undefined;
  const settings = await getSettings();

  const { key, plot } = whatsappFor(goal, data.landSize);

  const wa = utils.contact.whatsappHref(settings, key, {
    date: data.preferredDate
      ? utils.format.date(data.preferredDate)
      : undefined,
    plot,
  });

  const client = writeClient();

  if (client) {
    await client
      .create({
        _type: 'lead',
        status: 'new',
        goal: goal ?? 'Farm updates sign-up',
        landSize: data.landSize,
        timeline: data.timeline,
        basedIn: data.basedIn,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        preferredDate: data.preferredDate || undefined,
        message: data.message || undefined,
        sourcePage: raw.sourcePage,
        createdAt: new Date().toISOString(),
      })
      .catch((e) => console.error('[lead] Sanity write failed', e));
  } else {
    console.warn('[lead] Sanity not configured; lead handed to WhatsApp only');
  }

  await notify({ ...data, page: raw.sourcePage });

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
