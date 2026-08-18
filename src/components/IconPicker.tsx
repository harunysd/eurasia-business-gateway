'use client';

import { useState } from 'react';
import { Icon, iconNames } from './Icon';

// Reusable icon picker used by the Sector editor and page editor. A small
// button shows the current icon and opens a modal grid of every icon.
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
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
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
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
              {iconNames.map((name) => {
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
          </div>
        </div>
      )}
    </div>
  );
}
