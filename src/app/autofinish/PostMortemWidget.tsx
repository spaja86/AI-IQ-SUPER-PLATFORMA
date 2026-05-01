// Autofinish #1105 — Dashboard PostMortemWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishPostMortemResult,
  AutofinishPostMortem,
  AutofinishPostMortemStatus,
  AutofinishPostMortemSeverity,
} from '@/lib/autofinish-petlja';

interface Props { postMortem: AutofinishPostMortemResult; }

const STATUS_STYLE: Record<AutofinishPostMortemStatus, string> = {
  'otvoren': 'text-red-400 bg-red-900/30',
  'u-pregledu': 'text-yellow-400 bg-yellow-900/30',
  'zatvoren': 'text-green-400 bg-green-900/30',
  'arhiviran': 'text-gray-400 bg-gray-800/40',
};

const STATUS_EMOJI: Record<AutofinishPostMortemStatus, string> = {
  'otvoren': '🔴',
  'u-pregledu': '🟡',
  'zatvoren': '✅',
  'arhiviran': '📦',
};

const SEVERITY_STYLE: Record<AutofinishPostMortemSeverity, string> = {
  P1: 'text-red-400 bg-red-900/30',
  P2: 'text-orange-400 bg-orange-900/30',
  P3: 'text-yellow-400 bg-yellow-900/30',
  P4: 'text-blue-400 bg-blue-900/30',
};

const SEVERITY_EMOJI: Record<AutofinishPostMortemSeverity, string> = {
  P1: '🔴',
  P2: '🟠',
  P3: '🟡',
  P4: '🔵',
};

type FilterStatus = AutofinishPostMortemStatus | 'svi';
type FilterSeverity = AutofinishPostMortemSeverity | 'sve';

