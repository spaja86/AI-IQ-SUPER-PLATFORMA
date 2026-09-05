// SpajaUltraOmegaCore -∞Ω+∞ — DIGITRON Registry
// Kompanija SPAJA — Digitalna Industrija

import type { DigitronDescriptor, DigitronDigit, DigitronMode } from './types';

export const VALID_DIGITRON_MODES: DigitronMode[] = ['LEGACY', 'NATIVE', 'HYBRID'];

export const DIGITRON_MODE_BASE_BOOST: Record<DigitronMode, number> = {
  LEGACY: -6,
  NATIVE: 6,
  HYBRID: 2,
};

export const DIGITRON_REGISTRY: Readonly<Record<DigitronDigit, DigitronDescriptor>> = {
  0: {
    id: 0,
    name: 'zero-anchor',
    legacyName: 'zero-state',
    role: 'System reset and safe fallback anchor.',
    octave: 1,
    hipermrezaNode: 8,
    linkedAgents: ['multi-repo-sync-agent'],
  },
  1: {
    id: 1,
    name: 'prime-init',
    legacyName: 'prima-init',
    role: 'Initial activation and bootstrap signal.',
    octave: 2,
    hipermrezaNode: 16,
    linkedAgents: ['ci-bot'],
  },
  2: {
    id: 2,
    name: 'dual-bridge',
    legacyName: 'dual-sync',
    role: 'Dual-state compatibility bridge between legacy and native tracks.',
    octave: 3,
    hipermrezaNode: 24,
    linkedAgents: ['multi-repo-sync-agent', 'digit-engine-validator-agent'],
  },
  3: {
    id: 3,
    name: 'tri-verify',
    legacyName: 'tri-validator',
    role: 'Tri-level validation and confidence convergence.',
    octave: 4,
    hipermrezaNode: 32,
    linkedAgents: ['security-scanner', 'human-review'],
  },
  4: {
    id: 4,
    name: 'quad-steady',
    legacyName: 'quad-balance',
    role: 'Load balancing and stable execution lane.',
    octave: 5,
    hipermrezaNode: 40,
    linkedAgents: ['analytics-bot', 'ci-bot'],
  },
  5: {
    id: 5,
    name: 'penta-flow',
    legacyName: 'penta-flow',
    role: 'Medium-intensity throughput orchestration.',
    octave: 6,
    hipermrezaNode: 48,
    linkedAgents: ['deploy-bot', 'analytics-bot'],
  },
  6: {
    id: 6,
    name: 'hexa-guard',
    legacyName: 'hexa-validator',
    role: 'Guarded scaling with validation-first policy.',
    octave: 7,
    hipermrezaNode: 56,
    linkedAgents: ['security-scanner', 'ci-bot', 'human-review'],
  },
  7: {
    id: 7,
    name: 'septa-stride',
    legacyName: 'septa-octave',
    role: 'Advanced pace and orchestration stride.',
    octave: 8,
    hipermrezaNode: 64,
    linkedAgents: ['multi-repo-sync-agent', 'analytics-bot'],
  },
  8: {
    id: 8,
    name: 'octa-mesh',
    legacyName: 'octa-grid',
    role: 'Wide mesh synchronization for cross-module consumers.',
    octave: 9,
    hipermrezaNode: 72,
    linkedAgents: ['multi-repo-sync-agent', 'persona-bank-agent'],
  },
  9: {
    id: 9,
    name: 'nona-apex',
    legacyName: 'nona-sumbion',
    role: 'Apex symbolic readiness for native digitron execution.',
    octave: 10,
    hipermrezaNode: 81,
    linkedAgents: ['digitron-validator-agent', 'persona-bank-agent', 'multi-repo-sync-agent'],
  },
};

export function getDigitronDescriptor(digit: number): DigitronDescriptor | undefined {
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) return undefined;
  return DIGITRON_REGISTRY[digit as DigitronDigit];
}

export function listDigitronDescriptors(): DigitronDescriptor[] {
  return (Object.keys(DIGITRON_REGISTRY) as unknown as DigitronDigit[])
    .map(Number)
    .sort((a, b) => a - b)
    .map((digit) => DIGITRON_REGISTRY[digit as DigitronDigit]);
}
