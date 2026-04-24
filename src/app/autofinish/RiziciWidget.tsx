// Autofinish #1043 — Dashboard RiziciWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishRiziciResult, AutofinishRizikNivo, AutofinishRizikStatus } from '@/lib/autofinish-petlja';

interface Props { rizici: AutofinishRiziciResult; }

const NIVO_STYLE: Record<AutofinishRizikNivo, string> = {
  'nizak': 'text-green-400 bg-green-900/30',
  'srednji': 'text-yellow-400 bg-yellow-900/30',
  'visok': 'text-orange-400 bg-orange-900/30',
  'kritičan': 'text-red-400 bg-red-900/30',
};

const STATUS_STYLE: Record<AutofinishRizikStatus, string> = {
  'aktivan': 'text-red-300',
  'mitigiran': 'text-green-300',
  'prihvaćen': 'text-blue-300',
  'zatvoren': 'text-gray-400',
};

const STATUS_EMOJI: Record<AutofinishRizikStatus, string> = {
  'aktivan': '🔴', 'mitigiran': '✅', 'prihvaćen': '🔵', 'zatvoren': '⬛',
};

export function RiziciWidget({ rizici }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const sorted = [...rizici.rizici].sort((a, b) => b.rizikScore - a.rizikScore);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Registar rizika">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">⚠️ </span>Registar Rizika</h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-red-400 font-mono">{rizici.aktivnih}</span> aktivnih ·{' '}
        <span className="text-green-400 font-mono">{rizici.mitigiranihIliZatvorenih}</span> mitigirani/zatvoreni ·{' '}
        <span className="text-red-500 font-mono">{rizici.kriticnih}</span> kritičnih
      </p>
      <ul className="space-y-1" role="list">
        {sorted.map((r) => {
          const isOpen = selected === r.id;
          const nivoStyle = NIVO_STYLE[r.nivo];
          return (
            <li key={r.id}>
              <button className="w-full flex items-center gap-2 text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors" onClick={() => setSelected(isOpen ? null : r.id)} aria-expanded={isOpen} aria-label={`${r.naziv}: score ${r.rizikScore}, ${r.nivo}`}>
                <span aria-hidden="true">{STATUS_EMOJI[r.status]}</span>
                <span className="flex-1 text-gray-300 truncate">{r.naziv}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${nivoStyle}`}>{r.nivo}</span>
                <span className="text-gray-500 font-mono text-xs">S={r.rizikScore}</span>
                <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="ml-4 mb-2 text-xs space-y-1">
                  <p className="text-gray-400">{r.opis}</p>
                  <div className="flex gap-4 text-gray-500">
                    <span>Vjerovatnoća: <span className="text-gray-300">{r.vjerovatnoća}/5</span></span>
                    <span>Uticaj: <span className="text-gray-300">{r.uticaj}/5</span></span>
                    <span className={STATUS_STYLE[r.status]}>{r.status}</span>
                  </div>
                  <p className="text-gray-500">Mitigacija: <span className="text-gray-300">{r.mitigacija}</span></p>
                  <p className="text-gray-600 italic">Vlasnik: {r.vlasnik}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-rizici" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
