import type { ExtrimliExtrondendReport } from '../extrimli-extrondend';
import type { ExtrimliExtendolReport } from '../extrimli-extendol';
import type { ExtrimliKoronHealthReport } from '../extrimli-koron';
import type { DuetInput, DuetStatus } from '../duet';

export type ExtrimliExtrondolWaweStage = 'WAWE-1' | 'WAWE-2' | 'WAWE-3' | 'WAWE-4' | 'WAWE-5';

export interface ExtrimliExtrondolAcceptanceCriterion {
  id: string;
  description: string;
  passed: boolean;
}

export interface ExtrimliExtrondolDomainStrategy {
  requestedPattern: string;
  requestedPatternRejected: boolean;
  canonicalApex: string;
  canonicalWildcard: string;
  valid: boolean;
  invalidReason: string | null;
}

export interface ExtrimliExtrondolNivoDuetSignal {
  valid: boolean;
  status: DuetStatus;
  overallScore: number;
  warnings: string[];
}

export interface ExtrimliExtrondolNivoDuetSection {
  sourceOfTruth: string;
  triggerLabel: string;
  mapping: {
    fromDuet: ['valid', 'status', 'overallScore', 'warnings'];
    toOrchestration: ['rollout.currentWawe', 'rollout.eligibleNextWawe', 'rollout.promotionFreeze'];
  };
  duetInputProfile: {
    objective: DuetInput['objective'];
    mode: DuetInput['mode'];
    energyMatch: DuetInput['energyMatch'];
    clarityScore: number;
    reciprocityScore: number;
    trustScore: number;
    rhythmScore: number;
    tensionLevel: number;
    sharedWindowHours: number;
  };
  signal: ExtrimliExtrondolNivoDuetSignal;
}

export interface ExtrimliExtrondolDinkosContract {
  domain: 'DINKOS';
  classification: 'signal';
  ownership: string;
  triggerLabel: string;
  personaId: string;
  routeSegment: 'nivo-duet';
  degradedMode: 'partial-payload-no-500';
}

export interface ExtrimliExtrondolB2bScope {
  consumerModel: 'organization-level';
  accountOwnership: {
    owner: string;
    operatingEntity: string;
    mandatoryHumanReview: true;
  };
  partnerOperatorRoles: {
    owner: string[];
    operators: string[];
    partners: string[];
    reviewers: string[];
  };
  procurementReviewFlow: {
    steps: ['request-submitted', 'procurement-review', 'compliance-review', 'operational-approval', 'activation'];
    activationRequires: ['contract-approved', 'onboarding-complete', 'downstream-sync-complete', 'human-review-complete'];
  };
  slaExpectations: {
    tier: 'enterprise-governed';
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
    buildDurationMaxMin: number;
    supportWindow: 'business-critical';
  };
  auditObligations: string[];
}

export interface ExtrimliExtrondolB2bReadiness {
  tenant: {
    organizationId: string;
    organizationName: string;
    accountOwner: string;
    environmentTier: 'B2B';
    rolloutRing: 'RING-0-CONTRACT' | 'RING-1-STAGING' | 'RING-2-CANARY' | 'RING-3-PRODUCTION' | 'RING-4-RESILIENCE';
  };
  support: {
    slaTier: 'enterprise-governed';
    status: 'ACTIVE' | 'ATTENTION';
    escalationRequired: boolean;
  };
  compliance: {
    contractApproved: boolean;
    onboardingComplete: boolean;
    operationalApproval: boolean;
    humanReviewComplete: boolean;
    auditTrailComplete: boolean;
    secretsInGitAllowed: false;
    blockers: string[];
  };
  downstreamSync: {
    linkedRepo: string;
    status: 'ALIGNED' | 'FOLLOW_UP_REQUIRED';
    syncedFields: string[];
  };
  governanceDecisions: {
    onboardingHold: boolean;
    rolloutFreeze: boolean;
    escalationRequired: boolean;
    partnerReadinessWarnings: string[];
    dinkosSignalRequired: true;
  };
}

export interface ExtrimliExtrondolGovernanceEvidence {
  auditTrailComplete?: boolean;
  downstreamSyncComplete?: boolean;
  humanReviewComplete?: boolean;
  onboardingComplete?: boolean;
}

export interface ExtrimliExtrondolDistanceRatioEkvilaterRow {
  edgeId: 'extrondend-extendol' | 'extrondend-koron' | 'extendol-koron';
  from: 'EXTRONDEND' | 'EXTENDOL' | 'KORON';
  to: 'EXTRONDEND' | 'EXTENDOL' | 'KORON';
  fromScore: number;
  toScore: number;
  distance: number;
  distanceRatio: number;
  equilateralAlignment: number;
  balanced: boolean;
}

