/**
 * Every pure helper the site uses, in one place, grouped by what it's for:
 *
 *   utils.style     class names
 *   utils.format    money and dates (the only naira formatter, SR-10)
 *   utils.contact   WhatsApp, tel: links and Nigerian phone numbers
 *   utils.embed     Instagram, TikTok and YouTube links
 *   utils.invest    Option A payout maths
 *
 * `cn` is also exported on its own, because it appears in nearly every
 * className. All of this is safe on the server and in the browser.
 *
 * Kept elsewhere on purpose: site config (lib/site.ts), JSON-LD builders
 * (lib/jsonld.ts), data access (lib/content.ts, server only) and the
 * cached copyright year (lib/build-year.ts, which uses Next's server cache
 * and would break client components if it lived here).
 */
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import type { SiteSettings, WhatsappTemplateKey } from '@/lib/types';

/* ── Types ─────────────────────────────────────────────────────────── */

/** Values that fill a WhatsApp template's {placeholders}. */
export type TemplateVars = Partial<
  Record<'plot' | 'price' | 'trees' | 'title' | 'date' | 'page', string>
>;

export type EmbedPlatform = 'instagram' | 'tiktok' | 'youtube';

/** A pasted video link, normalised. */
export type ParsedEmbed = {
  platform: EmbedPlatform;
  /** Instagram shortcode, TikTok numeric id, or YouTube id. */
  id: string;
  /** The public post page: the no-JS fallback link. */
  canonicalUrl: string;
  /** What the facade mounts inside its dialog after a tap. */
  embedUrl: string;
  /** Instagram only: reel or p. */
  kind?: 'reel' | 'p';
};

export type OptionATerms = {
  yearlyRatePercent: number;
  recoveryMultiple: number;
  royaltyRatePercent: number;
  projectLifeYears: number;
};

export type OptionASchedule = {
  /** One entry per recovery year, year 1 first. */
  recoveryYears: { year: number; payout: number }[];
  /** First royalty year, or null if recovery fills the project life. */
  royaltyFromYear: number | null;
  royaltyPerYear: number;
};

/* ── Style ─────────────────────────────────────────────────────────── */

/**
 * tailwind-merge taught the site's own type scale, so `text-display` and
 * `text-ink` are understood as size and colour, not two conflicting colours.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'hero',
        'display',
        'title',
        'statement',
        'figure',
        'lede',
        'body',
        'small',
        'micro',
      ],
    },
  },
});

const style = {
  /** Merges conditional class names and resolves Tailwind conflicts. */
  cn: (...inputs: ClassValue[]) => twMerge(clsx(inputs)),
};

/* ── Format ────────────────────────────────────────────────────────── */

const grouping = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

const format = {
  /**
   * Naira, whole units, grouped with commas, no kobo, no abbreviations
   * (SR-10): 4000000 becomes "₦4,000,000".
   */
  naira(amount: number): string {
    if (!Number.isFinite(amount)) return '';
    const whole = Math.round(amount);
    const sign = whole < 0 ? '-' : '';

    return `${sign}₦${grouping.format(Math.abs(whole))}`;
  },

  /** "September 2026" from an ISO date, in Lagos time ("Prices updated …"). */
  monthYear(iso: string): string {
    const d = new Date(iso);

    if (Number.isNaN(d.getTime())) return '';

    return d.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Lagos',
    });
  },

  /** "18 September 2026" from an ISO date, in Lagos time. */
  date(iso: string): string {
    const d = new Date(iso);

    if (Number.isNaN(d.getTime())) return '';

    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Lagos',
    });
  },
};

/* ── Contact ───────────────────────────────────────────────────────── */

