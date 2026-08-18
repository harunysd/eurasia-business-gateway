import { prisma } from './prisma';
import { locales, type Locale } from '@/i18n/routing';

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
