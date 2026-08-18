import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

// Reply-by-email endpoint. Sends an email through the admin-configured SMTP
// transport, falling back to Resend when no SMTP settings exist.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { to?: string; subject?: string; message?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { to, subject, message } = body;
  if (!to || !subject || !message) {
    return NextResponse.json(
      { error: 'to, subject and message are required.' },
      { status: 400 },
    );
  }

  try {
    const { provider } = await sendEmail({ to, subject, text: message });
    return NextResponse.json({ ok: true, provider });
  } catch (err) {
    console.error('reply email failed:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to send email.',
      },
      { status: 500 },
    );
  }
}