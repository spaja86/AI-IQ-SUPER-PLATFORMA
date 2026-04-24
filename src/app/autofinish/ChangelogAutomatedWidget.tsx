// Autofinish #1056 — Dashboard ChangelogAutomatedWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishChangelogAutomatedResult, AutofinishChangelogTip } from '@/lib/autofinish-petlja';

interface Props { changelog: AutofinishChangelogAutomatedResult; }

const TIP_STYLE: Record<AutofinishChangelogTip, { cls: string; emoji: string }> = {
  'feature': { cls: 'text-green-400 bg-green-900/30', emoji: '✨' },
  'fix': { cls: 'text-red-400 bg-red-900/30', emoji: '🐛' },
  'perf': { cls: 'text-blue-400 bg-blue-900/30', emoji: '⚡' },
  'refactor': { cls: 'text-purple-400 bg-purple-900/30', emoji: '♻️' },
  'test': { cls: 'text-yellow-400 bg-yellow-900/30', emoji: '🧪' },
  'docs': { cls: 'text-gray-400 bg-gray-800/60', emoji: '📝' },
  'chore': { cls: 'text-gray-500 bg-gray-800/40', emoji: '🔧' },
};

export function ChangelogAutomatedWidget({ changelog }: Props) {
  const [filter, setFilter] = useState<string>('svi');
  const tipovi = ['svi', 'feature', 'fix', 'perf', 'refactor', 'test', 'docs', 'chore'];
  const filtered = filter === 'svi' ? changelog.entries : changelog.entries.filter((e) => e.tip === filter);
  const reversed = [...filtered].reverse();

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Automatski changelog">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">📋 </span>Changelog Automated</h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{changelog.ukupnoEntries}</span> unosa ·{' '}
        <span className="text-green-400 font-mono">{changelog.features}</span> feature ·{' '}
        <span className="text-red-400 font-mono">{changelog.fixes}</span> fix ·{' '}
        <span className="text-orange-400 font-mono">{changelog.braking}</span> breaking
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter po tipu">
        {tipovi.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === t ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`} aria-pressed={filter === t}>{t}</button>
        ))}
      </div>
      <ul className="space-y-1" role="list">
        {reversed.map((e, i) => {
          const style = TIP_STYLE[e.tip];
          return (
            <li key={`${e.verzija}-${i}`} className="flex items-start gap-2 text-xs py-1 border-b border-gray-800/50 last:border-0">
              <span className="mt-0.5 flex-shrink-0" aria-hidden="true">{style.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${style.cls}`}>{e.tip}</span>
                  <span className="text-gray-300">{e.opis}</span>
                  {e.breakingChange && <span className="px-1.5 py-0.5 rounded text-[10px] text-orange-400 bg-orange-900/30">BREAKING</span>}
                </div>
                <div className="text-gray-600 mt-0.5 flex flex-wrap gap-2">
                  <span className="font-mono">{e.verzija}</span>
                  <span>#{e.autofinishBroj}</span>
                  <span>{e.faza}</span>
                  <span className="text-gray-700">{e.kategorija}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-changelog-automated" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
