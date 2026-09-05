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
  canonicalApex: string;
  canonicalWildcard: string;
  valid: boolean;
  invalidReason: string | null;
}

export interface ExtrimliExtrondolNivoDuetSignal {
  status: DuetStatus;
  overallScore: number;
  warnings: string[];
}

export interface ExtrimliExtrondolNivoDuetSection {
  sourceOfTruth: string;
  mapping: {
    fromDuet: ['status', 'overallScore', 'warnings'];
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
  domainStrategy: ExtrimliExtrondolDomainStrategy;
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
export const EXTRONDOL_REQUESTED_DOMAIN_PATTERN = 'spaja.nivo*spaja';
export const EXTRONDOL_CANONICAL_APEX_DOMAIN = 'spaja.nivo-spaja';
export const EXTRONDOL_CANONICAL_WILDCARD_DOMAIN = '*.spaja.nivo-spaja';
