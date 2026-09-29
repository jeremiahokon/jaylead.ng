/**
 * The only door pages use to reach content. Each accessor reads Sanity when
 * it is configured (see docs/sanity/env-setup.md) and the typed seed in
 * src/data/seed otherwise, so the site is complete before the CMS is
 * connected and switching over changes no page code. Reads are cached and
 * tagged by type in src/sanity/fetch.ts; the webhook expires them.
 *
 * A Sanity error never takes a page down: the accessor logs it and falls
 * back to the seed for that one read. The same goes for a type with nothing
 * published yet, so connecting an empty dataset changes nothing on the site.
 */
import type {
  Category,
  Credential,
  Department,
  DocumentType,
  Estate,
  FaqItem,
  InvestOption,
  InvestPage,
  Plot,
  Post,
  SiteSettings,
  Stat,
  TeamMember,
  Video,
  VideoPlacement,
} from '@/lib/types';
import { utils } from '@/lib/utils';

import { fileVideos } from '@/data/instagram';
import {
  credentialsSeed,
  departmentsSeed,
  documentsSeed,
  estatesSeed,
  investOptionsSeed,
  investPageSeed,
  plotsSeed,
  statsSeed,
  teamSeed,
} from '@/data/seed/catalogue';
import { faqGroups, faqSeed } from '@/data/seed/faq';
import { categoriesSeed, postsSeed } from '@/data/seed/posts';
import { settingsSeed } from '@/data/seed/settings';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/fetch';
import * as q from '@/sanity/queries';

import 'server-only';

