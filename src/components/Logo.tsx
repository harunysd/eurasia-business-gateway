import { Link } from '@/lib/navigation';

// Reusable logo: a dotted world-map globe circle (teal + navy dots) with two
// overlapping trapezoid "skyscraper" silhouettes in front (left navy, right
// teal, different heights) and a curved horizon line beneath. To the right,
// the stacked wordmark "EURASIA" (navy) over "BUSINESS GATEWAY" (teal) and a
// gray caps tagline "TRADE · INVESTMENT · MARKET ENTRY".
//
// Wordmark text is hardcoded in uppercase (no CSS `uppercase` dependency) so
// Turkish locales cannot transform the dotLESS "I" into a dotted "İ" —
// the brand renders as BUSINESS / EURASIA in every language.
//
// Variants:
//  - "light" (default): navy/teal wordmark on light backgrounds (header).
//  - "dark":            white/lightTeal wordmark on navy backgrounds (footer,
//                      mobile menu, hero overlays).
export function Logo({
  variant = 'light',
  className = '',
  showTagline = false,
  markImage,
}: {
  variant?: 'light' | 'dark';
  className?: string;
  showTagline?: boolean;
  markImage?: string;
}) {
  const wordmarkPrimary =
    variant === 'dark' ? 'text-white' : 'text-navy';
  const wordmarkSecondary =
    variant === 'dark' ? 'text-lightTeal' : 'text-teal';
  const tagline = variant === 'dark' ? 'text-white/60' : 'text-gray';

  return (
    <Link
      href="/"
      aria-label="Eurasia Business Gateway — home"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      {markImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={markImage}
          alt=""
          className="h-10 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <LogoMark className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:scale-105" />
      )}
      <span className="flex flex-col leading-none">
        <span
          className={`font-extrabold uppercase tracking-tight text-base ${wordmarkPrimary}`}
        >
          EURASIA
        </span>
        <span
          className={`font-extrabold uppercase tracking-tight text-xs ${wordmarkSecondary}`}
        >
          BUSINESS GATEWAY
        </span>
        {showTagline && (
          <span
            className={`mt-1 text-[9px] font-medium uppercase tracking-[0.18em] ${tagline}`}
          >
            TRADE · INVESTMENT · MARKET ENTRY
          </span>
        )}
      </span>
    </Link>
  );
}

// The SVG mark itself, exported separately so it can be reused as a favicon
// asset and embedded without the wordmark when needed.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Dotted world-map globe circle. */}
      <circle cx="24" cy="20" r="15" stroke="#169AA5" strokeWidth="1.2" opacity="0.55" />
      {[
        [18, 12], [24, 11], [30, 12], [16, 16], [22, 15], [28, 15], [34, 16],
        [14, 20], [20, 19], [26, 19], [32, 19], [16, 24], [22, 23], [28, 23],
        [34, 24], [18, 28], [24, 27], [30, 28], [21, 31], [27, 31],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="1.05"
          fill={i % 2 === 0 ? '#169AA5' : '#0B1D3A'}
          opacity="0.85"
        />
      ))}

      {/* Two overlapping trapezoid "skyscraper" silhouettes. Left navy,
          right teal, different heights. */}
      <path d="M16 36 L19 17 L23 17 L20 36 Z" fill="#0B1D3A" />
      <path d="M22 36 L26 22 L31 22 L27 36 Z" fill="#169AA5" />

      {/* Curved horizon line beneath connecting them. */}
      <path
        d="M8 38 Q24 33 40 38"
        stroke="#169AA5"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M10 41 Q24 37 38 41"
        stroke="#0B1D3A"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
