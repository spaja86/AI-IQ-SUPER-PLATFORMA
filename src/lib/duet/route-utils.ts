// SpajaUltraOmegaCore -∞Ω+∞ — DUET Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { DuetResult } from './types';
import { DUET_CONTRACT_VERSION, DUET_MODULE_VERSION } from './types';

export function setDuetHeaders(res: Response, result?: DuetResult): void {
  res.headers.set('X-Duet-Contract-Version', DUET_CONTRACT_VERSION);
  res.headers.set('X-Duet-Module-Version', DUET_MODULE_VERSION);
  if (result) {
    if (result.objective) res.headers.set('X-Duet-Objective', result.objective);
    if (result.mode) res.headers.set('X-Duet-Mode', result.mode);
    if (result.energyMatch) res.headers.set('X-Duet-Energy-Match', result.energyMatch);
    res.headers.set('X-Duet-Status', result.status);
    res.headers.set('X-Duet-Action', result.recommendedAction);
    res.headers.set('X-Duet-Valid', String(result.valid));
  }
}
