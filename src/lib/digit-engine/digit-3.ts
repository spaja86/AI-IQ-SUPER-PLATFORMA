// SpajaUltraOmegaCore -∞Ω+∞ — Digit 3: tri-layer
// Kompanija SPAJA — Digitalna Industrija

import type { DigitDescriptor } from './types';

export const digit3: DigitDescriptor = {
  id: 3,
  name: 'tri-layer',
  role: '3-tier quality gate: lint → test → security',
  octave: 3,
  hipermrezaNode: 3,
  linkedAgents: ['ci-bot', 'security-scanner', 'human-review'],
};
