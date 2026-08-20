import { prisma } from './prisma';
import { locales, type Locale } from '@/i18n/routing';
import { readPageContentSync } from './content';

// Sector localized copy stored as a JSON string on the Sector.content column.
export type SectorContent = {
  title: string;
  description: string;
  longDescription: string;
};

export type SectorRecord = {
  id: string;
  slug: string;
  icon: string;
  image: string;
  order: number;
  content: Record<Locale, SectorContent>;
  createdAt: Date;
  updatedAt: Date;
};

// Same shape the static /content/{locale}/sectors.json uses for its sector
// cards, so the public pages can mix DB rows and static fallback freely.
export type SectorItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  longDescription: string;
};

const emptyContent = (): Record<Locale, SectorContent> => ({
  en: { title: '', description: '', longDescription: '' },
  tr: { title: '', description: '', longDescription: '' },
  ru: { title: '', description: '', longDescription: '' },
});

export function parseSectorContent(raw: string): Record<Locale, SectorContent> {
  try {
    const parsed = JSON.parse(raw || '{}') as Partial<
      Record<Locale, SectorContent>
    >;
    const base = emptyContent();
    for (const l of locales) {
      const loc = parsed[l];
      if (loc && typeof loc === 'object') {
        base[l] = {
          title: typeof loc.title === 'string' ? loc.title : '',
          description: typeof loc.description === 'string' ? loc.description : '',
          longDescription:
            typeof loc.longDescription === 'string' ? loc.longDescription : '',
        };
      }
    }
    return base;
  } catch {
    return emptyContent();
  }
}

export function serializeSectorContent(
  content: Record<Locale, SectorContent>,
): string {
  return JSON.stringify(content);
}

// Picks the best localized block for a locale, falling back en → tr → ru.
export function sectorForLocale(
  content: Record<Locale, SectorContent>,
  locale: string,
): SectorContent {
  if (isLocale(locale)) return content[locale];
  return content.en;
}

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

type StaticSectorItem = {
  id: string;
  icon?: string;
  image?: string;
  title?: string;
  description?: string;
  longDescription?: string;
};

// One-time migration: when the Sector table is empty (fresh setup), seed it
// from the static /content/{locale}/sectors.json files so the admin panel and
// the public site always show the same sectors. Returns true when rows were
// created.
export async function seedSectorsFromContentIfEmpty(): Promise<boolean> {
  try {
    const count = await prisma.sector.count();
    if (count > 0) return false;

    const merged: {
      id: string;
      icon: string;
      image: string;
      content: Record<Locale, SectorContent>;
    }[] = [];

    for (const locale of locales) {
      const json = readPageContentSync(locale, 'sectors') as {
        sectors?: StaticSectorItem[];
      };
      const list = Array.isArray(json?.sectors) ? json.sectors : [];
      for (const it of list) {
        if (!it.id) continue;
        let entry = merged.find((e) => e.id === it.id);
        if (!entry) {
          entry = {
            id: it.id,
            icon: '',
            image: '',
            content: emptyContent(),
          };
          merged.push(entry);
        }
        if (typeof it.icon === 'string' && it.icon) entry.icon = it.icon;
        if (typeof it.image === 'string') entry.image = it.image;
        entry.content[locale] = {
          title: typeof it.title === 'string' ? it.title : '',
          description:
            typeof it.description === 'string' ? it.description : '',
          longDescription:
            typeof it.longDescription === 'string' ? it.longDescription : '',
        };
      }
    }

    for (const [idx, it] of merged.entries()) {
      await prisma.sector.create({
        data: {
          slug: it.id,
          icon: it.icon || 'BarChart3',
          image: it.image,
          order: idx,
          content: serializeSectorContent(it.content),
        },
      });
    }
    return merged.length > 0;
  } catch (err) {
    console.error('seed sectors failed:', err);
    return false;
  }
}

// All sectors ordered by the admin-set order. Returns null when the table is
// empty so callers can fall back to the static JSON content.
export async function getDbSectors(): Promise<SectorRecord[] | null> {
  try {
    const rows = await prisma.sector.findMany({ orderBy: { order: 'asc' } });
    if (rows.length === 0) return null;
    return rows.map((row) => ({
      ...row,
      content: parseSectorContent(row.content),
    }));
  } catch {
    return null;
  }
}

export async function getDbSectorBySlug(
  slug: string,
): Promise<SectorRecord | null> {
  try {
    const row = await prisma.sector.findUnique({ where: { slug } });
    if (!row) return null;
    return { ...row, content: parseSectorContent(row.content) };
  } catch {
    return null;
  }
}

export async function getDbSectorById(id: string): Promise<SectorRecord | null> {
  try {
    const row = await prisma.sector.findUnique({ where: { id } });
    if (!row) return null;
    return { ...row, content: parseSectorContent(row.content) };
  } catch {
    return null;
  }
}

// Maps DB rows to the SectorItem shape used by the public pages.
export function toSectorItems(
  rows: SectorRecord[],
  locale: string,
): SectorItem[] {
  return rows.map((row) => {
    const loc = sectorForLocale(row.content, locale);
    return {
      id: row.slug,
      icon: row.icon,
      title: loc.title,
      description: loc.description,
      image: row.image,
      longDescription: loc.longDescription,
    };
  });
}
