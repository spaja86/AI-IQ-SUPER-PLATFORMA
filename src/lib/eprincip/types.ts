// SpajaUltraOmegaCore -∞Ω+∞ — EPRINCIP
// Kompanija SPAJA — Digitalna Industrija

export type EPrincipStatus = 'NON_COMPLIANT' | 'PARTIAL' | 'ALIGNED' | 'EXEMPLARY';

export interface EPrincipPrincipleInput {
  id: string;
  label: string;
  score: number;
  weight: number;
  required?: boolean;
  evidenceCount?: number;
}

export interface EPrincipInput {
  principles: EPrincipPrincipleInput[];
  referenceId?: string;
  minimumScore?: number;
}

export interface EPrincipPrincipleResult {
  id: string;
  label: string;
  score: number;
  weight: number;
  required: boolean;
  evidenceCount: number;
  contribution: number;
  meetsMinimumScore: boolean;
  hasEvidence: boolean;
}

export interface EPrincipResult {
  referenceId: string;
  overallScore: number;
  status: EPrincipStatus;
  valid: boolean;
  warnings: string[];
  durationMs: number;
  coveragePct: number;
  minimumScore: number;
  requiredSatisfied: boolean;
  principles: EPrincipPrincipleResult[];
}

export interface EPrincipHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastScore: number;
  lastStatus: EPrincipStatus;
  lastEvaluatedAt: string | null;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
  defaultMinimumScore: number;
}

export const EPRINCIP_CONTRACT_VERSION = 'v1';
export const EPRINCIP_MODULE_VERSION = '1.0.0';
export const EPRINCIP_PERSONA_ID = 'eprincip-governance';
export const EPRINCIP_PERFORMANCE_MAX_MS = 50;
export const EPRINCIP_API_RESPONSE_MAX_MS = 200;
export const EPRINCIP_DEFAULT_MINIMUM_SCORE = 70;
