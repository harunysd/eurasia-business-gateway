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
      className="group flex h-full flex-col items-start rounded-lg border border-gray/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-white">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mb-2 text-lg font-bold uppercase tracking-tight text-navy">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-gray">{description}</p>
    </Link>
  );
}
