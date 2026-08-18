import { setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/LoginForm';
import type { Locale } from '@/i18n/routing';

// Admin login page. Renders a full-screen login form (no sidebar chrome —
// that lives in the (authed) route group).
type Params = { locale: Locale };

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const callbackUrl = `/${locale}/admin`;
  return <LoginForm callbackUrl={callbackUrl} />;
}
