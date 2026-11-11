/**
 * The site's two signature scenes (docs/design-direction.md). Each is one
 * labelled, scrubbed timeline built against a markup contract. Without
 * JavaScript, or with reduced motion, the markup is already complete: the
 * field is a flat full-width photo, the years are a swipeable rail.
 *
 * The years rail runs on phones too (the owner's call), with a shorter
 * scroll distance. The field scene is desktop only: on phones the aerial
 * stands upright and full-screen under the copy and simply scrolls (owner's
 * call, November 2026).
 */
import type { Conditions, PluginName, Tools } from './effects';

export type Scene = {
  plugins: PluginName[];
  run: (el: HTMLElement, t: Tools, c: Conditions) => void | (() => void);
};

/**
 * The server-rendered <div data-pin-spacer> around a pinned section. Handing
 * it to ScrollTrigger stops it wrapping the section in a spacer of its own:
 * that DOM move makes WebKit cancel and restart every CSS animation inside,
 * so the hero headline would rise a second time.
 */
const spacer = (el: HTMLElement) =>
  el.parentElement?.hasAttribute('data-pin-spacer')
    ? el.parentElement
    : undefined;

export const scenes = {
  /**
   * Hero. <section data-scene="field"> with [data-field-copy] and
   * [data-field-plane] (inside a .stage-3d parent). The aerial lies as a 3D
   * plane tilted back like farmland seen from the air; scrolling lifts it
   * upright and full-bleed while the headline recedes into depth.
   */
  field: {
    plugins: [],
    run(el, { gsap }, c) {
      if (c.reduce || !c.desktop) return;
      const copy = el.querySelector<HTMLElement>('[data-field-copy]');
      const plane = el.querySelector<HTMLElement>('[data-field-plane]');
      const veil = el.querySelector<HTMLElement>('[data-field-veil]');
      const caption = el.querySelector<HTMLElement>('[data-field-caption]');

      if (!copy || !plane) return;

      el.dataset.fieldArmed = '';
      const tilt = 73;
      const PERSPECTIVE = 1400; // matches .stage-3d

      /**
       * Where the tilted plane starts: its far (top) edge sits just under
       * the copy, so land and text never overlap at any viewport size. Pure
       * projection maths (plane rotated about its bottom edge, perspective
       * origin at the stage centre), so nothing is measured mid-transform.
       * If there's no room for a useful strip, the plane waits just below
       * the fold and rises in with the scroll.
       */
      const startY = () => {
        const H = el.clientHeight;
        const copyBottom = copy.offsetTop + copy.offsetHeight;
        let target = copyBottom + 32;

        if (target > H - 90) target = H + 8;
        const rad = (tilt * Math.PI) / 180;
        const k = PERSPECTIVE / (PERSPECTIVE + H * Math.sin(rad));

        return (target - H / 2) / k - (H / 2 - H * Math.cos(rad));
      };

      if (caption) gsap.set(caption, { opacity: 0, y: 30 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${innerHeight * 1.3}`,
          pin: true,
          pinSpacer: spacer(el),
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.addLabel('tilted')
        .fromTo(
          plane,
          { rotateX: tilt, y: startY, transformOrigin: '50% 100%' },
          { rotateX: 0, y: 0, duration: 1, ease: 'power1.inOut' },
          'tilted'
        )
        .to(
          copy,
          { yPercent: -30, opacity: 0, scale: 0.96, duration: 0.38 },
          'tilted'
        )
        // Once faded, the copy must not sit on top of the photo and eat taps.
        .set(copy, { pointerEvents: 'none' }, 'tilted+=0.36')
        .to(veil ?? {}, { opacity: 0.55, duration: 0.6 }, 'tilted+=0.4')
        .addLabel('flat');
      if (caption)
        tl.to(caption, { opacity: 1, y: 0, duration: 0.3 }, 'flat-=0.25');

      return () => {
        delete el.dataset.fieldArmed;
        gsap.set([plane, copy, caption, veil].filter(Boolean), {
          clearProps: 'all',
        });
      };
    },
  },

  /**
   * Thirty years, sideways. <section data-scene="years"> with
   * [data-motion-rail] > [data-motion-track] > [data-motion-item data-year],
   * plus a [data-years-count] readout and an optional [data-years-fill] rule.
   * Vertical scroll drives the track; each panel swings in from a 3D angle;
   * the year readout follows the panel in view.
   */
  years: {
    plugins: [],
    run(el, { gsap, ScrollTrigger }, c) {
      if (c.reduce) return;
      const rail = el.querySelector<HTMLElement>('[data-motion-rail]');
      const track = el.querySelector<HTMLElement>('[data-motion-track]');
      const count = el.querySelector<HTMLElement>('[data-years-count]');
      const fill = el.querySelector<HTMLElement>('[data-years-fill]');

      if (!rail || !track) return;

      const items = [
        ...track.querySelectorAll<HTMLElement>('[data-motion-item]'),
      ];

      el.dataset.motionPinned = '';
      const distance = () => track.scrollWidth - rail.clientWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          pin: true,
          pinSpacer: spacer(el),
          scrub: 1,
          start: 'top top',
          end: () => `+=${distance() * (c.desktop ? 1 : 1.2)}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (fill) gsap.set(fill, { scaleX: self.progress });
          },
        },
      });

      for (const item of items) {
        const inner = item.firstElementChild as HTMLElement | null;

        gsap.fromTo(
          inner ?? item,
          { rotateY: -32, z: -160, opacity: 0.25, transformOrigin: '0% 50%' },
          {
            rotateY: 0,
            z: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              containerAnimation: tween,
              start: 'left 95%',
              end: 'left 45%',
              scrub: true,
            },
          }
        );

        if (count) {
          ScrollTrigger.create({
            trigger: item,
            containerAnimation: tween,
            start: 'left 55%',
            end: 'right 55%',
            onToggle: (self) => {
              if (self.isActive) count.textContent = item.dataset.year ?? '';
            },
          });
        }
      }

      const onFocus = (e: FocusEvent) => {
        const item = (e.target as HTMLElement).closest<HTMLElement>(
          '[data-motion-item]'
        );

        const st = tween.scrollTrigger;

        if (!item || !st) return;
        const p = Math.min(1, item.offsetLeft / Math.max(1, distance()));

        window.scrollTo({
          top: st.start + p * (st.end - st.start),
          behavior: 'instant',
        });
      };

      track.addEventListener('focusin', onFocus);

      return () => {
        track.removeEventListener('focusin', onFocus);
        delete el.dataset.motionPinned;
      };
    },
  },
} satisfies Record<string, Scene>;

export type SceneName = keyof typeof scenes;
