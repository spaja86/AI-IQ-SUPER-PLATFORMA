// SpajaUltraOmegaCore -∞Ω+∞ — ASTRONOMIK MONEY: Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { AstronomikResult } from './types';
import { ASTRONOMIK_CONTRACT_VERSION, ASTRONOMIK_MODULE_VERSION } from './types';

export function setAstronomikHeaders(res: Response, result?: AstronomikResult): void {
  res.headers.set('X-Astronomik-Contract-Version', ASTRONOMIK_CONTRACT_VERSION);
  res.headers.set('X-Astronomik-Module-Version', ASTRONOMIK_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Astronomik-Tier', result.tier);
    res.headers.set('X-Astronomik-Valid', String(result.valid));
  }
}
