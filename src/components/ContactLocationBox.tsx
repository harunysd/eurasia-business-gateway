import { Icon } from './Icon';

// Shared office card + map block used on the contact page and both direction
// pages. Renders a navy contact card (with a themed MapPin icon instead of a
// logo) above an embedded map. The root is a full-height flex column so the
// map area grows/shrinks to match the neighbouring form column height.
//
// `mapEmbedUrl` comes from the admin "Genel Ayarlar" page; when empty a
// default OpenStreetMap embed for the İstanbul office is used.
const DEFAULT_MAP_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=28.9208,40.9825,29.0421,41.0331&layer=mapnik&marker=41.0082,28.9784';

export function ContactLocationBox({
  title,
  address,
  email,
  phone,
  linkedinLabel,
  linkedinUrl,
  mapEmbedUrl,
}: {
  title: string;
  address: string;
  email: string;
  phone: string;
  linkedinLabel?: string;
  linkedinUrl?: string;
  mapEmbedUrl?: string;
}) {
  return (
    <div className="flex h-full flex-col gap-6">
      {/* Contact info card */}
      <div className="rounded-xl bg-navy p-8 text-white">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal/15 text-teal">
            <Icon name="MapPin" className="h-6 w-6" />
          </span>
          <h3 className="text-lg font-bold uppercase tracking-tight">{title}</h3>
        </div>
        <ul className="space-y-5 text-sm">
          <li className="flex items-start gap-4">
            <Icon name="MapPin" className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
            <span className="text-white/85">{address}</span>
          </li>
          <li>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 text-white/85 transition-colors hover:text-teal"
            >
              <Icon name="Mail" className="h-5 w-5 shrink-0 text-teal" />
              {email}
            </a>
          </li>
          <li>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-4 text-white/85 transition-colors hover:text-teal"
            >
              <Icon name="Phone" className="h-5 w-5 shrink-0 text-teal" />
              {phone}
            </a>
          </li>
          {linkedinLabel && linkedinUrl && (
            <li>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-white/85 transition-colors hover:text-teal"
              >
                <Icon name="Linkedin" className="h-5 w-5 shrink-0 text-teal" />
                {linkedinLabel}
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Map — flex-1 so it fills the remaining column height */}
      <div className="min-h-64 flex-1 overflow-hidden rounded-xl border border-gray-100 shadow-sm ring-1 ring-black/5">
        <iframe
          title={title}
          src={mapEmbedUrl || DEFAULT_MAP_EMBED}
          className="h-full w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
