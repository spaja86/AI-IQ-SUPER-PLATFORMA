import type { GreatSumbionResult } from '@/lib/great-sumbion';

interface GreatSumbionKpiCardProps {
  result: GreatSumbionResult;
}

export function GreatSumbionKpiCard({ result }: GreatSumbionKpiCardProps) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-slate-100">
      <h3 className="text-sm font-semibold tracking-wide">GREAT SUMBION KPI</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <p>Score: <strong>{result.score.toFixed(2)}</strong></p>
        <p>Tier: <strong>{result.tier}</strong></p>
        <p>Status: <strong>{result.valid ? 'VALID' : 'INVALID'}</strong></p>
        <p>Duration: <strong>{result.durationMs}ms</strong></p>
      </div>
    </section>
  );
}
