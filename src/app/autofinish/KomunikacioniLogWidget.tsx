// Autofinish #1047 — Dashboard KomunikacioniLogWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishKomunikacioniLogResult, AutofinishLogTip } from '@/lib/autofinish-petlja';

interface Props { log: AutofinishKomunikacioniLogResult; }

const TIP_STYLE: Record<AutofinishLogTip, { cls: string; emoji: string }> = {
  'odluka': { cls: 'text-blue-400 bg-blue-900/30', emoji: '🔷' },
  'info': { cls: 'text-gray-400 bg-gray-800/60', emoji: 'ℹ️' },
  'upozorenje': { cls: 'text-yellow-400 bg-yellow-900/30', emoji: '⚠️' },
  'akcija': { cls: 'text-green-400 bg-green-900/30', emoji: '⚡' },
  'milestone': { cls: 'text-purple-400 bg-purple-900/30', emoji: '🏆' },
};

export function KomunikacioniLogWidget({ log }: Props) {
  const [filter, setFilter] = useState<string>('svi');
  const tipovi = ['svi', 'odluka', 'info', 'upozorenje', 'akcija', 'milestone'];
  const filtered = filter === 'svi' ? log.entries : log.entries.filter((e) => e.tip === filter);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Komunikacioni log">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">📜 </span>Komunikacioni Log</h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{log.ukupnoEntries}</span> unosa ·{' '}
        <span className="text-blue-400 font-mono">{log.odluke}</span> odluke ·{' '}
        <span className="text-purple-400 font-mono">{log.milestones}</span> milestoni ·{' '}
        <span className="text-yellow-400 font-mono">{log.upozorenja}</span> upozorenja
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter po tipu">
        {tipovi.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === t ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`} aria-pressed={filter === t}>{t}</button>
        ))}
      </div>
      <ul className="space-y-2" role="list">
        {[...filtered].reverse().map((e) => {
          const style = TIP_STYLE[e.tip];
          return (
            <li key={e.id} className="flex items-start gap-2 text-xs py-1 border-b border-gray-800/50 last:border-0">
              <span className="mt-0.5 flex-shrink-0" aria-hidden="true">{style.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${style.cls}`}>{e.tip}</span>
                  <span className="text-gray-300">{e.poruka}</span>
                </div>
                <div className="text-gray-600 mt-0.5 flex flex-wrap gap-2">
                  <span>#{e.iteracija}</span>
                  <span>{e.autor}</span>
                  <span>{new Date(e.timestampISO).getFullYear()}</span>
                  {e.tagovi.map((t) => <span key={t} className="text-gray-700">#{t}</span>)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-komunikacioni-log" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
