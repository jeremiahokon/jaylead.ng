/**
 * The blog listing shared by /blog and /blog/category/[slug]: category links
 * (plain links, no JavaScript), a featured first post set large, then the
 * grid, and the "farm updates on WhatsApp" sign-up (D17).
 */
import Link from 'next/link';

import { LeadForm } from '@/components/lead-form';
import { Photo } from '@/components/photo';
import { PostCard } from '@/components/post-card';
import { SectionHead } from '@/components/section-head';

import { getSettings } from '@/lib/content';
import type { Category, Post } from '@/lib/types';
import { cn, utils } from '@/lib/utils';

export async function BlogIndex({
  posts,
  categories,
  active,
  path,
}: {
  posts: Post[];
  categories: Category[];
  active?: string;
  path: string;
}) {
  const settings = await getSettings();
  const [first, ...rest] = posts;

  return (
    <>
      <nav
        aria-label="Categories"
        className="mx-auto max-w-[96rem] px-(--gutter)"
      >
        <ul className="flex flex-wrap gap-3 border-y border-current/15 py-5">
          <li>
            <Link
              href="/blog"
              className={cn(
                'micro rounded-full px-4 py-2.5',
                !active ? 'bg-ink text-bone' : 'hover:bg-bone-deep'
              )}
            >
              All
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c._id}>
              <Link
                href={`/blog/category/${c.slug}`}
                className={cn(
                  'micro rounded-full px-4 py-2.5',
                  active === c.slug ? 'bg-ink text-bone' : 'hover:bg-bone-deep'
                )}
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {first ? (
        <section className="mx-auto max-w-[96rem] px-(--gutter) py-20 md:py-28">
          <article className="group relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
            <div className="overflow-hidden">
              <Photo
                image={first.coverImage}
                sizes="(min-width: 768px) 55vw, 100vw"
                aspect={4 / 3}
                priority
                imgClassName="transition-transform duration-[1400ms] ease-(--ease-out-expo) group-hover:scale-[1.04]"
              />
            </div>
            <div>
              <p className="micro flex flex-wrap gap-x-4 opacity-70">
                <span>{first.category.title}</span>
                <time dateTime={first.publishedAt}>
                  {utils.format.date(first.publishedAt)}
                </time>
                <span>{first.readTime} min read</span>
              </p>
              <h2 className="font-display text-display mt-5">
                <Link
                  href={`/blog/${first.slug}`}
                  className="after:absolute after:inset-0"
                >
                  {first.title}
                </Link>
              </h2>
              <p className="text-lede mt-6 opacity-85">{first.excerpt}</p>
            </div>
          </article>
        </section>
      ) : (
        <section className="mx-auto max-w-[96rem] px-(--gutter) py-24">
          <p className="font-display text-title max-w-2xl">
            No posts here yet. Our newest field updates go up on Instagram
            first.
          </p>
          {settings.socials.find((s) => s.platform === 'instagram') ? (
            <a
              href={
                settings.socials.find((s) => s.platform === 'instagram')!.url
              }
              target="_blank"
              rel="noopener"
              className="pill mt-8"
            >
              See @jaylead_ng on Instagram
            </a>
          ) : null}
        </section>
      )}

      {rest.length ? (
        <section className="mx-auto max-w-[96rem] px-(--gutter) pb-28">
          <div
            data-motion="tilt"
            className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
          >
            {rest.map((p) => (
              <PostCard key={p._id} post={p} headingLevel="h2" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-bone-deep">
        <div className="mx-auto grid max-w-[96rem] gap-12 px-(--gutter) py-24 md:grid-cols-2 md:py-32">
          <SectionHead
            eyebrow="Farm updates"
            title={
              <>
                Get farm updates <span className="em-oil">on WhatsApp.</span>
              </>
            }
            lede="Dated notes from the land, a few times a month. Nothing else."
          />
          <div className="self-end">
            {settings.whatsappChannelUrl ? (
              <a
                href={settings.whatsappChannelUrl}
                target="_blank"
                rel="noopener"
                className="pill"
              >
                Follow our WhatsApp Channel
              </a>
            ) : null}
            <p className="micro mt-10 mb-4 opacity-70">
              Or by email (optional)
            </p>
            <LeadForm
              type="newsletter"
              submitLabel="Sign me up"
              sourcePage={path}
            />
          </div>
        </div>
      </section>
    </>
  );
}
