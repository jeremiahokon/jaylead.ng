'use client';

import { useActionState, useSyncExternalStore } from 'react';
import Link from 'next/link';

import { submitLead } from '@/app/actions/lead';

import { trackLead } from '@/lib/analytics';
import {
  basedIn,
  type FormState,
  goals,
  landSizes,
  type LeadType,
  nonBuyerGoals,
  timelines,
} from '@/lib/forms/fields';
import { cn } from '@/lib/utils';

const initial: FormState = { status: 'idle' };

const line =
  'mt-2 block w-full border-0 border-b border-current/30 bg-transparent px-0 py-3 text-lg outline-none transition-colors placeholder:opacity-40 focus:border-current focus-visible:outline-none aria-[invalid=true]:border-alert';

type Values = (name: string) => string;
type Errors = Record<string, string> | undefined;

function Hint({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} className="text-small mt-2 opacity-60">
      {text}
    </p>
  ) : null;
}

function Err({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} data-err className="text-alert text-small mt-3 font-bold">
      {text}
    </p>
  ) : null;
}

/** One numbered question answered with a tap: native radios, styled as chips. */
function Choice({
  name,
  legend,
  options,
  value,
  error,
  required,
  mark,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  value: string;
  error?: string;
  required?: boolean;
  /** Data attributes the CSS keys off (which answers hide or show fields). */
  mark?: (option: string) => Record<string, string | undefined> | undefined;
}) {
  const errId = `enquiry-${name}-err`;

  return (
    <fieldset
      data-q
      aria-describedby={error ? errId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="enquiry-legend">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {options.map((o) => (
          <label key={o} className="chip">
            <input
              type="radio"
              name={name}
              value={o}
              defaultChecked={value === o}
              required={required}
              className="sr-only"
              {...mark?.(o)}
            />
            {o}
          </label>
        ))}
      </div>
      <Err id={errId} text={error} />
    </fieldset>
  );
}

function Text({
  name,
  label,
  type = 'text',
  required,
  hint,
  autoComplete,
  value,
  error,
  multiline,
}: {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'date';
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  value: string;
  error?: string;
  multiline?: boolean;
}) {
  const id = `enquiry-${name}`;

  const describedBy =
    [hint ? `${id}-hint` : '', error ? `${id}-err` : '']
      .filter(Boolean)
      .join(' ') || undefined;

  const shared = {
    id,
    name,
    required,
    defaultValue: value,
    'aria-invalid': !!error,
    'aria-describedby': describedBy,
  };

  return (
    <div>
      <label htmlFor={id} className="micro opacity-80">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} className={cn(line, 'resize-y')} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          inputMode={type === 'tel' ? 'tel' : undefined}
          className={line}
        />
      )}
      <Hint id={`${id}-hint`} text={hint} />
      <Err id={`${id}-err`} text={error} />
    </div>
  );
}

function EnquiryFields({ value, errors }: { value: Values; errors: Errors }) {
  return (
    <>
      <Choice
        name="goal"
        legend="What brings you here?"
        options={goals}
        value={value('goal')}
        error={errors?.goal}
        required
        mark={(o) =>
          o === 'Visit the farm'
            ? { 'data-visit': '' }
            : (nonBuyerGoals as readonly string[]).includes(o)
              ? { 'data-not-buying': '' }
              : undefined
        }
      />
      {/* Hidden by CSS when the visitor is not buying land. */}
      <div data-buying className="contents">
        <Choice
          name="landSize"
          legend="How much land?"
          options={landSizes}
          value={value('landSize')}
          error={errors?.landSize}
        />
        <Choice
          name="timeline"
          legend="When would you like to start?"
          options={timelines}
          value={value('timeline')}
          error={errors?.timeline}
        />
      </div>
      <Choice
        name="basedIn"
        legend="Where are you based?"
        options={basedIn}
        value={value('basedIn')}
        error={errors?.basedIn}
        required
      />
      <fieldset data-q>
        <legend className="enquiry-legend">Your details</legend>
        <div className="mt-5 grid gap-7">
          <div data-visiting>
            <Text
              name="preferredDate"
              label="Preferred visit date (optional)"
              type="date"
              hint="Weekdays work best."
              value={value('preferredDate')}
              error={errors?.preferredDate}
            />
          </div>
          <Text
            name="name"
            label="Full name"
            required
            autoComplete="name"
            value={value('name')}
            error={errors?.name}
          />
          <Text
            name="phone"
            label="WhatsApp or phone number"
            type="tel"
            required
            autoComplete="tel"
            hint="For example 0803 123 4567. Outside Nigeria? Start with your country code, like +44."
            value={value('phone')}
            error={errors?.phone}
          />
          <Text
            name="email"
            label="Email (optional)"
            type="email"
            autoComplete="email"
            value={value('email')}
            error={errors?.email}
          />
          <Text
            name="message"
            label="Anything else we should know? (optional)"
            multiline
            value={value('message')}
            error={errors?.message}
          />
        </div>
      </fieldset>
    </>
  );
}

