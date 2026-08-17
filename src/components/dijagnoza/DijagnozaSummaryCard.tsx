import type { DijagnozaResult, DijagnozaUrgency } from '@/lib/dijagnoza';

interface DijagnozaSummaryCardProps {
  result: DijagnozaResult;
}

const URGENCY_STYLES: Record<DijagnozaUrgency, string> = {
  CRITICAL: 'border-red-600 bg-red-950/40 text-red-100',
  HIGH: 'border-orange-500 bg-orange-950/40 text-orange-100',
  MEDIUM: 'border-yellow-500 bg-yellow-950/40 text-yellow-100',
  LOW: 'border-green-600 bg-green-950/40 text-green-100',
};

const URGENCY_BADGE_STYLES: Record<DijagnozaUrgency, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-yellow-500 text-black',
  LOW: 'bg-green-600 text-white',
};

export function DijagnozaSummaryCard({ result }: DijagnozaSummaryCardProps) {
  if (!result.valid) {
    return (
      <section className="rounded-xl border border-amber-600 bg-amber-950/40 p-4 text-amber-100">
        <h3 className="text-sm font-semibold tracking-wide">DIJAGNOZA v1</h3>
        <p className="mt-2 text-sm font-medium">Dijagnoza nije dostupna</p>
        <ul className="mt-2 list-disc pl-5 text-xs text-amber-200">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-amber-300 italic">{result.disclaimer}</p>
      </section>
    );
  }

  return (
    <section className={`rounded-xl border p-4 ${URGENCY_STYLES[result.urgency]}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide">DIJAGNOZA v1</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${URGENCY_BADGE_STYLES[result.urgency]}`}>
          {result.urgency}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium">{result.primaryDiagnosis}</p>
      <p className="mt-1 text-xs opacity-75">Sledeći korak: <strong>{result.nextStep}</strong></p>

      {result.differentials.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Diferencijalne dijagnoze</p>
          <ul className="mt-1 space-y-1">
            {result.differentials.map((d) => (
              <li key={d.name} className="text-xs">
                <div className="flex items-center justify-between">
                  <span>{d.name}</span>
                  <span className="ml-2 opacity-75">{Math.round(d.probability * 100)}%</span>
                </div>
                <div className="mt-0.5 h-1 rounded-full bg-current/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current"
                    style={{ width: `${Math.round(d.probability * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.warnings.length > 0 && (
        <ul className="mt-3 list-disc pl-5 text-xs opacity-80">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-xs opacity-50 italic">{result.disclaimer}</p>
      <p className="mt-1 text-xs opacity-40">{result.durationMs}ms</p>
    </section>
  );
}
