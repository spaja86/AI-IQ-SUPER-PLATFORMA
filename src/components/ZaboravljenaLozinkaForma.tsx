'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Zaboravljena Lozinka Forma
// Kompanija SPAJA — Digitalna Industrija

import { useState } from 'react';

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
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-4 py-16">
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

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-8 shadow-2xl backdrop-blur"
        >
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
                className="w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Slanje...
              </>
            ) : status === 'success' ? (
              'Poslato ✓'
            ) : (
              'Posalji instrukcije'
            )}
          </button>

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
