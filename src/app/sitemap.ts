/**
 * Every public page, post, category and plot, on the one canonical
 * origin. lastModified comes from Sanity's _updatedAt where known.
 */
import type { MetadataRoute } from 'next';

import { getCategories, getPlots, getPosts } from '@/lib/content';
import { absolute } from '@/lib/site';

const fixed = [
  ['/', 1],
  ['/marketplace', 0.9],
  ['/invest', 0.8],
  ['/why-us', 0.8],
  ['/about', 0.7],
  ['/contact', 0.7],
  ['/blog', 0.7],
  ['/become-a-realtor', 0.6],
  ['/nysc', 0.5],
  ['/legal/privacy-policy', 0.2],
  ['/legal/terms', 0.2],
  ['/legal/risk-disclosure', 0.3],
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, plots] = await Promise.all([
    getPosts(),
    getCategories(),
    getPlots(),
  ]);

  return [
    ...fixed.map(([path, priority]) => ({ url: absolute(path), priority })),
    ...plots.map((p) => ({
      url: absolute(`/marketplace/${p.slug}`),
      lastModified: p.updatedAt,
      priority: 0.8,
    })),
    ...categories.map((c) => ({
      url: absolute(`/blog/category/${c.slug}`),
      priority: 0.4,
    })),
    ...posts.map((p) => ({
      url: absolute(`/blog/${p.slug}`),
      lastModified: p.updatedAt ?? p.publishedAt,
      priority: 0.6,
    })),
  ];
}
