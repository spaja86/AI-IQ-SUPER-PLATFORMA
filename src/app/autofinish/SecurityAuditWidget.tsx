// Autofinish #1064 — Dashboard SecurityAuditWidget
// Kompanija SPAJA — Digitalna Industrija
'use client';
import React, { useState } from 'react';
import type { AutofinishSecurityAuditResult, AutofinishSecuritySeverity, AutofinishSecurityStatus } from '@/lib/autofinish-petlja';

interface Props { audit: AutofinishSecurityAuditResult; }

const SEVERITY_STYLE: Record<AutofinishSecuritySeverity, string> = {
  'info': 'text-gray-400 bg-gray-800/60',
  'low': 'text-blue-400 bg-blue-900/30',
  'medium': 'text-yellow-400 bg-yellow-900/30',
  'high': 'text-orange-400 bg-orange-900/30',
  'critical': 'text-red-400 bg-red-900/30',
};

const STATUS_EMOJI: Record<AutofinishSecurityStatus, string> = {
  'open': '🔓', 'mitigated': '🛡️', 'accepted': '✅', 'fixed': '🔒', 'wontfix': '⬛',
};

export function SecurityAuditWidget({ audit }: Props) {
  const [filter, setFilter] = useState<string>('svi');
  const severities = ['svi', 'critical', 'high', 'medium', 'low', 'info'];
  const filtered = filter === 'svi' ? audit.findings : audit.findings.filter((f) => f.severity === filter);
  const sorted = [...filtered].sort((a, b) => b.cvssScore - a.cvssScore);
  const [selected, setSelected] = useState<string | null>(null);

  const scoreColor = audit.overallScore >= 80 ? 'text-green-400' : audit.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Sigurnosni audit">
      <h2 className="text-lg font-semibold text-gray-300 mb-1"><span aria-hidden="true">🔐 </span>Security Audit</h2>
      <p className="text-sm text-gray-500 mb-1">
        Skor: <span className={`font-mono font-bold ${scoreColor}`}>{audit.overallScore}/100</span> ·{' '}
        <span className="text-red-400 font-mono">{audit.critical}</span> crit ·{' '}
        <span className="text-orange-400 font-mono">{audit.high}</span> high ·{' '}
        <span className="text-yellow-400 font-mono">{audit.medium}</span> med ·{' '}
        <span className="text-blue-400 font-mono">{audit.low}</span> low ·{' '}
        <span className="text-green-400 font-mono">{audit.fixedNalaza}</span> fixed
      </p>
      <div className="flex flex-wrap gap-1 mb-3" role="group" aria-label="Filter po severity">
        {severities.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-2 py-0.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === s ? 'bg-gray-700 border-gray-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`} aria-pressed={filter === s}>{s}</button>
        ))}
      </div>
      <ul className="space-y-1" role="list">
        {sorted.map((f) => {
          const isOpen = selected === f.id;
          return (
            <li key={f.id}>
              <button className="w-full flex items-center gap-2 text-sm px-2 py-2 text-left hover:bg-gray-800/50 focus:outline-none focus:bg-gray-800/50 rounded transition-colors" onClick={() => setSelected(isOpen ? null : f.id)} aria-expanded={isOpen} aria-label={`${f.naziv}: CVSS ${f.cvssScore}, ${f.severity}`}>
                <span aria-hidden="true">{STATUS_EMOJI[f.status]}</span>
                <span className="flex-1 text-gray-300 truncate">{f.naziv}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${SEVERITY_STYLE[f.severity]}`}>{f.severity}</span>
                <span className="text-gray-500 font-mono text-xs">CVSS {f.cvssScore}</span>
                <span aria-hidden="true" className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="ml-4 mb-2 text-xs space-y-1">
                  <p className="text-gray-400">{f.opis}</p>
                  <div className="flex gap-3 text-gray-500 flex-wrap">
                    <span>OWASP: <span className="text-gray-300">{f.owaspKategorija}</span></span>
                    <span>Status: <span className="text-gray-300">{f.status}</span></span>
                  </div>
                  <p className="text-gray-500">Mitigacija: <span className="text-gray-300">{f.mitigacija}</span></p>
                  <p className="text-gray-600 italic">Otkriveno: {f.otkriveno}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-right"><a href="/api/autofinish-security-audit" className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="JSON API">JSON API →</a></div>
    </section>
  );
}
