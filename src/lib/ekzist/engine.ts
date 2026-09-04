// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  EkzistDomain,
  EkzistDomainScore,
  EkzistHealthReport,
  EkzistInput,
  EkzistResult,
  EkzistTier,
} from './types';
import {
  EKZIST_API_RESPONSE_MAX_MS,
  EKZIST_ALIASES,
  EKZIST_CANONICAL_SLUG,
  EKZIST_CONTRACT_VERSION,
  EKZIST_DISPLAY_NAME,
  EKZIST_DISCLAIMER,
  EKZIST_IMBALANCE_HIGH_THRESHOLD,
  EKZIST_IMBALANCE_LOW_THRESHOLD,
  EKZIST_MAX_SCORE,
  EKZIST_MIN_SCORE,
  EKZIST_MODULE_VERSION,
  EKZIST_PERFORMANCE_MAX_MS,
  EKZIST_PERSONA_ID,
  isEkzistAgeGroup,
  isEkzistDomain,
} from './types';

// ─── In-memory metrics ───────────────────────────────────────────────────────

let evaluations = 0;
let lastTier: EkzistTier = 'GROUNDED';

// ─── Recommendation catalog ──────────────────────────────────────────────────

const TIER_RECOMMENDATIONS: Record<EkzistTier, string[]> = {
  GROUNDED: [
    'Posveti vreme osnovnim potrebama i stabilizaciji svakodnevnog života.',
    'Istraži svoje vrednosti kroz mali dnevnik razmišljanja.',
    'Poveži se sa bliskim osobama i prirodom.',
  ],
  SEARCHING: [
    'Eksperimentiši sa novim iskustvima i hobijima.',
    'Postavi pitanje: šta me ispunjava — ne šta bi trebalo da me ispunjava?',
    'Traži zajednicu i ljude koji dele tvoje interese.',
  ],
  AWAKENING: [
    'Integrišite nova saznanja o sebi u svakodnevne rutine.',
    'Razvijaj svesnost (mindfulness) kao alat za dalji rast.',
    'Napiši sopstvenu definiciju svrhe — u jednoj rečenici.',
  ],
  ALIGNED: [
    'Podeli svoju viziju sa drugima — mentorstvo i podučavanje su prirodan sledeći korak.',
    'Preispitaj ciljeve — da li su i dalje autentični?',
    'Uvedi sistematsko vreme za refleksiju (nedeljno ili mesečno).',
  ],
  PEAK: [
    'Tvoja egzistencijalna energija je na vrhuncu — iskoristi je za kreiranje trajnog dela ili zajednice.',
    'Briži o unutrašnjoj ravnoteži: vrhunac je dinamičan, ne statičan.',
    'Razmatraj transcendentne doprinose — ono što nadilazi tvoje lično postojanje.',
  ],
};

const DOMAIN_RECOMMENDATIONS: Partial<Record<EkzistDomain, string>> = {
  MEANING: 'Istraži izvore smisla kroz kulturu, umetnost ili filozofiju.',
  PURPOSE: 'Definiši jedan konkretni cilj koji reflektuje tvoju svrhu.',
  IDENTITY: 'Napiši lični manifest — ko si ti, mimo uloga koje igraš.',
  CONNECTION: 'Ulož u kvalitet odnosa: jedno duboko razgovaranje vrijedi više od deset površnih.',
  AUTONOMY: 'Identifikuj oblasti gde se osećaš ograničeno i postavi mali korak slobode.',
  LEGACY: 'Razmisli šta bi voleo da ostane iza tebe — u srcima, delu ili zajednici.',
  TRANSCENDENCE: 'Istraži duhovnost ili filozofiju — bilo koji put koji te podseti da si deo nečeg većeg.',
  GROWTH: 'Postavi sebi jedan izazov koji te plaši i koji te uči nečem novom.',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeBalanceScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (mean === 0) return 0;
  const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / scores.length;
  const cv = Math.sqrt(variance) / mean;
  const balance = Math.max(0, 100 - cv * 100);
  return Math.round(balance * 100) / 100;
}

function computeTier(balanceScore: number, meanScore: number): EkzistTier {
  if (balanceScore >= 80 && meanScore >= 75) return 'PEAK';
  if (balanceScore >= 65 && meanScore >= 55) return 'ALIGNED';
  if ((balanceScore >= 45 && meanScore >= 35) || meanScore >= 45) return 'AWAKENING';
  if (meanScore >= 25) return 'SEARCHING';
  return 'GROUNDED';
}

