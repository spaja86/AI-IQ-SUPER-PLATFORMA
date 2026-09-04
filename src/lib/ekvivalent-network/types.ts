// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK
// Kompanija SPAJA — Digitalna Industrija

export type EkvivalentDomain =
  | 'SKILL'
  | 'COMPETENCY'
  | 'AGENT'
  | 'MODULE'
  | 'ORGANIZATION'
  | 'RESOURCE'
  | 'PERSONA'
  | 'KNOWLEDGE';

export type EkvivalentRelationType =
  | 'FULL'
  | 'PARTIAL'
  | 'FUNCTIONAL'
  | 'CONTEXTUAL'
  | 'SUBSTITUTABLE';

export interface EkvivalentNode {
  id: string;
  label: string;
  domain: EkvivalentDomain;
  attributes?: Record<string, unknown>;
  tags?: string[];
}

export interface EkvivalentEdge {
  fromId: string;
  toId: string;
  relationType: EkvivalentRelationType;
  /** Equivalence score 0–100 */
  score: number;
  context?: string;
  evidence?: string;
}

export interface EkvivalentInput {
  referenceId?: string;
  nodes: EkvivalentNode[];
  edges: EkvivalentEdge[];
  queryNodeId?: string;
  queryDomain?: EkvivalentDomain;
}

export interface EkvivalentMatch {
  node: EkvivalentNode;
  relationType: EkvivalentRelationType;
  equivalenceScore: number;
  rank: number;
  activationHint: string;
}

export interface EkvivalentCluster {
  clusterId: string;
  label: string;
  members: string[];
  /** Average internal equivalence score, 0–1 */
  cohesion: number;
  representative: string;
}

export interface EkvivalentResult {
  referenceId: string;
  queryNode: EkvivalentNode | null;
  equivalentNodes: EkvivalentMatch[];
  clusterMap: EkvivalentCluster[];
  networkScore: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface EkvivalentHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastNetworkScore: number;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
  totalNodes: number;
  totalEdges: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const EKVIVALENT_PERSONA_ID = 'ekvivalent-network-core';
export const EKVIVALENT_CONTRACT_VERSION = 'v1';
export const EKVIVALENT_MODULE_VERSION = '1.0.0';
export const EKVIVALENT_OCTAVE = 15;
export const EKVIVALENT_HIPERMREZA_NODE = 120;
export const EKVIVALENT_PERFORMANCE_MAX_MS = 50;
export const EKVIVALENT_API_RESPONSE_MAX_MS = 200;
export const EKVIVALENT_MIN_SCORE = 0;
export const EKVIVALENT_MAX_SCORE = 100;
/** Minimum edge score to treat two nodes as equivalent for clustering */
export const EKVIVALENT_CLUSTER_THRESHOLD = 70;

export const EKVIVALENT_VALID_DOMAINS: EkvivalentDomain[] = [
  'SKILL',
  'COMPETENCY',
  'AGENT',
  'MODULE',
  'ORGANIZATION',
  'RESOURCE',
  'PERSONA',
  'KNOWLEDGE',
];

export const EKVIVALENT_VALID_RELATION_TYPES: EkvivalentRelationType[] = [
  'FULL',
  'PARTIAL',
  'FUNCTIONAL',
  'CONTEXTUAL',
  'SUBSTITUTABLE',
];

export const EKVIVALENT_DISCLAIMER =
  'Ovo je automatska analiza ekvivalencijskih odnosa i NE predstavlja profesionalnu preporuku za zamenu ili konsolidaciju entiteta. Konsultujte nadležnog arhitektu sistema pre donošenja strateških odluka.';
