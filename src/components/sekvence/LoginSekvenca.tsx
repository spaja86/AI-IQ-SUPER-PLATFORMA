'use client';

import type { Sekvenca } from '@/lib/types';
import { useState } from 'react';

type LoginMetoda = { naziv: string; ikona: string; metod: string };

export default function LoginSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const opis = sekvenca.podaci.opis as string | undefined;
  const metode = (sekvenca.podaci.metode ?? []) as LoginMetoda[];

  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [poruka, setPoruka] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setPoruka('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lozinka }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setPoruka(data.poruka ?? 'Uspesno prijavljivanje!');
      } else {
        setStatus('error');
        setPoruka(data.greska ?? 'Greska prilikom prijavljivanja.');
      }
    } catch {
      setStatus('error');
      setPoruka('Greska u mrezi. Pokusajte ponovo.');
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-16">
      <div className="mx-auto max-w-md">
        {sekvenca.naslov && (
          <h2 className="mb-2 text-center text-3xl font-bold text-white">{sekvenca.naslov}</h2>
        )}
        {sekvenca.podnaslov && (
          <p className="mb-6 text-center text-gray-400">{sekvenca.podnaslov}</p>
        )}
        {opis && <p className="mb-8 text-center text-sm text-gray-500">{opis}</p>}

        <form onSubmit={handleLogin} className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-8">
          <div className="mb-5">
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-gray-300">
              Email adresa
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.com"
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="login-lozinka" className="mb-1 block text-sm font-medium text-gray-300">
              Lozinka
            </label>
            <input
              id="login-lozinka"
              type="password"
              required
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              placeholder="Unesite lozinku"
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {status === 'loading' ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>

          {poruka && (
            <div
              role="alert"
              className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                status === 'success'
                  ? 'bg-green-900/40 text-green-300'
                  : 'bg-red-900/40 text-red-300'
              }`}
            >
              {poruka}
            </div>
          )}
        </form>

        {metode.length > 0 && (
          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-950 px-3 text-gray-500">ili se prijavite putem</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {metode.map((m) => (
                <button
                  key={m.metod}
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800/40 px-4 py-3 text-sm text-gray-300 transition hover:border-gray-500 hover:text-white"
                >
                  <span role="img" aria-label={m.naziv}>{m.ikona}</span>
                  {m.naziv}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
