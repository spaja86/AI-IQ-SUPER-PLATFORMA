// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  AdutivDomain,
  AdutivHealthReport,
  AdutivInput,
  AdutivResult,
  AdutivStrength,
  AdutivTier,
} from './types';
import {
  ADUTIV_API_RESPONSE_MAX_MS,
  ADUTIV_BLIND_SPOT_THRESHOLD,
  ADUTIV_CONTRACT_VERSION,
  ADUTIV_DISCLAIMER,
  ADUTIV_MAX_SCORE,
  ADUTIV_MIN_SCORE,
  ADUTIV_MODULE_VERSION,
  ADUTIV_PERFORMANCE_MAX_MS,
  ADUTIV_PERSONA_ID,
  ADUTIV_VALID_DOMAINS,
} from './types';

// ─── In-memory metrics ───────────────────────────────────────────────────────

let evaluations = 0;
let lastTier: AdutivTier = 'LATENT';

// ─── Recommendation catalog ──────────────────────────────────────────────────

const TIER_RECOMMENDATIONS: Record<AdutivTier, string[]> = {
  LATENT: [
    'Identifikuj svoja latentna znanja i veštine — mnogi aduti su neprepoznati.',
    'Razgovaraj sa mentorom ili pouzdanom osobom koja može videti tvoje prednosti spolja.',
    'Napravi inventar svega što znaš, što umeš i koga poznaješ.',
  ],
  EMERGING: [
    'Posveti vreme razvoju dve-tri oblasti koje pokazuju najviše potencijala.',
    'Traži prilike za primenu svojih prednosti u stvarnim projektima.',
    'Deli svoje znanje — podučavanje ubrzava razvoj vlastite veštine.',
  ],
  ACTIVE: [
    'Povežite aktivne adute sa konkretnim prilikama na tržištu.',
    'Izgradi reputaciju oko svojih najjačih oblasti — pišite, govorite, demonstrirajte.',
    'Formalizuj svoja postignuća: portfolio, sertifikati, reference.',
  ],
  DOMINANT: [
    'Tvoji aduti su dominantni — fokusiraj se na stvaranje multiplikatornog efekta.',
    'Gradi ekosistem oko svojih prednosti: tim, partneri, zajednica.',
    'Identifikuj sledeći nivo kompetencije i postavi ambiciozne ciljeve.',
  ],
  APEX: [
    'Na vrhu si prednostnog portfolia — tvoji aduti su strateški differenciatori.',
    'Investiraj u trajnost: dokumentuj, delegiraj i prenos znanje.',
    'Razmatraj kako tvoje prednosti mogu transformisati industriju ili zajednicu.',
  ],
};

const DOMAIN_RECOMMENDATIONS: Record<AdutivDomain, string> = {
  SKILL: 'Produbi najvredniju veštinu kroz deliberate practice — 10 minuta fokusa dnevno je bolje od 2 sata bez cilja.',
  KNOWLEDGE: 'Konvertuj znanje u uvid: napiši kratak esej ili prezentaciju koja pokazuje tvoje razumevanje.',
  NETWORK: 'Aktiviraj mrežu — ne kad ti treba, već sada: pomozi nekome, poveži dvoje, predloži vrednost.',
  RESOURCE: 'Optimizuj resurse za najveći ROI: koji resurs, primenjen gde, donosi 10x prinos?',
  REPUTATION: 'Upravljaj reputacijom proaktivno — šta čuješ kada pitaš šta drugi kažu o tebi?',
  CREATIVITY: 'Stvori jedan originalni rad ove nedelje — čak i mali: tekst, rešenje, ideja.',
  RESILIENCE: 'Dokumentuj prethodne izazove koje si savladao — to je tvoj arsenal za buduće prepreke.',
  TIMING: 'Analiziraj trenutke: kada si donosio dobre odluke? Šta je bio signal? Razvij taj instinkt.',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computePortfolioScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => b - a);
  const top3 = sorted.slice(0, 3);
  // Geometric mean of top 3 to reward breadth while avoiding masking weakness
  const product = top3.reduce((acc, s) => acc * (s + 1), 1);
  const geoMean = Math.pow(product, 1 / top3.length) - 1;
  return Math.round(Math.min(100, geoMean) * 100) / 100;
}

