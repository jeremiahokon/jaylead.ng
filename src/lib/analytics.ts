/**
 * Ad and analytics events: one call reports to both Meta Pixel and GA4.
 * Safe to call anywhere on the client: when an ID is not configured, or a
 * blocker stopped the script, the matching global is absent and the call
 * does nothing.
 */
type Fbq = (
  cmd: 'track' | 'trackCustom',
  name: string,
  params?: object
) => void;
type Gtag = (cmd: 'event', name: string, params?: object) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: Gtag;
  }
}

export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
export const gaId = process.env.NEXT_PUBLIC_GA_ID;

/**
 * A form was submitted and saved. `goal` is the visitor's answer to "What
 * brings you here?", so ads can be optimised per intent. No personal data.
 */
export function trackLead(form: string, sourcePage: string, goal?: string) {
  window.fbq?.('track', 'Lead', {
    content_name: form,
    content_category: goal || undefined,
  });
  window.gtag?.('event', 'generate_lead', {
    form_type: form,
    lead_goal: goal || undefined,
    source_page: sourcePage,
  });
}

/** A WhatsApp link was tapped: the site's other conversion. */
export function trackWhatsApp(sourcePage: string) {
  window.fbq?.('track', 'Contact', { content_name: 'whatsapp' });
  window.gtag?.('event', 'whatsapp_click', { source_page: sourcePage });
}
