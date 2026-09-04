// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO Card Component
// Kompanija SPAJA — Digitalna Industrija

import type { EkselencioResult, EkselencioTier, EkuarePillar } from '@/lib/ekselencio';
import { EKUARE_PILLAR_LABELS } from '@/lib/ekselencio';

interface EkselencioCardProps {
  result: EkselencioResult;
}

const TIER_STYLES: Record<EkselencioTier, string> = {
  TRANSCENDENT: 'border-violet-400 bg-violet-950/50 text-violet-100',
  APEX: 'border-blue-400 bg-blue-950/50 text-blue-100',
  MASTER: 'border-cyan-400 bg-cyan-950/50 text-cyan-100',
  RISING: 'border-yellow-400 bg-yellow-950/50 text-yellow-100',
  GENESIS: 'border-stone-400 bg-stone-950/50 text-stone-100',
};

const TIER_BADGE_STYLES: Record<EkselencioTier, string> = {
  TRANSCENDENT: 'bg-violet-500 text-white',
  APEX: 'bg-blue-500 text-white',
  MASTER: 'bg-cyan-500 text-black',
  RISING: 'bg-yellow-500 text-black',
  GENESIS: 'bg-stone-500 text-white',
};

const PILLAR_ICONS: Record<EkuarePillar, string> = {
  ES: '⭐',
  KC: '🧠',
  UOA: '🔍',
  AR: '🔄',
  RT: '🏆',
  EV: '📈',
};

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-current transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export function EkselencioCard({ result }: EkselencioCardProps) {
  if (!result.valid) {
    return (
      <section className="rounded-xl border border-amber-600 bg-amber-950/40 p-4 text-amber-100">
        <h3 className="text-sm font-semibold tracking-wide uppercase">EKSELENCIO v1</h3>
        <p className="mt-2 text-sm font-medium">Evaluacija nije dostupna</p>
        <p className="mt-3 text-xs text-amber-300 italic">{result.disclaimer}</p>
      </section>
    );
  }

  const evolutionLabel =
    result.evolutionSignal > 0.05
      ? '↑ Rast'
      : result.evolutionSignal < -0.05
        ? '↓ Pad'
        : '→ Stagnacija';

  return (
    <section className={`rounded-xl border p-4 ${TIER_STYLES[result.tier]}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide uppercase">EKSELENCIO v1</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${TIER_BADGE_STYLES[result.tier]}`}>
          {result.tier}
        </span>
      </div>

      {/* EKUARE RA Score */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide opacity-60">EKUARE RA Score</span>
          <span className="font-bold text-lg">{result.ekuareRaScore.toFixed(1)} / 1000</span>
        </div>
        <div className="mt-1">
          <ScoreBar score={result.ekuareRaScore / 10} />
        </div>
      </div>

      {/* Pillars */}
      <div className="mt-4 space-y-2">
        {result.pillars.map((p) => (
          <div key={p.pillar}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <span>{PILLAR_ICONS[p.pillar]}</span>
                <span className={p.isBlindSpot ? 'text-red-400' : ''}>{EKUARE_PILLAR_LABELS[p.pillar]}</span>
                {p.isBlindSpot && <span className="text-red-400 text-[10px]">⚠</span>}
              </span>
              <span className="font-semibold">{p.score}</span>
            </div>
            <ScoreBar score={p.score} />
          </div>
        ))}
      </div>

      {/* Evolution signal */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="opacity-60 uppercase tracking-wide">Evolucija</span>
        <span className="font-semibold">{evolutionLabel} ({result.evolutionSignal.toFixed(3)})</span>
      </div>

      {/* Recommendation */}
      {result.recommendation && (
        <p className="mt-3 text-xs opacity-80 border-t border-current/20 pt-2">
          {result.recommendation}
        </p>
      )}

      {/* Blind spots */}
      {result.blindSpots.length > 0 && (
        <div className="mt-2 text-xs text-red-400">
          <span className="font-semibold">Slabe tačke: </span>
          {result.blindSpots.map((p) => EKUARE_PILLAR_LABELS[p]).join(', ')}
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-3 text-xs opacity-50 italic">{result.disclaimer}</p>
    </section>
  );
}
