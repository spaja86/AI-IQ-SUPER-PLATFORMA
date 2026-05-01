// Autofinish #1109 — Dashboard CapacityPlanningWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishCapacityPlanningResult,
  AutofinishCapacityResource,
  AutofinishCapacityStatus,
} from '@/lib/autofinish-petlja';

interface Props { capacity: AutofinishCapacityPlanningResult; }

const STATUS_STYLE: Record<AutofinishCapacityStatus, string> = {
  ok:         'text-green-400 bg-green-900/30',
  upozorenje: 'text-yellow-400 bg-yellow-900/30',
  kriticno:   'text-red-400 bg-red-900/40',
};

const STATUS_EMOJI: Record<AutofinishCapacityStatus, string> = {
  ok:         '🟢',
  upozorenje: '🟡',
  kriticno:   '🔴',
};

const TIP_EMOJI: Record<AutofinishCapacityResource['tip'], string> = {
  cpu:      '🖥️',
  memorija: '🧠',
  disk:     '💾',
  mreza:    '🌐',
  baza:     '🗄️',
};

const TREND_BADGE: Record<AutofinishCapacityResource['trend'], string> = {
  raste:    '↑ raste',
  pada:     '↓ pada',
  stabilan: '→ stabilan',
};

function UtilBar({ pct, threshold }: { pct: number; threshold: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const color =
    pct >= 90 ? 'bg-red-500' :
    pct >= threshold ? 'bg-yellow-400' : 'bg-green-500';
  return (
    <div className="relative w-full h-2 rounded bg-gray-700 overflow-hidden" aria-hidden="true">
      <div className={`h-full rounded transition-all ${color}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function CapacityPlanningWidget({ capacity }: Props) {
  const [filter, setFilter] = useState<AutofinishCapacityStatus | 'svi'>('svi');
  const [expanded, setExpanded] = useState<string | null>(null);

  const statusi: (AutofinishCapacityStatus | 'svi')[] = ['svi', 'ok', 'upozorenje', 'kriticno'];
  const filtered: AutofinishCapacityResource[] =
    filter === 'svi'
      ? capacity.resursi
      : capacity.resursi.filter((r) => r.status === filter);

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Capacity planning — resursi"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📈 </span>Capacity Planning
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{capacity.ukupnoResursa}</span> resursa ·{' '}
        <span className="text-green-400 font-mono">{capacity.ok}</span> ok ·{' '}
        <span className="text-yellow-400 font-mono">{capacity.uUpozorenju}</span> upozorenje ·{' '}
        <span className="text-red-400 font-mono">{capacity.kriticnih}</span> kritično ·{' '}
        Prosj. iskorištenost: <span className="text-blue-400 font-mono">{capacity.prosjecnaIskorištenost}%</span>
      </p>

      <div className="flex flex-wrap gap-1 mb-4" role="group" aria-label="Filter po statusu kapaciteta">
        {statusi.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              filter === s
                ? 'bg-blue-700 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
            aria-pressed={filter === s}
            aria-label={`Filter: ${s}`}
          >
            {s === 'svi' ? 'Svi' : `${STATUS_EMOJI[s]} ${s}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">Nema resursa za odabrani filter.</p>
      ) : (
        <ul className="space-y-3" role="list">
          {filtered.map((r) => {
            const isOpen = expanded === r.id;
            return (
              <li
                key={r.id}
                className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span aria-hidden="true" className="text-base shrink-0">{TIP_EMOJI[r.tip]}</span>
                    <div className="min-w-0">
                      <span className="block text-sm font-medium text-white truncate">{r.naziv}</span>
                      <span className="block text-xs text-gray-500 truncate">{r.servis}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_STYLE[r.status]}`}
                      aria-label={`Status: ${r.status}`}
                    >
                      {STATUS_EMOJI[r.status]} {r.status}
                    </span>
                    <button
                      onClick={() => setExpanded(isOpen ? null : r.id)}
                      className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      aria-expanded={isOpen}
                      aria-controls={`cap-detail-${r.id}`}
                    >
                      {isOpen ? '▲ manje' : '▼ više'}
                    </button>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                    <span>Iskorištenost</span>
                    <span className="font-mono">{r.iskorištenostPct}%</span>
                  </div>
                  <UtilBar pct={r.iskorištenostPct} threshold={r.pragUpozorenjaPct} />
                </div>

                {isOpen && (
                  <div
                    id={`cap-detail-${r.id}`}
                    className="mt-3 space-y-1 text-xs text-gray-400 border-t border-gray-700 pt-3"
                  >
                    <div className="flex justify-between">
                      <span>Kapacitet</span>
                      <span className="font-mono">{r.kapacitetPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prag upozorenja</span>
                      <span className="text-yellow-400 font-mono">{r.pragUpozorenjaPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prag kritično</span>
                      <span className="text-red-400 font-mono">{r.pragKriticnoPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trend</span>
                      <span className={`font-mono ${r.trend === 'raste' ? 'text-orange-400' : r.trend === 'pada' ? 'text-green-400' : 'text-gray-400'}`}>
                        {TREND_BADGE[r.trend]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prognoza 7d</span>
                      <span className={`font-mono ${r.prognoza7dPct >= r.pragKriticnoPct ? 'text-red-400' : r.prognoza7dPct >= r.pragUpozorenjaPct ? 'text-yellow-400' : 'text-green-400'}`}>
                        {r.prognoza7dPct}%
                      </span>
                    </div>
                    <div className="mt-1.5 text-yellow-300 bg-yellow-900/20 rounded px-2 py-1.5">
                      💡 {r.preporuka}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-capacity-planning"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi capacity planning kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
