/**
 * Turns the raw scrape and licensed stock in jaylead_ng/ into web-ready files
 * (brief section 6) and writes src/data/images.ts, the typed manifest the seed
 * content reads. Run with: pnpm assets
 *
 * - Photos and stills: WebP sources at most 1440px wide in public/images/.
 *   Only images the site renders are listed; unused ones are left out so they
 *   never ship.
 *   next/image cuts the AVIF/WebP size ladder from these at request time, so
 *   the 480/960/1440 rungs in the brief come from `sizes`, not from files.
 * - Video posters: one clean frame per clip, cropped to 4:5 above or below
 *   any burned-in caption, at most 720px and under 60 KB, in public/posters/.
 * - The aerial: the one self-hosted video (owner's decision, see the PR).
 *   Logo intro and outro cut, silent, H.264 CRF 28, faststart, 720p.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

const ROOT = join(import.meta.dirname, '..');
const SRC = join(ROOT, 'jaylead_ng');
const IMAGES = join(ROOT, 'public/images');
const POSTERS = join(ROOT, 'public/posters');
const VIDEO = join(ROOT, 'public/video');
const STAGING = join(ROOT, '.staging');

type Source = {
  name: string;
  file: string;
  alt: string;
  real: boolean;
  caption?: string;
  maxWidth?: number;
  /** [left, top, width, height] as fractions of the source */
  crop?: [number, number, number, number];
  quality?: number;
};

const photos: Source[] = [
  {
    name: 'aerial-fields',
    file: 'site-assets/stills/aerial-13.jpg',
    alt: 'Aerial view over Jaylead farmland: a patchwork of cultivated plots, crop rows and tree cover under a pale sky',
    real: true,
    caption: 'Drone footage of Jaylead farmland, September 2026',
    quality: 70,
  },
  {
    name: 'aerial-perimeter',
    file: 'site-assets/stills/aerial-18.jpg',
    alt: 'Drone view of open farmland with a long white perimeter fence and site buildings on the left',
    real: true,
    caption: 'Drone footage of Jaylead farmland, September 2026',
  },
  {
    name: 'aerial-site',
    file: 'site-assets/stills/aerial-8.jpg',
    alt: 'Drone view of green farmland with crop rows, a dirt track, a fence line and farm buildings',
    real: true,
    caption: 'Drone footage of Jaylead farmland, September 2026',
  },
  {
    name: 'founder-portrait-suit',
    file: 'site-assets/photos/founder-portrait-suit.jpg',
    alt: 'Adetunji Jacob Ogunyemi, Managing Director of Jaylead AgriEstate, in a grey suit against a bright wall',
    real: true,
    crop: [0, 0.04, 1, 0.75],
  },
  {
    name: 'founder-portrait-agbada',
    file: 'site-assets/photos/founder-portrait-agbada.jpg',
    alt: 'Adetunji Jacob Ogunyemi in traditional attire, photographed outdoors',
    real: true,
    crop: [0, 0.02, 1, 0.75],
  },
  {
    name: 'founder-opening-day',
    file: 'site-assets/photos/founder-opening-day.jpg',
    alt: 'The Managing Director on opening day at the Jaylead office in Tanke, Ilorin',
    real: true,
    crop: [0, 0.1, 1, 0.5625],
  },
  {
    name: 'office-logo-wall',
    file: 'site-assets/photos/office-logo-wall.jpg',
    alt: 'The illuminated Jaylead AgriEstate logo sign on the wall of the Tanke, Ilorin office',
    real: true,
    crop: [0, 0.34, 1, 0.45],
  },
  {
    name: 'office-before',
    file: 'site-assets/stills/office-reception-after.jpg',
    alt: 'The Tanke office before renovation: a bare room with workers on ladders',
    real: true,
    caption: 'Before the renovation',
    crop: [0, 0.18, 1, 0.5625],
  },
  {
    name: 'core-values-board',
    file: 'site-assets/stills/core-values-board.png',
    alt: 'The core values board on the wall of the Jaylead office',
    real: true,
    crop: [0, 0.15, 1, 0.5625],
  },
  {
    name: 'palm-grove-jos',
    file: 'stock/palm-grove-jos.jpg',
    alt: 'Mature oil palms in rows over green undergrowth in a Nigerian palm grove',
    real: false,
    caption: 'Illustration: a mature palm grove in Jos, Nigeria (Pexels)',
  },
  {
    name: 'plantation-drone',
    file: 'stock/plantation-drone.jpg',
    alt: 'Top-down drone view of an oil palm plantation, crowns of palms in even rows',
    real: false,
    caption: 'Illustration: a mature oil palm plantation (Pexels)',
  },
  {
    name: 'plantation-undergrowth',
    file: 'stock/plantation-undergrowth.jpg',
    alt: 'Inside a dense oil palm plantation, tall palms over green ground cover',
    real: false,
    caption: 'Illustration: inside a managed oil palm plantation (Unsplash)',
  },
  {
    name: 'young-palm',
    file: 'stock/young-palm.jpg',
    alt: 'A young oil palm tree growing in a cleared, grassy plantation',
    real: false,
    caption: 'Illustration: a young oil palm, two to three years in (Pexels)',
  },
  {
    name: 'saplings-nursery',
    file: 'stock/saplings-nursery.jpg',
    alt: 'Rows of young seedlings in black nursery bags',
    real: false,
    caption: 'Illustration: seedlings in a nursery (Pexels)',
  },
  {
    name: 'palm-fruit-basin',
    file: 'stock/palm-nuts-basin.jpg',
    alt: 'Fresh red and black oil palm fruitlets in a large metal basin',
    real: false,
    caption: 'Illustration: fresh palm fruit ready for processing (Pexels)',
  },
];

