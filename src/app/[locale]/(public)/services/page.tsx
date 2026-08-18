import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getPageContent } from '@/lib/content';
import { SectionHero } from '@/components/SectionHero';
import { CtaBand } from '@/components/CtaBand';
import { Icon } from '@/components/Icon';
import { FadeInOnScroll } from '@/components/animations';
import type { Locale } from '@/i18n/routing';

type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  image: string;
  paragraph: string;
  steps: string[];
};

type ServicesContent = {
  hero: { label: string; title: string; subtitle: string; image: string };
  services: ServiceItem[];
  cta: { heading: string; paragraph: string; buttonText: string; href: string };
};

type Params = { locale: Locale };

export default async function ServicesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');
  const c = await getPageContent<ServicesContent>(locale, 'services');

  return (
    <>
      <SectionHero
        label={c.hero.label}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        image={c.hero.image}
      />

      {/* Six full detail sections, alternating left/right image-text layout. */}
      <div className="bg-white">
        {c.services.map((s, idx) => {
          const imageRight = idx % 2 === 1;
          return (
            <FadeInOnScroll key={s.id}>
            <section
              id={s.id}
              className="scroll-mt-24 border-b border-gray/10 py-12 last:border-b-0 md:py-section"
            >
              <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:px-6">
                {/* Image */}
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg shadow-md ${
                    imageRight ? 'md:order-2' : ''
                  }`}
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {/* Text */}
                <div className={imageRight ? 'md:order-1' : ''}>
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10 text-teal">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h2 className="mb-4 text-2xl font-extrabold uppercase tracking-tight text-navy md:text-3xl">
                    {s.title}
                  </h2>
                  <p className="mb-8 text-base leading-relaxed text-gray">
                    {s.paragraph}
                  </p>

                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
                    {t('howItWorks')}
                  </h3>
                  <ol className="space-y-3">
                    {s.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="pt-0.5 text-sm leading-relaxed text-navy">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
            </FadeInOnScroll>
          );
        })}
      </div>

      <CtaBand
        heading={c.cta.heading}
        paragraph={c.cta.paragraph}
        buttonText={c.cta.buttonText}
        href={c.cta.href}
      />
    </>
  );
}
