/**
 * Boots the motion system inside one MotionScope: finds every data-motion
 * effect and data-scene on the page, loads only the plugins they need, and
 * runs them inside gsap.matchMedia so a viewport or preference change reverts
 * and re-runs everything cleanly.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  type Conditions,
  type EffectName,
  effects,
  type PluginName,
  type Tools,
} from './effects';
import { type SceneName, scenes } from './scenes';

const loaders: Record<PluginName, () => Promise<object>> = {
  SplitText: () => import('gsap/SplitText').then((m) => m.SplitText),
};

const queries = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 768px)',
  fine: '(hover: hover) and (pointer: fine)',
};

export async function boot(root: HTMLElement): Promise<() => void> {
  // Split text and pin positions must be measured with the real fonts.
  await document.fonts.ready;

  const byEffect = new Map<EffectName, HTMLElement[]>();

  for (const el of root.querySelectorAll<HTMLElement>('[data-motion]')) {
    const name = el.dataset.motion as EffectName;

    if (!(name in effects)) continue;
    byEffect.set(name, [...(byEffect.get(name) ?? []), el]);
  }

  const sceneEls = [
    ...root.querySelectorAll<HTMLElement>('[data-scene]'),
  ].filter((el) => (el.dataset.scene as SceneName) in scenes);

  if (byEffect.size === 0 && sceneEls.length === 0) return () => undefined;

  const needed = new Set<PluginName>([
    ...[...byEffect.keys()].flatMap((n) => effects[n].plugins),
    ...sceneEls.flatMap((el) => scenes[el.dataset.scene as SceneName].plugins),
  ]);

  const loaded = await Promise.all(
    [...needed].map(async (n) => [n, await loaders[n]()] as const)
  );

  gsap.registerPlugin(ScrollTrigger, ...loaded.map(([, p]) => p));
  ScrollTrigger.config({ ignoreMobileResize: true });
  const tools = { gsap, ScrollTrigger, ...Object.fromEntries(loaded) } as Tools;
  const mm = gsap.matchMedia();

  mm.add(queries, (ctx) => {
    const c = ctx.conditions as Conditions;
    const cleanups: (() => void)[] = [];

    // Scenes first: pins change the page height every later trigger measures.
    for (const el of sceneEls) {
      const undo = scenes[el.dataset.scene as SceneName].run(el, tools, c);

      if (undo) cleanups.push(undo);
    }

    for (const [name, els] of byEffect) {
      const undo = effects[name].run(els, tools, c);

      if (undo) cleanups.push(undo);
    }

    return () => cleanups.forEach((f) => f());
  });

  ScrollTrigger.refresh();

  return () => mm.revert();
}
