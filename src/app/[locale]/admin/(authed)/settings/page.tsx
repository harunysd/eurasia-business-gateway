import { setRequestLocale } from 'next-intl/server';
import { getSiteSettings } from '@/lib/settings';
import { SettingsForm } from '@/components/SettingsForm';
import type { Locale } from '@/i18n/routing';

type Params = { locale: Locale };

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSiteSettings();
  return <SettingsForm initial={settings} />;
}