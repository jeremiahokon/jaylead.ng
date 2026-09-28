/**
 * A slow typographic marquee that leans with scroll speed (velocity effect).
 * Two identical sets, the second hidden from assistive tech; pauses on hover
 * and focus, and stops under reduced motion (WCAG 2.2.2).
 */
export function Marquee({ items }: { items: string[] }) {
  const set = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((t) => (
        <li
          key={t}
          className="font-display flex items-center text-[clamp(2.5rem,7vw,6.5rem)] leading-none whitespace-nowrap"
        >
          <span className="px-6 md:px-10">{t}</span>
          <span
            aria-hidden
            className="bg-oil inline-block size-2.5 rounded-full md:size-3.5"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y border-current/15 py-6 md:py-8">
      <div data-motion="velocity">
        <div className="marquee">
          {set(false)}
          {set(true)}
        </div>
      </div>
    </div>
  );
}
