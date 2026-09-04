// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3 API: /api/extrimli-3/health
// Kompanija SPAJA — Digitalna Industrija

import { apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI3_CONTRACT_VERSION,
  EXTRIMLI3_MODULE_VERSION,
  getExtrimli3HealthReport,
} from '@/lib/extrimli-3';
import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  setExtrimliSurfaceHeaders(res, {
    surface: 'extrimli-3',
    contractVersion: EXTRIMLI3_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI3_MODULE_VERSION,
  });
}

export async function GET() {
  try {
    const report = getExtrimli3HealthReport();
    const response = apiSuccess(report, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli-3/health', {
      surface: 'extrimli-3',
      contractVersion: EXTRIMLI3_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI3_MODULE_VERSION,
      degradedSources: ['health-report-v3'],
      error,
    });
  }
}
