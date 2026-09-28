/**
 * The label on the aerial photo: a bone pill with a drawn play triangle, the
 * words and the running time. One line at every width, so it never spills
 * out of a circle on a phone.
 */
import { cn } from '@/lib/utils';

export const AERIAL_DURATION = '0:14';

export function WatchPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'bg-bone text-ink inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full px-6 text-[0.9375rem] font-bold whitespace-nowrap shadow-lg transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-105',
        className
      )}
    >
      <span
        aria-hidden
        className="border-l-ink h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent"
      />
      Watch the aerial
      <span className="tabular font-normal opacity-60">{AERIAL_DURATION}</span>
    </span>
  );
}
