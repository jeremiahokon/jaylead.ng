'use client';

import { useEffect } from 'react';

/**
 * Enhances the CSS-only <details> mobile menu: closes it on Escape and after
 * a link is followed, and returns focus to the toggle. The menu works fully
 * without this file.
 */
export function MenuCloser({ id }: { id: string }) {
  useEffect(() => {
    const menu = document.getElementById(id) as HTMLDetailsElement | null;

    if (!menu) return;
    const summary = menu.querySelector('summary');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menu.open) {
        menu.open = false;
        summary?.focus();
      }
    };

    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a')) menu.open = false;
    };

    document.addEventListener('keydown', onKey);
    menu.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('keydown', onKey);
      menu.removeEventListener('click', onClick);
    };
  }, [id]);

  return null;
}
