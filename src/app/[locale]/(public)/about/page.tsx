import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { getPageContent } from '@/lib/content';
import { SectionHero } from '@/components/SectionHero';
import { CtaBand } from '@/components/CtaBand';
import { Icon } from '@/components/Icon';
import { FadeInOnScroll, StaggerGroup, StaggerItem } from '@/components/animations';
import type { Locale } from '@/i18n/routing';

type AboutContent = {
  hero: { label: string; title: string; subtitle: string; image: string };
  whoWeAre: {
    heading: string;
    paragraphs: string[];
    image: string;
  };
  missionVision: {
    mission: { heading: string; paragraph: string };
    vision: { heading: string; paragraph: string };
  };
  whyChooseUs: {
    heading: string;
    items: { icon: string; title: string; description: string }[];
  };
  cta: { heading: string; paragraph: string; buttonText: string; href: string };
};

type Params = { locale: Locale };

export default async function AboutPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = await getPageContent<AboutContent>(locale, 'about');

  return (
    <>
      <SectionHero
        label={c.hero.label}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        image={c.hero.image}
      />

      {/* Who We Are */}
      <FadeInOnScroll>
      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-tight text-navy md:text-3xl">
              {c.whoWeAre.heading}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray">
              {c.whoWeAre.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
            <Image
              src={c.whoWeAre.image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
      </FadeInOnScroll>

      {/* Mission & Vision */}
      <FadeInOnScroll>
      <section className="bg-gray/5 py-12 md:py-section">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-8 px-4 md:grid-cols-2 md:px-6">
          {(
            [
              { key: 'mission', icon: 'Target' },
              { key: 'vision', icon: 'Eye' },
            ] as const
          ).map(({ key, icon }) => {
            const item = c.missionVision[key];
            return (
              <div
                key={key}
                className="rounded-lg border border-gray/15 bg-white p-8 shadow-sm transition-transform duration-300 hover:-translate-y-1 md:p-10"
              >
                <div className="mb-6 flex items-start gap-5">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                    <Icon name={icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-navy">
                      {item.heading}
                    </h3>
                    <div className="mt-2 h-1 w-12 rounded-full bg-teal" />
                  </div>
                </div>
                <p className="text-base leading-relaxed text-gray">
                  {item.paragraph}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      </FadeInOnScroll>

      {/* Why Choose Us */}
      <FadeInOnScroll>
      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-navy md:text-3xl">
              {c.whyChooseUs.heading}
            </h2>
            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-teal" />
          </div>
          <StaggerGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {c.whyChooseUs.items.map((item) => (
              <StaggerItem key={item.title} className="text-center">
                <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-tight text-navy">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
      </FadeInOnScroll>

      <CtaBand
        heading={c.cta.heading}
        paragraph={c.cta.paragraph}
        buttonText={c.cta.buttonText}
        href={c.cta.href}
      />
    </>
  );
}
