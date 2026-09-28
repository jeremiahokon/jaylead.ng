'use client';

import { useActionState, useSyncExternalStore } from 'react';
import Link from 'next/link';

import { submitLead } from '@/app/actions/lead';

import { type FormState, interests, type LeadType } from '@/lib/forms/fields';
import { cn } from '@/lib/utils';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'date' | 'textarea' | 'select' | 'radio';
  required?: boolean;
  options?: readonly string[];
  hint?: string;
  autoComplete?: string;
};

const phone: Field = {
  name: 'phone',
  label: 'Phone or WhatsApp number',
  type: 'tel',
  required: true,
  hint: 'For example 0803 123 4567',
  autoComplete: 'tel',
};

const fullName: Field = {
  name: 'name',
  label: 'Full name',
  required: true,
  autoComplete: 'name',
};

const fields: Record<LeadType, Field[]> = {
  inspection: [
    fullName,
    phone,
    {
      name: 'preferredDate',
      label: 'Preferred date',
      type: 'date',
      required: true,
      hint: 'Weekdays work best',
    },
    {
      name: 'plot',
      label: 'Plot of interest (optional)',
      type: 'select',
      options: ['', '1 Acre', '1 Hectare', 'Not sure yet'],
    },
  ],
  contact: [
    fullName,
    phone,
    {
      name: 'email',
      label: 'Email (optional)',
      type: 'email',
      autoComplete: 'email',
    },
    {
      name: 'interest',
      label: 'I’m interested in',
      type: 'select',
      required: true,
      options: interests,
    },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
  ],
  realtor: [
    fullName,
    phone,
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      autoComplete: 'email',
    },
    {
      name: 'location',
      label: 'City and state',
      required: true,
      autoComplete: 'address-level2',
    },
    {
      name: 'experience',
      label: 'Any prior sales or real estate experience?',
      type: 'radio',
      required: true,
      options: ['yes', 'no'],
    },
    {
      name: 'experienceDetail',
      label: 'Tell us about it (optional)',
      type: 'textarea',
    },
    {
      name: 'message',
      label: 'Why do you want to become a Jaylead Realtor?',
      type: 'textarea',
      required: true,
    },
  ],
  nysc: [
    fullName,
    phone,
    { name: 'email', label: 'Email (optional)', type: 'email' },
    { name: 'location', label: 'Where are you posted? (optional)' },
    {
      name: 'message',
      label: 'Anything we should know? (optional)',
      type: 'textarea',
    },
  ],
  'brochure-callback': [fullName, phone],
  newsletter: [
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      required: true,
      autoComplete: 'email',
    },
  ],
  'plot-enquiry': [
    fullName,
    phone,
    { name: 'message', label: 'Question (optional)', type: 'textarea' },
  ],
};

const initial: FormState = { status: 'idle' };

/**
 * Every lead form on the site. A plain HTML form posting to a Server Action,
 * so it works without JavaScript (the action then redirects to /thank-you).
 * With JavaScript, errors show inline and success swaps to a WhatsApp
 * handoff carrying the same details.
 */
export function LeadForm({
  type,
  submitLabel,
  sourcePage,
  className,
  defaults,
}: {
  type: LeadType;
  submitLabel: string;
  sourcePage: string;
  className?: string;
  defaults?: Record<string, string>;
}) {
  const [state, action, pending] = useActionState(submitLead, initial);

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
        className={cn('border-t border-current/20 pt-8', className)}
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

  const base =
    'mt-2 block w-full border-0 border-b border-current/30 bg-transparent px-0 py-3 text-lg outline-none transition-colors placeholder:opacity-40 focus:border-current focus-visible:outline-none aria-[invalid=true]:border-alert';

  return (
    <form
      action={action}
      noValidate={js}
      className={cn('grid gap-8', className)}
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

      {fields[type].map((f) => {
        const id = `${type}-${f.name}`;
        const err = state.errors?.[f.name];

        const describedBy =
          [f.hint ? `${id}-hint` : '', err ? `${id}-err` : '']
            .filter(Boolean)
            .join(' ') || undefined;

        return (
          <div key={f.name}>
            {f.type === 'radio' ? (
              <fieldset aria-describedby={describedBy}>
                <legend className="micro opacity-80">{f.label}</legend>
                <div className="mt-3 flex gap-6">
                  {f.options!.map((o) => (
                    <label
                      key={o}
                      className="flex min-h-11 items-center gap-2 text-lg capitalize"
                    >
                      <input
                        type="radio"
                        name={f.name}
                        value={o}
                        defaultChecked={value(f.name) === o}
                        required={f.required}
                        className="accent-oil size-5"
                      />
                      {o}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <>
                <label htmlFor={id} className="micro opacity-80">
                  {f.label}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={id}
                    name={f.name}
                    rows={3}
                    required={f.required}
                    defaultValue={value(f.name)}
                    aria-invalid={!!err}
                    aria-describedby={describedBy}
                    className={cn(base, 'resize-y')}
                  />
                ) : f.type === 'select' ? (
                  <select
                    id={id}
                    name={f.name}
                    required={f.required}
                    defaultValue={value(f.name)}
                    aria-invalid={!!err}
                    aria-describedby={describedBy}
                    className={base}
                  >
                    {f.options!.map((o) => (
                      <option key={o} value={o}>
                        {o || 'Choose one'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    name={f.name}
                    type={f.type ?? 'text'}
                    required={f.required}
                    defaultValue={value(f.name)}
                    autoComplete={f.autoComplete}
                    aria-invalid={!!err}
                    aria-describedby={describedBy}
                    className={base}
                  />
                )}
              </>
            )}
            {f.hint ? (
              <p id={`${id}-hint`} className="text-small mt-2 opacity-60">
                {f.hint}
              </p>
            ) : null}
            {err ? (
              <p
                id={`${id}-err`}
                className="text-alert text-small mt-2 font-bold"
              >
                {err}
              </p>
            ) : null}
          </div>
        );
      })}

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
