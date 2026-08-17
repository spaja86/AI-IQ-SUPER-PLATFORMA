// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Registry
// Kompanija SPAJA — Digitalna Industrija

import type { AudienceSegment, BroadcastTarget, LevelConfig, RadicalLevel, ReproductionAd } from './types';

// ─── Level Configs ────────────────────────────────────────────────────────────

export const LEVEL_CONFIGS: Record<RadicalLevel, LevelConfig> = {
  STANDARD: {
    level: 'STANDARD',
    intensityScore: 100,
    reachMultiplier: 1.0,
    frequencyCapHz: 2,
    zeroCap: false,
    description: 'Standard broadcast with balanced reach and controlled frequency.',
  },
  ELEVATED: {
    level: 'ELEVATED',
    intensityScore: 350,
    reachMultiplier: 2.5,
    frequencyCapHz: 5,
    zeroCap: false,
    description: 'Elevated broadcast with increased frequency and wider reach.',
  },
  AGGRESSIVE: {
    level: 'AGGRESSIVE',
    intensityScore: 650,
    reachMultiplier: 5.0,
    frequencyCapHz: 12,
    zeroCap: false,
    description: 'Aggressive broadcast with high-frequency saturation across multiple targets.',
  },
  RADICAL: {
    level: 'RADICAL',
    intensityScore: 1000,
    reachMultiplier: 10.0,
    frequencyCapHz: 0,
    zeroCap: true,
    description: 'RADICAL — maximum engagement, cross-platform broadcast, zero frequency cap. Full reproduction intensity.',
  },
};

export const LEVEL_ORDER: RadicalLevel[] = ['STANDARD', 'ELEVATED', 'AGGRESSIVE', 'RADICAL'];

// ─── Broadcast Target Reach Base ─────────────────────────────────────────────

export const TARGET_REACH_BASE: Record<BroadcastTarget, number> = {
  WEB: 80,
  MOBILE: 90,
  EMAIL: 60,
  SOCIAL: 95,
  TV: 70,
  RADIO: 50,
  PUSH_NOTIFICATION: 85,
  IN_APP: 75,
};

// ─── Audience Segment Multiplier ─────────────────────────────────────────────

export const SUPPORTED_SEGMENTS: AudienceSegment[] = [
  'GENERAL',
  'YOUTH',
  'PROFESSIONAL',
  'SENIOR',
  'HIGH_VALUE',
  'RETARGETING',
];

export const SEGMENT_MULTIPLIER: Record<AudienceSegment, number> = {
  GENERAL: 1.0,
  YOUTH: 1.2,
  PROFESSIONAL: 1.1,
  SENIOR: 0.9,
  HIGH_VALUE: 1.5,
  RETARGETING: 1.8,
};

// ─── Ad Template Catalog ─────────────────────────────────────────────────────

export const AD_CATALOG: ReproductionAd[] = [
  {
    adId: 'RKL-001',
    title: 'Nova Generacija Promo',
    level: 'STANDARD',
    broadcastTargets: ['WEB', 'MOBILE'],
    audienceSegment: 'GENERAL',
    durationSeconds: 30,
    budgetScore: 200,
  },
  {
    adId: 'RKL-002',
    title: 'SpajaPro 16 Elevated Campaign',
    level: 'ELEVATED',
    broadcastTargets: ['WEB', 'MOBILE', 'SOCIAL', 'EMAIL'],
    audienceSegment: 'PROFESSIONAL',
    durationSeconds: 60,
    budgetScore: 500,
  },
  {
    adId: 'RKL-003',
    title: 'Mega Platform Aggressive Blast',
    level: 'AGGRESSIVE',
    broadcastTargets: ['WEB', 'MOBILE', 'SOCIAL', 'PUSH_NOTIFICATION', 'IN_APP'],
    audienceSegment: 'RETARGETING',
    durationSeconds: 15,
    budgetScore: 750,
  },
  {
    adId: 'RKL-004',
    title: 'RADIKALNI NIVO — Full Spectrum Broadcast',
    level: 'RADICAL',
    broadcastTargets: ['WEB', 'MOBILE', 'EMAIL', 'SOCIAL', 'TV', 'RADIO', 'PUSH_NOTIFICATION', 'IN_APP'],
    audienceSegment: 'HIGH_VALUE',
    durationSeconds: 120,
    budgetScore: 1000,
  },
];

export function getAdById(adId: string): ReproductionAd | undefined {
  return AD_CATALOG.find((ad) => ad.adId === adId);
}
