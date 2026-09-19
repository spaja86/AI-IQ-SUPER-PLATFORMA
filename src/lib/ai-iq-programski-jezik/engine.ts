// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  AiiqIntegrationSignalStatus,
  AiiqIntegrationRolloutStage,
  AiiqLanguageAction,
  AiiqLanguageAstNode,
  AiiqLanguageCompileInput,
  AiiqLanguageCompileResult,
  AiiqLanguageEvaluateInput,
  AiiqLanguageEvaluateResult,
  AiiqLanguageExtrimliIntegrationProfile,
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
import { getExtrimliExtremProfilerReport } from '../extrimli-extrem';

let evaluations = 0;
let compilations = 0;
let lastStatus: AiiqLanguageStatus | null = null;
let lastEvaluatedAt: string | null = null;

type ExtremInformationalFlowSignal = ReturnType<typeof getExtrimliExtremProfilerReport>['programskiJezikInformacionihTokova'];
type ExtremPretpostavkaSignal = ReturnType<typeof getExtrimliExtremProfilerReport>['programskiJezikPretpostavka'];
type ExtremGamingDslSignal = ReturnType<typeof getExtrimliExtremProfilerReport>['programskiJezikSpecijalizovanZaIgrice'];

const DOM_GROUP = ['DOMPRE PETLJA', 'DOMBRE PETLJA', 'DOMBRA PETLJA', 'DOMBAR PETLJA', 'DOMPOR PETLJA'] as const;
const DIK_GROUP = ['DIK PETLJA'] as const;
const DAK_GROUP = ['DAKOR'] as const;
const DUK_GROUP = ['DUKAR'] as const;
const AIIQ_SURFACES = ['/api/ai-iq-programski-jezik/evaluate', '/api/ai-iq-programski-jezik/compile'] as const;

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

function toSignalStatus(score: number, forceBlocked: boolean): AiiqIntegrationSignalStatus {
  if (forceBlocked) return 'BLOCKED';
  if (score >= 82) return 'READY';
  return 'WATCH';
}

function resolveSinemetrickoSignalStatus(params: {
  dom: AiiqIntegrationSignalStatus;
  dik: AiiqIntegrationSignalStatus;
  dak: AiiqIntegrationSignalStatus;
  duk: AiiqIntegrationSignalStatus;
  promotionFreeze: boolean;
  performanceWithinTargets: boolean;
  securityBoundariesPreserved: boolean;
  rolloutMaturityScore: number;
}): AiiqIntegrationSignalStatus {
  if (
    params.promotionFreeze
    || !params.performanceWithinTargets
    || !params.securityBoundariesPreserved
    || params.dom === 'BLOCKED'
    || params.dik === 'BLOCKED'
    || params.dak === 'BLOCKED'
    || params.duk === 'BLOCKED'
  ) {
    return 'BLOCKED';
  }
  if (
    params.dom === 'READY'
    && params.dik === 'READY'
    && params.dak === 'READY'
    && params.duk === 'READY'
    && params.rolloutMaturityScore >= 85
  ) {
    return 'READY';
  }
  return 'WATCH';
}

function mergeSignalStatus(...statuses: AiiqIntegrationSignalStatus[]): AiiqIntegrationSignalStatus {
  if (statuses.some((status) => status === 'BLOCKED')) return 'BLOCKED';
  if (statuses.every((status) => status === 'READY')) return 'READY';
  return 'WATCH';
}

function nextRolloutStage(stage: AiiqIntegrationRolloutStage): AiiqIntegrationRolloutStage {
  if (stage === 'WAVE-1') return 'WAVE-2';
  if (stage === 'WAVE-2') return 'WAVE-3';
  if (stage === 'WAVE-3') return 'WAVE-4';
  if (stage === 'WAVE-4') return 'WAVE-5';
  return 'WAVE-5';
}

function resolveRolloutStageFromOverall(
  overall: AiiqIntegrationSignalStatus,
  rolloutMaturityScore: number,
): AiiqIntegrationRolloutStage {
  if (overall === 'BLOCKED') return 'WAVE-1';
  if (overall === 'WATCH') return rolloutMaturityScore >= 70 ? 'WAVE-3' : 'WAVE-2';
  if (rolloutMaturityScore >= 95) return 'WAVE-5';
  if (rolloutMaturityScore >= 88) return 'WAVE-4';
  return 'WAVE-3';
}

