// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { EkzistResult } from './types';
import { EKZIST_CONTRACT_VERSION, EKZIST_MODULE_VERSION } from './types';

export function setEkzistHeaders(res: Response, result?: EkzistResult): void {
  res.headers.set('X-Ekzist-Contract-Version', EKZIST_CONTRACT_VERSION);
  res.headers.set('X-Ekzist-Module-Version', EKZIST_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Ekzist-Tier', result.tier);
    res.headers.set('X-Ekzist-Domain', result.dominantVector);
    res.headers.set('X-Ekzist-Valid', String(result.valid));
  }
}
