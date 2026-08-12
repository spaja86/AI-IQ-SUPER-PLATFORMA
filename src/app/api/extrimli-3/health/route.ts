// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3 API: /api/extrimli-3/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI3_CONTRACT_VERSION,
  EXTRIMLI3_MODULE_VERSION,
  getExtrimli3HealthReport,
} from '@/lib/extrimli-3';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli3-Contract-Version', EXTRIMLI3_CONTRACT_VERSION);
  res.headers.set('X-Extrimli3-Module-Version', EXTRIMLI3_MODULE_VERSION);
}

export async function GET() {
  try {
    const report = getExtrimli3HealthReport();
    const response = apiSuccess(report, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-3/health', error);
  }
}
