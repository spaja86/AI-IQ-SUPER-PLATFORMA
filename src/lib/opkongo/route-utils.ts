// SpajaUltraOmegaCore -∞Ω+∞ — OPKONGO Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { OpkongoResult } from './types';
import { OPKONGO_CONTRACT_VERSION, OPKONGO_MODULE_VERSION } from './types';

export function setOpkongoHeaders(res: Response, result?: OpkongoResult): void {
  res.headers.set('X-Opkongo-Contract-Version', OPKONGO_CONTRACT_VERSION);
  res.headers.set('X-Opkongo-Module-Version', OPKONGO_MODULE_VERSION);
  if (result) {
    if (result.objective) res.headers.set('X-Opkongo-Objective', result.objective);
    if (result.channel) res.headers.set('X-Opkongo-Channel', result.channel);
    if (result.relationshipTemperature) {
      res.headers.set('X-Opkongo-Relationship-Temperature', result.relationshipTemperature);
    }
    res.headers.set('X-Opkongo-Status', result.status);
    res.headers.set('X-Opkongo-Action', result.recommendedAction);
    res.headers.set('X-Opkongo-Valid', String(result.valid));
  }
}
