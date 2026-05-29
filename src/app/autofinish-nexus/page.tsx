import type { Metadata } from 'next';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET, KOMPANIJA } from '@/lib/constants';
import {
  getAutofinishHealthScore,
  getAutofinishReleaseReadiness,
  getAutofinishErrorBudget,
  getAutofinishDoraMetrics,
} from '@/lib/autofinish-petlja';

export const metadata: Metadata = {
  title: 'Autofinish Nexus',
  description: 'Operativni sazetak autofinish stanja kroz kljucne metrike i API ulaze.',
};

export default function AutofinishNexusPage() {
  const healthScore = getAutofinishHealthScore();
  const readiness = getAutofinishReleaseReadiness();
  const budget = getAutofinishErrorBudget();
  const dora = getAutofinishDoraMetrics();

  const progressPct = Math.min(100, Math.round((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Autofinish Nexus</p>
          <h1 className="mt-2 text-3xl font-semibold">Kontrolni centar autofinish ciklusa</h1>
          <p className="mt-2 text-sm text-slate-400">
            {KOMPANIJA} • Verzija {APP_VERSION} • Iteracija #{AUTOFINISH_COUNT}
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6" aria-label="Globalni progres">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
            <span>Progres ka targetu</span>
            <span className="font-semibold text-cyan-300">{progressPct}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct}>
            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {AUTOFINISH_COUNT.toLocaleString()} / {AUTOFINISH_TARGET.toLocaleString()} iteracija
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2" aria-label="Kljucne metrike">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm text-slate-400">Health score</h2>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{healthScore.score}%</p>
            <p className="text-xs text-slate-500">{healthScore.status}</p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm text-slate-400">Release readiness</h2>
            <p className="mt-2 text-3xl font-bold text-indigo-300">{readiness.score}%</p>
            <p className="text-xs text-slate-500">{readiness.status}</p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm text-slate-400">Error budget</h2>
            <p className="mt-2 text-3xl font-bold text-amber-300">{budget.preostalo}%</p>
            <p className="text-xs text-slate-500">SLO: {budget.slo}%</p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm text-slate-400">DORA deploy frequency</h2>
            <p className="mt-2 text-3xl font-bold text-fuchsia-300">{dora.deployFrequency}</p>
            <p className="text-xs text-slate-500">Lead time: {dora.leadTime}</p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6" aria-label="Brzi linkovi">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">Brzi linkovi</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a className="rounded-lg border border-cyan-600 px-3 py-1.5 text-cyan-300 hover:bg-cyan-950" href="/autofinish">
              Otvori glavni dashboard
            </a>
            <a className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800" href="/api/autofinish-petlja">
              API: petlja
            </a>
            <a className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800" href="/api/autofinish-release-readiness">
              API: readiness
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
