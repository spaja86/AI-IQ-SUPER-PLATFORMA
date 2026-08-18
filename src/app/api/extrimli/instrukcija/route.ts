// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/instrukcija
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_MODULE_VERSION,
  getInstrukcija,
  listInstrukcije,
} from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get('module');

    if (moduleId !== null) {
      const entry = getInstrukcija(moduleId);
      if (!entry) {
        return apiError('NOT_FOUND', `No instrukcija found for module: ${moduleId}`, 404);
      }
      const response = apiSuccess(entry, 200);
      setHeaders(response);
      return response;
    }

    const response = apiSuccess(listInstrukcije(), 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/instrukcija', error);
  }
}
