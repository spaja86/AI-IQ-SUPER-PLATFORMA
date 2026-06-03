// SpajaUltraOmegaCore -∞Ω+∞ — Personalization Engine v3 (PERTENIZACIJA 3)
// Kompanija SPAJA — Digitalna Industrija
// v3 layer built on top of v2: adds adaptive learning, composite scoring,
// session-frequency weighting, and stronger guardrails.
// Hard fallback to v2/v1 whenever kill-switch or opt-out is active.

import {
  buildPersonalizationProfile,
  computePersonalizationSignals,
  mergePersonalizationIntoPrompt,
  isPersonalizationV2Enabled,
  type PersonalizationSignals,
  type PersonalizationExplainability,
  type ProfileV2Input,
  type StablePreferences,
  type ContextualPreferences,
} from './engine-v2';

export type {
  PersonalizationSignals,
  PersonalizationExplainability,
  StablePreferences,
  ContextualPreferences,
};

// Re-export v2 helpers that are used by consumers unchanged in v3
export { mergePersonalizationIntoPrompt, isPersonalizationV2Enabled };
export { buildPersonalizationProfile, computePersonalizationSignals } from './engine-v2';
export { applyStablePreferenceUpdate, buildExplainabilityPayload } from './engine-v2';

// ── Types ─────────────────────────────────────────────────────────────────────

export type PersonalizationVersion = 'v1' | 'v2' | 'v3';

export interface AdaptivePreferences {
  /** Auto-boosted topic weights inferred from session frequency (topic → score 0–1) */
  topicWeights: Record<string, number>;
  /** Inferred session tempo: quick exchanges or deep dives */
  sessionTempo: 'fast' | 'deep' | null;
  /** Number of sessions contributing to this adaptive snapshot */
  sessionCount: number;
  /** Timestamp of last adaptive update */
  lastAdaptedAt: string | null;
}

export interface PersonalizationFeedback {
  /** Explicit thumbs-up/down counts for personalization quality */
  positiveCount: number;
  negativeCount: number;
  /** Last explicit feedback timestamp */
  lastFeedbackAt: string | null;
}

export interface PersonalizationProfileV3 {
  version: PersonalizationVersion;
  userId: string;
  stable: StablePreferences;
  contextual: ContextualPreferences;
  adaptive: AdaptivePreferences;
  feedback: PersonalizationFeedback;
  /** v2 confidence score (0–1) */
  confidence: number;
  /** v3 composite score (0–1): combines confidence + adaptive signals + feedback ratio */
  v3Score: number;
  updatedAt: string | null;
  enabled: boolean;
  optOut: boolean;
}

/** Extended profile shape as read from Supabase (includes v3 fields) */
export interface ProfileV3Input extends ProfileV2Input {
  adaptive_preferences: Record<string, unknown> | null;
  personalization_feedback: Record<string, unknown> | null;
  personalization_v3_score: number;
}

// ── Feature flag ──────────────────────────────────────────────────────────────

export function isPersonalizationV3Enabled(): boolean {
  return process.env.PERSONALIZATION_V3_ENABLED !== 'false';
}

// ── Default values ────────────────────────────────────────────────────────────

const DEFAULT_ADAPTIVE: AdaptivePreferences = {
  topicWeights: {},
  sessionTempo: null,
  sessionCount: 0,
  lastAdaptedAt: null,
};

