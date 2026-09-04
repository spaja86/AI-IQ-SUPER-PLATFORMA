// SpajaUltraOmegaCore -∞Ω+∞ — AKTIVITI ALL Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { AktivitiAllResult } from './types';
import { AKTIVITI_ALL_CONTRACT_VERSION, AKTIVITI_ALL_MODULE_VERSION } from './types';

export function setAktivitiAllHeaders(res: Response, result?: AktivitiAllResult): void {
  res.headers.set('X-Aktiviti-All-Contract-Version', AKTIVITI_ALL_CONTRACT_VERSION);
  res.headers.set('X-Aktiviti-All-Module-Version', AKTIVITI_ALL_MODULE_VERSION);
  if (result) {
    if (result.activity) res.headers.set('X-Aktiviti-All-Activity', result.activity);
    res.headers.set('X-Aktiviti-All-Status', result.status);
    res.headers.set('X-Aktiviti-All-Valid', String(result.valid));
  }
}
