// Autofinish #1039 — Dashboard ResursiWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type { AutofinishResursiResult, AutofinishResursStatus } from '@/lib/autofinish-petlja';

interface Props { resursi: AutofinishResursiResult; }

const STATUS_STYLE: Record<AutofinishResursStatus, { bar: string; badge: string; label: string }> = {
  'normalno': { bar: 'bg-green-500', badge: 'text-green-400 bg-green-900/30', label: 'Normalno' },
  'povišeno': { bar: 'bg-yellow-500', badge: 'text-yellow-400 bg-yellow-900/30', label: 'Povišeno' },
  'kritično': { bar: 'bg-red-500', badge: 'text-red-400 bg-red-900/30', label: 'Kritično' },
};

const TREND_EMOJI: Record<string, string> = { 'rast': '↑', 'pad': '↓', 'stabilno': '→' };

export function ResursiWidget({ resursi }: Props) {
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Resursi i kapaciteti platforme">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">⚙️ </span>Resursi i Kapaciteti</h2>
      <p className="text-sm text-gray-500 mb-4">Prosj. iskorištenost: <span className="text-white font-mono">{resursi.prosjecnaIskoristennost}%</span></p>
      <ul className="space-y-3" role="list">
        {resursi.resursi.map((r) => {
          const style = STATUS_STYLE[r.status];
          return (
            <li key={r.id} className="text-sm" aria-label={`${r.naziv}: ${r.iskorištenost}% ${r.status}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{r.naziv}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${style.badge}`}>{style.label}</span>
                  <span className="text-gray-500 text-xs font-mono" aria-label={`Trend: ${r.trend}`}>{TREND_EMOJI[r.trend]}</span>
                </div>
                <span className="text-gray-400 font-mono text-xs">{r.iskorištenost}{r.jedinica}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden" role="progressbar" aria-valuenow={r.iskorištenost} aria-valuemin={0} aria-valuemax={r.kapacitet}>
                <div className={`h-full rounded-full transition-all ${style.bar}`} style={{ width: `${(r.iskorištenost / r.kapacitet) * 100}%` }} />
              </div>
              <p className="text-gray-600 text-[10px] mt-0.5">{r.napomena}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-resursi" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