const DEFAULT_FEEDBACK: PersonalizationFeedback = {
  positiveCount: 0,
  negativeCount: 0,
  lastFeedbackAt: null,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseAdaptivePreferences(raw: Record<string, unknown> | null): AdaptivePreferences {
  if (!raw) return { ...DEFAULT_ADAPTIVE, topicWeights: {} };
  return {
    topicWeights:
      raw['topicWeights'] && typeof raw['topicWeights'] === 'object'
        ? (raw['topicWeights'] as Record<string, number>)
        : {},
    sessionTempo: (raw['sessionTempo'] as AdaptivePreferences['sessionTempo']) ?? null,
    sessionCount: typeof raw['sessionCount'] === 'number' ? raw['sessionCount'] : 0,
    lastAdaptedAt: typeof raw['lastAdaptedAt'] === 'string' ? raw['lastAdaptedAt'] : null,
  };
}

function parsePersonalizationFeedback(raw: Record<string, unknown> | null): PersonalizationFeedback {
  if (!raw) return { ...DEFAULT_FEEDBACK };
  return {
    positiveCount: typeof raw['positiveCount'] === 'number' ? raw['positiveCount'] : 0,
    negativeCount: typeof raw['negativeCount'] === 'number' ? raw['negativeCount'] : 0,
    lastFeedbackAt: typeof raw['lastFeedbackAt'] === 'string' ? raw['lastFeedbackAt'] : null,
  };
}

/**
 * Compute composite v3 score (0–1) from confidence, adaptive signals,
 * session frequency, and feedback ratio.
 */
function computeV3Score(
  confidence: number,
  adaptive: AdaptivePreferences,
  feedback: PersonalizationFeedback,
): number {
  // Base: v2 confidence (weight 0.5)
  const baseScore = confidence * 0.5;

  // Adaptive signal contribution (weight 0.3): normalize sessionCount up to 20
  const sessionNorm = Math.min(adaptive.sessionCount / 20, 1);
  const topicRichness = Math.min(Object.keys(adaptive.topicWeights).length / 5, 1);
  const adaptiveScore = (sessionNorm * 0.6 + topicRichness * 0.4) * 0.3;

  // Feedback ratio contribution (weight 0.2): net positive ratio
  const totalFeedback = feedback.positiveCount + feedback.negativeCount;
  const feedbackScore =
    totalFeedback === 0 ? 0.5 : (feedback.positiveCount / totalFeedback) * 0.2;

  return Math.min(Number((baseScore + adaptiveScore + feedbackScore).toFixed(3)), 1);
}

// ── Core engine ───────────────────────────────────────────────────────────────

/**
 * Build a PersonalizationProfileV3 from a Supabase profile row.
 * Always returns a valid profile — falls back to defaults for missing values.
 */
export function buildPersonalizationProfileV3(
  userId: string,
  profile: ProfileV3Input,
): PersonalizationProfileV3 {
  const v2Base = buildPersonalizationProfile(userId, profile);
  const adaptive = parseAdaptivePreferences(profile.adaptive_preferences);
  const feedback = parsePersonalizationFeedback(profile.personalization_feedback);
  const v3Score = computeV3Score(v2Base.confidence, adaptive, feedback);

  return {
    version: (profile.personalization_version as PersonalizationVersion) ?? 'v1',
    userId,
    stable: v2Base.stable,
    contextual: v2Base.contextual,
    adaptive,
    feedback,
    confidence: v2Base.confidence,
    v3Score,
    updatedAt: v2Base.updatedAt,
    enabled: v2Base.enabled,
    optOut: v2Base.optOut,
  };
}

/**
 * Compute personalization signals from a v3 profile.
 * Falls back to v2 signals when v3 is disabled or profile is not v3.
 * Falls back to empty/neutral signals when opt-out or master kill-switch active.
 *
 * Security rule: v3 injection is always APPENDED, never prepended.
 */
export function computePersonalizationSignalsV3(
  profile: PersonalizationProfileV3,
): PersonalizationSignals {
  // If v3 feature flag is off or profile is not v3, delegate to v2 pipeline
  if (!isPersonalizationV3Enabled() || profile.version !== 'v3') {
    // Re-use v2 engine by constructing a compatible v2 profile
    const v2Profile = {
      version: profile.version === 'v3' ? 'v2' : profile.version,
      userId: profile.userId,
      stable: profile.stable,
      contextual: profile.contextual,
      confidence: profile.confidence,
      updatedAt: profile.updatedAt,
      enabled: profile.enabled,
      optOut: profile.optOut,
    };
    return computePersonalizationSignals(v2Profile as Parameters<typeof computePersonalizationSignals>[0]);
  }

  // Safe-off conditions: opt-out or disabled
  const emptySignals: PersonalizationSignals = {
    systemPromptInjection: '',
    routingHint: { preferredModel: null, preferredTemperature: null },
    knowledgeHint: { preferredTopics: [] },
    explainability: {
      version: 'v1',
      activeSignals: [],
      confidence: 0,
      stable: profile.stable,
      contextual: profile.contextual,
      optOut: profile.optOut,
      enabled: profile.enabled,
    },
  };

  if (profile.optOut || !profile.enabled) {
    return emptySignals;
  }

  const { stable, contextual, adaptive, confidence, v3Score } = profile;
  const activeSignals: string[] = [];
  const promptParts: string[] = [];

  // ── Stable signals (inherited from v2) ──────────────────────────────
  if (stable.toneStyle) {
    activeSignals.push(`toneStyle:${stable.toneStyle}`);
    const toneMap: Record<string, string> = {
      formal: 'Koristi formalan i profesionalan ton.',
      casual: 'Koristi opušten, prijatan ton.',
      technical: 'Koristi precizan tehnički stil bez suvišnih objašnjenja.',
    };
    if (toneMap[stable.toneStyle]) promptParts.push(toneMap[stable.toneStyle]);
  }

  if (stable.detailLevel) {
    activeSignals.push(`detailLevel:${stable.detailLevel}`);
    const detailMap: Record<string, string> = {
      brief: 'Odgovori kratko i sažeto.',
      standard: 'Daj uravnoteženo detaljan odgovor.',
      detailed: 'Daj detaljne i iscrpne odgovore sa primerima.',
    };
    if (detailMap[stable.detailLevel]) promptParts.push(detailMap[stable.detailLevel]);
  }

  if (stable.languageStyle) {
    activeSignals.push(`languageStyle:${stable.languageStyle}`);
    const langMap: Record<string, string> = {
      plain: 'Koristi jednostavan jezik bez žargona.',
      structured: 'Struktuiraj odgovore sa naslovima i tačkama.',
      verbose: 'Daj potpune, narativne odgovore.',
    };
    if (langMap[stable.languageStyle]) promptParts.push(langMap[stable.languageStyle]);
  }

  if (stable.preferredTopics.length > 0) {
    activeSignals.push(`preferredTopics:${stable.preferredTopics.slice(0, 3).join(',')}`);
  }

  if (contextual.recentTopics.length > 0) {
    activeSignals.push(`recentTopics:${contextual.recentTopics.slice(0, 3).join(',')}`);
  }

  // ── v3 Adaptive signals ──────────────────────────────────────────────
  if (adaptive.sessionTempo) {
    activeSignals.push(`sessionTempo:${adaptive.sessionTempo}`);
    if (adaptive.sessionTempo === 'fast') {
      promptParts.push('Korisnik preferira brze, direktne odgovore.');
    } else if (adaptive.sessionTempo === 'deep') {
      promptParts.push('Korisnik preferira duboke, iscrpne analize.');
    }
  }

  // Top adaptive topics by weight
  const topAdaptiveTopics = Object.entries(adaptive.topicWeights)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([t]) => t);
  if (topAdaptiveTopics.length > 0) {
    activeSignals.push(`adaptiveTopics:${topAdaptiveTopics.join(',')}`);
  }

  // v3 score signal marker
  if (v3Score >= 0.6) {
    activeSignals.push(`v3Score:${v3Score}`);
  }

  const systemPromptInjection =
    promptParts.length > 0
      ? `\n\n## Personalizacija (v3)\n${promptParts.join(' ')}`
      : '';

  // ── Routing hint ─────────────────────────────────────────────────────
  let preferredTemperature: number | null = stable.toneStyle === 'technical' ? 0.3 : null;
  // v3: deep sessions get a slightly higher temperature for exploratory answers
  if (adaptive.sessionTempo === 'deep' && preferredTemperature === null) {
    preferredTemperature = 0.7;
  }

  // ── Knowledge hint ───────────────────────────────────────────────────
  const knowledgeTopics = [
    ...stable.preferredTopics.slice(0, 2),
    ...contextual.recentTopics.slice(0, 2),
    ...topAdaptiveTopics.slice(0, 2),
  ].filter((t, i, arr) => arr.indexOf(t) === i); // deduplicate

  return {
    systemPromptInjection,
    routingHint: {
      preferredModel: contextual.lastActiveModel ?? null,
      preferredTemperature,
    },
    knowledgeHint: { preferredTopics: knowledgeTopics },
    explainability: {
      version: 'v3' as PersonalizationVersion,
      activeSignals,
      confidence,
      stable,
      contextual,
      optOut: profile.optOut,
      enabled: profile.enabled,
    },
  };
}

