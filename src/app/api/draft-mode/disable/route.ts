/** Leaves Draft Mode and returns to the page the editor was on. */
import { draftMode } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const to = request.nextUrl.searchParams.get('redirect') ?? '/';

  return NextResponse.redirect(
    new URL(to.startsWith('/') ? to : '/', request.url)
  );
}
