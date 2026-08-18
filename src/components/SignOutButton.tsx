'use client';

import { signOut } from 'next-auth/react';
import { Icon } from './Icon';

// Client sign-out button. Uses next-auth/react's signOut which handles the
// CSRF token round-trip correctly.
export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex w-full items-center justify-center gap-2 rounded border border-white/20 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-white/80 transition-colors hover:bg-white/5 hover:text-white"
    >
      <Icon name="X" className="h-4 w-4" />
      Çıkış Yap
    </button>
  );
}
