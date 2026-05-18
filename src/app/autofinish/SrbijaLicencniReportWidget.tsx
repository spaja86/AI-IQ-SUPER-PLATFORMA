'use client';

import React from 'react';
import type { AutofinishSrbijaLicencniReport } from '@/lib/autofinish-petlja';

interface Props {
  report: AutofinishSrbijaLicencniReport;
}

export function SrbijaLicencniReportWidget({ report }: Props) {
  const prioritetRang = { visok: 0, srednji: 1, nizak: 2 } as const;
  const topStavke = [...report.stavke]
    .sort((a, b) => prioritetRang[a.prioritet] - prioritetRang[b.prioritet])
    .slice(0, 4);

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Autofinish Srbija licencni report pregled"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📜 </span>Srbija Licencni Report
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Jurisdikcija <span className="text-white font-mono">{report.jurisdikcija}</span> — iteracija{' '}
        <span className="text-white font-mono">#{report.autofinishBroj}</span>
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-5">
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Ukupno licenci</div>
          <div className="text-xl font-bold text-blue-300 font-mono">{report.ukupnoLicenci}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Aktivna nabavka</div>
          <div className="text-xl font-bold text-green-400 font-mono">{report.aktivnaNabavka}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Budžet</div>
          <div className="text-xl font-bold text-cyan-300 font-mono">
            {report.godisnjiBudzetRSD.toLocaleString('sr-Latn')}
          </div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Rezervisano</div>
          <div className="text-xl font-bold text-yellow-300 font-mono">
            {report.rezervisanoRSD.toLocaleString('sr-Latn')}
          </div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Slobodno</div>
          <div className="text-xl font-bold text-emerald-300 font-mono">
            {report.slobodnoRSD.toLocaleString('sr-Latn')}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
        <h3 className="text-sm font-semibold text-gray-200 mb-3">Top prioritetne stavke</h3>
        <ul className="space-y-2" role="list">
          {topStavke.map((stavka) => (
            <li key={stavka.id} className="rounded bg-gray-800/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-white">{stavka.naziv}</span>
                <span className="text-[11px] font-mono text-yellow-300">{stavka.prioritet}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {stavka.regulator} · {stavka.status} · rok {stavka.rok}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-srbija-licencni-report"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi Srbija licencni report kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
