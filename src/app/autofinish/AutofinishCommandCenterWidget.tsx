import type { AutofinishHealthScoreResult } from '@/lib/autofinish-petlja';

type AutofinishCommandCenterWidgetProps = {
  healthScore: AutofinishHealthScoreResult;
  readiness: {
    score: number;
    status: string;
  };
  dora: {
    deployFrequency: string;
    leadTime: string;
    mttr: string;
    changeFailureRate: string;
  };
  errorBudget: {
    slo: number;
    preostalo: number;
    incidenti: number;
  };
};

export function AutofinishCommandCenterWidget({
  healthScore,
  readiness,
  dora,
  errorBudget,
}: AutofinishCommandCenterWidgetProps) {
  return (
    <section className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800" aria-label="Autofinish command center">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">
        <span aria-hidden="true">🛰️ </span>Autofinish Command Center
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg bg-gray-800 p-3">
          <p className="text-xs text-gray-400">Health</p>
          <p className="text-2xl font-bold text-green-400">{healthScore.skor}%</p>
          <p className="text-xs text-gray-500">{healthScore.ocjena}</p>
        </article>
        <article className="rounded-lg bg-gray-800 p-3">
          <p className="text-xs text-gray-400">Readiness</p>
          <p className="text-2xl font-bold text-indigo-300">{readiness.score}%</p>
          <p className="text-xs text-gray-500">{readiness.status}</p>
        </article>
        <article className="rounded-lg bg-gray-800 p-3">
          <p className="text-xs text-gray-400">Error budget</p>
          <p className="text-2xl font-bold text-yellow-300">{errorBudget.preostalo}%</p>
          <p className="text-xs text-gray-500">SLO {errorBudget.slo}% • Incidenti {errorBudget.incidenti}</p>
        </article>
        <article className="rounded-lg bg-gray-800 p-3">
          <p className="text-xs text-gray-400">DORA</p>
          <p className="text-sm font-semibold text-cyan-300">{dora.deployFrequency}</p>
          <p className="text-xs text-gray-500">Lead {dora.leadTime} • MTTR {dora.mttr} • CFR {dora.changeFailureRate}</p>
        </article>
      </div>
    </section>
  );
}
