import { setRequestLocale } from 'next-intl/server';
import { getSmtpSettings, isEmailConfigured } from '@/lib/email';
import { EmailSettingsForm } from '@/components/EmailSettingsForm';
import type { Locale } from '@/i18n/routing';

type Params = { locale: Locale };

export default async function AdminEmailSettingsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const smtp = await getSmtpSettings();

  return (
    <EmailSettingsForm initial={smtp} resendConfigured={isEmailConfigured()} />
  );
}