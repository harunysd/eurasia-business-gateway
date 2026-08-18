import { GB as GBFlag, TR as TRFlag, RU as RUFlag } from 'country-flag-icons/react/3x2';
import type { Locale } from '@/i18n/routing';

// Renders a proper SVG flag icon for the given locale. Using
// country-flag-icons (SVG) instead of emoji flags because emoji regional
// indicator sequences don't render on Windows.
const flags: Record<Locale, React.ComponentType<{ className?: string }>> = {
  en: GBFlag,
  tr: TRFlag,
  ru: RUFlag,
};

export function FlagIcon({
  locale,
  className = '',
}: {
  locale: Locale;
  className?: string;
}) {
  const Flag = flags[locale];
  return <Flag className={className} />;
}
