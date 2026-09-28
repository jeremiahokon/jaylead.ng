/**
 * Tiny Portable Text builders so seed copy reads like prose. Paragraphs are
 * plain strings; `## ` starts an h2, `### ` an h3, `- ` a bullet, `> ` a
 * quote. [text](url) becomes a link. Output matches what Sanity stores, so
 * the same renderer handles seed and live content.
 */
import type { PortableTextBlock } from '@portabletext/types';

let n = 0;
const key = () => `k${(n++).toString(36)}`;

function spans(text: string) {
  const markDefs: { _key: string; _type: 'link'; href: string }[] = [];

  const children: {
    _type: 'span';
    _key: string;
    text: string;
    marks: string[];
  }[] = [];

  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text))) {
    if (m.index > last)
      children.push({
        _type: 'span',
        _key: key(),
        text: text.slice(last, m.index),
        marks: [],
      });

    if (m[1]) {
      const k = key();

      markDefs.push({ _key: k, _type: 'link', href: m[2] });
      children.push({ _type: 'span', _key: key(), text: m[1], marks: [k] });
    } else {
      children.push({
        _type: 'span',
        _key: key(),
        text: m[3],
        marks: ['strong'],
      });
    }

    last = m.index + m[0].length;
  }

  if (last < text.length)
    children.push({
      _type: 'span',
      _key: key(),
      text: text.slice(last),
      marks: [],
    });

  return { children, markDefs };
}

export function pt(...lines: string[]): PortableTextBlock[] {
  return lines.map((line) => {
    let style = 'normal';
    let listItem: 'bullet' | 'number' | undefined;
    let text = line;

    if (line.startsWith('## ')) [style, text] = ['h2', line.slice(3)];
    else if (line.startsWith('### ')) [style, text] = ['h3', line.slice(4)];
    else if (line.startsWith('> '))
      [style, text] = ['blockquote', line.slice(2)];
    else if (line.startsWith('- '))
      [listItem, text] = ['bullet', line.slice(2)];
    else if (/^\d+\. /.test(line))
      [listItem, text] = ['number', line.replace(/^\d+\. /, '')];
    const { children, markDefs } = spans(text);

    return {
      _type: 'block',
      _key: key(),
      style,
      markDefs,
      children,
      ...(listItem ? { listItem, level: 1 } : {}),
    } as PortableTextBlock;
  });
}
