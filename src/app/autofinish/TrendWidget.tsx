// Autofinish #968 — Dashboard TrendWidget (Client Component)
// Autofinish #969 — Unit testovi Dashboard TrendWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishKategorijaTrendEntry } from '@/lib/autofinish-petlja';

interface Props {
  /** Trend po kategorijama — pre-computed server-side */
  kategorije: AutofinishKategorijaTrendEntry[];
  window: number;
  autofinishBroj: number;
  verzija: string;
}

const SMJER_CONFIG: Record<string, { label: string; className: string; symbol: string }> = {
  up: { label: 'Rast', className: 'text-green-400 bg-green-900/30', symbol: '▲' },
  down: { label: 'Pad', className: 'text-red-400 bg-red-900/30', symbol: '▼' },
  stable: { label: 'Stabilno', className: 'text-gray-400 bg-gray-800/50', symbol: '─' },
};

const KATEGORIJA_EMOJI: Record<string, string> = {
  helper: '🔧',
  'unit-test': '🧪',
  'api-route': '🌐',
  'integration-test': '🔗',
  'dashboard-widget': '🖼️',
  'widget-unit-test': '🧩',
  e2e: '🔄',
  ostalo: '📦',
};

/**
 * TrendWidget — prikazuje rolling window trend po svakoj autofinish kategoriji.
 * Svaki red prikazuje: emoji, naziv kategorije, ukupan broj iteracija, trend %, smjer badge.
 */
export function TrendWidget({ kategorije, window: w, autofinishBroj, verzija }: Props) {
  if (kategorije.length === 0) {
    return (
      <section
        className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
        aria-label="Trend po kategorijama"
      >
        <h2 className="text-lg font-semibold text-gray-300 mb-4">
          <span aria-hidden="true">📈 </span>Trend po Kategorijama
        </h2>
        <p className="text-gray-500 text-sm">Nema podataka za prikaz.</p>
      </section>
    );
  }

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Trend po kategorijama"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📈 </span>Trend po Kategorijama
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Rolling window{' '}
        <span className="text-white font-mono">{w}</span>,
        verzija <span className="text-white font-mono">{verzija}</span>,
        iteracija <span className="text-white font-mono">#{autofinishBroj}</span>
      </p>

      <table
        className="w-full text-sm"
        role="table"
        aria-label="Trend po kategorijama tabela"
      >
        <thead>
          <tr className="text-gray-500 text-xs border-b border-gray-800">
            <th className="text-left pb-2 font-normal" scope="col">Kategorija</th>
            <th className="text-right pb-2 font-normal" scope="col">Ukupno</th>
            <th className="text-right pb-2 font-normal" scope="col">Trend %</th>
            <th className="text-right pb-2 font-normal" scope="col">Smjer</th>
          </tr>
        </thead>
        <tbody>
          {kategorije.map((kat) => {
            const emoji = KATEGORIJA_EMOJI[kat.kategorija] ?? '📦';
            const cfg = SMJER_CONFIG[kat.smjer] ?? SMJER_CONFIG.stable;

            return (
              <tr
                key={kat.kategorija}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-2 pr-4">
                  <span aria-hidden="true" className="mr-1">{emoji}</span>
                  <span className="text-gray-300">{kat.labelSr}</span>
                </td>
                <td className="py-2 text-right text-gray-400 font-mono">
                  {kat.ukupno}
                </td>
                <td className="py-2 text-right font-mono text-gray-400">
                  {kat.trendProcent > 0 ? '+' : ''}{kat.trendProcent}%
                </td>
                <td className="py-2 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${cfg.className}`}
                    aria-label={`${cfg.label} za ${kat.labelSr}`}
                  >
                    <span aria-hidden="true">{cfg.symbol}</span>
                    {cfg.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-trend-kategorije"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi trend po kategorijama kao JSON API"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
