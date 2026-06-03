// Panetracija 2 — V2 Penetration Testing Dashboard
// Kompanija SPAJA — Digitalna Industrija
// Zahteva: ΩClearanceLevel.ADMIN, scope: panetracija2:read

import type { Metadata } from 'next';
import {
  buildPentestReportV2,
  OWASP_KATEGORIJE,
} from '@/lib/panetracija-2';
import type { PentestFindingV2, PentestKategorija, PentestSeverity, PentestScanSummary, PentestTrend } from '@/lib/panetracija-2';
import PentestFilterTable from './PentestFilterTable';

export const metadata: Metadata = {
  title: 'Panetracija 2 — AI IQ SUPER PLATFORMA',
  description: 'V2 Automatizovano testiranje penetracije — OWASP Top 10, CVSS 3.1, CWE, scan istorija i trendovi',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function severityColor(s: PentestSeverity): string {
  switch (s) {
    case 'critical': return '#ef4444';
    case 'high':     return '#f97316';
    case 'medium':   return '#eab308';
    case 'low':      return '#3b82f6';
    case 'info':     return '#6b7280';
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  return '#ef4444';
}

function scanStatusClass(status: string): string {
  switch (status) {
    case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'running':   return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'pending':   return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'failed':    return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:          return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }
}

// ─── Sub-components (Server) ──────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>Pentest Skor V2</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-3 w-full rounded-full bg-zinc-700">
        <div
          className="h-3 rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function TrendSparkline({ trendovi }: { trendovi: PentestTrend[] }) {
  if (trendovi.length === 0) return null;
  const scores = trendovi.map((t) => t.overallScore);
  const min = Math.min(...scores, 0);
  const max = Math.max(...scores, 100);
  const range = max - min || 1;
  const width = 200;
  const height = 48;
  const pts = scores
    .map((s, i) => {
      const x = (i / Math.max(scores.length - 1, 1)) * width;
      const y = height - ((s - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const lastScore = scores[0] ?? 0;
  const color = scoreColor(lastScore);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-zinc-400">📈 Trend Skora (poslednjih {trendovi.length} skenova)</span>
        <span className="text-xs font-bold" style={{ color }}>{lastScore}/100</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 48 }}>
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.9"
        />
        {scores.map((s, i) => {
          const x = (i / Math.max(scores.length - 1, 1)) * width;
          const y = height - ((s - min) / range) * height;
          return (
            <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3" fill={color} />
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-zinc-600">
        {trendovi.map((t, i) => (
          <span key={i} title={t.timestamp}>
            {t.delta > 0 ? `+${t.delta}` : t.delta < 0 ? `${t.delta}` : '±0'}
          </span>
        ))}
      </div>
    </div>
  );
}

function OWASPGridV2({ findings }: { findings: PentestFindingV2[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {OWASP_KATEGORIJE.map((kat) => {
        const katFindings = findings.filter((f) => f.kategorija === kat.id as PentestKategorija);
        const worst = katFindings.reduce<PentestSeverity | null>((acc, f) => {
          const order: PentestSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];
          if (!acc) return f.severity;
          return order.indexOf(f.severity) < order.indexOf(acc) ? f.severity : acc;
        }, null);
        const color = worst ? severityColor(worst) : '#6b7280';
        const cweIds = [...new Set(katFindings.map((f) => f.cweId))].slice(0, 2);
        return (
          <div
            key={kat.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
            style={{ borderColor: `${color}30` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{kat.ikona}</span>
              <span className="text-xs font-semibold text-zinc-400">{kat.owaspRef}</span>
            </div>
            <div className="text-sm font-medium text-white truncate">{kat.naziv}</div>
            {cweIds.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {cweIds.map((cwe) => (
                  <span key={cwe} className="text-xs font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                    {cwe}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-zinc-500">{katFindings.length} nalaz{katFindings.length !== 1 ? 'a' : ''}</span>
              {worst && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-bold uppercase"
                  style={{ backgroundColor: `${severityColor(worst)}20`, color: severityColor(worst), border: `1px solid ${severityColor(worst)}40` }}
                >
                  {worst}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScanHistoryPanel({ istorija }: { istorija: PentestScanSummary[] }) {
  if (istorija.length === 0) {
    return (
      <p className="text-sm text-zinc-500">Još nema pokrenuti skenova. Pokrenite sken putem POST /api/panetracija-2/sken.</p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-zinc-400">
            <th className="pb-3 pr-4">Scan ID</th>
            <th className="pb-3 pr-4">Datum</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4">Trajanje</th>
            <th className="pb-3 pr-4">Skor</th>
            <th className="pb-3">Nalazi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {istorija.map((s) => (
            <tr key={s.scanId} className="text-zinc-300">
              <td className="py-2.5 pr-4 font-mono text-xs text-zinc-500 max-w-[140px] truncate" title={s.scanId}>
                {s.scanId}
              </td>
              <td className="py-2.5 pr-4 text-xs">
                {new Date(s.startedAt).toLocaleString('sr-RS')}
              </td>
              <td className="py-2.5 pr-4">
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${scanStatusClass(s.status)}`}>
                  {s.status}
                </span>
              </td>
              <td className="py-2.5 pr-4 text-xs text-zinc-400">
                {s.durationMs != null ? `${(s.durationMs / 1000).toFixed(1)}s` : '—'}
              </td>
              <td className="py-2.5 pr-4">
                {s.overallScore != null ? (
                  <span className="font-bold text-sm" style={{ color: scoreColor(s.overallScore) }}>
                    {s.overallScore}/100
                  </span>
                ) : '—'}
              </td>
              <td className="py-2.5 text-xs text-zinc-400">{s.ukupnoNalaza ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Panetracija2Page() {
  const report = buildPentestReportV2();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#7c3aed]/20 text-3xl">
          🎯
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">Panetracija 2</h1>
            <span className="rounded-full bg-[#7c3aed]/30 border border-[#7c3aed]/50 px-2.5 py-0.5 text-xs font-bold text-[#a78bfa]">
              v2
            </span>
          </div>
          <p className="text-zinc-400">V2 Automatizovano testiranje penetracije — Kompanija SPAJA</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="rounded-full border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-1.5 text-xs font-bold text-[#ef4444]">
            ADMIN ONLY
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
            {report.verzija}
          </span>
        </div>
      </div>

      {/* Pentest Skor + Trend */}
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">🎯 Pentest Skor V2</h2>
          <ScoreBar score={report.overallScore} />
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {[
              { label: 'Critical', value: report.critical, color: '#ef4444' },
              { label: 'High',     value: report.high,     color: '#f97316' },
              { label: 'Medium',   value: report.medium,   color: '#eab308' },
              { label: 'Low',      value: report.low,      color: '#3b82f6' },
              { label: 'Info',     value: report.info,     color: '#6b7280' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-white/5 p-3 text-center">
                <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
                <div className="text-xs text-zinc-500">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: 'Ukupno Nalaza', value: report.ukupnoNalaza, icon: '📋' },
              { label: 'Otvorenih',     value: report.openNalaza,   icon: '🔴' },
              { label: 'Popravljenih',  value: report.fixedNalaza,  icon: '✅' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-xl font-bold text-white">{item.value}</div>
                  <div className="text-xs text-zinc-400">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <TrendSparkline trendovi={report.trendovi} />
          <div className="mt-4 space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Scan ID</span>
              <span className="font-mono text-zinc-500 truncate max-w-[120px]" title={report.scanId}>{report.scanId}</span>
            </div>
            <div className="flex justify-between">
              <span>Trajanje (est.)</span>
              <span>{(report.durationMs / 1000).toFixed(0)}s</span>
            </div>
            <div className="flex justify-between">
              <span>Poslednji sken</span>
              <span>{new Date(report.timestamp).toLocaleString('sr-RS')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* OWASP Grid */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-white">🛡️ OWASP Top 10 Pregled (V2 + CWE)</h2>
        <OWASPGridV2 findings={report.findings} />
      </div>

      {/* Findings Table — Client Component sa filterima */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">📋 Nalazi V2</h2>
        <PentestFilterTable findings={report.findings} />
      </div>

      {/* Scan Istorija */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">🕐 Istorija Skenova</h2>
        <ScanHistoryPanel istorija={report.history} />
      </div>

      {/* Pokretanje Skena */}
      <div className="rounded-2xl border border-[#f97316]/20 bg-[#f97316]/5 p-6">
        <h2 className="mb-2 text-lg font-bold text-white">🚀 Pokreni Novi Sken (V2)</h2>
        <p className="mb-4 text-sm text-zinc-400">
          Pokretanje novog V2 penetration skena zahteva <strong className="text-[#f97316]">SUPER_ADMIN</strong> nivo pristupa.
          Rezultati biće dostupni na <code className="text-[#a78bfa]">GET /api/panetracija-2</code>.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <form method="POST" action="/api/panetracija-2/sken">
            <button
              type="submit"
              className="rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#ea6e0a] transition-colors"
            >
              POST /api/panetracija-2/sken
            </button>
          </form>
          {[
            { href: '/api/panetracija-2', label: 'GET Report' },
            { href: '/api/panetracija-2/status', label: 'GET Status' },
            { href: '/api/panetracija-2/nalazi', label: 'GET Nalazi' },
            { href: '/api/panetracija-2/istorija', label: 'GET Istorija' },
            { href: '/api/panetracija-2/trendovi', label: 'GET Trendovi' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-zinc-600">
        Panetracija 2 v{report.verzija} | OWASP Top 10 | CVSS 3.1 | CWE | Kompanija SPAJA
      </div>
    </div>
  );
}
