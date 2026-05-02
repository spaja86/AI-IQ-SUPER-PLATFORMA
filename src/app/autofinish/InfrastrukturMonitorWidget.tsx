// Autofinish #1125 — Dashboard InfrastrukturMonitorWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type {
  AutofinishInfrastrukturaResult,
  AutofinishInfraStatus,
  AutofinishInfraUloga,
} from '@/lib/autofinish-petlja';

interface Props { infrastruktura: AutofinishInfrastrukturaResult; }

const STATUS_STYLE: Record<AutofinishInfraStatus, string> = {
  ok:       'text-green-400 bg-green-900/30 border-green-800',
  warning:  'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  critical: 'text-red-400 bg-red-900/40 border-red-800',
};

const STATUS_EMOJI: Record<AutofinishInfraStatus, string> = {
  ok:       '🟢',
  warning:  '🟡',
  critical: '🔴',
};

const ULOGA_EMOJI: Record<AutofinishInfraUloga, string> = {
  aplikacija: '🖥️',
  baza:       '🗄️',
  kes:        '⚡',
  proxy:      '🔀',
  monitoring: '📊',
};

const REGION_STYLE: Record<string, string> = {
  'eu-central':   'text-blue-300 bg-blue-900/20',
  'eu-west':      'text-purple-300 bg-purple-900/20',
  'us-east':      'text-orange-300 bg-orange-900/20',
  'us-west':      'text-yellow-300 bg-yellow-900/20',
  'ap-southeast': 'text-green-300 bg-green-900/20',
};

const ALL_ULOGE: Array<AutofinishInfraUloga | 'sve'> = [
  'sve', 'aplikacija', 'baza', 'kes', 'proxy', 'monitoring',
];
const ALL_STATUSI: Array<AutofinishInfraStatus | 'svi'> = ['svi', 'ok', 'warning', 'critical'];

function MetricBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5" aria-hidden="true">
      <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function metricColor(value: number): string {
  if (value >= 85) return 'bg-red-500';
  if (value >= 70) return 'bg-yellow-500';
  return 'bg-green-500';
}

