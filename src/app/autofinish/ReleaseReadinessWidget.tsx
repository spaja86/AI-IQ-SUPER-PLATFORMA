// Autofinish #1223 — Dashboard ReleaseReadinessWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type {
  AutofinishReleaseReadinessCheck,
  AutofinishReleaseReadyState,
  AutofinishReleaseReadinessResult,
  AutofinishReleaseReadinessStatus,
} from '@/lib/autofinish-petlja';

interface Props { readiness: AutofinishReleaseReadinessResult; }

const STATUS_STYLE: Record<AutofinishReleaseReadinessStatus, { cls: string; emoji: string }> = {
  'spremno': { cls: 'text-green-400 bg-green-900/30 border-green-800', emoji: '✅' },
  'na-rubu': { cls: 'text-yellow-400 bg-yellow-900/30 border-yellow-800', emoji: '⚠️' },
  'blokirano': { cls: 'text-red-400 bg-red-900/40 border-red-800', emoji: '⛔' },
};

const CATEGORY_STYLE: Record<AutofinishReleaseReadinessCheck['kategorija'], string> = {
  deploy: 'text-blue-300 bg-blue-900/20',
  pipeline: 'text-cyan-300 bg-cyan-900/20',
  sigurnost: 'text-red-300 bg-red-900/20',
  konfiguracija: 'text-amber-300 bg-amber-900/20',
  incidenti: 'text-orange-300 bg-orange-900/20',
  operativa: 'text-green-300 bg-green-900/20',
  infrastruktura: 'text-purple-300 bg-purple-900/20',
};

const READY_STATE_STYLE: Record<AutofinishReleaseReadyState, string> = {
  READY: 'text-emerald-300 bg-emerald-950/40 border-emerald-800',
  NOT_READY: 'text-amber-300 bg-amber-950/40 border-amber-800',
};

function ScoreBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color =
    value >= 90 ? 'bg-green-500' :
    value >= 75 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden" aria-hidden="true">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function ReleaseReadinessWidget({ readiness }: Props) {
  const overallStyle = STATUS_STYLE[readiness.status];

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Release readiness pregled"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🚦 </span>Release Readiness
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Release window: <span className="text-white font-mono">{readiness.summary.releaseWindow}</span> ·{' '}
        Captain: <span className="text-blue-300">{readiness.summary.releaseCaptain}</span>
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Overall score</div>
          <div className="text-xl font-bold text-white font-mono">{readiness.summary.overallScore}</div>
          <ScoreBar value={readiness.summary.overallScore} />
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Spremno</div>
          <div className="text-xl font-bold text-green-400 font-mono">{readiness.summary.spremnoCount}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Na rubu</div>
          <div className="text-xl font-bold text-yellow-400 font-mono">{readiness.summary.naRubuCount}</div>
        </div>
        <div className="rounded bg-gray-800 px-3 py-2 text-center">
          <div className="text-xs text-gray-500 mb-0.5">Blokirano</div>
          <div className="text-xl font-bold text-red-400 font-mono">{readiness.summary.blokiranoCount}</div>
        </div>
      </div>

      <div className={`rounded-lg border px-3 py-2 mb-4 ${overallStyle.cls}`}>
        <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
          <span aria-hidden="true">{overallStyle.emoji}</span>
          <span>Status: {readiness.status}</span>
          <span className={`rounded border px-2 py-0.5 text-[11px] ${READY_STATE_STYLE[readiness.readyState]}`}>
            {readiness.readyState}
          </span>
        </div>
        <p className="text-xs mt-1 text-gray-200">{readiness.preporuka}</p>
      </div>

      {readiness.blockers.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/30 p-3">
          <div className="text-sm font-semibold text-red-300 mb-2">Blokatori</div>
          <ul className="space-y-1 text-xs text-red-100" role="list">
            {readiness.blockers.map((blocker) => (
              <li key={blocker}>• {blocker}</li>
            ))}
          </ul>
        </div>
      )}

      {readiness.warnings.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-900 bg-yellow-950/20 p-3">
          <div className="text-sm font-semibold text-yellow-300 mb-2">Warning signali</div>
          <ul className="space-y-1 text-xs text-yellow-100" role="list">
            {readiness.warnings.slice(0, 3).map((warning) => (
              <li key={warning}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      <ul className="space-y-3" role="list">
        {readiness.checks.map((check) => {
          const style = STATUS_STYLE[check.status];
          return (
            <li key={check.id} className="rounded-lg bg-gray-800/40 border border-gray-800 p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span aria-hidden="true">{style.emoji}</span>
                  <span className="text-sm text-white font-medium truncate">{check.naziv}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${CATEGORY_STYLE[check.kategorija]}`}>
                    {check.kategorija}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] border ${READY_STATE_STYLE[check.readyState]}`}>
                    {check.readyState}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] border ${style.cls}`}>
                    {check.status}
                  </span>
                  <span className="text-xs font-mono text-gray-300">{check.score}/{check.threshold}</span>
                </div>
              </div>
              <div
                className="mb-2"
                role="progressbar"
                aria-valuenow={check.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${check.naziv} readiness score`}
              >
                <ScoreBar value={check.score} />
              </div>
              <div className="text-xs text-gray-400">{check.detalj}</div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500">
                <span>Owner: <span className="text-gray-300">{check.owner}</span></span>
                <span>Akcija: <span className="text-yellow-300">{check.akcija}</span></span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-release-readiness"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi release readiness kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
