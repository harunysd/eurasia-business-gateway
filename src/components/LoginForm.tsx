'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/Icon';
import { useSiteSettings } from '@/hooks/use-site-settings';

// Client login form. Uses next-auth's signIn with the credentials provider.
// On success it redirects to the admin dashboard.
export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const s = useSiteSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('Geçersiz e-posta veya şifre.');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo markImage={s?.logo || undefined} />
          <h1 className="mt-6 text-xl font-extrabold uppercase tracking-tight text-navy">
            Yönetici Girişi
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray">
            EURASIA BUSINESS GATEWAY
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-navy"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray/30 px-4 py-3 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-navy"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray/30 px-4 py-3 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
              <Icon name="X" className="h-4 w-4" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 bg-teal px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
