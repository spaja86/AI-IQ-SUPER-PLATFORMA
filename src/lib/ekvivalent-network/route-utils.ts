// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { EkvivalentResult } from './types';
import { EKVIVALENT_CONTRACT_VERSION, EKVIVALENT_MODULE_VERSION } from './types';

export function setEkvivalentHeaders(res: Response, result?: EkvivalentResult): void {
  res.headers.set('X-Ekvivalent-Contract-Version', EKVIVALENT_CONTRACT_VERSION);
  res.headers.set('X-Ekvivalent-Module-Version', EKVIVALENT_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Ekvivalent-Network-Score', String(result.networkScore));
    res.headers.set('X-Ekvivalent-Valid', String(result.valid));
    res.headers.set('X-Ekvivalent-Match-Count', String(result.equivalentNodes.length));
  }
}
