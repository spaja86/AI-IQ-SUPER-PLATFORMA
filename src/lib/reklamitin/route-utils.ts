// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { ReklamitiнResult } from './types';
import { REKLAMITIN_CONTRACT_VERSION, REKLAMITIN_MODULE_VERSION } from './types';

export function setReklamitiнHeaders(res: Response, result?: ReklamitiнResult): void {
  res.headers.set('X-Reklamitin-Contract-Version', REKLAMITIN_CONTRACT_VERSION);
  res.headers.set('X-Reklamitin-Module-Version', REKLAMITIN_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Reklamitin-Valid', String(result.valid));
    res.headers.set('X-Reklamitin-Level', result.level);
    res.headers.set('X-Reklamitin-Intensity', String(result.intensityScore));
  }
}
