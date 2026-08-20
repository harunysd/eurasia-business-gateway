'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { useSiteSettings } from '@/hooks/use-site-settings';

// Global footer: navy background on every page.
//  1. Top 4-column feature strip (globe/users/target/trending-up).
//  2. Link columns: Company / Directions / Legal.
//  3. Bottom contact bar with address, email, phone, LinkedIn + copyright.
export function Footer({ logoUrl }: { logoUrl?: string }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const s = useSiteSettings();

  const address = s?.officeAddress || 'İstanbul, Türkiye';
  const email = s?.officeEmail || 'info@eurasiabusinessgateway.com';
  const phone = s?.phone || '+90 212 912 19 27';
  const linkedin = s?.linkedinUrl || 'https://www.linkedin.com';
  const copyright = s?.footerCopyright || t('contact.copyright');

  const features = [
    { icon: 'Globe', title: t('features.bridgingTitle'), text: t('features.bridgingText') },
    { icon: 'Users', title: t('features.partnershipsTitle'), text: t('features.partnershipsText') },
    { icon: 'Target', title: t('features.focusedTitle'), text: t('features.focusedText') },
    { icon: 'TrendingUp', title: t('features.growingTitle'), text: t('features.growingText') },
  ];

  return (
    <footer className="w-full bg-navy text-white">
      {/* Feature strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-x-8 gap-y-10 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 md:px-6 md:py-12">
          {features.map((f) => (
            <div
              key={f.title}
              className="group flex items-start gap-4 text-left"
            >
              <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal/15 text-teal transition-transform group-hover:scale-110">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold uppercase tracking-wide text-white">
                  {f.title}
                </h4>
                <p className="mt-1.5 text-sm text-lightTeal">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand (left) + link columns (right), max-w-7xl with room to breathe */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-14 md:grid-cols-12 md:px-6 md:py-16">
        <div className="flex flex-col items-center md:col-span-5 md:items-start">
          <Logo variant="dark" markImage={logoUrl || s?.logo || undefined} />
          <p className="mt-6 max-w-xs text-center text-sm leading-relaxed text-white/60 md:text-left">
            {s?.tagline || 'TRADE · INVESTMENT · MARKET ENTRY'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">
              {t('columns.company')}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/about" className="transition-colors hover:text-teal">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition-colors hover:text-teal">
                  {tNav('services')}
                </Link>
              </li>
              <li>
                <Link href="/sectors" className="transition-colors hover:text-teal">
                  {tNav('sectors')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">
              {t('columns.directions')}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link
                  href="/turkiye-to-eurasia"
                  className="transition-colors hover:text-teal"
                >
                  {tNav('turkiyeToEurasia')}
                </Link>
              </li>
              <li>
                <Link
                  href="/eurasia-to-turkiye"
                  className="transition-colors hover:text-teal"
                >
                  {tNav('eurasiaToTurkiye')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">
              {t('columns.legal')}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-teal">
                  {t('columns.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-teal">
                  {t('columns.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom contact bar — horizontally centered and balanced */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-10 text-center md:gap-12 md:px-6">
          <span className="inline-flex items-center gap-2 text-white/80">
            <Icon name="MapPin" className="h-4 w-4 shrink-0 text-teal" />
            <span>
              {t('contact.officeLabel')} — {address}
            </span>
          </span>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-teal"
          >
            <Icon name="Mail" className="h-4 w-4 shrink-0 text-teal" />
            {email}
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-teal"
          >
            <Icon name="Phone" className="h-4 w-4 shrink-0 text-teal" />
            {phone}
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-teal"
          >
            <Icon name="Linkedin" className="h-4 w-4 shrink-0 text-teal" />
            {t('contact.linkedinLabel')}
          </a>
        </div>
        <div className="border-t border-white/5 py-4">
          <div className="mx-auto max-w-container px-4 text-center md:px-6">
            <p className="text-xs text-white/50">{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
