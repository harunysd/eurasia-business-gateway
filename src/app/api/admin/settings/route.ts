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

  const next = body as Partial<SiteSettings>;
  const merged: SiteSettings = { ...(await getSiteSettings()), ...next };
  const out = merged as Record<string, unknown>;
  for (const key of Object.keys(defaultSettings) as (keyof SiteSettings)[]) {
    const value = out[key];
    if (key === 'mapLat' || key === 'mapLng') {
      // Coordinates: keep numbers as-is, parse numeric strings, else null.
      out[key] =
        typeof value === 'number' && Number.isFinite(value)
          ? value
          : typeof value === 'string' && value.trim() !== '' &&
            Number.isFinite(Number(value))
            ? Number(value)
            : null;
    } else {
      out[key] =
        typeof value === 'string' ? value : defaultSettings[key];
    }
  }

  try {
    await saveSiteSettings(merged);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('save site settings failed:', err);
    return NextResponse.json(
      { error: 'Ayarlar kaydedilemedi.' },
      { status: 500 },
    );
  }
}
