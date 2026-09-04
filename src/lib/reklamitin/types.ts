// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Types
// Kompanija SPAJA — Digitalna Industrija
// NOTE 14856 — RADIKALNI NIVO: Reprodukcion Reklamitin

export const REKLAMITIN_CONTRACT_VERSION = 'v1';
export const REKLAMITIN_MODULE_VERSION = '1.0.0';
export const REKLAMITIN_PERSONA_ID = 'reklamitin-core';
export const REKLAMITIN_DISPLAY_NAME = 'REKLAMITIN';
export const REKLAMITIN_SLUG = 'reklamitin';
export const REKLAMITIN_OCTAVE = 9;
export const REKLAMITIN_HIPERMREZA_NODE = 72;
export const REKLAMITIN_OKRID = 'OKRID-2026-REKLAMITIN-14856';
export const REKLAMITIN_NOTE = 14856;

// Performance KPIs
export const REKLAMITIN_PERFORMANCE_MAX_MS = 50;
export const REKLAMITIN_API_RESPONSE_MAX_MS = 200;
export const REKLAMITIN_BROADCAST_DISPATCH_MAX_MS = 100;

// Score bounds
export const REKLAMITIN_MIN_INTENSITY_SCORE = 0;
export const REKLAMITIN_MAX_INTENSITY_SCORE = 1000;

export const REKLAMITIN_LINKED_REPO_IMPACT = 'operator-catalog-snapshot';

export const REKLAMITIN_DISCLAIMER =
  'Reklamitin rezultati su automatski generisani. REKLAMITIN engine provides deterministic reproduction-advertising intelligence and does not constitute professional marketing advice.';

// ─── Radical Level ───────────────────────────────────────────────────────────

export type RadicalLevel = 'STANDARD' | 'ELEVATED' | 'AGGRESSIVE' | 'RADICAL';

export interface LevelConfig {
  level: RadicalLevel;
  intensityScore: number;
  reachMultiplier: number;
  frequencyCapHz: number;
  zeroCap: boolean;
  description: string;
}

// ─── Broadcast Targets ───────────────────────────────────────────────────────

export type BroadcastTarget =
  | 'WEB'
  | 'MOBILE'
  | 'EMAIL'
  | 'SOCIAL'
  | 'TV'
  | 'RADIO'
  | 'PUSH_NOTIFICATION'
  | 'IN_APP';

// ─── Audience Segment ────────────────────────────────────────────────────────

export type AudienceSegment =
  | 'GENERAL'
  | 'YOUTH'
  | 'PROFESSIONAL'
  | 'SENIOR'
  | 'HIGH_VALUE'
  | 'RETARGETING';

// ─── Reproduction Ad ─────────────────────────────────────────────────────────

export interface ReproductionAd {
  adId: string;
  title: string;
  level: RadicalLevel;
  broadcastTargets: BroadcastTarget[];
  audienceSegment: AudienceSegment;
  durationSeconds: number;
  budgetScore: number;
}

// ─── Request / Result ────────────────────────────────────────────────────────

export interface ReklamitiнRequest {
  referenceId?: string;
  level: RadicalLevel;
  broadcastTargets: BroadcastTarget[];
  audienceSegment: AudienceSegment;
  durationSeconds: number;
  budgetScore: number;
  adId?: string;
  title?: string;
}

export interface BroadcastResult {
  target: BroadcastTarget;
  dispatched: boolean;
  dispatchMs: number;
  reachScore: number;
}

export interface ReklamitiнResult {
  referenceId: string;
  adId: string;
  level: RadicalLevel;
  intensityScore: number;
  reachMultiplier: number;
  frequencyCapHz: number;
  zeroCap: boolean;
  totalReachScore: number;
  broadcastResults: BroadcastResult[];
  audienceSegment: AudienceSegment;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface ReklamitiнHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  okrid: string;
  note: number;
  octave: number;
  hipermrezaNode: number;
  linkedRepoImpact: string;
  evaluations: number;
  lastLevel: RadicalLevel | null;
  lastEvaluatedAt: string | null;
  supportedLevels: RadicalLevel[];
  supportedTargets: BroadcastTarget[];
  supportedSegments: AudienceSegment[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
  broadcastDispatchMaxMs: number;
}
