import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'tr', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/services': '/services',
  '/turkiye-to-eurasia': '/turkiye-to-eurasia',
  '/eurasia-to-turkiye': '/eurasia-to-turkiye',
  '/sectors': '/sectors',
  '/contact': '/contact',
  '/privacy': '/privacy',
  '/terms': '/terms',
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  pathnames,
});
