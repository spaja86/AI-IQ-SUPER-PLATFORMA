// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  AiiqLanguageAction,
  AiiqLanguageAstNode,
  AiiqLanguageCompileInput,
  AiiqLanguageCompileResult,
  AiiqLanguageEvaluateInput,
  AiiqLanguageEvaluateResult,
  AiiqLanguageHealthReport,
  AiiqLanguageMode,
  AiiqLanguageStatus,
} from './types';
import {
  AIIQ_LANG_API_RESPONSE_MAX_MS,
  AIIQ_LANG_CONTRACT_VERSION,
  AIIQ_LANG_DISCLAIMER,
  AIIQ_LANG_DISPLAY_NAME,
  AIIQ_LANG_FEATURE_FLAG,
  AIIQ_LANG_LINKED_REPO_IMPACT,
  AIIQ_LANG_MAX_SCORE,
  AIIQ_LANG_MIN_SCORE,
  AIIQ_LANG_MODULE_VERSION,
  AIIQ_LANG_PERFORMANCE_MAX_MS,
  AIIQ_LANG_PERSONA_ID,
  AIIQ_LANG_SLUG,
} from './types';
import { VALID_AIIQ_LANGUAGE_KEYWORDS, VALID_AIIQ_LANGUAGE_MODES } from './registry';

let evaluations = 0;
let compilations = 0;
let lastStatus: AiiqLanguageStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isMode(value: unknown): value is AiiqLanguageMode {
  return typeof value === 'string' && VALID_AIIQ_LANGUAGE_MODES.includes(value as AiiqLanguageMode);
}

function isBoundedScore(value: number): boolean {
  return Number.isFinite(value) && value >= AIIQ_LANG_MIN_SCORE && value <= AIIQ_LANG_MAX_SCORE;
}

