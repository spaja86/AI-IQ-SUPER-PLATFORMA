// SpajaUltraOmegaCore -∞Ω+∞ — DURIT EKSER FAR DIR DOR DAR EKSTRIBUŠEN
// Kompanija SPAJA — Digitalna Industrija

import type { DistribucijaStatus } from '../distribucija';
import type { PetljaResult, PetljaStatusInput } from '../petlje';

export type DuritEkserFarDirDorDarEkstribusenStatus = 'BLOCKED' | 'DEGRADED' | 'READY' | 'EKSTRIBUSEN';
export type DuritEkstribusenSignalId = 'DURIT' | 'EKSER' | 'FAR' | 'DIR';

export interface DuritEkserFarDirDorDarEkstribusenInput {
  start?: number;
  end?: number;
  step?: number;
  target?: number;
  maxIterations?: number;
  maxDurationMs?: number;
  status?: PetljaStatusInput;
  referenceId?: string;
  minimumScore?: number;
  targetScore?: number;
}

export interface DuritEkstribusenSignalResult {
  id: DuritEkstribusenSignalId;
  label: string;
  score: number;
  weight: number;
  contribution: number;
  description: string;
}

export interface DuritEkstribusenDistributionAlignment {
  sourceOfTruth: '/api/distribucija';
  modelStatus: DistribucijaStatus;
  readinessStatus: 'spremno' | 'oprez' | 'blokirano';
  readinessScore: number;
  activeNodesPct: number;
  activeChannelsPct: number;
  dailyTrafficTb: number;
}

export interface DuritEkstribusenAudit {
  expectedIterations: number;
  completedPetlje: number;
  degradedSources: string[];
}

export interface DuritEkserFarDirDorDarEkstribusenResult {
  referenceId: string;
  slug: string;
  label: string;
  overallScore: number;
  status: DuritEkserFarDirDorDarEkstribusenStatus;
  valid: boolean;
  warnings: string[];
  durationMs: number;
  minimumScore: number;
  targetScore: number;
  targetDelta: number;
  distribution: DuritEkstribusenDistributionAlignment;
  signals: DuritEkstribusenSignalResult[];
  dor: PetljaResult;
  dar: PetljaResult;
  audit: DuritEkstribusenAudit;
}

export interface DuritEkserFarDirDorDarEkstribusenHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastScore: number;
  lastStatus: DuritEkserFarDirDorDarEkstribusenStatus;
  lastEvaluatedAt: string | null;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
  defaultMinimumScore: number;
  defaultTargetScore: number;
  slug: string;
  sourceOfTruth: '/api/durit-ekser-far-dir-dor-dar-ekstribusen/evaluate';
}

export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_SLUG = 'durit-ekser-far-dir-dor-dar-ekstribusen';
export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_LABEL = 'DURIT EKSER FAR DIR DOR DAR EKSTRIBUŠEN';
export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_CONTRACT_VERSION = 'v1';
export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_MODULE_VERSION = '1.0.0';
export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERSONA_ID = 'durit-ekser-ekstribusen-core';
export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERFORMANCE_MAX_MS = 50;
export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_API_RESPONSE_MAX_MS = 200;
export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_MINIMUM_SCORE = 70;
export const DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_TARGET_SCORE = 85;
