import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { readPageContentSync, isValidPage } from '@/lib/content';
import { PageEditor } from '@/components/PageEditor';
import type { Locale, Locale as LocaleType } from '@/i18n/routing';
import { locales } from '@/i18n/routing';

// Editor for a single page. Loads the content JSON for all three locales
// server-side and hands them to the interactive client editor.
type Params = { locale: Locale; page: string };

export default async function EditPagePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, page } = await params;
  setRequestLocale(locale);
  if (!isValidPage(page)) notFound();

  const contentByLocale: Record<string, unknown> = {};
  for (const l of locales) {
    contentByLocale[l] = readPageContentSync(l, page);
  }

  return (
    <PageEditor
      page={page}
      activeLocale={locale as LocaleType}
      initialContent={contentByLocale}
    />
  );
}
