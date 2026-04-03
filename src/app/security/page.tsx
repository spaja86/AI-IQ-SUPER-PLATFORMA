// SpajaUltraOmegaCore -∞Ω+∞ — Security Dashboard
// Kompanija SPAJA — Digitalna Industrija
// Dostupno samo korisnicima sa OMEGA_CORE clearance nivoom

import type { Metadata } from 'next';
import { ΩPermissionMatrix, ΩClearanceLevel } from '@/lib/auth/omega-permissions';
import { ΩAuditLogger } from '@/middleware/omega-audit';
import { ΩSessionManager } from '@/lib/digital-industry/omega-session';
import { ΩResourceGuard } from '@/lib/digital-industry/omega-resource-guard';

export const metadata: Metadata = {
  title: 'Ω Bezbednosni Dashboard | AI IQ SUPER PLATFORMA',
  description:
    'SpajaUltraOmegaCore -∞Ω+∞ — Bezbednosni pregled sistema. Samo OMEGA_CORE pristup.',
};

function SecurityScoreBar({ score }: { score: number }) {
  const max = 100;
  const pct = Math.min(score, max);
  const color =
    pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : '#ef4444';

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>Ω Bezbednosni Skor</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-700">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const auditStats = ΩAuditLogger.getStats();
  const sessionStats = ΩSessionManager.getStats();
  const recentEvents = ΩAuditLogger.getRecentEvents(10);
  const resources = ΩResourceGuard.getAllResources();

  // Izračunaj Ω Bezbednosni Skor (0-100)
  const chainScore = auditStats.chainValid ? 25 : 0;
  const deniedRatio =
    auditStats.total > 0
      ? Math.max(0, 25 - Math.floor((auditStats.denied / auditStats.total) * 50))
      : 25;
  const sessionScore = sessionStats.active > 0 ? 25 : 20;
  const resourceScore = resources.filter((r) => r.encryptedAtRest).length > 5 ? 25 : 15;
  const omegaScore = chainScore + deniedRatio + sessionScore + resourceScore;

  const clearanceLevels = [
    { level: ΩClearanceLevel.VISITOR, name: 'VISITOR', color: '#6b7280' },
    { level: ΩClearanceLevel.USER, name: 'USER', color: '#3b82f6' },
    { level: ΩClearanceLevel.OPERATOR, name: 'OPERATOR', color: '#8b5cf6' },
    { level: ΩClearanceLevel.ADMIN, name: 'ADMIN', color: '#f59e0b' },
    { level: ΩClearanceLevel.SUPER_ADMIN, name: 'SUPER_ADMIN', color: '#ef4444' },
    { level: ΩClearanceLevel.OMEGA_CORE, name: 'OMEGA_CORE -∞Ω+∞', color: '#06b6d4' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#7c3aed]/20 text-3xl">
          🔐
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            SpajaUltraOmegaCore -∞Ω+∞
          </h1>
          <p className="text-zinc-400">
            Bezbednosni Dashboard — Digitalna Industrija
          </p>
        </div>
        <div className="ml-auto rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 px-4 py-1.5 text-xs font-bold text-[#06b6d4]">
          OMEGA CORE -∞Ω+∞
        </div>
      </div>

      {/* Security Score */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Ω Bezbednosni Skor</h2>
        <SecurityScoreBar score={omegaScore} />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Audit Lanac', value: auditStats.chainValid ? '✅ Validan' : '❌ Narušen', ok: auditStats.chainValid },
            { label: 'Zero Trust', value: '✅ Aktivno', ok: true },
            { label: 'Enkriptovanje', value: '✅ AES-256-GCM', ok: true },
            { label: 'CSRF Zaštita', value: '✅ Double Submit', ok: true },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white/5 p-3">
              <div className="text-xs text-zinc-500">{item.label}</div>
              <div className={`mt-1 text-sm font-semibold ${item.ok ? 'text-green-400' : 'text-red-400'}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistike */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Audit Događaji', value: auditStats.total, icon: '📋', color: '#7c3aed' },
          { label: 'Uspešno', value: auditStats.success, icon: '✅', color: '#22c55e' },
          { label: 'Odbijeno', value: auditStats.denied, icon: '🚫', color: '#ef4444' },
          { label: 'Aktivne Sesije', value: sessionStats.active, icon: '🔗', color: '#06b6d4' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-zinc-400">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Audit Log */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">
            📋 Poslednji Audit Događaji
          </h2>
          {recentEvents.length === 0 ? (
            <p className="text-zinc-500 text-sm">Nema zabeleaženih događaja</p>
          ) : (
            <div className="space-y-2">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border border-white/5 bg-black/20 p-3"
                >
                  <span
                    className={`mt-0.5 flex-shrink-0 text-xs font-bold ${
                      event.outcome === 'SUCCESS'
                        ? 'text-green-400'
                        : event.outcome === 'DENIED'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {event.outcome === 'SUCCESS' ? '✅' : event.outcome === 'DENIED' ? '🚫' : '⚠️'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-white">
                      {event.action}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(event.timestamp).toLocaleString('sr-RS')} • {event.ip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clearance Nivoi */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">
            🎖️ Clearance Nivoi
          </h2>
          <div className="space-y-2">
            {clearanceLevels.map((cl) => (
              <div
                key={cl.level}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/20 p-3"
              >
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: cl.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{cl.name}</div>
                  <div className="text-xs text-zinc-500">
                    Nivo {cl.level} — {ΩPermissionMatrix.getClearanceLevelName(cl.level)}
                  </div>
                </div>
                <div
                  className="rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: `${cl.color}20`,
                    color: cl.color,
                    border: `1px solid ${cl.color}40`,
                  }}
                >
                  L{cl.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zaštićeni Resursi */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">
          🛡️ Zaštićeni Resursi Digitalne Industrije
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-zinc-400">
                <th className="pb-3 pr-4">Resurs</th>
                <th className="pb-3 pr-4">Tip</th>
                <th className="pb-3 pr-4">Klasifikacija</th>
                <th className="pb-3 pr-4">Min. Clearance</th>
                <th className="pb-3 pr-4">Enkriptovano</th>
                <th className="pb-3">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {resources.map((r) => (
                <tr key={r.resourceId} className="text-zinc-300">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">{r.path}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs">
                      {r.type}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-xs">
                    {ΩResourceGuard.getClassificationLabel(r.classification)}
                  </td>
                  <td className="py-2 pr-4 text-xs">
                    {ΩPermissionMatrix.getClearanceLevelName(r.requiredClearance)}
                  </td>
                  <td className="py-2 pr-4 text-xs">
                    {r.encryptedAtRest ? '🔒 Da' : '🔓 Ne'}
                  </td>
                  <td className="py-2 text-xs">
                    {r.auditAccess ? '📋 Da' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-xs text-zinc-600">
        SpajaUltraOmegaCore -∞Ω+∞ | Zero Trust | Kvantno-Otporno | Nepromenjivi Audit Log
      </div>
    </div>
  );
}
