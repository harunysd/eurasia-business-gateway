import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { editablePages, type EditablePage } from '@/lib/content';
import type { Locale } from '@/i18n/routing';

// Admin dashboard. Lists every editable page; clicking one opens its editor.
// The Sectors card opens the dedicated CMS manager instead of the generic
// JSON editor, because sector cards now live in the database.
type Params = { locale: Locale };

const pageMeta: Record<
  EditablePage,
  { title: string; description: string; icon: string }
> = {
  home: {
    title: 'Ana Sayfa',
    description: 'Hero, hizmet kartları ve yön CTA\'ları.',
    icon: 'Globe',
  },
  about: {
    title: 'Hakkımızda',
    description: 'Kim olduğumuz, misyon, vizyon ve neden biz.',
    icon: 'Users',
  },
  services: {
    title: 'Hizmetler',
    description: 'Adımlar ve görsellerle altı hizmet detay bölümü.',
    icon: 'Handshake',
  },
  sectors: {
    title: 'Sektörler',
    description: 'Sektör kartlarını, ikonlarını, başlıklarını ve açıklamalarını yönetin.',
    icon: 'BarChart3',
  },
  'turkiye-to-eurasia': {
    title: 'Türkiye → Avrasya',
    description: 'Giriş, kapsanan pazarlar, süreç ve kapanış CTA.',
    icon: 'TrendingUp',
  },
  'eurasia-to-turkiye': {
    title: 'Avrasya → Türkiye',
    description: 'Giriş, neden Türkiye, süreç ve kapanış CTA.',
    icon: 'MapPin',
  },
  contact: {
    title: 'İletişim',
    description: 'İletişim sayfası hero, form metinleri ve bilgi kartı.',
    icon: 'Mail',
  },
};

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-navy">
          İçerik Düzenleyici
        </h1>
        <p className="mt-2 text-sm text-gray">
          Düzenlemek istediğiniz sayfayı seçin. Metin ve görseller üç dilde de
          güncellenebilir.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {editablePages.map((page) => {
          const meta = pageMeta[page];
          const isSectors = page === 'sectors';
          const href = isSectors
            ? `/${locale}/admin/sectors`
            : `/${locale}/admin/edit/${page}`;
          return (
            <Link
              key={page}
              href={href}
              className="group flex items-start gap-4 rounded-lg border border-gray/15 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-md"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-white">
                <Icon name={meta.icon} className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-bold uppercase tracking-tight text-navy">
                  {meta.title}
                </h2>
                <p className="mt-1 text-sm text-gray">{meta.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
