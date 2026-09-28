/**
 * The trust block (brief 7.4), set as a register entry: labelled lines for
 * office, hours, registration (with the CAC verify link), who leads the
 * company and where to see field updates, beside a real photo of the office
 * sign. No icons: the labels do the work.
 */
import { Photo } from '@/components/photo';

import { getSettings } from '@/lib/content';
import { cn } from '@/lib/utils';

import { images } from '@/data/images';

export async function TrustBlock({
  className,
  heading = 'Who you are dealing with',
}: {
  className?: string;
  heading?: string;
}) {
  const s = await getSettings();
  const instagram = s.socials.find((x) => x.platform === 'instagram');

  const rows: [string, React.ReactNode][] = [
    [
      'Office',
      <>
        {s.address.line1}, {s.address.landmarkDirections}, {s.address.city},{' '}
        {s.address.state}.{' '}
        <a
          href={s.address.mapsUrl}
          target="_blank"
          rel="noopener"
          className="link-under text-oil"
        >
          Get directions
        </a>
      </>,
    ],
    ['Hours', 'Monday to Friday, 9am to 5pm (WAT)'],
    [
      'Registered',
      <>
        {s.legalName}, RC {s.rcNumber}.{' '}
        <a
          href={s.cacVerifyUrl}
          target="_blank"
          rel="noopener"
          className="link-under text-oil"
        >
          Verify on CAC
        </a>
      </>,
    ],
    ['Led by', 'Adetunji Jacob Ogunyemi, Managing Director'],
    ...(instagram
      ? ([
          [
            'Field updates',
            <a
              key="ig"
              href={instagram.url}
              target="_blank"
              rel="noopener"
              className="link-under text-oil"
            >
              See our field updates on Instagram
            </a>,
          ],
        ] as [string, React.ReactNode][])
      : []),
  ];

  return (
    <section
      aria-label={heading}
      className={cn(
        'grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-14',
        className
      )}
    >
      <Photo
        image={images['office-logo-wall']}
        sizes="(min-width: 768px) 288px, 100vw"
        aspect={4 / 5}
        className="overflow-hidden max-md:max-w-xs"
        imgClassName="grayscale-[25%]"
      />
      <div>
        <p className="micro opacity-70">{heading}</p>
        <dl className="mt-6 border-t border-current/15">
          {rows.map(([label, body]) => (
            <div
              key={label}
              className="grid gap-1 border-b border-current/15 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <dt className="micro pt-1 opacity-60">{label}</dt>
              <dd className="text-small">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
