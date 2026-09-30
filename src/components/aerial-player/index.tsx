'use client';

import { type ReactNode, useRef, useState } from 'react';

/**
 * "Watch the aerial": the one self-hosted clip (public/video/aerial.mp4,
 * 14s, 2.1 MB, silent). Nothing downloads until the tap: the <video> mounts only
 * inside the open dialog. Without JavaScript the trigger is a plain link to
 * the file, which every phone can play.
 */
export function AerialPlayer({
  src,
  poster,
  children,
  className,
}: {
  src: string;
  poster: string;
  children: ReactNode;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => dialog.current?.close();

  return (
    <>
      <a
        ref={trigger}
        href={src}
        className={className}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          setOpen(true);
          dialog.current?.showModal();
        }}
      >
        {children}
      </a>
      <dialog
        ref={dialog}
        className="aerial-dialog fixed inset-0 m-0 h-full max-h-none w-full max-w-none"
        aria-label="Aerial view of Jaylead farmland"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {/* A full-screen sheet sized to the screen, not 100vw: the clip
            centred with a gutter each side, the caption under it, Close
            pinned top-right within thumb reach. */}
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-5 px-4 py-20 sm:px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            onClick={close}
            className="bg-bone text-ink fixed top-4 right-4 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold"
            autoFocus
          >
            Close
          </button>
          <div className="bg-ink aspect-video w-full max-w-[min(72rem,calc((100dvh_-_13rem)*16/9))] overflow-hidden rounded-sm">
            {open ? (
              <video
                src={src}
                poster={poster}
                controls
                autoPlay
                muted
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
              >
                <track
                  kind="descriptions"
                  label="Description"
                  srcLang="en"
                  src="data:text/vtt,WEBVTT%0A%0A00:00.000 --> 00:13.700%0ASilent drone flight over Jaylead farmland: crop plots, tree cover and a perimeter fence."
                />
              </video>
            ) : null}
          </div>
          <p className="text-sand max-w-md px-6 text-center text-sm">
            Silent drone flight over Jaylead farmland: crop plots, tree cover
            and a perimeter fence. September 2026.
          </p>
        </div>
      </dialog>
    </>
  );
}
