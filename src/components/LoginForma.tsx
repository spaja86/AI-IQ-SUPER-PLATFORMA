'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Profesionalna Login Forma
// Kompanija SPAJA — Digitalna Industrija
// Profesionalna forma za prijavu sa svim standardnim funkcijama

import { useState, useEffect } from 'react';
import { sacuvajSesiju, dohvatiSesiju } from '@/lib/auth/omega-session-client';

export default function LoginForma() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [prikaziLozinku, setPrikaziLozinku] = useState(false);
  const [zapamtiMe, setZapamtiMe] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [poruka, setPoruka] = useState('');

  // Ako je korisnik vec ulogovan, preusmeri na dashboard
  useEffect(() => {
    const sesija = dohvatiSesiju();
    if (sesija) {
      window.location.href = '/dashboard';
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

    if (!lozinka.trim()) {
      setStatus('error');
      setPoruka('Lozinka je obavezna.');
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

      if (zapamtiMe) {
        try {
          localStorage.setItem('omega-remember-email', email.trim());
        } catch {
          // ignore
        }
      } else {
        try {
          localStorage.removeItem('omega-remember-email');
        } catch {
          // ignore
        }
      }

      setStatus('success');
      setPoruka('Uspesna prijava! Preusmeravanje...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } catch {
      setStatus('error');
      setPoruka('Greska u mrezi. Proverite internet konekciju i pokusajte ponovo.');
    }
  }

  // Ucitaj zapamcen email
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omega-remember-email');
      if (saved) {
        setEmail(saved);
        setZapamtiMe(true);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo i naslov */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Prijava</h1>
          <p className="mt-2 text-gray-400">
            Prijavite se na svoj SPAJA nalog
          </p>
        </div>

        {/* Forma */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-8 shadow-2xl backdrop-blur"
        >
          {/* Email */}
          <div className="mb-5">
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-gray-300">
              Email adresa
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                📧
              </span>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.com"
                className="w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          {/* Lozinka */}
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-lozinka" className="text-sm font-medium text-gray-300">
                Lozinka
              </label>
              <a
                href="/zaboravljena-lozinka"
                className="text-xs text-blue-400 transition hover:text-blue-300"
              >
                Zaboravili ste lozinku?
              </a>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                🔑
              </span>
              <input
                id="login-lozinka"
                type={prikaziLozinku ? 'text' : 'password'}
                required
                autoComplete="current-password"
                minLength={8}
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
                placeholder="Unesite lozinku"
                className="w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-10 pr-12 text-white placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
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

          {/* Zapamti me */}
          <div className="mb-6 flex items-center gap-2">
            <input
              id="zapamti-me"
              type="checkbox"
              checked={zapamtiMe}
              onChange={(e) => setZapamtiMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="zapamti-me" className="text-sm text-gray-400">
              Zapamti me
            </label>
          </div>

          {/* Submit */}
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

          {/* Poruka */}
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

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-950 px-3 text-gray-500">ili</span>
          </div>
        </div>

        {/* Demo Login */}
        <div className="mb-4 rounded-2xl border border-yellow-700/30 bg-yellow-900/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-yellow-400">
            <span>⚡</span>
            <span>Brzi Demo Pristup</span>
          </div>
          <p className="mb-3 text-xs text-gray-400">
            Isprobajte platformu odmah sa demo nalogom — bez registracije.
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail('demo@spaja.ai');
              setLozinka('Demo2024!');
            }}
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

        {/* Registracija link */}
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6 text-center">
          <p className="text-sm text-gray-400">
            Nemate nalog?{' '}
            <a href="/registracija" className="font-semibold text-green-400 transition hover:text-green-300">
              Registrujte se besplatno
            </a>
          </p>
        </div>

        {/* Bezbednost info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <span>🛡️</span>
          <span>Zero Trust · AES-256-GCM · PBKDF2-SHA512</span>
        </div>

        {/* Login Status Informacija */}
        <div className="mt-4 rounded-xl border border-gray-700/30 bg-gray-800/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
            <span>ℹ️</span>
            <span>Status Login Sistema</span>
          </div>
          <ul className="space-y-1 text-[11px] text-gray-500">
            <li>• <strong className="text-green-400">Demo nalog</strong> je uvek dostupan: demo@spaja.ai / Demo2024!</li>
            <li>• Registracija i prijava funkcionisu u okviru iste serverske sesije</li>
            <li>• Sistem koristi Zero Trust + AES-256-GCM + PBKDF2-SHA512</li>
            <li>• Registrujte se na <a href="/registracija" className="text-blue-400 hover:text-blue-300">/registracija</a> za sopstveni nalog</li>
            <li>• Za pitanja koristite AI asistenta (dugme 🤖 u donjem desnom uglu)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
