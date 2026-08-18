import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSiteSettings } from '@/lib/settings';
import type { Locale } from '@/i18n/routing';

// Public route group layout. Adds the global header/footer chrome to every
// page under /[locale]/(public)/* — home, about, services, sectors,
// directions, contact, privacy, terms, and the 404.
type Params = { locale: string };

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const s = await getSiteSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale as Locale} logoUrl={s.logo || undefined} />
      <main className="flex-1">{children}</main>
      <Footer logoUrl={s.logo || undefined} />
    </div>
  );
}
