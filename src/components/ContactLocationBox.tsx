import { Icon } from './Icon';
import { MapboxMap } from './MapboxMap';
import type { SiteSettings } from '@/lib/settings';

// Shared office card + map block used on the contact page and both direction
// pages. Renders a navy contact card (with a themed MapPin icon instead of a
// logo) above an embedded map. The root is a full-height flex column so the
// map area grows/shrinks to match the neighbouring form column height.
//
// Map rendering is driven by the admin "Genel Ayarlar" > Harita settings:
//  - `mapEmbedUrl` set        → the custom iframe URL is used verbatim
//  - `mapProvider = "google"` → free Google Maps embed (no API key needed)
//  - `mapProvider = "mapbox"` → Mapbox GL with a site-themed teal pin
//  - otherwise                → OpenStreetMap embed (default)
const DEFAULT_PIN_LAT = 41.0082;
const DEFAULT_PIN_LNG = 28.9784;

type MapSettings = Pick<
  SiteSettings,
  'mapProvider' | 'mapLat' | 'mapLng' | 'mapboxToken' | 'mapEmbedUrl'
>;

function osmEmbedUrl(lat: number, lng: number) {
  return (
    'https://www.openstreetmap.org/export/embed.html?bbox=' +
    `${lng - 0.012},${lat - 0.006},${lng + 0.012},${lat + 0.006}` +
    `&layer=mapnik&marker=${lat},${lng}`
  );
}

function googleEmbedUrl(lat: number, lng: number) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

function renderMap(
  title: string,
  map: MapSettings,
): React.ReactNode {
  if (map.mapEmbedUrl) {
    return (
      <iframe
        title={title}
        src={map.mapEmbedUrl}
        className="h-full w-full"
        loading="lazy"
      />
    );
  }
  const lat = map.mapLat ?? DEFAULT_PIN_LAT;
  const lng = map.mapLng ?? DEFAULT_PIN_LNG;

  if (map.mapProvider === 'google') {
    return (
      <iframe
        title={title}
        src={googleEmbedUrl(lat, lng)}
        className="h-full w-full"
        loading="lazy"
      />
    );
  }
  if (map.mapProvider === 'mapbox' && map.mapboxToken) {
    return <MapboxMap token={map.mapboxToken} lat={lat} lng={lng} label={title} />;
  }
  return (
    <iframe
      title={title}
      src={osmEmbedUrl(lat, lng)}
      className="h-full w-full"
      loading="lazy"
    />
  );
}

export function ContactLocationBox({
  title,
  address,
  email,
  phone,
  linkedinLabel,
  linkedinUrl,
  map,
}: {
  title: string;
  address: string;
  email: string;
  phone: string;
  linkedinLabel?: string;
  linkedinUrl?: string;
  map?: Partial<MapSettings>;
}) {
  const mapSettings: MapSettings = {
    mapProvider: map?.mapProvider ?? 'osm',
    mapLat: map?.mapLat ?? null,
    mapLng: map?.mapLng ?? null,
    mapboxToken: map?.mapboxToken ?? '',
    mapEmbedUrl: map?.mapEmbedUrl ?? '',
  };
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
        {renderMap(title, mapSettings)}
      </div>
    </div>
  );
}
