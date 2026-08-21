// SpajaUltraOmegaCore -∞Ω+∞ — TAJMING
// Kompanija SPAJA — Digitalna Industrija

import {
  TAJMING_CONTRACT_VERSION,
  TAJMING_MODULE_VERSION,
} from './types';

export function setTajmingHeaders(res: Response): void {
  res.headers.set('X-Tajming-Contract-Version', TAJMING_CONTRACT_VERSION);
  res.headers.set('X-Tajming-Module-Version', TAJMING_MODULE_VERSION);
}
