'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from './Icon';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type Errors = {
  name?: string;
  email?: string;
  message?: string;
};

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field as keyof Errors]) {
        setErrors((er) => ({ ...er, [field]: undefined }));
      }
    };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = t('nameError');
    if (!form.email.trim() || !validateEmail(form.email.trim()))
      next.email = t('emailError');
    if (!form.message.trim()) next.message = t('messageError');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      setForm({ name: '', email: '', company: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-teal/30 bg-teal/5 p-8 text-center">
        <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white">
          <Icon name="ShieldCheck" className="h-6 w-6" />
        </span>
        <h3 className="text-xl font-bold uppercase tracking-tight text-navy">
          {t('successTitle')}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray">{t('successText')}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 inline-flex items-center justify-center border-2 border-navy px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-white"
        >
          {t('submit')}
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full rounded border px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal';
  const okBorder = 'border-gray/30 bg-white';
  const errBorder = 'border-red-500 bg-red-50';

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-navy">
          {t('nameLabel')} <span className="text-teal">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={update('name')}
          placeholder={t('namePlaceholder')}
          className={`${inputClass} ${errors.name ? errBorder : okBorder}`}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-navy">
          {t('emailLabel')} <span className="text-teal">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={update('email')}
          placeholder={t('emailPlaceholder')}
          className={`${inputClass} ${errors.email ? errBorder : okBorder}`}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-semibold text-navy">
            {t('companyLabel')}
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={update('company')}
            placeholder={t('companyPlaceholder')}
            className={`${inputClass} ${okBorder}`}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-navy">
            {t('phoneLabel')}
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder={t('phonePlaceholder')}
            className={`${inputClass} ${okBorder}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-navy">
          {t('messageLabel')} <span className="text-teal">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={update('message')}
          placeholder={t('messagePlaceholder')}
          className={`${inputClass} ${errors.message ? errBorder : okBorder} resize-y`}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      {status === 'error' && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          <strong className="block font-semibold">{t('errorTitle')}</strong>
          <span>{t('errorText')}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-2 bg-teal px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            {t('submitting')}
          </>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  );
}
