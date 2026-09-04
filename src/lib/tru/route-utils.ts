// SpajaUltraOmegaCore -∞Ω+∞ — TRU Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { TruResult } from './types';
import { TRU_CONTRACT_VERSION, TRU_MODULE_VERSION } from './types';

export function setTruHeaders(res: Response, result?: TruResult): void {
  res.headers.set('X-Tru-Contract-Version', TRU_CONTRACT_VERSION);
  res.headers.set('X-Tru-Module-Version', TRU_MODULE_VERSION);

  if (result) {
    res.headers.set('X-Tru-Valid', String(result.valid));
    if (!result.valid) return;
    if (result.objective) res.headers.set('X-Tru-Objective', result.objective);
    if (result.channel) res.headers.set('X-Tru-Channel', result.channel);
    if (result.evidenceLevel) res.headers.set('X-Tru-Evidence-Level', result.evidenceLevel);
    if (result.status) res.headers.set('X-Tru-Status', result.status);
    if (result.recommendedAction) res.headers.set('X-Tru-Action', result.recommendedAction);
  }
}
