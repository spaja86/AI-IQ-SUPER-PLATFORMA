import type { TrenazerResult } from '@/lib/trenazer';

interface TrenazerSummaryCardProps {
  result: TrenazerResult;
}

export function TrenazerSummaryCard({ result }: TrenazerSummaryCardProps) {
  if (!result.valid) {
    return (
      <section className="rounded-xl border border-amber-600 bg-amber-950/40 p-4 text-amber-100">
        <h3 className="text-sm font-semibold tracking-wide">TRENAZER v1</h3>
        <p className="mt-2 text-sm font-medium">Recommendation unavailable</p>
        <ul className="mt-2 list-disc pl-5 text-xs text-amber-200">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-slate-100">
      <h3 className="text-sm font-semibold tracking-wide">TRENAZER v1</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <p>Readiness: <strong>{result.readiness}</strong></p>
        <p>Score: <strong>{result.readinessScore.toFixed(2)}</strong></p>
        <p>Intensity: <strong>{result.recommendedIntensity}</strong></p>
        <p>Duration: <strong>{result.recommendedDurationMinutes}min</strong></p>
      </div>
      {result.focusAreas.length > 0 && (
        <p className="mt-3 text-xs text-slate-300">
          Focus: <strong>{result.focusAreas.join(', ')}</strong>
        </p>
      )}
    </section>
  );
}
