import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

// Sends a test email through whichever transport is currently configured.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { to?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { to } = body;
  if (!to) {
    return NextResponse.json({ error: 'A recipient email is required.' }, { status: 400 });
  }

  try {
    const { provider } = await sendEmail({
      to,
      subject: 'Test email from Eurasia Business Gateway',
      text: 'This is a test email. If you received it, your email settings are working correctly.',
    });
    return NextResponse.json({ ok: true, provider });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to send test email.',
      },
      { status: 500 },
    );
  }
}