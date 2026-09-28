/** Plain legal layout (brief 9.15): no marketing copy, a draft notice, a reading measure. */
import type { ReactNode } from 'react';

import { Breadcrumb } from '@/components/breadcrumb';
import { JsonLd } from '@/components/json-ld';

export function LegalPage({
  path,
  title,
  description,
  draftNote,
  updated,
  children,
}: {
  path: string;
  title: string;
  description: string;
  draftNote: string;
  updated: string;
  children: ReactNode;
}) {
  const crumbs = [{ name: title, path }];

  return (
    <>
      <JsonLd
        path={path}
        title={title}
        description={description}
        crumbs={crumbs}
      />
      <div className="mx-auto max-w-[96rem] px-(--gutter) pt-10 pb-28 md:pt-14">
        <Breadcrumb crumbs={crumbs} />
        <h1 className="font-display text-display mt-16 max-w-[18ch] md:mt-24">
          {title}
        </h1>
        <p className="micro mt-6 opacity-70">
          {draftNote} · Last updated {updated}
        </p>
        <div className="prose mt-14">{children}</div>
      </div>
    </>
  );
}
