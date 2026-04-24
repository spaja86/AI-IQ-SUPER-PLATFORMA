// Autofinish #1077 — Dashboard FeatureFlagsWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishFeatureFlagsResult, AutofinishFeatureFlag } from '@/lib/autofinish-petlja';

interface Props { flags: AutofinishFeatureFlagsResult; }

const STATUS_STYLE: Record<AutofinishFeatureFlag['status'], string> = {
  'aktivan': 'text-green-400 bg-green-900/30',
  'neaktivan': 'text-gray-500 bg-gray-800/40',
  'testiranje': 'text-blue-400 bg-blue-900/30',
  'depreciran': 'text-red-400/70 bg-red-900/20 line-through',
};

const TIP_STYLE: Record<AutofinishFeatureFlag['tip'], string> = {
  'boolean': 'text-gray-400',
  'percentage': 'text-blue-400',
  'ab-test': 'text-purple-400',
  'multivariant': 'text-yellow-400',
};

export function FeatureFlagsWidget({ flags }: Props) {
  const [filter, setFilter] = useState<string>('svi');
  const tipovi = ['svi', 'aktivan', 'testiranje', 'neaktivan', 'depreciran'];
  const filtered = filter === 'svi' ? flags.flags : flags.flags.filter((f) => f.status === filter);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Feature flags">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🏳️ </span>Feature Flags</h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-green-400 font-mono">{flags.aktivnih}</span> aktivnih ·{' '}
        <span className="text-blue-400 font-mono">{flags.uTestiranju}</span> u testiranju ·{' '}
        <span className="text-gray-500 font-mono">{flags.neaktivnih}</span> neaktivnih
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter">
        {tipovi.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === t ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`} aria-pressed={filter === t}>{t}</button>
        ))}
      </div>
      <ul className="space-y-2" role="list">
        {filtered.map((f) => (
          <li key={f.id} className="rounded-lg bg-gray-800/40 border border-gray-800 p-2.5" aria-label={`${f.naziv}: ${f.status}, rollout ${f.rolloutPct}%`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${STATUS_STYLE[f.status]}`}>{f.status}</span>
                <span className="text-gray-200 text-xs truncate">{f.naziv}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className={`text-[10px] ${TIP_STYLE[f.tip]}`}>{f.tip}</span>
                <span className="text-gray-300 font-mono text-xs">{f.rolloutPct}%</span>
              </div>
            </div>
            {f.rolloutPct > 0 && (
              <div className="h-1 w-full rounded-full bg-gray-700 overflow-hidden mb-1" role="progressbar" aria-valuenow={f.rolloutPct} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${f.rolloutPct}%` }} />
              </div>
            )}
            <p className="text-[10px] text-gray-600">{f.napomena}</p>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-feature-flags" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
