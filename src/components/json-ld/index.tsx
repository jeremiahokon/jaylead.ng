/**
 * Renders one page's JSON-LD graph. Escapes "<" so no string in the data can
 * close the script tag.
 */
import { getSettings } from '@/lib/content';
import { type Crumb, pageGraph } from '@/lib/jsonld';

type Props = {
  path: string;
  title: string;
  description: string;
  crumbs?: Crumb[];
  type?: string;
  extra?: object[];
};

export async function JsonLd(props: Props) {
  const settings = await getSettings();
  const graph = pageGraph({ settings, ...props });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
      }}
    />
  );
}
