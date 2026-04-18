'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Auth Guard za zaštićene stranice
// Kompanija SPAJA — Digitalna Industrija
// Prikazuje sadržaj samo ulogovanim korisnicima, ostale preusmerava na login

import { useState, useEffect } from 'react';
import { dohvatiSesiju, type OmegaSesija } from '@/lib/auth/omega-session-client';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Naziv stranice za prikaz u poruci */
  stranica?: string;
}

export default function AuthGuard({ children, stranica = 'ovu stranicu' }: AuthGuardProps) {
  const [sesija, setSesija] = useState<OmegaSesija | null | 'loading'>('loading');

  useEffect(() => {
    setSesija(dohvatiSesiju());
  }, []);

  // Još se učitava
  if (sesija === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="text-gray-400">Provera pristupa...</div>
      </div>
    );
  }

  // Korisnik nije ulogovan
  if (!sesija) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;

    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-600/20">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">Pristup zahteva prijavu</h2>
          <p className="mb-6 text-gray-400">
            Da biste pristupili {stranica}, potrebno je da se prijavite na svoj SPAJA nalog.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={loginUrl}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              🔐 Prijavi se
            </a>
            <a
              href="/registracija"
              className="rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-400 hover:text-white"
            >
              🚀 Registruj se
            </a>
          </div>
          <div className="mt-6 rounded-xl border border-yellow-700/30 bg-yellow-900/10 p-4">
            <p className="text-xs text-gray-400">
              <strong className="text-yellow-400">⚡ Demo pristup:</strong> Koristite <span className="text-white">demo@spaja.ai</span> / <span className="text-white">Demo2024!</span> za brzu probu
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Korisnik je ulogovan — prikaži sadržaj
  return <>{children}</>;
}
