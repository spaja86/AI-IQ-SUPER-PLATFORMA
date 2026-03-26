import type { Metadata } from 'next';
import { runDiagnostics } from '@/lib/auto-repair/diagnostics';
import { generateUpgradePlan, assessUpgradeOpportunities } from '@/lib/auto-repair/upgrade-engine';
import StatusBadge from '@/components/StatusBadge';
import AutoRepairActions from './AutoRepairActions';

export const metadata: Metadata = {
  title: 'Auto-Popravka',
  description:
    'Automatski sistem za dijagnostiku, popravku i nadogradnju AI IQ SUPER PLATFORMA. Self-healing i self-improving sistem.',
};

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 90
      ? 'text-green-400'
      : score >= 70
        ? 'text-yellow-400'
        : score >= 50
          ? 'text-orange-400'
          : 'text-red-400';

  const bgColor =
    score >= 90
      ? 'bg-green-500/10 border-green-500/20'
      : score >= 70
        ? 'bg-yellow-500/10 border-yellow-500/20'
        : score >= 50
          ? 'bg-orange-500/10 border-orange-500/20'
          : 'bg-red-500/10 border-red-500/20';

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border p-8 ${bgColor}`}>
      <div className={`text-6xl font-black ${color}`}>{score}</div>
      <div className="mt-1 text-sm font-medium text-zinc-400">/ 100</div>
      <div className="mt-2 text-lg font-semibold text-white">Health Score</div>
    </div>
  );
}

function severityIcon(severity: string) {
  switch (severity) {
    case 'critical': return '🔴';
    case 'warning': return '🟡';
    case 'info': return '🔵';
    case 'success': return '🟢';
    default: return '⚪';
  }
}

function checkStatusToRepairStatus(status: string): string {
  switch (status) {
    case 'pass': return 'active';
    case 'fail': return 'concept';
    case 'warning': return 'development';
    case 'skipped': return 'planned';
    default: return 'concept';
  }
}

function priorityBadge(priority: string) {
  const classes: Record<string, string> = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${classes[priority] ?? classes.low}`}>
      {priority}
    </span>
  );
}

