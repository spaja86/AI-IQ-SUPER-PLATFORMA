'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Dashboard Klijent
// Kompanija SPAJA — Digitalna Industrija
// Dashboard sa Omega Auth podacima

import { useState } from 'react';
import { dohvatiSesiju, obrisiSesiju, type OmegaSesija } from '@/lib/auth/omega-session-client';

export default function DashboardKlijent() {
  const [sesija, setSesija] = useState<OmegaSesija | null>(() => {
    if (typeof window === 'undefined') return null;
    return dohvatiSesiju();
  });

  const isLoggedIn = !!sesija;

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sesija?.token ? { Authorization: `Bearer ${sesija.token}` } : {}),
        },
      });
    } catch {
      // Nastavi sa brisanjem lokalne sesije cak i ako API poziv ne uspe
    }
    obrisiSesiju();
    setSesija(null);
    window.location.href = '/login';
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">📊 Dashboard</h2>
          <p className="mb-8 text-gray-400">
            Prijavite se da biste videli svoj dashboard sa realnim podacima.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/login"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Prijavi se
            </a>
            <a
              href="/registracija"
              className="rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-400 hover:text-white"
            >
              Registruj se
            </a>
          </div>
        </div>
      </div>
    );
  }

  const planColors: Record<string, string> = {
    starter: 'text-gray-300',
    basic: 'text-blue-400',
    pro: 'text-purple-400',
    enterprise: 'text-yellow-400',
    unlimited: 'text-green-400',
  };

  const plan = sesija?.plan ?? 'starter';
  const uloga = sesija?.uloga ?? 'user';

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">📊 Dashboard</h2>
            <p className="text-sm text-gray-400">{sesija?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 transition hover:border-red-500 hover:text-red-400"
          >
            Odjavi se
          </button>
        </div>

        {/* Kartice */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <div className="mb-1 text-sm text-gray-400">Plan</div>
            <div className={`text-2xl font-bold ${planColors[plan] ?? 'text-white'}`}>
              {plan.toUpperCase()}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <div className="mb-1 text-sm text-gray-400">Uloga</div>
            <div className="text-2xl font-bold text-green-400">
              {uloga === 'admin' ? 'Admin' : uloga === 'vlasnik' ? 'Vlasnik' : 'Korisnik'}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <div className="mb-1 text-sm text-gray-400">DID</div>
            <div className="truncate text-sm font-medium text-white" title={sesija?.did}>
              {sesija?.did?.slice(0, 24)}...
            </div>
          </div>

          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <div className="mb-1 text-sm text-gray-400">Bezbednosni nivo</div>
            <div className="text-2xl font-bold text-blue-400">
              {sesija?.clearanceLevel ?? 1}
            </div>
          </div>
        </div>

        {/* Brzi pristup */}
        <div className="mb-8 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">🚀 Brzi pristup</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <a href="/spaja-pro" className="rounded-lg bg-blue-600/20 px-4 py-3 text-center text-sm text-blue-300 transition hover:bg-blue-600/30">
              🤖 SpajaPro AI Chat
            </a>
            <a href="/prompt" className="rounded-lg bg-purple-600/20 px-4 py-3 text-center text-sm text-purple-300 transition hover:bg-purple-600/30">
              💬 Prompt Konzola
            </a>
            <a href="/igrice" className="rounded-lg bg-green-600/20 px-4 py-3 text-center text-sm text-green-300 transition hover:bg-green-600/30">
              🎮 Igrice
            </a>
            <a href="/omega-ai" className="rounded-lg bg-yellow-600/20 px-4 py-3 text-center text-sm text-yellow-300 transition hover:bg-yellow-600/30">
              🧠 OMEGA AI
            </a>
            <a href="/platforme" className="rounded-lg bg-cyan-600/20 px-4 py-3 text-center text-sm text-cyan-300 transition hover:bg-cyan-600/30">
              🧩 Platforme
            </a>
            <a href="/ekosistem" className="rounded-lg bg-pink-600/20 px-4 py-3 text-center text-sm text-pink-300 transition hover:bg-pink-600/30">
              🌐 Ekosistem
            </a>
            <a href="/industrija" className="rounded-lg bg-orange-600/20 px-4 py-3 text-center text-sm text-orange-300 transition hover:bg-orange-600/30">
              🏭 Industrija
            </a>
            <a href="/spaja-digitalni-kompjuter" className="rounded-lg bg-indigo-600/20 px-4 py-3 text-center text-sm text-indigo-300 transition hover:bg-indigo-600/30">
              🖥️ Digitalni Kompjuter
            </a>
          </div>
        </div>

        {/* Akcije */}
        <div className="flex flex-wrap gap-4">
          <a
            href="/spaja-pro"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            🤖 SpajaPro AI Chat
          </a>
          {plan !== 'unlimited' && (
            <a
              href="/pricing"
              className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              ⬆️ Nadogradi plan
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
