// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV Portfolio Card
// Kompanija SPAJA — Digitalna Industrija

import type { AdutivResult, AdutivTier } from '@/lib/adutiv';

interface AdutivPortfolioCardProps {
  result: AdutivResult;
}

const TIER_STYLES: Record<AdutivTier, string> = {
  APEX: 'border-amber-400 bg-amber-950/40 text-amber-100',
  DOMINANT: 'border-orange-500 bg-orange-950/40 text-orange-100',
  ACTIVE: 'border-green-500 bg-green-950/40 text-green-100',
  EMERGING: 'border-sky-500 bg-sky-950/40 text-sky-100',
  LATENT: 'border-stone-500 bg-stone-950/40 text-stone-100',
};

const TIER_BADGE_STYLES: Record<AdutivTier, string> = {
  APEX: 'bg-amber-400 text-black',
  DOMINANT: 'bg-orange-500 text-white',
  ACTIVE: 'bg-green-500 text-white',
  EMERGING: 'bg-sky-500 text-white',
  LATENT: 'bg-stone-500 text-white',
};

const DOMAIN_ICONS: Record<string, string> = {
  SKILL: '⚡',
  KNOWLEDGE: '📚',
  NETWORK: '🕸️',
  RESOURCE: '💎',
  REPUTATION: '🏅',
  CREATIVITY: '✨',
  RESILIENCE: '🛡️',
  TIMING: '⏱️',
};

export function AdutivPortfolioCard({ result }: AdutivPortfolioCardProps) {
  if (!result.valid) {
    return (
      <section className="rounded-xl border border-amber-600 bg-amber-950/40 p-4 text-amber-100">
        <h3 className="text-sm font-semibold tracking-wide">ADUTIV v1</h3>
        <p className="mt-2 text-sm font-medium">Portfolio nije dostupan</p>
        <ul className="mt-2 list-disc pl-5 text-xs text-amber-200">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-amber-300 italic">{result.disclaimer}</p>
      </section>
    );
  }

  const topPlan = result.activationPlan.slice(0, 4);

  return (
    <section className={`rounded-xl border p-4 ${TIER_STYLES[result.tier]}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide">ADUTIV v1</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${TIER_BADGE_STYLES[result.tier]}`}>
          {result.tier}
        </span>
      </div>

      {/* Apex adut */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-lg">{DOMAIN_ICONS[result.apexAdut] ?? '🃏'}</span>
        <div>
          <p className="text-sm font-semibold">Apex adut: {result.apexAdut}</p>
          <p className="text-xs opacity-70">Ref: {result.referenceId}</p>
        </div>
      </div>

      {/* Portfolio score bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide opacity-60">Portfolio skor</span>
          <span className="font-bold">{result.portfolioScore}%</span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-current/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-current transition-all"
            style={{ width: `${result.portfolioScore}%` }}
          />
        </div>
      </div>

      {/* Strength map */}
      <div className="mt-3">
        <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Mapa prednosti</p>
        <ul className="mt-1 space-y-1">
          {result.strengthMap.map((s) => (
            <li key={s.domain} className="text-xs">
              <div className="flex items-center justify-between">
                <span>{DOMAIN_ICONS[s.domain] ?? '●'} {s.domain}</span>
                <span className="ml-2 opacity-75">{s.score}</span>
              </div>
              <div className="mt-0.5 h-1 rounded-full bg-current/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-current transition-all"
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Activation plan */}
      {topPlan.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Plan aktivacije</p>
          <ul className="mt-1 list-disc pl-5 space-y-1">
            {topPlan.map((step) => (
              <li key={step} className="text-xs">{step}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Blind-spot warnings */}
      {result.warnings.length > 0 && (
        <div className="mt-3 rounded-lg bg-current/10 px-3 py-2">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Slepe tačke</p>
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
