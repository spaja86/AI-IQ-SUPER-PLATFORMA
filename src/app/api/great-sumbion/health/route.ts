// SpajaUltraOmegaCore -∞Ω+∞ — GREAT SUMBION API: /api/great-sumbion/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getGreatSumbionHealthReport,
  GREAT_SUMBION_CONTRACT_VERSION,
  GREAT_SUMBION_MODULE_VERSION,
} from '@/lib/great-sumbion';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-GreatSumbion-Contract-Version', GREAT_SUMBION_CONTRACT_VERSION);
  res.headers.set('X-GreatSumbion-Module-Version', GREAT_SUMBION_MODULE_VERSION);
}

export async function GET() {
  try {
    const report = getGreatSumbionHealthReport();
    const response = apiSuccess(report, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('great-sumbion/health', error);
  }
}
