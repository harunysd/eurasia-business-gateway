'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon';

type Submission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

// Admin messages list. Fetches submissions from the API, renders an
// expandable table with read/unread toggles and a reply-by-email modal that
// sends via Resend.
export function MessagesList() {
  const [items, setItems] = useState<Submission[] | null>(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Submission | null>(null);
  const [reply, setReply] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [replyStatus, setReplyStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/messages', { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const data = (await res.json()) as { submissions: Submission[] };
      setItems(data.submissions);
    } catch {
      setError('Mesajlar yüklenemedi.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (id: string, read: boolean) => {
    setItems((cur) =>
      cur
        ? cur.map((s) => (s.id === id ? { ...s, read } : s))
        : cur,
    );
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
  };

  const openReply = (s: Submission) => {
    setReplyTo(s);
    setReply({
      subject: `Re: Eurasia Business Gateway ile ilgili talebiniz`,
      message: `Merhaba ${s.name},\n\nBize ulaştığınız için teşekkür ederiz.\n\n[Yanıtınız buraya]\n\nSaygılarımızla,\nEurasia Business Gateway`,
    });
    setReplyStatus(null);
  };

  const sendReply = async () => {
    if (!replyTo) return;
    setSending(true);
    setReplyStatus(null);
    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: replyTo.email,
          subject: reply.subject,
          message: reply.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'send failed');
      setReplyStatus({ type: 'success', msg: 'Yanıt gönderildi.' });
      if (!replyTo.read) {
        await toggleRead(replyTo.id, true);
      }
      window.setTimeout(() => {
        setReplyTo(null);
      }, 1500);
    } catch (err) {
      setReplyStatus({
        type: 'error',
        msg: err instanceof Error ? err.message : 'Gönderilemedi.',
      });
    } finally {
      setSending(false);
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-extrabold uppercase tracking-tight text-navy">
          Mesajlar
        </h1>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray">
          İletişim formu gönderimleri
        </p>
      </header>

      {error && (
        <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {items === null && !error && (
        <p className="text-sm text-gray">Yükleniyor...</p>
      )}

      {items && items.length === 0 && (
        <p className="text-sm text-gray">Henüz mesaj yok.</p>
      )}

      {items && items.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray/15 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray/5 text-xs uppercase tracking-wide text-gray">
              <tr>
                <th className="px-4 py-3 font-semibold">Durum</th>
                <th className="px-4 py-3 font-semibold">Ad</th>
                <th className="px-4 py-3 font-semibold">E-posta</th>
                <th className="px-4 py-3 font-semibold">Şirket</th>
                <th className="px-4 py-3 font-semibold">Tarih</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray/10">
              {items.map((s) => (
                <>
                  <tr
                    key={s.id}
                    className={`cursor-pointer transition-colors hover:bg-gray/5 ${
                      s.read ? '' : 'font-semibold text-navy'
                    }`}
                    onClick={() =>
                      setExpanded((cur) => (cur === s.id ? null : s.id))
                    }
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRead(s.id, !s.read);
                        }}
                        className={`inline-flex h-2.5 w-2.5 rounded-full ${
                          s.read ? 'bg-gray/40' : 'bg-teal'
                        }`}
                        aria-label={s.read ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                        title={s.read ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                      />
                    </td>
                    <td className="px-4 py-3 text-navy">{s.name}</td>
                    <td className="px-4 py-3 text-gray">{s.email}</td>
                    <td className="px-4 py-3 text-gray">
                      {s.company || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray">{fmt(s.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReply(s);
                        }}
                        className="inline-flex items-center gap-1.5 rounded border border-teal px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:bg-teal hover:text-white"
                      >
                        <Icon name="Mail" className="h-3.5 w-3.5" />
                        Yanıtla
                      </button>
                    </td>
                  </tr>
                  {expanded === s.id && (
                    <tr key={s.id + '-detail'} className="bg-gray/5">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <div className="text-xs uppercase tracking-wide text-gray">
                              Telefon
                            </div>
                            <div className="text-sm text-navy">
                              {s.phone || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wide text-gray">
                              E-posta
                            </div>
                            <div className="text-sm text-navy">{s.email}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wide text-gray">
                              Şirket
                            </div>
                            <div className="text-sm text-navy">
                              {s.company || '—'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-xs uppercase tracking-wide text-gray">
                            Mesaj
                          </div>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-navy">
                            {s.message}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reply modal */}
      {replyTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold uppercase tracking-tight text-navy">
                E-posta ile Yanıtla
              </h2>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="rounded p-1 text-gray hover:text-navy"
                aria-label="Kapat"
              >
                <Icon name="X" className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-xs text-gray">
              Kime: <span className="text-navy">{replyTo.email}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-navy">
                  Konu
                </label>
                <input
                  type="text"
                  value={reply.subject}
                  onChange={(e) =>
                    setReply((r) => ({ ...r, subject: e.target.value }))
                  }
                  className="w-full rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-navy">
                  Mesaj
                </label>
                <textarea
                  rows={8}
                  value={reply.message}
                  onChange={(e) =>
                    setReply((r) => ({ ...r, message: e.target.value }))
                  }
                  className="w-full resize-y rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                />
              </div>

              {replyStatus && (
                <p
                  className={`rounded px-3 py-2 text-sm ${
                    replyStatus.type === 'success'
                      ? 'bg-teal/10 text-teal'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {replyStatus.msg}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="rounded border border-gray/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray transition-colors hover:bg-gray/10"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={sendReply}
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded bg-teal px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-70"
                >
                  {sending ? 'Gönderiliyor...' : 'Yanıtı Gönder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