function buildIntegrationProfile(params: {
  surface: '/api/ai-iq-programski-jezik/evaluate' | '/api/ai-iq-programski-jezik/compile';
  dom: AiiqIntegrationSignalStatus;
  dik: AiiqIntegrationSignalStatus;
  dak: AiiqIntegrationSignalStatus;
  duk: AiiqIntegrationSignalStatus;
  rolloutMaturityScore: number;
  promotionFreeze: boolean;
  performanceWithinTargets: boolean;
  securityBoundariesPreserved: boolean;
  informationalFlowSignalStatus: AiiqIntegrationSignalStatus;
  informationalFlowReadinessScore: number;
  pretpostavkaSignalStatus: AiiqIntegrationSignalStatus;
  pretpostavkaReadinessScore: number;
  pretpostavkaTechnicalSignals: ExtremPretpostavkaSignal['technicalSignals'];
  gamingDslSignalStatus: AiiqIntegrationSignalStatus;
  gamingDslReadinessScore: number;
  gamingDslSignals: ExtremGamingDslSignal['gamingDomainCoverage'];
}): AiiqLanguageExtrimliIntegrationProfile {
  const sinemetricko = resolveSinemetrickoSignalStatus({
    dom: params.dom,
    dik: params.dik,
    dak: params.dak,
    duk: params.duk,
    promotionFreeze: params.promotionFreeze,
    performanceWithinTargets: params.performanceWithinTargets,
    securityBoundariesPreserved: params.securityBoundariesPreserved,
    rolloutMaturityScore: params.rolloutMaturityScore,
  });
  const informacioniTokoviScore = round2(clamp(params.informationalFlowReadinessScore, 0, 100));
  const informacioniTokovi = params.informationalFlowSignalStatus;
  const pretpostavka = params.pretpostavkaSignalStatus;
  const gamingDslScore = round2(clamp(params.gamingDslReadinessScore, 0, 100));
  const gamingDsl = params.gamingDslSignalStatus;
  const overall = mergeSignalStatus(params.dom, params.dik, params.dak, params.duk, informacioniTokovi, pretpostavka, sinemetricko);
  const consistencyEscalationScore = round2(
    clamp(
      params.rolloutMaturityScore * 0.7
      + (params.promotionFreeze ? 20 : 100) * 0.2
      + (params.securityBoundariesPreserved ? 100 : 25) * 0.1,
      0,
      100,
    ),
  );
  const consistencyEscalationStatus: AiiqIntegrationSignalStatus =
    params.promotionFreeze || overall === 'BLOCKED'
      ? 'BLOCKED'
      : overall === 'WATCH'
        ? 'WATCH'
        : 'READY';
  const currentStage = resolveRolloutStageFromOverall(overall, params.rolloutMaturityScore);
  return {
    profileId: 'EXTRIMLI-EXTRONDOL-EXTREM',
    additiveOnly: true,
    contractMutation: 'none',
    scope: {
      aiIqLanguageSurfaces: AIIQ_SURFACES,
      currentSurface: params.surface,
      extrem: '/api/extrimli/extrem',
      extrondol: '/api/extrimli/extrondol',
    },
    signalMapping: {
      DOM: {
        source: '/api/extrimli/extrem',
        group: DOM_GROUP,
      },
      DIK: {
        source: '/api/extrimli/extrem',
        group: DIK_GROUP,
      },
      DAK: {
        source: '/api/extrimli/extrondol',
        group: DAK_GROUP,
        role: 'promotion-control',
      },
      DUK: {
        source: '/api/extrimli/extrondol',
        group: DUK_GROUP,
        role: 'human-review-control',
      },
      FOR: {
        technicalSource: '/api/extrimli/extrem',
        governanceSource: '/api/extrimli/extrondol',
        group: ['FOR PETLJA', 'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA'] as const,
        role: 'sequential-numeric-flow-input',
      },
      PRETPOSTAVKA: {
        technicalSource: '/api/extrimli/extrem',
        governanceSource: '/api/extrimli/extrondol',
        group: ['PROGRAMSKI JEZIK PRETPOSTAVKA (KLJUČNE INFORMACIJE SA UČINIM OBLIKOM)'] as const,
        role: 'interpretacioni-track',
      },
      SINEMETRICKO: {
        technicalSource: '/api/extrimli/extrem',
        governanceSource: '/api/extrimli/extrondol',
        group: ['SINEMETRIČKO PROGRAMIRANJE'] as const,
        role: 'additive-governance-technical-input',
      },
      IGRICE: {
        technicalSource: '/api/extrimli/extrem',
        governanceSource: '/api/extrimli/extrondol',
        group: ['PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE'] as const,
        role: 'gaming-runtime-orchestration-profile',
      },
    },
    layerResponsibilities: {
      extrem: 'technical-signal-engine-readiness-conflict-profiling',
      extrondol: 'wave-governance-orchestrator',
      aiIqProgramskiJezik: 'dsl-orchestration-explainability-layer',
    },
    unifiedSignalStatus: {
      dom: params.dom,
      dik: params.dik,
      dak: params.dak,
      duk: params.duk,
      forInformacioniTokovi: informacioniTokovi,
      pretpostavka,
      programskiJezikSpecijalizovanZaIgrice: gamingDsl,
      sinemetricko,
      overall,
    },
    dokDikDakDukConsistencyHealth: {
      sourceOfTruth: '/api/extrimli/extrondol',
      additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM',
      scopeLock: ['DOK', 'DIK', 'DAK', 'DUK'],
      status: overall,
      escalationStatus: consistencyEscalationStatus,
      escalationScore: consistencyEscalationScore,
      deterministicFallbackRequired: consistencyEscalationStatus === 'BLOCKED',
      promotionFreeze: params.promotionFreeze,
      humanReviewRequired: true,
      rollbackPlanRequired: true,
      downstreamReference: 'spaja86/IO-OPENUI-AO',
      programskiJezikProucavanja: {
        canonicalName: 'PROGRAMSKI JEZIK PROUČAVANJA',
        additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM',
        sourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol'],
        consolidatedStatus: consistencyEscalationStatus,
        escalationScore: consistencyEscalationScore,
        ownershipSplit: {
          dokDik: 'EXTREM',
          dakDuk: 'EXTRONDOL',
        },
        programskiEkanalog: {
          canonicalName: 'PROGRAMSKI EKANALOG',
          meaning: 'razumevanje logike',
          auditConclusion: consistencyEscalationStatus === 'READY'
            ? 'Logički sloj je stabilan i spreman za audit-safe AI IQ orkestraciju.'
            : consistencyEscalationStatus === 'WATCH'
              ? 'Logički sloj zahteva opreznu AI IQ orkestraciju uz dodatni governance nadzor.'
              : 'Logički sloj zahteva deterministički fallback pre AI IQ promocije.',
          auditReady: consistencyEscalationStatus !== 'BLOCKED',
        },
      },
      programskiJezikInformacionihTokova: {
        canonicalName: 'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA',
        additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM',
        dslProfile: 'interpretacioni-orkestracioni-dsl',
        sourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol'],
        ownershipSplit: {
          forPetlja: 'EXTREM',
          dokDik: 'EXTREM',
          dakDuk: 'EXTRONDOL',
          spajaKod: 'audit-safe-summary-only',
        },
        unifiedStatus: informacioniTokovi,
        deterministicFallbackRequired: informacioniTokovi !== 'READY',
        explainabilityModel: 'existing-ai-iq-guardrails',
        guardrailMode: 'deterministic-fallback',
        metrics: {
          stabilityScore: informacioniTokoviScore,
          sequenceIntegrityScore: round2(clamp((params.rolloutMaturityScore * 0.5) + (params.performanceWithinTargets ? 35 : 15), 0, 100)),
          driftConflictScore: round2(clamp((params.promotionFreeze ? 70 : 18) + (params.securityBoundariesPreserved ? 0 : 16), 0, 100)),
          saturationLoadScore: round2(clamp((params.performanceWithinTargets ? 18 : 64) + (params.dom === 'BLOCKED' ? 12 : 0), 0, 100)),
          continuationReadinessScore: round2(clamp((params.rolloutMaturityScore * 0.56) + (params.securityBoundariesPreserved ? 22 : 6), 0, 100)),
        },
        reasons: [
          'Novi track ostaje interpretacioni/orkestracioni DSL profil i koristi postojeći AI IQ guardrail model.',
          'FOR i numerički tokovi ostaju tehnički signalni sloj vezan za EXTREM/PETLJE, bez paralelnog runtime-a.',
          ...(informacioniTokovi !== 'READY'
            ? ['Informacioni tokovi nisu READY; deterministički fallback ostaje aktivan.']
            : []),
        ],
      },
      programskiJezikPretpostavka: {
        canonicalName: 'PROGRAMSKI JEZIK PRETPOSTAVKA (KLJUČNE INFORMACIJE SA UČINIM OBLIKOM)',
        additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM',
        dslProfile: 'interpretacioni-pretpostavka-dsl',
        sourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol'],
        ownershipSplit: {
          forPetlja: 'EXTREM',
          dokDik: 'EXTREM',
          dakDuk: 'EXTRONDOL',
          spajaKod: 'audit-safe-summary-only',
        },
        unifiedStatus: pretpostavka,
        deterministicFallbackRequired: pretpostavka !== 'READY',
        explainabilityModel: 'existing-ai-iq-guardrails',
        guardrailMode: 'deterministic-fallback',
        semantics: {
          pretpostavka: 'deterministički polazni okvir pretpostavke',
          kljucneInformacije: 'obavezni skup ključnih informacija',
          uciniOblik: 'akcioni učini oblik za izlaznu interpretaciju',
        },
        metrics: {
          stabilityScore: params.pretpostavkaTechnicalSignals.stabilityScore,
          keyInformationIntegrityScore: params.pretpostavkaTechnicalSignals.keyInformationIntegrityScore,
          actionShapeDeterminismScore: params.pretpostavkaTechnicalSignals.actionShapeDeterminismScore,
          driftConflictScore: params.pretpostavkaTechnicalSignals.driftConflictScore,
          saturationLoadScore: params.pretpostavkaTechnicalSignals.saturationLoadScore,
          continuationReadinessScore: params.pretpostavkaTechnicalSignals.continuationReadinessScore,
        },
        reasons: [
          'Pretpostavka track ostaje additive interpretacioni sloj unutar postojećeg EXTRIMLI-EXTRONDOL-EXTREM modela.',
          'FOR/DOK/DIK ostaju tehnički signal u EXTREM sloju, a DAK/DUK ostaju governance odluka u EXTRONDOL sloju.',
          ...(pretpostavka !== 'READY'
            ? ['Pretpostavka track nije READY; deterministički fallback ostaje aktivan.']
            : []),
        ],
      },
      programskiJezikSpecijalizovanZaIgrice: {
        canonicalName: 'PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE',
        additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM',
        dslProfile: 'gaming-specijalizovani-dsl',
        sourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol'],
        ownershipSplit: {
          forPetlja: 'EXTREM',
          dokDik: 'EXTREM',
          dakDuk: 'EXTRONDOL',
          spajaKod: 'audit-safe-summary-only',
        },
        unifiedStatus: gamingDsl,
        deterministicFallbackRequired: gamingDsl !== 'READY',
        explainabilityModel: 'existing-ai-iq-guardrails',
        guardrailMode: 'deterministic-fallback',
        gamingDomain: {
          category: 'igrice',
          consumerAnchors: ['src/lib/igrice.ts', 'src/lib/gaming-endzin.ts'],
          ownership: {
            aiIqProgramskiJezik: 'dsl-orchestration-explainability-layer',
            extrem: 'technical-gaming-signal',
            extrondol: 'wawe-governance-audit-consumer',
          },
        },
        metrics: {
          gameplayCategoryCoverageScore: params.gamingDslSignals.gameplayCategoryCoverageScore,
          runnerCompatibilityScore: params.gamingDslSignals.runnerCompatibilityScore,
          dimensionalModeReadinessScore: params.gamingDslSignals.dimensionalModeReadinessScore,
          renderPhysicsReadinessScore: params.gamingDslSignals.renderPhysicsReadinessScore,
          aiNpcBehaviorScore: params.gamingDslSignals.aiNpcBehaviorScore,
          multiplayerSyncScore: params.gamingDslSignals.multiplayerSyncScore,
          antiCheatIntegrityScore: params.gamingDslSignals.antiCheatIntegrityScore,
          analyticsPerformanceReadinessScore: params.gamingDslSignals.analyticsPerformanceReadinessScore,
        },
        reasons: [
          'Gaming DSL ostaje additive profil nad postojećim AI IQ PROGRAMSKI JEZIK + EXTREM + EXTRONDOL slojevima.',
          'DOK + DIK + FOR ostaju tehnički dokaz gameplay/runtime toka u EXTREM sloju, dok DAK + DUK ostaju governance odluke u EXTRONDOL sloju.',
          'Javni izlaz ostaje audit-safe summary za postojeće gaming potrošače oko src/lib/igrice.ts i src/lib/gaming-endzin.ts.',
          ...(gamingDsl !== 'READY'
            ? ['Gaming DSL track nije READY; deterministički fallback ostaje aktivan.']
            : []),
          ...(gamingDslScore < 80
            ? [`Gaming DSL readiness ostaje na ${gamingDslScore}.`]
            : []),
        ],
      },
      programskiJezikApstrakcija: {
        canonicalName: 'PROGRAMSKI JEZIK APSTRAKCIJA',
        additiveOnly: true,
        initiativeGoal:
          'Organizovanje i nabavka informacija kroz izgradnju superiornih informacionih sistema sa automatskim radom i adaptacijom.',
        sourceOfTruthLock: {
          extrem: '/api/extrimli/extrem',
          extrondol: '/api/extrimli/extrondol',
          aiIqProgramskiJezik: 'dsl-orchestration-explainability-layer',
          integrationSignalRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol'],
        },
        signalOwnership: {
          dokDik: 'EXTREM',
          dakDuk: 'EXTRONDOL',
          forInformacioniTok: 'EXTREM',
          consolidatedOutput: ['READY', 'WATCH', 'BLOCKED'],
        },
        dslProfile: {
          intent: true,
          rules: true,
          aiLayer: true,
          orchestration: true,
          outputSchema: true,
          mandatoryGuardrails: true,
          deterministicFallback: true,
          auditReadyExplanation: true,
        },
        superiorInformationSystemMetrics: {
          stabilityScore: informacioniTokoviScore,
          sequenceIntegrityScore: round2(clamp((params.rolloutMaturityScore * 0.5) + (params.performanceWithinTargets ? 35 : 15), 0, 100)),
          driftConflictScore: round2(clamp((params.promotionFreeze ? 70 : 18) + (params.securityBoundariesPreserved ? 0 : 16), 0, 100)),
          saturationLoadScore: round2(clamp((params.performanceWithinTargets ? 18 : 64) + (params.dom === 'BLOCKED' ? 12 : 0), 0, 100)),
          continuationReadinessScore: round2(clamp((params.rolloutMaturityScore * 0.56) + (params.securityBoundariesPreserved ? 22 : 6), 0, 100)),
        },
        adaptiveOperatingModel: {
          deterministicOnly: true,
          hybrid: true,
          aiNative: 'security-readiness-governance-gated',
        },
        governanceQualityGate: {
          sequence: ['lint', 'test', 'smoke', 'predeploy', 'security', 'human-review', 'audit-log'],
          rollbackPlanRequired: true,
          promotionFreezeOnSignal: true,
        },
        driftZeroConformance: {
          layers: ['docs', 'types', 'routes', 'tests', 'workflows'],
          promotionBlockedOnDrift: true,
        },
        rolloutPlan: {
          phase1: 'documentation-lock-and-contract-model',
          phase2: 'types-contracts-health-readiness',
          phase3: 'tests-conformance-audit-evidence',
          phase4: 'downstream-sync-and-audit-safe-summary',
        },
        successCriteria: {
          deterministicRepeatability: true,
          edgeCasesValidated: true,
          adaptiveFallbackConfirmed: consistencyEscalationStatus !== 'READY'
            ? true
            : informacioniTokovi === 'READY' && pretpostavka === 'READY',
          governanceConformanceGreen: !params.promotionFreeze && params.securityBoundariesPreserved,
          downstreamSyncReady: true,
        },
      },
      reasons: [
        'PROGRAMSKI JEZIK ANALIZA koristi objedinjeni DOK/DIK/DAK/DUK signal kao eskalacioni indikator kodesnog zapleta.',
        'PROGRAMSKI JEZIK PROUČAVANJA koristi PROGRAMSKI EKANALOG za audit-ready tumačenje laboratorijske logike.',
        'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA koristi isti DSL explainability, guardrail i deterministic fallback model bez novog runtime sloja.',
        'PROGRAMSKI JEZIK PRETPOSTAVKA ostaje additive FOR/DOK/DIK interpretacioni track sa DAK/DUK governance zaključavanjem.',
        ...(consistencyEscalationStatus === 'BLOCKED'
          ? ['Eskalacioni status je BLOCKED; deterministički fallback ostaje obavezan.']
          : []),
      ],
    },
    governanceLink: {
      sourceOfTruth: '/api/extrimli/extrondol',
      rolloutSnapshot: {
        currentStage,
        eligibleNextStage: params.promotionFreeze ? currentStage : nextRolloutStage(currentStage),
        promotionFreeze: params.promotionFreeze,
      },
      humanReviewRequired: true,
      rollbackPlanRequired: true,
      downstreamReference: {
        linkedRepo: 'spaja86/IO-OPENUI-AO',
        required: true,
      },
    },
    acceptanceCriteria: {
      deterministicOutput: true,
      edgeCaseValidation: true,
      preserveExistingContracts: true,
      preserveDokDikDakDukContract: true,
      informacioniTokoviAdditiveInput: true,
      pretpostavkaAdditiveInput: true,
      sinemetrickoAdditiveInput: true,
      performanceWithinTargets: params.performanceWithinTargets,
      securityBoundariesPreserved: params.securityBoundariesPreserved,
    },
  };
}

