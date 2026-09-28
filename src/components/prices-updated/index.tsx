/** "Prices updated September 2026. Confirm the current price on WhatsApp before paying." */
import { getSettings } from '@/lib/content';
import { cn, utils } from '@/lib/utils';

export async function PricesUpdated({ className }: { className?: string }) {
  const { pricesUpdated } = await getSettings();

  return (
    <p className={cn('text-small opacity-75', className)}>
      Prices updated {utils.format.monthYear(pricesUpdated)}. Confirm the
      current price on WhatsApp before paying.
    </p>
  );
}
