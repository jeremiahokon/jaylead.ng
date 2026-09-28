/**
 * The Jaylead wordmark, traced from the designed lockup (brief 12.2: always
 * the logo artwork, never typeset). Temporary until the client supplies the
 * vector files; swap the SVGs in public/brand and nothing else changes.
 */
import { cn } from '@/lib/utils';

export function Logo({
  tone = 'dark',
  className,
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <img
      src={
        tone === 'light'
          ? '/brand/jaylead-logo-light.svg'
          : '/brand/jaylead-logo.svg'
      }
      alt="Jaylead AgriEstate"
      width={166}
      height={50}
      className={cn('h-9 w-auto', className)}
    />
  );
}