export default function AutoPopravkaPage() {
  const report = runDiagnostics();
  const upgradePlan = generateUpgradePlan(report);
  const opportunities = assessUpgradeOpportunities(report.recommendations);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-[#7c3aed]/20 to-[#2563eb]/20 px-4 py-1.5 text-sm font-semibold text-[#7c3aed]">
          🔧 Auto-Popravka System v1.0
        </div>
        <h1 className="text-4xl font-extrabold text-white">
          Auto-Popravka
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-zinc-400">
          Automatski sistem za dijagnostiku, popravku i nadogradnju cele platforme.
          Skenira sve — build, lint, tipove, API, stranice, security, SEO, performanse —
          i automatski popravlja pronađene probleme dok ne nađe maksimalna, sjajna rešenja.
        </p>
      </div>

      {/* Score + Summary */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Score gauge */}
        <ScoreGauge score={report.score} />

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
          {[
            { label: 'Ukupno Provera', value: report.summary.total, icon: '🔍' },
            { label: 'Prošle', value: report.summary.passed, icon: '✅' },
            { label: 'Upozorenja', value: report.summary.warnings, icon: '⚠️' },
            { label: 'Neuspele', value: report.summary.failed, icon: '❌' },
            { label: 'Auto-Popravljivih', value: report.summary.autoFixable, icon: '🔧' },
            { label: 'Preporuka', value: report.recommendations.length, icon: '💡' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-zinc-400">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons (client component) */}
      <AutoRepairActions />

      {/* Diagnostic Checks */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">
          🔍 Dijagnostičke Provere
        </h2>
        <div className="space-y-3">
          {report.checks.map((check) => (
            <div
              key={check.id}
              className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#7c3aed]/30"
            >
              <span className="mt-0.5 text-xl">{severityIcon(check.severity)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-white">{check.nameSr}</h3>
                  <StatusBadge status={checkStatusToRepairStatus(check.status)} />
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-500">
                    {check.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-400">{check.messageSr}</p>
                {check.fixAvailable && check.fixDescriptionSr && (
                  <p className="mt-2 text-xs text-[#7c3aed]">
                    🔧 Popravka dostupna: {check.fixDescriptionSr}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade Plan */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">
          📈 Plan Nadogradnje
        </h2>
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
            <div className="text-2xl font-bold text-white">{upgradePlan.currentScore}</div>
            <div className="text-xs text-zinc-400">Trenutni Score</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
            <div className="text-2xl font-bold text-green-400">{upgradePlan.projectedScore}</div>
            <div className="text-xs text-zinc-400">Projektovani Score</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
            <div className="text-2xl font-bold text-[#7c3aed]">{upgradePlan.totalAutoFixable}</div>
            <div className="text-xs text-zinc-400">Auto-Popravljivih</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
            <div className="text-2xl font-bold text-yellow-400">{upgradePlan.totalManualRequired}</div>
            <div className="text-xs text-zinc-400">Ručno Potrebno</div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">
          💡 Preporuke za Unapređenje
        </h2>

        {/* High Priority */}
        {opportunities.highPriority.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-red-400">
              🔴 Visok Prioritet
            </h3>
            <div className="space-y-3">
              {opportunities.highPriority.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 p-5"
                >
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-white">{rec.titleSr}</h4>
                    {priorityBadge(rec.priority)}
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-500">
                      {rec.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{rec.descriptionSr}</p>
                  <div className="mt-3 flex gap-4 text-xs text-zinc-500">
                    <span>Napor: {rec.effort}</span>
                    <span>Uticaj: {rec.impact}</span>
                    <span>{rec.autoFixable ? '🤖 Auto-fix dostupan' : '👤 Ručno potrebno'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium Priority */}
        {opportunities.mediumPriority.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-yellow-400">
              🟡 Srednji Prioritet
            </h3>
            <div className="space-y-3">
              {opportunities.mediumPriority.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5"
                >
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-white">{rec.titleSr}</h4>
                    {priorityBadge(rec.priority)}
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{rec.descriptionSr}</p>
                  <div className="mt-3 flex gap-4 text-xs text-zinc-500">
                    <span>Napor: {rec.effort}</span>
                    <span>Uticaj: {rec.impact}</span>
                    <span>{rec.autoFixable ? '🤖 Auto-fix dostupan' : '👤 Ručno potrebno'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Priority */}
        {opportunities.lowPriority.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-blue-400">
              🔵 Nizak Prioritet
            </h3>
            <div className="space-y-3">
              {opportunities.lowPriority.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5"
                >
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-white">{rec.titleSr}</h4>
                    {priorityBadge(rec.priority)}
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{rec.descriptionSr}</p>
                  <div className="mt-3 flex gap-4 text-xs text-zinc-500">
                    <span>Napor: {rec.effort}</span>
                    <span>Uticaj: {rec.impact}</span>
                    <span>{rec.autoFixable ? '🤖 Auto-fix dostupan' : '👤 Ručno potrebno'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* System Info */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">
          ⚙️ Informacije o Sistemu
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xs text-zinc-500">Verzija</div>
              <div className="text-sm font-medium text-white">{report.version}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Platforma</div>
              <div className="text-sm font-medium text-white">{report.platform}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Overall Status</div>
              <div className="mt-0.5">
                <StatusBadge
                  status={
                    report.overallStatus === 'healthy'
                      ? 'active'
                      : report.overallStatus === 'degraded'
                        ? 'development'
                        : 'concept'
                  }
                  size="md"
                />
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Poslednja Provera</div>
              <div className="text-sm font-medium text-white">
                {new Date(report.timestamp).toLocaleString('sr-Latn-RS')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints Info */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">
          🔗 API Endpoints za Auto-Popravku
        </h2>
        <div className="space-y-3">
          {[
            {
              method: 'GET',
              path: '/api/auto-repair',
              desc: 'Pokreni dijagnostiku i dobij izveštaj',
            },
            {
              method: 'POST',
              path: '/api/auto-repair',
              desc: 'Pokreni automatsku popravku',
            },
            {
              method: 'GET',
              path: '/api/auto-repair/history',
              desc: 'Pregled istorije popravki',
            },
            {
              method: 'GET',
              path: '/api/status',
              desc: 'Status celokupnog ekosistema',
            },
            {
              method: 'GET',
              path: '/api/health',
              desc: 'Health check svih servisa',
            },
          ].map((ep) => (
            <div
              key={`${ep.method}-${ep.path}`}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                  ep.method === 'GET'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}
              >
                {ep.method}
              </span>
              <code className="text-sm font-mono text-[#7c3aed]">{ep.path}</code>
              <span className="text-sm text-zinc-400">{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
