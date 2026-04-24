// Autofinish #988 — Dashboard CoverageWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishCoverageReportResult } from '@/lib/autofinish-petlja';

interface Props {
  coverage: AutofinishCoverageReportResult;
}

/**
 * CoverageWidget — prikazuje pokrivenost autofinish kategorija postotnim barovima.
 */
export function CoverageWidget({ coverage }: Props) {
  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Pokrivenost autofinish kategorija"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📊 </span>Pokrivenost Kategorija
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Globalna pokrivenost:{' '}
        <span className="text-white font-mono font-bold">{coverage.globalnaPokrivenostPct}%</span>
        {' '}— {coverage.ukupnoIteracija} iteracija, {coverage.ukupnoKategorija} kategorija
      </p>

      {/* Global progress bar */}
      <div
        className="h-2 rounded bg-gray-800 mb-4"
        role="progressbar"
        aria-valuenow={coverage.globalnaPokrivenostPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Globalna pokrivenost: ${coverage.globalnaPokrivenostPct}%`}
      >
        <div
          className="h-2 rounded bg-green-500 transition-all"
          style={{ width: `${coverage.globalnaPokrivenostPct}%` }}
          aria-hidden="true"
        />
      </div>

      <ul className="space-y-3" role="list" aria-label="Pokrivenost po kategorijama">
        {coverage.kategorije.map((kat) => (
          <li key={kat.kategorija} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">
                {kat.potpunoPokrivena && <span aria-hidden="true" className="text-green-400 mr-1">✓</span>}
                {kat.labelSr}
              </span>
              <span className="text-gray-400 font-mono text-xs">
                {kat.pokriveno}/{kat.ukupno} ({kat.pokrivenostPct}%)
              </span>
            </div>
            <div
              className="h-1.5 rounded bg-gray-800"
              role="progressbar"
              aria-valuenow={kat.pokrivenostPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${kat.labelSr}: ${kat.pokrivenostPct}%`}
            >
              <div
                className={`h-1.5 rounded transition-all ${kat.potpunoPokrivena ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${kat.pokrivenostPct}%` }}
                aria-hidden="true"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-coverage"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi coverage podatke kao JSON API"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
