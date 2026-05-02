// Autofinish #1115 — Dashboard TehDugWidget (Tehnicki Dug)
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishTehDugResult,
  AutofinishDugPrioritet,
  AutofinishDugKategorija,
} from '@/lib/autofinish-petlja';

interface Props { tehDug: AutofinishTehDugResult; }

const PRIORITET_STYLE: Record<AutofinishDugPrioritet, string> = {
  kriticno: 'text-red-300 bg-red-950/40 border-red-700',
  visoko:   'text-orange-400 bg-orange-900/30 border-orange-800',
  srednje:  'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  nisko:    'text-gray-400 bg-gray-800/50 border-gray-700',
};

const PRIORITET_EMOJI: Record<AutofinishDugPrioritet, string> = {
  kriticno: '🔥',
  visoko:   '🔴',
  srednje:  '🟡',
  nisko:    '⚪',
};

const KATEGORIJA_EMOJI: Record<AutofinishDugKategorija, string> = {
  arhitektura:  '🏗️',
  kod:          '💻',
  testovi:      '🧪',
  dokumentacija:'📝',
  sigurnost:    '🔒',
  zavisnosti:   '📦',
};

const TREND_BADGE: Record<string, string> = {
  raste:    '↑',
  pada:     '↓',
  stabilan: '→',
};

const TREND_COLOR: Record<string, string> = {
  raste:    'text-red-400',
  pada:     'text-green-400',
  stabilan: 'text-gray-400',
};

export function TehDugWidget({ tehDug }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const ukupnoTjedniTrosak = tehDug.stavke.reduce((s, st) => s + st.tjedniTrosak, 0);

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Tehnicki dug pregled"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🏦 </span>Tehnicki Dug
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Ukupno stavki: <span className="text-white font-mono font-semibold">{tehDug.ukupnoStavki}</span>
        {' · '}
        Ukupno sati: <span className="text-white font-mono font-semibold">{tehDug.ukupnoSati}h</span>
        {' · '}
        Tjedni trosak: <span className="text-red-400 font-mono font-semibold">{ukupnoTjedniTrosak}h/sed</span>
        {' · '}
        <span className="text-red-300 font-mono">{tehDug.kriticnoCount}</span> kriticno
        {' · '}
        <span className="text-orange-400 font-mono">{tehDug.visokoCount}</span> visoko
        {' · '}
        <span className="text-yellow-400 font-mono">{tehDug.srednjeCount}</span> srednje
        {' · '}
        <span className="text-gray-400 font-mono">{tehDug.niskoCount}</span> nisko
      </p>

      <ul className="space-y-3" role="list">
        {tehDug.stavke.map((st) => {
          const isOpen = expanded === st.id;
          return (
            <li key={st.id} className={`rounded-lg border px-4 py-3 ${PRIORITET_STYLE[st.prioritet]}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span aria-hidden="true" className="text-base shrink-0">{KATEGORIJA_EMOJI[st.kategorija]}</span>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-white truncate">{st.naziv}</span>
                    <span className="block text-xs text-gray-400">{st.kategorija}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-white font-mono text-sm font-bold">{st.procijenjeniSati}h</span>
                  <span
                    className={`text-xs font-semibold ${TREND_COLOR[st.trend]}`}
                    aria-label={`Trend: ${st.trend}`}
                  >
                    {TREND_BADGE[st.trend]} {st.trend}
                  </span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded border ${PRIORITET_STYLE[st.prioritet]}`}
                    aria-label={`Prioritet: ${st.prioritet}`}
                  >
                    {PRIORITET_EMOJI[st.prioritet]} {st.prioritet}
                  </span>
                  <button
                    onClick={() => setExpanded(isOpen ? null : st.id)}
                    className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                    aria-expanded={isOpen}
                    aria-controls={`teh-dug-detail-${st.id}`}
                  >
                    {isOpen ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div
                  id={`teh-dug-detail-${st.id}`}
                  className="mt-3 text-xs text-gray-400 border-t border-gray-700 pt-3 space-y-2"
                >
                  <p>{st.opis}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded bg-gray-800 px-2 py-1.5 text-center">
                      <div className="text-gray-400 mb-0.5">Procijenjeni sati</div>
                      <div className="text-white font-mono font-semibold">{st.procijenjeniSati}h</div>
                    </div>
                    <div className="rounded bg-red-900/30 px-2 py-1.5 text-center">
                      <div className="text-red-400 mb-0.5">Tjedni trosak</div>
                      <div className="text-white font-mono font-semibold">{st.tjedniTrosak}h/sed</div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-teh-dug"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi tehnicki dug kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
