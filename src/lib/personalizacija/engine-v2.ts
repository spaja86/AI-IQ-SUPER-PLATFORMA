// SpajaUltraOmegaCore -∞Ω+∞ — Personalization Engine v2 (PERTENIZACIJA 2)
// Kompanija SPAJA — Digitalna Industrija
// Core module: računa personalizacione signale iz profila, istorije i metrika.

import type { ModelId } from '@/lib/supabase/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export type PersonalizationVersion = 'v1' | 'v2';

export interface StablePreferences {
  toneStyle: 'formal' | 'casual' | 'technical' | null;
  detailLevel: 'brief' | 'standard' | 'detailed' | null;
  preferredTopics: string[];
  languageStyle: 'plain' | 'structured' | 'verbose' | null;
}

export interface ContextualPreferences {
  recentTopics: string[];
  lastActiveModel: ModelId | null;
  sessionCount: number;
}

export interface PersonalizationProfileV2 {
  version: PersonalizationVersion;
  userId: string;
  stable: StablePreferences;
  contextual: ContextualPreferences;
  confidence: number;
  updatedAt: string | null;
  enabled: boolean;
  optOut: boolean;
}

export interface PersonalizationSignals {
  systemPromptInjection: string;
  routingHint: {
    preferredModel: ModelId | null;
    preferredTemperature: number | null;
  };
  knowledgeHint: {
    preferredTopics: string[];
  };
  explainability: PersonalizationExplainability;
}

export interface PersonalizationExplainability {
  version: PersonalizationVersion;
  activeSignals: string[];
  confidence: number;
  stable: StablePreferences;
  contextual: ContextualPreferences;
  optOut: boolean;
  enabled: boolean;
}

// Profile shape as read from Supabase (minimal set used by v2 engine)
export interface ProfileV2Input {
  custom_instructions: string | null;
  memory: string | null;
  preferred_model: ModelId | null;
  preferred_language: string | null;
  personalization_version: string;
  stable_preferences: Record<string, unknown> | null;
  contextual_preferences: Record<string, unknown> | null;
  personalization_confidence: number;
  personalization_updated_at: string | null;
  personalization_enabled: boolean;
  personalization_opt_out: boolean;
}

// ── Feature flag ──────────────────────────────────────────────────────────────

export function isPersonalizationV2Enabled(): boolean {
  return process.env.PERSONALIZATION_V2_ENABLED !== 'false';
}

// ── Default values ────────────────────────────────────────────────────────────

const DEFAULT_STABLE: StablePreferences = {
  toneStyle: null,
  detailLevel: null,
  preferredTopics: [],
  languageStyle: null,
};

