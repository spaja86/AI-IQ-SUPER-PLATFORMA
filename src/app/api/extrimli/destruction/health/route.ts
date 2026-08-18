// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/destruction/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
  getExtrimliDestructionHealthReport,
} from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Contract-Version', EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Module-Version', EXTRIMLI_DESTRUKCIJA_MODULE_VERSION);
}

export async function GET() {
  try {
    const response = apiSuccess(getExtrimliDestructionHealthReport(), 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/destruction/health', error);
  }
}
