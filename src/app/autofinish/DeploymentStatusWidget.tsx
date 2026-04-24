// Autofinish #1060 — Dashboard DeploymentStatusWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React from 'react';
import type { AutofinishDeploymentStatusResult, AutofinishDeployStatus } from '@/lib/autofinish-petlja';

interface Props { deployment: AutofinishDeploymentStatusResult; }

const STATUS_STYLE: Record<AutofinishDeployStatus, { cls: string; emoji: string }> = {
  'aktivan': { cls: 'text-green-400 bg-green-900/30', emoji: '🟢' },
  'deploying': { cls: 'text-blue-400 bg-blue-900/30', emoji: '🔵' },
  'degradovan': { cls: 'text-yellow-400 bg-yellow-900/30', emoji: '🟡' },
  'offline': { cls: 'text-red-400 bg-red-900/30', emoji: '🔴' },
  'maintance': { cls: 'text-gray-400 bg-gray-800/40', emoji: '🔧' },
};

const ENV_ORDER: Record<string, number> = { production: 0, staging: 1, development: 2, preview: 3 };

export function DeploymentStatusWidget({ deployment }: Props) {
  const sorted = [...deployment.deployments].sort((a, b) => (ENV_ORDER[a.okruzenje] ?? 9) - (ENV_ORDER[b.okruzenje] ?? 9));

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Deployment status po okruženjima">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🚀 </span>Deployment Status</h2>
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-green-400 font-mono">{deployment.aktivnih}</span> aktivnih ·{' '}
        <span className="text-yellow-400 font-mono">{deployment.degradovanih}</span> degradovanih ·{' '}
        Prosj. zdravlje <span className="text-white font-mono">{deployment.prosjecnoZdravlje}%</span>
      </p>
      <ul className="space-y-3" role="list">
        {sorted.map((d) => {
          const style = STATUS_STYLE[d.status];
          const zdravljeColor = d.zdravlje >= 95 ? 'bg-green-500' : d.zdravlje >= 80 ? 'bg-yellow-500' : 'bg-red-500';
          return (
            <li key={d.id} className="rounded-lg bg-gray-800/40 border border-gray-800 p-3" aria-label={`${d.naziv}: ${d.status}, zdravlje ${d.zdravlje}%`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{style.emoji}</span>
                  <span className="text-gray-200 text-sm font-medium">{d.naziv}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${style.cls}`}>{d.status}</span>
                </div>
                <span className="text-gray-400 font-mono text-xs">{d.zdravlje}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden mb-2" role="progressbar" aria-valuenow={d.zdravlje} aria-valuemin={0} aria-valuemax={100}>
                <div className={`h-full rounded-full ${zdravljeColor}`} style={{ width: `${d.zdravlje}%` }} />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
                <span>v<span className="font-mono text-gray-400">{d.verzija}</span></span>
                <span>commit: <span className="font-mono text-gray-400">{d.commit}</span></span>
                <span>build: <span className="font-mono text-gray-400">{d.trajanjeSek}s</span></span>
              </div>
              <p className="text-[10px] text-gray-600 mt-0.5">{d.napomena}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-deployment-status" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
