// Autofinish #1022 — Dashboard KpiScorecardWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type { AutofinishKpiScorecardResult, AutofinishKpiStatus } from '@/lib/autofinish-petlja';

interface Props { scorecard: AutofinishKpiScorecardResult; }

const STATUS_STYLE: Record<AutofinishKpiStatus, { cls: string; label: string }> = {
  'postignut': { cls: 'text-green-400 bg-green-900/30', label: '✅ Postignut' },
  'u-toku': { cls: 'text-yellow-400 bg-yellow-900/30', label: '🔄 U toku' },
  'zaostaje': { cls: 'text-red-400 bg-red-900/30', label: '⚠️ Zaostaje' },
};

export function KpiScorecardWidget({ scorecard }: Props) {
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="KPI Scorecard">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">📊 </span>KPI Scorecard</h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-green-400 font-mono">{scorecard.postignutih}</span> postignutih ·{' '}
        <span className="text-yellow-400 font-mono">{scorecard.uToku}</span> u toku ·{' '}
        <span className="text-red-400 font-mono">{scorecard.zaostaje}</span> zaostaje
      </p>
      <table className="w-full text-xs" role="table" aria-label="KPI metrike">
        <thead>
          <tr className="text-gray-600 text-left border-b border-gray-800">
            <th scope="col" className="pb-1 pr-2 font-normal">KPI</th>
            <th scope="col" className="pb-1 pr-2 font-normal text-right">Vrijednost</th>
            <th scope="col" className="pb-1 pr-2 font-normal text-right">Cilj</th>
            <th scope="col" className="pb-1 font-normal text-right">%</th>
            <th scope="col" className="pb-1 pl-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {scorecard.kpis.map((k) => {
            const style = STATUS_STYLE[k.status];
            return (
              <tr key={k.id} className="border-b border-gray-800/50 last:border-0">
                <td className="py-1.5 pr-2 text-gray-300">{k.naziv}</td>
                <td className="py-1.5 pr-2 text-right font-mono text-gray-400">{k.vrijednost} <span className="text-gray-600 text-[10px]">{k.jedinica}</span></td>
                <td className="py-1.5 pr-2 text-right font-mono text-gray-500">{k.cilj}</td>
                <td className="py-1.5 text-right font-mono">{k.postotakCilja}%</td>
                <td className="py-1.5 pl-2"><span className={`px-1.5 py-0.5 rounded text-[10px] ${style.cls}`} aria-label={style.label}>{style.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3 text-right"><a href="/api/autofinish-kpi-scorecard" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
