import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { getPageContent } from '@/lib/content';
import { ServiceCard } from '@/components/ServiceCard';
import { Button } from '@/components/Button';
import { FadeIn, FadeInOnScroll, StaggerGroup, StaggerItem } from '@/components/animations';
import type { Locale } from '@/i18n/routing';

// Placeholder Unsplash photos — replace via the admin panel or with licensed
// photos before launch.

type HomeContent = {
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: string;
    cta1: { text: string; href: string };
    cta2: { text: string; href: string };
  };
  services: {
    heading: string;
    subheading: string;
    items: { id: string; icon: string; title: string; description: string }[];
  };
  directions: {
    left: {
      title: string;
      paragraph: string;
      buttonText: string;
      image: string;
      href: string;
    };
    right: {
      title: string;
      paragraph: string;
      buttonText: string;
      image: string;
      href: string;
    };
  };
};

type Params = { locale: Locale };

export default async function HomePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = await getPageContent<HomeContent>(locale, 'home');

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden py-20 md:min-h-[88vh]">
        <Image
          src={c.hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/70" />
        {/* Faint decorative dotted world-map overlay. */}
        <div className="absolute inset-0 dotted-globe-pattern opacity-40" />
        {/* Curved arc-line SVG overlay. */}
        <svg
          className="absolute inset-x-0 bottom-10 h-40 w-full text-teal/25"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 100 Q600 0 1200 100" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M0 115 Q600 30 1200 115" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>

        <div className="relative z-10 mx-auto max-w-container px-4 text-center md:px-6">
          <FadeIn delay={0}>
            <h1 className="text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              {c.hero.titleLine1}
              <br />
              <span className="text-teal">{c.hero.titleLine2}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
              {c.hero.subtitle}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href={c.hero.cta1.href} variant="primary" size="lg" className="w-full sm:w-auto">
                {c.hero.cta1.text}
              </Button>
              <Button href={c.hero.cta2.href} variant="outlineWhite" size="lg" className="w-full sm:w-auto">
                {c.hero.cta2.text}
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services icon grid */}
      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <FadeInOnScroll>
            <div className="mb-12 text-center md:mb-16">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-navy md:text-3xl">
                {c.services.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-gray">
                {c.services.subheading}
              </p>
              <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-teal" />
            </div>
          </FadeInOnScroll>
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {c.services.items.map((s) => (
              <StaggerItem key={s.id} className="h-full">
                <ServiceCard
                  icon={s.icon}
                  title={s.title}
                  description={s.description}
                  href={`/services#${s.id}`}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Two-column direction CTA */}
      <FadeInOnScroll>
      <section className="flex w-full flex-col lg:flex-row">
        {(['left', 'right'] as const).map((side) => {
          const d = c.directions[side];
          return (
            <div
              key={side}
              className="group relative flex min-h-[300px] w-full items-center justify-center overflow-hidden md:min-h-[420px] lg:w-1/2"
            >
              <Image
                src={d.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {side === 'left' ? (
                <div className="absolute inset-0 bg-navy/80" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-teal/90 to-navy/90" />
              )}
              <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-8 py-12 text-center md:items-start md:px-16 md:py-20 md:text-left">
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white md:text-3xl">
                  {d.title}
                </h2>
                <p
                  className={`mt-4 text-base leading-relaxed md:text-lg ${
                    side === 'left' ? 'text-lightTeal' : 'text-white/90'
                  }`}
                >
                  {d.paragraph}
                </p>
                <div className="mt-8">
                  <Button
                    href={d.href}
                    variant={side === 'left' ? 'outlineWhite' : 'white'}
                    size="md"
                  >
                    {d.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
      </FadeInOnScroll>
    </>
  );
}
