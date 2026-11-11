/**
 * Generic, attribute-driven effects (playbook/animation.md, section 4).
 * Sections are Server Components that opt in with data-motion="…"; this
 * file runs only on the client, inside gsap.matchMedia, so every tween is
 * reverted when the viewport or motion preference changes.
 *
 * Contract: transform and opacity only. Elements already on screen at boot
 * are left alone, and initial hidden states are set here, never in CSS, so
 * the page is complete without JavaScript.
 */
import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import type { SplitText } from 'gsap/SplitText';

export type PluginName = 'SplitText';

export type Tools = {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ST;
  SplitText: typeof SplitText;
};

export type Conditions = {
  motion: boolean;
  reduce: boolean;
  desktop: boolean;
  fine: boolean;
};

export type Effect = {
  plugins: PluginName[];
  run: (els: HTMLElement[], t: Tools, c: Conditions) => void | (() => void);
};

/** Mirrors --ease-out-expo, so CSS and GSAP motion feel like one hand. */
export const EASE = 'expo.out';

const pending = (els: Element[], { ScrollTrigger }: Tools) =>
  els.filter(
    (el) =>
      !ScrollTrigger.isInViewport(el) && !el.closest('[data-motion-track]')
  );

function revealBatch(targets: Element[], t: Tools, c: Conditions) {
  const els = pending(targets, t);

  if (els.length === 0) return;
  // opacity, never autoAlpha: hidden links must stay in the tab order.
  t.gsap.set(els, { opacity: 0, y: c.reduce ? 0 : 48 });
  t.ScrollTrigger.batch(els, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      t.gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: c.reduce ? 0.3 : 1.1,
        ease: EASE,
        stagger: c.reduce ? 0 : 0.09,
        overwrite: true,
      }),
  });
}

