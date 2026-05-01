// Autofinish #1095 — Dashboard OnCallWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishOnCallResult,
  AutofinishOnCallTim,
  AutofinishOnCallNivo,
  AutofinishOnCallStatus,
} from '@/lib/autofinish-petlja';

interface Props { onCall: AutofinishOnCallResult; }

const NIVO_STYLE: Record<AutofinishOnCallNivo, string> = {
  L1: 'text-red-400 bg-red-900/30',
  L2: 'text-orange-400 bg-orange-900/30',
  L3: 'text-blue-400 bg-blue-900/30',
};

const STATUS_STYLE: Record<AutofinishOnCallStatus, string> = {
  aktivan: 'text-green-400 bg-green-900/30',
  rezerva: 'text-yellow-400 bg-yellow-900/30',
  slobodan: 'text-gray-400 bg-gray-800/40',
};

const STATUS_EMOJI: Record<AutofinishOnCallStatus, string> = {
  aktivan: '🟢',
  rezerva: '🟡',
  slobodan: '⚪',
};

export function OnCallWidget({ onCall }: Props) {
  const [filter, setFilter] = useState<AutofinishOnCallStatus | 'svi'>('svi');
  const [selected, setSelected] = useState<string | null>(null);

  const statusi: (AutofinishOnCallStatus | 'svi')[] = ['svi', 'aktivan', 'rezerva', 'slobodan'];

  const filteredTimovi: AutofinishOnCallTim[] =
    filter === 'svi'
      ? onCall.timovi
      : onCall.timovi.filter((t) => t.clanovi.some((c) => c.status === filter));

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="On-call rasporedi">
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📟 </span>On-Call Rasporedi
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{onCall.ukupnoTimova}</span> timova ·{' '}
        <span className="text-white font-mono">{onCall.ukupnoClanova}</span> članova ·{' '}
        <span className="text-green-400 font-mono">{onCall.aktivnih}</span> aktivnih ·{' '}
        <span className="text-yellow-400 font-mono">{onCall.uRezervi}</span> u rezervi ·{' '}
        <span className="text-gray-500 font-mono">{onCall.slobodnih}</span> slobodnih ·{' '}
        Incidenti: <span className="text-red-400 font-mono">{onCall.ukupnoOtvorenihIncidenata}</span>
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter po statusu">
        {statusi.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === s ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
            aria-pressed={filter === s}
          >
            {s !== 'svi' && <span aria-hidden="true">{STATUS_EMOJI[s]} </span>}{s}
          </button>
        ))}
      </div>
      <ul className="space-y-1" role="list">
        {filteredTimovi.map((tim) => {
          const isOpen = selected === tim.id;
          const aktivniClan = tim.clanovi.find((c) => c.id === tim.aktivniClan);
          return (
            <li key={tim.id}>
              <button
                className="w-full flex items-center gap-2 text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors"
                onClick={() => setSelected(isOpen ? null : tim.id)}
                aria-expanded={isOpen}
                aria-label={`${tim.naziv}: ${tim.clanovi.length} članova, rotacija ${tim.rotacijaDani} dana`}
              >
                <span aria-hidden="true">📟</span>
                <span className="flex-1 text-gray-300 truncate">{tim.naziv}</span>
                {aktivniClan && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${STATUS_STYLE['aktivan']}`}>
                    {aktivniClan.ime}
                  </span>
                )}
                <span className="text-gray-500 text-xs">{tim.clanovi.length}č</span>
                <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="ml-4 mb-2 space-y-2 pb-1">
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Rotacija: <span className="text-gray-300 font-mono">{tim.rotacijaDani}d</span></span>
                    <span>Eskalacija: <span className="text-gray-300 font-mono">{tim.eskalacijaNakon}min</span></span>
                  </div>
                  <p className="text-xs text-gray-500 italic">{tim.opis}</p>
                  <ul className="space-y-1" role="list" aria-label={`Članovi: ${tim.naziv}`}>
                    {tim.clanovi
                      .filter((c) => filter === 'svi' || c.status === filter)
                      .map((c) => (
                        <li key={c.id} className="flex flex-wrap items-center gap-2 text-xs px-1 py-1 rounded bg-gray-800/40">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${STATUS_STYLE[c.status]}`}>
                            <span aria-hidden="true">{STATUS_EMOJI[c.status]} </span>{c.status}
                          </span>
                          <span className="text-gray-200 font-medium">{c.ime}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${NIVO_STYLE[c.nivo]}`}>{c.nivo}</span>
                          {c.otvoreniIncidenti > 0 && (
                            <span className="text-red-400 font-mono text-[10px]">🔴 {c.otvoreniIncidenti} inc.</span>
                          )}
                          <span className="text-gray-600 text-[10px]">Smjena: {c.smjenaOd.slice(0, 10)} → {c.smjenaDo.slice(0, 10)}</span>
                          <span className="flex flex-wrap gap-1">
                            {c.kontakti.map((k) => (
                              <span key={k.kanal} className="px-1 py-0.5 rounded text-[10px] bg-gray-700 text-gray-400 border border-gray-600">
                                {k.kanal}: <span className="text-gray-200">{k.vrijednost}</span>
                              </span>
                            ))}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-on-call"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="JSON API on-call rasporedi"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
