// SpajaUltraOmegaCore -∞Ω+∞ — ÐUMBIR Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { DumbirResult } from './types';
import { DUMBIR_CONTRACT_VERSION, DUMBIR_MODULE_VERSION } from './types';

export function setDumbirHeaders(res: Response, result?: DumbirResult): void {
  res.headers.set('X-Dumbir-Contract-Version', DUMBIR_CONTRACT_VERSION);
  res.headers.set('X-Dumbir-Module-Version', DUMBIR_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Dumbir-Goal', result.goal);
    res.headers.set('X-Dumbir-Status', result.status);
    res.headers.set('X-Dumbir-Valid', String(result.valid));
  }
}
