// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/crews/[id]
// Kompanija SPAJA — Digitalna Industrija

import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getCrew, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-ExtrimliCuz-Contract-Version', CUZ_CONTRACT_VERSION);
  res.headers.set('X-ExtrimliCuz-Module-Version', CUZ_MODULE_VERSION);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const crew = getCrew(id);
    if (!crew) {
      return apiError('NOT_FOUND', `crew not found: ${id}`, 404);
    }
    const response = apiSuccess(crew, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/crews/[id] GET', error);
  }
}
