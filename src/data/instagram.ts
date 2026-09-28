/**
 * The developer's video list. To add a video without touching the Studio:
 *
 *   1. On Instagram, open the post, tap ⋯ > Embed > Copy embed code (or just
 *      copy the link). TikTok and YouTube links work too.
 *   2. Paste it as a new string in `pasted` below.
 *   3. Optional: add a `cards` entry under the same id (the shortcode, or the
 *      TikTok/YouTube id) for a title, poster, summary and placements.
 *   4. Commit. The video appears on the site as a tap-to-play card.
 *
 * Nothing loads from Instagram, TikTok or YouTube until a visitor taps. Posts
 * pasted here are merged with the `videoEmbed` documents in Sanity; when both
 * define the same post, the Sanity one wins. A paste that isn't a valid post
 * link fails the build loudly instead of shipping a broken card.
 */
import type { Video, VideoPlacement } from '@/lib/types';
import { utils } from '@/lib/utils';

import { images } from '@/data/images';

const pasted: string[] = [
  `https://www.instagram.com/reel/DZMkHQTKNWE/`,
  `https://www.instagram.com/reel/DdZEAqaKey0/`,
  `https://www.instagram.com/reel/DdJx-XQqgvp/`,
  `https://www.instagram.com/reel/DdUCrOCqirW/`,
  `https://www.instagram.com/reel/DdEvWuJq-mb/`,
  `https://www.instagram.com/reel/DdjhG1VqZAd/`,
  `https://www.instagram.com/reel/DdnfS6dNvtI/`,
  `https://www.instagram.com/reel/DdrPFNtqg-3/`,
  `https://www.instagram.com/reel/DdtyFloqy-0/`,
  `https://www.instagram.com/reel/DdD4lwIummX/`,
  `https://www.tiktok.com/@jaylead_ng/video/7684617902401588500`,
  `https://www.tiktok.com/@jaylead_ng/video/7684995951454342421`,
  ``, // spare slot: paste the next one here
];

type Card = Omit<
  Video,
  | 'key'
  | 'platform'
  | 'id'
  | 'canonicalUrl'
  | 'embedUrl'
  | 'source'
  | 'featured'
  | 'placements'
  | 'account'
  | 'aspect'
> &
  Partial<Pick<Video, 'featured' | 'account' | 'aspect'>> & {
    placements?: VideoPlacement[];
  };

