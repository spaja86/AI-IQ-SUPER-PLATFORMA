// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/reputation/[athleteId]
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getReputationScore, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-ExtrimliCuz-Contract-Version', CUZ_CONTRACT_VERSION);
  res.headers.set('X-ExtrimliCuz-Module-Version', CUZ_MODULE_VERSION);
}

export async function GET(
  _req: Request,
  { params }: { params: { athleteId: string } }
) {
  try {
    const score = getReputationScore(params.athleteId);
    const response = apiSuccess(score, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/reputation/[athleteId] GET', error);
  }
}
