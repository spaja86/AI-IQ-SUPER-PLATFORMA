// Autofinish #1124 — Dashboard DeploymentPipelineWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishDeploymentPipelineResult,
  AutofinishDeploymentFazaStatus,
  AutofinishDeploymentOkidac,
  AutofinishDeploymentTrend,
} from '@/lib/autofinish-petlja';

interface Props { pipeline: AutofinishDeploymentPipelineResult; }

const FAZA_STATUS_STYLE: Record<AutofinishDeploymentFazaStatus, string> = {
  ok:      'text-green-400 bg-green-900/30 border-green-800',
  running: 'text-blue-400 bg-blue-900/30 border-blue-800',
  failed:  'text-red-400 bg-red-900/40 border-red-800',
  skipped: 'text-gray-500 bg-gray-800/40 border-gray-700',
};

const FAZA_STATUS_EMOJI: Record<AutofinishDeploymentFazaStatus, string> = {
  ok:      '✅',
  running: '🔄',
  failed:  '❌',
  skipped: '⏭️',
};

const FAZA_EMOJI: Record<string, string> = {
  build:  '🏗️',
  test:   '🧪',
  deploy: '🚀',
  verify: '✔️',
};

const OKIDAC_EMOJI: Record<AutofinishDeploymentOkidac, string> = {
  push:     '⬆️',
  pr:       '🔀',
  manual:   '🖐️',
  schedule: '⏰',
  tag:      '🏷️',
};

const TREND_BADGE: Record<AutofinishDeploymentTrend, string> = {
  raste:    '↑',
  pada:     '↓',
  stabilno: '→',
};

const TREND_COLOR: Record<AutofinishDeploymentTrend, string> = {
  raste:    'text-green-400',
  pada:     'text-red-400',
  stabilno: 'text-gray-400',
};

const ALL_STATUSI: Array<AutofinishDeploymentFazaStatus | 'svi'> = [
  'svi', 'ok', 'running', 'failed', 'skipped',
];

function ProgressBar({ posto }: { posto: number }) {
  const color =
    posto >= 90 ? 'bg-green-500' :
    posto >= 70 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1" aria-hidden="true">
      <div
        className={`${color} h-1.5 rounded-full transition-all`}
        style={{ width: `${posto}%` }}
      />
    </div>
  );
}

