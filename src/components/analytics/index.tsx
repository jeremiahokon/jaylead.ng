/**
 * Meta Pixel and Google Analytics 4, for the ad campaigns. Each loads only
 * when its ID is set (NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GA_ID), after
 * the page is interactive, so neither delays first paint.
 *
 * Page views: both libraries follow client-side navigation themselves (the
 * pixel listens to pushState; GA4 enhanced measurement to history events),
 * so no route listener is needed here and nothing is counted twice.
 * Conversions: lead-form success calls trackLead; WhatsApp taps are caught
 * site-wide by WhatsAppTracker.
 */
import Script from 'next/script';

import { gaId, metaPixelId } from '@/lib/analytics';

import { WhatsAppTracker } from './whatsapp-tracker';

const validPixel = metaPixelId && /^\d+$/.test(metaPixelId);
const validGa = gaId && /^G-[A-Z0-9]+$/.test(gaId);

export function Analytics() {
  if (!validPixel && !validGa) return null;

  return (
    <>
      {validPixel ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(metaPixelId)});fbq('track','PageView');`}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      ) : null}
      {validGa ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
          </Script>
        </>
      ) : null}
      <WhatsAppTracker />
    </>
  );
}
