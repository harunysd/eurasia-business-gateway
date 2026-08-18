import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public contact form endpoint. Creates a ContactSubmission row. Runs on the
// Node.js runtime so Prisma + SQLite work reliably.
export const runtime = 'nodejs';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;
  const name = isString(data.name) ? data.name.trim() : '';
  const email = isString(data.email) ? data.email.trim() : '';
  const company = isString(data.company) ? data.company.trim() : null;
  const phone = isString(data.phone) ? data.phone.trim() : null;
  const message = isString(data.message) ? data.message.trim() : '';

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!email || !validateEmail(email)) {
    return NextResponse.json(
      { error: 'A valid email is required.' },
      { status: 400 },
    );
  }
  if (!message) {
    return NextResponse.json(
      { error: 'Message is required.' },
      { status: 400 },
    );
  }

  try {
    const submission = await prisma.contactSubmission.create({
      data: { name, email, company, phone, message },
    });
    return NextResponse.json({ id: submission.id }, { status: 201 });
  } catch (err) {
    console.error('Failed to save contact submission:', err);
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 },
    );
  }
}
