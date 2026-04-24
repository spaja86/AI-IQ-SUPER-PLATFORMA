// Autofinish #1069 — Dashboard CostAnalyticsWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishCostAnalyticsResult, AutofinishCostService } from '@/lib/autofinish-petlja';

interface Props { cost: AutofinishCostAnalyticsResult; }

const TREND_STYLE: Record<AutofinishCostService['trend'], { cls: string; emoji: string }> = {
  'rast': { cls: 'text-red-400', emoji: '↑' },
  'pad': { cls: 'text-green-400', emoji: '↓' },
  'stabilan': { cls: 'text-gray-400', emoji: '→' },
};

export function CostAnalyticsWidget({ cost }: Props) {
  const [sort, setSort] = useState<'aktual' | 'budzet'>('aktual');
  const sorted = [...cost.services].sort((a, b) =>
    sort === 'aktual' ? b.mjesecniAktual - a.mjesecniAktual : b.mjesecniBudzet - a.mjesecniBudzet
  );
  const pokriceBoja = cost.budzetnoPokrice <= 80 ? 'text-green-400' : cost.budzetnoPokrice <= 95 ? 'text-yellow-400' : 'text-red-400';

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Cost analytics — troškovi infrastrukture">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">💰 </span>Cost Analytics</h2>
      <p className="text-sm text-gray-500 mb-3">
        Aktual: <span className="text-white font-mono">${cost.ukupnoMjesecniAktual}</span> ·{' '}
        Budžet: <span className="text-gray-300 font-mono">${cost.ukupnoMjesecniBudzet}</span> ·{' '}
        Pokriće: <span className={`font-mono font-bold ${pokriceBoja}`}>{cost.budzetnoPokrice}%</span>
        <span className="ml-2 text-gray-600">{cost.valuta}/mj</span>
      </p>
      <div className="flex gap-1 mb-3" role="group" aria-label="Sortiraj">
        {(['aktual', 'budzet'] as const).map((k) => (
          <button key={k} onClick={() => setSort(k)} className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${sort === k ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`} aria-pressed={sort === k}>{k}</button>
        ))}
      </div>
      <div className="space-y-2">
        {sorted.map((s) => {
          const pct = s.mjesecniBudzet > 0 ? Math.min(100, Math.round((s.mjesecniAktual / s.mjesecniBudzet) * 100)) : 100;
          const barColor = pct <= 80 ? 'bg-green-500' : pct <= 95 ? 'bg-yellow-500' : 'bg-red-500';
          const trend = TREND_STYLE[s.trend];
          return (
            <div key={s.id} className="rounded-lg bg-gray-800/40 border border-gray-800 p-2.5" aria-label={`${s.naziv}: $${s.mjesecniAktual} od $${s.mjesecniBudzet}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-300 text-xs truncate">{s.naziv}</span>
                  <span className={`text-[10px] ${trend.cls}`} aria-label={`Trend: ${s.trend}`}>{trend.emoji}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-white font-mono text-xs">${s.mjesecniAktual}</span>
                  <span className="text-gray-600 text-[10px]">/ ${s.mjesecniBudzet}</span>
                </div>
              </div>
              <div className="h-1 w-full rounded-full bg-gray-700 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[10px] text-gray-600 mt-1">{s.napomena}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-right"><a href="/api/autofinish-cost-analytics" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
