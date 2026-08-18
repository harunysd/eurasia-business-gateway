'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import type { SectorRecord } from '@/lib/sectors';
import type { Locale } from '@/i18n/routing';

// Admin sector manager. Lists sectors, allows creating, deleting and
// reordering them. Editing happens on the dedicated editor page.
export function SectorsManager({ basePath }: { basePath: string }) {
  const [items, setItems] = useState<SectorRecord[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/sectors', { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const data = (await res.json()) as { sectors: SectorRecord[] };
      setItems(data.sectors);
    } catch {
      setError('Sektörler yüklenemedi.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/sectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: {} }),
      });
      if (!res.ok) throw new Error('create failed');
      const data = (await res.json()) as { sector: SectorRecord };
      window.location.href = `${basePath}/${data.sector.id}`;
    } catch {
      setError('Yeni sektör oluşturulamadı.');
      setBusy(false);
    }
  };

  const reorder = async (index: number, delta: number) => {
    if (!items) return;
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const a = next[index];
    const b = next[target];
    next[index] = { ...b, order: a.order };
    next[target] = { ...a, order: b.order };
    setItems(next);

    for (const s of next) {
      await fetch(`/api/admin/sectors/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: s.order }),
      });
    }
  };

  const remove = async (s: SectorRecord) => {
    if (!window.confirm(`"${s.slug}" sektörünü silmek istediğinize emin misiniz?`)) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/sectors/${s.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      await load();
    } catch {
      setError('Sektör silinemedi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-tight text-navy">
            Sektörler
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray">
            İkon, başlık ve açıklamaları yönetin
          </p>
        </div>
        <button
          type="button"
          onClick={create}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded bg-teal px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-70"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Yeni Sektör
        </button>
      </header>

      {error && (
        <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {items === null && !error && <p className="text-sm text-gray">Yükleniyor...</p>}

      {items && items.length === 0 && (
        <div className="rounded-lg border border-gray/15 bg-white p-10 text-center shadow-sm">
          <Icon name="BarChart3" className="mx-auto h-10 w-10 text-gray/40" />
          <p className="mt-4 text-sm text-gray">
            Henüz sektör eklenmemiş. &quot;Yeni Sektör&quot; butonuyla başlayın.
            Sektörler eklendiğinde ana sitedeki sektör kartları otomatik olarak bu
            veriden oluşturulur.
          </p>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray/15 bg-white shadow-sm">
          <ul className="divide-y divide-gray/10">
            {items.map((s, i) => (
              <li key={s.id} className="flex items-center gap-4 px-5 py-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold uppercase tracking-tight text-navy">
                    {s.content.en.title || s.slug}
                  </div>
                  <div className="truncate text-xs text-gray">
                    /sectors/{s.slug} · sıra: {s.order}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => reorder(i, -1)}
                    disabled={i === 0}
                    className="rounded p-1.5 text-gray transition-colors hover:bg-gray/10 hover:text-navy disabled:opacity-30"
                    aria-label="Yukarı taşı"
                    title="Yukarı taşı"
                  >
                    <Icon name="ArrowUp" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reorder(i, 1)}
                    disabled={i === items.length - 1}
                    className="rounded p-1.5 text-gray transition-colors hover:bg-gray/10 hover:text-navy disabled:opacity-30"
                    aria-label="Aşağı taşı"
                    title="Aşağı taşı"
                  >
                    <Icon name="ArrowDown" className="h-4 w-4" />
                  </button>
                  <a
                    href={`${basePath}/${s.id}`}
                    className="rounded p-1.5 text-gray transition-colors hover:bg-teal/10 hover:text-teal"
                    aria-label="Düzenle"
                    title="Düzenle"
                  >
                    <Icon name="Pencil" className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(s)}
                    disabled={busy}
                    className="rounded p-1.5 text-gray transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                    aria-label="Sil"
                    title="Sil"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