/**
 * Build an explainability payload for the "why was this answer personalized"
 * endpoint, using the v3 engine when the profile is v3.
 */
export function buildExplainabilityPayloadV3(
  userId: string,
  profile: ProfileV3Input,
): PersonalizationExplainability & { v3Score?: number } {
  const p = buildPersonalizationProfileV3(userId, profile);
  const signals = computePersonalizationSignalsV3(p);
  return {
    ...signals.explainability,
    ...(p.version === 'v3' ? { v3Score: p.v3Score } : {}),
  };
}

/**
 * Apply an update to adaptive_preferences from a partial payload.
 * Only whitelisted keys are accepted.
 */
export function applyAdaptivePreferenceUpdate(
  current: Record<string, unknown> | null,
  update: Partial<AdaptivePreferences>,
): Record<string, unknown> {
  const base = parseAdaptivePreferences(current);
  const merged: AdaptivePreferences = {
    topicWeights:
      update.topicWeights !== undefined ? update.topicWeights : base.topicWeights,
    sessionTempo:
      update.sessionTempo !== undefined ? update.sessionTempo : base.sessionTempo,
    sessionCount:
      update.sessionCount !== undefined ? update.sessionCount : base.sessionCount,
    lastAdaptedAt:
      update.lastAdaptedAt !== undefined ? update.lastAdaptedAt : base.lastAdaptedAt,
  };
  return merged as unknown as Record<string, unknown>;
}
