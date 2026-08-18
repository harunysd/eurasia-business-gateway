'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from './Icon';
import { IconPicker } from './IconPicker';
import { locales, type Locale } from '@/i18n/routing';
import type { SectorContent, SectorRecord } from '@/lib/sectors';

const localeLabels: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  ru: 'Русский',
};

type EditorForm = {
  slug: string;
  icon: string;
  image: string;
  order: number;
  content: Record<Locale, SectorContent>;
};

function toForm(initial: SectorRecord): EditorForm {
  return {
    slug: initial.slug,
    icon: initial.icon,
    image: initial.image,
    order: initial.order,
    content: initial.content,
  };
}

const inputClass =
  'w-full rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal';

// Admin editor for a single sector. Localized copy is entered per-language
// with tabs, so all three languages can be filled from one screen.
export function SectorEditor({
  id,
  initial,
}: {
  id: string;
  initial: SectorRecord;
}) {
  const [form, setForm] = useState<EditorForm>(() => toForm(initial));
  const [locale, setLocale] = useState<Locale>('tr');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 3000);
  };

  const updateLocalized = (
    key: keyof SectorContent,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      content: {
        ...f.content,
        [locale]: { ...f.content[locale], [key]: value },
      },
    }));
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload failed');
      const { path } = (await res.json()) as { path: string };
      setForm((f) => ({ ...f, image: path }));
      showToast('success', 'Görsel yüklendi.');
    } catch {
      showToast('error', 'Görsel yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!form.slug.trim()) {
      showToast('error', 'Slug alanı boş olamaz.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sectors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'save failed');
      showToast('success', 'Sektör kaydedildi.');
    } catch (err) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'Sektör kaydedilemedi.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-tight text-navy">
            Sektör Düzenle
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray">
            /sectors/{form.slug || '...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/sectors/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border-2 border-navy px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <Icon name="Eye" className="h-4 w-4" />
            Önizle
          </a>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded bg-teal px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-70"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Kaydediliyor...
              </>
            ) : (
              'Değişiklikleri Kaydet'
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Global fields */}
        <section className="rounded-lg border border-gray/15 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
            Genel Bilgiler
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy">
                Slug (URL)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="construction"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy">
                Sıra
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4">
            <IconPicker
              label="İkon"
              value={form.icon}
              onChange={(name) => setForm((f) => ({ ...f, icon: name }))}
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-semibold text-navy">
              Görsel (Kart &amp; kapak)
            </label>
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded border border-gray/20 bg-gray/10">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-xs text-gray">
                    Görsel yok
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-navy">
                  Dosya seç
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="sector-image-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(file);
                    e.target.value = '';
                  }}
                />
                <label
                  htmlFor="sector-image-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded border border-teal px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:bg-teal hover:text-white disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal/40 border-t-teal" />
                      Yükleniyor...
                    </>
                  ) : (
                    'Görsel Yükle'
                  )}
                </label>
                <p className="mt-2 max-w-xs break-all text-xs text-gray">
                  {form.image || 'Boş bırakılırsa kartta görsel olmaz.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Language tabs */}
        <div className="flex gap-2 border-b border-gray/20">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
                l === locale
                  ? 'border-teal text-teal'
                  : 'border-transparent text-gray hover:text-navy'
              }`}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>

        {/* Localized fields */}
        <section className="rounded-lg border border-gray/15 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
            İçerik — {localeLabels[locale]}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy">
                Başlık
              </label>
              <input
                type="text"
                value={form.content[locale].title}
                onChange={(e) => updateLocalized('title', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy">
                Kısa Açıklama (kartta görünür)
              </label>
              <textarea
                rows={3}
                value={form.content[locale].description}
                onChange={(e) => updateLocalized('description', e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy">
                Uzun Açıklama (detay sayfası)
              </label>
              <textarea
                rows={8}
                value={form.content[locale].longDescription}
                onChange={(e) => updateLocalized('longDescription', e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-teal text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
