/**
 * Blog post (brief 9.11): editorial layout. Headline and meta, the cover
 * unmasking on scroll, the body at a reading measure, a "Recorded on" line
 * for Farm Updates, the post FAQ (with its own FAQPage JSON-LD), related
 * posts, and the ask.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { Breadcrumb } from '@/components/breadcrumb';
import { CtaBand } from '@/components/cta-band';
import { JsonLd } from '@/components/json-ld';
import { MotionScope } from '@/components/motion';
import { Photo } from '@/components/photo';
import { PostCard } from '@/components/post-card';
import { RichText } from '@/components/rich-text';
import { SplitWords } from '@/components/split-words';
import { VideoCard } from '@/components/video-card';
import { WhatsAppLink } from '@/components/whatsapp-cta';

import { getPost, getPosts, getVideos } from '@/lib/content';
import { postNode } from '@/lib/jsonld';
import { utils } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);

  if (!p) return {};
  const title = p.seo?.title ?? `${p.title} | Jaylead AgriEstate`;
  const description = p.seo?.description ?? p.excerpt;
  const image = p.coverImage.src;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${p.slug}` },
    // Per-post share card from the cover (brief 13.3); the site card covers everything else.
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${p.slug}`,
      publishedTime: p.publishedAt,
      images: [{ url: image, alt: p.coverImage.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const [post, posts, videos] = await Promise.all([
    getPost(slug),
    getPosts(),
    getVideos(),
  ]);

  if (!post) notFound();

  const related = posts
    .filter(
      (p) => p.slug !== post.slug && p.category.slug === post.category.slug
    )
    .slice(0, 3);

  const more = related.length
    ? related
    : posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const crumbs = [
    { name: 'Blog', path: '/blog' },
    { name: post.category.title, path: `/blog/category/${post.category.slug}` },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const faqGraph = post.faq?.length
    ? [
        {
          '@type': 'FAQPage',
          mainEntity: post.faq.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
      ]
    : [];

  const renderVideo = (url: string) => {
    const parsed = utils.embed.parse(url);

    const v =
      parsed && videos.find((x) => x.key === `${parsed.platform}:${parsed.id}`);

    return v ? (
      <VideoCard video={v} sizes="(min-width: 768px) 384px, 100vw" />
    ) : null;
  };

  return (
    <MotionScope>
      <JsonLd
        path={`/blog/${post.slug}`}
        title={post.title}
        description={post.excerpt}
        crumbs={crumbs}
        extra={[postNode(post), ...faqGraph]}
      />
      <article>
        <header className="mx-auto max-w-[96rem] px-(--gutter) pt-10 md:pt-14">
          <Breadcrumb crumbs={crumbs.slice(0, 2)} />
          <p
            className="micro load-fade mt-16 flex flex-wrap gap-x-5 gap-y-2 opacity-75 md:mt-24"
            style={{ '--i': 0 } as React.CSSProperties}
          >
            <span>{post.category.title}</span>
            <time dateTime={post.publishedAt}>
              {utils.format.date(post.publishedAt)}
            </time>
            <span>{post.readTime} min read</span>
          </p>
          <h1 className="font-display text-display mt-6 max-w-[20ch]">
            <SplitWords parts={[{ text: post.title }]} />
          </h1>
          <p
            className="text-lede measure load-fade mt-8 opacity-85"
            style={{ '--i': 2 } as React.CSSProperties}
          >
            {post.excerpt}
          </p>
          <p
            className="micro load-fade mt-8 opacity-70"
            style={{ '--i': 3 } as React.CSSProperties}
          >
            By {post.author.name}, {post.author.role}
          </p>
        </header>

        <div className="mx-auto mt-14 max-w-[80rem] px-(--gutter) md:mt-20">
          <div className="overflow-hidden">
            <div data-motion="unmask">
              <Photo
                image={post.coverImage}
                sizes="(min-width: 1280px) 1200px, 100vw"
                aspect={16 / 9}
                priority
              />
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[80rem] gap-12 px-(--gutter) py-20 md:grid-cols-[12rem_1fr] md:py-28">
          <aside className="micro grid content-start gap-4 opacity-70">
            {post.recordedOn ? (
              <p>Recorded on {utils.format.date(post.recordedOn)}</p>
            ) : null}
            {post.recordedAt ? <p>{post.recordedAt}</p> : null}
          </aside>
          <div>
            <RichText value={post.body} renderVideo={renderVideo} />
            {post.faq?.length ? (
              <section className="mt-16 max-w-[66ch] border-t border-current/20 pt-10">
                <h2 className="font-display text-title">Questions</h2>
                <dl className="mt-6 grid gap-6">
                  {post.faq.map((f) => (
                    <div key={f.question}>
                      <dt className="font-display text-2xl">{f.question}</dt>
                      <dd className="mt-2 opacity-85">{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>
        </div>
      </article>

      {more.length ? (
        <section className="bg-bone-deep">
          <div className="mx-auto max-w-[96rem] px-(--gutter) py-24 md:py-32">
            <p className="micro opacity-70">Read next</p>
            <div
              data-motion="tilt"
              className="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {more.map((p) => (
                <PostCard key={p._id} post={p} showExcerpt={false} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        title={
          <>
            Ready to own <span className="em-oil">a plot?</span>
          </>
        }
      >
        <Link href="/marketplace" className="pill">
          Explore the marketplace
        </Link>
        <WhatsAppLink
          template="post"
          vars={{ title: post.title }}
          variant="ghost"
        >
          Ask about this post
        </WhatsAppLink>
      </CtaBand>
    </MotionScope>
  );
}
