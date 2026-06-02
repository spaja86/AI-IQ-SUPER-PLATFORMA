import type {
  AutofinishDoraMetricsResult,
  AutofinishErrorBudgetResult,
  AutofinishHealthScoreResult,
  AutofinishReleaseReadinessResult,
} from '@/lib/autofinish-petlja';

type AutofinishCommandCenterWidgetProps = {
  healthScore: AutofinishHealthScoreResult;
  readiness: AutofinishReleaseReadinessResult;
  dora: AutofinishDoraMetricsResult;
  errorBudget: AutofinishErrorBudgetResult;
};

export function AutofinishCommandCenterWidget({
  healthScore,
  readiness,
  dora,
  errorBudget,
}: AutofinishCommandCenterWidgetProps) {
  const deployFrequency = dora.metrike.find((metric) => metric.id === 'dora-deployment-frequency');
  const leadTime = dora.metrike.find((metric) => metric.id === 'dora-lead-time');
  const mttr = dora.metrike.find((metric) => metric.id === 'dora-mttr');
  const changeFailureRate = dora.metrike.find((metric) => metric.id === 'dora-change-failure-rate');
  const doraSummary = [
    `Lead ${leadTime ? `${leadTime.vrijednost} ${leadTime.jedinica}` : 'N/A'}`,
    `MTTR ${mttr ? `${mttr.vrijednost} ${mttr.jedinica}` : 'N/A'}`,
    `CFR ${changeFailureRate ? `${changeFailureRate.vrijednost}${changeFailureRate.jedinica}` : 'N/A'}`,
  ].join(' • ');

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
          <p className="text-2xl font-bold text-indigo-300">{readiness.summary.overallScore}%</p>
          <p className="text-xs text-gray-500">{readiness.status}</p>
        </article>
        <article className="rounded-lg bg-gray-800 p-3">
          <p className="text-xs text-gray-400">Error budget</p>
          <p className="text-2xl font-bold text-yellow-300">{errorBudget.prosjecnaPotrosenjaOst}%</p>
          <p className="text-xs text-gray-500">
            Zdravi {errorBudget.zdravih} • Kritični {errorBudget.kriticnih + errorBudget.iscrpljenih}
          </p>
        </article>
        <article className="rounded-lg bg-gray-800 p-3">
          <p className="text-xs text-gray-400">DORA</p>
          <p className="text-sm font-semibold text-cyan-300">
            {deployFrequency ? `${deployFrequency.vrijednost} ${deployFrequency.jedinica}` : 'N/A'}
          </p>
          <p className="text-xs text-gray-500">{doraSummary}</p>
        </article>
      </div>
    </section>
  );
}
