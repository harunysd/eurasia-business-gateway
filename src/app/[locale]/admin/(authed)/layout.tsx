import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/Icon';
import { SignOutButton } from '@/components/SignOutButton';
import type { Locale } from '@/i18n/routing';

// Admin sidebar chrome for all authenticated admin pages. The login page
// lives outside this route group so it gets a full-screen layout instead.
type Params = { locale: string };

const navItems = [
  { href: 'admin', label: 'Sayfalar', icon: 'Globe', exact: true },
  { href: 'admin/messages', label: 'Mesajlar', icon: 'Mail', exact: false },
  { href: 'admin/settings', label: 'Genel Ayarlar', icon: 'Settings', exact: true },
  {
    href: 'admin/settings/email',
    label: 'E-posta Ayarları',
    icon: 'MailPlus',
    exact: false,
  },
];

export default async function AdminAuthedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const s = await getSiteSettings();

  return (
    <div className="flex min-h-screen bg-gray/5">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy text-white">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <Logo
            variant="dark"
            markImage={s.logo || '/logo2.png'}
            showTagline={false}
          />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}/${item.href}`}
              className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Icon name={item.icon} className="h-4 w-4 text-teal" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Hazırlayan
          </p>
          <p className="mt-1 text-xs font-medium text-white/70">
            Harun Yasir SARIDAŞ
          </p>
          <a
            href="mailto:harunysd@gmail.com"
            className="mt-0.5 block text-xs text-teal/70 transition-colors hover:text-teal"
          >
            harunysd@gmail.com
          </a>
        </div>

        <div className="border-t border-white/10 p-3">
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex-1">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
