// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO EKUARE RA EKSILARIUM Engine
// Kompanija SPAJA — Digitalna Industrija

import type { EkuarePillar, EkselencioTier, PillarBreakdown } from './types';
import {
  EKUARE_PILLAR_LABELS,
  EKUARE_PILLARS,
  EKSELENCIO_BLIND_SPOT_THRESHOLD,
  EKSELENCIO_MAX_SCORE,
  EKSELENCIO_MIN_SCORE,
} from './types';

// ─── Score clamping ───────────────────────────────────────────────────────────

export function clampPillarScore(value: unknown): number {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  return Math.max(EKSELENCIO_MIN_SCORE, Math.min(EKSELENCIO_MAX_SCORE, value));
}

// ─── Geometric mean of top-4 pillar scores ────────────────────────────────────
// Zero-score slots are intentionally kept in the denominator: missing pillars
// penalise the overall score (4 is always the denominator, reflecting the
// expectation that a high-performing agent covers all EKUARE pillars).

export function geometricMeanTop4(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => b - a);
  const top4 = sorted.slice(0, 4);
  const nonZero = top4.filter((s) => s > 0);
  if (nonZero.length === 0) return 0;
  const logSum = nonZero.reduce((acc, s) => acc + Math.log(s), 0);
  return Math.exp(logSum / top4.length); // top4.length = penalised denominator
}

// ─── Tier mapping ─────────────────────────────────────────────────────────────

export function computeEkselencioTier(ekuareRaScore: number): EkselencioTier {
  if (ekuareRaScore >= 800) return 'TRANSCENDENT';
  if (ekuareRaScore >= 600) return 'APEX';
  if (ekuareRaScore >= 400) return 'MASTER';
  if (ekuareRaScore >= 200) return 'RISING';
  return 'GENESIS';
}

// ─── Pillar breakdown builder ─────────────────────────────────────────────────

export function buildPillarBreakdown(
  domainScores: Partial<Record<EkuarePillar, number>>,
): PillarBreakdown[] {
  return EKUARE_PILLARS.map((pillar) => {
    const raw = domainScores[pillar];
    const score = clampPillarScore(raw);
    return {
      pillar,
      label: EKUARE_PILLAR_LABELS[pillar],
      score,
      isBlindSpot: score < EKSELENCIO_BLIND_SPOT_THRESHOLD,
    };
  });
}

// ─── Recommendation catalog ───────────────────────────────────────────────────

const TIER_RECOMMENDATIONS: Record<EkselencioTier, string> = {
  GENESIS:
    'Postavi temelje izvrsnosti: definiši standarde za svaki EKUARE stub i prati konzistentnost.',
  RISING:
    'Fokusiraj se na najslabije stubove — ubrzaj rast kroz ciljane korake i agilne iteracije.',
  MASTER:
    'Sinhronizuj stubove — balans između ES, KC i UOA stvara sinergiju koja multiplicira rezultate.',
  APEX:
    'Proširi uticaj izvrsnosti na cijelu platformu: mentoriši agente, kodificiraj standarde.',
  TRANSCENDENT:
    'Tvoja izvrsnost je na vrhuncu — kreiraj nove standarde koji transcendiraju trenutne okvire platforme.',
};

export function buildEkselencioRecommendation(
  tier: EkselencioTier,
  blindSpots: EkuarePillar[],
): string {
  const base = TIER_RECOMMENDATIONS[tier];
  if (blindSpots.length === 0) return base;
  const spotLabels = blindSpots.map((p) => EKUARE_PILLAR_LABELS[p]).join(', ');
  return `${base} Prioritizuj sledeće slabe tačke: ${spotLabels}.`;
}
