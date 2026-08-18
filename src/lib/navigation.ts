import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n/routing';

// Locale-aware navigation helpers. These produce links that include the
// active locale prefix (e.g. /en/about, /tr/services) and keep the locale on
// programmatic router pushes.
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