/**
 * The site's one enquiry form, used on every page (pages only preselect
 * answers through `defaults`), plus the blog's email-only newsletter box.
 *
 * A plain HTML form posting to a Server Action, so it works without
 * JavaScript (the action then redirects to /thank-you). The questions are
 * native radios; which ones show is decided in CSS from the checked answer
 * (globals.css, "Enquiry form"), so that works without JavaScript too.
 * With JavaScript, errors show inline and success swaps to a WhatsApp
 * handoff carrying the same details.
 */
export function LeadForm({
  type = 'enquiry',
  submitLabel = 'Send my enquiry',
  sourcePage,
  className,
  defaults,
}: {
  type?: LeadType;
  submitLabel?: string;
  sourcePage: string;
  className?: string;
  defaults?: Record<string, string>;
}) {
  const [state, action, pending] = useActionState(
    async (prev: FormState, form: FormData) => {
      const next = await submitLead(prev, form);

      if (next.status === 'ok')
        trackLead(type, sourcePage, String(form.get('goal') ?? ''));

      return next;
    },
    initial
  );

  // true once hydrated (so the action knows JS ran), false in the server HTML.
  const js = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  if (state.status === 'ok') {
    return (
      <div
        role="status"
        tabIndex={-1}
        // The long form collapses to this short message, which would leave
        // the visitor sections further down: bring the confirmation to them.
        ref={(el) => {
          if (!el) return;
          el.focus({ preventScroll: true });
          el.scrollIntoView({ block: 'center' });
        }}
        className={cn(
          'scroll-mt-28 border-t border-current/20 pt-8 outline-none',
          className
        )}
      >
        <p className="font-display text-3xl">{state.message}</p>
        {state.whatsappHref ? (
          <a
            href={state.whatsappHref}
            target="_blank"
            rel="noopener"
            className="pill mt-8"
          >
            Continue on WhatsApp
          </a>
        ) : null}
      </div>
    );
  }

  const value = (n: string) => state.values?.[n] ?? defaults?.[n] ?? '';

  return (
    <form
      action={action}
      noValidate={js}
      data-enquiry={type === 'enquiry' ? '' : undefined}
      className={cn('grid', type === 'enquiry' ? 'gap-12' : 'gap-8', className)}
    >
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <input type="hidden" name="js" value={js ? '1' : '0'} />
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Company (leave empty)
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {type === 'enquiry' ? (
        <EnquiryFields value={value} errors={state.errors} />
      ) : (
        <Text
          name="email"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          value={value('email')}
          error={state.errors?.email}
        />
      )}

      {state.status === 'error' && state.message ? (
        <p role="alert" className="text-alert text-small font-bold">
          {state.message}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="pill disabled:opacity-60"
        >
          {pending ? 'Sending…' : submitLabel}
        </button>
        <p className="text-small mt-4 opacity-70">
          We use these details only to reply to you. See our{' '}
          <Link href="/legal/privacy-policy" className="link-under">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
