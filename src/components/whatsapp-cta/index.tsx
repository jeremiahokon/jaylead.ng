/**
 * WhatsApp call to action: a plain wa.me anchor (works with JavaScript off)
 * built from the page's template, with the reply-time note under the group
 * (brief section 8). One pill style, same words everywhere; the arrow is the
 * typeface's own glyph, not an icon.
 */
import type { ReactNode } from 'react';

import { getSettings } from '@/lib/content';
import type { WhatsappTemplateKey } from '@/lib/types';
import { cn, type TemplateVars, utils } from '@/lib/utils';

type LinkProps = {
  template: WhatsappTemplateKey;
  vars?: TemplateVars;
  children: ReactNode;
  variant?: 'pill' | 'ghost' | 'text';
  magnetic?: boolean;
  className?: string;
};

export async function WhatsAppLink({
  template,
  vars,
  children,
  variant = 'pill',
  magnetic,
  className,
}: LinkProps) {
  const settings = await getSettings();
  const href = utils.contact.whatsappHref(settings, template, vars);

  const styles = {
    pill: 'pill group',
    ghost: 'pill pill-ghost group',
    text: 'group link-draw font-medium',
  }[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={cn(styles, className)}
      data-motion={magnetic ? 'magnetic' : undefined}
      data-motion-strength={magnetic ? '0.25' : undefined}
    >
      <span>{children}</span>
      <span className="sr-only"> (opens WhatsApp)</span>
    </a>
  );
}

export async function ReplyNote({ className }: { className?: string }) {
  const { whatsappReplyNote } = await getSettings();

  return (
    <p className={cn('micro opacity-70', className)}>{whatsappReplyNote}</p>
  );
}

/** A row of CTAs with the reply note beneath. */
export async function CtaGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {children}
      </div>
      <ReplyNote className="mt-4" />
    </div>
  );
}
