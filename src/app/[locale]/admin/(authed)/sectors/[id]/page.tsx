import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getDbSectorById } from '@/lib/sectors';
import { SectorEditor } from '@/components/SectorEditor';
import type { Locale } from '@/i18n/routing';

// Admin editor for a single sector. Loads the record (all languages) from
// the database and hands it to the tabbed client editor.
type Params = { locale: Locale; id: string };

export default async function AdminSectorEditorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const sector = await getDbSectorById(id);
  if (!sector) notFound();

  return <SectorEditor id={sector.id} initial={sector} />;
}