function formatSeconds(sec: number): string {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}min`;
  return `${(sec / 3600).toFixed(1)}h`;
}

export function PostMortemWidget({ postMortem }: Props) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('svi');
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('sve');
  const [selected, setSelected] = useState<string | null>(null);

  const statusi: FilterStatus[] = ['svi', 'otvoren', 'u-pregledu', 'zatvoren', 'arhiviran'];
  const severities: FilterSeverity[] = ['sve', 'P1', 'P2', 'P3', 'P4'];

  const filteredPostmortemi: AutofinishPostMortem[] = postMortem.postmortemi.filter((pm) => {
    const matchStatus = filterStatus === 'svi' || pm.status === filterStatus;
    const matchSeverity = filterSeverity === 'sve' || pm.severity === filterSeverity;
    return matchStatus && matchSeverity;
  });

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Post-mortem izvještaji">
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">📋 </span>Post-mortem Izvještaji
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{postMortem.ukupno}</span> ukupno ·{' '}
        <span className="text-red-400 font-mono">{postMortem.otvorenih}</span> otvorenih ·{' '}
        <span className="text-yellow-400 font-mono">{postMortem.uPregledu}</span> u pregledu ·{' '}
        <span className="text-green-400 font-mono">{postMortem.zatvorenih}</span> zatvorenih ·{' '}
        <span className="text-gray-500 font-mono">{postMortem.arhiviranih}</span> arhiviranih ·{' '}
        Otvorenih akcija: <span className="text-orange-400 font-mono">{postMortem.otvorenihAkcija}</span>
      </p>

      <div className="flex flex-wrap gap-1 mb-2" role="group" aria-label="Filter po statusu">
        {statusi.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filterStatus === s ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
            aria-pressed={filterStatus === s}
          >
            {s !== 'svi' && <span aria-hidden="true">{STATUS_EMOJI[s as AutofinishPostMortemStatus]} </span>}{s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter po severitetu">
        {severities.map((sv) => (
          <button
            key={sv}
            onClick={() => setFilterSeverity(sv)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filterSeverity === sv ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
            aria-pressed={filterSeverity === sv}
          >
            {sv !== 'sve' && <span aria-hidden="true">{SEVERITY_EMOJI[sv as AutofinishPostMortemSeverity]} </span>}{sv}
          </button>
        ))}
      </div>

      <ul className="space-y-1" role="list">
        {filteredPostmortemi.map((pm) => {
          const isOpen = selected === pm.id;
          return (
            <li key={pm.id}>
              <button
                className="w-full flex items-center gap-2 text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors"
                onClick={() => setSelected(isOpen ? null : pm.id)}
                aria-expanded={isOpen}
                aria-label={`${pm.naslov}: ${pm.severity}, ${pm.status}, vlasnik ${pm.vlasnik}`}
              >
                <span aria-hidden="true">📋</span>
                <span className="flex-1 text-gray-300 truncate">{pm.naslov}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${SEVERITY_STYLE[pm.severity]}`}>
                  <span aria-hidden="true">{SEVERITY_EMOJI[pm.severity]} </span>{pm.severity}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${STATUS_STYLE[pm.status]}`}>
                  <span aria-hidden="true">{STATUS_EMOJI[pm.status]} </span>{pm.status}
                </span>
                <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="ml-4 mb-2 space-y-2 pb-1">
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Vlasnik: <span className="text-gray-300 font-mono">{pm.vlasnik}</span></span>
                    <span>Incident: <span className="text-gray-300 font-mono">{pm.incidentId}</span></span>
                    <span>MTTD: <span className="text-gray-300 font-mono">{formatSeconds(pm.mttdSekundi)}</span></span>
                    <span>MTTR: <span className="text-gray-300 font-mono">{formatSeconds(pm.mttrSekundi)}</span></span>
                  </div>
                  <p className="text-xs text-gray-400">
                    <span className="text-gray-500">Korijen uzroka: </span>{pm.korijenUzrok}
                  </p>
                  {pm.zahvaceniServisi.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {pm.zahvaceniServisi.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-800 text-gray-400 border border-gray-700 font-mono">{s}</span>
                      ))}
                    </div>
                  )}
                  {pm.timeline.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Timeline:</p>
                      <ul className="space-y-0.5" role="list" aria-label={`Timeline: ${pm.naslov}`}>
                        {pm.timeline.map((faza, i) => (
                          <li
                            key={i}
                            className="flex flex-wrap items-center gap-2 text-xs px-1 py-1 rounded bg-gray-800/40"
                          >
                            <span className="text-blue-400 font-mono">{faza.naziv}</span>
                            <span className="text-gray-500 font-mono">{faza.vrijemeISO.slice(0, 16).replace('T', ' ')}</span>
                            {faza.trajanjeSekundi > 0 && (
                              <span className="text-gray-400 font-mono">+{formatSeconds(faza.trajanjeSekundi)}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pm.akcije.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Akcione stavke ({pm.akcije.length}):</p>
                      <ul className="space-y-0.5" role="list" aria-label={`Akcije: ${pm.naslov}`}>
                        {pm.akcije.map((a) => (
                          <li
                            key={a.id}
                            className="flex flex-wrap items-center gap-2 text-xs px-1 py-1 rounded bg-gray-800/40"
                          >
                            <span className={`px-1 py-0.5 rounded text-[10px] font-mono ${SEVERITY_STYLE[a.prioritet]}`}>{a.prioritet}</span>
                            <span className="flex-1 text-gray-300">{a.opis}</span>
                            <span className="text-gray-500 font-mono">{a.odgovoran}</span>
                            <span className="text-gray-600 font-mono">{a.status}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pm.zatvoreno && (
                    <p className="text-xs text-green-600">Zatvoreno: <span className="font-mono">{pm.zatvoreno.slice(0, 10)}</span></p>
                  )}
                  <p className="text-xs text-gray-600">ID: {pm.id} · Otvoreno: {pm.otvoreno.slice(0, 10)}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-post-mortem"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="JSON API post-mortem izvještaji"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
