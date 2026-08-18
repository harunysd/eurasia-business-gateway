import { Button } from './Button';
import { FadeInOnScroll } from './animations';

// Reusable closing CTA band used at the bottom of most pages. Navy
// background, centered heading + paragraph + button.
export function CtaBand({
  heading,
  paragraph,
  buttonText,
  href,
}: {
  heading: string;
  paragraph: string;
  buttonText: string;
  href: string;
}) {
  return (
    <FadeInOnScroll>
    <section className="bg-navy">
      <div className="mx-auto max-w-container px-4 py-12 text-center md:px-6 md:py-20">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white md:text-3xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-lightTeal">
          {paragraph}
        </p>
        <div className="mt-8">
          <Button href={href} variant="primary" size="lg">
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
    </FadeInOnScroll>
  );
}
