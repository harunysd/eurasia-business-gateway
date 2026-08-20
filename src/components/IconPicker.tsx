'use client';

import { useMemo, useState } from 'react';
import { Icon, iconCategories, iconNames, type IconName } from './Icon';

// Reusable icon picker used by the Sector editor and page editor. A small
// button shows the current icon and opens a modal with a searchable,
// category-filtered grid of every icon.
export function IconPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('Tümü');

  const allNames = iconNames;

  const categoryNames = useMemo(() => {
    if (category === 'Tümü') return allNames;
    const found = iconCategories.find((c) => c.label === category);
    return found ? found.names : allNames;
  }, [category, allNames]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categoryNames;
    return categoryNames.filter((n) => n.toLowerCase().includes(q));
  }, [categoryNames, query]);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
          <Icon name={value} className="h-5 w-5" />
        </span>
        <input
          type="text"
          value={value}
          readOnly
          onClick={() => setOpen(true)}
          className="w-full rounded border border-gray/30 px-3 py-2 text-sm capitalize text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded border border-teal px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:bg-teal hover:text-white"
        >
          Seç
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray/10 px-6 py-4">
              <h3 className="text-base font-bold uppercase tracking-tight text-navy">
                İkon seçin
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-gray hover:text-navy"
                aria-label="Kapat"
              >
                <Icon name="X" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 px-6 pt-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="İkon ara..."
                className="w-full rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
              <div className="flex flex-wrap gap-1.5">
                {['Tümü', ...iconCategories.map((c) => c.label)].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                      category === cat
                        ? 'border-teal bg-teal text-white'
                        : 'border-gray/20 text-gray hover:border-teal/40 hover:text-navy'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray">
                  Sonuç bulunamadı.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
                  {filtered.map((name: IconName) => {
                    const active = name === value;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          onChange(name);
                          setOpen(false);
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded border p-2 text-xs transition-colors ${
                          active
                            ? 'border-teal bg-teal/10 text-teal'
                            : 'border-gray/10 text-gray hover:border-teal/40 hover:text-navy'
                        }`}
                      >
                        <Icon name={name} className="h-5 w-5" />
                        <span className="capitalize">{name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}