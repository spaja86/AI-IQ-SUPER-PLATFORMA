// SpajaUltraOmegaCore -∞Ω+∞ — TRENAZER API: /api/trenazer/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getTrenazerHealthReport,
  TRENAZER_CONTRACT_VERSION,
  TRENAZER_MODULE_VERSION,
} from '@/lib/trenazer';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Trenazer-Contract-Version', TRENAZER_CONTRACT_VERSION);
  res.headers.set('X-Trenazer-Module-Version', TRENAZER_MODULE_VERSION);
}

export async function GET() {
  try {
    const report = getTrenazerHealthReport();
    const response = apiSuccess(report, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('trenazer/health', error);
  }
}
