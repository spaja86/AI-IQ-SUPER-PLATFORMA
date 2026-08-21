// SpajaUltraOmegaCore -∞Ω+∞ — SWIMING
// Kompanija SPAJA — Digitalna Industrija

import type { SwimingFitnessLevel, SwimingIntensity, SwimingStrokeType } from './types';

/** MET (Metabolic Equivalent of Task) values per stroke */
export const STROKE_MET: Record<SwimingStrokeType, number> = {
  freestyle:    8.0,
  backstroke:   6.0,
  breaststroke: 7.0,
  butterfly:   10.0,
  medley:       8.5,
};

export const STROKE_LABELS: Record<SwimingStrokeType, string> = {
  freestyle:    'Freestyle (Crawl)',
  backstroke:   'Backstroke',
  breaststroke: 'Breaststroke',
  butterfly:    'Butterfly',
  medley:       'Individual Medley',
};

export const VALID_STROKES = Object.keys(STROKE_MET) as SwimingStrokeType[];

/** Readiness base score per fitness level */
export const FITNESS_BASE_SCORE: Record<SwimingFitnessLevel, number> = {
  BEGINNER:     40,
  INTERMEDIATE: 65,
  ADVANCED:     85,
};

/** Recommended intensity per fitness level & readiness band */
export const INTENSITY_MAP: Record<SwimingFitnessLevel, Record<string, SwimingIntensity>> = {
  BEGINNER:     { high: 'AEROBIC',    mid: 'RECOVERY',  low: 'RECOVERY'   },
  INTERMEDIATE: { high: 'THRESHOLD', mid: 'AEROBIC',   low: 'RECOVERY'   },
  ADVANCED:     { high: 'SPRINT',    mid: 'THRESHOLD', low: 'AEROBIC'    },
};

export const VALID_FITNESS_LEVELS: SwimingFitnessLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
