/**
 * Only renders in Draft Mode (the Studio's Presentation preview, turned on
 * by /api/draft-mode/enable). Public visitors get nothing from this file:
 * no markup and no script. Inside the preview, VisualEditing refreshes the
 * page as drafts change, and the pill lets an editor leave preview.
 */
import { draftMode } from 'next/headers';

export async function DraftPreview() {
  if (!(await draftMode()).isEnabled) return null;
  // Imported here, not at the top, so its client code is never part of the
  // public pages' bundle.
  const { VisualEditing } = await import('next-sanity/visual-editing');

  return (
    <>
      <VisualEditing />
      <a
        href="/api/draft-mode/disable"
        className="bg-ink text-bone micro fixed bottom-4 left-4 z-[70] rounded-full px-4 py-2.5"
      >
        Preview: showing drafts. Exit
      </a>
    </>
  );
}
