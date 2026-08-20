import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

// Global site settings. Stored in the SiteSettings DB table (single row,
// id = 1) and edited from the admin "Genel Ayarlar" page. getSiteSettings()
// reads the database first and falls back to the legacy JSON file (then the
// defaults) so the site builds and renders even on a fresh database.
export type SiteSettings = {
  companyName: string;
  tagline: string;
  logo: string;
  officeAddress: string;
  officeEmail: string;
  phone: string;
  linkedinUrl: string;
  footerCopyright: string;
  // Map block — provider + coordinates + token drive the embedded map.
  // mapEmbedUrl (custom iframe URL) overrides the provider when set.
  mapProvider: 'osm' | 'google' | 'mapbox';
  mapLat: number | null;
  mapLng: number | null;
  mapboxToken: string;
  mapEmbedUrl: string;
};

export const defaultSettings: SiteSettings = {
  companyName: 'Eurasia Business Gateway',
  tagline: 'Trade · Investment · Market Entry',
  logo: '',
  officeAddress: 'İstanbul, Türkiye',
  officeEmail: 'info@eurasiabusinessgateway.com',
  phone: '+90 212 912 19 27',
  linkedinUrl: 'https://www.linkedin.com',
  footerCopyright: '© 2026 Eurasia Business Gateway. All rights reserved.',
  mapProvider: 'google',
  mapLat: 41.0082,
  mapLng: 28.9784,
  mapboxToken: '',
  mapEmbedUrl: '',
};

const settingsFile = path.join(process.cwd(), 'content', 'settings.json');

// Synchronous read of the legacy JSON file. Used as a build/fallback source
// and to keep the file in sync when the admin saves from the database.
export function readSettingsJson(): SiteSettings {
  try {
    const raw = fs.readFileSync(settingsFile, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return { ...defaultSettings, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

// Synchronous read kept for callers that cannot await (legacy compatibility).
export function readSettingsSync(): SiteSettings {
  return readSettingsJson();
}

// DB-first read of the global settings; falls back to the JSON file.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (row) {
      const { id: _id, updatedAt: _updatedAt, ...rest } = row;
      return { ...defaultSettings, ...rest } as SiteSettings;
    }
  } catch (err) {
    console.error('read site settings from DB failed:', err);
  }
  return readSettingsJson();
}

// Persists settings to the database (single row) and keeps the JSON file in
// sync as a fallback for fresh environments.
export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const data: SiteSettings = { ...defaultSettings, ...settings };
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  writeSettingsSync(data);
}

export function writeSettingsSync(settings: SiteSettings): void {
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
}
