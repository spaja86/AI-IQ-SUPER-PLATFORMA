// SpajaUltraOmegaCore -∞Ω+∞ — PILOTRELAX Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { PilotrelaxResult } from './types';
import { PILOTRELAX_CONTRACT_VERSION, PILOTRELAX_MODULE_VERSION } from './types';

export function setPilotrelaxHeaders(res: Response, result?: PilotrelaxResult): void {
  res.headers.set('X-Pilotrelax-Contract-Version', PILOTRELAX_CONTRACT_VERSION);
  res.headers.set('X-Pilotrelax-Module-Version', PILOTRELAX_MODULE_VERSION);
  if (result) {
    if (result.objective) res.headers.set('X-Pilotrelax-Objective', result.objective);
    if (result.environment) res.headers.set('X-Pilotrelax-Environment', result.environment);
    if (result.phaseOfDay) res.headers.set('X-Pilotrelax-Phase', result.phaseOfDay);
    res.headers.set('X-Pilotrelax-Status', result.status);
    res.headers.set('X-Pilotrelax-Protocol', result.recommendedProtocol);
    res.headers.set('X-Pilotrelax-Valid', String(result.valid));
  }
}
