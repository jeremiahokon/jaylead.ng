/** Visible breadcrumb for inner pages, in micro caps; the same crumbs feed BreadcrumbList. */
import Link from 'next/link';

import type { Crumb } from '@/lib/jsonld';
import { cn } from '@/lib/utils';

export function Breadcrumb({
  crumbs,
  className,
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  const all = [{ name: 'Home', path: '/' }, ...crumbs];

  return (
    <nav aria-label="Breadcrumb" className={cn('micro', className)}>
      <ol className="flex flex-wrap items-center gap-2 opacity-75">
        {all.map((c, i) => {
          const last = i === all.length - 1;

          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="opacity-100">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="link-draw">
                    {c.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
