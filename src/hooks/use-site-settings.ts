'use client';

import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/lib/settings';

// Hydrates global site settings client-side. Returns null until the first
// fetch resolves so components can render with their existing fallback
// values without causing a hydration mismatch.
export function useSiteSettings(): SiteSettings | null {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/site-settings', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { settings?: SiteSettings } | null) => {
        if (!cancelled && data?.settings) setSettings(data.settings);
      })
      .catch(() => {
        /* keep fallback values */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}