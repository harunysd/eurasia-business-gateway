import { setRequestLocale } from 'next-intl/server';
import { SectorsManager } from '@/components/SectorsManager';
import type { Locale } from '@/i18n/routing';

// Admin sector manager page.
type Params = { locale: Locale };

export default async function AdminSectorsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const basePath = `/${locale}/admin/sectors`;

  return <SectorsManager basePath={basePath} />;
}
