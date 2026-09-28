/** Blog index (brief 9.11). */
import type { Metadata } from 'next';

import { BlogIndex } from '@/components/blog-index';
import { JsonLd } from '@/components/json-ld';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';

import { getCategories, getPosts } from '@/lib/content';

const title = 'Farm Updates and Insights: Jaylead AgriEstate Blog';

const description =
  'Field updates, palm oil insights and investment education from Jaylead AgriEstate.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog' },
  openGraph: { title, description, url: '/blog' },
};

export default async function Blog() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const crumbs = [{ name: 'Blog', path: '/blog' }];

  return (
    <MotionScope>
      <JsonLd
        path="/blog"
        title={title}
        description={description}
        crumbs={crumbs}
        type="Blog"
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="The journal"
        title={[{ text: 'From' }, { text: 'the farm.', className: 'em-oil' }]}
        lede="Field updates, palm oil insights and plain explanations of land and long-term investing."
      />
      <BlogIndex posts={posts} categories={categories} path="/blog" />
    </MotionScope>
  );
}
