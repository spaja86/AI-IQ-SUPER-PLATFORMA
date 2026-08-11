'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Dashboard Klijent
// Kompanija SPAJA — Digitalna Industrija
// Dashboard sa Omega Auth podacima

import { useState } from 'react';
import { dohvatiSesiju, obrisiSesiju, type OmegaSesija } from '@/lib/auth/omega-session-client';
import { OMEGA_AI_PERSONA_COUNT, SPAJA_PRO_RANGE, TOTAL_PAGES, TOTAL_IGRICA } from '@/lib/constants';
import Button from '@/components/Button';

type DashboardLink = {
  href: string;
  title: string;
  description?: string;
  emoji: string;
  className: string;
};

const brziPristupLinkovi: DashboardLink[] = [
  { href: '/spaja-pro', title: 'SpajaPro AI Chat', emoji: '🤖', className: 'rounded-lg bg-blue-600/20 px-4 py-3 text-center text-sm text-blue-300 transition hover:bg-blue-600/30' },
  { href: '/prompt', title: 'Prompt Konzola', emoji: '💬', className: 'rounded-lg bg-purple-600/20 px-4 py-3 text-center text-sm text-purple-300 transition hover:bg-purple-600/30' },
  { href: '/igrice', title: `Igrice (${TOTAL_IGRICA})`, emoji: '🎮', className: 'rounded-lg bg-green-600/20 px-4 py-3 text-center text-sm text-green-300 transition hover:bg-green-600/30' },
  { href: '/omega-ai', title: 'OMEGA AI', emoji: '🧠', className: 'rounded-lg bg-yellow-600/20 px-4 py-3 text-center text-sm text-yellow-300 transition hover:bg-yellow-600/30' },
  { href: '/platforme', title: 'Platforme', emoji: '🧩', className: 'rounded-lg bg-cyan-600/20 px-4 py-3 text-center text-sm text-cyan-300 transition hover:bg-cyan-600/30' },
  { href: '/ekosistem', title: 'Ekosistem', emoji: '🌐', className: 'rounded-lg bg-pink-600/20 px-4 py-3 text-center text-sm text-pink-300 transition hover:bg-pink-600/30' },
  { href: '/industrija', title: 'Industrija', emoji: '🏭', className: 'rounded-lg bg-orange-600/20 px-4 py-3 text-center text-sm text-orange-300 transition hover:bg-orange-600/30' },
  { href: '/spaja-digitalni-kompjuter', title: 'Digitalni Kompjuter', emoji: '🖥️', className: 'rounded-lg bg-indigo-600/20 px-4 py-3 text-center text-sm text-indigo-300 transition hover:bg-indigo-600/30' },
];