const DEFAULT_CONTEXTUAL: ContextualPreferences = {
  recentTopics: [],
  lastActiveModel: null,
  sessionCount: 0,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseStablePreferences(raw: Record<string, unknown> | null): StablePreferences {
  if (!raw) return { ...DEFAULT_STABLE };
  return {
    toneStyle: (raw['toneStyle'] as StablePreferences['toneStyle']) ?? null,
    detailLevel: (raw['detailLevel'] as StablePreferences['detailLevel']) ?? null,
    preferredTopics: Array.isArray(raw['preferredTopics']) ? (raw['preferredTopics'] as string[]) : [],
    languageStyle: (raw['languageStyle'] as StablePreferences['languageStyle']) ?? null,
  };
}

function parseContextualPreferences(raw: Record<string, unknown> | null): ContextualPreferences {
  if (!raw) return { ...DEFAULT_CONTEXTUAL };
  return {
    recentTopics: Array.isArray(raw['recentTopics']) ? (raw['recentTopics'] as string[]) : [],
    lastActiveModel: (raw['lastActiveModel'] as ModelId | null) ?? null,
    sessionCount: typeof raw['sessionCount'] === 'number' ? raw['sessionCount'] : 0,
  };
}

// ── Core engine ───────────────────────────────────────────────────────────────

/**
 * Build a PersonalizationProfileV2 from a Supabase profile row.
 * Always returns a valid profile — falls back to defaults if values are missing.
 */
export function buildPersonalizationProfile(
  userId: string,
  profile: ProfileV2Input,
): PersonalizationProfileV2 {
  return {
    version: (profile.personalization_version as PersonalizationVersion) ?? 'v1',
    userId,
    stable: parseStablePreferences(profile.stable_preferences),
    contextual: parseContextualPreferences(profile.contextual_preferences),
    confidence: profile.personalization_confidence ?? 0,
    updatedAt: profile.personalization_updated_at ?? null,
    enabled: profile.personalization_enabled ?? true,
    optOut: profile.personalization_opt_out ?? false,
  };
}

/**
 * Compute personalization signals from a v2 profile.
 * Returns empty/neutral signals when v2 is disabled, feature flag is off,
 * or the user has opted out — ensuring safe fallback to v1 behaviour.
 */
export function computePersonalizationSignals(
  personalizationProfile: PersonalizationProfileV2,
): PersonalizationSignals {
  const emptySignals: PersonalizationSignals = {
    systemPromptInjection: '',
    routingHint: { preferredModel: null, preferredTemperature: null },
    knowledgeHint: { preferredTopics: [] },
    explainability: {
      version: 'v1',
      activeSignals: [],
      confidence: 0,
      stable: { ...DEFAULT_STABLE },
      contextual: { ...DEFAULT_CONTEXTUAL },
      optOut: personalizationProfile.optOut,
      enabled: personalizationProfile.enabled,
    },
  };

  // Safe-off conditions: feature flag, opt-out, disabled, or not yet v2
  if (
    !isPersonalizationV2Enabled() ||
    personalizationProfile.optOut ||
    !personalizationProfile.enabled ||
    personalizationProfile.version !== 'v2'
  ) {
    return emptySignals;
  }

  const { stable, contextual, confidence } = personalizationProfile;
  const activeSignals: string[] = [];
  const promptParts: string[] = [];

  // Tone signal
  if (stable.toneStyle) {
    activeSignals.push(`toneStyle:${stable.toneStyle}`);
    const toneMap: Record<string, string> = {
      formal: 'Koristi formalan i profesionalan ton.',
      casual: 'Koristi opušten, prijatan ton.',
      technical: 'Koristi precizan tehnički stil bez suvišnih objašnjenja.',
    };
    if (toneMap[stable.toneStyle]) promptParts.push(toneMap[stable.toneStyle]);
  }

  // Detail level signal
  if (stable.detailLevel) {
    activeSignals.push(`detailLevel:${stable.detailLevel}`);
    const detailMap: Record<string, string> = {
      brief: 'Odgovori kratko i sažeto.',
      standard: 'Daj uravnoteženo detaljan odgovor.',
      detailed: 'Daj detaljne i iscrpne odgovore sa primerima.',
    };
    if (detailMap[stable.detailLevel]) promptParts.push(detailMap[stable.detailLevel]);
  }

  // Language style signal
  if (stable.languageStyle) {
    activeSignals.push(`languageStyle:${stable.languageStyle}`);
    const langMap: Record<string, string> = {
      plain: 'Koristi jednostavan jezik bez žargona.',
      structured: 'Struktuiraj odgovore sa naslovima i tačkama.',
      verbose: 'Daj potpune, narativne odgovore.',
    };
    if (langMap[stable.languageStyle]) promptParts.push(langMap[stable.languageStyle]);
  }

  // Preferred topics signal
  if (stable.preferredTopics.length > 0) {
    activeSignals.push(`preferredTopics:${stable.preferredTopics.slice(0, 3).join(',')}`);
  }

  // Contextual: recent topics signal
  if (contextual.recentTopics.length > 0) {
    activeSignals.push(`recentTopics:${contextual.recentTopics.slice(0, 3).join(',')}`);
  }

  const systemPromptInjection =
    promptParts.length > 0
      ? `\n\n## Personalizacija (v2)\n${promptParts.join(' ')}`
      : '';

  return {
    systemPromptInjection,
    routingHint: {
      preferredModel: contextual.lastActiveModel ?? null,
      preferredTemperature: stable.toneStyle === 'technical' ? 0.3 : null,
    },
    knowledgeHint: {
      preferredTopics: [
        ...stable.preferredTopics.slice(0, 3),
        ...contextual.recentTopics.slice(0, 2),
      ],
    },
    explainability: {
      version: 'v2',
      activeSignals,
      confidence,
      stable,
      contextual,
      optOut: personalizationProfile.optOut,
      enabled: personalizationProfile.enabled,
    },
  };
}

/**
 * Safely merge v2 personalization signals into an existing system prompt.
 * Security rule: v2 injection is always APPENDED, never prepended — it cannot
 * override or replace base security instructions or limit policy text.
 */
export function mergePersonalizationIntoPrompt(
  baseSystemPrompt: string,
  signals: PersonalizationSignals,
): string {
  if (!signals.systemPromptInjection) return baseSystemPrompt;
  return baseSystemPrompt + signals.systemPromptInjection;
}

/**
 * Compute an updated stable_preferences JSONB from a partial update request.
 * Called from the settings API.  Only whitelisted keys are accepted.
 */
export function applyStablePreferenceUpdate(
  current: Record<string, unknown> | null,
  update: Partial<StablePreferences>,
): Record<string, unknown> {
  const base = parseStablePreferences(current);
  const merged: StablePreferences = {
    toneStyle: update.toneStyle !== undefined ? update.toneStyle : base.toneStyle,
    detailLevel: update.detailLevel !== undefined ? update.detailLevel : base.detailLevel,
    preferredTopics:
      update.preferredTopics !== undefined ? update.preferredTopics.slice(0, 10) : base.preferredTopics,
    languageStyle: update.languageStyle !== undefined ? update.languageStyle : base.languageStyle,
  };
  return merged as unknown as Record<string, unknown>;
}

/**
 * Build an explainability payload for the "why was this answer personalized"
 * endpoint from existing profile data without re-computing the full signals.
 */
export function buildExplainabilityPayload(
  userId: string,
  profile: ProfileV2Input,
): PersonalizationExplainability {
  const p = buildPersonalizationProfile(userId, profile);
  const signals = computePersonalizationSignals(p);
  return signals.explainability;
}
