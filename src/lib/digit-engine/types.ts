// SpajaUltraOmegaCore -∞Ω+∞ — Digit Intelligence Engine
// Kompanija SPAJA — Digitalna Industrija

/** A single digit in range 0–9 */
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Descriptor for each digit's symbolic layer */
export interface DigitDescriptor {
  /** Numeric digit value (0–9) */
  id: Digit;
  /** Symbolic layer name */
  name: string;
  /** Human-readable role description */
  role: string;
  /** Hipermreza octave */
  octave: number;
  /** SpajaPro 16 Hipermreza node (1–256) */
  hipermrezaNode: number;
  /** Agent IDs linked to this digit layer */
  linkedAgents: string[];
}

export const DIGIT_ENGINE_CONTRACT_VERSION = 'v1';
export const DIGIT_ENGINE_MODULE_VERSION = '1.0.0';
export const DIGIT_ENGINE_PERSONA_ID = 'digit-engine-core';
export const DIGIT_ENGINE_PERFORMANCE_MAX_MS = 50;
export const DIGIT_ENGINE_API_RESPONSE_MAX_MS = 200;