function record(status: AiiqLanguageStatus | null, type: 'evaluate' | 'compile'): void {
  if (type === 'evaluate') evaluations += 1;
  if (type === 'compile') compilations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function resolveEvaluateStatus(
  input: AiiqLanguageEvaluateInput,
  overallScore: number,
  aiLayerReadiness: number,
  safetyScore: number,
): AiiqLanguageStatus {
  if (input.securityPolicyScore < 45 || input.riskLevel > 90) return 'BLOCKED';
  if (
    overallScore >= 82 &&
    aiLayerReadiness >= 78 &&
    safetyScore >= 70 &&
    input.fallbackConfigured &&
    input.mode !== 'DETERMINISTIC_ONLY'
  ) return 'AI_NATIVE_READY';
  if (overallScore >= 64) return 'READY';
  return 'LIMITED';
}

function resolveAction(status: AiiqLanguageStatus, fallbackConfigured: boolean): AiiqLanguageAction {
  if (status === 'BLOCKED') return 'HARDEN_GUARDS';
  if (!fallbackConfigured) return 'ADD_FALLBACK';
  if (status === 'LIMITED') return 'RUN_SHADOW_MODE';
  if (status === 'AI_NATIVE_READY') return 'ENABLE_AI_NATIVE';
  return 'RUN_SHADOW_MODE';
}

function baseExecutionModel() {
  return {
    deterministicEngine: [
      'Schema + type validation',
      'Rule-policy scoring',
      'Security and range guards',
      'Deterministic status mapping',
    ],
    aiLayer: [
      'Prompt expansion',
      'Contextual orchestration hints',
      'Adaptive next-step synthesis',
      'Human-readable rationale',
    ],
    fallbackRule: 'Ako AI sloj nije spreman ili je blokiran, vraća se deterministic-only putanja.',
    explainabilityRule: 'Svaki izlaz mora sadržati score, status, upozorenja i preporučenu akciju.',
  };
}

function invalidEvaluateResult(
  referenceId: string | undefined,
  goal: string | undefined,
  warning: string,
  start: number,
): AiiqLanguageEvaluateResult {
  record(null, 'evaluate');
  return {
    referenceId: referenceId ?? 'n/a',
    goal: goal ?? '',
    mode: null,
    deterministicReadiness: 0,
    aiLayerReadiness: 0,
    safetyScore: 0,
    explainabilityScore: 0,
    overallScore: 0,
    status: 'BLOCKED',
    recommendedAction: 'HARDEN_GUARDS',
    warnings: [warning],
    executionModel: baseExecutionModel(),
    disclaimer: AIIQ_LANG_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function invalidCompileResult(
  referenceId: string | undefined,
  warning: string,
  start: number,
): AiiqLanguageCompileResult {
  record(null, 'compile');
  return {
    referenceId: referenceId ?? 'n/a',
    targetMode: null,
    ast: [],
    syntaxScore: 0,
    semanticScore: 0,
    readinessScore: 0,
    status: 'BLOCKED',
    recommendedAction: 'HARDEN_GUARDS',
    securityPass: false,
    executionMode: 'DETERMINISTIC_ONLY',
    warnings: [warning],
    compiledProgram: '',
    disclaimer: AIIQ_LANG_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function parseProgram(source: string): { ast: AiiqLanguageAstNode[]; warnings: string[] } {
  const warnings: string[] = [];
  const ast: AiiqLanguageAstNode[] = [];
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  lines.forEach((line, index) => {
    const sep = line.indexOf(':');
    if (sep <= 0) {
      warnings.push(`Line ${index + 1} must follow KEYWORD: value syntax.`);
      return;
    }

    const rawKeyword = line.slice(0, sep).trim().toUpperCase();
    const payload = line.slice(sep + 1).trim();

    if (!VALID_AIIQ_LANGUAGE_KEYWORDS.includes(rawKeyword as AiiqLanguageAstNode['op'])) {
      warnings.push(`Line ${index + 1} has unsupported keyword: ${rawKeyword}.`);
      return;
    }

    if (!payload) {
      warnings.push(`Line ${index + 1} has empty payload.`);
      return;
    }

    ast.push({ op: rawKeyword as AiiqLanguageAstNode['op'], value: payload });
  });

  if (!ast.some((node) => node.op === 'INTENT')) {
    warnings.push('Program should define INTENT for AI-native goal mapping.');
  }

  if (!ast.some((node) => node.op === 'RULE')) {
    warnings.push('Program should define at least one RULE for deterministic safety.');
  }

  if (!ast.some((node) => node.op === 'OUTPUT')) {
    warnings.push('Program should define OUTPUT to keep explainability stable.');
  }

  return { ast, warnings };
}

export function evaluateAiiqLanguage(input: AiiqLanguageEvaluateInput): AiiqLanguageEvaluateResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidEvaluateResult(undefined, undefined, 'input must be an object', start);
  }

  if (typeof input.goal !== 'string' || input.goal.trim().length === 0) {
    return invalidEvaluateResult(input.referenceId, input.goal, 'goal is required (non-empty string)', start);
  }

  if (!isMode(input.mode)) {
    return invalidEvaluateResult(
      input.referenceId,
      input.goal,
      `mode must be one of: ${VALID_AIIQ_LANGUAGE_MODES.join(', ')}`,
      start,
    );
  }

  const boundedChecks: Array<[number, string]> = [
    [input.promptComplexity, 'promptComplexity'],
    [input.ruleCoverage, 'ruleCoverage'],
    [input.orchestrationReadiness, 'orchestrationReadiness'],
    [input.autonomyLevel, 'autonomyLevel'],
    [input.riskLevel, 'riskLevel'],
    [input.explainabilityNeed, 'explainabilityNeed'],
    [input.securityPolicyScore, 'securityPolicyScore'],
  ];

  for (const [value, field] of boundedChecks) {
    if (!isBoundedScore(value)) {
      return invalidEvaluateResult(input.referenceId, input.goal, `${field} must be within 0..100`, start);
    }
  }

  if (typeof input.fallbackConfigured !== 'boolean') {
    return invalidEvaluateResult(input.referenceId, input.goal, 'fallbackConfigured must be boolean', start);
  }

  const deterministicReadiness = round2(
    clamp(
      input.ruleCoverage * 0.34 +
      input.orchestrationReadiness * 0.28 +
      input.securityPolicyScore * 0.24 +
      (input.fallbackConfigured ? 100 : 30) * 0.14,
      AIIQ_LANG_MIN_SCORE,
      AIIQ_LANG_MAX_SCORE,
    ),
  );

  const aiLayerReadiness = round2(
    clamp(
      input.promptComplexity * 0.24 +
      input.autonomyLevel * 0.36 +
      input.orchestrationReadiness * 0.2 +
      input.securityPolicyScore * 0.2,
      AIIQ_LANG_MIN_SCORE,
      AIIQ_LANG_MAX_SCORE,
    ),
  );

  const safetyScore = round2(
    clamp(
      100 - input.riskLevel * 0.55 + input.securityPolicyScore * 0.45,
      AIIQ_LANG_MIN_SCORE,
      AIIQ_LANG_MAX_SCORE,
    ),
  );

  const explainabilityScore = round2(
    clamp(
      input.explainabilityNeed * 0.52 + input.ruleCoverage * 0.24 + (input.fallbackConfigured ? 100 : 40) * 0.24,
      AIIQ_LANG_MIN_SCORE,
      AIIQ_LANG_MAX_SCORE,
    ),
  );

  const overallScore = round2(
    clamp(
      deterministicReadiness * 0.34 + aiLayerReadiness * 0.28 + safetyScore * 0.2 + explainabilityScore * 0.18,
      AIIQ_LANG_MIN_SCORE,
      AIIQ_LANG_MAX_SCORE,
    ),
  );

  const status = resolveEvaluateStatus(input, overallScore, aiLayerReadiness, safetyScore);
  const recommendedAction = resolveAction(status, input.fallbackConfigured);

  const warnings: string[] = [];
  if (!input.fallbackConfigured) warnings.push('Fallback nije konfigurisan; AI-native aktivacija je zaključana.');
  if (input.riskLevel >= 80) warnings.push('Visok riskLevel zahteva dodatne guardrail i human review.');
  if (input.securityPolicyScore < 60) warnings.push('Security policy score je nizak za pouzdan AI-native režim.');
  if (input.explainabilityNeed >= 85 && input.ruleCoverage < 65) {
    warnings.push('Visok explainability zahtev traži veći ruleCoverage za stabilno objašnjenje.');
  }

  record(status, 'evaluate');

  return {
    referenceId: input.referenceId ?? 'n/a',
    goal: input.goal,
    mode: input.mode,
    deterministicReadiness,
    aiLayerReadiness,
    safetyScore,
    explainabilityScore,
    overallScore,
    status,
    recommendedAction,
    warnings,
    executionModel: baseExecutionModel(),
    disclaimer: AIIQ_LANG_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function compileAiiqLanguage(input: AiiqLanguageCompileInput): AiiqLanguageCompileResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidCompileResult(undefined, 'input must be an object', start);
  }

  if (typeof input.source !== 'string' || input.source.trim().length === 0) {
    return invalidCompileResult(input.referenceId, 'source is required (non-empty string)', start);
  }

  if (!isMode(input.targetMode)) {
    return invalidCompileResult(
      input.referenceId,
      `targetMode must be one of: ${VALID_AIIQ_LANGUAGE_MODES.join(', ')}`,
      start,
    );
  }

  if (typeof input.strictSecurity !== 'boolean') {
    return invalidCompileResult(input.referenceId, 'strictSecurity must be boolean', start);
  }

  if (typeof input.featureFlagAiIqLanguage !== 'boolean') {
    return invalidCompileResult(input.referenceId, 'featureFlagAiIqLanguage must be boolean', start);
  }

  const { ast, warnings } = parseProgram(input.source);
  if (ast.length === 0) {
    return invalidCompileResult(input.referenceId, 'source cannot be compiled into valid AST nodes', start);
  }

  const syntaxScore = round2(clamp((ast.length / Math.max(1, input.source.split(/\r?\n/).filter(Boolean).length)) * 100, 0, 100));

  let semanticScore = 100;
  if (!ast.some((node) => node.op === 'RULE')) semanticScore -= 35;
  if (!ast.some((node) => node.op === 'AI')) semanticScore -= 20;
  if (!ast.some((node) => node.op === 'OUTPUT')) semanticScore -= 20;
  if (!ast.some((node) => node.op === 'ORCHESTRATE')) semanticScore -= 15;
  semanticScore = round2(clamp(semanticScore, 0, 100));

  const hasNoSecretRule = ast.some((node) => node.op === 'RULE' && node.value.toUpperCase().includes('NO_SECRET'));
  const hasAllowlistRule = ast.some((node) => node.op === 'RULE' && node.value.toUpperCase().includes('ALLOWLIST'));
  const securityPass = input.strictSecurity ? hasNoSecretRule && hasAllowlistRule : true;

  if (!securityPass) {
    warnings.push('Strict security zahteva RULE sa NO_SECRET i ALLOWLIST politikama.');
  }

  const readinessScore = round2(
    clamp(
      syntaxScore * 0.36 + semanticScore * 0.34 + (securityPass ? 100 : 20) * 0.3,
      AIIQ_LANG_MIN_SCORE,
      AIIQ_LANG_MAX_SCORE,
    ),
  );

  const aiRequested = input.targetMode !== 'DETERMINISTIC_ONLY';
  const aiEnabled = input.featureFlagAiIqLanguage && aiRequested;

  const executionMode: AiiqLanguageMode =
    !aiRequested ? 'DETERMINISTIC_ONLY' :
    aiEnabled && securityPass ? input.targetMode :
    'DETERMINISTIC_ONLY';

  const status: AiiqLanguageStatus =
    !securityPass ? 'BLOCKED' :
    readinessScore >= 82 && executionMode !== 'DETERMINISTIC_ONLY' ? 'AI_NATIVE_READY' :
    readinessScore >= 64 ? 'READY' :
    'LIMITED';

  const recommendedAction =
    status === 'BLOCKED' ? 'HARDEN_GUARDS' :
    !aiEnabled && aiRequested ? 'RUN_SHADOW_MODE' :
    status === 'AI_NATIVE_READY' ? 'ENABLE_AI_NATIVE' :
    'ADD_FALLBACK';

  if (aiRequested && !input.featureFlagAiIqLanguage) {
    warnings.push(`Feature flag '${AIIQ_LANG_FEATURE_FLAG}' nije aktivan; AI sloj ostaje ugašen.`);
  }

  const compiledProgram = JSON.stringify(
    {
      contractVersion: AIIQ_LANG_CONTRACT_VERSION,
      targetMode: input.targetMode,
      executionMode,
      strictSecurity: input.strictSecurity,
      ast,
    },
    null,
    2,
  );

  record(status, 'compile');

  return {
    referenceId: input.referenceId ?? 'n/a',
    targetMode: input.targetMode,
    ast,
    syntaxScore,
    semanticScore,
    readinessScore,
    status,
    recommendedAction,
    securityPass,
    executionMode,
    warnings,
    compiledProgram,
    disclaimer: AIIQ_LANG_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getAiiqLanguageHealthReport(): AiiqLanguageHealthReport {
  return {
    personaId: AIIQ_LANG_PERSONA_ID,
    displayName: AIIQ_LANG_DISPLAY_NAME,
    slug: AIIQ_LANG_SLUG,
    featureFlag: AIIQ_LANG_FEATURE_FLAG,
    contractVersion: AIIQ_LANG_CONTRACT_VERSION,
    moduleVersion: AIIQ_LANG_MODULE_VERSION,
    linkedRepoImpact: AIIQ_LANG_LINKED_REPO_IMPACT,
    evaluations,
    compilations,
    lastStatus,
    lastEvaluatedAt,
    supportedModes: [...VALID_AIIQ_LANGUAGE_MODES],
    supportedKeywords: [...VALID_AIIQ_LANGUAGE_KEYWORDS],
    performanceMaxMs: AIIQ_LANG_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: AIIQ_LANG_API_RESPONSE_MAX_MS,
  };
}

export function _resetAiiqLanguageMetrics(): void {
  evaluations = 0;
  compilations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
