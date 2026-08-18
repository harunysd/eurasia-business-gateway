import Image from 'next/image';
import { FadeIn } from './animations';

// A reusable hero banner for inner pages (about, services, sectors, contact,
// privacy, terms). Full-bleed photo with a navy overlay, a small uppercase
// label, a large bold uppercase title, and an optional subtitle.
export function SectionHero({
  label,
  title,
  subtitle,
  image,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  image: string;
}) {
  return (
    <section className="relative flex min-h-[36vh] items-center justify-center overflow-hidden py-16 md:min-h-[52vh] md:py-24">
      {/* Background photo with navy overlay. Placeholder Unsplash URLs are
          used here — swap via the admin panel before launch. */}
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-navy/70" />
      <div className="absolute inset-0 dotted-globe-pattern opacity-30" />
      {/* Decorative curved arc-line overlay. */}
      <svg
        className="absolute inset-x-0 bottom-0 h-24 w-full text-teal/30"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 60 Q600 0 1200 60"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-container px-4 text-center md:px-6">
        {label && (
          <FadeIn delay={0}>
            <span className="mb-4 block text-sm font-semibold uppercase tracking-[0.2em] text-teal">
              {label}
            </span>
          </FadeIn>
        )}
        <FadeIn delay={0.1}>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
            {title}
          </h1>
        </FadeIn>
        {subtitle && (
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {subtitle}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
