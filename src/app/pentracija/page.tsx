// Pentracija — Penetration Testing Dashboard
// Kompanija SPAJA — Digitalna Industrija
// Zahteva: ΩClearanceLevel.ADMIN

import type { Metadata } from 'next';
import { buildPentestReport, OWASP_KATEGORIJE } from '@/lib/pentracija';
import type { PentestFinding, PentestKategorija, PentestSeverity } from '@/lib/pentracija';

export const metadata: Metadata = {
  title: 'Pentracija — AI IQ SUPER PLATFORMA',
  description: 'Automatizovano testiranje penetracije — OWASP Top 10 analiza i CVSS skorovi',
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

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'fixed':     return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'mitigated': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'open':      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'accepted':  return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'wontfix':   return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    default:          return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  return '#ef4444';
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>Pentest Skor</span>
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

function SeverityBadge({ severity }: { severity: PentestSeverity }) {
  const color = severityColor(severity);
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-bold uppercase"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {severity}
    </span>
  );
}

function OWASPGrid({ findings }: { findings: PentestFinding[] }) {
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
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-zinc-500">{katFindings.length} nalaz{katFindings.length !== 1 ? 'a' : ''}</span>
              {worst && <SeverityBadge severity={worst} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PentestPage() {
  const report = buildPentestReport();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#7c3aed]/20 text-3xl">
          🎯
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Pentracija</h1>
          <p className="text-zinc-400">Automatizovano testiranje penetracije — Kompanija SPAJA</p>
        </div>
        <div className="ml-auto rounded-full border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-1.5 text-xs font-bold text-[#ef4444]">
          ADMIN ONLY
        </div>
      </div>

      {/* Pentest Skor */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">🎯 Pentest Skor</h2>
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

      {/* OWASP Top 10 Grid */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-white">🛡️ OWASP Top 10 Pregled</h2>
        <OWASPGrid findings={report.findings} />
      </div>

      {/* Nalazi Tabela */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">📋 Nalazi</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-zinc-400">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Naziv</th>
                <th className="pb-3 pr-4">Kategorija</th>
                <th className="pb-3 pr-4">Severity</th>
                <th className="pb-3 pr-4">CVSS</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Remedijacija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {report.findings.map((f) => (
                <tr key={f.id} className="text-zinc-300 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-zinc-500">{f.id}</td>
                  <td className="py-3 pr-4 font-medium text-white max-w-[200px]">
                    <div className="truncate" title={f.naziv}>{f.naziv}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{f.owaspRef}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 px-2 py-0.5 text-xs">
                      {OWASP_KATEGORIJE.find((k) => k.id === f.kategorija)?.ikona ?? '🔍'}{' '}
                      {f.kategorija}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <SeverityBadge severity={f.severity} />
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className="font-bold text-sm"
                      style={{ color: f.cvssScore === 0 ? '#6b7280' : severityColor(f.severity) }}
                    >
                      {f.cvssScore === 0 ? '—' : f.cvssScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(f.status)}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-zinc-400 max-w-[240px]">
                    <span title={f.remedijacija} className="line-clamp-2">{f.remedijacija}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pokretanje Skena */}
      <div className="rounded-2xl border border-[#f97316]/20 bg-[#f97316]/5 p-6">
        <h2 className="mb-2 text-lg font-bold text-white">🚀 Pokreni Novi Sken</h2>
        <p className="mb-4 text-sm text-zinc-400">
          Pokretanje novog penetration skena zahteva <strong className="text-[#f97316]">SUPER_ADMIN</strong> nivo pristupa.
          Rezultati biće dostupni na <code className="text-[#a78bfa]">GET /api/pentracija</code>.
        </p>
        <div className="flex items-center gap-4">
          <form method="POST" action="/api/pentracija/sken">
            <button
              type="submit"
              className="rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#ea6e0a] transition-colors"
            >
              POST /api/pentracija/sken
            </button>
          </form>
          <a
            href="/api/pentracija"
            className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-colors"
          >
            GET /api/pentracija
          </a>
          <a
            href="/api/pentracija/status"
            className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-colors"
          >
            GET Status
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-zinc-600">
        Pentracija v{report.verzija} | OWASP Top 10 | CVSS Scoring | Kompanija SPAJA
      </div>
    </div>
  );
}
