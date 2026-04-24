// Autofinish #1030 — Dashboard SistemPlanoviWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type { AutofinishSistemPlanoviResult, AutofinishPlanStatus } from '@/lib/autofinish-petlja';

interface Props { planovi: AutofinishSistemPlanoviResult; }

const STATUS_STYLE: Record<AutofinishPlanStatus, string> = {
  'planiran': 'text-blue-400 bg-blue-900/30',
  'u-toku': 'text-yellow-400 bg-yellow-900/30',
  'završen': 'text-green-400 bg-green-900/30',
  'odgođen': 'text-gray-400 bg-gray-800/60',
};

const STATUS_EMOJI: Record<AutofinishPlanStatus, string> = {
  'planiran': '📋',
  'u-toku': '🔄',
  'završen': '✅',
  'odgođen': '⏸',
};

const PRIORITET_COLOR: Record<number, string> = {
  1: 'text-red-400',
  2: 'text-orange-400',
  3: 'text-yellow-400',
  4: 'text-blue-400',
  5: 'text-gray-400',
};

export function SistemPlanoviWidget({ planovi }: Props) {
  const sorted = [...planovi.planovi].sort((a, b) => a.prioritet - b.prioritet);
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Sistemski planovi razvoja">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🗺️ </span>Sistem Planovi</h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-blue-400 font-mono">{planovi.planirani}</span> planirani ·{' '}
        <span className="text-yellow-400 font-mono">{planovi.uToku}</span> u toku ·{' '}
        <span className="text-green-400 font-mono">{planovi.zavrseni}</span> završeni
      </p>
      <ul className="space-y-2" role="list">
        {sorted.map((p) => {
          const stCls = STATUS_STYLE[p.status];
          const priCls = PRIORITET_COLOR[p.prioritet] ?? 'text-gray-400';
          return (
            <li key={p.id} className="flex items-start gap-3 text-sm py-1.5 border-b border-gray-800/50 last:border-0">
              <span className={`mt-0.5 text-base flex-shrink-0`} aria-hidden="true">{STATUS_EMOJI[p.status]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-300 font-medium truncate">{p.naziv}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${stCls}`}>{p.status}</span>
                  <span className={`text-[10px] font-mono ${priCls}`}>P{p.prioritet}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5 truncate">{p.opis}</p>
                <p className="text-gray-600 text-[10px] mt-0.5">Rok: {p.rokISO} · Iteracija #{p.ciljnaBrojIteracija}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-sistem-planovi" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
