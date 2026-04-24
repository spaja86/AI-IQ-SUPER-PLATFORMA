// Autofinish #1081 — Dashboard IncidentLogWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishIncidentLogResult, AutofinishIncident } from '@/lib/autofinish-petlja';

interface Props { log: AutofinishIncidentLogResult; }

const SEVERITY_STYLE: Record<AutofinishIncident['severity'], string> = {
  'P1': 'text-red-400 bg-red-900/40',
  'P2': 'text-orange-400 bg-orange-900/30',
  'P3': 'text-yellow-400 bg-yellow-900/30',
  'P4': 'text-gray-400 bg-gray-800/60',
};

const STATUS_EMOJI: Record<AutofinishIncident['status'], string> = {
  'open': '🔴', 'investigating': '🟡', 'mitigated': '🔵', 'resolved': '✅', 'postmortem': '📋',
};

export function IncidentLogWidget({ log }: Props) {
  const [filter, setFilter] = useState<string>('svi');
  const [selected, setSelected] = useState<string | null>(null);
  const severities = ['svi', 'P1', 'P2', 'P3', 'P4'];
  const filtered = filter === 'svi' ? log.incidents : log.incidents.filter((i) => i.severity === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.pocetak).getTime() - new Date(a.pocetak).getTime());

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Incident log">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🚨 </span>Incident Log</h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{log.ukupnoIncidenata}</span> incidenta ·{' '}
        <span className="text-orange-400 font-mono">{log.p2Count}</span> P2 ·{' '}
        <span className="text-green-400 font-mono">{log.resolvedCount}</span> riješeno ·{' '}
        Prosj. MTTR: <span className="text-blue-400 font-mono">{log.prosjecniMttrMin}min</span>
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter severity">
        {severities.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === s ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`} aria-pressed={filter === s}>{s}</button>
        ))}
      </div>
      <ul className="space-y-1" role="list">
        {sorted.map((inc) => {
          const isOpen = selected === inc.id;
          return (
            <li key={inc.id}>
              <button className="w-full flex items-center gap-2 text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors" onClick={() => setSelected(isOpen ? null : inc.id)} aria-expanded={isOpen} aria-label={`${inc.naziv}: ${inc.severity}, MTTR ${inc.mttrMin}min`}>
                <span aria-hidden="true">{STATUS_EMOJI[inc.status]}</span>
                <span className="flex-1 text-gray-300 truncate">{inc.naziv}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${SEVERITY_STYLE[inc.severity]}`}>{inc.severity}</span>
                <span className="text-gray-500 font-mono text-xs">{inc.mttrMin}min</span>
                <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="ml-4 mb-2 text-xs space-y-1">
                  <p className="text-gray-400">{inc.opis}</p>
                  <div className="flex gap-3 text-gray-500 flex-wrap">
                    <span>Status: <span className="text-gray-300">{inc.status}</span></span>
                    {inc.kraj && <span>Trajanje: <span className="text-gray-300">{inc.mttrMin}min</span></span>}
                  </div>
                  <p className="text-gray-500">Uzrok: <span className="text-gray-300">{inc.uzrok}</span></p>
                  <p className="text-gray-500">Mitigacija: <span className="text-gray-300">{inc.mitigacija}</span></p>
                  <p className="text-gray-500">Zahvaćeni: <span className="text-gray-300">{inc.zahvaceniServisi.join(', ')}</span></p>
                  {inc.postmortemUrl && <a href={inc.postmortemUrl} className="text-blue-400 hover:underline">Post-mortem →</a>}
                  <p className="text-gray-600 font-mono">{inc.pocetak.slice(0, 10)}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-incident-log" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
