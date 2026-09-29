/**
 * The compact trust line set directly under a selling page's first CTA
 * (brief 7.4): registration with a CAC verify link, the office with its
 * landmark, the hours and the MD, in one quiet micro-caps row. The full
 * register entry (TrustBlock) follows further down the page.
 */
import { getSettings, getShownCredentials } from '@/lib/content';
import { cn, utils } from '@/lib/utils';

export async function TrustLine({ className }: { className?: string }) {
  const [s, creds] = await Promise.all([getSettings(), getShownCredentials()]);

  return (
    <ul
      className={cn(
        'micro flex flex-wrap gap-x-6 gap-y-2 opacity-75',
        className
      )}
    >
      {creds.map((c) => (
        <li key={c._id}>
          {c.name.startsWith('CAC')
            ? `${c.shortName}, ${c.value}`
            : c.shortName}
        </li>
      ))}
      <li>
        Office: {s.address.landmarkDirections}, {s.address.city}
      </li>
      <li>{utils.format.hours(s.officeHours, { short: true })}</li>
      <li>MD: Adetunji Jacob Ogunyemi</li>
      <li>
        <a
          href={s.cacVerifyUrl}
          target="_blank"
          rel="noopener"
          className="link-under"
        >
          Verify on CAC
        </a>
      </li>
    </ul>
  );
}
