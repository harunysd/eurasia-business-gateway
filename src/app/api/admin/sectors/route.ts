import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  parseSectorContent,
  serializeSectorContent,
  seedSectorsFromContentIfEmpty,
  type SectorRecord,
} from '@/lib/sectors';

// Admin Sectors API. GET lists every sector (all locales); POST creates a
// new one. All routes require an authenticated admin session.
export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  try {
    // Fresh setups start with an empty Sector table; migrate the static
    // sector cards into the database once so the panel lists them.
    await seedSectorsFromContentIfEmpty();
    const rows = await prisma.sector.findMany({ orderBy: { order: 'asc' } });
    const sectors: SectorRecord[] = rows.map((row) => ({
      ...row,
      content: parseSectorContent(row.content),
    }));
    return NextResponse.json({ sectors });
  } catch (err) {
    console.error('list sectors failed:', err);
    return NextResponse.json(
      { error: 'Sektörler yüklenemedi.' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  const { slug, icon, image, order, content } = (body ?? {}) as {
    slug?: string;
    icon?: string;
    image?: string;
    order?: number;
    content?: unknown;
  };

  let nextSlug = (slug || '').trim().toLowerCase().replace(/\s+/g, '-');
  if (!nextSlug) {
    nextSlug = `sector-${Date.now().toString(36)}${Math.floor(
      Math.random() * 1000,
    )}`;
  }

  const existing = await prisma.sector.findUnique({ where: { slug: nextSlug } });
  if (existing) {
    return NextResponse.json(
      { error: 'Bu slug zaten kullanılıyor.' },
      { status: 409 },
    );
  }

  const serialized = serializeSectorContent(
    parseSectorContent(
      content && typeof content === 'object' ? JSON.stringify(content) : '',
    ),
  );

  try {
    const created = await prisma.sector.create({
      data: {
        slug: nextSlug,
        icon: typeof icon === 'string' && icon ? icon : 'BarChart3',
        image: typeof image === 'string' ? image : '',
        order: Number(order) || 0,
        content: serialized,
      },
    });
    return NextResponse.json({
      sector: { ...created, content: parseSectorContent(created.content) },
    });
  } catch (err) {
    console.error('create sector failed:', err);
    return NextResponse.json(
      { error: 'Sektör oluşturulamadı.' },
      { status: 500 },
    );
  }
}