function computeTier(portfolioScore: number): AdutivTier {
  if (portfolioScore >= 80) return 'APEX';
  if (portfolioScore >= 60) return 'DOMINANT';
  if (portfolioScore >= 40) return 'ACTIVE';
  if (portfolioScore >= 20) return 'EMERGING';
  return 'LATENT';
}

function buildActivationPlan(tier: AdutivTier, apex: AdutivDomain): string[] {
  const tierRecs = TIER_RECOMMENDATIONS[tier].slice(0, 3);
  const domainRec = DOMAIN_RECOMMENDATIONS[apex];
  return [...tierRecs, domainRec];
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): AdutivResult {
  return {
    referenceId: referenceId ?? 'n/a',
    apexAdut: 'SKILL',
    tier: 'LATENT',
    portfolioScore: 0,
    strengthMap: [],
    activationPlan: [],
    warnings: [warning],
    disclaimer: ADUTIV_DISCLAIMER,
    valid: false,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function evaluateAdutiv(input: AdutivInput): AdutivResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!Array.isArray(input.advantages) || input.advantages.length === 0) {
    return invalidResult(input.referenceId, 'advantages must be a non-empty array', start);
  }

  // Validate each strength entry
  for (const s of input.advantages) {
    if (!s || typeof s !== 'object') {
      return invalidResult(input.referenceId, 'each advantage entry must be an object', start);
    }
    if (typeof s.score !== 'number' || !Number.isFinite(s.score)) {
      return invalidResult(input.referenceId, `score for domain "${s.domain}" must be a finite number`, start);
    }
    if (s.score < ADUTIV_MIN_SCORE || s.score > ADUTIV_MAX_SCORE) {
      return invalidResult(
        input.referenceId,
        `score for domain "${s.domain}" must be between ${ADUTIV_MIN_SCORE} and ${ADUTIV_MAX_SCORE}`,
        start,
      );
    }
    if (!ADUTIV_VALID_DOMAINS.includes(s.domain as AdutivDomain)) {
      return invalidResult(input.referenceId, `domain "${s.domain}" is not a valid AdutivDomain`, start);
    }
  }

  const scores = input.advantages.map((a) => a.score);
  const portfolioScore = computePortfolioScore(scores);

  // Sort descending by score
  const sorted: AdutivStrength[] = [...input.advantages].sort((a, b) => b.score - a.score);
  const apexAdut: AdutivDomain = sorted[0].domain;

  const tier = computeTier(portfolioScore);
  const activationPlan = buildActivationPlan(tier, apexAdut);

  // Blind spot warnings
  const warnings: string[] = [];
  for (const s of input.advantages) {
    if (s.score < ADUTIV_BLIND_SPOT_THRESHOLD) {
      warnings.push(`Domen "${s.domain}" je slepa tačka (${s.score}) — razmatraj razvoj ili delegiranje u ovoj oblasti.`);
    }
  }

  evaluations += 1;
  lastTier = tier;

  return {
    referenceId: input.referenceId ?? 'n/a',
    apexAdut,
    tier,
    portfolioScore,
    strengthMap: sorted,
    activationPlan,
    warnings,
    disclaimer: ADUTIV_DISCLAIMER,
    valid: true,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function getAdutivHealthReport(): AdutivHealthReport {
  return {
    personaId: ADUTIV_PERSONA_ID,
    contractVersion: ADUTIV_CONTRACT_VERSION,
    moduleVersion: ADUTIV_MODULE_VERSION,
    evaluations,
    lastTier,
    performanceMaxMs: ADUTIV_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: ADUTIV_API_RESPONSE_MAX_MS,
  };
}

export function _resetAdutivMetrics(): void {
  evaluations = 0;
  lastTier = 'LATENT';
}
