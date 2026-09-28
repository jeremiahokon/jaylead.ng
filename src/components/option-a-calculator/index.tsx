'use client';

import { useState } from 'react';

import { type OptionATerms, utils } from '@/lib/utils';

/**
 * Option A illustrative calculator (brief 10.2). Only rendered when the
 * Invest page's figuresVisible switch is on. Shows the recovery years and
 * the royalty that follows; never a lifetime total.
 */
export function OptionACalculator({
  min,
  max,
  terms,
}: {
  min: number;
  max: number;
  terms: OptionATerms;
}) {
  const [amount, setAmount] = useState(min);
  const s = utils.invest.optionASchedule(amount, terms);
  const first = s.recoveryYears[0]?.year ?? 1;
  const last = s.recoveryYears.at(-1)?.year ?? first;

  const even = s.recoveryYears.every(
    (y) => y.payout === s.recoveryYears[0]?.payout
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <label htmlFor="opt-a-amount" className="micro opacity-70">
          Amount invested
        </label>
        <output
          htmlFor="opt-a-amount"
          className="font-display tabular mt-3 block text-[clamp(2.5rem,5vw,4rem)] leading-none"
        >
          {utils.format.naira(amount)}
        </output>
        <input
          id="opt-a-amount"
          type="range"
          min={min}
          max={max}
          step={500_000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="accent-oil mt-6 w-full"
        />
        <p className="micro mt-2 flex justify-between opacity-60">
          <span>{utils.format.naira(min)}</span>
          <span>{utils.format.naira(max)}</span>
        </p>
      </div>
      <table className="w-full border-collapse text-left">
        <caption className="micro mb-4 text-left opacity-70">
          Illustrative example, not a promise
        </caption>
        <thead>
          <tr className="border-b border-current/25">
            <th scope="col" className="micro py-3 font-medium">
              Years
            </th>
            <th scope="col" className="micro py-3 font-medium">
              Paid each year
            </th>
          </tr>
        </thead>
        <tbody>
          {even ? (
            <tr className="border-b border-current/15">
              <td className="py-4">
                {first} to {last}
              </td>
              <td className="font-display tabular py-4 text-2xl">
                {utils.format.naira(s.recoveryYears[0]?.payout ?? 0)}
              </td>
            </tr>
          ) : (
            s.recoveryYears.map((y) => (
              <tr key={y.year} className="border-b border-current/15">
                <td className="py-3">Year {y.year}</td>
                <td className="font-display tabular py-3 text-xl">
                  {utils.format.naira(y.payout)}
                </td>
              </tr>
            ))
          )}
          {s.royaltyFromYear ? (
            <tr className="border-b border-current/15">
              <td className="py-4">From year {s.royaltyFromYear}</td>
              <td className="py-4">
                <span className="font-display tabular text-2xl">
                  {utils.format.naira(s.royaltyPerYear)}
                </span>
                <span className="text-small block opacity-75">
                  each year for the remaining project life (up to{' '}
                  {terms.projectLifeYears} years)
                </span>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
