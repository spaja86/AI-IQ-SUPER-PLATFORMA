// SpajaUltraOmegaCore -∞Ω+∞ — TAJMING
// Kompanija SPAJA — Digitalna Industrija

import type { TajmingActivity } from './types';

/**
 * Peak circadian windows per activity type (hour ranges 0–23, inclusive).
 * Based on general human circadian rhythm research.
 */
export const ACTIVITY_PEAK_WINDOWS: Record<TajmingActivity, { start: number; end: number; label: string }> = {
  physical:       { start: 15, end: 19, label: '15:00–19:00' },
  cognitive:      { start:  9, end: 12, label: '09:00–12:00' },
  creative:       { start: 10, end: 14, label: '10:00–14:00' },
  social:         { start: 11, end: 20, label: '11:00–20:00' },
  administrative: { start:  8, end: 11, label: '08:00–11:00' },
};

export const ACTIVITY_LABELS: Record<TajmingActivity, string> = {
  physical:       'Physical / Sport',
  cognitive:      'Cognitive / Deep Work',
  creative:       'Creative / Artistic',
  social:         'Social / Communication',
  administrative: 'Administrative / Routine',
};

export const VALID_ACTIVITIES = Object.keys(ACTIVITY_PEAK_WINDOWS) as TajmingActivity[];
