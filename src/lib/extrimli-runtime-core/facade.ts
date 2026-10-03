import { getExtrimliExtremProfilerReport } from '../extrimli-extrem';
import { getExtrimliExtrondolReport, getExtrimliSpajaKodReport } from '../extrimli-extrondol';
import { evaluateExtrimliExtremRuntimeCore } from './extrem-adapter';
import { evaluateExtrimliExtrondolRuntimeCore } from './extrondol-adapter';
import { evaluateExtrimliSpajaKodRuntimeCore } from './spaja-kod-adapter';
import { evaluateExtrimliRuntimeCore, type ExtrimliRuntimeCoreResult } from './index';

export interface ExtrimliRuntimeCoreFacade {
  extrem: ExtrimliRuntimeCoreResult;
  extrondol: ExtrimliRuntimeCoreResult;
  spajaKod: ExtrimliRuntimeCoreResult;
  unified: ExtrimliRuntimeCoreResult;
}

/**
 * Read-only migration facade for comparing all three existing EXTRIMLI surfaces.
 * It does not replace or modify any public route.
 */
export function getExtrimliRuntimeCoreFacade(): ExtrimliRuntimeCoreFacade {
  const extrem = evaluateExtrimliExtremRuntimeCore(getExtrimliExtremProfilerReport());
  const extrondol = evaluateExtrimliExtrondolRuntimeCore(getExtrimliExtrondolReport());
  const spajaKod = evaluateExtrimliSpajaKodRuntimeCore(getExtrimliSpajaKodReport());

  const unified = evaluateExtrimliRuntimeCore({
    technical: [extrem.readiness.status, extrondol.readiness.status, spajaKod.readiness.status],
    governance: [extrem.governance.status, extrondol.governance.status, spajaKod.governance.status],
  });



  return { extrem, extrondol, spajaKod, unified };
}
