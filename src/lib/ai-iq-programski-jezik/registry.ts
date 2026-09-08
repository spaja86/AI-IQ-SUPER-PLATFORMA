// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK Registry
// Kompanija SPAJA — Digitalna Industrija

import type { AiiqLanguageAction, AiiqLanguageAstNode, AiiqLanguageMode } from './types';

export const VALID_AIIQ_LANGUAGE_MODES: AiiqLanguageMode[] = ['DETERMINISTIC_ONLY', 'HYBRID', 'AI_NATIVE'];

export const VALID_AIIQ_LANGUAGE_KEYWORDS: AiiqLanguageAstNode['op'][] = [
  'INTENT',
  'RULE',
  'AI',
  'ORCHESTRATE',
  'OUTPUT',
];

export const ACTION_TARGET_MODE: Record<AiiqLanguageAction, AiiqLanguageMode> = {
  HARDEN_GUARDS: 'DETERMINISTIC_ONLY',
  ADD_FALLBACK: 'HYBRID',
  RUN_SHADOW_MODE: 'HYBRID',
  ENABLE_AI_NATIVE: 'AI_NATIVE',
};
