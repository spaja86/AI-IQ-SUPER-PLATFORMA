// Autofinish #1073 — Dashboard SlaMonitorWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type { AutofinishSlaMonitorResult, AutofinishSlaService } from '@/lib/autofinish-petlja';

interface Props { sla: AutofinishSlaMonitorResult; }

const STATUS_STYLE: Record<AutofinishSlaService['status'], { cls: string; emoji: string }> = {
  'ispunjen': { cls: 'text-green-400 bg-green-900/30', emoji: '✅' },
  'na-rubu': { cls: 'text-yellow-400 bg-yellow-900/30', emoji: '⚠️' },
  'probijen': { cls: 'text-red-400 bg-red-900/30', emoji: '❌' },
};

const TIER_STYLE: Record<AutofinishSlaService['tier'], string> = {
  'platinum': 'text-purple-300',
  'gold': 'text-yellow-400',
  'silver': 'text-gray-300',
  'bronze': 'text-amber-700',
};

export function SlaMonitorWidget({ sla }: Props) {
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="SLA monitor">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">📊 </span>SLA Monitor</h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-green-400 font-mono">{sla.ispunjenih}</span> ispunjeno ·{' '}
        <span className="text-red-400 font-mono">{sla.probjenih}</span> probjeno ·{' '}
        Prosj. uptime: <span className="text-white font-mono">{sla.prosjecniUptime}%</span>
      </p>
      <ul className="space-y-2" role="list">
        {sla.services.map((s) => {
          const style = STATUS_STYLE[s.status];
          const pct = Math.min(100, parseFloat(s.aktualUptimePct.toFixed(2)));
          const barColor = pct >= s.targetUptimePct ? 'bg-green-500' : pct >= s.targetUptimePct - 0.5 ? 'bg-yellow-500' : 'bg-red-500';
          const barWidth = `${pct}%`;
          return (
            <li key={s.id} className="rounded-lg bg-gray-800/40 border border-gray-800 p-3" aria-label={`${s.naziv}: ${s.aktualUptimePct}% uptime, ${s.status}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{style.emoji}</span>
                  <span className="text-gray-200 text-sm">{s.naziv}</span>
                  <span className={`text-[10px] ${TIER_STYLE[s.tier]} uppercase font-semibold`}>{s.tier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${style.cls}`}>{s.status}</span>
                  <span className="text-gray-300 font-mono text-xs">{s.aktualUptimePct}%</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden mb-1.5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className={`h-full rounded-full ${barColor}`} style={{ width: barWidth }} />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
                <span>Target: <span className="text-gray-400">{s.targetUptimePct}%</span></span>
                {s.breachCount > 0 && <span className="text-red-400">Breach: {s.breachCount}x</span>}
                {s.mttrMin > 0 && <span>MTTR: <span className="text-gray-400">{s.mttrMin}min</span></span>}
              </div>
              {s.napomena && <p className="text-[10px] text-gray-600 mt-0.5">{s.napomena}</p>}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-sla-monitor" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
