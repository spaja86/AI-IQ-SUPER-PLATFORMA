// Autofinish #1090 — Dashboard RunbookWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishRunbookResult,
  AutofinishRunbookUnos,
  AutofinishRunbookPrioritet,
} from '@/lib/autofinish-petlja';

interface Props { runbook: AutofinishRunbookResult; }

const PRIORITET_STYLE: Record<AutofinishRunbookPrioritet, string> = {
  P1: 'text-red-400 bg-red-900/30',
  P2: 'text-orange-400 bg-orange-900/30',
  P3: 'text-yellow-400 bg-yellow-900/30',
  P4: 'text-blue-400 bg-blue-900/30',
};

const PRIORITET_EMOJI: Record<AutofinishRunbookPrioritet, string> = {
  P1: '🔴',
  P2: '🟠',
  P3: '🟡',
  P4: '🔵',
};

export function RunbookWidget({ runbook }: Props) {
  const [filter, setFilter] = useState<AutofinishRunbookPrioritet | 'svi'>('svi');
  const [selected, setSelected] = useState<string | null>(null);

  const prioriteti: (AutofinishRunbookPrioritet | 'svi')[] = ['svi', 'P1', 'P2', 'P3', 'P4'];
  const filtered: AutofinishRunbookUnos[] =
    filter === 'svi' ? runbook.runbooki : runbook.runbooki.filter((r) => r.prioritet === filter);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Runbook biblioteka">
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📖 </span>Runbook Biblioteka
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{runbook.ukupnoRunbooka}</span> runbooka ·{' '}
        <span className="text-green-400 font-mono">{runbook.aktivnih}</span> aktivnih ·{' '}
        <span className="text-yellow-400 font-mono">{runbook.uReviziji}</span> u reviziji ·{' '}
        <span className="text-gray-500 font-mono">{runbook.zastarjelih}</span> zastarjelih ·{' '}
        <span className="text-gray-600 font-mono">{runbook.arhiviranih}</span> arhiviranih ·{' '}
        Servisi: <span className="text-blue-400 font-mono">{runbook.pokriveniServisi.length}</span>
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter po prioritetu">
        {prioriteti.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === p ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
            aria-pressed={filter === p}
          >
            {p !== 'svi' && <span aria-hidden="true">{PRIORITET_EMOJI[p]} </span>}{p}
          </button>
        ))}
      </div>
      <ul className="space-y-1" role="list">
        {filtered.map((rb) => {
          const isOpen = selected === rb.id;
          return (
            <li key={rb.id}>
              <button
                className="w-full flex items-center gap-2 text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors"
                onClick={() => setSelected(isOpen ? null : rb.id)}
                aria-expanded={isOpen}
                aria-label={`${rb.naziv}: prioritet ${rb.prioritet}, vlasnik ${rb.vlasnik}`}
              >
                <span aria-hidden="true">{PRIORITET_EMOJI[rb.prioritet]}</span>
                <span className="flex-1 text-gray-300 truncate">{rb.naziv}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${PRIORITET_STYLE[rb.prioritet]}`}>{rb.prioritet}</span>
                <span className="text-gray-500 text-xs truncate max-w-[80px]">{rb.vlasnik}</span>
                <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="ml-4 mb-2 space-y-2 pb-1">
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Servis: <span className="text-gray-300 font-mono">{rb.servis}</span></span>
                    <span>Status: <span className="text-gray-300">{rb.status}</span></span>
                    <span>Prosj. trajanje: <span className="text-gray-300 font-mono">{rb.prosjecnoVrijemeMin}min</span></span>
                    <span>Zadnja revizija: <span className="text-gray-300 font-mono">{rb.zadnjaRevizija}</span></span>
                  </div>
                  <p className="text-xs text-gray-500">Okidač: <span className="text-gray-300">{rb.okidac}</span></p>
                  {rb.tagovi.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {rb.tagovi.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-800 text-gray-400 border border-gray-700">{t}</span>
                      ))}
                    </div>
                  )}
                  <ol className="space-y-1 list-decimal list-inside" aria-label={`Koraci: ${rb.naziv}`}>
                    {rb.koraci.map((k) => (
                      <li key={k.redni} className="text-xs text-gray-400">
                        <span className="text-gray-200">{k.opis}</span>
                        {k.komanda && (
                          <code className="ml-1 px-1 py-0.5 rounded bg-gray-800 text-green-400 font-mono text-[10px]">{k.komanda}</code>
                        )}
                        {k.napomena && (
                          <span className="ml-1 text-gray-500 italic">({k.napomena})</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-runbook"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="JSON API runbook biblioteka"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
