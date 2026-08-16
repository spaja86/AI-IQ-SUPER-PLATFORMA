// SpajaUltraOmegaCore -∞Ω+∞ — DNEVNA SVETLOST Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { DnevnaSvetlostResult } from './types';
import { DNEVNA_SVETLOST_CONTRACT_VERSION, DNEVNA_SVETLOST_MODULE_VERSION } from './types';

export function setDnevnaSvetlostHeaders(res: Response, result?: DnevnaSvetlostResult): void {
  res.headers.set('X-Dnevna-Svetlost-Contract-Version', DNEVNA_SVETLOST_CONTRACT_VERSION);
  res.headers.set('X-Dnevna-Svetlost-Module-Version', DNEVNA_SVETLOST_MODULE_VERSION);
  if (result) {
    res.headers.set('X-Dnevna-Svetlost-Mode', result.mode);
    res.headers.set('X-Dnevna-Svetlost-Status', result.status);
    res.headers.set('X-Dnevna-Svetlost-Valid', String(result.valid));
  }
}
