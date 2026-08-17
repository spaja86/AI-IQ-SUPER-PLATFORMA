// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { KonvencionalniOdnosiResult } from './types';
import {
  KONVENCIONALNI_ODNOSI_CONTRACT_VERSION,
  KONVENCIONALNI_ODNOSI_MODULE_VERSION,
} from './types';

export function setKonvencionalniOdnosiHeaders(res: Response, result?: KonvencionalniOdnosiResult): void {
  res.headers.set('X-KonvencionalniOdnosi-Contract-Version', KONVENCIONALNI_ODNOSI_CONTRACT_VERSION);
  res.headers.set('X-KonvencionalniOdnosi-Module-Version', KONVENCIONALNI_ODNOSI_MODULE_VERSION);
  if (result) {
    res.headers.set('X-KonvencionalniOdnosi-Tier', result.tier);
    res.headers.set('X-KonvencionalniOdnosi-Strength', result.dominantStrength);
    res.headers.set('X-KonvencionalniOdnosi-Focus', result.focusArea);
    res.headers.set('X-KonvencionalniOdnosi-Valid', String(result.valid));
  }
}
