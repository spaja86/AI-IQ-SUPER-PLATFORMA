// Autofinish #935 — Dashboard Iteracija Raspon Widget (Client Component)
// Autofinish #936 — Unit testovi Dashboard Iteracija Raspon Widget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React, { useState } from 'react';
import type { AutofinishMilestoneIteracija } from '@/lib/autofinish-petlja';

interface Props {
  /** The last N iterations to display (pre-computed server-side) */
  iteracije: AutofinishMilestoneIteracija[];
  autofinishBroj: number;
  verzija: string;
}

/**
 * IteracijaRasponWidget — prikazuje listu posled. N iteracija sa brojem i opisom.
 * Korisnik može otvoriti detalje (expand) svakog reda.
 */
export function IteracijaRasponWidget({ iteracije, autofinishBroj, verzija }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Poslednje iteracije autofinish petlje"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🔄 </span>Poslednje Iteracije
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Poslednjih <span className="text-white font-mono">{iteracije.length}</span> iteracija —
        verzija <span className="text-white font-mono">{verzija}</span>,
        iteracija <span className="text-white font-mono">#{autofinishBroj}</span>
      </p>

      {iteracije.length === 0 ? (
        <p className="text-gray-500 text-sm">Nema iteracija za prikaz.</p>
      ) : (
        <ul
          className="space-y-1 max-h-96 overflow-y-auto pr-1"
          role="list"
          aria-label="Lista poslednjih iteracija"
        >
          {iteracije.map((it) => (
            <li key={it.broj}>
              <button
                className="w-full flex items-start gap-3 text-sm text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded px-2 py-1.5 transition-colors"
                onClick={() => setExpanded((prev) => (prev === it.broj ? null : it.broj))}
                aria-expanded={expanded === it.broj}
                aria-label={`Iteracija #${it.broj}: ${it.opis}`}
              >
                <span className="text-gray-500 font-mono min-w-[3rem] flex-shrink-0">
                  #{it.broj}
                </span>
                <span className="text-gray-300 flex-1">{it.opis}</span>
                <span className="text-gray-600 text-xs flex-shrink-0" aria-hidden="true">
                  {expanded === it.broj ? '▲' : '▼'}
                </span>
              </button>
              {expanded === it.broj && (
                <div className="ml-14 mt-1 mb-2 text-xs text-gray-500 bg-gray-800 rounded px-3 py-2">
                  <div>
                    <span className="text-gray-400">Broj: </span>
                    <span className="text-white font-mono">#{it.broj}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-400">Opis: </span>
                    <span className="text-gray-200">{it.opis}</span>
                  </div>
                  <div className="mt-1">
                    <a
                      href={`/api/autofinish-iteracija-raspon?od=${it.broj}&do=${it.broj}`}
                      className="text-blue-400 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`JSON API za iteraciju #${it.broj}`}
                    >
                      JSON API →
                    </a>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-iteracija-raspon"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi iteracija raspon kao JSON API"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
