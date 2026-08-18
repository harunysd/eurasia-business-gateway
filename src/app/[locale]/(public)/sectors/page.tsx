import { setRequestLocale } from 'next-intl/server';
import { getPageContent } from '@/lib/content';
import { getDbSectors, toSectorItems, type SectorItem } from '@/lib/sectors';
import { SectionHero } from '@/components/SectionHero';
import { CtaBand } from '@/components/CtaBand';
import { Icon } from '@/components/Icon';
import { Link } from '@/lib/navigation';
import { StaggerGroup, StaggerItem } from '@/components/animations';
import type { Locale } from '@/i18n/routing';

type SectorsContent = {
  hero: { label: string; title: string; subtitle: string; image: string };
  sectors: SectorItem[];
  cta: { heading: string; paragraph: string; buttonText: string; href: string };
};

type Params = { locale: Locale };

export default async function SectorsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = await getPageContent<SectorsContent>(locale, 'sectors');

  // Sectors come from the CMS database when the admin has added any; the
  // static JSON content is only a fallback for a fresh setup.
  const db = await getDbSectors();
  const sectors = db ? toSectorItems(db, locale) : c.sectors;

  return (
    <>
      <SectionHero
        label={c.hero.label}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        image={c.hero.image}
      />

      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto w-full max-w-7xl px-4">
          <StaggerGroup className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {sectors.map((s) => (
              <StaggerItem key={s.id} className="h-full">
                <Link
                  href={`/sectors/${s.id}`}
                  className="group flex h-full flex-col items-center justify-center rounded-lg border border-gray/15 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="mb-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mb-2 text-balance text-base font-bold uppercase tracking-tight text-navy">
                    {s.title}
                  </h3>
                  <p className="break-words text-sm leading-relaxed text-gray">
                    {s.description}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CtaBand
        heading={c.cta.heading}
        paragraph={c.cta.paragraph}
        buttonText={c.cta.buttonText}
        href={c.cta.href}
      />
    </>
  );
}
