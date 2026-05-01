// Autofinish #1086 — Dashboard ErrorBudgetWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishErrorBudgetResult, AutofinishErrorBudgetServis, AutofinishErrorBudgetStatus } from '@/lib/autofinish-petlja';

interface Props { budget: AutofinishErrorBudgetResult; }

const STATUS_STYLE: Record<AutofinishErrorBudgetStatus, string> = {
  zdravo:     'text-green-400 bg-green-900/30',
  upozorenje: 'text-yellow-400 bg-yellow-900/30',
  kriticno:   'text-orange-400 bg-orange-900/30',
  iscrpljen:  'text-red-400 bg-red-900/40',
};

const STATUS_EMOJI: Record<AutofinishErrorBudgetStatus, string> = {
  zdravo:     '🟢',
  upozorenje: '🟡',
  kriticno:   '🟠',
  iscrpljen:  '🔴',
};

function BudzetBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const color =
    clamped >= 90 ? 'bg-red-500' :
    clamped >= 60 ? 'bg-orange-400' :
    clamped >= 30 ? 'bg-yellow-400' : 'bg-green-500';
  return (
    <div className="w-full h-1.5 rounded bg-gray-700 overflow-hidden" aria-hidden="true">
      <div className={`h-full rounded transition-all ${color}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function ErrorBudgetWidget({ budget }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<AutofinishErrorBudgetStatus | 'svi'>('svi');
  const statusi: (AutofinishErrorBudgetStatus | 'svi')[] = ['svi', 'zdravo', 'upozorenje', 'kriticno', 'iscrpljen'];
  const filtered: AutofinishErrorBudgetServis[] =
    filter === 'svi' ? budget.servisi : budget.servisi.filter((s) => s.status === filter);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Error budget po servisima">
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📊 </span>Error Budget
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{budget.ukupnoServisa}</span> servisa ·{' '}
        <span className="text-green-400 font-mono">{budget.zdravih}</span> zdravih ·{' '}
        <span className="text-yellow-400 font-mono">{budget.uUpozorenju}</span> u upozorenju ·{' '}
        <span className="text-orange-400 font-mono">{budget.kriticnih}</span> kritičnih ·{' '}
        <span className="text-red-400 font-mono">{budget.iscrpljenih}</span> iscrpljenih ·{' '}
        Prosj. potrošnja: <span className="text-blue-400 font-mono">{budget.prosjecnaPotrosenjaOst}%</span>
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter po statusu">
        {statusi.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === s ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
            aria-pressed={filter === s}
          >
            {s}
          </button>
        ))}
      </div>
      <ul className="space-y-1" role="list">
        {filtered.map((servis) => {
          const isOpen = selected === servis.id;
          return (
            <li key={servis.id}>
              <button
                className="w-full flex items-center gap-2 text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors"
                onClick={() => setSelected(isOpen ? null : servis.id)}
                aria-expanded={isOpen}
                aria-label={`${servis.naziv}: ${servis.status}, potrošeno ${servis.potrosenoPct}%`}
              >
                <span aria-hidden="true">{STATUS_EMOJI[servis.status]}</span>
                <span className="flex-1 text-gray-300 truncate">{servis.naziv}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${STATUS_STYLE[servis.status]}`}>{servis.status}</span>
                <span className="text-gray-500 font-mono text-xs w-14 text-right">{servis.potrosenoPct}%</span>
                <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="ml-4 mb-2 space-y-1.5">
                  <BudzetBar pct={servis.potrosenoPct} />
                  <p className="text-xs text-gray-400">{servis.napomena}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>SLO cilj: <span className="text-gray-300 font-mono">{servis.sloTarget}%</span></span>
                    <span>SLO aktual: <span className="text-gray-300 font-mono">{servis.sloAktual}%</span></span>
                    <span>Prozor: <span className="text-gray-300 font-mono">{servis.prozorDana}d</span></span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Potrošeno: <span className="text-gray-300 font-mono">{servis.potroseno}min</span></span>
                    <span>Preostalo: <span className="text-gray-300 font-mono">{servis.preostalo}min</span></span>
                    <span>Dozvoljeno: <span className="text-gray-300 font-mono">{servis.dozvoljeneGreskePct}%</span></span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-error-budget"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="JSON API error budget"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
