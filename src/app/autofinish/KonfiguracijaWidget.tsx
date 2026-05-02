// Autofinish #1122 — Dashboard KonfiguracijaWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishKonfiguracijaResult,
  AutofinishKonfiguracijaStatus,
  AutofinishKonfiguracijaKategorija,
  AutofinishKonfiguracijaOkruzenje,
  AutofinishKonfiguracijaIzvor,
} from '@/lib/autofinish-petlja';

interface Props { konfiguracija: AutofinishKonfiguracijaResult; }

const STATUS_STYLE: Record<AutofinishKonfiguracijaStatus, string> = {
  validiran:  'text-green-400 bg-green-900/30 border-green-800',
  nevazeci:   'text-red-400 bg-red-900/40 border-red-800',
  upozorenje: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  nedostaje:  'text-gray-400 bg-gray-800/50 border-gray-700',
};

const STATUS_EMOJI: Record<AutofinishKonfiguracijaStatus, string> = {
  validiran:  '✅',
  nevazeci:   '❌',
  upozorenje: '⚠️',
  nedostaje:  '❓',
};

const KATEGORIJA_EMOJI: Record<AutofinishKonfiguracijaKategorija, string> = {
  sistem:     '🖥️',
  db:         '🗄️',
  api:        '🔌',
  auth:       '🔑',
  cache:      '⚡',
  monitoring: '📊',
  sigurnost:  '🔒',
};

const OKRUZENJE_STYLE: Record<AutofinishKonfiguracijaOkruzenje, string> = {
  production:  'text-red-300 bg-red-900/30',
  staging:     'text-yellow-300 bg-yellow-900/20',
  development: 'text-blue-300 bg-blue-900/20',
  sve:         'text-gray-300 bg-gray-800/40',
};

const IZVOR_STYLE: Record<AutofinishKonfiguracijaIzvor, string> = {
  env:         'text-green-300 bg-green-900/20',
  secrets:     'text-red-300 bg-red-900/20',
  'config-file': 'text-blue-300 bg-blue-900/20',
  baza:        'text-purple-300 bg-purple-900/20',
  default:     'text-gray-300 bg-gray-800/30',
};

const ALL_STATUSI: Array<AutofinishKonfiguracijaStatus | 'svi'> = [
  'svi', 'validiran', 'upozorenje', 'nedostaje', 'nevazeci',
];
const ALL_KATEGORIJE: Array<AutofinishKonfiguracijaKategorija | 'sve'> = [
  'sve', 'sistem', 'db', 'api', 'auth', 'cache', 'monitoring', 'sigurnost',
];

function ZdravljeBar({ zdravlje }: { zdravlje: number }) {
  const color =
    zdravlje >= 80 ? 'bg-green-500' :
    zdravlje >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full bg-gray-700 rounded-full h-2 mt-1" aria-hidden="true">
      <div
        className={`${color} h-2 rounded-full transition-all`}
        style={{ width: `${zdravlje}%` }}
      />
    </div>
  );
}