function invalidEvaluateResult(
  referenceId: string | undefined,
  goal: string | undefined,
  warning: string,
  start: number,
  extremInformationalFlow: ExtremInformationalFlowSignal,
  extremPretpostavka: ExtremPretpostavkaSignal,
  extremGamingDsl: ExtremGamingDslSignal,
): AiiqLanguageEvaluateResult {
  const durationMs = round2(performance.now() - start);
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
    integrationProfile: buildIntegrationProfile({
      surface: '/api/ai-iq-programski-jezik/evaluate',
      dom: 'BLOCKED',
      dik: 'BLOCKED',
      dak: 'BLOCKED',
      duk: 'BLOCKED',
      rolloutMaturityScore: 0,
      promotionFreeze: true,
      performanceWithinTargets: durationMs <= AIIQ_LANG_PERFORMANCE_MAX_MS,
      securityBoundariesPreserved: false,
      informationalFlowSignalStatus: extremInformationalFlow.readiness.status,
      informationalFlowReadinessScore: extremInformationalFlow.readiness.score,
      pretpostavkaSignalStatus: extremPretpostavka.readiness.status,
      pretpostavkaReadinessScore: extremPretpostavka.readiness.score,
      pretpostavkaTechnicalSignals: extremPretpostavka.technicalSignals,
      gamingDslSignalStatus: extremGamingDsl.readiness.status,
      gamingDslReadinessScore: extremGamingDsl.readiness.score,
      gamingDslSignals: extremGamingDsl.gamingDomainCoverage,
    }),
    disclaimer: AIIQ_LANG_DISCLAIMER,
    valid: false,
    durationMs,
  };
}

