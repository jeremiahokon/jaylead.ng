/** Blog entry: image, category and date in micro caps, title in Boska. */
import Link from 'next/link';

import { Photo } from '@/components/photo';

import type { Post } from '@/lib/types';
import { cn, utils } from '@/lib/utils';

export function PostCard({
  post,
  className,
  headingLevel = 'h3',
  showExcerpt = true,
  aspect = 4 / 5,
}: {
  post: Post;
  className?: string;
  headingLevel?: 'h2' | 'h3';
  showExcerpt?: boolean;
  aspect?: number;
}) {
  const H = headingLevel;

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="overflow-hidden">
        <Photo
          image={post.coverImage}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          aspect={aspect}
          imgClassName="transition-transform duration-[1400ms] ease-(--ease-out-expo) group-hover:scale-[1.05]"
        />
      </div>
      <p className="micro mt-5 flex flex-wrap gap-x-4 opacity-70">
        <span>{post.category.title}</span>
        <time dateTime={post.publishedAt}>
          {utils.format.date(post.publishedAt)}
        </time>
      </p>
      <H className="font-display mt-3 text-2xl leading-tight md:text-3xl">
        <Link
          href={`/blog/${post.slug}`}
          className="after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </H>
      {showExcerpt ? (
        <p className="text-small mt-3 opacity-80">{post.excerpt}</p>
      ) : null}
    </article>
  );
}
