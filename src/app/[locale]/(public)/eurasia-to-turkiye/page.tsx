import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { getPageContent } from '@/lib/content';
import { getSiteSettings } from '@/lib/settings';
import { ContactForm } from '@/components/ContactForm';
import { ContactLocationBox } from '@/components/ContactLocationBox';
import { Icon } from '@/components/Icon';
import { FadeIn, FadeInOnScroll } from '@/components/animations';
import type { Locale } from '@/i18n/routing';

type EtContent = {
  hero: { label: string; title: string; subtitle: string; image: string };
  intro: { heading: string; paragraph: string };
  whyTurkey: {
    heading: string;
    items: { icon: string; title: string; description: string }[];
  };
  process: {
    heading: string;
    steps: { title: string; description: string }[];
  };
  cta: {
    heading: string;
    paragraph: string;
    officeCard: { title: string; address: string; email: string; phone: string };
  };
};

type Params = { locale: Locale };

export default async function EurasiaToTurkiyePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = await getPageContent<EtContent>(locale, 'eurasia-to-turkiye');
  const s = await getSiteSettings();

  const office = {
    title: c.cta.officeCard.title,
    address: s.officeAddress || c.cta.officeCard.address,
    email: s.officeEmail || c.cta.officeCard.email,
    phone: s.phone || c.cta.officeCard.phone,
    mapEmbedUrl: s.mapEmbedUrl,
  };

  return (
    <>
      {/* Hero with teal-gradient photo */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-24">
        <Image
          src={c.hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal/85 to-navy/85" />
        <div className="relative z-10 mx-auto max-w-container px-4 text-center md:px-6">
          <FadeIn delay={0}>
            <span className="mb-4 block text-sm font-semibold uppercase tracking-[0.2em] text-white">
              {c.hero.label}
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
              {c.hero.title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
              {c.hero.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Intro */}
      <FadeInOnScroll>
      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-tight text-navy md:text-3xl">
            {c.intro.heading}
          </h2>
          <p className="text-base leading-relaxed text-gray md:text-lg">
            {c.intro.paragraph}
          </p>
        </div>
      </section>
      </FadeInOnScroll>

      {/* Why Türkiye — 4-icon points */}
      <FadeInOnScroll>
      <section className="bg-gray/5 py-12 md:py-section">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-navy md:text-3xl">
              {c.whyTurkey.heading}
            </h2>
            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-teal" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {c.whyTurkey.items.map((item) => (
              <div key={item.title} className="flex h-full flex-col items-center text-center">
                <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-tight text-navy">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInOnScroll>

      {/* Our Process — 4-step horizontal timeline */}
      <FadeInOnScroll>
      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-navy md:text-3xl">
              {c.process.heading}
            </h2>
            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-teal" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {c.process.steps.map((step, i) => (
              <div key={i} className="relative">
                {i < c.process.steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-teal/30 md:block" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal text-lg font-extrabold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-tight text-navy">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInOnScroll>

      {/* Closing CTA with ContactForm + office info card */}
      <FadeInOnScroll>
      <section className="bg-gray/5 py-12 md:py-section">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-navy md:text-3xl">
              {c.cta.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray">
              {c.cta.paragraph}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-stretch">
            <div className="flex">
              <div className="flex w-full flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-sm ring-1 ring-black/5">
                <ContactForm />
              </div>
            </div>
            <ContactLocationBox
              title={office.title}
              address={office.address}
              email={office.email}
              phone={office.phone}
              mapEmbedUrl={office.mapEmbedUrl}
            />
          </div>
        </div>
      </section>
      </FadeInOnScroll>
    </>
  );
}
