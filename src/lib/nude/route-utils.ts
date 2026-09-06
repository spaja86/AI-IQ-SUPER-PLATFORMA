// SpajaUltraOmegaCore -∞Ω+∞ — NUDE Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { NudeResult } from './types';
import { NUDE_CONTRACT_VERSION, NUDE_MODULE_VERSION } from './types';

export function setNudeHeaders(res: Response, result?: NudeResult): void {
  res.headers.set('X-Nude-Contract-Version', NUDE_CONTRACT_VERSION);
  res.headers.set('X-Nude-Module-Version', NUDE_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Nude-Mode', result.mode);
    res.headers.set('X-Nude-Status', result.status);
    res.headers.set('X-Nude-Valid', String(result.valid));
  }
}
