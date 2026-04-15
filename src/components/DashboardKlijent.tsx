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

        {/* Ekosistem u brojevima */}
        <div className="mb-8 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">📊 Ekosistem u brojevima</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-lg bg-gray-900/50 p-3 text-center">
              <div className="text-lg">🌐</div>
              <div className="mt-1 text-xl font-bold text-white">13</div>
              <div className="text-[10px] text-gray-500">Platforme</div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3 text-center">
              <div className="text-lg">⚡</div>
              <div className="mt-1 text-xl font-bold text-white">64</div>
              <div className="text-[10px] text-gray-500">IT Proizvodi</div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3 text-center">
              <div className="text-lg">🎮</div>
              <div className="mt-1 text-xl font-bold text-white">95</div>
              <div className="text-[10px] text-gray-500">Igrice</div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3 text-center">
              <div className="text-lg">🧠</div>
              <div className="mt-1 text-xl font-bold text-white">21</div>
              <div className="text-[10px] text-gray-500">OMEGA AI</div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3 text-center">
              <div className="text-lg">🌟</div>
              <div className="mt-1 text-xl font-bold text-white">v6-15</div>
              <div className="text-[10px] text-gray-500">SpajaPro</div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3 text-center">
              <div className="text-lg">📄</div>
              <div className="mt-1 text-xl font-bold text-white">46</div>
              <div className="text-[10px] text-gray-500">Stranice</div>
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
              🎮 Igrice (95)
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

        {/* Preporuke — Sta treba da probas */}
        <div className="mb-8 rounded-2xl border border-purple-700/30 bg-purple-900/10 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">💡 Preporuke — Sta da probate</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="/prompt" className="group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-purple-500/30 hover:bg-purple-900/10">
              <div className="mb-2 text-lg">💬</div>
              <div className="text-sm font-medium text-white group-hover:text-purple-300">Prompt Konzola</div>
              <div className="mt-1 text-xs text-gray-400">Izvrsite jedan od 28+ promptova u SpajaPro engine-u. Promptovi se cuvaju u istoriji.</div>
            </a>
            <a href="/spaja-digitalni-brouvzer" className="group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-blue-500/30 hover:bg-blue-900/10">
              <div className="mb-2 text-lg">🌐</div>
              <div className="text-sm font-medium text-white group-hover:text-blue-300">Digitalni Brouvzer</div>
              <div className="mt-1 text-xs text-gray-400">SPAJA sopstveni pregledac sa vlastitim motorom i transparentnim frontend-om.</div>
            </a>
            <a href="/io-openui-ao-gaming-platforma" className="group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-green-500/30 hover:bg-green-900/10">
              <div className="mb-2 text-lg">🎮</div>
              <div className="text-sm font-medium text-white group-hover:text-green-300">Gaming Platforma</div>
              <div className="mt-1 text-xs text-gray-400">95 igrica u 18 kategorija — Dota 1350, TRANSFORMERS, BUBLI BABLI, Poker i jos mnogo toga.</div>
            </a>
            <a href="/digitalni-televizor" className="group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-yellow-500/30 hover:bg-yellow-900/10">
              <div className="mb-2 text-lg">📺</div>
              <div className="text-sm font-medium text-white group-hover:text-yellow-300">Digitalni Televizor</div>
              <div className="mt-1 text-xs text-gray-400">Univerzalni digitalni TV sa 12 kanala — zabava, sport, vesti, edukacija.</div>
            </a>
            <a href="/banka" className="group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-emerald-500/30 hover:bg-emerald-900/10">
              <div className="mb-2 text-lg">🏦</div>
              <div className="text-sm font-medium text-white group-hover:text-emerald-300">SPAJA Banka</div>
              <div className="mt-1 text-xs text-gray-400">Digitalna banka sa racunima, transferima, kreditima i investicijama.</div>
            </a>
            <a href="/menjacnica" className="group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-amber-500/30 hover:bg-amber-900/10">
              <div className="mb-2 text-lg">💱</div>
              <div className="text-sm font-medium text-white group-hover:text-amber-300">SPAJA Menjacnica</div>
              <div className="mt-1 text-xs text-gray-400">Kripto i fiat menjacnica sa AI optimizacijom portfolio-a.</div>
            </a>
            <a href="/monitoring-live" className="group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-red-500/30 hover:bg-red-900/10">
              <div className="mb-2 text-lg">📡</div>
              <div className="text-sm font-medium text-white group-hover:text-red-300">Monitoring Live</div>
              <div className="mt-1 text-xs text-gray-400">Twitch-like streaming platforma za pracenje sistema u realnom vremenu.</div>
            </a>
            <a href="/spaja-render-medija" className="group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-pink-500/30 hover:bg-pink-900/10">
              <div className="mb-2 text-lg">🎬</div>
              <div className="text-sm font-medium text-white group-hover:text-pink-300">Render Medija</div>
              <div className="mt-1 text-xs text-gray-400">Renderovanje slika i video sadrzaja sa naprednim AI filterima.</div>
            </a>
          </div>
        </div>

        {/* Istrazite jos — dodatne funkcije */}
        <div className="mb-8 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">🔍 Istrazite jos</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <a href="/omega-ai-suport" className="rounded-lg bg-teal-600/20 px-4 py-3 text-center text-sm text-teal-300 transition hover:bg-teal-600/30">
              📞 OMEGA AI Suport
            </a>
            <a href="/io-openui-ao-laboratorija" className="rounded-lg bg-violet-600/20 px-4 py-3 text-center text-sm text-violet-300 transition hover:bg-violet-600/30">
              🔬 Laboratorija
            </a>
            <a href="/spaja-generator-engine" className="rounded-lg bg-lime-600/20 px-4 py-3 text-center text-sm text-lime-300 transition hover:bg-lime-600/30">
              ⚙️ Generator Engine
            </a>
            <a href="/dimenzije" className="rounded-lg bg-fuchsia-600/20 px-4 py-3 text-center text-sm text-fuchsia-300 transition hover:bg-fuchsia-600/30">
              🌀 Dimenzije
            </a>
            <a href="/proksi" className="rounded-lg bg-rose-600/20 px-4 py-3 text-center text-sm text-rose-300 transition hover:bg-rose-600/30">
              🛡️ Proksi Mreza
            </a>
            <a href="/mobilna-mreza" className="rounded-lg bg-sky-600/20 px-4 py-3 text-center text-sm text-sky-300 transition hover:bg-sky-600/30">
              📱 Mobilna Mreza
            </a>
            <a href="/deploy" className="rounded-lg bg-emerald-600/20 px-4 py-3 text-center text-sm text-emerald-300 transition hover:bg-emerald-600/30">
              🚀 Deploy Status
            </a>
            <a href="/auto-popravka" className="rounded-lg bg-amber-600/20 px-4 py-3 text-center text-sm text-amber-300 transition hover:bg-amber-600/30">
              🔧 Auto-Popravka
            </a>
            <a href="/security" className="rounded-lg bg-red-600/20 px-4 py-3 text-center text-sm text-red-300 transition hover:bg-red-600/30">
              🔐 Bezbednost
            </a>
            <a href="/ai-platforma" className="rounded-lg bg-blue-600/20 px-4 py-3 text-center text-sm text-blue-300 transition hover:bg-blue-600/30">
              🧠 AI Platforma
            </a>
            <a href="/blog" className="rounded-lg bg-gray-600/20 px-4 py-3 text-center text-sm text-gray-300 transition hover:bg-gray-600/30">
              📰 Blog & FAQ
            </a>
            <a href="/unit-testovi" className="rounded-lg bg-green-600/20 px-4 py-3 text-center text-sm text-green-300 transition hover:bg-green-600/30">
              🧪 Unit Testovi
            </a>
            <a href="/it-proizvodi" className="rounded-lg bg-cyan-600/20 px-4 py-3 text-center text-sm text-cyan-300 transition hover:bg-cyan-600/30">
              ⚡ IT Proizvodi
            </a>
            <a href="/kompanija" className="rounded-lg bg-indigo-600/20 px-4 py-3 text-center text-sm text-indigo-300 transition hover:bg-indigo-600/30">
              🏗️ Kompanija
            </a>
            <a href="/organizacija" className="rounded-lg bg-purple-600/20 px-4 py-3 text-center text-sm text-purple-300 transition hover:bg-purple-600/30">
              🌍 Organizacija
            </a>
            <a href="/oktavne-eksponencijalne-funkcije" className="rounded-lg bg-yellow-600/20 px-4 py-3 text-center text-sm text-yellow-300 transition hover:bg-yellow-600/30">
              🎵 Oktavne Funkcije
            </a>
            <a href="/ai-iq-monitoring" className="rounded-lg bg-orange-600/20 px-4 py-3 text-center text-sm text-orange-300 transition hover:bg-orange-600/30">
              🔍 AI Monitoring
            </a>
            <a href="/digitalna-platforma" className="rounded-lg bg-pink-600/20 px-4 py-3 text-center text-sm text-pink-300 transition hover:bg-pink-600/30">
              🌐 Digitalna Platforma
            </a>
            <a href="/omega-projekat-plasiranje" className="rounded-lg bg-teal-600/20 px-4 py-3 text-center text-sm text-teal-300 transition hover:bg-teal-600/30">
              🚀 OMEGA Plasiranje
            </a>
            <a href="/omega-projekat-zvanicno-otvaranje" className="rounded-lg bg-violet-600/20 px-4 py-3 text-center text-sm text-violet-300 transition hover:bg-violet-600/30">
              🎉 OMEGA Otvaranje
            </a>
            <a href="/spaja-univerzalni-prompt" className="rounded-lg bg-lime-600/20 px-4 py-3 text-center text-sm text-lime-300 transition hover:bg-lime-600/30">
              🎯 Univerzalni Prompt
            </a>
            <a href="/proksi-github-deploy" className="rounded-lg bg-gray-600/20 px-4 py-3 text-center text-sm text-gray-300 transition hover:bg-gray-600/30">
              🐙 GitHub Deploy
            </a>
            <a href="/proksi-wifi-antena" className="rounded-lg bg-sky-600/20 px-4 py-3 text-center text-sm text-sky-300 transition hover:bg-sky-600/30">
              📶 WiFi Antena
            </a>
            <a href="/pricing" className="rounded-lg bg-green-600/20 px-4 py-3 text-center text-sm text-green-300 transition hover:bg-green-600/30">
              💰 Pricing
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
