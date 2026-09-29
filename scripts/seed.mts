/**
 * Loads the starter content into an empty Sanity dataset (brief 16):
 * settings, estate, plots, documents, credentials, invest options, the invest
 * page switch, departments, team, FAQ, categories, the author, every video
 * from src/data/instagram.ts, and the eleven blog posts as DRAFTS for the
 * client's approval. Images are uploaded once each as Sanity assets with
 * their alt text and "real photo" flag.
 *
 * Idempotent: every document has a fixed _id, so re-running overwrites the
 * seed documents and never duplicates them. It never touches leads.
 *
 * Usage (after docs/sanity/env-setup.md):  pnpm seed
 */
import { createReadStream, existsSync } from 'node:fs';
import { join } from 'node:path';

import { createClient } from '@sanity/client';

import { fileVideos } from '../src/data/instagram';
import {
  credentialsSeed,
  departmentsSeed,
  documentsSeed,
  estatesSeed,
  investOptionsSeed,
  investPageSeed,
  plotsSeed,
  teamSeed,
} from '../src/data/seed/catalogue';
import { faqSeed } from '../src/data/seed/faq';
import { authorSeed, categoriesSeed, postsSeed } from '../src/data/seed/posts';
import { settingsSeed } from '../src/data/seed/settings';
import type { Img } from '../src/lib/types';

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error(
    'Missing the Sanity project id or SANITY_API_WRITE_TOKEN. Run `vercel env pull .env.local` (see docs/sanity/env-setup.md).'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-28',
  token,
  useCdn: false,
});

const ROOT = join(import.meta.dirname, '..');
const uploaded = new Map<string, string>();

async function image(img: Img | undefined) {
  if (!img) return undefined;
  let ref = uploaded.get(img.src);
  if (!ref) {
    const file = join(ROOT, 'public', img.src);
    if (!existsSync(file)) return undefined;
    const asset = await client.assets.upload('image', createReadStream(file), {
      filename: img.src.split('/').pop(),
    });
    ref = asset._id;
    uploaded.set(img.src, ref);
    console.log(`  uploaded ${img.src}`);
  }
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: ref },
    alt: img.alt,
    isRealSitePhoto: img.isRealSitePhoto ?? true,
    ...(img.caption ? { caption: img.caption } : {}),
  };
}

const images = async (list: Img[]) =>
  (await Promise.all(list.map(image)))
    .filter(Boolean)
    .map((i, n) => ({ ...i, _key: `img${n}` }));

const ref = (id: string) => ({ _type: 'reference', _ref: id });
const slug = (current: string) => ({ _type: 'slug', current });
const keyed = <T extends object>(list: T[], prefix: string) =>
  list.map((x, i) => ({ ...x, _key: `${prefix}${i}` }));

async function main() {
  const tx = client.transaction();

  console.log('Site settings');
  tx.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...settingsSeed,
    officeHours: keyed(settingsSeed.officeHours, 'h'),
    socials: keyed(settingsSeed.socials, 's'),
    whatsappTemplates: keyed(settingsSeed.whatsappTemplates, 't'),
    faithValues: keyed(settingsSeed.faithValues, 'v'),
  });

  console.log('Documents, credentials, departments, team');
  documentsSeed.forEach((d, i) =>
    tx.createOrReplace({
      _id: d._id,
      _type: 'documentType',
      name: d.name,
      plainExplanation: d.plainExplanation,
      order: i + 1,
    })
  );
  credentialsSeed.forEach((c) =>
    tx.createOrReplace({ _type: 'credential', ...c })
  );
  departmentsSeed.forEach((d) =>
    tx.createOrReplace({ _type: 'department', ...d })
  );
  for (const m of teamSeed)
    tx.createOrReplace({
      _type: 'teamMember',
      ...m,
      photo: await image(m.photo),
    });

  console.log('Videos');
  for (const v of fileVideos) {
    tx.createOrReplace({
      _id: `video-${v.platform}-${v.id}`,
      _type: 'videoEmbed',
      title: v.title,
      url: v.canonicalUrl,
      poster: await image(v.poster),
      aspect: v.aspect,
      duration: v.duration,
      summary: v.summary,
      publishedOn: v.publishedOn,
      account: v.account,
      placements: v.placements,
      relatedPost: v.relatedPostId
        ? { _type: 'reference', _ref: v.relatedPostId, _weak: true }
        : undefined,
    });
  }

  console.log('Estate and plots');
  for (const e of estatesSeed) {
    const aerial = fileVideos.find((v) => v.key === e.aerialVideoId);
    tx.createOrReplace({
      _id: e._id,
      _type: 'estate',
      name: e.name,
      slug: slug(e.slug),
      state: e.state,
      summary: e.summary,
      body: e.body,
      headlineStats: e.headlineStats,
      headlineStatsConfirmed: e.headlineStatsConfirmed,
      palmVariety: e.palmVariety,
      incomeStartYear: e.incomeStartYear,
      productiveLifeText: e.productiveLifeText,
      documents: e.documents.map((d, i) => ({ ...ref(d._id), _key: `d${i}` })),
      heroImage: await image(e.heroImage),
      gallery: await images(e.gallery),
      aerialVideo: aerial
        ? ref(`video-${aerial.platform}-${aerial.id}`)
        : undefined,
      seo: e.seo,
    });
  }
  for (const p of plotsSeed) {
    tx.createOrReplace({
      _id: p._id,
      _type: 'plot',
      title: p.title,
      slug: slug(p.slug),
      estate: ref(estatesSeed.find((e) => e.slug === p.estateSlug)!._id),
      sizeLabel: p.sizeLabel,
      sizeInAcres: p.sizeInAcres,
      trees: p.trees,
      price: p.price,
      priceMode: p.priceMode,
      status: p.status,
      paymentOptions: p.paymentOptions,
      thumbnail: await image(p.thumbnail),
      gallery: await images(p.gallery),
      whatsappTemplateKey: p.whatsappTemplateKey,
      order: p.order,
    });
  }

  console.log('Invest');
  investOptionsSeed.forEach((o) =>
    tx.createOrReplace({ _type: 'investOption', ...o })
  );
  tx.createOrReplace({
    _id: 'investPage',
    _type: 'investPage',
    ...investPageSeed,
  });

  console.log('FAQ');
  faqSeed.forEach((f) => tx.createOrReplace({ _type: 'faqItem', ...f }));

  console.log('Blog (posts as drafts)');
  categoriesSeed.forEach((c) =>
    tx.createOrReplace({
      _id: c._id,
      _type: 'category',
      title: c.title,
      slug: slug(c.slug),
      description: c.description,
    })
  );
  tx.createOrReplace({
    _id: authorSeed._id,
    _type: 'author',
    name: authorSeed.name,
    slug: slug(authorSeed.slug),
    role: authorSeed.role,
    photo: await image(authorSeed.photo),
  });
  for (const p of postsSeed) {
    tx.createOrReplace({
      _id: `drafts.${p._id}`,
      _type: 'post',
      title: p.title,
      slug: slug(p.slug),
      excerpt: p.excerpt,
      coverImage: await image(p.coverImage),
      category: ref(p.category._id),
      author: ref(p.author._id),
      publishedAt: p.publishedAt,
      recordedOn: p.recordedOn,
      recordedAt: p.recordedAt,
      body: p.body,
      faq: p.faq ? keyed(p.faq, 'q') : undefined,
    });
  }

  const res = await tx.commit();
  console.log(
    `Done: ${res.results.length} documents written, ${uploaded.size} images uploaded. Posts are drafts: publish them in the Studio after the client approves.`
  );
}

await main();
