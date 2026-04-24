// Autofinish #1001 — Dashboard HealthScoreWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type { AutofinishHealthScoreResult } from '@/lib/autofinish-petlja';

interface Props { healthScore: AutofinishHealthScoreResult; }

const OCJENA_COLOR: Record<string, string> = {
  'Odlično': 'text-green-400',
  'Dobro': 'text-blue-400',
  'Zadovoljavajuće': 'text-yellow-400',
  'Kritično': 'text-red-400',
};

export function HealthScoreWidget({ healthScore }: Props) {
  const color = OCJENA_COLOR[healthScore.ocjena] ?? 'text-gray-400';
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Kompozitni zdravstveni skor platforme">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🩺 </span>Health Score</h2>
      <p className="text-sm text-gray-500 mb-4">Verzija <span className="text-white font-mono">{healthScore.verzija}</span> — iteracija <span className="text-white font-mono">#{healthScore.autofinishBroj}</span></p>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl font-mono font-bold" aria-label={`Skor: ${healthScore.skor}`} role="meter" aria-valuenow={healthScore.skor} aria-valuemin={0} aria-valuemax={100}>{healthScore.skor}</div>
        <div><div className={`text-lg font-semibold ${color}`}>{healthScore.ocjena}</div><div className="text-xs text-gray-500">od 100 bodova</div></div>
      </div>
      <div className="h-2 rounded bg-gray-800 mb-4" role="progressbar" aria-valuenow={healthScore.skor} aria-valuemin={0} aria-valuemax={100} aria-label={`Health ${healthScore.skor}%`}>
        <div className="h-2 rounded bg-green-500 transition-all" style={{ width: `${healthScore.skor}%` }} aria-hidden="true" />
      </div>
      <ul className="space-y-2" role="list" aria-label="Komponente skora">
        {healthScore.komponente.map((k) => (
          <li key={k.naziv} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{k.naziv}</span>
            <span className="text-gray-300 font-mono text-xs">{k.vrijednost}% × {k.tezina}% = {k.doprinos}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-health-score" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
