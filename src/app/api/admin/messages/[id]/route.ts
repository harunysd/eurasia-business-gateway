import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Toggle the read/unread state of a single submission. Admin-only.
export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let body: { read?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // ignore parse errors; default to toggling
  }

  const existing = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const nextRead =
    typeof body.read === 'boolean' ? body.read : !existing.read;

  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: { read: nextRead },
  });
  return NextResponse.json({ submission: updated });
}
