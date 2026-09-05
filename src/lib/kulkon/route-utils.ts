// SpajaUltraOmegaCore -∞Ω+∞ — KULKON Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { KulkonResult } from './types';
import { KULKON_CONTRACT_VERSION, KULKON_MODULE_VERSION } from './types';

export function setKulkonHeaders(res: Response, result?: KulkonResult): void {
  res.headers.set('X-Kulkon-Contract-Version', KULKON_CONTRACT_VERSION);
  res.headers.set('X-Kulkon-Module-Version', KULKON_MODULE_VERSION);
  if (result) {
    if (result.objective) res.headers.set('X-Kulkon-Objective', result.objective);
    if (result.environment) res.headers.set('X-Kulkon-Environment', result.environment);
    if (result.rhythm) res.headers.set('X-Kulkon-Rhythm', result.rhythm);
    res.headers.set('X-Kulkon-Status', result.status);
    res.headers.set('X-Kulkon-Action', result.recommendedAction);
    res.headers.set('X-Kulkon-Valid', String(result.valid));
  }
}