export function KonfiguracijaWidget({ konfiguracija }: Props) {
  const [statusFilter, setStatusFilter] = useState<AutofinishKonfiguracijaStatus | 'svi'>('svi');
  const [kategorijaFilter, setKategorijaFilter] = useState<AutofinishKonfiguracijaKategorija | 'sve'>('sve');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = konfiguracija.parametri.filter((p) => {
    const matchStatus = statusFilter === 'svi' || p.status === statusFilter;
    const matchKat = kategorijaFilter === 'sve' || p.kategorija === kategorijaFilter;
    return matchStatus && matchKat;
  });

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Konfiguracija parametri pregled"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">⚙️ </span>Konfiguracija
      </h2>

      {/* Summary row */}
      <div className="flex flex-wrap gap-4 mb-3 text-sm">
        <span className="text-gray-500">
          Ukupno: <span className="text-white font-mono font-semibold">{konfiguracija.ukupnoParametara}</span>
        </span>
        <span className="text-green-400">
          ✅ {konfiguracija.validiranih} validiranih
        </span>
        <span className="text-yellow-400">
          ⚠️ {konfiguracija.upozorenja} upozorenja
        </span>
        <span className="text-gray-400">
          ❓ {konfiguracija.nedostaje} nedostaje
        </span>
        <span className="text-red-400">
          ❌ {konfiguracija.nevazecih} nevažećih
        </span>
      </div>

      {/* Zdravlje score */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Zdravlje konfiguracije</span>
          <span
            className={`font-mono font-bold ${konfiguracija.zdravlje >= 80 ? 'text-green-400' : konfiguracija.zdravlje >= 50 ? 'text-yellow-400' : 'text-red-400'}`}
            aria-label={`Zdravlje konfiguracije: ${konfiguracija.zdravlje}%`}
          >
            {konfiguracija.zdravlje}%
          </span>
        </div>
        <ZdravljeBar zdravlje={konfiguracija.zdravlje} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter po statusu">
          {ALL_STATUSI.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                statusFilter === s
                  ? 'bg-blue-700 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
              aria-pressed={statusFilter === s}
            >
              {s === 'svi' ? 'Svi statusi' : `${STATUS_EMOJI[s as AutofinishKonfiguracijaStatus]} ${s}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter po kategoriji">
          {ALL_KATEGORIJE.map((k) => (
            <button
              key={k}
              onClick={() => setKategorijaFilter(k)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                kategorijaFilter === k
                  ? 'bg-purple-800 border-purple-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
              aria-pressed={kategorijaFilter === k}
            >
              {k === 'sve' ? 'Sve kategorije' : `${KATEGORIJA_EMOJI[k as AutofinishKonfiguracijaKategorija]} ${k}`}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter list */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Nema parametara za odabrane filtere.</p>
      ) : (
        <ul className="space-y-2" role="list">
          {filtered.map((p) => {
            const isOpen = expanded === p.id;
            const maskedValue = p.osjetljivo ? '***' : p.vrijednost || '—';
            return (
              <li
                key={p.id}
                className={`rounded-lg border px-4 py-2 ${STATUS_STYLE[p.status]}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span aria-hidden="true" className="text-base shrink-0">{KATEGORIJA_EMOJI[p.kategorija]}</span>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-white truncate font-mono">{p.ime}</span>
                      <span className="block text-xs text-gray-500 truncate font-mono">{maskedValue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-semibold ${OKRUZENJE_STYLE[p.okruzenje]}`}
                      aria-label={`Okruženje: ${p.okruzenje}`}
                    >
                      {p.okruzenje}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-semibold ${IZVOR_STYLE[p.izvor]}`}
                      aria-label={`Izvor: ${p.izvor}`}
                    >
                      {p.izvor}
                    </span>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded border ${STATUS_STYLE[p.status]}`}
                      aria-label={`Status: ${p.status}`}
                    >
                      {STATUS_EMOJI[p.status]} {p.status}
                    </span>
                    <button
                      onClick={() => setExpanded(isOpen ? null : p.id)}
                      className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      aria-expanded={isOpen}
                      aria-controls={`konf-detail-${p.id}`}
                    >
                      {isOpen ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div
                    id={`konf-detail-${p.id}`}
                    className="mt-3 text-xs text-gray-400 border-t border-gray-700 pt-3 space-y-1.5"
                  >
                    <p>{p.opis}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="rounded bg-gray-800 px-2 py-1.5">
                        <div className="text-gray-500 mb-0.5">Kategorija</div>
                        <div className="text-white font-semibold">{KATEGORIJA_EMOJI[p.kategorija]} {p.kategorija}</div>
                      </div>
                      <div className="rounded bg-gray-800 px-2 py-1.5">
                        <div className="text-gray-500 mb-0.5">Zadnja promjena</div>
                        <div className="text-white font-mono text-xs">{p.zadnjaPromjena.slice(0, 19).replace('T', ' ')}</div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-konfiguracija"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi konfiguraciju kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
