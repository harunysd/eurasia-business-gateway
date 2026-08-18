import { setRequestLocale } from 'next-intl/server';
import { getPageContent } from '@/lib/content';
import { getSiteSettings } from '@/lib/settings';
import { SectionHero } from '@/components/SectionHero';
import { ContactForm } from '@/components/ContactForm';
import { ContactLocationBox } from '@/components/ContactLocationBox';
import type { Locale } from '@/i18n/routing';

type ContactContent = {
  hero: { label: string; title: string; subtitle: string; image: string };
  form: { heading: string; paragraph: string };
  infoCard: {
    address: string;
    addressLabel: string;
    email: string;
    phone: string;
    linkedinLabel: string;
  };
};

type Params = { locale: Locale };

export default async function ContactPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = await getPageContent<ContactContent>(locale, 'contact');
  const s = await getSiteSettings();

  const address = s.officeAddress || c.infoCard.address;
  const email = s.officeEmail || c.infoCard.email;
  const phone = s.phone || c.infoCard.phone;
  const linkedinUrl = s.linkedinUrl || 'https://www.linkedin.com';

  return (
    <>
      <SectionHero
        label={c.hero.label}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        image={c.hero.image}
      />

      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto max-w-container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-stretch">
            {/* Left: form */}
            <div className="flex">
              <div className="flex w-full flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-sm ring-1 ring-black/5">
                <h2 className="mb-3 text-2xl font-extrabold uppercase tracking-tight text-navy">
                  {c.form.heading}
                </h2>
                <p className="mb-8 text-base text-gray">{c.form.paragraph}</p>
                <div className="flex flex-1 flex-col">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Right: office info card + map, stretched to the form height */}
            <ContactLocationBox
              title={c.infoCard.addressLabel}
              address={address}
              email={email}
              phone={phone}
              linkedinLabel={c.infoCard.linkedinLabel}
              linkedinUrl={linkedinUrl}
              mapEmbedUrl={s.mapEmbedUrl}
            />
          </div>
        </div>
      </section>
    </>
  );
}