function invalidCompileResult(
  referenceId: string | undefined,
  warning: string,
  start: number,
  extremInformationalFlow: ExtremInformationalFlowSignal,
  extremPretpostavka: ExtremPretpostavkaSignal,
  extremGamingDsl: ExtremGamingDslSignal,
): AiiqLanguageCompileResult {
  const durationMs = round2(performance.now() - start);
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
    integrationProfile: buildIntegrationProfile({
      surface: '/api/ai-iq-programski-jezik/compile',
      dom: 'BLOCKED',
      dik: 'BLOCKED',
      dak: 'BLOCKED',
      duk: 'BLOCKED',
      rolloutMaturityScore: 0,
      promotionFreeze: true,
      performanceWithinTargets: durationMs <= AIIQ_LANG_PERFORMANCE_MAX_MS,
      securityBoundariesPreserved: false,
      informationalFlowSignalStatus: extremInformationalFlow.readiness.status,
      informationalFlowReadinessScore: extremInformationalFlow.readiness.score,
      pretpostavkaSignalStatus: extremPretpostavka.readiness.status,
      pretpostavkaReadinessScore: extremPretpostavka.readiness.score,
      pretpostavkaTechnicalSignals: extremPretpostavka.technicalSignals,
      gamingDslSignalStatus: extremGamingDsl.readiness.status,
      gamingDslReadinessScore: extremGamingDsl.readiness.score,
      gamingDslSignals: extremGamingDsl.gamingDomainCoverage,
    }),
    disclaimer: AIIQ_LANG_DISCLAIMER,
    valid: false,
    durationMs,
  };
}

