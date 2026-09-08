// SpajaUltraOmegaCore -∞Ω+∞ — GEOGRAFIJA REALNA Route Utils
// Kompanija SPAJA — Digitalna Industrija

import type { GeografijaRealnaResult } from './types';
import {
  GEOGRAFIJA_REALNA_CONTRACT_VERSION,
  GEOGRAFIJA_REALNA_MODULE_VERSION,
} from './types';

export function setGeografijaRealnaHeaders(
  res: Response,
  result?: GeografijaRealnaResult,
): void {
  res.headers.set(
    'X-Geografija-Realna-Contract-Version',
    GEOGRAFIJA_REALNA_CONTRACT_VERSION,
  );
  res.headers.set(
    'X-Geografija-Realna-Module-Version',
    GEOGRAFIJA_REALNA_MODULE_VERSION,
  );

  if (result) {
    if (result.objective)
      res.headers.set('X-Geografija-Realna-Objective', result.objective);
    if (result.regionScale)
      res.headers.set('X-Geografija-Realna-Region-Scale', result.regionScale);
    if (result.terrainComplexity)
      res.headers.set(
        'X-Geografija-Realna-Terrain-Complexity',
        result.terrainComplexity,
      );
    res.headers.set('X-Geografija-Realna-Status', result.status);
    res.headers.set('X-Geografija-Realna-Action', result.recommendedAction);
    res.headers.set('X-Geografija-Realna-Valid', String(result.valid));
  }
}
