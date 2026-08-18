'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Icon } from './Icon';
import type { SiteSettings } from '@/lib/settings';

type SettingsFormProps = {
  initial: SiteSettings;
};

export function SettingsForm({ initial }: SettingsFormProps) {
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 3000);
  };

  const update = (key: keyof SiteSettings, value: string) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('save failed');
      showToast('success', 'Ayarlar kaydedildi.');
    } catch {
      showToast('error', 'Ayarlar kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload failed');
      const { path: uploaded } = (await res.json()) as { path: string };
      update('logo', uploaded);
      showToast('success', 'Logo yüklendi.');
    } catch {
      showToast('error', 'Logo yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const fields: { key: keyof SiteSettings; label: string; placeholder: string }[] = [
    { key: 'companyName', label: 'Şirket Adı', placeholder: 'Eurasia Business Gateway' },
    { key: 'tagline', label: 'Slogan', placeholder: 'Trade · Investment · Market Entry' },
    { key: 'officeAddress', label: 'Ofis Adresi', placeholder: 'İstanbul, Türkiye' },
    { key: 'officeEmail', label: 'Ofis E-postası', placeholder: 'info@example.com' },
    { key: 'phone', label: 'Telefon', placeholder: '+90 212 000 00 00' },
    { key: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://www.linkedin.com/company/...' },
    { key: 'mapEmbedUrl', label: 'Harita Gömme URL', placeholder: 'https://www.google.com/maps/embed?pb=... veya OpenStreetMap embed URL' },
    { key: 'footerCopyright', label: 'Altbilgi Telif Hakkı', placeholder: '© 2026 Eurasia Business Gateway. Tüm hakları saklıdır.' },
  ];

  const inputClass =
    'w-full rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal';

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-tight text-navy">
            Genel Ayarlar
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray">
            Site genel bilgileri
          </p>
        </div>
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
            'Ayarları Kaydet'
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Logo */}
        <section className="rounded-lg border border-gray/15 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
            Logo
          </h2>
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded border border-gray/20 bg-gray/10">
              {settings.logo ? (
                <Image
                  src={settings.logo}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-xs text-gray">
                  Varsayılan işaret
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file);
                  e.target.value = '';
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded border border-teal px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:bg-teal hover:text-white disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal/40 border-t-teal" />
                      Yükleniyor...
                    </>
                  ) : (
                    'Logo Yükle'
                  )}
                </button>
                {settings.logo && (
                  <button
                    type="button"
                    onClick={() => update('logo', '')}
                    className="inline-flex items-center gap-2 rounded border border-red-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-50"
                  >
                    Kaldır
                  </button>
                )}
              </div>
              <p className="mt-2 max-w-xs break-all text-xs text-gray">
                {settings.logo || 'Boş bırakılırsa yerleşik SVG işareti kullanılır.'}
              </p>
            </div>
          </div>
        </section>

        {/* Fields */}
        <section className="rounded-lg border border-gray/15 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
            İşletme Bilgileri
          </h2>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-sm font-semibold text-navy">
                  {f.label}
                </label>
                <input
                  type="text"
                  value={settings[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>

        {/* What this updates */}
        <section className="rounded-lg border border-gray/15 bg-teal/5 p-5 text-sm text-gray">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy">
            <Icon name="Info" className="h-4 w-4 text-teal" />
            Nerede kullanılır
          </h2>
          <p className="leading-relaxed">
            Adres, e-posta, telefon ve LinkedIn değerleri tüm sayfalardaki
            footer iletişim çubuğunu, iletişim sayfası bilgi kartını ve her iki
            yön sayfasındaki ofis kartını besler. Harita gömme URL, bu kartlarla
            birlikte gösterilen harita iframe&apos;ini (örn. Google Maps veya
            OpenStreetMap embed linki) belirler; boş bırakılırsa varsayılan
            embed kullanılır. Logo yüklendiğinde header ve footer&apos;daki
            yerleşik işaretin yerine geçer. Telif hakkı satırı footer&apos;ın
            varsayılanını değiştirir.
          </p>
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