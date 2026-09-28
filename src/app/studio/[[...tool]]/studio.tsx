'use client';

/**
 * The Studio runs entirely in the browser; keeping the config import behind
 * this client boundary stops Sanity's editor code from being bundled for the
 * server.
 */
import { NextStudio } from 'next-sanity/studio';

import config from '../../../../sanity.config';

export function Studio() {
  return <NextStudio config={config} />;
}