function parseProgram(source: string): {
  ast: AiiqLanguageAstNode[];
  warnings: string[];
  unsupportedKeywords: string[];
} {
  const warnings: string[] = [];
  const ast: AiiqLanguageAstNode[] = [];
  const unsupportedKeywords: string[] = [];
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
      unsupportedKeywords.push(rawKeyword);
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

  return { ast, warnings, unsupportedKeywords };
}

export function evaluateAiiqLanguage(input: AiiqLanguageEvaluateInput): AiiqLanguageEvaluateResult {
  const start = performance.now();
  const extremReport = getExtrimliExtremProfilerReport();
  const extremInformationalFlow = extremReport.programskiJezikInformacionihTokova;
  const extremPretpostavka = extremReport.programskiJezikPretpostavka;
  const extremGamingDsl = extremReport.programskiJezikSpecijalizovanZaIgrice;

  if (!input || typeof input !== 'object') {
    return invalidEvaluateResult(undefined, undefined, 'input must be an object', start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
  }

  if (typeof input.goal !== 'string' || input.goal.trim().length === 0) {
    return invalidEvaluateResult(input.referenceId, input.goal, 'goal is required (non-empty string)', start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
  }

  if (!isMode(input.mode)) {
    return invalidEvaluateResult(
      input.referenceId,
      input.goal,
      `mode must be one of: ${VALID_AIIQ_LANGUAGE_MODES.join(', ')}`,
      start,
      extremInformationalFlow,
      extremPretpostavka,
      extremGamingDsl,
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
      return invalidEvaluateResult(input.referenceId, input.goal, `${field} must be within 0..100`, start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
    }
  }

  if (typeof input.fallbackConfigured !== 'boolean') {
    return invalidEvaluateResult(input.referenceId, input.goal, 'fallbackConfigured must be boolean', start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
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
  const baseRecommendedAction = resolveAction(status, input.fallbackConfigured);

  const warnings: string[] = [];
  if (!input.fallbackConfigured) warnings.push('Fallback nije konfigurisan; AI-native aktivacija je zaključana.');
  if (input.riskLevel >= 80) warnings.push('Visok riskLevel zahteva dodatne guardrail i human review.');
  if (input.securityPolicyScore < 60) warnings.push('Security policy score je nizak za pouzdan AI-native režim.');
  if (input.explainabilityNeed >= 85 && input.ruleCoverage < 65) {
    warnings.push('Visok explainability zahtev traži veći ruleCoverage za stabilno objašnjenje.');
  }

  const domStatus = toSignalStatus(deterministicReadiness, status === 'BLOCKED');
  const dikStatus = toSignalStatus(aiLayerReadiness, status === 'BLOCKED');
  const dakStatus = status === 'BLOCKED'
    ? 'BLOCKED'
    : overallScore >= 82 && safetyScore >= 70
      ? 'READY'
      : 'WATCH';
  const dukStatus = status === 'BLOCKED'
    ? 'BLOCKED'
    : (input.riskLevel >= 80 || !input.fallbackConfigured)
      ? 'WATCH'
      : 'READY';
  const durationMs = round2(performance.now() - start);
  const integrationProfile = buildIntegrationProfile({
    surface: '/api/ai-iq-programski-jezik/evaluate',
    dom: domStatus,
    dik: dikStatus,
    dak: dakStatus,
    duk: dukStatus,
    rolloutMaturityScore: overallScore,
    promotionFreeze: status === 'BLOCKED' || input.riskLevel >= 80 || !input.fallbackConfigured,
    performanceWithinTargets: durationMs <= AIIQ_LANG_PERFORMANCE_MAX_MS,
    securityBoundariesPreserved: status !== 'BLOCKED' && input.securityPolicyScore >= 60 && input.fallbackConfigured,
    informationalFlowSignalStatus: extremInformationalFlow.readiness.status,
    informationalFlowReadinessScore: extremInformationalFlow.readiness.score,
    pretpostavkaSignalStatus: extremPretpostavka.readiness.status,
    pretpostavkaReadinessScore: extremPretpostavka.readiness.score,
    pretpostavkaTechnicalSignals: extremPretpostavka.technicalSignals,
    gamingDslSignalStatus: extremGamingDsl.readiness.status,
    gamingDslReadinessScore: extremGamingDsl.readiness.score,
    gamingDslSignals: extremGamingDsl.gamingDomainCoverage,
  });
  const recommendedAction = integrationProfile.dokDikDakDukConsistencyHealth.deterministicFallbackRequired
    ? (status === 'BLOCKED' ? 'HARDEN_GUARDS' : 'RUN_SHADOW_MODE')
    : baseRecommendedAction;
  if (integrationProfile.dokDikDakDukConsistencyHealth.deterministicFallbackRequired) {
    warnings.push('Objedinjeni DOK/DIK/DAK/DUK signal je BLOCKED; primenjuje se deterministički fallback.');
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
    integrationProfile,
    disclaimer: AIIQ_LANG_DISCLAIMER,
    valid: true,
    durationMs,
  };
}

export function compileAiiqLanguage(input: AiiqLanguageCompileInput): AiiqLanguageCompileResult {
  const start = performance.now();
  const extremReport = getExtrimliExtremProfilerReport();
  const extremInformationalFlow = extremReport.programskiJezikInformacionihTokova;
  const extremPretpostavka = extremReport.programskiJezikPretpostavka;
  const extremGamingDsl = extremReport.programskiJezikSpecijalizovanZaIgrice;

  if (!input || typeof input !== 'object') {
    return invalidCompileResult(undefined, 'input must be an object', start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
  }

  if (typeof input.source !== 'string' || input.source.trim().length === 0) {
    return invalidCompileResult(input.referenceId, 'source is required (non-empty string)', start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
  }

  if (!isMode(input.targetMode)) {
    return invalidCompileResult(
      input.referenceId,
      `targetMode must be one of: ${VALID_AIIQ_LANGUAGE_MODES.join(', ')}`,
      start,
      extremInformationalFlow,
      extremPretpostavka,
      extremGamingDsl,
    );
  }

  if (typeof input.strictSecurity !== 'boolean') {
    return invalidCompileResult(input.referenceId, 'strictSecurity must be boolean', start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
  }

  if (typeof input.featureFlagAiIqLanguage !== 'boolean') {
    return invalidCompileResult(input.referenceId, 'featureFlagAiIqLanguage must be boolean', start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
  }

  const { ast, warnings, unsupportedKeywords } = parseProgram(input.source);
  if (ast.length === 0) {
    return invalidCompileResult(input.referenceId, 'source cannot be compiled into valid AST nodes', start, extremInformationalFlow, extremPretpostavka, extremGamingDsl);
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
  const aiFeatureFreeze = aiRequested && !input.featureFlagAiIqLanguage;

  const baseExecutionMode: AiiqLanguageMode =
    !aiRequested ? 'DETERMINISTIC_ONLY' :
    aiEnabled && securityPass ? input.targetMode :
    'DETERMINISTIC_ONLY';

  const status: AiiqLanguageStatus =
    !securityPass ? 'BLOCKED' :
    readinessScore >= 82 && baseExecutionMode !== 'DETERMINISTIC_ONLY' ? 'AI_NATIVE_READY' :
    readinessScore >= 64 ? 'READY' :
    'LIMITED';

  const baseRecommendedAction =
    status === 'BLOCKED' ? 'HARDEN_GUARDS' :
    !aiEnabled && aiRequested ? 'RUN_SHADOW_MODE' :
    status === 'AI_NATIVE_READY' ? 'ENABLE_AI_NATIVE' :
    'ADD_FALLBACK';

  if (aiRequested && !input.featureFlagAiIqLanguage) {
    warnings.push(`Feature flag '${AIIQ_LANG_FEATURE_FLAG}' nije aktivan; AI sloj ostaje ugašen.`);
  }

  const domStatus = toSignalStatus(semanticScore, !securityPass);
  const hasUnsupportedDikKeyword = unsupportedKeywords.includes('DIK') || unsupportedKeywords.includes('DIK PETLJA');
  const dikPenalty = hasUnsupportedDikKeyword ? 20 : 0;
  const dikReadiness = clamp(readinessScore - dikPenalty, AIIQ_LANG_MIN_SCORE, AIIQ_LANG_MAX_SCORE);
  const dikStatus = toSignalStatus(dikReadiness, !securityPass);
  const dakStatus = !securityPass
    ? 'BLOCKED'
    : aiFeatureFreeze
      ? 'WATCH'
    : readinessScore >= 82 && baseExecutionMode !== 'DETERMINISTIC_ONLY'
      ? 'READY'
      : 'WATCH';
  const dukStatus = !securityPass
    ? 'BLOCKED'
    : !aiRequested
      ? 'WATCH'
    : aiFeatureFreeze
      ? 'WATCH'
      : 'READY';

  let compiledProgram = JSON.stringify(
    {
      contractVersion: AIIQ_LANG_CONTRACT_VERSION,
      targetMode: input.targetMode,
      executionMode: baseExecutionMode,
      strictSecurity: input.strictSecurity,
      ast,
    },
    null,
    2,
  );
  const durationMs = round2(performance.now() - start);
  const integrationProfile = buildIntegrationProfile({
    surface: '/api/ai-iq-programski-jezik/compile',
    dom: domStatus,
    dik: dikStatus,
    dak: dakStatus,
    duk: dukStatus,
    rolloutMaturityScore: readinessScore,
    promotionFreeze: status === 'BLOCKED' || !securityPass || aiFeatureFreeze,
    performanceWithinTargets: durationMs <= AIIQ_LANG_PERFORMANCE_MAX_MS,
    securityBoundariesPreserved: securityPass,
    informationalFlowSignalStatus: extremInformationalFlow.readiness.status,
    informationalFlowReadinessScore: extremInformationalFlow.readiness.score,
    pretpostavkaSignalStatus: extremPretpostavka.readiness.status,
    pretpostavkaReadinessScore: extremPretpostavka.readiness.score,
    pretpostavkaTechnicalSignals: extremPretpostavka.technicalSignals,
    gamingDslSignalStatus: extremGamingDsl.readiness.status,
    gamingDslReadinessScore: extremGamingDsl.readiness.score,
    gamingDslSignals: extremGamingDsl.gamingDomainCoverage,
  });
  const executionMode: AiiqLanguageMode = integrationProfile.dokDikDakDukConsistencyHealth.deterministicFallbackRequired
    ? 'DETERMINISTIC_ONLY'
    : baseExecutionMode;
  const recommendedAction = integrationProfile.dokDikDakDukConsistencyHealth.deterministicFallbackRequired
    ? (status === 'BLOCKED' ? 'HARDEN_GUARDS' : 'RUN_SHADOW_MODE')
    : baseRecommendedAction;
  if (executionMode !== baseExecutionMode) {
    compiledProgram = JSON.stringify(
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
  }
  if (integrationProfile.dokDikDakDukConsistencyHealth.deterministicFallbackRequired) {
    warnings.push('Objedinjeni DOK/DIK/DAK/DUK signal je BLOCKED; compile izvršenje ostaje u determinističkom fallback režimu.');
  }

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
    integrationProfile,
    disclaimer: AIIQ_LANG_DISCLAIMER,
    valid: true,
    durationMs,
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
