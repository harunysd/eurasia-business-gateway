import { Link } from '@/lib/navigation';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'outlineWhite' | 'white' | 'dark';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wide transition-colors duration-300 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2';

const variants: Record<Variant, string> = {
  primary: 'bg-teal text-white hover:bg-navy',
  dark: 'bg-navy text-white hover:bg-teal',
  outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-white',
  outlineWhite:
    'border-2 border-white text-white hover:bg-white hover:text-navy',
  white: 'bg-white text-teal hover:bg-navy hover:text-white',
};

const sizes: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
} & Omit<ComponentProps<typeof Link>, 'href' | 'children'>;

// A single button component used across all pages. It always renders as a
// next-intl <Link> so locale prefixes are preserved automatically, unless
// `external` is set (e.g. for LinkedIn / mailto / tel links).
export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  external = false,
  ...rest
}: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(rest as Record<string, unknown>)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
