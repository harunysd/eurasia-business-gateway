import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

// Body font: Inter (regular weight) — supports Latin, Latin Extended
// (Turkish diacritics: ğ, ş, ı, İ, ö, ü, ç) and Cyrillic (Russian).
const inter = Inter({
  subsets: ['latin', 'cyrillic', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
});

// Heading font: Plus Jakarta Sans (bold/extrabold) — modern, contemporary
// look. Supports Latin + Latin Extended (Turkish). Does NOT include
// Cyrillic, so on /ru pages the browser falls back to Inter (the next font
// in the stack) for Cyrillic heading glyphs.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Eurasia Business Gateway',
  description:
    'Connecting Türkiye with Eurasia — market entry, partner search and business development across the Eurasian corridor.',
};

// Locale layout: renders <html lang={locale}> with the font, provides
// next-intl messages to all client components below.
type Params = { locale: string };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  const activeLocale = locale as Locale;

  // Enable static rendering for this locale segment.
  setRequestLocale(activeLocale);

  const messages = await getMessages();

  return (
    <html lang={activeLocale} className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <NextIntlClientProvider locale={activeLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
