// Autofinish #1035 — Dashboard NapredakTrackerWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishNapredakTrackerResult } from '@/lib/autofinish-petlja';

interface Props { tracker: AutofinishNapredakTrackerResult; }

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const color = value >= 100 ? 'bg-green-500' : value >= 70 ? 'bg-blue-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className={`h-2 w-full rounded-full bg-gray-700 overflow-hidden ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function NapredakTrackerWidget({ tracker }: Props) {
  const [openFaza, setOpenFaza] = useState<string | null>(tracker.faze.at(-1)?.fazaId ?? null);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Napredak tracker po fazama">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">📈 </span>Napredak Tracker</h2>
      <p className="text-sm text-gray-500 mb-2">Globalni progres: <span className="text-white font-mono">{tracker.globalniProgres}%</span></p>
      <ProgressBar value={tracker.globalniProgres} className="mb-4" />
      <ul className="space-y-1" role="list">
        {tracker.faze.map((f) => {
          const isOpen = openFaza === f.fazaId;
          return (
            <li key={f.fazaId}>
              <button className="w-full flex items-center justify-between text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors" onClick={() => setOpenFaza(isOpen ? null : f.fazaId)} aria-expanded={isOpen} aria-label={`${f.naziv}: ${f.progres}% progres`}>
                <span className="text-gray-300 truncate">{f.naziv}</span>
                <span className="ml-2 flex items-center gap-2 flex-shrink-0">
                  <span className="text-gray-400 font-mono text-xs">{f.progres}%</span>
                  <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
                </span>
              </button>
              <ProgressBar value={f.progres} className="mx-2 mb-1" />
              {isOpen && (
                <ul className="ml-4 mt-1 mb-2 space-y-1" role="list" aria-label={`Kategorije: ${f.naziv}`}>
                  {f.kategorije.map((k) => (
                    <li key={k.naziv} className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="w-32 truncate">{k.naziv}</span>
                      <div className="flex-1"><ProgressBar value={k.progres} /></div>
                      <span className="font-mono text-gray-500 w-8 text-right">{k.progres}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-napredak-tracker" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
