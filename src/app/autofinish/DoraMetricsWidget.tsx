// Autofinish #1111 — Dashboard DoraMetricsWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishDoraMetricsResult,
  AutofinishDoraMetric,
  AutofinishDoraRating,
} from '@/lib/autofinish-petlja';

interface Props { dora: AutofinishDoraMetricsResult; }

const RATING_STYLE: Record<AutofinishDoraRating, string> = {
  elite:  'text-purple-300 bg-purple-900/40 border-purple-700',
  high:   'text-green-400 bg-green-900/30 border-green-800',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  low:    'text-red-400 bg-red-900/40 border-red-800',
};

const RATING_EMOJI: Record<AutofinishDoraRating, string> = {
  elite:  '🏆',
  high:   '🟢',
  medium: '🟡',
  low:    '🔴',
};

const METRIC_EMOJI: Record<string, string> = {
  'dora-deployment-frequency': '🚀',
  'dora-lead-time':            '⏱️',
  'dora-change-failure-rate':  '💥',
  'dora-mttr':                 '🔧',
};

const TREND_BADGE: Record<AutofinishDoraMetric['trend'], string> = {
  raste:    '↑',
  pada:     '↓',
  stabilan: '→',
};

function Sparkline({ points }: { points: AutofinishDoraMetric['sparkline'] }) {
  if (points.length < 2) return null;
  const max = Math.max(...points.map((p) => p.vrijednost));
  const min = Math.min(...points.map((p) => p.vrijednost));
  const range = max - min || 1;
  const W = 80; const H = 28;
  const xs = points.map((_, i) => (i / (points.length - 1)) * W);
  const ys = points.map((p) => H - ((p.vrijednost - min) / range) * (H - 4) - 2);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  return (
    <svg width={W} height={H} aria-hidden="true" className="shrink-0 opacity-70">
      <polyline points={xs.map((x, i) => `${x},${ys[i]}`).join(' ')} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function DoraMetricsWidget({ dora }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="DORA metrike DevOps"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📊 </span>DORA Metrike
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Period: <span className="text-white font-mono">{dora.period}</span> ·{' '}
        <span className="text-purple-300 font-mono">{dora.eliteCount}</span> elite ·{' '}
        <span className="text-green-400 font-mono">{dora.highCount}</span> high ·{' '}
        <span className="text-yellow-400 font-mono">{dora.mediumCount}</span> medium ·{' '}
        <span className="text-red-400 font-mono">{dora.lowCount}</span> low
      </p>

      <ul className="space-y-3" role="list">
        {dora.metrike.map((m) => {
          const isOpen = expanded === m.id;
          const trendColor =
            m.id === 'dora-deployment-frequency'
              ? m.trend === 'raste' ? 'text-green-400' : m.trend === 'pada' ? 'text-red-400' : 'text-gray-400'
              : m.trend === 'pada' ? 'text-green-400' : m.trend === 'raste' ? 'text-red-400' : 'text-gray-400';

          return (
            <li
              key={m.id}
              className={`rounded-lg border px-4 py-3 ${RATING_STYLE[m.rating]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span aria-hidden="true" className="text-base shrink-0">{METRIC_EMOJI[m.id] ?? '📈'}</span>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-white truncate">{m.naziv}</span>
                    <span className="block text-xs text-gray-400 truncate">{m.opis}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Sparkline points={m.sparkline} />
                  <div className="text-right">
                    <span className="block text-lg font-bold text-white font-mono">
                      {m.vrijednost}
                      <span className="text-xs text-gray-400 font-normal ml-1">{m.jedinica}</span>
                    </span>
                    <span className={`text-xs font-semibold ${trendColor}`} aria-label={`Trend: ${m.trend}`}>
                      {TREND_BADGE[m.trend]} {m.trend}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border ${RATING_STYLE[m.rating]}`}
                    aria-label={`Rating: ${m.rating}`}
                  >
                    {RATING_EMOJI[m.rating]} {m.rating}
                  </span>
                  <button
                    onClick={() => setExpanded(isOpen ? null : m.id)}
                    className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                    aria-expanded={isOpen}
                    aria-controls={`dora-detail-${m.id}`}
                  >
                    {isOpen ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div
                  id={`dora-detail-${m.id}`}
                  className="mt-3 space-y-1.5 text-xs text-gray-400 border-t border-gray-700 pt-3"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded bg-purple-900/30 px-2 py-1.5 text-center">
                      <div className="text-purple-300 font-semibold mb-0.5">🏆 Elite</div>
                      <div>{m.eliteTarget}</div>
                    </div>
                    <div className="rounded bg-green-900/20 px-2 py-1.5 text-center">
                      <div className="text-green-400 font-semibold mb-0.5">🟢 High</div>
                      <div>{m.highTarget}</div>
                    </div>
                    <div className="rounded bg-yellow-900/20 px-2 py-1.5 text-center">
                      <div className="text-yellow-400 font-semibold mb-0.5">🟡 Medium</div>
                      <div>{m.mediumTarget}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500 mr-2">Historija:</span>
                    {m.sparkline.map((sp) => (
                      <span key={sp.period} className="mr-3 text-gray-300 font-mono">
                        <span className="text-gray-500">{sp.period}:</span> {sp.vrijednost}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-dora-metrics"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi DORA metrike kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
