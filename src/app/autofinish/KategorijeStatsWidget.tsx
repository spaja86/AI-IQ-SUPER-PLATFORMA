// Autofinish #978 — Dashboard KategorijeStatsWidget (Client Component)
// Autofinish #979 — Unit testovi KategorijeStatsWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishKategorijaStatEntry } from '@/lib/autofinish-petlja';

interface Props {
  kategorije: AutofinishKategorijaStatEntry[];
  ukupnoIteracija: number;
  globalMin: number;
  globalMax: number;
  globalAvg: number;
  autofinishBroj: number;
  verzija: string;
}

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

function fmt(v: number | null): string {
  if (v === null) return '—';
  return v.toLocaleString('bs-BA');
}

/**
 * KategorijeStatsWidget — tabela statističkih metrika (min/max/avg/median)
 * po svakoj autofinish kategoriji, sa globalnim sumarnim redom.
 */
export function KategorijeStatsWidget({
  kategorije,
  ukupnoIteracija,
  globalMin,
  globalMax,
  globalAvg,
  autofinishBroj,
  verzija,
}: Props) {
  if (kategorije.length === 0) {
    return (
      <section
        className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
        aria-label="Statistike po kategorijama"
      >
        <h2 className="text-lg font-semibold text-gray-300 mb-4">
          <span aria-hidden="true">📊 </span>Statistike po Kategorijama
        </h2>
        <p className="text-gray-500 text-sm">Nema podataka za prikaz.</p>
      </section>
    );
  }

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Statistike po kategorijama"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📊 </span>Statistike po Kategorijama
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Ukupno{' '}
        <span className="text-white font-mono">{ukupnoIteracija}</span> iteracija,
        verzija <span className="text-white font-mono">{verzija}</span>,
        iteracija <span className="text-white font-mono">#{autofinishBroj}</span>
      </p>

      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          role="table"
          aria-label="Statistike po kategorijama tabela"
        >
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-800">
              <th className="text-left pb-2 font-normal" scope="col">Kategorija</th>
              <th className="text-right pb-2 font-normal" scope="col">Ukupno</th>
              <th className="text-right pb-2 font-normal" scope="col">Min #</th>
              <th className="text-right pb-2 font-normal" scope="col">Max #</th>
              <th className="text-right pb-2 font-normal" scope="col">Avg #</th>
              <th className="text-right pb-2 font-normal" scope="col">Median #</th>
            </tr>
          </thead>
          <tbody>
            {kategorije.map((kat) => {
              const emoji = KATEGORIJA_EMOJI[kat.kategorija] ?? '📦';
              return (
                <tr
                  key={kat.kategorija}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-2 pr-4">
                    <span aria-hidden="true" className="mr-1">{emoji}</span>
                    <span className="text-gray-300">{kat.labelSr}</span>
                  </td>
                  <td className="py-2 text-right text-gray-400 font-mono">{kat.ukupno}</td>
                  <td className="py-2 text-right text-blue-400 font-mono">{fmt(kat.minBroj)}</td>
                  <td className="py-2 text-right text-purple-400 font-mono">{fmt(kat.maxBroj)}</td>
                  <td className="py-2 text-right text-yellow-400 font-mono">{fmt(kat.avgBroj)}</td>
                  <td className="py-2 text-right text-green-400 font-mono">{fmt(kat.medianBroj)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-700 text-gray-300 font-medium">
              <td className="py-2 pr-4">
                <span aria-hidden="true" className="mr-1">∑</span>Globalno
              </td>
              <td className="py-2 text-right font-mono">{ukupnoIteracija}</td>
              <td className="py-2 text-right text-blue-400 font-mono">{fmt(globalMin)}</td>
              <td className="py-2 text-right text-purple-400 font-mono">{fmt(globalMax)}</td>
              <td className="py-2 text-right text-yellow-400 font-mono">{fmt(globalAvg)}</td>
              <td className="py-2 text-right text-gray-500 font-mono">—</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-kategorije-stats"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi statistike po kategorijama kao JSON API"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
