/**
 * One video as a poster card with a typographic play mark, title and
 * platform line, enhanced by the VideoPlayer island (tap to load, D19). The
 * summary sits under it as the text alternative.
 */
import { Photo } from '@/components/photo';
import { PlayMark } from '@/components/play-mark';

import type { Video } from '@/lib/types';
import { utils } from '@/lib/utils';

import { VideoPlayer } from './player';

type Props = {
  video: Video;
  sizes: string;
  aspect?: number;
  showSummary?: boolean;
  className?: string;
  meta?: string;
};

export function VideoCard({
  video,
  sizes,
  aspect = 4 / 5,
  showSummary = true,
  className,
  meta,
}: Props) {
  const label = utils.embed.platformLabel[video.platform];

  return (
    <div className={className}>
      <VideoPlayer
        label={video.title}
        platformLabel={label}
        platform={video.platform}
        permalink={video.canonicalUrl}
        embedUrl={video.embedUrl}
        className="group relative block overflow-hidden"
      >
        {video.poster ? (
          <Photo
            image={video.poster}
            sizes={sizes}
            aspect={aspect}
            imgClassName="transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className="bg-ink text-bone grid place-items-center p-8"
            style={{ aspectRatio: String(aspect) }}
          >
            <span className="font-display text-center text-3xl">
              {video.title}
            </span>
          </div>
        )}
        <span
          aria-hidden
          className="from-ink/80 via-ink/15 to-ink/25 absolute inset-0 bg-gradient-to-t"
        />
        <PlayMark />
        <span className="text-bone absolute inset-x-0 bottom-0 p-5">
          <span className="font-display block text-2xl leading-tight">
            {video.title}
          </span>
          <span className="micro mt-2 block opacity-80">
            {label}
            {video.duration ? (
              <span className="tabular"> · {video.duration}</span>
            ) : null}
          </span>
        </span>
      </VideoPlayer>
      {meta ? <p className="micro mt-4 opacity-70">{meta}</p> : null}
      {showSummary && video.summary ? (
        <p className="text-small mt-3 opacity-80">{video.summary}</p>
      ) : null}
    </div>
  );
}
