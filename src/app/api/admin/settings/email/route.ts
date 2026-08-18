import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSmtpSettings, saveSmtpSettings } from '@/lib/email';

// Admin email (SMTP) settings API. GET returns the saved SMTP transport;
// PATCH persists it to the Setting table.
export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const smtp = await getSmtpSettings();
  return NextResponse.json({ smtp });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const current = (await getSmtpSettings()) ?? {
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    fromEmail: '',
    fromName: '',
  };
  const next = { ...current, ...(body as object) };

  try {
    await saveSmtpSettings({
      host: String(next.host ?? ''),
      port: Number(next.port ?? 587),
      secure: Boolean(next.secure),
      user: String(next.user ?? ''),
      pass: String(next.pass ?? ''),
      fromEmail: String(next.fromEmail ?? ''),
      fromName: String(next.fromName ?? ''),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('save smtp settings failed:', err);
    return NextResponse.json(
      { error: 'Failed to save email settings.' },
      { status: 500 },
    );
  }
}