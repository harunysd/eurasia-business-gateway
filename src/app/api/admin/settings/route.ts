import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  defaultSettings,
  getSiteSettings,
  saveSiteSettings,
  type SiteSettings,
} from '@/lib/settings';

// Admin settings API. GET returns global site settings from the database;
// PATCH persists them to the SiteSettings row.
export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  const next: SiteSettings = {
    ...(await getSiteSettings()),
    ...(body as Partial<SiteSettings>),
  };
  for (const key of Object.keys(next)) {
    if (typeof next[key as keyof SiteSettings] !== 'string') {
      next[key as keyof SiteSettings] = String(
        next[key as keyof SiteSettings] ?? defaultSettings[key as keyof SiteSettings],
      );
    }
  }

  try {
    await saveSiteSettings(next);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('save site settings failed:', err);
    return NextResponse.json(
      { error: 'Ayarlar kaydedilemedi.' },
      { status: 500 },
    );
  }
}
