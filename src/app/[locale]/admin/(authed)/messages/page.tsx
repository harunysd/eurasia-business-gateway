import { setRequestLocale } from 'next-intl/server';
import { MessagesList } from '@/components/MessagesList';
import type { Locale } from '@/i18n/routing';

// Admin messages page. Renders the interactive submissions list.
type Params = { locale: Locale };

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MessagesList />;
}
