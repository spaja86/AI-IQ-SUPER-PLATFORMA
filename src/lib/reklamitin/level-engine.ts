// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Level Engine
// Kompanija SPAJA — Digitalna Industrija

import type { LevelConfig, RadicalLevel } from './types';
import { REKLAMITIN_MAX_INTENSITY_SCORE, REKLAMITIN_MIN_INTENSITY_SCORE } from './types';
import { LEVEL_CONFIGS, LEVEL_ORDER } from './registry';

export function getLevelConfig(level: RadicalLevel): LevelConfig {
  return LEVEL_CONFIGS[level];
}

export function escalateLevel(current: RadicalLevel): RadicalLevel {
  const idx = LEVEL_ORDER.indexOf(current);
  if (idx < 0 || idx >= LEVEL_ORDER.length - 1) return 'RADICAL';
  return LEVEL_ORDER[idx + 1];
}

export function deescalateLevel(current: RadicalLevel): RadicalLevel {
  const idx = LEVEL_ORDER.indexOf(current);
  if (idx <= 0) return 'STANDARD';
  return LEVEL_ORDER[idx - 1];
}

export function isValidLevel(value: unknown): value is RadicalLevel {
  return typeof value === 'string' && LEVEL_ORDER.includes(value as RadicalLevel);
}

export function computeIntensityScore(
  level: RadicalLevel,
  budgetScore: number,
  durationSeconds: number,
): number {
  if (!Number.isFinite(budgetScore) || budgetScore < 0) budgetScore = 0;
  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) durationSeconds = 0;

  const base = LEVEL_CONFIGS[level].intensityScore;
  const budgetBonus = Math.min(budgetScore * 0.1, 50);
  const durationBonus = Math.min(durationSeconds * 0.5, 50);
  const raw = base + budgetBonus + durationBonus;
  return Math.round(Math.min(REKLAMITIN_MAX_INTENSITY_SCORE, Math.max(REKLAMITIN_MIN_INTENSITY_SCORE, raw)));
}

export function shouldEscalate(intensityScore: number, threshold = 800): boolean {
  return Number.isFinite(intensityScore) && intensityScore >= threshold;
}

export function getLevelOrdinal(level: RadicalLevel): number {
  return LEVEL_ORDER.indexOf(level);
}
