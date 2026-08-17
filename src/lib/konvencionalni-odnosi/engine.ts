// SpajaUltraOmegaCore -∞Ω+∞ — KONVENCIONALNI ODNOSI Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  KonvencionalniOdnosiDimension,
  KonvencionalniOdnosiDimensionScore,
  KonvencionalniOdnosiHealthReport,
  KonvencionalniOdnosiInput,
  KonvencionalniOdnosiRelationType,
  KonvencionalniOdnosiResult,
  KonvencionalniOdnosiTier,
} from './types';
import {
  KONVENCIONALNI_ODNOSI_API_RESPONSE_MAX_MS,
  KONVENCIONALNI_ODNOSI_CONTRACT_VERSION,
  KONVENCIONALNI_ODNOSI_DEFAULT_RELATION_TYPE,
  KONVENCIONALNI_ODNOSI_MAX_SCORE,
  KONVENCIONALNI_ODNOSI_MIN_SCORE,
  KONVENCIONALNI_ODNOSI_MODULE_VERSION,
  KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS,
  KONVENCIONALNI_ODNOSI_PERSONA_ID,
} from './types';

let evaluations = 0;
let lastScore = 0;
let lastTier: KonvencionalniOdnosiTier = 'KRHKO';

const TIER_RECOMMENDATIONS: Record<KonvencionalniOdnosiTier, string[]> = {
  KRHKO: [
    'Zaustavite eskalaciju i vratite se osnovnom osećaju sigurnosti i poštovanja.',
    'Dogovorite jedan jasan, kratak razgovor bez optuživanja.',
  ],
  NAPETO: [
    'Uvedite ritam kratkih, redovnih proveravanja odnosa umesto razgovora samo u krizi.',
    'Razjasnite jedno otvoreno pitanje pre nego što otvarate sledeću temu.',
  ],
  STABILNO: [
    'Očuvajte ono što već funkcioniše kroz dosledne male rituale poverenja.',
    'Pretvorite implicitna očekivanja u eksplicitne dogovore.',
  ],
  SKLADNO: [
    'Održavajte kvalitet odnosa kroz transparentnost i uzajamnu podršku.',
    'Uvedite periodične retrospektive o tome šta odnosu najviše pomaže.',
  ],
  UZORNO: [
    'Iskoristite stabilnost odnosa za dugoročne zajedničke ciljeve.',
    'Pazite da visok kvalitet ne pređe u samozadovoljstvo bez provere granica i reciprociteta.',
  ],
};

const FOCUS_RECOMMENDATIONS: Record<KonvencionalniOdnosiDimension, string> = {
  POVERENJE: 'Otvorite temu poverenja kroz konkretne primere doslednosti i ispunjenih obećanja.',
  KOMUNIKACIJA: 'Dogovorite jasan format razgovora: tema, vreme i sledeći korak.',
  POSTOVANJE: 'Vratite fokus na ton, granice i priznanje tuđe perspektive.',
  RECIPROCITET: 'Mapirajte ko šta daje i prima kako bi odnos bio manje jednostran.',
  STABILNOST: 'Smanjite impulsivne promene i uvedite predvidive obrasce ponašanja.',
  GRANICE: 'Definišite šta je prihvatljivo, a šta nije, bez implicitnih pretpostavki.',
};

function computeBalanceScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  if (mean === 0) return 0;
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
  const cv = Math.sqrt(variance) / mean;
  return Math.round(Math.max(0, 100 - cv * 100) * 100) / 100;
}