/** Blog covers: the brand's own Instagram graphics. They carry text, so they are covers only. */
const covers: Source[] = [
  [
    'palm-grove-vs-dangote-ipo',
    'A Jaylead graphic comparing a Palm Grove Estate plot with buying shares in an IPO',
  ],
  [
    'malete-land-inspection',
    'A Jaylead graphic about the land inspection in Malete, Kwara, with field photos',
  ],
  [
    'tech-depreciates-farmland-grows',
    'A Jaylead graphic: technology depreciates, farmland can keep producing',
  ],
  ['something-worth-owning', 'A Jaylead graphic: "Something worth owning"'],
].map(([name, alt]) => ({
  name: `cover-${name}`,
  file: `site-assets/graphics/${name}.jpg`,
  alt,
  real: false,
  caption: 'Jaylead graphic',
  maxWidth: 1000,
}));

covers.push({
  name: 'palm-grove-pricing-card',
  file: 'site-assets/brand/palm-grove-pricing-card.jpg',
  alt: 'The Palm Grove Estate pricing card as published: 1 hectare with 150 trees and 1 acre with 60 trees, Osun State',
  real: false,
  caption: 'Pricing as published on Instagram, 2 June 2026',
  maxWidth: 1000,
});

type Poster = {
  name: string;
  video: string;
  at: number;
  crop: 'top' | 'bottom' | 'center';
  alt: string;
};

/** Frames picked by eye from contact sheets: no captions, no logo cards. */
const posters: Poster[] = [
  {
    name: 'DdUCrOCqirW',
    video: 'office-launch-114s',
    at: 50.1,
    crop: 'center',
    alt: 'The lit Jaylead AgriEstate logo wall at the office launch',
  },
  {
    name: 'DdEvWuJq-mb',
    video: 'office-teaser-9s',
    at: 8.2,
    crop: 'center',
    alt: 'Guests gathered in the new Jaylead office',
  },
  {
    name: 'DdJx-XQqgvp',
    video: 'soil-testing-4s',
    at: 0.5,
    crop: 'top',
    alt: 'A soil tester pushed into dark farm soil among young plants',
  },
  {
    name: 'DdjhG1VqZAd',
    video: 'wealth-that-lasts-34s',
    at: 10.5,
    crop: 'top',
    alt: 'The Managing Director explaining long-term wealth in the office',
  },
  {
    name: 'DdnfS6dNvtI',
    video: 'founder-desk-20s',
    at: 18.7,
    crop: 'center',
    alt: 'The Managing Director at his desk in the Jaylead office',
  },
  {
    name: 'DdrPFNtqg-3',
    video: 'this-or-that-78s',
    at: 34.2,
    crop: 'bottom',
    alt: 'The Managing Director on a teal sofa answering "this or that" questions about land',
  },
  {
    name: 'DdtyFloqy-0',
    video: 'managed-plantation-37s',
    at: 25.3,
    crop: 'bottom',
    alt: 'The Managing Director explaining a managed plantation, seated in the office',
  },
  {
    name: 'DdD4lwIummX',
    video: 'founder-on-site-hi-vis',
    at: 12.5,
    crop: 'top',
    alt: 'The Managing Director in a hi-vis vest on overgrown farmland',
  },
  {
    name: '7684617902401588500',
    video: 'office-before-after-tiktok',
    at: 19.8,
    crop: 'center',
    alt: 'The renovated Jaylead office with a desk and wood panelling',
  },
  {
    name: '7684995951454342421',
    video: 'prayer-to-keys-tiktok',
    at: 34.5,
    crop: 'center',
    alt: 'The team gathered in the new office on opening day',
  },
  {
    name: 'DdZEAqaKey0',
    video: 'aerial-land-drone-26s',
    at: 11.6,
    crop: 'center',
    alt: 'Drone view over green Jaylead farmland',
  },
];

type Manifest = Record<
  string,
  {
    src: string;
    width: number;
    height: number;
    alt: string;
    isRealSitePhoto: boolean;
    caption?: string;
    lqip: string;
  }
>;

