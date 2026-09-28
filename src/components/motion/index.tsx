'use client';

import { type ReactNode, useEffect, useRef } from 'react';

type Props = { children: ReactNode; className?: string };

/**
 * The only client boundary the motion system needs, placed per page (not in
 * the layout) so Cache Components' hidden routes are never measured. Children
 * stay Server Components. GSAP arrives in its own chunk on idle, after the
 * page is already complete and interactive.
 *
 * Automated browsers get the static page (full-page screenshots never
 * scroll, so scroll-triggered content would stay hidden). Add ?motion=1 to
 * force the motion on for testing.
 */
export function MotionScope({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const forced = new URLSearchParams(location.search).has('motion');

    if (!root || (navigator.webdriver && !forced)) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    const start = () =>
      import('./runtime')
        .then(({ boot }) => boot(root))
        .then((d) => (cancelled ? d() : (dispose = d)));

    const id =
      'requestIdleCallback' in window
        ? requestIdleCallback(start, { timeout: 900 })
        : setTimeout(start, 150);

    return () => {
      cancelled = true;
      if ('cancelIdleCallback' in window) cancelIdleCallback(id as number);
      clearTimeout(id as number);
      dispose?.();
    };
  }, []);

  return (
    <div ref={ref} className={className} data-motion-scope="">
      {children}
    </div>
  );
}
