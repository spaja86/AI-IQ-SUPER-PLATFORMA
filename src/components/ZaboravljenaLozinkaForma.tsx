'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Zaboravljena Lozinka Forma
// Kompanija SPAJA — Digitalna Industrija

import { useState } from 'react';
import Button from '@/components/Button';

export default function ZaboravljenaLozinkaForma() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [poruka, setPoruka] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setPoruka('');

    if (!email.trim()) {
      setStatus('error');
      setPoruka('Email adresa je obavezna.');
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setPoruka(data.error ?? 'Greska prilikom slanja. Pokusajte ponovo.');
        return;
      }

      setStatus('success');
      setPoruka(data.message ?? 'Ako nalog sa ovim email-om postoji, poslaticemo instrukcije za resetovanje lozinke.');
    } catch {
      setStatus('error');
      setPoruka('Greska u mrezi. Proverite internet konekciju.');
    }
  }

  return (
    <div className="spaja-shell flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-600/20">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Zaboravljena lozinka</h1>
          <p className="mt-2 text-gray-400">
            Unesite email adresu i poslaticemo vam instrukcije za resetovanje lozinke.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="spaja-card p-8 shadow-2xl backdrop-blur">
          <div className="mb-6">
            <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-gray-300">
              Email adresa
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                📧
              </span>
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.com"
                disabled={status === 'success'}
                className="spaja-focus-ring w-full rounded-lg border border-slate-600 bg-slate-900 py-3 pl-10 pr-4 text-white placeholder-slate-500 transition disabled:opacity-60"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="warning"
            size="lg"
            loading={status === 'loading'}
            loadingLabel="Slanje..."
            disabled={status === 'success'}
            className="w-full border-yellow-600"
          >
            {status === 'success' ? (
              'Poslato ✓'
            ) : (
              'Posalji instrukcije'
            )}
          </Button>

          {poruka && (
            <div
              role="alert"
              className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                status === 'success'
                  ? 'border border-green-700/50 bg-green-900/40 text-green-300'
                  : 'border border-red-700/50 bg-red-900/40 text-red-300'
              }`}
            >
              <span>{status === 'success' ? '✅' : '❌'}</span>
              {poruka}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-blue-400 transition hover:text-blue-300">
            ← Nazad na prijavu
          </a>
        </div>
      </div>
    </div>
  );
}