const preporuceniLinkovi: DashboardLink[] = [
  { href: '/prompt', title: 'Prompt Konzola', description: 'Izvrsite jedan od 28+ promptova u SpajaPro engine-u. Promptovi se cuvaju u istoriji.', emoji: '💬', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-purple-500/30 hover:bg-purple-900/10' },
  { href: '/spaja-digitalni-brouvzer', title: 'Digitalni Brouvzer', description: 'SPAJA sopstveni pregledac sa vlastitim motorom i transparentnim frontend-om.', emoji: '🌐', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-blue-500/30 hover:bg-blue-900/10' },
  { href: '/io-openui-ao-gaming-platforma', title: 'Gaming Platforma', description: `${TOTAL_IGRICA} igrica u 18 kategorija — Dota 1350, DOTAMASTER, TRANSFORMERS, BUBLI BABLI, Poker i jos mnogo toga.`, emoji: '🎮', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-green-500/30 hover:bg-green-900/10' },
  { href: '/digitalni-televizor', title: 'Digitalni Televizor', description: 'Univerzalni digitalni TV sa 12 kanala — zabava, sport, vesti, edukacija.', emoji: '📺', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-yellow-500/30 hover:bg-yellow-900/10' },
  { href: '/banka', title: 'SPAJA Banka', description: 'Digitalna banka sa racunima, transferima, kreditima i investicijama.', emoji: '🏦', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-emerald-500/30 hover:bg-emerald-900/10' },
  { href: '/menjacnica', title: 'SPAJA Menjacnica', description: 'Kripto i fiat menjacnica sa AI optimizacijom portfolio-a.', emoji: '💱', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-amber-500/30 hover:bg-amber-900/10' },
  { href: '/monitoring-live', title: 'Monitoring Live', description: 'Twitch-like streaming platforma za pracenje sistema u realnom vremenu.', emoji: '📡', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-red-500/30 hover:bg-red-900/10' },
  { href: '/digitalna-observatorija', title: 'Digitalna Observatorija', description: 'Standalone modul za pracenje instrumenata, nebeskih meta, sesija i anomalija.', emoji: '🔭', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-sky-500/30 hover:bg-sky-900/10' },
  { href: '/spaja-render-medija', title: 'Render Medija', description: 'Renderovanje slika i video sadrzaja sa naprednim AI filterima.', emoji: '🎬', className: 'group rounded-xl border border-gray-700/30 bg-gray-800/30 p-4 transition hover:border-pink-500/30 hover:bg-pink-900/10' },
];

const dodatniLinkovi: DashboardLink[] = [
  { href: '/omega-ai-suport', title: 'OMEGA AI Suport', emoji: '📞', className: 'rounded-lg bg-teal-600/20 px-4 py-3 text-center text-sm text-teal-300 transition hover:bg-teal-600/30' },
  { href: '/io-openui-ao-laboratorija', title: 'Laboratorija', emoji: '🔬', className: 'rounded-lg bg-violet-600/20 px-4 py-3 text-center text-sm text-violet-300 transition hover:bg-violet-600/30' },
  { href: '/spaja-generator-engine', title: 'Generator Engine', emoji: '⚙️', className: 'rounded-lg bg-lime-600/20 px-4 py-3 text-center text-sm text-lime-300 transition hover:bg-lime-600/30' },
  { href: '/dimenzije', title: 'Dimenzije', emoji: '🌀', className: 'rounded-lg bg-fuchsia-600/20 px-4 py-3 text-center text-sm text-fuchsia-300 transition hover:bg-fuchsia-600/30' },
  { href: '/proksi', title: 'Proksi Mreza', emoji: '🛡️', className: 'rounded-lg bg-rose-600/20 px-4 py-3 text-center text-sm text-rose-300 transition hover:bg-rose-600/30' },
  { href: '/mobilna-mreza', title: 'Mobilna Mreza', emoji: '📱', className: 'rounded-lg bg-sky-600/20 px-4 py-3 text-center text-sm text-sky-300 transition hover:bg-sky-600/30' },
  { href: '/deploy', title: 'Deploy Status', emoji: '🚀', className: 'rounded-lg bg-emerald-600/20 px-4 py-3 text-center text-sm text-emerald-300 transition hover:bg-emerald-600/30' },
  { href: '/auto-popravka', title: 'Auto-Popravka', emoji: '🔧', className: 'rounded-lg bg-amber-600/20 px-4 py-3 text-center text-sm text-amber-300 transition hover:bg-amber-600/30' },
  { href: '/security', title: 'Bezbednost', emoji: '🔐', className: 'rounded-lg bg-red-600/20 px-4 py-3 text-center text-sm text-red-300 transition hover:bg-red-600/30' },
  { href: '/ai-platforma', title: 'AI Platforma', emoji: '🧠', className: 'rounded-lg bg-blue-600/20 px-4 py-3 text-center text-sm text-blue-300 transition hover:bg-blue-600/30' },
  { href: '/blog', title: 'Blog & FAQ', emoji: '📰', className: 'rounded-lg bg-gray-600/20 px-4 py-3 text-center text-sm text-gray-300 transition hover:bg-gray-600/30' },
  { href: '/unit-testovi', title: 'Unit Testovi', emoji: '🧪', className: 'rounded-lg bg-green-600/20 px-4 py-3 text-center text-sm text-green-300 transition hover:bg-green-600/30' },
  { href: '/it-proizvodi', title: 'IT Proizvodi', emoji: '⚡', className: 'rounded-lg bg-cyan-600/20 px-4 py-3 text-center text-sm text-cyan-300 transition hover:bg-cyan-600/30' },
  { href: '/kompanija', title: 'Kompanija', emoji: '🏗️', className: 'rounded-lg bg-indigo-600/20 px-4 py-3 text-center text-sm text-indigo-300 transition hover:bg-indigo-600/30' },
  { href: '/organizacija', title: 'Organizacija', emoji: '🌍', className: 'rounded-lg bg-purple-600/20 px-4 py-3 text-center text-sm text-purple-300 transition hover:bg-purple-600/30' },
  { href: '/oktavne-eksponencijalne-funkcije', title: 'Oktavne Funkcije', emoji: '🎵', className: 'rounded-lg bg-yellow-600/20 px-4 py-3 text-center text-sm text-yellow-300 transition hover:bg-yellow-600/30' },
  { href: '/ai-iq-monitoring', title: 'AI Monitoring', emoji: '🔍', className: 'rounded-lg bg-orange-600/20 px-4 py-3 text-center text-sm text-orange-300 transition hover:bg-orange-600/30' },
  { href: '/digitalna-platforma', title: 'Digitalna Platforma', emoji: '🌐', className: 'rounded-lg bg-pink-600/20 px-4 py-3 text-center text-sm text-pink-300 transition hover:bg-pink-600/30' },
  { href: '/omega-projekat-plasiranje', title: 'OMEGA Plasiranje', emoji: '🚀', className: 'rounded-lg bg-teal-600/20 px-4 py-3 text-center text-sm text-teal-300 transition hover:bg-teal-600/30' },
  { href: '/omega-projekat-zvanicno-otvaranje', title: 'OMEGA Otvaranje', emoji: '🎉', className: 'rounded-lg bg-violet-600/20 px-4 py-3 text-center text-sm text-violet-300 transition hover:bg-violet-600/30' },
  { href: '/spaja-univerzalni-prompt', title: 'Univerzalni Prompt', emoji: '🎯', className: 'rounded-lg bg-lime-600/20 px-4 py-3 text-center text-sm text-lime-300 transition hover:bg-lime-600/30' },
  { href: '/proksi-github-deploy', title: 'GitHub Deploy', emoji: '🐙', className: 'rounded-lg bg-gray-600/20 px-4 py-3 text-center text-sm text-gray-300 transition hover:bg-gray-600/30' },
  { href: '/proksi-wifi-antena', title: 'WiFi Antena', emoji: '📶', className: 'rounded-lg bg-sky-600/20 px-4 py-3 text-center text-sm text-sky-300 transition hover:bg-sky-600/30' },
  { href: '/pricing', title: 'Pricing', emoji: '💰', className: 'rounded-lg bg-green-600/20 px-4 py-3 text-center text-sm text-green-300 transition hover:bg-green-600/30' },
];

function normalizeSearchValue(value: string) {
  return value.toLowerCase().trim();
}

function matchesSearch(link: DashboardLink, searchValue: string) {
  if (!searchValue) return true;

  return normalizeSearchValue([link.title, link.description, link.href].filter(Boolean).join(' ')).includes(searchValue);
}

export default function DashboardKlijent() {
  const [sesija, setSesija] = useState<OmegaSesija | null>(() => {
    if (typeof window === 'undefined') return null;
    return dohvatiSesiju();
  });
  const [searchQuery, setSearchQuery] = useState('');

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
  const searchValue = normalizeSearchValue(searchQuery);
  const filteredBrziPristupLinkovi = brziPristupLinkovi.filter((link) => matchesSearch(link, searchValue));
  const filteredPreporuceniLinkovi = preporuceniLinkovi.filter((link) => matchesSearch(link, searchValue));
  const filteredDodatniLinkovi = dodatniLinkovi.filter((link) => matchesSearch(link, searchValue));
  const hasSearch = searchValue.length > 0;
  const hasSearchResults =
    filteredBrziPristupLinkovi.length > 0 ||
    filteredPreporuceniLinkovi.length > 0 ||
    filteredDodatniLinkovi.length > 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">📊 Dashboard</h2>
            <p className="text-sm text-gray-400">{sesija?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 transition hover:border-red-500 hover:text-red-400"
          >
            Odjavi se
          </Button>
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
              <div className="mt-1 text-xl font-bold text-white">{OMEGA_AI_PERSONA_COUNT}</div>
              <div className="text-[10px] text-gray-500">OMEGA AI</div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3 text-center">
              <div className="text-lg">🌟</div>
              <div className="mt-1 text-xl font-bold text-white">v{SPAJA_PRO_RANGE}</div>
              <div className="text-[10px] text-gray-500">SpajaPro</div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3 text-center">
              <div className="text-lg">📄</div>
              <div className="mt-1 text-xl font-bold text-white">{TOTAL_PAGES}</div>
              <div className="text-[10px] text-gray-500">Stranice</div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">🔎 Pretraga dashboard-a</h3>
              <p className="text-sm text-gray-400">Pretrazite precice, preporuke i dodatne module.</p>
            </div>
            {hasSearch && (
              <Button
                onClick={() => setSearchQuery('')}
                className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-400 hover:text-white"
              >
                Ocisti pretragu
              </Button>
            )}
          </div>
          <label className="block">
            <span className="sr-only">Pretraga dashboard linkova</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Pretrazite npr. AI, banka, gaming, deploy..."
              className="w-full rounded-xl border border-gray-700 bg-gray-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
            />
          </label>
          {hasSearch && (
            <p className="mt-3 text-sm text-gray-400">
              {hasSearchResults
                ? `Pronadjeni rezultati za: “${searchQuery.trim()}”`
                : `Nema rezultata za: “${searchQuery.trim()}”`}
            </p>
          )}
        </div>

        {/* Brzi pristup */}
        {filteredBrziPristupLinkovi.length > 0 && (
          <div className="mb-8 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">🚀 Brzi pristup</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredBrziPristupLinkovi.map((link) => (
                <a key={link.href} href={link.href} className={link.className}>
                  {link.emoji} {link.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Preporuke — Sta treba da probas */}
        {filteredPreporuceniLinkovi.length > 0 && (
          <div className="mb-8 rounded-2xl border border-purple-700/30 bg-purple-900/10 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">💡 Preporuke — Sta da probate</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredPreporuceniLinkovi.map((link) => (
                <a key={link.href} href={link.href} className={link.className}>
                  <div className="mb-2 text-lg">{link.emoji}</div>
                  <div className="text-sm font-medium text-white group-hover:text-purple-300">{link.title}</div>
                  <div className="mt-1 text-xs text-gray-400">{link.description}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Istrazite jos — dodatne funkcije */}
        {filteredDodatniLinkovi.length > 0 && (
          <div className="mb-8 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">🔍 Istrazite jos</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredDodatniLinkovi.map((link) => (
                <a key={link.href} href={link.href} className={link.className}>
                  {link.emoji} {link.title}
                </a>
              ))}
            </div>
          </div>
        )}

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