const contact = {
  /** A wa.me link with the message pre-typed (brief section 8). */
  whatsappLink(number: string, message: string): string {
    const digits = number.replace(/\D/g, '');

    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Fills {plot}, {price}, {trees}, {title}, {date} and {page}. Unfilled
   * placeholders are removed with their surrounding bracket or phrase, so a
   * message never shows a raw "{date}".
   */
  fillTemplate(message: string, vars: TemplateVars = {}): string {
    return message
      .replace(
        /\{(\w+)\}/g,
        (_, k: string) => vars[k as keyof TemplateVars] ?? `{${k}}`
      )
      .replace(/\s*Preferred date: \{date\}\.?/g, '')
      .replace(/\s*\(\{[^}]+\}[^)]*\)/g, '')
      .replace(/\{\w+\}/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  },

  /**
   * The WhatsApp link for one of the Site settings templates, falling back
   * to "general" when a key is missing. Plain anchors: works without JS.
   */
  whatsappHref(
    settings: Pick<SiteSettings, 'whatsappNumber' | 'whatsappTemplates'>,
    key: WhatsappTemplateKey,
    vars?: TemplateVars
  ): string {
    const template =
      settings.whatsappTemplates.find((t) => t.key === key) ??
      settings.whatsappTemplates.find((t) => t.key === 'general');

    return contact.whatsappLink(
      settings.whatsappNumber,
      contact.fillTemplate(template?.message ?? '', vars)
    );
  },

  /** A tel: link from any written form of the number. */
  telHref: (e164: string) => `tel:${e164.replace(/[^\d+]/g, '')}`,

  /**
   * Nigerian phone numbers in the forms (brief 11): accepts 0803 123 4567,
   * 803 123 4567, +234 803 123 4567 and 234803..., and returns E.164
   * (+2348031234567), or null when it can't be a Nigerian number.
   */
  normalisePhone(input: string): string | null {
    const digits = input.replace(/[^\d+]/g, '').replace(/^\+/, '');
    let local: string;

    if (digits.startsWith('234')) local = digits.slice(3);
    else if (digits.startsWith('0')) local = digits.slice(1);
    else local = digits;
    if (!/^[1-9]\d{7,9}$/.test(local)) return null;

    return `+234${local}`;
  },
};

/* ── Embed ─────────────────────────────────────────────────────────── */

const IG_PERMALINK = /data-instgrm-permalink="([^"]+)"/;
const IG_PATH = /instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/i;
const TIKTOK = /tiktok\.com\/@([\w.-]+)\/video\/(\d+)/i;

const YT_LONG =
  /youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)([\w-]{11})/i;

const YT_SHORT = /youtu\.be\/([\w-]{11})/i;

const embed = {
  /**
   * Turns anything an editor pastes (a bare link, a link with ?igsh=
   * tracking, or Instagram's whole <blockquote> embed code) into one
   * canonical video reference, or null when it isn't an Instagram post or
   * reel, a TikTok video or a YouTube video. The site and Studio validation
   * share this (brief 10.3).
   */
  parse(pasted: string | null | undefined): ParsedEmbed | null {
    if (!pasted) return null;
    const raw = pasted.trim();

    if (!raw) return null;
    const url = raw.match(IG_PERMALINK)?.[1] ?? raw;

    const ig = url.match(IG_PATH);

    if (ig) {
      const kind = ig[1].toLowerCase() === 'p' ? 'p' : 'reel';
      const id = ig[2];
      const canonicalUrl = `https://www.instagram.com/${kind}/${id}/`;

      return {
        platform: 'instagram',
        id,
        kind,
        canonicalUrl,
        embedUrl: `${canonicalUrl}embed/`,
      };
    }

    const tt = url.match(TIKTOK);

    if (tt) {
      const [, user, id] = tt;

      return {
        platform: 'tiktok',
        id,
        canonicalUrl: `https://www.tiktok.com/@${user}/video/${id}`,
        embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
      };
    }

    const yt = url.match(YT_LONG) ?? url.match(YT_SHORT);

    if (yt) {
      const id = yt[1];

      return {
        platform: 'youtube',
        id,
        canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
      };
    }

    return null;
  },

  /** Display names for each platform ("Watch on Instagram"). */
  platformLabel: {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  } as Record<EmbedPlatform, string>,
};

/* ── Invest ────────────────────────────────────────────────────────── */

const invest = {
  /**
   * Option A's illustrative payout schedule (brief 10.2). Pays
   * yearlyRatePercent of the amount each year until recoveryMultiple x
   * amount has been paid; the last of those years pays only the remainder.
   * Then a royalty of royaltyRatePercent a year for the rest of the project
   * life. Deliberately returns no lifetime total: the page must never show one.
   */
  optionASchedule(amount: number, terms: OptionATerms): OptionASchedule {
    const yearly = Math.round((amount * terms.yearlyRatePercent) / 100);
    const target = Math.round(amount * terms.recoveryMultiple);
    const recoveryYears: OptionASchedule['recoveryYears'] = [];

    if (yearly <= 0 || target <= 0) {
      return { recoveryYears, royaltyFromYear: null, royaltyPerYear: 0 };
    }

    let paid = 0;
    let year = 1;

    while (paid < target && year <= terms.projectLifeYears) {
      const payout = Math.min(yearly, target - paid);

      recoveryYears.push({ year, payout });
      paid += payout;
      year += 1;
    }

    return {
      recoveryYears,
      royaltyFromYear: year <= terms.projectLifeYears ? year : null,
      royaltyPerYear: Math.round((amount * terms.royaltyRatePercent) / 100),
    };
  },
};

/* ── The one object ────────────────────────────────────────────────── */

export const utils = { style, format, contact, embed, invest } as const;

/** Shorthand for utils.style.cn, which appears in nearly every className. */
export const cn = style.cn;
