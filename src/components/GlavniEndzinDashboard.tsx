'use client';

import { useEffect, useState } from 'react';

interface MonitoringData {
  monitoring: {
    status: string;
    verzija: string;
    kompletnost: string;
    uptime: string;
  };
  endzini: {
    ukupnoSpojenih: number;
    aktivnih: number;
    uOptimizaciji: number;
    uGenerisanju: number;
    prosecnaOptimizacija: string;
    distribucija: {
      tip: string;
      ukupno: number;
      aktivno: number;
      prosecnaOptimizacija: number;
    }[];
  };
  autoSklapanje: {
    ukupnoSklopljeno: number;
    platforme: { ukupno: number; kompletnost: string };
    igrice: { ukupno: number; kompletnost: string };
    itProizvodi: { ukupno: number; kompletnost: string };
  };
  evolucija: {
    ukupnoCiklusa: number;
    aktivnih: number;
    zavrsenih: number;
    planiranih: number;
    prosecniNapredak: number;
  };
}

const tipIkone: Record<string, string> = {
  core: '🌟',
  ai: '🧠',
  mreza: '📡',
  finansije: '💰',
  gaming: '🎮',
  deploy: '🚀',
  bezbednost: '🔒',
  komunikacija: '📧',
  'repo-engine': '📦',
};

const tipBoje: Record<string, string> = {
  core: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ai: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  mreza: 'bg-green-500/20 text-green-400 border-green-500/30',
  finansije: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  gaming: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  deploy: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  bezbednost: 'bg-red-500/20 text-red-400 border-red-500/30',
  komunikacija: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'repo-engine': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
};

function StatusPuls({ aktivan }: { aktivan: boolean }) {
  return (
    <span className="relative inline-flex h-3 w-3">
      {aktivan && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      )}
      <span className={`relative inline-flex h-3 w-3 rounded-full ${aktivan ? 'bg-green-500' : 'bg-gray-500'}`} />
    </span>
  );
}

function MetrikaKartica({ naslov, vrednost, ikona, opis }: { naslov: string; vrednost: string | number; ikona: string; opis?: string }) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>{ikona}</span>
        <span>{naslov}</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{vrednost}</div>
      {opis && <div className="mt-1 text-xs text-gray-500">{opis}</div>}
    </div>
  );
}

function ProgressBar({ vrednost, label }: { vrednost: number; label: string }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span>{vrednost}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
          style={{ width: `${vrednost}%` }}
        />
      </div>
    </div>
  );
}

export default function GlavniEndzinDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [vreme, setVreme] = useState(new Date());

  useEffect(() => {
    fetch('/api/dijagnostika-glavni-endzin-monitoring')
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.error('Monitoring API greška:', err))
      .finally(() => setLoading(false));

    const timer = setInterval(() => setVreme(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0ms' }} />
            <div className="h-3 w-3 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '150ms' }} />
            <div className="h-3 w-3 animate-bounce rounded-full bg-blue-300" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-gray-400">Učitavanje monitoring dashboard-a...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-yellow-600/30 bg-yellow-900/20 p-6 text-center text-yellow-400">
        ⚠️ Monitoring podaci nisu dostupni
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏭⚙️</span>
            <div>
              <h2 className="text-xl font-bold text-white">Monitoring Dashboard</h2>
              <p className="text-sm text-gray-400">Glavni Endžin Digitalne Industrije v{data.monitoring.verzija}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StatusPuls aktivan={data.monitoring.status === 'aktivan'} />
              <span className="text-sm font-medium text-green-400">AKTIVAN</span>
            </div>
            <div className="rounded-lg bg-gray-700/50 px-3 py-1 text-xs font-mono text-gray-300">
              {vreme.toLocaleTimeString('sr-RS')}
            </div>
          </div>
        </div>
      </div>

      {/* Metrike */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetrikaKartica naslov="Spojeni endžini" vrednost={data.endzini.ukupnoSpojenih} ikona="⚙️" opis="Ukupno spojenih u Glavnom Endžinu" />
        <MetrikaKartica naslov="Aktivni" vrednost={data.endzini.aktivnih} ikona="✅" opis="Endžini u aktivnom statusu" />
        <MetrikaKartica naslov="Sklopljeno" vrednost={data.autoSklapanje.ukupnoSklopljeno} ikona="🔧" opis="Ukupno sklopljenih proizvoda" />
        <MetrikaKartica naslov="Kompletnost" vrednost={data.monitoring.kompletnost} ikona="💯" opis="Kompletnost celokupnog sistema" />
      </div>

      {/* Distribucija endžina */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-300">📊 Distribucija endžina po tipu</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {data.endzini.distribucija.map((d) => (
            <div key={d.tip} className={`rounded-lg border p-3 ${tipBoje[d.tip] ?? 'bg-gray-700/20 text-gray-400 border-gray-600/30'}`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <span>{tipIkone[d.tip] ?? '⚙️'}</span>
                  {d.tip}
                </span>
                <span className="text-lg font-bold">{d.ukupno}</span>
              </div>
              <div className="mt-2">
                <ProgressBar vrednost={d.prosecnaOptimizacija} label="Optimizacija" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-sklapanje */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-blue-600/30 bg-blue-900/20 p-4">
          <div className="flex items-center gap-2 text-blue-400">
            <span>🌐</span>
            <span className="text-sm font-medium">Platforme</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{data.autoSklapanje.platforme.ukupno}</div>
          <div className="mt-1 text-xs text-blue-400/70">Kompletnost: {data.autoSklapanje.platforme.kompletnost}</div>
        </div>
        <div className="rounded-xl border border-pink-600/30 bg-pink-900/20 p-4">
          <div className="flex items-center gap-2 text-pink-400">
            <span>🎮</span>
            <span className="text-sm font-medium">Igrice</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{data.autoSklapanje.igrice.ukupno}</div>
          <div className="mt-1 text-xs text-pink-400/70">Kompletnost: {data.autoSklapanje.igrice.kompletnost}</div>
        </div>
        <div className="rounded-xl border border-green-600/30 bg-green-900/20 p-4">
          <div className="flex items-center gap-2 text-green-400">
            <span>📦</span>
            <span className="text-sm font-medium">IT Proizvodi</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{data.autoSklapanje.itProizvodi.ukupno}</div>
          <div className="mt-1 text-xs text-green-400/70">Kompletnost: {data.autoSklapanje.itProizvodi.kompletnost}</div>
        </div>
      </div>

      {/* Evolucija */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-300">🔄 Evolucioni ciklusi</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{data.evolucija.ukupnoCiklusa}</div>
            <div className="text-xs text-gray-400">Ukupno</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{data.evolucija.aktivnih}</div>
            <div className="text-xs text-gray-400">Aktivni</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{data.evolucija.zavrsenih}</div>
            <div className="text-xs text-gray-400">Završeni</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{data.evolucija.prosecniNapredak}%</div>
            <div className="text-xs text-gray-400">Napredak</div>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar vrednost={data.evolucija.prosecniNapredak} label="Ukupni napredak evolucije" />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600">
        Uptime: {data.monitoring.uptime} • Optimizacija: {data.endzini.prosecnaOptimizacija}
      </div>
    </div>
  );
}
