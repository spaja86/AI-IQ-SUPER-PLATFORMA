// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK Types
// Kompanija SPAJA — Digitalna Industrija

export const AIIQ_LANG_CONTRACT_VERSION = 'v1';
export const AIIQ_LANG_MODULE_VERSION = '1.0.0';
export const AIIQ_LANG_PERSONA_ID = 'ai-iq-programski-jezik-core';
export const AIIQ_LANG_DISPLAY_NAME = 'AI IQ PROGRAMSKI JEZIK';
export const AIIQ_LANG_SLUG = 'ai-iq-programski-jezik';
export const AIIQ_LANG_FEATURE_FLAG = 'ai-iq-programski-jezik-v1';
export const AIIQ_LANG_OCTAVE = 15;
export const AIIQ_LANG_HIPERMREZA_NODE = 121;
export const AIIQ_LANG_MIN_SCORE = 0;
export const AIIQ_LANG_MAX_SCORE = 100;
export const AIIQ_LANG_PERFORMANCE_MAX_MS = 50;
export const AIIQ_LANG_API_RESPONSE_MAX_MS = 200;
export const AIIQ_LANG_LINKED_REPO_IMPACT = 'spaja86/IO-OPENUI-AO-sync-ready';
export const AIIQ_LANG_DISCLAIMER =
  'AI IQ Programski Jezik daje AI-native orkestracionu preporuku i ne zamenjuje bezbednosni, pravni, medicinski ili incident response sud.';

export type AiiqLanguageMode = 'DETERMINISTIC_ONLY' | 'HYBRID' | 'AI_NATIVE';

export type AiiqLanguageStatus = 'BLOCKED' | 'LIMITED' | 'READY' | 'AI_NATIVE_READY';

export type AiiqLanguageAction =
  | 'HARDEN_GUARDS'
  | 'ADD_FALLBACK'
  | 'RUN_SHADOW_MODE'
  | 'ENABLE_AI_NATIVE';

export interface AiiqLanguageEvaluateInput {
  referenceId?: string;
  goal: string;
  mode: AiiqLanguageMode;
  promptComplexity: number;
  ruleCoverage: number;
  orchestrationReadiness: number;
  autonomyLevel: number;
  riskLevel: number;
  explainabilityNeed: number;
  securityPolicyScore: number;
  fallbackConfigured: boolean;
}

export interface AiiqLanguageEvaluateResult {
  referenceId: string;
  goal: string;
  mode: AiiqLanguageMode | null;
  deterministicReadiness: number;
  aiLayerReadiness: number;
  safetyScore: number;
  explainabilityScore: number;
  overallScore: number;
  status: AiiqLanguageStatus;
  recommendedAction: AiiqLanguageAction;
  warnings: string[];
  executionModel: {
    deterministicEngine: string[];
    aiLayer: string[];
    fallbackRule: string;
    explainabilityRule: string;
  };
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface AiiqLanguageAstNode {
  op: 'INTENT' | 'RULE' | 'AI' | 'ORCHESTRATE' | 'OUTPUT';
  value: string;
}

export interface AiiqLanguageCompileInput {
  referenceId?: string;
  source: string;
  targetMode: AiiqLanguageMode;
  strictSecurity: boolean;
  featureFlagAiIqLanguage: boolean;
}

export interface AiiqLanguageCompileResult {
  referenceId: string;
  targetMode: AiiqLanguageMode | null;
  ast: AiiqLanguageAstNode[];
  syntaxScore: number;
  semanticScore: number;
  readinessScore: number;
  status: AiiqLanguageStatus;
  recommendedAction: AiiqLanguageAction;
  securityPass: boolean;
  executionMode: AiiqLanguageMode;
  warnings: string[];
  compiledProgram: string;
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface AiiqLanguageHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  featureFlag: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  compilations: number;
  lastStatus: AiiqLanguageStatus | null;
  lastEvaluatedAt: string | null;
  supportedModes: AiiqLanguageMode[];
  supportedKeywords: AiiqLanguageAstNode['op'][];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
