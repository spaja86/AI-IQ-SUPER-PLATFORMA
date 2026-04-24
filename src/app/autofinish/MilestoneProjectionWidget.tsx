// Autofinish #992 — Dashboard MilestoneProjectionWidget
// Kompanija SPAJA — Digitalna Industrija

'use client';

import React from 'react';
import type { AutofinishMilestoneProjectionResult } from '@/lib/autofinish-petlja';

interface Props {
  projection: AutofinishMilestoneProjectionResult;
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  done: { label: '✅ Završeno', cls: 'text-green-400' },
  active: { label: '⚡ Aktivno', cls: 'text-yellow-400' },
  pending: { label: '🕐 Na čekanju', cls: 'text-gray-400' },
};

/**
 * MilestoneProjectionWidget — ETA lista za roadmap milestones.
 */
export function MilestoneProjectionWidget({ projection }: Props) {
  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Procjena završetka milestone-a"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🗓️ </span>Procjena Završetka — ETA
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Brzina: <span className="text-white font-mono">{projection.brzinaPoSatima}</span> iter/dan —
        iteracija <span className="text-white font-mono">#{projection.autofinishBroj}</span>
      </p>

      <ul className="space-y-2" role="list" aria-label="ETA po milestonu">
        {projection.milestones.map((m) => {
          const badge = STATUS_BADGE[m.status] ?? STATUS_BADGE.pending;
          return (
            <li
              key={m.naziv}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${badge.cls}`} aria-label={`Status: ${badge.label}`}>
                  {badge.label}
                </span>
                <span className="text-sm text-gray-300">{m.naziv}</span>
              </div>
              <div className="text-xs text-gray-500 sm:text-right" aria-label={m.prognoza}>
                {m.status === 'done' ? (
                  <span className="text-green-500">Završeno</span>
                ) : (
                  <span>{m.etaISO ? m.etaISO.slice(0, 10) : '—'}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-milestone-projection"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi milestone projection podatke kao JSON API"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