function compareDomainScores(a: EkzistDomainScore, b: EkzistDomainScore): number {
  if (a.score !== b.score) return b.score - a.score;
  return a.domain.localeCompare(b.domain);
}

function buildRecommendations(tier: EkzistTier, dominant: EkzistDomain): string[] {
  const tierRecs = TIER_RECOMMENDATIONS[tier].slice(0, 2);
  const domainRec = DOMAIN_RECOMMENDATIONS[dominant];
  const recs: string[] = [...tierRecs];
  if (domainRec) recs.push(domainRec);
  return recs;
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): EkzistResult {
  return {
    referenceId: referenceId ?? 'n/a',
    dominantVector: 'MEANING',
    tier: 'GROUNDED',
    balanceScore: 0,
    dimensionScores: [],
    recommendations: [],
    warnings: [warning],
    disclaimer: EKZIST_DISCLAIMER,
    valid: false,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function evaluateEkzist(input: EkzistInput): EkzistResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!Array.isArray(input.domains) || input.domains.length === 0) {
    return invalidResult(input.referenceId, 'domains must be a non-empty array', start);
  }

  if (typeof input.ageGroup !== 'undefined' && !isEkzistAgeGroup(input.ageGroup)) {
    return invalidResult(input.referenceId, `ageGroup "${String(input.ageGroup)}" is not supported`, start);
  }

  const seenDomains = new Set<EkzistDomain>();

  // Validate each domain score
  for (const ds of input.domains) {
    if (!ds || typeof ds !== 'object') {
      return invalidResult(input.referenceId, 'each domain entry must be an object', start);
    }
    if (!isEkzistDomain(ds.domain)) {
      return invalidResult(input.referenceId, `domain "${String(ds.domain)}" is not supported`, start);
    }
    if (seenDomains.has(ds.domain)) {
      return invalidResult(input.referenceId, `domain "${ds.domain}" appears more than once`, start);
    }
    seenDomains.add(ds.domain);
    if (typeof ds.score !== 'number' || !Number.isFinite(ds.score)) {
      return invalidResult(input.referenceId, `score for domain "${ds.domain}" must be a finite number`, start);
    }
    if (ds.score < EKZIST_MIN_SCORE || ds.score > EKZIST_MAX_SCORE) {
      return invalidResult(
        input.referenceId,
        `score for domain "${ds.domain}" must be between ${EKZIST_MIN_SCORE} and ${EKZIST_MAX_SCORE}`,
        start,
      );
    }
  }

  const scores = input.domains.map((d) => d.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const balanceScore = computeBalanceScore(scores);

  // Dominant vector = highest score
  const sorted = [...input.domains].sort(compareDomainScores);
  const dominantVector: EkzistDomain = sorted[0].domain;

  const tier = computeTier(balanceScore, mean);
  const recommendations = buildRecommendations(tier, dominantVector);

  // Imbalance warnings
  const warnings: string[] = [];
  for (const ds of input.domains) {
    if (ds.score < EKZIST_IMBALANCE_LOW_THRESHOLD) {
      warnings.push(`Domen "${ds.domain}" je kritično nizak (${ds.score}) — razmotri fokus na ovoj oblasti.`);
    }
    if (ds.score > EKZIST_IMBALANCE_HIGH_THRESHOLD) {
      warnings.push(`Domen "${ds.domain}" je ekstremno visok (${ds.score}) — pazi na neravnotežu.`);
    }
  }

  const dimensionScores: EkzistDomainScore[] = sorted;

  evaluations += 1;
  lastTier = tier;

  return {
    referenceId: input.referenceId ?? 'n/a',
    dominantVector,
    tier,
    balanceScore,
    dimensionScores,
    recommendations,
    warnings,
    disclaimer: EKZIST_DISCLAIMER,
    valid: true,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function getEkzistHealthReport(): EkzistHealthReport {
  return {
    personaId: EKZIST_PERSONA_ID,
    displayName: EKZIST_DISPLAY_NAME,
    canonicalSlug: EKZIST_CANONICAL_SLUG,
    aliases: [...EKZIST_ALIASES],
    contractVersion: EKZIST_CONTRACT_VERSION,
    moduleVersion: EKZIST_MODULE_VERSION,
    evaluations,
    lastTier,
    performanceMaxMs: EKZIST_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: EKZIST_API_RESPONSE_MAX_MS,
  };
}

export function _resetEkzistMetrics(): void {
  evaluations = 0;
  lastTier = 'GROUNDED';
}