const cards: Record<string, Card> = {
  DZMkHQTKNWE: {
    title: 'Our story, told by the founder',
    poster: images['founder-portrait-agbada'],
    duration: '2:53',
    summary:
      'Adetunji Jacob Ogunyemi explains how Jaylead began: growing up around farming, working as a software engineer, being laid off as AI changed his industry, and planning a personal palm farm that grew into a managed agri-estate where owners earn from their land’s palm oil.',
    publishedOn: '2026-06-05',
    placements: ['founder-story'],
    featured: true,
  },
  DdZEAqaKey0: {
    title: 'Aerial view of Jaylead farmland',
    poster: images['poster-DdZEAqaKey0'],
    duration: '0:26',
    summary:
      'A silent drone flight over open farmland, crop plots and a perimeter fence.',
    publishedOn: '2026-09-17',
    placements: ['home-hero-aerial', 'estate', 'proof-strip'],
    aspect: '16:9',
    featured: true,
  },
  'DdJx-XQqgvp': {
    title: 'Soil testing before planting',
    poster: images['poster-DdJx-XQqgvp'],
    duration: '0:04',
    summary: 'A short clip about testing the soil before cultivation starts.',
    publishedOn: '2026-09-11',
    placements: ['proof-strip'],
    aspect: '4:5',
  },
  DdUCrOCqirW: {
    title: 'The Jaylead office launch',
    poster: images['poster-DdUCrOCqirW'],
    duration: '1:54',
    summary:
      'Highlights from the official opening of the Jaylead office in Tanke, Ilorin, with prayers, guests and the team.',
    publishedOn: '2026-09-15',
    placements: ['about-office'],
    featured: true,
  },
  'DdEvWuJq-mb': {
    title: 'Something happened at Jaylead',
    poster: images['poster-DdEvWuJq-mb'],
    duration: '0:09',
    summary: 'A teaser from the new office before the launch.',
    publishedOn: '2026-09-09',
  },
  DdjhG1VqZAd: {
    title: 'Wealth that lasts',
    poster: images['poster-DdjhG1VqZAd'],
    duration: '0:34',
    summary:
      'The Managing Director on matching goals to assets: land banking for long-term wealth, income assets for financial freedom, and perennial crops like oil palm for wealth that can outlive you.',
    publishedOn: '2026-09-21',
  },
  DdnfS6dNvtI: {
    title: 'Behind every 2 + 2 that makes 22',
    poster: images['poster-DdnfS6dNvtI'],
    duration: '0:20',
    summary: 'The Managing Director at work in the Tanke office.',
    publishedOn: '2026-09-23',
  },
  'DdrPFNtqg-3': {
    title: 'This or That: the AgriEstate edition',
    poster: images['poster-DdrPFNtqg-3'],
    duration: '1:18',
    summary:
      'Quick-fire questions: betting on the market or on the land, money in the bank or land that grows in value, and income that depends on your job or income that does not.',
    publishedOn: '2026-09-24',
  },
  'DdtyFloqy-0': {
    title: 'What a managed plantation gives you',
    poster: images['poster-DdtyFloqy-0'],
    duration: '0:37',
    summary:
      'Six assets and what each one does, ending with perennial crops like oil palm: income for decades and an asset you can pass on. Jaylead does the farming for you.',
    publishedOn: '2026-09-25',
    placements: ['how-it-works'],
  },
  DdD4lwIummX: {
    title: 'On site: getting the land ready',
    poster: images['poster-DdD4lwIummX'],
    duration: '0:15',
    summary: 'The Managing Director on farmland being prepared for planting.',
    publishedOn: '2026-09-09',
    placements: ['proof-strip'],
    account: 'founder',
    aspect: '4:5',
  },
  '7684617902401588500': {
    title: 'The office: before and after',
    poster: images['poster-7684617902401588500'],
    duration: '0:28',
    summary: 'The Tanke office from bare room to finished workspace.',
    publishedOn: '2026-09-12',
    placements: ['about-office'],
  },
  '7684995951454342421': {
    title: 'From prayer to keys: opening day',
    poster: images['poster-7684995951454342421'],
    duration: '0:42',
    summary: 'Opening day at the Jaylead office, set to music.',
    publishedOn: '2026-09-13',
    placements: ['about-office'],
  },
};

function build(): Video[] {
  const seen = new Set<string>();
  const out: Video[] = [];

  for (const raw of pasted) {
    if (!raw.trim()) continue;
    const parsed = utils.embed.parse(raw);

    if (!parsed)
      throw new Error(
        `src/data/instagram.ts: not a video link or embed code: ${raw.slice(0, 80)}`
      );
    const key = `${parsed.platform}:${parsed.id}`;

    if (seen.has(key)) continue;
    seen.add(key);
    const card = cards[parsed.id];

    if (!card && process.env.NODE_ENV !== 'production') {
      console.warn(
        `[instagram.ts] ${parsed.id} has no card entry; it shows with the branded fallback.`
      );
    }

    out.push({
      key,
      platform: parsed.platform,
      id: parsed.id,
      canonicalUrl: parsed.canonicalUrl,
      embedUrl: parsed.embedUrl,
      title: card?.title ?? 'Watch on Instagram',
      poster: card?.poster,
      aspect: card?.aspect ?? '9:16',
      duration: card?.duration,
      summary: card?.summary,
      publishedOn: card?.publishedOn,
      account: card?.account ?? 'brand',
      featured: card?.featured ?? false,
      placements: card?.placements ?? [],
      source: 'file',
    });
  }

  return out;
}

export const fileVideos: Video[] = build();
