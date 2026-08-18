import fs, { promises as fsp } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/routing';

// All pages that have editable JSON content files.
export const editablePages = [
  'home',
  'about',
  'services',
  'sectors',
  'turkiye-to-eurasia',
  'eurasia-to-turkiye',
  'contact',
] as const;

export type EditablePage = (typeof editablePages)[number];

const contentDir = path.join(process.cwd(), 'content');

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function isEditablePage(value: string): value is EditablePage {
  return (editablePages as readonly string[]).includes(value);
}

// Reads a page's editable content JSON from /content/{locale}/{page}.json at
// request time. Returns a typed object (loosely typed as a generic record so
// the public pages can shape it per-page).
export async function getPageContent<T = Record<string, unknown>>(
  locale: string,
  page: string,
): Promise<T> {
  if (!isLocale(locale) || !isEditablePage(page)) {
    notFound();
  }
  const filePath = path.join(contentDir, locale, `${page}.json`);
  const raw = await fsp.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

// Synchronous read used by admin API routes (which run on the Node runtime).
export function readPageContentSync(locale: string, page: string): unknown {
  if (!isLocale(locale) || !isEditablePage(page)) {
    throw new Error(`Invalid locale or page: ${locale}/${page}`);
  }
  const filePath = path.join(contentDir, locale, `${page}.json`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function writePageContentSync(
  locale: string,
  page: string,
  data: unknown,
): void {
  if (!isLocale(locale) || !isEditablePage(page)) {
    throw new Error(`Invalid locale or page: ${locale}/${page}`);
  }
  const filePath = path.join(contentDir, locale, `${page}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function isValidLocale(value: string): value is Locale {
  return isLocale(value);
}

export function isValidPage(value: string): value is EditablePage {
  return isEditablePage(value);
}