export function DeploymentPipelineWidget({ pipeline }: Props) {
  const [statusFilter, setStatusFilter] = useState<AutofinishDeploymentFazaStatus | 'svi'>('svi');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = pipeline.pipelines.filter((p) =>
    statusFilter === 'svi' || p.status === statusFilter,
  );

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="CI/CD Deployment Pipeline pregled"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🚀 </span>Deployment Pipeline
      </h2>

      {/* Summary row */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <span className="text-gray-500">
          Ukupno: <span className="text-white font-mono font-semibold">{pipeline.ukupnoPipeline}</span>
        </span>
        <span className="text-green-400">✅ {pipeline.uspjesnih} uspješnih</span>
        <span className="text-blue-400">🔄 {pipeline.aktivnih} aktivnih</span>
        <span className="text-red-400">❌ {pipeline.neuspjesnih} neuspješnih</span>
        <span className="text-gray-500">⏭️ {pipeline.preskocenih} preskočenih</span>
        <span className="text-gray-400 ml-auto">
          Ø trajanje: <span className="text-white font-mono">{pipeline.prosjecnoTrajanjeSekundi}s</span>
        </span>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-1 mb-4" role="group" aria-label="Filter po statusu">
        {ALL_STATUSI.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs px-2 py-0.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              statusFilter === s
                ? 'bg-blue-700 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
            aria-pressed={statusFilter === s}
          >
            {s === 'svi' ? 'Svi' : `${FAZA_STATUS_EMOJI[s as AutofinishDeploymentFazaStatus]} ${s}`}
          </button>
        ))}
      </div>

      {/* Pipeline list */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Nema pipeline-a za odabrani filter.</p>
      ) : (
        <ul className="space-y-3" role="list">
          {filtered.map((p) => {
            const isOpen = expanded === p.id;
            return (
              <li
                key={p.id}
                className={`rounded-lg border px-4 py-3 ${FAZA_STATUS_STYLE[p.status]}`}
              >
                {/* Pipeline header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span aria-hidden="true" className="text-base shrink-0">
                      {FAZA_STATUS_EMOJI[p.status]}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-white truncate">{p.servis}</span>
                      <span className="block text-xs text-gray-400 font-mono truncate">
                        {p.grana} · {p.commitSha.slice(0, 7)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-300"
                      aria-label={`Okidač: ${p.okidac}`}
                    >
                      {OKIDAC_EMOJI[p.okidac]} {p.okidac}
                    </span>
                    <span
                      className={`text-xs font-semibold ${TREND_COLOR[p.trendUspjeha]}`}
                      aria-label={`Trend uspjeha: ${p.trendUspjeha}`}
                    >
                      {TREND_BADGE[p.trendUspjeha]}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{p.trajanjeSekundi}s</span>
                    <button
                      onClick={() => setExpanded(isOpen ? null : p.id)}
                      className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      aria-expanded={isOpen}
                      aria-controls={`pipeline-detail-${p.id}`}
                    >
                      {isOpen ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {/* Faze mini-badges (always visible) */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {p.faze.map((f) => (
                    <span
                      key={f.naziv}
                      className={`text-xs px-2 py-0.5 rounded border font-semibold ${FAZA_STATUS_STYLE[f.status]}`}
                      aria-label={`Faza ${f.naziv}: ${f.status}`}
                    >
                      {FAZA_EMOJI[f.naziv] ?? '⚙️'} {f.naziv}
                    </span>
                  ))}
                </div>

                {/* postoUspijeha bar */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Uspješnost</span>
                    <span
                      className={`font-mono font-bold ${p.postoUspijeha >= 90 ? 'text-green-400' : p.postoUspijeha >= 70 ? 'text-yellow-400' : 'text-red-400'}`}
                    >
                      {p.postoUspijeha}%
                    </span>
                  </div>
                  <ProgressBar posto={p.postoUspijeha} />
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div
                    id={`pipeline-detail-${p.id}`}
                    className="mt-3 text-xs text-gray-400 border-t border-gray-700 pt-3 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded bg-gray-800 px-2 py-1.5">
                        <div className="text-gray-500 mb-0.5">Početak</div>
                        <div className="text-white font-mono text-xs">{p.pocetakISO.slice(0, 19).replace('T', ' ')}</div>
                      </div>
                      <div className="rounded bg-gray-800 px-2 py-1.5">
                        <div className="text-gray-500 mb-0.5">Prethodni deploy</div>
                        <div className="text-white font-mono text-xs">{p.prethodniDeployISO.slice(0, 19).replace('T', ' ')}</div>
                      </div>
                    </div>

                    {/* Faze table */}
                    <div className="mt-2">
                      <div className="text-gray-500 mb-1 font-semibold">Faze:</div>
                      <div className="space-y-1">
                        {p.faze.map((f) => (
                          <div key={f.naziv} className="flex items-center justify-between px-2 py-1 rounded bg-gray-800/60">
                            <span className="flex items-center gap-1.5">
                              <span aria-hidden="true">{FAZA_EMOJI[f.naziv] ?? '⚙️'}</span>
                              <span className="text-gray-300 font-semibold">{f.naziv}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold ${FAZA_STATUS_STYLE[f.status].split(' ')[0]}`}
                              >
                                {FAZA_STATUS_EMOJI[f.status]} {f.status}
                              </span>
                              {f.trajanjeSekundi > 0 && (
                                <span className="text-gray-500 font-mono">{f.trajanjeSekundi}s</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
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
          href="/api/autofinish-deployment-pipeline"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi deployment pipeline kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
