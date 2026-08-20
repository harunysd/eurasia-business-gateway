'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/lib/navigation';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { FlagIcon } from './FlagIcon';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { locales, type Locale } from '@/i18n/routing';

// Nav item definition. Dropdown items point to anchor IDs on the relevant
// section pages.
type NavItem = {
  key: string;
  href: string;
  dropdown?: { key: string; href: string }[];
};

const serviceAnchors = [
  'market-entry',
  'local-representation',
  'distributor-search',
  'b2b-matchmaking',
  'market-research',
  'business-development',
];

const sectorAnchors = [
  'construction',
  'machinery',
  'food-agriculture',
  'textile-apparel',
  'energy',
  'consumer-goods',
];

const navItems: NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  {
    key: 'services',
    href: '/services',
    dropdown: serviceAnchors.map((id) => ({
      key: `servicesDropdown.${id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`,
      href: `/services#${id}`,
    })),
  },
  { key: 'turkiyeToEurasia', href: '/turkiye-to-eurasia' },
  { key: 'eurasiaToTurkiye', href: '/eurasia-to-turkiye' },
  {
    key: 'sectors',
    href: '/sectors',
    dropdown: sectorAnchors.map((id) => ({
      key: `sectorsDropdown.${id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`,
      href: `/sectors/${id}`,
    })),
  },
  { key: 'contact', href: '/contact' },
];

export function Header({ locale, logoUrl }: { locale: Locale; logoUrl?: string }) {
  const t = useTranslations('nav');
  const tLang = useTranslations('languageSwitcher');
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const s = useSiteSettings();

  const isActive = (href: string) => {
    const clean = href.split('#')[0];
    if (clean === '/') return pathname === '/';
    return pathname === clean || pathname.startsWith(clean + '/');
  };

  const switchLocale = (next: Locale) => {
    router.replace(pathname, { locale: next });
    setMobileOpen(false);
    setLangOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);
  const toggleAccordion = (key: string) =>
    setOpenAccordion((cur) => (cur === key ? null : key));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray/10 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-container items-center justify-between gap-6 px-4 md:px-6">
        <Logo markImage={logoUrl || s?.logo || undefined} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 xl:flex">
          {navItems.map((item) => (
            <div key={item.key} className="group relative">
              <Link
                href={item.href}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:text-teal ${
                  isActive(item.href)
                    ? 'text-teal nav-underline-active'
                    : 'text-navy'
                }`}
              >
                {t(item.key)}
                {item.dropdown && (
                  <Icon name="ChevronDown" className="h-3.5 w-3.5" />
                )}
              </Link>
              {item.dropdown && (
                <div className="dropdown-panel absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.key}
                        href={sub.href}
                        className="block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm text-navy ring-2 ring-transparent transition-colors hover:bg-teal/5 hover:text-teal hover:ring-1 hover:ring-teal/30"
                      >
                        {t(sub.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side: compact language dropdown (lg+) + hamburger (mobile) */}
        <div className="flex shrink-0 items-center gap-4">
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded border border-gray/20 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:border-teal hover:text-teal"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={tLang('label')}
            >
              <FlagIcon locale={locale} className="h-3.5 w-5 rounded-sm" />
              <span>{tLang(locale)}</span>
              <Icon
                name="ChevronDown"
                className={`h-3.5 w-3.5 transition-transform ${
                  langOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {langOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close language menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute left-1/2 top-full z-50 mt-1.5 w-max min-w-[7.5rem] -translate-x-1/2 whitespace-nowrap overflow-hidden rounded-lg border border-gray/15 bg-white py-1 shadow-xl">
                  {locales.map((l) =>
                    l === locale ? null : (
                      <button
                        key={l}
                        type="button"
                        onClick={() => switchLocale(l)}
                        className="flex w-full items-center justify-start gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-teal/5 hover:text-teal"
                      >
                        <FlagIcon locale={l} className="h-3.5 w-5 shrink-0 rounded-sm" />
                        <span>{tLang(l)}</span>
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded p-2 text-navy hover:text-teal xl:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="Menu" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile slide-in panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy/50"
            onClick={closeMobile}
            aria-hidden="true"
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-navy shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Logo variant="dark" showTagline={false} markImage={logoUrl || s?.logo || undefined} />
              <button
                type="button"
                onClick={closeMobile}
                className="rounded p-2 text-white hover:text-teal"
                aria-label="Close menu"
              >
                <Icon name="X" className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.key}>
                    {item.dropdown ? (
                      <div className="rounded">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(item.key)}
                          className={`flex w-full items-center justify-between py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                            isActive(item.href)
                              ? 'text-teal'
                              : 'text-white hover:text-teal'
                          }`}
                        >
                          <span>{t(item.key)}</span>
                          <Icon
                            name="ChevronDown"
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openAccordion === item.key ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openAccordion === item.key && (
                          <ul className="mb-2 ml-3 flex flex-col gap-1 border-l border-white/10 pl-3">
                            {item.dropdown.map((sub) => (
                              <li key={sub.key}>
                                <Link
                                  href={sub.href}
                                  onClick={closeMobile}
                                  className="block py-2 text-sm text-white/80 hover:text-teal"
                                >
                                  {t(sub.key)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className={`block py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                          isActive(item.href)
                            ? 'text-teal'
                            : 'text-white hover:text-teal'
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Language switcher pinned at the bottom */}
            <div className="border-t border-white/10 px-5 py-4">
              <div className="flex items-center justify-around">
                {locales.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => switchLocale(l)}
                    className={`flex items-center gap-1.5 px-2 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      l === locale
                        ? 'text-teal nav-underline-active'
                        : 'text-white/80 hover:text-teal'
                    }`}
                  >
                    <FlagIcon locale={l} className="h-4 w-6 rounded-sm" />
                    <span>{tLang(l)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
