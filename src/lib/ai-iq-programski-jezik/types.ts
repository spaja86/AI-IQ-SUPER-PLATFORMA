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

export type AiiqIntegrationSignalStatus = 'BLOCKED' | 'WATCH' | 'READY';

export type AiiqIntegrationRolloutStage = 'WAVE-1' | 'WAVE-2' | 'WAVE-3' | 'WAVE-4' | 'WAVE-5';

export interface AiiqLanguageExtrimliIntegrationProfile {
  profileId: 'EXTRIMLI-EXTRONDOL-EXTREM';
  additiveOnly: true;
  contractMutation: 'none';
  scope: {
    aiIqLanguageSurfaces: readonly ['/api/ai-iq-programski-jezik/evaluate', '/api/ai-iq-programski-jezik/compile'];
    currentSurface: '/api/ai-iq-programski-jezik/evaluate' | '/api/ai-iq-programski-jezik/compile';
    extrem: '/api/extrimli/extrem';
    extrondol: '/api/extrimli/extrondol';
  };
  signalMapping: {
    DOM: {
      source: '/api/extrimli/extrem';
      group: readonly ['DOMPRE PETLJA', 'DOMBRE PETLJA', 'DOMBRA PETLJA', 'DOMBAR PETLJA', 'DOMPOR PETLJA'];
    };
    DIK: {
      source: '/api/extrimli/extrem';
      group: readonly ['DIK PETLJA'];
    };
    DAK: {
      source: '/api/extrimli/extrondol';
      group: readonly ['DAKOR'];
      role: 'promotion-control';
    };
    DUK: {
      source: '/api/extrimli/extrondol';
      group: readonly ['DUKAR'];
      role: 'human-review-control';
    };
    FOR: {
      technicalSource: '/api/extrimli/extrem';
      governanceSource: '/api/extrimli/extrondol';
      group: readonly ['FOR PETLJA', 'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA'];
      role: 'sequential-numeric-flow-input';
    };
    PRETPOSTAVKA: {
      technicalSource: '/api/extrimli/extrem';
      governanceSource: '/api/extrimli/extrondol';
      group: readonly ['PROGRAMSKI JEZIK PRETPOSTAVKA (KLJUČNE INFORMACIJE SA UČINIM OBLIKOM)'];
      role: 'interpretacioni-track';
    };
    PROSPARITET_DEKLASIRANE_MATRICE_EKSTAZA: {
      technicalSource: '/api/extrimli/extrem';
      governanceSource: '/api/extrimli/extrondol';
      group: readonly ['PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI (PREDISPOZIJA EKSTREMNIH GLASOVNIH KOMANDI U ETAPSIKM SENZACIJAMA)'];
      role: 'prosparitet-input-domain-interpretation-track';
    };
    SINEMETRICKO: {
      technicalSource: '/api/extrimli/extrem';
      governanceSource: '/api/extrimli/extrondol';
      group: readonly ['SINEMETRIČKO PROGRAMIRANJE'];
      role: 'additive-governance-technical-input';
    };
    IGRICE: {
      technicalSource: '/api/extrimli/extrem';
      governanceSource: '/api/extrimli/extrondol';
      group: readonly ['PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE'];
      role: 'gaming-runtime-orchestration-profile';
    };
  };
  layerResponsibilities: {
    extrem: 'technical-signal-engine-readiness-conflict-profiling';
    extrondol: 'wave-governance-orchestrator';
    aiIqProgramskiJezik: 'dsl-orchestration-explainability-layer';
  };
  unifiedSignalStatus: {
    dom: AiiqIntegrationSignalStatus;
    dik: AiiqIntegrationSignalStatus;
    dak: AiiqIntegrationSignalStatus;
    duk: AiiqIntegrationSignalStatus;
    forInformacioniTokovi: AiiqIntegrationSignalStatus;
    pretpostavka: AiiqIntegrationSignalStatus;
    prosparitetDeklasiraneMatriceEkstaza: AiiqIntegrationSignalStatus;
    programskiJezikSpecijalizovanZaIgrice: AiiqIntegrationSignalStatus;
    sinemetricko: AiiqIntegrationSignalStatus;
    overall: AiiqIntegrationSignalStatus;
  };
  dokDikDakDukConsistencyHealth: {
    sourceOfTruth: '/api/extrimli/extrondol';
    additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM';
    scopeLock: readonly ['DOK', 'DIK', 'DAK', 'DUK'];
    status: AiiqIntegrationSignalStatus;
    escalationStatus: AiiqIntegrationSignalStatus;
    escalationScore: number;
    deterministicFallbackRequired: boolean;
    promotionFreeze: boolean;
    humanReviewRequired: true;
    rollbackPlanRequired: true;
    downstreamReference: 'spaja86/IO-OPENUI-AO';
    programskiJezikProucavanja: {
      canonicalName: 'PROGRAMSKI JEZIK PROUČAVANJA';
      additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM';
      sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol'];
      consolidatedStatus: AiiqIntegrationSignalStatus;
      escalationScore: number;
      ownershipSplit: {
        dokDik: 'EXTREM';
        dakDuk: 'EXTRONDOL';
      };
      programskiEkanalog: {
        canonicalName: 'PROGRAMSKI EKANALOG';
        meaning: 'razumevanje logike';
        auditConclusion: string;
        auditReady: boolean;
      };
    };
    programskiJezikInformacionihTokova: {
      canonicalName: 'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA';
      additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM';
      dslProfile: 'interpretacioni-orkestracioni-dsl';
      sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol'];
      ownershipSplit: {
        forPetlja: 'EXTREM';
        dokDik: 'EXTREM';
        dakDuk: 'EXTRONDOL';
        spajaKod: 'audit-safe-summary-only';
      };
      unifiedStatus: AiiqIntegrationSignalStatus;
      deterministicFallbackRequired: boolean;
      explainabilityModel: 'existing-ai-iq-guardrails';
      guardrailMode: 'deterministic-fallback';
      metrics: {
        stabilityScore: number;
        sequenceIntegrityScore: number;
        driftConflictScore: number;
        saturationLoadScore: number;
        continuationReadinessScore: number;
      };
      reasons: string[];
    };
    programskiJezikPretpostavka: {
      canonicalName: 'PROGRAMSKI JEZIK PRETPOSTAVKA (KLJUČNE INFORMACIJE SA UČINIM OBLIKOM)';
      additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM';
      dslProfile: 'interpretacioni-pretpostavka-dsl';
      sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol'];
      ownershipSplit: {
        forPetlja: 'EXTREM';
        dokDik: 'EXTREM';
        dakDuk: 'EXTRONDOL';
        spajaKod: 'audit-safe-summary-only';
      };
      unifiedStatus: AiiqIntegrationSignalStatus;
      deterministicFallbackRequired: boolean;
      explainabilityModel: 'existing-ai-iq-guardrails';
      guardrailMode: 'deterministic-fallback';
      semantics: {
        pretpostavka: string;
        kljucneInformacije: string;
        uciniOblik: string;
      };
      metrics: {
        stabilityScore: number;
        keyInformationIntegrityScore: number;
        actionShapeDeterminismScore: number;
        driftConflictScore: number;
        saturationLoadScore: number;
        continuationReadinessScore: number;
      };
      reasons: string[];
    };
    programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi: {
      canonicalName: 'PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI (PREDISPOZIJA EKSTREMNIH GLASOVNIH KOMANDI U ETAPSIKM SENZACIJAMA)';
      additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM';
      dslProfile: 'prosparitet-deklasirane-matrice-ekstaza-dsl';
      sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol'];
      ownershipSplit: {
        forPetlja: 'EXTREM';
        dokDik: 'EXTREM';
        dakDuk: 'EXTRONDOL';
        spajaKod: 'audit-safe-summary-only';
        prosparitet: 'input-domain-only';
      };
      unifiedStatus: AiiqIntegrationSignalStatus;
      deterministicFallbackRequired: boolean;
      explainabilityModel: 'existing-ai-iq-guardrails';
      guardrailMode: 'deterministic-fallback';
      semantics: {
        prosparitet: string;
        deklasiraneMatrice: string;
        glasovneKomande: string;
        etapsikmSenzacije: string;
      };
      metrics: {
        deklasiraneMatriceReadinessScore: number;
        prosparitetAlignmentScore: number;
        glasovneKomandePredispozicijaScore: number;
        etapsikmSenzacijeStageCohesionScore: number;
        driftConflictScore: number;
        continuationReadinessScore: number;
      };
      reasons: string[];
    };
    programskiJezikSpecijalizovanZaIgrice: {
      canonicalName: 'PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE';
      additiveOnlyProfile: 'EXTRIMLI-EXTRONDOL-EXTREM';
      dslProfile: 'gaming-specijalizovani-dsl';
      sourceOfTruthRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol'];
      ownershipSplit: {
        forPetlja: 'EXTREM';
        dokDik: 'EXTREM';
        dakDuk: 'EXTRONDOL';
        spajaKod: 'audit-safe-summary-only';
      };
      unifiedStatus: AiiqIntegrationSignalStatus;
      deterministicFallbackRequired: boolean;
      explainabilityModel: 'existing-ai-iq-guardrails';
      guardrailMode: 'deterministic-fallback';
      gamingDomain: {
        category: 'igrice';
        consumerAnchors: readonly ['src/lib/igrice.ts', 'src/lib/gaming-endzin.ts'];
        ownership: {
          aiIqProgramskiJezik: 'dsl-orchestration-explainability-layer';
          extrem: 'technical-gaming-signal';
          extrondol: 'wawe-governance-audit-consumer';
        };
      };
      metrics: {
        gameplayCategoryCoverageScore: number;
        runnerCompatibilityScore: number;
        dimensionalModeReadinessScore: number;
        renderPhysicsReadinessScore: number;
        aiNpcBehaviorScore: number;
        multiplayerSyncScore: number;
        antiCheatIntegrityScore: number;
        analyticsPerformanceReadinessScore: number;
      };
      reasons: string[];
    };
    programskiJezikApstrakcija: {
      canonicalName: 'PROGRAMSKI JEZIK APSTRAKCIJA';
      additiveOnly: true;
      initiativeGoal: string;
      sourceOfTruthLock: {
        extrem: '/api/extrimli/extrem';
        extrondol: '/api/extrimli/extrondol';
        aiIqProgramskiJezik: 'dsl-orchestration-explainability-layer';
        integrationSignalRoutes: readonly ['/api/extrimli/extrem', '/api/extrimli/extrondol'];
      };
      signalOwnership: {
        dokDik: 'EXTREM';
        dakDuk: 'EXTRONDOL';
        forInformacioniTok: 'EXTREM';
        consolidatedOutput: readonly ['READY', 'WATCH', 'BLOCKED'];
      };
      dslProfile: {
        intent: true;
        rules: true;
        aiLayer: true;
        orchestration: true;
        outputSchema: true;
        mandatoryGuardrails: true;
        deterministicFallback: true;
        auditReadyExplanation: true;
      };
      superiorInformationSystemMetrics: {
        stabilityScore: number;
        sequenceIntegrityScore: number;
        driftConflictScore: number;
        saturationLoadScore: number;
        continuationReadinessScore: number;
      };
      adaptiveOperatingModel: {
        deterministicOnly: true;
        hybrid: true;
        aiNative: 'security-readiness-governance-gated';
      };
      governanceQualityGate: {
        sequence: readonly ['lint', 'test', 'smoke', 'predeploy', 'security', 'human-review', 'audit-log'];
        rollbackPlanRequired: true;
        promotionFreezeOnSignal: true;
      };
      driftZeroConformance: {
        layers: readonly ['docs', 'types', 'routes', 'tests', 'workflows'];
        promotionBlockedOnDrift: true;
      };
      rolloutPlan: {
        phase1: 'documentation-lock-and-contract-model';
        phase2: 'types-contracts-health-readiness';
        phase3: 'tests-conformance-audit-evidence';
        phase4: 'downstream-sync-and-audit-safe-summary';
      };
      successCriteria: {
        deterministicRepeatability: true;
        edgeCasesValidated: true;
        adaptiveFallbackConfirmed: boolean;
        governanceConformanceGreen: boolean;
        downstreamSyncReady: boolean;
      };
    };
    reasons: string[];
  };
  governanceLink: {
    sourceOfTruth: '/api/extrimli/extrondol';
    rolloutSnapshot: {
      currentStage: AiiqIntegrationRolloutStage;
      eligibleNextStage: AiiqIntegrationRolloutStage;
      promotionFreeze: boolean;
    };
    humanReviewRequired: true;
    rollbackPlanRequired: true;
    downstreamReference: {
      linkedRepo: 'spaja86/IO-OPENUI-AO';
      required: true;
    };
  };
  acceptanceCriteria: {
    deterministicOutput: true;
    edgeCaseValidation: true;
    preserveExistingContracts: true;
    preserveDokDikDakDukContract: true;
    informacioniTokoviAdditiveInput: true;
    pretpostavkaAdditiveInput: true;
    sinemetrickoAdditiveInput: true;
    performanceWithinTargets: boolean;
    securityBoundariesPreserved: boolean;
  };
}

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
  integrationProfile: AiiqLanguageExtrimliIntegrationProfile;
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
  integrationProfile: AiiqLanguageExtrimliIntegrationProfile;
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
