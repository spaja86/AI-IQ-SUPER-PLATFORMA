// SpajaUltraOmegaCore -∞Ω+∞ — AKTIVITI ALL Registry
// Kompanija SPAJA — Digitalna Industrija

import type { AktivitiAllActivity } from './types';

export interface AktivitiAllProfile {
  label: string;
  energyBias: number;
  focusBias: number;
  stressTolerance: number;
}

export const ACTIVITY_PROFILES: Record<AktivitiAllActivity, AktivitiAllProfile> = {
  FOCUS: {
    label: 'Deep Focus Work',
    energyBias: 0.30,
    focusBias: 0.50,
    stressTolerance: 0.20,
  },
  FITNESS: {
    label: 'Physical Training',
    energyBias: 0.50,
    focusBias: 0.20,
    stressTolerance: 0.30,
  },
  LEARNING: {
    label: 'Learning Session',
    energyBias: 0.25,
    focusBias: 0.55,
    stressTolerance: 0.20,
  },
  SOCIAL: {
    label: 'Social / Communication',
    energyBias: 0.30,
    focusBias: 0.25,
    stressTolerance: 0.45,
  },
  RECOVERY: {
    label: 'Recovery / Downtime',
    energyBias: 0.20,
    focusBias: 0.15,
    stressTolerance: 0.65,
  },
};

export const VALID_AKTIVITI_ALL_ACTIVITIES = Object.freeze(
  Object.keys(ACTIVITY_PROFILES) as AktivitiAllActivity[],
);