export function InfrastrukturMonitorWidget({ infrastruktura }: Props) {
  const [ulogaFilter, setUlogaFilter] = useState<AutofinishInfraUloga | 'sve'>('sve');
  const [statusFilter, setStatusFilter] = useState<AutofinishInfraStatus | 'svi'>('svi');
  const [expanded, setExpanded] = useState<string | null>(null);

  const { summary } = infrastruktura;

  const filtered = infrastruktura.nodeovi.filter((n) => {
    const matchUloga = ulogaFilter === 'sve' || n.uloga === ulogaFilter;
    const matchStatus = statusFilter === 'svi' || n.status === statusFilter;
    return matchUloga && matchStatus;
  });

  return (
    <section
      className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
      aria-label="Infrastruktura monitor pregled"
    >
      <h2 className="text-lg font-semibold text-gray-300 mb-1">
        <span aria-hidden="true">🖥️ </span>Infrastruktura Monitor
      </h2>

      {/* Summary row */}
      <div className="flex flex-wrap gap-4 mb-3 text-sm">
        <span className="text-gray-500">
          Čvorovi: <span className="text-white font-mono font-semibold">{summary.ukupnoNodeova}</span>
        </span>
        <span className="text-green-400">🟢 {summary.okNodeova} ok</span>
        <span className="text-yellow-400">🟡 {summary.upozorenjaNodeova} upozorenja</span>
        <span className="text-red-400">🔴 {summary.kriticnihNodeova} kritično</span>
      </div>

      {/* Avg metrics row */}
      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
        {[
          { label: 'Ø CPU', value: summary.prosjecniCpu },
          { label: 'Ø RAM', value: summary.prosjecniRam },
          { label: 'Ø Disk', value: summary.prosjecniDisk },
          { label: 'Ø Uptime', value: summary.prosjecniUptime },
        ].map(({ label, value }) => (
          <div key={label} className="rounded bg-gray-800 px-3 py-2 text-center">
            <div className="text-xs text-gray-500 mb-0.5">{label}</div>
            <div
              className={`text-base font-bold font-mono ${value >= 85 ? 'text-red-400' : value >= 70 ? 'text-yellow-400' : 'text-green-400'}`}
              aria-label={`${label}: ${value}%`}
            >
              {value}%
            </div>
            <MetricBar value={value} color={metricColor(value)} />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter po ulozi">
          {ALL_ULOGE.map((u) => (
            <button
              key={u}
              onClick={() => setUlogaFilter(u)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                ulogaFilter === u
                  ? 'bg-blue-700 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
              aria-pressed={ulogaFilter === u}
            >
              {u === 'sve' ? 'Sve uloge' : `${ULOGA_EMOJI[u as AutofinishInfraUloga]} ${u}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter po statusu">
          {ALL_STATUSI.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                statusFilter === s
                  ? 'bg-purple-800 border-purple-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
              aria-pressed={statusFilter === s}
            >
              {s === 'svi' ? 'Svi statusi' : `${STATUS_EMOJI[s as AutofinishInfraStatus]} ${s}`}
            </button>
          ))}
        </div>
      </div>

      {/* Node list */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Nema čvorova za odabrane filtere.</p>
      ) : (
        <ul className="space-y-2" role="list">
          {filtered.map((node) => {
            const isOpen = expanded === node.id;
            return (
              <li
                key={node.id}
                className={`rounded-lg border px-4 py-3 ${STATUS_STYLE[node.status]}`}
              >
                {/* Node header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span aria-hidden="true" className="text-base shrink-0">{ULOGA_EMOJI[node.uloga]}</span>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-white truncate font-mono">{node.naziv}</span>
                      <span className="block text-xs text-gray-500">{node.uloga}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-semibold ${REGION_STYLE[node.region] ?? 'text-gray-300 bg-gray-800/30'}`}
                      aria-label={`Region: ${node.region}`}
                    >
                      {node.region}
                    </span>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded border ${STATUS_STYLE[node.status]}`}
                      aria-label={`Status: ${node.status}`}
                    >
                      {STATUS_EMOJI[node.status]} {node.status}
                    </span>
                    <button
                      onClick={() => setExpanded(isOpen ? null : node.id)}
                      className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      aria-expanded={isOpen}
                      aria-controls={`infra-detail-${node.id}`}
                    >
                      {isOpen ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {/* Metric mini-bars (always visible) */}
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-400">
                  {[
                    { label: 'CPU', value: node.cpu },
                    { label: 'RAM', value: node.ram },
                    { label: 'Disk', value: node.disk },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-0.5">
                        <span>{label}</span>
                        <span className={`font-mono font-semibold ${value >= 85 ? 'text-red-400' : value >= 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {value}%
                        </span>
                      </div>
                      <MetricBar value={value} color={metricColor(value)} />
                    </div>
                  ))}
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div
                    id={`infra-detail-${node.id}`}
                    className="mt-3 text-xs text-gray-400 border-t border-gray-700 pt-3 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <div className="rounded bg-gray-800 px-2 py-1.5 text-center">
                        <div className="text-gray-500 mb-0.5">Uptime</div>
                        <div className="text-green-400 font-mono font-bold">{node.uptimePostotak}%</div>
                      </div>
                      <div className="rounded bg-gray-800 px-2 py-1.5 text-center">
                        <div className="text-gray-500 mb-0.5">Mreža ↓</div>
                        <div className="text-blue-400 font-mono">{node.mrezaUlazMbps} Mbps</div>
                      </div>
                      <div className="rounded bg-gray-800 px-2 py-1.5 text-center">
                        <div className="text-gray-500 mb-0.5">Mreža ↑</div>
                        <div className="text-blue-400 font-mono">{node.mrezaIzlazMbps} Mbps</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Load 1m', value: node.loadAverage1m },
                        { label: 'Load 5m', value: node.loadAverage5m },
                        { label: 'Load 15m', value: node.loadAverage15m },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded bg-gray-800 px-2 py-1.5 text-center">
                          <div className="text-gray-500 mb-0.5">{label}</div>
                          <div className={`font-mono font-semibold ${value >= 3 ? 'text-red-400' : value >= 2 ? 'text-yellow-400' : 'text-gray-300'}`}>
                            {value.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-gray-500 text-xs">
                      Zadnje ažuriranje: <span className="text-gray-300 font-mono">{node.zadnjeAzuriranjeISO.slice(0, 19).replace('T', ' ')}</span>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 text-right">
        <a
          href="/api/autofinish-infrastruktura"
          className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Preuzmi infrastruktura monitor kao JSON"
        >
          JSON API →
        </a>
      </div>
    </section>
  );
}
