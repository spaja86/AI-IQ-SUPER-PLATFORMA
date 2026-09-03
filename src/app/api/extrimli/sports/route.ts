// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/sports
// Kompanija SPAJA — Digitalna Industrija

import { apiSuccess } from '@/lib/api/response';
import { SPORT_REGISTRY, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';
import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  setExtrimliSurfaceHeaders(res, {
    surface: 'extrimli',
    contractVersion: EXTRIMLI_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_MODULE_VERSION,
  });
}

export async function GET() {
  try {
    const response = apiSuccess({ sports: SPORT_REGISTRY, count: SPORT_REGISTRY.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/sports', {
      surface: 'extrimli',
      contractVersion: EXTRIMLI_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_MODULE_VERSION,
      degradedSources: ['sports-registry'],
      error,
    });
  }
}
