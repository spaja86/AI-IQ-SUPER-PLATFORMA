// SpajaUltraOmegaCore -∞Ω+∞ — EPRINCIP API: /api/eprincip/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getEPrincipHealthReport,
  EPRINCIP_CONTRACT_VERSION,
  EPRINCIP_MODULE_VERSION,
} from '@/lib/eprincip';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Eprincip-Contract-Version', EPRINCIP_CONTRACT_VERSION);
  res.headers.set('X-Eprincip-Module-Version', EPRINCIP_MODULE_VERSION);
}

export async function GET() {
  try {
    const response = apiSuccess(getEPrincipHealthReport(), 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('eprincip/health', error);
  }
}
