// Autofinish #1257 — Dashboard AuditReportWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishAuditReport } from '@/lib/autofinish-petlja';

interface Props {
  report: AutofinishAuditReport;
}

const STATUS_STYLE: Record<string, string> = {
  zavrsena: 'text-green-300 bg-green-950/30 border-green-800',
  ponavljanje: 'text-yellow-300 bg-yellow-950/30 border-yellow-800',
  u_toku: 'text-blue-300 bg-blue-950/30 border-blue-800',
};

function formatPct(value: number): string {
  return `${Math.round(value)}%`;
}

export function AuditReportWidget({ report }: Props) {
  const statusStyle = STATUS_STYLE[report.petljaStatus.status] ?? 'text-gray-300 bg-gray-900 border-gray-800';
  const topPodsistemi = report.podsistemi.podsistemi.slice(0, 6);

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Autofinish audit report pregled"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🧾 </span>Audit Report
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Verzija <span className="text-white font-mono">{report.verzija}</span> — iteracija{' '}
        <span className="text-white font-mono">#{report.autofinishBroj}</span>
      </p>

      <div className={`rounded-lg border px-4 py-3 mb-4 ${statusStyle}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">Status petlje: {report.petljaStatus.status}</div>
            <p className="text-xs mt-1 text-gray-200">{report.petljaStatus.statusOpis}</p>
          </div>
          <div className="text-right text-xs text-gray-200">
            <div>Progres: <span className="font-mono text-white">{report.petljaStatus.progres}</span></div>
            <div>Podsistemi: <span className="font-mono text-white">{report.petljaStatus.podsistemiNa100}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Rute</div>
          <div className="text-xl font-bold text-white font-mono">{report.ekosistem.rute}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">API rute</div>
          <div className="text-xl font-bold text-cyan-300 font-mono">{report.ekosistem.apiRute}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Zdravlje</div>
          <div className="text-xl font-bold text-green-400 font-mono">{formatPct(report.zdravlje.zdravlje)}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Preostalo</div>
          <div className="text-xl font-bold text-yellow-300 font-mono">{report.progress.preostalo}</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr,0.9fr]">
        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-200">Top podsistemi u auditu</h3>
            <span className="text-xs text-gray-500">{report.podsistemi.ukupnoPodsistema} ukupno</span>
          </div>
          <ul className="space-y-2" role="list">
            {topPodsistemi.map((podsistem) => (
              <li key={podsistem.id} className="rounded bg-gray-800/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">{podsistem.naziv}</span>
                  <span className="text-xs font-mono text-blue-300">{podsistem.progres}%</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{podsistem.opis}</p>
                <div className="mt-2 text-[11px] text-gray-500">Status: <span className="text-gray-300">{podsistem.status}</span></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Kontrolne tačke</h3>
          <dl className="space-y-3 text-sm">
            <div className="rounded bg-gray-800/60 p-3">
              <dt className="text-xs text-gray-500">Ekosistem snapshot</dt>
              <dd className="mt-1 text-gray-200">
                {report.ekosistem.stranice} stranica · {report.ekosistem.dijagnostike} dijagnostika · {report.ekosistem.igrice} igrica
              </dd>
            </div>
            <div className="rounded bg-gray-800/60 p-3">
              <dt className="text-xs text-gray-500">Progress</dt>
              <dd className="mt-1 text-gray-200">
                {report.progress.procenat}% ka cilju · do kraja još {report.progress.preostalo}
              </dd>
            </div>
            <div className="rounded bg-gray-800/60 p-3">
              <dt className="text-xs text-gray-500">Petlja</dt>
              <dd className="mt-1 text-gray-200">
                Iteracija petlje {report.petljaStatus.iteracijaPetlje}/{report.petljaStatus.maksIteracija}
              </dd>
            </div>
          </dl>

          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-400 mb-2">Status podsistema</div>
            <ul className="space-y-1.5 text-xs text-gray-300" role="list">
              {report.petljaStatus.podsistemi.slice(0, 4).map((podsistem) => (
                <li key={podsistem.id} className="rounded bg-gray-800/60 px-2.5 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span>{podsistem.ikona} {podsistem.naziv}</span>
                    <span className="font-mono text-gray-400">{podsistem.progres}</span>
                  </div>
                  <div className="mt-1 text-gray-500">{podsistem.status}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-audit-report"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi audit report kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
