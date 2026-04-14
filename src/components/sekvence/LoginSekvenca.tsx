'use client';

import type { Sekvenca } from '@/lib/types';
import { useState, useEffect } from 'react';
import { sacuvajSesiju, dohvatiSesiju } from '@/lib/auth/omega-session-client';

type LoginMetoda = { naziv: string; ikona: string; metod: string };

export default function LoginSekvenca({ sekvenca }: { sekvenca: Sekvenca }) {
  const opis = sekvenca.podaci.opis as string | undefined;
  const metode = (sekvenca.podaci.metode ?? []) as LoginMetoda[];

  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [prikaziLozinku, setPrikaziLozinku] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [poruka, setPoruka] = useState('');
  const [ulogovan, setUlogovan] = useState(false);

  // Proveri da li je korisnik vec ulogovan
  useEffect(() => {
    const sesija = dohvatiSesiju();
    if (sesija) {
      setUlogovan(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setPoruka('');

    if (!email.trim()) {
      setStatus('error');
      setPoruka('Email adresa je obavezna.');
      return;
    }

    if (!lozinka.trim() || lozinka.length < 8) {
      setStatus('error');
      setPoruka('Lozinka mora imati najmanje 8 karaktera.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: lozinka }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        if (res.status === 429) {
          setPoruka('Previse neuspesnih pokusaja. Sacekajte 15 minuta pa pokusajte ponovo.');
        } else {
          setPoruka(data.error ?? 'Neispravni podaci za prijavu.');
        }
        return;
      }

      sacuvajSesiju({
        token: data.token.value,
        email: email.trim(),
        plan: data.identity.clearanceLevel >= 3 ? 'unlimited' : 'starter',
        uloga: data.identity.roles?.[0] ?? 'user',
        identityId: data.identity.id,
        did: data.identity.did,
        roles: data.identity.roles ?? ['user'],
        clearanceLevel: data.identity.clearanceLevel ?? 1,
        expiresAt: data.expiresAt,
      });

      setStatus('success');
      setPoruka('Uspesno prijavljivanje! Preusmeravanje na dashboard...');
      setTimeout(() => { window.location.href = '/dashboard'; }, 800);
    } catch {
      setStatus('error');
      setPoruka('Greska u mrezi. Proverite internet konekciju i pokusajte ponovo.');
    }
  }

  function popuniDemoNalog() {
    setEmail('demo@spaja.ai');
    setLozinka('Demo2024!');
    setPoruka('');
    setStatus('idle');
  }

  // Ako je korisnik ulogovan, pokazi drugaciji sadrzaj
  if (ulogovan) {
    const sesija = dohvatiSesiju();
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600/20">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-white">Dobrodosli nazad!</h2>
          <p className="mb-2 text-gray-400">Ulogovani ste kao <span className="text-blue-400">{sesija?.email}</span></p>
          <p className="mb-6 text-sm text-gray-500">Pristupite svim funkcijama platforme</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/dashboard" className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
              📊 Dashboard
            </a>
            <a href="/spaja-pro" className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500">
              🤖 SpajaPro AI
            </a>
            <a href="/prompt" className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500">
              💬 Prompt Konzola
            </a>
            <a href="/igrice" className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500">
              🎮 Igrice
            </a>
          </div>
        </div>
      </div>
    );
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

        {/* Demo nalog — brzi pristup */}
        <div className="mb-6 rounded-2xl border border-yellow-700/30 bg-yellow-900/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-yellow-400">
            <span>⚡</span>
            <span>Brzi Demo Pristup</span>
          </div>
          <p className="mb-3 text-xs text-gray-400">
            Isprobajte platformu odmah sa demo nalogom — bez registracije.
          </p>
          <button
            type="button"
            onClick={popuniDemoNalog}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-yellow-600/40 bg-yellow-600/20 px-4 py-2.5 text-sm font-medium text-yellow-300 transition hover:bg-yellow-600/30 hover:text-yellow-200"
          >
            <span>🔑</span>
            Popuni demo podatke
          </button>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
            <span>📧 demo@spaja.ai</span>
            <span>🔒 Demo2024!</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-8">
          <div className="mb-5">
            <label htmlFor="pocetna-login-email" className="mb-1 block text-sm font-medium text-gray-300">
              Email adresa
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">📧</span>
              <input
                id="pocetna-login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.com"
                className="w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="pocetna-login-lozinka" className="text-sm font-medium text-gray-300">
                Lozinka
              </label>
              <a href="/zaboravljena-lozinka" className="text-xs text-blue-400 transition hover:text-blue-300">
                Zaboravili ste lozinku?
              </a>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔑</span>
              <input
                id="pocetna-login-lozinka"
                type={prikaziLozinku ? 'text' : 'password'}
                required
                autoComplete="current-password"
                minLength={8}
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
                placeholder="Unesite lozinku"
                className="w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="button"
                onClick={() => setPrikaziLozinku(!prikaziLozinku)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-300"
                aria-label={prikaziLozinku ? 'Sakrij lozinku' : 'Pokazi lozinku'}
              >
                {prikaziLozinku ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Prijavljivanje...
              </>
            ) : (
              'Prijavi se'
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
                  onClick={() => {
                    setStatus('error');
                    setPoruka(`${m.naziv} prijava ce biti dostupna uskoro. Koristite email/lozinku ili demo nalog.`);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800/40 px-4 py-3 text-sm text-gray-300 transition hover:border-gray-500 hover:text-white"
                >
                  <span role="img" aria-label={m.naziv}>{m.ikona}</span>
                  {m.naziv}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <a
            href="/login"
            className="text-sm text-blue-400 transition hover:text-blue-300"
          >
            Otvorite profesionalnu stranicu za prijavu →
          </a>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Nemate nalog?{' '}
          <a href="/registracija" className="text-green-400 hover:text-green-300">
            Registrujte se besplatno
          </a>
        </p>
      </div>
    </div>
  );
}
