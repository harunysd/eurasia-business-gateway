import { setRequestLocale } from 'next-intl/server';
import { getSmtpSettings, isEmailConfigured } from '@/lib/email';
import { getSiteSettings } from '@/lib/settings';
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
  const s = await getSiteSettings();

  return (
    <EmailSettingsForm
      initial={smtp}
      resendConfigured={isEmailConfigured()}
      mailProvider={s.mailProvider || 'Zoho Mail'}
      webmailUrl={s.webmailUrl || 'https://mail.zoho.com/'}
    />
  );
}