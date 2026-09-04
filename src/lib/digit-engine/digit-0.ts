// SpajaUltraOmegaCore -∞Ω+∞ — Digit 0: zero-state
// Kompanija SPAJA — Digitalna Industrija

import type { DigitDescriptor } from './types';

export const digit0: DigitDescriptor = {
  id: 0,
  name: 'zero-state',
  role: 'System reset / null baseline / cold-start handler',
  octave: 0,
  hipermrezaNode: 0,
  linkedAgents: ['ci-bot', 'deploy-bot'],
};