function resolveTier(score: number, balanceScore: number): KonvencionalniOdnosiTier {
  if (score >= 85 && balanceScore >= 75) return 'UZORNO';
  if (score >= 70 && balanceScore >= 60) return 'SKLADNO';
  if (score >= 55) return 'STABILNO';
  if (score >= 35) return 'NAPETO';
  return 'KRHKO';
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): KonvencionalniOdnosiResult {
  return {
    referenceId: referenceId ?? 'n/a',
    relationType: KONVENCIONALNI_ODNOSI_DEFAULT_RELATION_TYPE,
    score: 0,
    balanceScore: 0,
    tier: 'KRHKO',
    dominantStrength: 'POVERENJE',
    focusArea: 'POVERENJE',
    dimensions: [],
    recommendations: [],
    warnings: [warning],
    valid: false,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

function buildWarnings(
  relationType: KonvencionalniOdnosiRelationType,
  dimensions: KonvencionalniOdnosiDimensionScore[],
  balanceScore: number,
): string[] {
  const warnings: string[] = [];
  const scoreByDimension = new Map<KonvencionalniOdnosiDimension, number>(
    dimensions.map((entry) => [entry.dimension, entry.score]),
  );

  for (const entry of dimensions) {
    if (entry.score < 20) {
      warnings.push(`Dimenzija "${entry.dimension}" je kritično niska (${entry.score}) za ${relationType.toLowerCase()} odnos.`);
    }
    if (entry.score < 35) {
      warnings.push(`Dimenzija "${entry.dimension}" traži hitan plan oporavka i jasne naredne korake.`);
    }
  }

  const poverenje = scoreByDimension.get('POVERENJE') ?? 0;
  const postovanje = scoreByDimension.get('POSTOVANJE') ?? 0;
  const komunikacija = scoreByDimension.get('KOMUNIKACIJA') ?? 0;
  const granice = scoreByDimension.get('GRANICE') ?? 0;
  const stabilnost = scoreByDimension.get('STABILNOST') ?? 0;
  const reciprocitet = scoreByDimension.get('RECIPROCITET') ?? 0;

  if (poverenje >= 75 && postovanje < 40) {
    warnings.push('Visoko poverenje uz nisko poštovanje ukazuje na nekonzistentan odnosni obrazac.');
  }
  if (komunikacija >= 80 && granice < 35) {
    warnings.push('Jaka komunikacija bez jasnih granica može voditi prelivanju konflikta i odgovornosti.');
  }
  if (stabilnost >= 75 && reciprocitet < 40) {
    warnings.push('Stabilnost bez reciprociteta ukazuje na jednostrano održavanje odnosa.');
  }
  if (balanceScore < 45) {
    warnings.push('Odnos je neuravnotežen — razlike između dimenzija su previsoke za dugoročnu stabilnost.');
  }

  return Array.from(new Set(warnings));
}

function buildRecommendations(
  tier: KonvencionalniOdnosiTier,
  focusArea: KonvencionalniOdnosiDimension,
): string[] {
  return [...TIER_RECOMMENDATIONS[tier], FOCUS_RECOMMENDATIONS[focusArea]];
}

export function evaluateKonvencionalniOdnosi(input: KonvencionalniOdnosiInput): KonvencionalniOdnosiResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!Array.isArray(input.dimensions) || input.dimensions.length === 0) {
    return invalidResult(input.referenceId, 'dimensions must be a non-empty array', start);
  }

  for (const entry of input.dimensions) {
    if (!entry || typeof entry !== 'object') {
      return invalidResult(input.referenceId, 'each dimension entry must be an object', start);
    }
    if (typeof entry.dimension !== 'string' || entry.dimension.length === 0) {
      return invalidResult(input.referenceId, 'each dimension must include a non-empty dimension key', start);
    }
    if (typeof entry.score !== 'number' || !Number.isFinite(entry.score)) {
      return invalidResult(input.referenceId, `score for dimension "${entry.dimension}" must be a finite number`, start);
    }
    if (entry.score < KONVENCIONALNI_ODNOSI_MIN_SCORE || entry.score > KONVENCIONALNI_ODNOSI_MAX_SCORE) {
      return invalidResult(
        input.referenceId,
        `score for dimension "${entry.dimension}" must be between ${KONVENCIONALNI_ODNOSI_MIN_SCORE} and ${KONVENCIONALNI_ODNOSI_MAX_SCORE}`,
        start,
      );
    }
  }

  const sorted = [...input.dimensions].sort((a, b) => b.score - a.score);
  const scores = sorted.map((entry) => entry.score);
  const score = Math.round((scores.reduce((sum, value) => sum + value, 0) / scores.length) * 100) / 100;
  const balanceScore = computeBalanceScore(scores);
  const tier = resolveTier(score, balanceScore);
  const dominantStrength = sorted[0].dimension;
  const focusArea = sorted[sorted.length - 1].dimension;
  const relationType = input.relationType ?? KONVENCIONALNI_ODNOSI_DEFAULT_RELATION_TYPE;
  const warnings = buildWarnings(relationType, sorted, balanceScore);
  const recommendations = buildRecommendations(tier, focusArea);

  evaluations += 1;
  lastScore = score;
  lastTier = tier;

  return {
    referenceId: input.referenceId ?? 'n/a',
    relationType,
    score,
    balanceScore,
    tier,
    dominantStrength,
    focusArea,
    dimensions: sorted,
    recommendations,
    warnings,
    valid: true,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function getKonvencionalniOdnosiHealthReport(): KonvencionalniOdnosiHealthReport {
  return {
    personaId: KONVENCIONALNI_ODNOSI_PERSONA_ID,
    contractVersion: KONVENCIONALNI_ODNOSI_CONTRACT_VERSION,
    moduleVersion: KONVENCIONALNI_ODNOSI_MODULE_VERSION,
    evaluations,
    lastScore,
    lastTier,
    performanceMaxMs: KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: KONVENCIONALNI_ODNOSI_API_RESPONSE_MAX_MS,
  };
}

export function _resetKonvencionalniOdnosiMetrics(): void {
  evaluations = 0;
  lastScore = 0;
  lastTier = 'KRHKO';
}
