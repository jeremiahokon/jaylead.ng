'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import type Lenis from 'lenis';

/**
 * Lenis eased scrolling for mouse and trackpad, synced to ScrollTrigger so
 * scrubbed scenes feel weighted. Touch keeps native momentum and reduced
 * motion keeps native scroll. Overlays that scroll on their own carry
 * data-lenis-prevent.
 *
 * Also starts every new page at the top. Next keeps the scroll position when
 * the new page is still in view, so a link from the footer would otherwise
 * land mid-page. Back and forward keep the browser's restored position, and
 * links to a #section are left to scroll to it.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const historyNav = useRef(false);
  const firstRender = useRef(true);

  useEffect(() => {
    const onPop = () => {
      historyNav.current = true;
    };

    addEventListener('popstate', onPop);

    return () => removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      return;
    }

    if (historyNav.current) {
      historyNav.current = false;

      return;
    }

    if (location.hash) {
      // The pinned scenes add their scroll length after Next has scrolled,
      // pushing the target down; land on it again once layout settles.
      const id = decodeURIComponent(location.hash.slice(1));

      const timer = setTimeout(() => {
        const target = document.getElementById(id);

        if (!target) return;
        if (lenisRef.current)
          lenisRef.current.scrollTo(target, { immediate: true, force: true });
        else target.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 400);

      return () => clearTimeout(timer);
    }

    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    if (
      !matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)')
        .matches
    )
      return;
    let destroy: (() => void) | undefined;
    let cancelled = false;

    void Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.09 });

      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);

      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      destroy = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  return null;
}
