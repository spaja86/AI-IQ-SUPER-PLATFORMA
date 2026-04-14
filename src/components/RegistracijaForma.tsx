'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Registracija Forma
// Kompanija SPAJA — Digitalna Industrija
// Profesionalna forma za registraciju novih korisnika preko Omega Auth API

import { useState, useEffect, useMemo } from 'react';
import { sacuvajSesiju, dohvatiSesiju } from '@/lib/auth/omega-session-client';

function izracunajJacinaLozinke(lozinka: string): { score: number; label: string; color: string } {
  let score = 0;
  if (lozinka.length >= 8) score++;
  if (lozinka.length >= 12) score++;
  if (/[A-Z]/.test(lozinka)) score++;
  if (/[a-z]/.test(lozinka)) score++;
  if (/\d/.test(lozinka)) score++;
  if (/[^A-Za-z0-9]/.test(lozinka)) score++;

  if (score <= 2) return { score, label: 'Slaba', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Umerena', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Dobra', color: 'bg-blue-500' };
  return { score, label: 'Odlicna', color: 'bg-green-500' };
}

export default function RegistracijaForma() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [potvrdaLozinke, setPotvrdaLozinke] = useState('');
  const [prikaziLozinku, setPrikaziLozinku] = useState(false);
  const [ime, setIme] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [poruka, setPoruka] = useState('');

  const jacina = useMemo(() => izracunajJacinaLozinke(lozinka), [lozinka]);

  // Ako je korisnik vec ulogovan, preusmeri na dashboard
  useEffect(() => {
    const sesija = dohvatiSesiju();
    if (sesija) {
      window.location.href = '/dashboard';
    }
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setPoruka('');

    if (!email.trim()) {
      setStatus('error');
      setPoruka('Email adresa je obavezna.');
      return;
    }

    if (lozinka.length < 8) {
      setStatus('error');
      setPoruka('Lozinka mora imati najmanje 8 karaktera.');
      return;
    }

    if (lozinka !== potvrdaLozinke) {
      setStatus('error');
      setPoruka('Lozinke se ne poklapaju.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: lozinka,
          fullName: ime.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        if (res.status === 409) {
          setPoruka('Korisnik sa ovim email-om vec postoji. Prijavite se ili koristite drugi email.');
        } else if (res.status === 429) {
          setPoruka('Previse pokusaja. Sacekajte 15 minuta pa pokusajte ponovo.');
        } else {
          setPoruka(data.error ?? 'Registracija nije uspela. Pokusajte ponovo.');
        }
        return;
      }

      sacuvajSesiju({
        token: data.token.value,
        email: email.trim(),
        plan: 'starter',
        uloga: data.identity.roles?.[0] ?? 'user',
        identityId: data.identity.id,
        did: data.identity.did,
        roles: data.identity.roles ?? ['user'],
        clearanceLevel: data.identity.clearanceLevel ?? 1,
        expiresAt: data.expiresAt,
      });

      setStatus('success');
      setPoruka('Registracija uspesna! Preusmeravanje na dashboard...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch {
      setStatus('error');
      setPoruka('Greska u mrezi. Proverite internet konekciju i pokusajte ponovo.');
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600/20">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Registracija</h1>
          <p className="mt-2 text-gray-400">
            Kreirajte nalog i dobijte pristup SpajaPro AI i celom ekosistemu
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-8 shadow-2xl backdrop-blur"
        >
          {/* Ime */}
          <div className="mb-5">
            <label htmlFor="reg-ime" className="mb-1.5 block text-sm font-medium text-gray-300">
              Ime i prezime <span className="text-gray-600">(opciono)</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                👤
              </span>
              <input
                id="reg-ime"
                type="text"
                autoComplete="name"
                value={ime}
                onChange={(e) => setIme(e.target.value)}
                placeholder="Vase ime"
                className="w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-gray-300">
              Email adresa
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                📧
              </span>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.com"
                className="w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              />
            </div>
          </div>

          {/* Lozinka */}
          <div className="mb-4">
            <label htmlFor="reg-lozinka" className="mb-1.5 block text-sm font-medium text-gray-300">
              Lozinka
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                🔑
              </span>
              <input
                id="reg-lozinka"
                type={prikaziLozinku ? 'text' : 'password'}
                required
                autoComplete="new-password"
                minLength={8}
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
                placeholder="Minimum 8 karaktera"
                className="w-full rounded-lg border border-gray-600 bg-gray-900 py-3 pl-10 pr-12 text-white placeholder-gray-500 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
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

            {/* Jacina lozinke */}
            {lozinka.length > 0 && (
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Jacina lozinke:</span>
                  <span className={`text-xs font-medium ${
                    jacina.score <= 2 ? 'text-red-400' :
                    jacina.score <= 3 ? 'text-yellow-400' :
                    jacina.score <= 4 ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {jacina.label}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= jacina.score ? jacina.color : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Potvrda lozinke */}
          <div className="mb-6">
            <label htmlFor="reg-potvrda" className="mb-1.5 block text-sm font-medium text-gray-300">
              Potvrdite lozinku
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                🔒
              </span>
              <input
                id="reg-potvrda"
                type={prikaziLozinku ? 'text' : 'password'}
                required
                autoComplete="new-password"
                minLength={8}
                value={potvrdaLozinke}
                onChange={(e) => setPotvrdaLozinke(e.target.value)}
                placeholder="Ponovite lozinku"
                className={`w-full rounded-lg border bg-gray-900 py-3 pl-10 pr-10 text-white placeholder-gray-500 transition focus:outline-none focus:ring-2 ${
                  potvrdaLozinke.length > 0 && potvrdaLozinke !== lozinka
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                    : potvrdaLozinke.length > 0 && potvrdaLozinke === lozinka
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/40'
                    : 'border-gray-600 focus:border-green-500 focus:ring-green-500/40'
                }`}
              />
              {potvrdaLozinke.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                  {potvrdaLozinke === lozinka ? '✅' : '❌'}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Registracija...
              </>
            ) : (
              'Kreiraj nalog'
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

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-950 px-3 text-gray-500">ili</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6 text-center">
          <p className="text-sm text-gray-400">
            Vec imate nalog?{' '}
            <a href="/login" className="font-semibold text-blue-400 transition hover:text-blue-300">
              Prijavite se
            </a>
          </p>
        </div>

        {/* Bezbednost info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <span>🛡️</span>
          <span>Zero Trust · AES-256-GCM · PBKDF2-SHA512</span>
        </div>
      </div>
    </div>
  );
}
