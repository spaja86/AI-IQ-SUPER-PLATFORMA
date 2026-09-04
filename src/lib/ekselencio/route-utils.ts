// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { EkselencioResult } from './types';
import { EKSELENCIO_CONTRACT_VERSION, EKSELENCIO_MODULE_VERSION } from './types';

export function setEkselencioHeaders(res: Response, result?: EkselencioResult): void {
  res.headers.set('X-Ekselencio-Contract-Version', EKSELENCIO_CONTRACT_VERSION);
  res.headers.set('X-Ekselencio-Module-Version', EKSELENCIO_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Ekselencio-Tier', result.tier);
    res.headers.set('X-Ekselencio-Score', String(result.ekuareRaScore));
    res.headers.set('X-Ekselencio-Valid', String(result.valid));
  }
}
