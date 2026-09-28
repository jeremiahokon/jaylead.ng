/**
 * The play button on every video thumbnail: a solid harvest-gold disc with
 * a green play triangle, centred, with a soft ring and shadow so it reads on
 * any photo, bright field or dark office. The deep green on gold is 8.5:1.
 * Decorative: the surrounding link carries the accessible name.
 */
import { cn } from '@/lib/utils';

export function PlayMark({
  size = 'md',
  className,
}: {
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'bg-sun ring-bone/40 absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[0_10px_40px_-6px_rgb(13_57_36/0.7)] ring-8 transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-110',
        size === 'lg' ? 'size-24' : 'size-18',
        className
      )}
    >
      <span
        className={cn(
          'border-l-ink ml-1.5 h-0 w-0 border-y-transparent',
          size === 'lg'
            ? 'border-y-[13px] border-l-[22px]'
            : 'border-y-[11px] border-l-[18px]'
        )}
      />
    </span>
  );
}
