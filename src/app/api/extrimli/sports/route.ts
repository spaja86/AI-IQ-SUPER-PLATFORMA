// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/sports
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { SPORT_REGISTRY, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

export async function GET() {
  try {
    const response = apiSuccess({ sports: SPORT_REGISTRY, count: SPORT_REGISTRY.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/sports', error);
  }
}