function split(type: 'lines' | 'words'): Effect {
  return {
    plugins: ['SplitText'],
    run(els, t, c) {
      if (c.reduce) return revealBatch(els, t, c);

      for (const el of pending(els, t)) {
        // No clipping mask: a mask wrapper trims descenders (g, y, p) at
        // display line-heights. Lines rise and fade instead.
        t.SplitText.create(el, {
          type,
          autoSplit: true,
          onSplit: (self) =>
            t.gsap.from(self[type], {
              yPercent: 60,
              opacity: 0,
              rotate: type === 'words' ? 2 : 0,
              duration: 1.2,
              ease: EASE,
              stagger: type === 'lines' ? 0.09 : 0.045,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        });
      }
    },
  };
}

export const effects = {
  /** Fade and rise once, on entry, batched with neighbours. */
  reveal: { plugins: [], run: revealBatch },

  /** Direct children reveal in order. */
  stagger: {
    plugins: [],
    run: (els, t, c) =>
      revealBatch(
        els.flatMap((el) => [...el.children]),
        t,
        c
      ),
  },

  /** Masked line reveal for headings and statements. */
  lines: split('lines'),

  /** Masked word reveal for display type. */
  words: split('words'),

  /**
   * A statement paragraph whose words brighten from faint to full ink as it
   * scrolls through the viewport. Words stay in the DOM as text.
   */
  ink: {
    plugins: ['SplitText'],
    run(els, t, c) {
      if (c.reduce) return;

      for (const el of els) {
        t.SplitText.create(el, {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            t.gsap.fromTo(
              self.words,
              { opacity: 0.14 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.1,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 80%',
                  end: 'bottom 45%',
                  scrub: 0.6,
                },
              }
            ),
        });
      }
    },
  },

  /** Background drift. data-motion-speed at most 0.12; the element overscans its frame. */
  parallax: {
    plugins: [],
    run(els, { gsap }, c) {
      if (c.reduce) return;

      for (const el of els) {
        const s = Math.min(Number(el.dataset.motionSpeed ?? 0.08), 0.12) * 100;

        gsap.fromTo(
          el,
          { yPercent: -s },
          {
            yPercent: s,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    },
  },

  /** Depth: siblings drift at different speeds (data-motion-depth, -1 to 1). */
  depth: {
    plugins: [],
    run(els, { gsap }, c) {
      if (c.reduce) return;

      for (const el of els) {
        const d = Number(el.dataset.motionDepth ?? 0.5);

        gsap.fromTo(
          el,
          { y: 120 * d },
          {
            y: -120 * d,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      }
    },
  },

  /** Image settles from 1.18x to 1x inside its overflow-hidden frame. */
  unmask: {
    plugins: [],
    run(els, { gsap }, c) {
      if (c.reduce) return;

      for (const el of els) {
        gsap.fromTo(
          el,
          { scale: 1.18 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'center center',
              scrub: 0.6,
            },
          }
        );
      }
    },
  },

  /** Rows slide in from alternating sides as they enter (the offer ledger). */
  slide: {
    plugins: [],
    run(els, t, c) {
      const rows = pending(
        els.flatMap((el) => [...el.children]),
        t
      );

      if (!rows.length) return;
      rows.forEach((row, i) => {
        t.gsap.from(row, {
          x: c.reduce ? 0 : (i % 2 ? 1 : -1) * (c.desktop ? 160 : 60),
          opacity: 0,
          duration: c.reduce ? 0.3 : 1.3,
          ease: EASE,
          scrollTrigger: { trigger: row, start: 'top 90%', once: true },
        });
      });
    },
  },

  /**
   * 3D card entrance: each child swings up from a tilted plane, like a page
   * of the register being laid down. Desktop only: on phones the perspective
   * swing reads as a lurch, so children simply fade and rise into place.
   */
  tilt: {
    plugins: [],
    run(els, t, c) {
      if (c.reduce || !c.desktop)
        return revealBatch(
          els.flatMap((el) => [...el.children]),
          t,
          c
        );

      for (const el of els) {
        const kids = pending([...el.children], t) as HTMLElement[];

        if (!kids.length) continue;
        t.gsap.set(el, { perspective: 1200 });
        t.gsap.set(kids, {
          rotateX: -38,
          y: 90,
          opacity: 0,
          transformOrigin: '50% 0%',
        });
        t.ScrollTrigger.batch(kids, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) =>
            t.gsap.to(batch, {
              rotateX: 0,
              y: 0,
              opacity: 1,
              duration: 1.4,
              ease: EASE,
              stagger: 0.12,
            }),
        });
      }
    },
  },

  /** Counts up to the number already in the markup; the real value is server-rendered. */
  counter: {
    plugins: [],
    run(els, t, c) {
      if (c.reduce) return;
      const restore: (() => void)[] = [];

      for (const el of pending(els, t)) {
        const final = el.textContent ?? '';
        const match = /\d[\d,]*/.exec(final);

        if (!match) continue;
        const raw = match[0];
        const target = Number(raw.replaceAll(',', ''));
        const fmt = new Intl.NumberFormat('en-NG');
        const n = { v: 0 };

        const write = () =>
          (el.textContent = final.replace(raw, fmt.format(Math.round(n.v))));

        write();
        t.gsap.to(n, {
          v: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: write,
          onComplete: () => void (el.textContent = final),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
        restore.push(() => void (el.textContent = final));
      }

      return () => restore.forEach((f) => f());
    },
  },

  /** Pulls toward the pointer. Mouse and trackpad only. */
  magnetic: {
    plugins: [],
    run(els, { gsap }, c) {
      if (!c.fine || c.reduce) return;
      const off: (() => void)[] = [];

      for (const el of els) {
        const k = Number(el.dataset.motionStrength ?? 0.3);

        const xTo = gsap.quickTo(el, 'x', {
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
        });

        const yTo = gsap.quickTo(el, 'y', {
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
        });

        let r = el.getBoundingClientRect();
        const enter = () => (r = el.getBoundingClientRect());

        const move = (e: PointerEvent) => {
          xTo((e.clientX - r.left - r.width / 2) * k);
          yTo((e.clientY - r.top - r.height / 2) * k);
        };

        const leave = () => (xTo(0), yTo(0));

        el.addEventListener('pointerenter', enter);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        off.push(() => {
          el.removeEventListener('pointerenter', enter);
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        });
      }

      return () => off.forEach((f) => f());
    },
  },

  /** Skews a marquee row with scroll speed, settling when scrolling stops. */
  velocity: {
    plugins: [],
    run(els, { gsap, ScrollTrigger }, c) {
      if (c.reduce) return;

      const skews = els.map((el) =>
        gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3.out' })
      );

      let settle: ReturnType<typeof gsap.delayedCall> | undefined;

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-8, 8, self.getVelocity() / -300);

          skews.forEach((s) => s(v));
          settle?.kill();
          settle = gsap.delayedCall(0.14, () => skews.forEach((s) => s(0)));
        },
      });

      return () => st.kill();
    },
  },
} satisfies Record<string, Effect>;

export type EffectName = keyof typeof effects;
