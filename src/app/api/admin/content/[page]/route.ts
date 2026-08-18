import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  readPageContentSync,
  writePageContentSync,
  isValidLocale,
  isValidPage,
} from '@/lib/content';

// Content editor API. GET returns the JSON for a page+locale; PATCH writes
// the edited JSON back to /content/{locale}/{page}.json.
export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { page } = await params;
  if (!isValidPage(page)) {
    return NextResponse.json({ error: 'Unknown page.' }, { status: 404 });
  }

  const locale = req.nextUrl.searchParams.get('locale') ?? 'en';
  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'Unknown locale.' }, { status: 400 });
  }

  try {
    const data = readPageContentSync(locale, page);
    return NextResponse.json({ data });
  } catch (err) {
    console.error('read content failed:', err);
    return NextResponse.json(
      { error: 'Failed to read content.' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { page } = await params;
  if (!isValidPage(page)) {
    return NextResponse.json({ error: 'Unknown page.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { locale, data } = body as { locale?: string; data?: unknown };
  if (!isValidLocale(locale ?? '')) {
    return NextResponse.json({ error: 'Unknown locale.' }, { status: 400 });
  }
  if (!data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Missing content data.' }, { status: 400 });
  }

  try {
    writePageContentSync(locale as string, page, data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('write content failed:', err);
    return NextResponse.json(
      { error: 'Failed to save content.' },
      { status: 500 },
    );
  }
}
