import { Icon } from './Icon';
import { Link } from '@/lib/navigation';

// Compact service icon card used on the home page grid. Links to the matching
// services section anchor and lifts on hover.
export function ServiceCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col items-start rounded-lg border border-gray/15 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
    >
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-white sm:mb-5 sm:h-12 sm:w-12">
        <Icon name={icon} className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
      <h3 className="mb-2 text-lg font-bold uppercase tracking-tight text-navy">
        {title}
      </h3>
      <p className="text-sm leading-normal text-gray sm:leading-relaxed">{description}</p>
    </Link>
  );
}
