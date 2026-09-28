/** Blog category listing (brief 9.11), one static page per category. */
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { BlogIndex } from '@/components/blog-index';
import { JsonLd } from '@/components/json-ld';
import { MotionScope } from '@/components/motion';
import { PageHero } from '@/components/page-hero';

import { getCategories, getPosts } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = (await getCategories()).find((x) => x.slug === slug);

  if (!c) return {};
  const title = `${c.title}: Jaylead AgriEstate Blog`;

  return {
    title,
    description: c.description,
    alternates: { canonical: `/blog/category/${c.slug}` },
    openGraph: {
      title,
      description: c.description,
      url: `/blog/category/${c.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const crumbs = [
    { name: 'Blog', path: '/blog' },
    { name: category.title, path: `/blog/category/${slug}` },
  ];

  return (
    <MotionScope>
      <JsonLd
        path={`/blog/category/${slug}`}
        title={category.title}
        description={category.description}
        crumbs={crumbs}
        type="CollectionPage"
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="The journal"
        title={[{ text: category.title, className: 'em-oil' }]}
        lede={category.description}
      />
      <BlogIndex
        posts={posts.filter((p) => p.category.slug === slug)}
        categories={categories}
        active={slug}
        path={`/blog/category/${slug}`}
      />
    </MotionScope>
  );
}
