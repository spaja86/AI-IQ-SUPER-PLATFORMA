// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { AdutivResult } from './types';
import { ADUTIV_CONTRACT_VERSION, ADUTIV_MODULE_VERSION } from './types';

export function setAdutivHeaders(res: Response, result?: AdutivResult): void {
  res.headers.set('X-Adutiv-Contract-Version', ADUTIV_CONTRACT_VERSION);
  res.headers.set('X-Adutiv-Module-Version', ADUTIV_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Adutiv-Tier', result.tier);
    res.headers.set('X-Adutiv-Apex', result.apexAdut);
    res.headers.set('X-Adutiv-Valid', String(result.valid));
  }
}
