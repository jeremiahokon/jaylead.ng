/**
 * Turns on Draft Mode for the Studio's Presentation preview. next-sanity
 * validates the signed secret with the viewer token before enabling it.
 */
import { defineEnableDraftMode } from 'next-sanity/draft-mode';

import { client } from '@/sanity/client';

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
