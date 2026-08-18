import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseSectorContent, serializeSectorContent } from '@/lib/sectors';

// Admin Sectors API for a single sector: PATCH updates it, DELETE removes it.
export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
}

function notFound() {
  return NextResponse.json({ error: 'Sektör bulunamadı.' }, { status: 404 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  const existing = await prisma.sector.findUnique({ where: { id } });
  if (!existing) return notFound();

  const { slug, icon, image, order, content } = (body ?? {}) as {
    slug?: string;
    icon?: string;
    image?: string;
    order?: number;
    content?: unknown;
  };

  const nextSlug =
    (slug || existing.slug).trim().toLowerCase().replace(/\s+/g, '-') ||
    existing.slug;

  if (nextSlug !== existing.slug) {
    const clash = await prisma.sector.findUnique({ where: { slug: nextSlug } });
    if (clash) {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor.' },
        { status: 409 },
      );
    }
  }

  const existingContent = parseSectorContent(existing.content);
  let serialized = existing.content;
  if (content && typeof content === 'object') {
    // Merge incoming localized fields into the existing ones so a partial
    // update (e.g. only one locale, or only reordering) never wipes other
    // languages.
    const incoming = parseSectorContent(JSON.stringify(content));
    const merged: typeof existingContent = JSON.parse(JSON.stringify(existingContent));
    for (const l of Object.keys(incoming) as Array<keyof typeof merged>) {
      const block = incoming[l];
      if (!block) continue;
      merged[l] = {
        title: block.title || merged[l].title,
        description: block.description || merged[l].description,
        longDescription: block.longDescription || merged[l].longDescription,
      };
    }
    serialized = serializeSectorContent(merged);
  }

  try {
    const updated = await prisma.sector.update({
      where: { id },
      data: {
        slug: nextSlug,
        icon: typeof icon === 'string' && icon ? icon : existing.icon,
        image: typeof image === 'string' ? image : existing.image,
        order:
          typeof order === 'number' && Number.isFinite(order)
            ? order
            : existing.order,
        content: serialized,
      },
    });
    return NextResponse.json({
      sector: { ...updated, content: parseSectorContent(updated.content) },
    });
  } catch (err) {
    console.error('update sector failed:', err);
    return NextResponse.json(
      { error: 'Sektör kaydedilemedi.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { id } = await params;

  const existing = await prisma.sector.findUnique({ where: { id } });
  if (!existing) return notFound();

  try {
    await prisma.sector.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('delete sector failed:', err);
    return NextResponse.json(
      { error: 'Sektör silinemedi.' },
      { status: 500 },
    );
  }
}
