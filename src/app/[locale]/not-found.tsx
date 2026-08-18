'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

// Locale-aware 404 page. Rendered within the next-intl client provider so it
// can use translated text. Full navy background with a large teal "404".
export default function NotFound() {
  const t = useTranslations('common');
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy">
      {/* Faint dotted overlay for brand consistency. */}
      <div className="absolute inset-0 dotted-globe-pattern opacity-20" />
      <svg
        className="absolute inset-x-0 bottom-10 h-32 w-full text-teal/25"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 80 Q600 0 1200 80" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>

      <div className="relative z-10 px-4 text-center">
        <p className="text-[7rem] font-extrabold leading-none tracking-tight text-teal sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
          {t('notFoundTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-lightTeal">
          {t('notFoundText')}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center border-2 border-white px-8 py-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-navy"
        >
          {t('backToHome')}
        </Link>
      </div>
    </section>
  );
}