export interface ExtrimliExtrondolDistanceRatioEkvilaterTable {
  requestedTableName: string;
  normalizedTableName: 'DISTANCE RATIO EKVILATER';
  legacyRequestedTableNames: string[];
  contractField: 'distanceRatioEkvilaterTable';
  version: 'v1-distance-ratio-ekvilater';
  interpretation: 'derived-readiness-table';
  targetShape: 'EQUILATERAL';
  scoringSource: ['extrondend.aggregationScore', 'extendol.unifiedReadinessScore', 'koron.readinessScore'];
  rows: ExtrimliExtrondolDistanceRatioEkvilaterRow[];
  summary: {
    averageDistance: number;
    maxDistance: number;
    minDistance: number;
    equilateralConsistency: number;
    interpretation: 'balanced' | 'watch' | 'skewed';
  };
}

export interface ExtrimliExtrondolReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  sourceOfTruth: string;
  statement: string;
  ownership: string;
  triggerLabel: string;
  pathScope: string[];
  orchestrationReadinessScore: number;
  b2bScope: ExtrimliExtrondolB2bScope;
  b2bReadiness: ExtrimliExtrondolB2bReadiness;
  domainStrategy: ExtrimliExtrondolDomainStrategy;
  distanceRatioEkvilaterTable: ExtrimliExtrondolDistanceRatioEkvilaterTable;
  nivoDuet: ExtrimliExtrondolNivoDuetSection;
  dinkos: ExtrimliExtrondolDinkosContract;
  rollout: {
    currentWawe: ExtrimliExtrondolWaweStage;
    eligibleNextWawe: ExtrimliExtrondolWaweStage;
    promotionFreeze: boolean;
    reasons: string[];
  };
  degraded: boolean;
  degradedMode: 'partial-payload-no-500';
  degradedSources: string[];
  acceptanceCriteria: ExtrimliExtrondolAcceptanceCriterion[];
  integrationBoundaries: {
    dependsOn: string[];
    aliasesOfExistingSurfaces: false;
  };
  kpiTargets: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
    buildDurationMaxMin: number;
  };
  surfaces: {
    extrondend: ExtrimliExtrondendReport;
    extendol: ExtrimliExtendolReport;
    koron: ExtrimliKoronHealthReport;
  };
}

export const EXTRONDOL_CONTRACT_VERSION = 'v1-extrondol';
export const EXTRONDOL_MODULE_VERSION = '1.0.0';
export const EXTRONDOL_PERSONA_ID = 'extrimli-extrondol-orchestrator';
export const EXTRONDOL_SOURCE_OF_TRUTH = '/api/extrimli/extrondol';
export const EXTRONDOL_EVALUATION_MAX_MS = 50;
export const EXTRONDOL_API_MAX_MS = 200;
export const EXTRONDOL_BUILD_MAX_MIN = 3;
export const EXTRONDOL_DINKOS_PERSONA_ID = 'extrimli-dinkos-signal-core';
export const EXTRONDOL_DINKOS_TRIGGER_LABEL = 'dinkos:logic-change';
export const EXTRONDOL_NIVO_DUET_SEGMENT = 'nivo-duet';
export const EXTRONDOL_NIVO_DUET_TRIGGER_LABEL = 'nivo-duet:logic-change';
export const EXTRONDOL_REQUESTED_DOMAIN_PATTERN = 'spaja.nivo*spaja';
export const EXTRONDOL_CANONICAL_APEX_DOMAIN = 'spaja.nivo-spaja';
export const EXTRONDOL_CANONICAL_WILDCARD_DOMAIN = '*.spaja.nivo-spaja';
export const EXTRONDOL_BASE_ORCHESTRATION_SHARE = 0.82;
export const EXTRONDOL_NIVO_DUET_SHARE = 0.18;
export const EXTRONDOL_DUET_WARNING_PENALTY_STEP = 4;
export const EXTRONDOL_DUET_WARNING_PENALTY_CAP = 12;
export const EXTRONDOL_DUET_INVALID_SIGNAL_PENALTY = 25;
export const EXTRONDOL_DUET_INVALID_FALLBACK_SCORE = 50;
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_VERSION = 'v1-distance-ratio-ekvilater';
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN = 80;
export const EXTRONDOL_DISTANCE_RATIO_EKVILATER_WATCH_MIN = 55;
export const EXTRONDOL_DUET_STATUS_ADJUSTMENT = {
  HARMONIZED: 4,
  ALIGNED: 2,
  FRAGILE: -6,
  DISSONANT: -14,
} as const;
