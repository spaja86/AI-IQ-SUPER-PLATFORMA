// Autofinish #1013 — Dashboard ExportWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type { AutofinishExportSummary } from '@/lib/autofinish-petlja';

interface Props { exportData: AutofinishExportSummary; }

export function ExportWidget({ exportData }: Props) {
  const fields = [
    { label: 'Verzija', value: exportData.verzija },
    { label: 'Autofinish Broj', value: `#${exportData.autofinishBroj}` },
    { label: 'Zdravlje', value: `${exportData.zdravlje.zdravlje}%` },
    { label: 'Health Score', value: `${exportData.healthScore.skor}/100 (${exportData.healthScore.ocjena})` },
    { label: 'Roadmap Progres', value: `${exportData.roadmap.progres}%` },
    { label: 'Coverage', value: `${exportData.coverage.globalnaPokrivenostPct}%` },
    { label: 'Velocity', value: `${exportData.velocity.brzinaPoSatima} iter/dan` },
    { label: 'Zavisnosti', value: `${exportData.dependencies.ukupnoPodsistema} podsistema` },
    { label: 'Generisano', value: new Date(exportData.generisanoU).toLocaleString('sr-RS') },
  ];
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Export summary svih autofinish metrika">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">📦 </span>Export Summary</h2>
      <p className="text-sm text-gray-500 mb-4">Kompletan pregled svih autofinish metrika</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="list">
        {fields.map((f) => (
          <div key={f.label} className="flex justify-between text-sm py-1 border-b border-gray-800/50 last:border-0" role="listitem">
            <dt className="text-gray-500">{f.label}</dt>
            <dd className="text-gray-300 font-mono text-xs text-right">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 text-right"><a href="/api/autofinish-export" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="Preuzmi kompletni export kao JSON API">JSON API →</a></div>
    </section>
  );
}
