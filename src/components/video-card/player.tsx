'use client';

import { type ReactNode, useRef, useState } from 'react';

type Props = {
  label: string;
  platformLabel: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  permalink: string;
  embedUrl: string;
  /** The card face, rendered on the server. */
  children: ReactNode;
  className?: string;
};

/**
 * Tap-to-load facade (brief 10.3, D19). The card is a real link to the post,
 * so it works with JS off. With JS, a tap opens a dialog and only then mounts
 * the platform iframe; closing unmounts it. No request, script or cookie
 * reaches Instagram, TikTok or YouTube before the tap. If the frame hasn't
 * loaded in 8s, a fallback link shows.
 *
 * After the first press inside the video, focus lives in the cross-origin
 * frame, so Escape stops working; the Close button is the primary exit.
 */
export function VideoPlayer({
  label,
  platformLabel,
  platform,
  permalink,
  embedUrl,
  children,
  className,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [slow, setSlow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const close = () => dialog.current?.close();

  return (
    <>
      <a
        ref={trigger}
        href={permalink}
        target="_blank"
        rel="noopener"
        className={className}
        aria-label={`Play video: ${label} (loads from ${platformLabel})`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          setSlow(false);
          setOpen(true);
          dialog.current?.showModal();
          timer.current = setTimeout(() => setSlow(true), 8000);
        }}
      >
        {children}
      </a>
      <dialog
        ref={dialog}
        className="reel-dialog m-auto"
        aria-label={label}
        onClose={() => {
          clearTimeout(timer.current);
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="flex flex-col items-end gap-3 p-2">
          <button
            type="button"
            onClick={close}
            className="micro text-bone min-h-11 px-2 underline underline-offset-4"
          >
            Close
          </button>
          <div
            className="reel-frame bg-bone relative overflow-hidden"
            data-platform={platform}
          >
            {open ? (
              <iframe
                src={embedUrl}
                title={`${platformLabel} video: ${label}`}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                onLoad={(e) => {
                  clearTimeout(timer.current);
                  setSlow(false);
                  e.currentTarget.focus();
                }}
              />
            ) : null}
            {slow ? (
              <p className="bg-bone/95 text-ink absolute inset-x-0 bottom-0 p-4 text-sm">
                Couldn’t load the video.{' '}
                <a
                  href={permalink}
                  target="_blank"
                  rel="noopener"
                  className="underline"
                >
                  Watch it on {platformLabel}
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
