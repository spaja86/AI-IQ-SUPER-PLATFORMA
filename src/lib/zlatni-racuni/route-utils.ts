// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Route Utils
// Kompanija SPAJA — Digitalna Industrija

import { ZLATNI_CONTRACT_VERSION, ZLATNI_MODULE_VERSION } from './types';

export function setZlatniHeaders(res: Response): void {
  res.headers.set('X-Zlatni-Racuni-Contract-Version', ZLATNI_CONTRACT_VERSION);
  res.headers.set('X-Zlatni-Racuni-Module-Version', ZLATNI_MODULE_VERSION);
}