async function read<T>(
  query: string,
  tags: string[],
  seed: T,
  params: Record<string, unknown> = {}
): Promise<T> {
  if (!isSanityConfigured) return seed;

  try {
    const data = await sanityFetch<T | null>(query, params, tags);

    // Nothing published yet (a fresh dataset, or blog posts still in draft):
    // keep the seed so no section renders empty and every dynamic route
    // still has params to prerender. The first published document wins.
    if (data == null || (Array.isArray(data) && data.length === 0)) return seed;

    return data;
  } catch (error) {
    console.error(
      `[content] Sanity read failed for ${tags.join(',')}, using seed.`,
      error
    );

    return seed;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const live = await read<Partial<SiteSettings>>(
    q.settingsQuery,
    ['siteSettings'],
    settingsSeed
  );

  return {
    ...settingsSeed,
    ...Object.fromEntries(
      Object.entries(live).filter(([, v]) => v !== null && v !== undefined)
    ),
    address: { ...settingsSeed.address, ...live.address },
    paymentSafety: { ...settingsSeed.paymentSafety, ...live.paymentSafety },
    whatsappTemplates: live.whatsappTemplates?.length
      ? live.whatsappTemplates
      : settingsSeed.whatsappTemplates,
  } as SiteSettings;
}

type EstateRow = Estate & { brochureBytes?: number; aerialVideoKey?: string };

const sizeLabel = (bytes?: number) =>
  bytes
    ? bytes > 1_000_000
      ? `${(bytes / 1_048_576).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`
    : undefined;

export async function getEstates(): Promise<Estate[]> {
  const rows = await read<EstateRow[]>(
    q.estatesQuery,
    ['estate', 'documentType', 'videoEmbed'],
    estatesSeed
  );

  return rows.map(({ brochureBytes, aerialVideoKey, ...e }) => {
    const parsed = utils.embed.parse(aerialVideoKey);

    return {
      ...e,
      brochureSizeLabel: e.brochureSizeLabel ?? sizeLabel(brochureBytes),
      aerialVideoId: parsed
        ? `${parsed.platform}:${parsed.id}`
        : e.aerialVideoId,
    };
  });
}

export async function getEstate(slug: string): Promise<Estate | undefined> {
  return (await getEstates()).find((e) => e.slug === slug);
}

/**
 * The estate Home, Marketplace and Why us are about. Palm Grove by slug,
 * else the first visible estate, so a slug edit in the Studio can't blank
 * three pages.
 */
export async function getMainEstate(): Promise<Estate | undefined> {
  const estates = await getEstates();

  return estates.find((e) => e.slug === 'palm-grove') ?? estates[0];
}

/** The estate's chosen title documents, or every document when none is set. */
export async function getEstateDocuments(
  estate: Estate | undefined
): Promise<DocumentType[]> {
  return estate?.documents.length ? estate.documents : getDocuments();
}

export async function getPlots(): Promise<Plot[]> {
  return read(q.plotsQuery, ['plot', 'estate'], plotsSeed);
}

export async function getPlot(slug: string): Promise<Plot | undefined> {
  return (await getPlots()).find((p) => p.slug === slug);
}

export const getInvestOptions = (): Promise<InvestOption[]> =>
  read(q.investOptionsQuery, ['investOption'], investOptionsSeed);

export const getInvestPage = (): Promise<InvestPage> =>
  read(q.investPageQuery, ['investPage'], investPageSeed);

export const getCredentials = (): Promise<Credential[]> =>
  read(q.credentialsQuery, ['credential'], credentialsSeed);

export async function getShownCredentials(): Promise<Credential[]> {
  return (await getCredentials()).filter((c) => c.status === 'shown');
}

export async function isCredentialShown(
  id: 'cred-naic' | 'cred-nysc'
): Promise<boolean> {
  const all = await getCredentials();
  const needle = id === 'cred-nysc' ? /nysc/i : /naic/i;

  return all.some(
    (c) => (c._id === id || needle.test(c.name)) && c.status === 'shown'
  );
}

export const getDocuments = (): Promise<DocumentType[]> =>
  read(q.documentsQuery, ['documentType'], documentsSeed);

/** Only stats with a source URL ever reach a page (brief rule 10). */
export async function getStats(): Promise<Stat[]> {
  return (await read(q.statsQuery, ['stat'], statsSeed)).filter(
    (s) => s.sourceUrl
  );
}

export const getDepartments = (): Promise<Department[]> =>
  read(q.departmentsQuery, ['department'], departmentsSeed);

export const getTeam = (): Promise<TeamMember[]> =>
  read(q.teamQuery, ['teamMember'], teamSeed);

export const getFaqs = (): Promise<FaqItem[]> =>
  read(q.faqQuery, ['faqItem'], faqSeed);

export async function getFaqGroups(): Promise<
  { group: FaqItem['group']; items: FaqItem[] }[]
> {
  const faqs = await getFaqs();

  return faqGroups
    .map((group) => ({ group, items: faqs.filter((f) => f.group === group) }))
    .filter((g) => g.items.length);
}

export const getCategories = (): Promise<Category[]> =>
  read(q.categoriesQuery, ['category'], categoriesSeed);

export async function getPosts(): Promise<Post[]> {
  const posts = await read<Post[]>(
    q.postsQuery,
    ['post', 'category', 'author', 'videoEmbed'],
    postsSeed
  );

  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

type VideoRow = Omit<
  Video,
  'key' | 'platform' | 'id' | 'canonicalUrl' | 'embedUrl' | 'source'
> & { _id: string; url: string };

/**
 * Videos from both sources: src/data/instagram.ts and Sanity videoEmbed
 * documents. Same post in both: the Sanity version wins, keeping the file's
 * poster if the Studio one has none.
 */
export async function getVideos(): Promise<Video[]> {
  const rows = isSanityConfigured
    ? await read<VideoRow[]>(q.videosQuery, ['videoEmbed'], [])
    : [];

  const byKey = new Map(fileVideos.map((v) => [v.key, v]));

  for (const row of rows) {
    const parsed = utils.embed.parse(row.url);

    if (!parsed) continue;
    const key = `${parsed.platform}:${parsed.id}`;
    const fromFile = byKey.get(key);

    byKey.set(key, {
      ...fromFile,
      ...row,
      key,
      platform: parsed.platform,
      id: parsed.id,
      canonicalUrl: parsed.canonicalUrl,
      embedUrl: parsed.embedUrl,
      poster: row.poster?.src ? row.poster : fromFile?.poster,
      relatedPostId: row.relatedPostId ?? fromFile?.relatedPostId,
      aspect: row.aspect ?? fromFile?.aspect ?? '9:16',
      account: row.account ?? 'brand',
      source: 'sanity',
    });
  }

  return [...byKey.values()].sort((a, b) =>
    (b.publishedOn ?? '').localeCompare(a.publishedOn ?? '')
  );
}

export async function getVideosFor(
  placement: VideoPlacement
): Promise<Video[]> {
  return (await getVideos()).filter((v) => v.placements.includes(placement));
}

export async function getVideo(
  key: string | undefined
): Promise<Video | undefined> {
  if (!key) return undefined;

  return (await getVideos()).find((v) => v.key === key);
}
