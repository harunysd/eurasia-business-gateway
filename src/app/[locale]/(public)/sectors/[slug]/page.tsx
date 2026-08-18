import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPageContent } from '@/lib/content';
import {
  getDbSectors,
  getDbSectorBySlug,
  sectorForLocale,
  type SectorItem,
} from '@/lib/sectors';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import type { Locale } from '@/i18n/routing';

type SectorsContent = {
  hero: { label: string; title: string; subtitle: string; image: string };
  sectors: SectorItem[];
  cta: { heading: string; paragraph: string; buttonText: string; href: string };
};

type Params = { locale: Locale; slug: string };

const staticSlugs = [
  'construction',
  'machinery',
  'food-agriculture',
  'textile-apparel',
  'energy',
  'consumer-goods',
];

// Keep the original slugs pre-rendered for fast static delivery. Sectors
// added later from the admin panel render on demand (dynamicParams is on).
export function generateStaticParams() {
  return ['en', 'tr', 'ru'].flatMap((locale) =>
    staticSlugs.map((slug) => ({ locale, slug })),
  );
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = await getPageContent<SectorsContent>(locale, 'sectors');

  // 1) DB-backed sector when present, 2) static JSON fallback otherwise.
  const dbSector = await getDbSectorBySlug(slug);
  let sector: SectorItem | undefined;
  if (dbSector) {
    const loc = sectorForLocale(dbSector.content, locale);
    sector = {
      id: dbSector.slug,
      icon: dbSector.icon,
      title: loc.title,
      description: loc.description,
      image: dbSector.image,
      longDescription: loc.longDescription,
    };
  } else {
    sector = c.sectors.find((s) => s.id === slug);
  }
  if (!sector) notFound();

  // Other sectors for the "explore" row — DB first, static fallback.
  const dbAll = await getDbSectors();
  const allSectors =
    dbAll && dbAll.length > 0
      ? dbAll
          .filter((s) => s.slug !== slug)
          .map((s) => {
            const loc = sectorForLocale(s.content, locale);
            return {
              id: s.slug,
              icon: s.icon,
              title: loc.title,
              description: loc.description,
              image: s.image,
              longDescription: loc.longDescription,
            };
          })
      : c.sectors.filter((s) => s.id !== slug);

  return (
    <>
      {/* Hero banner using the sector's image */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden py-24">
        <Image
          src={sector.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 mx-auto max-w-container px-4 text-center md:px-6">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white/90 text-teal shadow-sm backdrop-blur">
            <Icon name={sector.icon} className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
            {sector.title}
          </h1>
        </div>
      </section>

      {/* Long description */}
      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <p className="text-base leading-relaxed text-gray md:text-lg">
            {sector.longDescription}
          </p>
        </div>
      </section>

      {/* Other sectors */}
      <section className="bg-gray/5 py-16 md:py-20">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <h2 className="mb-8 text-center text-xl font-extrabold uppercase tracking-tight text-navy">
            {c.hero.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {allSectors.map((s) => (
              <Button
                key={s.id}
                href={`/sectors/${s.id}`}
                variant="outline"
                size="md"
                className="flex-col gap-2 py-4 text-xs"
              >
                <Icon name={s.icon} className="h-5 w-5" />
                <span className="text-center leading-tight">{s.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy">
        <div className="mx-auto max-w-container px-4 py-16 text-center md:px-6 md:py-20">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white md:text-3xl">
            {c.cta.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-lightTeal">
            {c.cta.paragraph}
          </p>
          <div className="mt-8">
            <Button href={c.cta.href} variant="primary" size="lg">
              {c.cta.buttonText}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
