// SpajaUltraOmegaCore -∞Ω+∞ — DELET Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { DeletResult } from './types';
import { DELET_CONTRACT_VERSION, DELET_MODULE_VERSION } from './types';

export function setDeletHeaders(res: Response, result?: DeletResult): void {
  res.headers.set('X-Delet-Contract-Version', DELET_CONTRACT_VERSION);
  res.headers.set('X-Delet-Module-Version', DELET_MODULE_VERSION);

  if (result) {
    res.headers.set('X-Delet-Valid', String(result.valid));
    if (!result.valid) return;
    if (result.objective) res.headers.set('X-Delet-Objective', result.objective);
    if (result.scope) res.headers.set('X-Delet-Scope', result.scope);
    if (result.status) res.headers.set('X-Delet-Status', result.status);
    if (result.recommendedAction) res.headers.set('X-Delet-Action', result.recommendedAction);
  }
}
