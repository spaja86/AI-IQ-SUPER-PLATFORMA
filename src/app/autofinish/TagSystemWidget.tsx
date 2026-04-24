// Autofinish #1018 — Dashboard TagSystemWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishTagSystemResult } from '@/lib/autofinish-petlja';

interface Props { tagSystem: AutofinishTagSystemResult; }

const KATEGORIJA_COLOR: Record<string, string> = {
  'tip': 'bg-blue-900/50 text-blue-300 border-blue-700',
  'funkcija': 'bg-green-900/50 text-green-300 border-green-700',
  'domen': 'bg-purple-900/50 text-purple-300 border-purple-700',
  'akcija': 'bg-orange-900/50 text-orange-300 border-orange-700',
};

export function TagSystemWidget({ tagSystem }: Props) {
  const [filter, setFilter] = useState<string>('svi');
  const kategorije = ['svi', ...Array.from(new Set(tagSystem.tagovi.map((t) => t.kategorija)))];
  const filtered = filter === 'svi' ? tagSystem.tagovi : tagSystem.tagovi.filter((t) => t.kategorija === filter);
  const maxFreq = Math.max(...tagSystem.tagovi.map((t) => t.frekventnost), 1);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Tag sistem iteracija">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🏷️ </span>Tag Sistem</h2>
      <p className="text-sm text-gray-500 mb-4"><span className="text-white font-mono">{tagSystem.ukupnoTagova}</span> aktivnih tagova</p>
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter po kategoriji">
        {kategorije.map((k) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === k ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`} aria-pressed={filter === k}>{k}</button>
        ))}
      </div>
      <ul className="flex flex-wrap gap-2" role="list" aria-label="Tagovi">
        {filtered.map((t) => {
          const fontSize = 11 + Math.round((t.frekventnost / maxFreq) * 8);
          const cls = KATEGORIJA_COLOR[t.kategorija] ?? 'bg-gray-800 text-gray-300 border-gray-700';
          return (
            <li key={t.tag} title={`${t.frekventnost} iteracija — ${t.kategorija}`}>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono ${cls}`} style={{ fontSize }} aria-label={`${t.tag}: ${t.frekventnost} iteracija`}>
                {t.tag}<span className="opacity-60 text-[10px]">×{t.frekventnost}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        <p className="text-xs text-gray-600 mb-1">Top 5 tagova:</p>
        <ul className="flex flex-wrap gap-1" role="list" aria-label="Top 5 tagova">
          {tagSystem.topTagovi.map((t, i) => (<li key={t.tag} className="text-xs text-gray-400 font-mono"><span className="text-gray-600">#{i+1}</span> {t.tag} ({t.frekventnost})</li>))}
        </ul>
      </div>
      <div className="mt-3 text-right"><a href="/api/autofinish-tag-system" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
