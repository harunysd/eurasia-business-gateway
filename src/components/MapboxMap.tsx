'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox-backed office map used inside ContactLocationBox. Renders a clean
// light map with a custom teal pin so the map matches the site's look.
// Requires a Mapbox access token (admin "Genel Ayarlar" > Harita); without a
// token the caller falls back to another provider.
export function MapboxMap({
  token,
  lat,
  lng,
  label,
}: {
  token: string;
  lat: number;
  lng: number;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !token) return;

    const map = new mapboxgl.Map({
      container: el,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: 15,
      attributionControl: true,
      dragRotate: false,
      pitchWithRotate: false,
    });
    mapRef.current = map;

    const pin = document.createElement('div');
    pin.className = 'ebg-map-pin';
    pin.innerHTML = `
      <svg width="46" height="56" viewBox="0 0 46 56" fill="none" xmlns="http://www.w3.org/2000/svg"
           style="filter: drop-shadow(0 4px 8px rgba(11,29,58,0.35)); display:block">
        <path d="M23 2C11.4 2 2 11.1 2 22.4 2 37.4 23 54 23 54S44 37.4 44 22.4C44 11.1 34.6 2 23 2Z"
              fill="#169AA5" stroke="#FFFFFF" stroke-width="3"/>
        <circle cx="23" cy="22" r="8" fill="#0B1D3A"/>
      </svg>`;

    new mapboxgl.Marker({ element: pin, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map);

    if (label) {
      new mapboxgl.Marker({
        element: (() => {
          const d = document.createElement('div');
          d.className =
            'mb-1 rounded-md bg-navy px-2.5 py-1 text-xs font-semibold text-white shadow-lg';
          d.textContent = label;
          return d;
        })(),
        anchor: 'bottom',
        offset: [0, 8],
      })
        .setLngLat([lng, lat])
        .addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token, lat, lng, label]);

  return <div ref={containerRef} className="h-full w-full" />;
}