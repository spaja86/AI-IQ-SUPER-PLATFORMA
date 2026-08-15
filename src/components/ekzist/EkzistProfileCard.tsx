// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST Profile Card
// Kompanija SPAJA — Digitalna Industrija

import type { EkzistResult, EkzistTier } from '@/lib/ekzist';

interface EkzistProfileCardProps {
  result: EkzistResult;
}

const TIER_STYLES: Record<EkzistTier, string> = {
  PEAK: 'border-violet-500 bg-violet-950/40 text-violet-100',
  ALIGNED: 'border-blue-500 bg-blue-950/40 text-blue-100',
  AWAKENING: 'border-cyan-500 bg-cyan-950/40 text-cyan-100',
  SEARCHING: 'border-yellow-500 bg-yellow-950/40 text-yellow-100',
  GROUNDED: 'border-stone-500 bg-stone-950/40 text-stone-100',
};

const TIER_BADGE_STYLES: Record<EkzistTier, string> = {
  PEAK: 'bg-violet-500 text-white',
  ALIGNED: 'bg-blue-500 text-white',
  AWAKENING: 'bg-cyan-500 text-black',
  SEARCHING: 'bg-yellow-500 text-black',
  GROUNDED: 'bg-stone-500 text-white',
};

const DOMAIN_ICONS: Record<string, string> = {
  MEANING: '✦',
  PURPOSE: '🎯',
  IDENTITY: '🪞',
  CONNECTION: '🤝',
  AUTONOMY: '🦅',
  LEGACY: '🏛️',
  TRANSCENDENCE: '∞',
  GROWTH: '🌱',
};

export function EkzistProfileCard({ result }: EkzistProfileCardProps) {
  if (!result.valid) {
    return (
      <section className="rounded-xl border border-amber-600 bg-amber-950/40 p-4 text-amber-100">
        <h3 className="text-sm font-semibold tracking-wide">EKZIST v1</h3>
        <p className="mt-2 text-sm font-medium">Profil nije dostupan</p>
        <ul className="mt-2 list-disc pl-5 text-xs text-amber-200">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-amber-300 italic">{result.disclaimer}</p>
      </section>
    );
  }

  const topRecommendations = result.recommendations.slice(0, 3);

  return (
    <section className={`rounded-xl border p-4 ${TIER_STYLES[result.tier]}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide">EKZIST v1</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${TIER_BADGE_STYLES[result.tier]}`}>
          {result.tier}
        </span>
      </div>

      {/* Dominant vector */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-lg">{DOMAIN_ICONS[result.dominantVector] ?? '●'}</span>
        <div>
          <p className="text-sm font-semibold">Dominantni vektor: {result.dominantVector}</p>
          <p className="text-xs opacity-70">Ref: {result.referenceId}</p>
        </div>
      </div>

      {/* Balance score bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide opacity-60">Ravnoteža</span>
          <span className="font-bold">{result.balanceScore}%</span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-current/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-current transition-all"
            style={{ width: `${result.balanceScore}%` }}
          />
        </div>
      </div>

      {/* Domain scores */}
      <div className="mt-3">
        <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Dimenzije</p>
        <ul className="mt-1 space-y-1">
          {result.dimensionScores.map((ds) => (
            <li key={ds.domain} className="text-xs">
              <div className="flex items-center justify-between">
                <span>{DOMAIN_ICONS[ds.domain] ?? '●'} {ds.domain}</span>
                <span className="ml-2 opacity-75">{ds.score}</span>
              </div>
              <div className="mt-0.5 h-1 rounded-full bg-current/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-current transition-all"
                  style={{ width: `${ds.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      {topRecommendations.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Preporuke</p>
          <ul className="mt-1 list-disc pl-5 space-y-1">
            {topRecommendations.map((rec) => (
              <li key={rec} className="text-xs">{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="mt-3 rounded-lg bg-current/10 px-3 py-2">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Upozorenja</p>
          <ul className="mt-1 list-disc pl-5 space-y-0.5">
            {result.warnings.map((w) => (
              <li key={w} className="text-xs opacity-80">{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-4 text-xs opacity-50 italic">{result.disclaimer}</p>
    </section>
  );
}
