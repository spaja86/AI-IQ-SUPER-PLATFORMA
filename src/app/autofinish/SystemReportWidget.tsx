// Autofinish #1258 — Dashboard SystemReportWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishSystemReport } from '@/lib/autofinish-petlja';

interface Props {
  report: AutofinishSystemReport;
}

export function SystemReportWidget({ report }: Props) {
  const topSteps = report.nextSteps.steps.slice(0, 4);

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Autofinish system report pregled"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🧩 </span>System Report
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Verzija <span className="text-white font-mono">{report.verzija}</span> — iteracija{' '}
        <span className="text-white font-mono">#{report.autofinishBroj}</span>
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Roadmap progres</div>
          <div className="text-xl font-bold text-blue-300 font-mono">{report.roadmap.progres}%</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Zdravlje</div>
          <div className="text-xl font-bold text-green-400 font-mono">{report.zdravlje.zdravlje}%</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">API rute</div>
          <div className="text-xl font-bold text-cyan-300 font-mono">{report.statistika.apiRute}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Dijagnostike</div>
          <div className="text-xl font-bold text-yellow-300 font-mono">{report.statistika.dijagnostike}</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr,1fr]">
        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Roadmap status</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded bg-gray-800/60 p-3">
              <dt className="text-xs text-gray-500">Ukupno</dt>
              <dd className="mt-1 font-mono text-white">{report.roadmap.ukupno}</dd>
            </div>
            <div className="rounded bg-gray-800/60 p-3">
              <dt className="text-xs text-gray-500">Done</dt>
              <dd className="mt-1 font-mono text-green-300">{report.roadmap.done}</dd>
            </div>
            <div className="rounded bg-gray-800/60 p-3">
              <dt className="text-xs text-gray-500">Active</dt>
              <dd className="mt-1 font-mono text-blue-300">{report.roadmap.active}</dd>
            </div>
            <div className="rounded bg-gray-800/60 p-3">
              <dt className="text-xs text-gray-500">Pending</dt>
              <dd className="mt-1 font-mono text-gray-300">{report.roadmap.pending}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Top next steps</h3>
          <ul className="space-y-2" role="list">
            {topSteps.map((step) => (
              <li key={step.id} className="rounded bg-gray-800/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-white">{step.naziv}</span>
                  <span className="text-[11px] font-mono text-yellow-300">P{step.prioritet}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{step.opis}</p>
                <div className="mt-2 text-[11px] text-gray-500">
                  Target: <span className="text-gray-300">#{step.autofinishTarget}</span> · kategorija{' '}
                  <span className="text-gray-300">{step.kategorija}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-system-report"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi system report kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
