// Autofinish #1026 — Dashboard RetrospektivaWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishRetrospektivaResult } from '@/lib/autofinish-petlja';

interface Props { retrospektiva: AutofinishRetrospektivaResult; }

export function RetrospektivaWidget({ retrospektiva }: Props) {
  const [openSprint, setOpenSprint] = useState<string | null>(retrospektiva.sprintovi.at(-1)?.sprintId ?? null);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Retrospektiva po sprintovima">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🔁 </span>Retrospektiva</h2>
      <p className="text-sm text-gray-500 mb-4"><span className="text-white font-mono">{retrospektiva.ukupnoSprintova}</span> sprintova · <span className="text-white font-mono">{retrospektiva.ukupnoAkcija}</span> akcija</p>
      <ul className="space-y-1" role="list">
        {retrospektiva.sprintovi.map((s) => {
          const isOpen = openSprint === s.sprintId;
          return (
            <li key={s.sprintId}>
              <button className="w-full flex items-center justify-between text-sm text-left px-2 py-2 hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors" onClick={() => setOpenSprint(isOpen ? null : s.sprintId)} aria-expanded={isOpen} aria-label={`${s.naziv}: brzina ${s.brzina}`}>
                <span className="text-gray-300">{s.naziv}</span>
                <span className="text-gray-500 font-mono text-xs">⚡{s.brzina} iter <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span></span>
              </button>
              {isOpen && (
                <div className="ml-4 mt-1 mb-2 space-y-2 text-xs">
                  <div><p className="text-green-400 font-semibold mb-0.5">✅ Dobro:</p><ul className="text-gray-400 space-y-0.5" role="list">{s.dobro.map((d, i) => <li key={i}>• {d}</li>)}</ul></div>
                  <div><p className="text-red-400 font-semibold mb-0.5">❌ Loše:</p><ul className="text-gray-400 space-y-0.5" role="list">{s.loshe.map((l, i) => <li key={i}>• {l}</li>)}</ul></div>
                  <div><p className="text-yellow-400 font-semibold mb-0.5">🎯 Akcije:</p>
                    <ul className="space-y-0.5" role="list">
                      {s.akcije.map((a, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-400">
                          <span className="text-gray-600 text-[10px] font-mono">P{a.prioritet}</span>
                          <span>{a.akcija}</span>
                          <span className="ml-auto text-gray-600 italic text-[10px]">{a.vlasnik}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-retrospektiva" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
