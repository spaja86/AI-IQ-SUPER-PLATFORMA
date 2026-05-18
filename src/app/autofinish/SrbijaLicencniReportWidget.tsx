// Autofinish #1263 — Dashboard SrbijaLicencniReportWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishSrbijaLicencniReport } from '@/lib/autofinish-petlja';

interface Props {
  report: AutofinishSrbijaLicencniReport;
}

export function SrbijaLicencniReportWidget({ report }: Props) {
  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Autofinish Srbija licencni report"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🇷🇸 </span>AI IQ WORLD BANK — Srbija licence
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Režim <span className="text-white font-mono">{report.rezimNabavke}</span> — iteracija{' '}
        <span className="text-white font-mono">#{report.autofinishBroj}</span>
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Ukupno licenci</div>
          <div className="text-xl font-bold text-cyan-300 font-mono">{report.ukupnoLicenci}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">U nabavci</div>
          <div className="text-xl font-bold text-yellow-300 font-mono">{report.uNabavci}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Kritični gapovi</div>
          <div className="text-xl font-bold text-red-300 font-mono">{report.kriticniGapovi}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Coverage</div>
          <div className="text-xl font-bold text-green-400 font-mono">{report.coverageProcenat}%</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr,1fr]">
        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Top delatnosti za Srbiju</h3>
          <ul className="space-y-2" role="list">
            {report.topDelatnosti.map((item) => (
              <li key={item.delatnost} className="rounded bg-gray-800/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-white">{item.delatnost}</span>
                  <span className="text-[11px] font-mono text-yellow-300">{item.uNabavci} u nabavci</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Ukupno licenci: <span className="text-gray-200">{item.ukupnoLicenci}</span> · kritični gapovi:{' '}
                  <span className="text-gray-200">{item.kriticniGapovi}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Prioritetne licence za kupovinu</h3>
          <ul className="space-y-2" role="list">
            {report.topLicenceZaNabavku.map((item) => (
              <li key={`${item.delatnost}-${item.licenca}`} className="rounded bg-gray-800/60 p-3">
                <div className="text-sm text-white">{item.licenca}</div>
                <div className="mt-1 text-xs text-gray-400">{item.delatnost}</div>
                <div className="mt-2 text-[11px] text-gray-500">
                  Rizik: <span className="text-gray-300">{item.rizik}</span> · partner{' '}
                  <span className="text-gray-300">{item.partnerNaziv}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <span>
          Regulatori: <span className="text-gray-300">{report.regulatori.join(', ')}</span>
        </span>
        <a
          href="/api/autofinish-srbija-licencni-report"
          className="text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi Srbija licencni report kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
