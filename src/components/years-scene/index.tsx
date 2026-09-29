/**
 * The thirty-year chapter (signature scene "years"). Server-rendered as a
 * swipeable scroll-snap rail of panels; the motion runtime pins it and
 * drives it sideways with vertical scroll, swinging each panel in from a 3D
 * angle while the large year readout follows along.
 */
import type { ReactNode } from 'react';

import { Photo } from '@/components/photo';

import type { Img } from '@/lib/types';

import { years } from '@/data/copy';
import { images } from '@/data/images';

const art: (Img | undefined)[] = [
  undefined,
  undefined,
  images['saplings-nursery'],
  images['young-palm'],
  images['palm-fruit-basin'],
  undefined,
  images['palm-grove-jos'],
];

export function YearsScene({ heading }: { heading: ReactNode }) {
  return (
    <div data-pin-spacer>
      <section
        data-scene="years"
        aria-labelledby="years-title"
        className="on-ink bg-ink text-bone grain relative overflow-hidden"
      >
        <div className="flex min-h-svh flex-col justify-between gap-10 py-16 md:py-20">
          <div className="mx-auto flex w-full max-w-[96rem] items-end justify-between gap-8 px-(--gutter)">
            <h2
              id="years-title"
              className="font-display text-display max-w-[14ch]"
            >
              {heading}
            </h2>
            <p
              aria-hidden
              className="font-display tabular text-oil-light hidden text-right leading-none md:block"
            >
              <span className="micro text-sand block">Year</span>
              <span
                data-years-count
                className="block text-[clamp(5rem,12vw,12rem)]"
              >
                0
              </span>
            </p>
          </div>

          <div data-motion-rail className="stage-3d w-full">
            <ol
              data-motion-track
              className="preserve-3d gap-5 px-(--gutter) md:gap-8"
            >
              {years.map((y, i) => (
                <li
                  key={y.title}
                  data-motion-item
                  data-year={y.year}
                  className="w-[80vw] shrink-0 sm:w-[26rem] md:w-[30rem]"
                >
                  <article className="bg-bone/[0.04] flex h-full min-h-[26rem] flex-col border border-current/15 p-7 md:min-h-[30rem] md:p-9">
                    <p className="micro text-sand flex justify-between">
                      <span>Year {y.year}</span>
                      <span className="tabular">
                        {String(i + 1).padStart(2, '0')} /{' '}
                        {String(years.length).padStart(2, '0')}
                      </span>
                    </p>
                    {art[i] ? (
                      <Photo
                        image={art[i]!}
                        sizes="(min-width: 768px) 480px, 80vw"
                        aspect={16 / 10}
                        className="mt-6 overflow-hidden"
                      />
                    ) : (
                      <p
                        aria-hidden
                        className="font-display tabular text-oil-light mt-6 text-[7rem] leading-none md:text-[9rem]"
                      >
                        {y.year}
                      </p>
                    )}
                    <h3 className="font-display mt-auto pt-8 text-4xl md:text-5xl">
                      {y.title}
                    </h3>
                    <p className="text-small text-sand mt-3 max-w-sm">
                      {y.body}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </div>

          <div className="mx-auto w-full max-w-[96rem] px-(--gutter)">
            <div className="h-px w-full bg-current/15">
              <div
                data-years-fill
                className="bg-oil-light h-px w-full origin-left scale-x-0"
              />
            </div>
            <p className="micro text-sand mt-4">
              Scroll to move through the years. Palm oil income is not
              guaranteed: it depends on yields and prices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
