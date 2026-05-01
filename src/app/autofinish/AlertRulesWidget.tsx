// Autofinish #1100 — Dashboard AlertRulesWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishAlertRulesResult,
  AutofinishAlertPravilo,
  AutofinishAlertStatus,
  AutofinishAlertSeverity,
} from '@/lib/autofinish-petlja';

interface Props { alertRules: AutofinishAlertRulesResult; }

const STATUS_STYLE: Record<AutofinishAlertStatus, string> = {
  aktivan: 'text-green-400 bg-green-900/30',
  utišan: 'text-yellow-400 bg-yellow-900/30',
  privremeno_onemogućen: 'text-gray-400 bg-gray-800/40',
};

const STATUS_EMOJI: Record<AutofinishAlertStatus, string> = {
  aktivan: '🟢',
  utišan: '🔕',
  privremeno_onemogućen: '⏸',
};

const SEVERITY_STYLE: Record<AutofinishAlertSeverity, string> = {
  'kritičan': 'text-red-400 bg-red-900/30',
  'visok': 'text-orange-400 bg-orange-900/30',
  'srednji': 'text-yellow-400 bg-yellow-900/30',
  'nizak': 'text-blue-400 bg-blue-900/30',
};

const SEVERITY_EMOJI: Record<AutofinishAlertSeverity, string> = {
  'kritičan': '🔴',
  'visok': '🟠',
  'srednji': '🟡',
  'nizak': '🔵',
};

type FilterStatus = AutofinishAlertStatus | 'svi';
type FilterSeverity = AutofinishAlertSeverity | 'sve';

export function AlertRulesWidget({ alertRules }: Props) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('svi');
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('sve');
  const [selected, setSelected] = useState<string | null>(null);

  const statusi: FilterStatus[] = ['svi', 'aktivan', 'utišan', 'privremeno_onemogućen'];
  const severities: FilterSeverity[] = ['sve', 'kritičan', 'visok', 'srednji', 'nizak'];

  const filteredPravila: AutofinishAlertPravilo[] = alertRules.pravila.filter((p) => {
    const matchStatus = filterStatus === 'svi' || p.status === filterStatus;
    const matchSeverity = filterSeverity === 'sve' || p.severity === filterSeverity;
    return matchStatus && matchSeverity;
  });

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Alert pravila">
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🔔 </span>Alert Pravila
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        <span className="text-white font-mono">{alertRules.ukupnoPravila}</span> pravila ·{' '}
        <span className="text-green-400 font-mono">{alertRules.aktivnih}</span> aktivnih ·{' '}
        <span className="text-yellow-400 font-mono">{alertRules.utišanih}</span> utišanih ·{' '}
        <span className="text-gray-500 font-mono">{alertRules.privremeno_onemogućenih}</span> onemogućenih ·{' '}
        Kritičnih: <span className="text-red-400 font-mono">{alertRules.kriticnih}</span>
      </p>

      <div className="flex flex-wrap gap-1 mb-2" role="group" aria-label="Filter po statusu">
        {statusi.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filterStatus === s ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
            aria-pressed={filterStatus === s}
          >
            {s !== 'svi' && <span aria-hidden="true">{STATUS_EMOJI[s as AutofinishAlertStatus]} </span>}{s}
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
            {sv !== 'sve' && <span aria-hidden="true">{SEVERITY_EMOJI[sv as AutofinishAlertSeverity]} </span>}{sv}
          </button>
        ))}
      </div>

      <ul className="space-y-1" role="list">
        {filteredPravila.map((p) => {
          const isOpen = selected === p.id;
          return (
            <li key={p.id}>
              <button
                className="w-full flex items-center gap-2 text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors"
                onClick={() => setSelected(isOpen ? null : p.id)}
                aria-expanded={isOpen}
                aria-label={`${p.naziv}: ${p.servis}, ${p.severity}, ${p.status}`}
              >
                <span aria-hidden="true">🔔</span>
                <span className="flex-1 text-gray-300 truncate">{p.naziv}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${SEVERITY_STYLE[p.severity]}`}>
                  <span aria-hidden="true">{SEVERITY_EMOJI[p.severity]} </span>{p.severity}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${STATUS_STYLE[p.status]}`}>
                  <span aria-hidden="true">{STATUS_EMOJI[p.status]} </span>{p.status}
                </span>
                <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="ml-4 mb-2 space-y-2 pb-1">
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Servis: <span className="text-gray-300 font-mono">{p.servis}</span></span>
                    <span>Metrika: <span className="text-gray-300 font-mono">{p.prag.tip}</span></span>
                    <span>
                      Prag:{' '}
                      <span className="text-gray-300 font-mono">
                        {p.prag.operator}{p.prag.vrijednost} {p.prag.jedinica}
                      </span>
                    </span>
                    <span>Trajanje: <span className="text-gray-300 font-mono">{p.prag.trajanjeSekundi}s</span></span>
                    <span>Aktiviranja 7d: <span className="text-red-400 font-mono">{p.aktiviranja7Dana}</span></span>
                  </div>
                  {p.poslednjeAktiviranje && (
                    <p className="text-xs text-gray-500">
                      Posljednje: <span className="text-gray-300 font-mono">{p.poslednjeAktiviranje.slice(0, 10)}</span>
                    </p>
                  )}
                  {p.status === 'utišan' && p.prozorTišineOd && p.prozorTišineDo && (
                    <p className="text-xs text-yellow-500">
                      Tišina: <span className="font-mono">{p.prozorTišineOd.slice(0, 10)}</span>{' '}
                      → <span className="font-mono">{p.prozorTišineDo.slice(0, 10)}</span>
                    </p>
                  )}
                  {p.eskalacije.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Eskalacije:</p>
                      <ul className="space-y-0.5" role="list" aria-label={`Eskalacije: ${p.naziv}`}>
                        {p.eskalacije.map((e, i) => (
                          <li
                            key={i}
                            className="flex flex-wrap items-center gap-2 text-xs px-1 py-1 rounded bg-gray-800/40"
                          >
                            <span className="text-gray-400 font-mono">{e.nakon}min</span>
                            <span className="text-blue-400 font-mono">{e.nivo}</span>
                            <span className="px-1 py-0.5 rounded text-[10px] bg-gray-700 text-gray-400 border border-gray-600">
                              {e.kanal}
                            </span>
                            <span className="text-gray-300">{e.primatelj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-gray-600">ID: {p.id} · Kreiran: {p.kreiran.slice(0, 10)}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right">
        <a
          href="/api/autofinish-alert-rules"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="JSON API alert pravila"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
