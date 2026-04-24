// Autofinish #1005 — Dashboard ProgressChangelogWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishProgressChangelogResult } from '@/lib/autofinish-petlja';

interface Props { changelog: AutofinishProgressChangelogResult; }

export function ProgressChangelogWidget({ changelog }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Progress Changelog po fazama">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">📜 </span>Progress Changelog</h2>
      <p className="text-sm text-gray-500 mb-4"><span className="text-white font-mono">{changelog.ukupnoFaza}</span> faza, <span className="text-white font-mono">{changelog.ukupnoIteracija}</span> iteracija</p>
      <ul className="space-y-1" role="list">
        {changelog.faze.map((f) => {
          const isOpen = open === f.fazaId;
          return (
            <li key={f.fazaId}>
              <button className="w-full flex items-center justify-between text-sm text-left px-2 py-2 hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors" onClick={() => setOpen(isOpen ? null : f.fazaId)} aria-expanded={isOpen} aria-label={`${f.fazaNaziv}: ${f.ukupnoIteracija} iteracija`}>
                <span className="text-gray-300">{f.fazaNaziv}</span>
                <span className="text-gray-500 font-mono text-xs">{f.ukupnoIteracija} iter <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span></span>
              </button>
              {isOpen && (
                <ol className="ml-4 mt-1 mb-2 space-y-0.5 max-h-40 overflow-y-auto text-xs text-gray-500" role="list">
                  {f.iteracije.map((it) => (<li key={it.broj} className="flex gap-2 px-1 py-0.5"><span className="text-gray-600 font-mono">#{it.broj}</span><span>{it.opis}</span></li>))}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-progress-changelog" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
