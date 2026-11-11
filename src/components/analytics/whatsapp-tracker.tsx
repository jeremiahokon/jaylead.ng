'use client';

import { useEffect } from 'react';

import { trackWhatsApp } from '@/lib/analytics';

/**
 * One delegated listener catches every WhatsApp link on the site (header,
 * CTAs, footer, form handoff), so no link component needs to know about
 * tracking. Renders nothing.
 */
export function WhatsAppTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]');
      const href = link?.getAttribute('href') ?? '';

      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href))
        trackWhatsApp(location.pathname);
    };

    document.addEventListener('click', onClick, { capture: true });

    return () =>
      document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
