// Autofinish #1113 — Dashboard PodsistemiZdravljeWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishPodsistemiZdravljeResult,
  AutofinishPodsistemZdravlje,
} from '@/lib/autofinish-petlja';

interface Props { zdravlje: AutofinishPodsistemiZdravljeResult; }

const STATUS_STYLE: Record<AutofinishPodsistemZdravlje['status'], string> = {
  ok:       'text-green-400 bg-green-900/30 border-green-800',
  warning:  'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  error:    'text-red-400 bg-red-900/30 border-red-800',
  critical: 'text-red-300 bg-red-950/40 border-red-700',
};

const STATUS_EMOJI: Record<AutofinishPodsistemZdravlje['status'], string> = {
  ok:       '✅',
  warning:  '⚠️',
  error:    '❌',
  critical: '🔥',
};

const BAR_COLOR: Record<AutofinishPodsistemZdravlje['status'], string> = {
  ok:       'bg-green-500',
  warning:  'bg-yellow-500',
  error:    'bg-red-500',
  critical: 'bg-red-700',
};

function HealthBar({ zdravlje, status }: { zdravlje: number; status: AutofinishPodsistemZdravlje['status'] }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2" role="progressbar" aria-valuenow={zdravlje} aria-valuemin={0} aria-valuemax={100} aria-label={`Zdravlje: ${zdravlje}%`}>
      <div
        className={`h-2 rounded-full transition-all duration-300 ${BAR_COLOR[status]}`}
        style={{ width: `${Math.min(100, Math.max(0, zdravlje))}%` }}
      />
    </div>
  );
}

export function PodsistemiZdravljeWidget({ zdravlje: result }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const okCount      = result.podsistemi.filter((p) => p.status === 'ok').length;
  const warningCount = result.podsistemi.filter((p) => p.status === 'warning').length;
  const errorCount   = result.podsistemi.filter((p) => p.status === 'error' || p.status === 'critical').length;
  const avgZdravlje = result.podsistemi.length > 0
    ? Math.round(result.podsistemi.reduce((s, p) => s + p.zdravlje, 0) / result.podsistemi.length)
    : 0;

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Zdravlje podsistema"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🏥 </span>Zdravlje Podsistema
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Prosječno zdravlje:{' '}
        <span className={`font-mono font-semibold ${avgZdravlje >= 95 ? 'text-green-400' : avgZdravlje >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
          {avgZdravlje}%
        </span>{' · '}
        <span className="text-green-400 font-mono">{okCount}</span> ok ·{' '}
        <span className="text-yellow-400 font-mono">{warningCount}</span> upozorenja ·{' '}
        <span className="text-red-400 font-mono">{errorCount}</span> greška
      </p>

      <ul className="space-y-3" role="list">
        {result.podsistemi.map((p) => {
          const isOpen = expanded === p.naziv;
          return (
            <li key={p.naziv} className={`rounded-lg border px-4 py-3 ${STATUS_STYLE[p.status]}`}>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="text-base shrink-0">{STATUS_EMOJI[p.status]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-white truncate">{p.naziv}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${STATUS_STYLE[p.status]}`} aria-label={`Status: ${p.status}`}>
                        {p.status}
                      </span>
                      <span className="text-white font-mono text-sm font-bold">{p.zdravlje}%</span>
                      <button
                        onClick={() => setExpanded(isOpen ? null : p.naziv)}
                        className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                        aria-expanded={isOpen}
                        aria-controls={`podsistem-detail-${p.naziv.replace(/\s+/g, '-')}`}
                      >
                        {isOpen ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                  <HealthBar zdravlje={p.zdravlje} status={p.status} />
                </div>
              </div>

              {isOpen && (
                <div
                  id={`podsistem-detail-${p.naziv.replace(/\s+/g, '-')}`}
                  className="mt-3 grid grid-cols-4 gap-2 text-xs border-t border-gray-700 pt-3"
                >
                  <div className="rounded bg-gray-800 px-2 py-1.5 text-center">
                    <div className="text-gray-400 mb-0.5">Ukupno</div>
                    <div className="text-white font-mono font-semibold">{p.ukupnoProvera}</div>
                  </div>
                  <div className="rounded bg-green-900/30 px-2 py-1.5 text-center">
                    <div className="text-green-400 mb-0.5">Uspješnih</div>
                    <div className="text-white font-mono font-semibold">{p.uspesnih}</div>
                  </div>
                  <div className="rounded bg-yellow-900/30 px-2 py-1.5 text-center">
                    <div className="text-yellow-400 mb-0.5">Upozorenja</div>
                    <div className="text-white font-mono font-semibold">{p.upozorenja}</div>
                  </div>
                  <div className="rounded bg-red-900/30 px-2 py-1.5 text-center">
                    <div className="text-red-400 mb-0.5">Grešaka</div>
                    <div className="text-white font-mono font-semibold">{p.gresaka}</div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-podsistemi-zdravlje"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi zdravlje podsistema kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
