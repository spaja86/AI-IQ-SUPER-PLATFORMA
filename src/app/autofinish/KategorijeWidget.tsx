// Autofinish #955 — Dashboard Kategorije Widget (Client Component)
// Autofinish #956 — Unit testovi Dashboard Kategorije Widget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React, { useState } from 'react';
import type { AutofinishKategorijaEntry } from '@/lib/autofinish-petlja';

interface Props {
  /** Kategorije pre-computed server-side */
  kategorije: AutofinishKategorijaEntry[];
  ukupnoIteracija: number;
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

/**
 * KategorijeWidget — prikazuje autofinish iteracije grupisane po kategorijama.
 * Svaka kategorija je klikabilna i razvija listu iteracija.
 */
export function KategorijeWidget({ kategorije, ukupnoIteracija, autofinishBroj, verzija }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Kategorije autofinish iteracija"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📂 </span>Kategorije
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-white font-mono">{kategorije.length}</span> kategorija,{' '}
        <span className="text-white font-mono">{ukupnoIteracija}</span> iteracija ukupno —
        verzija <span className="text-white font-mono">{verzija}</span>,
        iteracija <span className="text-white font-mono">#{autofinishBroj}</span>
      </p>

      {kategorije.length === 0 ? (
        <p className="text-gray-500 text-sm">Nema kategorija za prikaz.</p>
      ) : (
        <ul className="space-y-1" role="list" aria-label="Lista kategorija">
          {kategorije.map((kat) => {
            const emoji = KATEGORIJA_EMOJI[kat.kategorija] ?? '📦';
            const isOpen = expanded === kat.kategorija;
            const pct = ukupnoIteracija > 0
              ? Math.round((kat.ukupno / ukupnoIteracija) * 100)
              : 0;

            return (
              <li key={kat.kategorija}>
                <button
                  className="w-full flex items-center gap-3 text-sm text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded px-2 py-2 transition-colors"
                  onClick={() => setExpanded((prev) => (prev === kat.kategorija ? null : kat.kategorija))}
                  aria-expanded={isOpen}
                  aria-label={`${emoji} ${kat.labelSr}: ${kat.ukupno} iteracija (${pct}%)`}
                >
                  <span aria-hidden="true" className="w-5 text-center flex-shrink-0">{emoji}</span>
                  <span className="text-gray-300 flex-1">{kat.labelSr}</span>
                  <span className="text-gray-500 font-mono text-xs flex-shrink-0 min-w-[3rem] text-right">
                    {kat.ukupno} ({pct}%)
                  </span>
                  <span className="text-gray-600 text-xs flex-shrink-0 ml-1" aria-hidden="true">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isOpen && (
                  <div className="ml-8 mt-1 mb-2">
                    {/* Progress bar */}
                    <div className="h-1 rounded bg-gray-800 mb-2">
                      <div
                        className="h-1 rounded bg-blue-500"
                        style={{ width: `${pct}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <ol
                      className="space-y-0.5 max-h-48 overflow-y-auto text-xs text-gray-500"
                      role="list"
                      aria-label={`Iteracije u kategoriji ${kat.labelSr}`}
                    >
                      {kat.iteracije.map((it) => (
                        <li key={it.broj} className="flex gap-2 px-1 py-0.5 hover:bg-gray-800/30 rounded">
                          <span className="text-gray-600 font-mono flex-shrink-0">#{it.broj}</span>
                          <span className="text-gray-400">{it.opis}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-2 text-right">
                      <a
                        href={`/api/autofinish-kategorije`}
                        className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                        aria-label="JSON API za sve kategorije"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        JSON API →
                      </a>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-kategorije"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi kategorije kao JSON API"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
