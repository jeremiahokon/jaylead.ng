'use client';

/**
 * The Studio runs entirely in the browser; keeping the config import behind
 * this client boundary stops Sanity's editor code from being bundled for the
 * server.
 *
 * `@refresh reset` makes Fast Refresh remount the Studio when the config or
 * anything it imports changes, instead of keeping its state across a config
 * swap. It does not silence the "final argument passed to useMemo changed
 * size" console error: that one comes from inside Sanity's own packages,
 * is a React development-only check, and never shows in a production build.
 */
// @refresh reset
import { NextStudio } from 'next-sanity/studio';

import config from '../../../../sanity.config';

export function Studio() {
  return <NextStudio config={config} />;
}
