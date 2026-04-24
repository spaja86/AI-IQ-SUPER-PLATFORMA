// Autofinish #1052 — Dashboard PerfLatencyWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishPerfLatencyResult, AutofinishPerfEndpoint } from '@/lib/autofinish-petlja';

interface Props { perf: AutofinishPerfLatencyResult; }

type SortKey = 'p50ms' | 'p95ms' | 'p99ms' | 'errorRate' | 'throughputRps';

const STATUS_STYLE: Record<AutofinishPerfEndpoint['status'], string> = {
  'odlično': 'text-green-400 bg-green-900/30',
  'dobro': 'text-blue-400 bg-blue-900/30',
  'sporo': 'text-yellow-400 bg-yellow-900/30',
  'kritično': 'text-red-400 bg-red-900/30',
};

export function PerfLatencyWidget({ perf }: Props) {
  const [sort, setSort] = useState<SortKey>('p95ms');
  const sorted = [...perf.endpoints].sort((a, b) => b[sort] - a[sort]);

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Performanse i latency API sistema">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">⚡ </span>Performanse i Latency</h2>
      <p className="text-sm text-gray-500 mb-3">
        Prosj. p95: <span className="text-white font-mono">{perf.prosjecniP95ms}ms</span> ·{' '}
        Error rate: <span className="text-yellow-400 font-mono">{perf.ukupniErrorRate}%</span>
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Sortiraj po">
        {(['p50ms', 'p95ms', 'p99ms', 'errorRate', 'throughputRps'] as SortKey[]).map((k) => (
          <button key={k} onClick={() => setSort(k)} className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${sort === k ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`} aria-pressed={sort === k}>{k}</button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" aria-label="Latency tabela">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left py-1 pr-3 font-normal">Endpoint</th>
              <th className="text-right py-1 px-1 font-normal">p50</th>
              <th className="text-right py-1 px-1 font-normal">p95</th>
              <th className="text-right py-1 px-1 font-normal">p99</th>
              <th className="text-right py-1 px-1 font-normal">RPS</th>
              <th className="text-right py-1 pl-1 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr key={e.endpoint} className="border-b border-gray-800/40 hover:bg-gray-800/20 transition-colors">
                <td className="py-1 pr-3 text-gray-300 truncate max-w-[180px]" title={e.endpoint}>{e.endpoint}</td>
                <td className="py-1 px-1 text-right font-mono text-gray-400">{e.p50ms}ms</td>
                <td className="py-1 px-1 text-right font-mono text-gray-300">{e.p95ms}ms</td>
                <td className="py-1 px-1 text-right font-mono text-gray-400">{e.p99ms}ms</td>
                <td className="py-1 px-1 text-right font-mono text-gray-400">{e.throughputRps}</td>
                <td className="py-1 pl-1 text-right"><span className={`px-1.5 py-0.5 rounded text-[10px] ${STATUS_STYLE[e.status]}`}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-right"><a href="/api/autofinish-perf-latency" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
