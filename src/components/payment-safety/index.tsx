/**
 * The payment-safety line (brief 7.5), set quietly under a hairline wherever
 * a price, payment or investment is mentioned. Adds the account name only
 * when both name and bank are set; never an account number.
 */
import { getSettings } from '@/lib/content';
import { cn } from '@/lib/utils';

export async function PaymentSafety({ className }: { className?: string }) {
  const { paymentSafety } = await getSettings();

  const account =
    paymentSafety.accountName && paymentSafety.bankName
      ? ` Our account name is ${paymentSafety.accountName} (${paymentSafety.bankName}).`
      : '';

  return (
    <p
      className={cn(
        'text-small max-w-3xl border-t border-current/15 pt-4 opacity-85',
        className
      )}
    >
      <span className="micro mr-3 opacity-100">Pay safely</span>
      {paymentSafety.safetyText}
      {account}
    </p>
  );
}