async function lqip(input: sharp.Sharp): Promise<string> {
  const buf = await input.clone().resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function processImage(s: Source, manifest: Manifest) {
  const input = sharp(join(SRC, s.file));
  const meta = await input.metadata();
  let img = input.clone();
  if (s.crop && meta.width && meta.height) {
    const [l, t, w, h] = s.crop;
    const left = Math.round(meta.width * l);
    const top = Math.round(meta.height * t);
    img = img.extract({
      left,
      top,
      width: Math.min(Math.round(meta.width * w), meta.width - left),
      height: Math.min(Math.round(meta.height * h), meta.height - top),
    });
  }
  const out = join(IMAGES, `${s.name}.webp`);
  const info = await img
    .resize({
      width: s.maxWidth ?? (s.real ? 1440 : 1280),
      withoutEnlargement: true,
    })
    .webp({
      quality: s.quality ?? (s.real ? 72 : 62),
      smartSubsample: true,
      effort: 6,
    })
    .toFile(out);
  manifest[s.name] = {
    src: `/images/${s.name}.webp`,
    width: info.width,
    height: info.height,
    alt: s.alt,
    isRealSitePhoto: s.real,
    caption: s.caption,
    lqip: await lqip(sharp(out)),
  };
  console.log(
    `${s.name}: ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`
  );
}

async function processPoster(p: Poster, manifest: Manifest) {
  const frame = join(STAGING, `${p.name}.png`);
  execFileSync('ffmpeg', [
    '-v',
    'error',
    '-y',
    '-ss',
    String(p.at),
    '-i',
    join(SRC, 'site-assets/video', `${p.video}.mp4`),
    '-frames:v',
    '1',
    frame,
  ]);
  const meta = await sharp(frame).metadata();
  const w = meta.width!;
  const h = meta.height!;
  const landscape = w > h;
  const cw = landscape ? Math.round((h * 4) / 5) : w;
  const ch = landscape ? h : Math.round((w * 5) / 4);
  const top =
    p.crop === 'top'
      ? 0
      : p.crop === 'bottom'
        ? h - ch
        : Math.round((h - ch) / 2);
  const left = Math.round((w - cw) / 2);
  const out = join(POSTERS, `${p.name}.webp`);
  let quality = 74;
  let info: sharp.OutputInfo;
  do {
    info = await sharp(frame)
      .extract({ left, top, width: cw, height: ch })
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality })
      .toFile(out);
    quality -= 6;
  } while (info.size > 60 * 1024 && quality > 40);
  manifest[`poster-${p.name}`] = {
    src: `/posters/${p.name}.webp`,
    width: info.width,
    height: info.height,
    alt: p.alt,
    isRealSitePhoto: true,
    lqip: await lqip(sharp(out)),
  };
  console.log(
    `poster ${p.name}: ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`
  );
}

function processAerial() {
  const out = join(VIDEO, 'aerial.mp4');
  // The source is intro card (0 to 6.7s), footage, a "PALM GROVE" title card
  // (8.4 to 10.3s), footage, then the logo outro (from 22.3s). Keep only the
  // two footage segments and join them: about 14 seconds, no cards.
  execFileSync('ffmpeg', [
    '-v',
    'error',
    '-y',
    '-i',
    join(SRC, 'site-assets/video/aerial-land-drone-26s.mp4'),
    '-an',
    '-filter_complex',
    '[0:v]trim=6.7:8.35,setpts=PTS-STARTPTS[a];' +
      '[0:v]trim=10.3:22.3,setpts=PTS-STARTPTS[b];' +
      '[a][b]concat=n=2:v=1:a=0,scale=-2:720,fps=30[v]',
    '-map',
    '[v]',
    '-c:v',
    'libx264',
    '-profile:v',
    'high',
    '-preset',
    'slow',
    '-crf',
    '28',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    out,
  ]);
  console.log(
    `aerial.mp4: ${(statSync(out).size / 1024 / 1024).toFixed(2)} MB`
  );
}

async function main() {
  for (const d of [IMAGES, POSTERS, VIDEO, STAGING])
    mkdirSync(d, { recursive: true });
  const manifest: Manifest = {};
  for (const s of [...photos, ...covers]) await processImage(s, manifest);
  for (const p of posters) await processPoster(p, manifest);
  processAerial();

  const body = `/**
 * Generated by scripts/process-assets.ts. Do not edit by hand: change the
 * source list in the script and run \`pnpm assets\`. Every entry carries its
 * real dimensions, alt text, a tiny blur placeholder, and whether it is a
 * real Jaylead photo (false means it renders captioned "Illustration").
 */
import type { Img } from '@/lib/types';

export const images = ${JSON.stringify(manifest, null, 2)} as const satisfies Record<string, Img>;

export type ImageKey = keyof typeof images;
`;
  writeFileSync(join(ROOT, 'src/data/images.ts'), body);
  console.log(
    `wrote src/data/images.ts (${Object.keys(manifest).length} entries)`
  );
}

await main();
