/**
 * Land vs shares as a real two-column table (brief 9.1 section 9): row and
 * column headers, readable as a screenshot on WhatsApp. Never claims one
 * beats the other.
 */
import { landVsShares } from '@/data/copy';

export function LandVsShares() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[42rem] border-collapse text-left">
        <caption className="sr-only">
          Owning a Palm Grove plot compared with owning shares
        </caption>
        <thead>
          <tr className="border-b border-current/25">
            <td className="w-[22%] py-5" />
            {landVsShares.columns.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`font-display py-5 pr-6 text-2xl font-normal md:text-3xl ${i === 0 ? '' : 'opacity-60'}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {landVsShares.rows.map(([label, land, shares]) => (
            <tr key={label} className="border-b border-current/15">
              <th
                scope="row"
                className="micro py-6 pr-6 align-top font-medium opacity-70"
              >
                {label}
              </th>
              <td className="py-6 pr-6 align-top">{land}</td>
              <td className="py-6 pr-6 align-top opacity-60">{shares}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
