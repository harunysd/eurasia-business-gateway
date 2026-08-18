'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import type { SmtpSettings } from '@/lib/email';

type EmailSettingsFormProps = {
  initial: SmtpSettings | null;
  resendConfigured: boolean;
};

export function EmailSettingsForm({ initial, resendConfigured }: EmailSettingsFormProps) {
  const [settings, setSettings] = useState<SmtpSettings>(
    initial ?? {
      host: '',
      port: 587,
      secure: false,
      user: '',
      pass: '',
      fromEmail: '',
      fromName: '',
    },
  );
  const [testTo, setTestTo] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    type: 'success' | 'error' | 'info';
    msg: string;
  } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 3000);
  };

  const update = <K extends keyof SmtpSettings>(key: K, value: SmtpSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const onSave = async () => {
    if (!settings.host.trim() && !settings.user.trim()) {
      setTestStatus({
        type: 'info',
        msg: 'Boş kaydedildi — e-posta gönderimi Resend yedeğini kullanacak (yapılandırılmışsa).',
      });
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/email', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('save failed');
      showToast('success', 'E-posta ayarları kaydedildi.');
    } catch {
      showToast('error', 'E-posta ayarları kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const onTest = async () => {
    if (!testTo.trim()) {
      setTestStatus({ type: 'error', msg: 'Önce alıcı e-posta adresini girin.' });
      return;
    }
    setTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch('/api/admin/settings/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testTo.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'test failed');
      setTestStatus({
        type: 'success',
        msg: `Test e-postası ${data.provider} üzerinden gönderildi. ${testTo.trim()} adresindeki gelen kutusunu kontrol edin.`,
      });
    } catch (err) {
      setTestStatus({
        type: 'error',
        msg: err instanceof Error ? err.message : 'Test e-postası gönderilemedi.',
      });
    } finally {
      setTesting(false);
    }
  };

  const inputClass =
    'w-full rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal';

  const field = (label: string, key: keyof SmtpSettings, type: string = 'text', placeholder = '') => (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy">{label}</label>
      <input
        type={type}
        value={String(settings[key])}
        onChange={(e) =>
          update(key, key === 'port' ? Number(e.target.value) : e.target.value)
        }
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-tight text-navy">
            E-posta Ayarları
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray">
            Yanıtlar ve test e-postaları için SMTP taşıyıcısı
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
        <section className="rounded-lg border border-gray/15 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
            SMTP Sunucusu
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field('Sunucu (Host)', 'host', 'text', 'smtp.yourprovider.com')}
              {field('Port', 'port', 'number', '587')}
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-navy">
              <input
                type="checkbox"
                checked={settings.secure}
                onChange={(e) => update('secure', e.target.checked)}
                className="h-4 w-4 accent-teal"
              />
              SSL / TLS kullan (genellikle 465 portuyla)
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field('Kullanıcı adı', 'user', 'text', 'you@example.com')}
              {field('Şifre / Uygulama şifresi', 'pass', 'password', '••••••••')}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray/15 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
            Gönderen Bilgileri
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field('Gönderen adı', 'fromName', 'text', 'Eurasia Business Gateway')}
              {field('Gönderen e-postası (boş bırakılırsa kullanıcı adı kullanılır)', 'fromEmail', 'text', 'info@eurasiabusinessgateway.com')}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray/15 bg-teal/5 p-5 text-sm text-gray">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy">
            <Icon name="Info" className="h-4 w-4 text-teal" />
            Yedek
          </h2>
          <p className="leading-relaxed">
            {resendConfigured
              ? 'Bir Resend API anahtarı mevcut; SMTP boş bırakılırsa yanıtlar RESEND_API_KEY kullanır.'
              : 'RESEND_API_KEY tanımlı değil. SMTP boş bırakılırsa mesajlara yanıt verilemez — önce buradan bir taşıyıcı yapılandırın.'}
          </p>
        </section>

        <section className="rounded-lg border border-gray/15 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
            Test e-postası gönder
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="recipient@example.com"
              className={inputClass}
            />
            <button
              type="button"
              onClick={onTest}
              disabled={testing}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-navy px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-teal disabled:opacity-70"
            >
              {testing ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Gönderiliyor...
                </>
              ) : (
                'Test E-postası'
              )}
            </button>
          </div>
          {testStatus && (
            <p
              className={`mt-3 rounded px-3 py-2 text-sm ${
                testStatus.type === 'success'
                  ? 'bg-teal/10 text-teal'
                  : testStatus.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray/10 text-gray'
              }`}
            >
              {testStatus.msg}
            </p>
          )}
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