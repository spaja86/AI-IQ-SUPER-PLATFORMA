import type { ExtrimliSpajaKodPublicFacade } from '../extrimli-extrondol/types';
import { evaluateExtrimliRuntimeCore, type ExtrimliRuntimeCoreResult } from './index';

/**
 * Compatibility adapter for the public SPAJA KOD facade.
 * It consumes only public readiness and promotion-freeze signals.
 */
export function evaluateExtrimliSpajaKodRuntimeCore(
  facade: ExtrimliSpajaKodPublicFacade,
): ExtrimliRuntimeCoreResult {
  const systemStatus = facade.publicSignals.systemStatus === 'STABLE'
    ? 'READY'
    : facade.publicSignals.systemStatus === 'ATTENTION'
      ? 'WATCH'
      : 'BLOCKED';

  return evaluateExtrimliRuntimeCore({
    technical: [facade.readiness.status, systemStatus],
    governance: [
      facade.readiness.promotionFreeze ? 'BLOCKED' : 'READY',
      facade.completeness.exportReady ? 'READY' : 'WATCH',
    ],
  });
}
