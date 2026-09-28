import type { CSSProperties, ReactNode } from 'react';

type Part = { text: string; className?: string; breakAfter?: boolean };
type Props = { parts: Part[] };

/**
 * Server-rendered word split for hero headlines. The entrance is pure CSS,
 * so it plays on first paint with no JavaScript at all. Screen readers get
 * the sentence once, not word by word. A part can carry its own class (the
 * oil italic) and force a line break after itself. Ported from Rhine Court.
 */
export function SplitWords({ parts }: Props) {
  const sentence = parts.map((p) => p.text).join(' ');
  let i = 0;
  const nodes: ReactNode[] = [];

  parts.forEach((part, pi) => {
    const words = part.text.split(' ');

    words.forEach((word, wi) => {
      const index = i++;
      const lastOfPart = wi === words.length - 1;
      const last = pi === parts.length - 1 && lastOfPart;

      nodes.push(
        <span key={`${index}-${word}`} className={part.className}>
          <span className="split-word">
            <span style={{ '--i': index } as CSSProperties}>{word}</span>
          </span>
          {last || (lastOfPart && part.breakAfter) ? null : ' '}
        </span>
      );
      if (lastOfPart && part.breakAfter) nodes.push(<br key={`br-${index}`} />);
    });
  });

  return (
    <>
      <span className="sr-only">{sentence}</span>
      <span aria-hidden="true">{nodes}</span>
    </>
  );
}
