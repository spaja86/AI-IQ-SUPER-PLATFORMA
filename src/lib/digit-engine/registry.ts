// SpajaUltraOmegaCore -∞Ω+∞ — Digit Intelligence Engine Registry
// Kompanija SPAJA — Digitalna Industrija

import type { Digit, DigitDescriptor } from './types';
import { digit0 } from './digit-0';
import { digit1 } from './digit-1';
import { digit2 } from './digit-2';
import { digit3 } from './digit-3';
import { digit4 } from './digit-4';
import { digit5 } from './digit-5';
import { digit6 } from './digit-6';
import { digit7 } from './digit-7';
import { digit8 } from './digit-8';
import { digit9 } from './digit-9';

/** Map of digit (0–9) to its symbolic descriptor */
export const DIGIT_REGISTRY: Readonly<Record<Digit, DigitDescriptor>> = {
  0: digit0,
  1: digit1,
  2: digit2,
  3: digit3,
  4: digit4,
  5: digit5,
  6: digit6,
  7: digit7,
  8: digit8,
  9: digit9,
};

/**
 * Look up a digit descriptor by numeric digit key.
 * Returns undefined if the digit is out of range.
 */
export function getDigitDescriptor(digit: number): DigitDescriptor | undefined {
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) return undefined;
  return DIGIT_REGISTRY[digit as Digit];
}

/**
 * Look up a digit descriptor by hipermreza node number.
 * Returns undefined if no digit maps to that node.
 */
export function getDigitByNode(node: number): DigitDescriptor | undefined {
  return Object.values(DIGIT_REGISTRY).find((d) => d.hipermrezaNode === node);
}

/** Return all digit descriptors as an ordered array (0–9). */
export function listAllDigits(): DigitDescriptor[] {
  return (Object.keys(DIGIT_REGISTRY) as unknown as Digit[])
    .map(Number)
    .sort((a, b) => a - b)
    .map((d) => DIGIT_REGISTRY[d as Digit]);
}
