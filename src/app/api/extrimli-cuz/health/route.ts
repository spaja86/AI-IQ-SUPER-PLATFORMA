// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/health
// Kompanija SPAJA — Digitalna Industrija

import { apiSuccess } from '@/lib/api/response';
import { getCuzHealthReport, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';
import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  setExtrimliSurfaceHeaders(res, {
    surface: 'extrimli-cuz',
    contractVersion: CUZ_CONTRACT_VERSION,
    moduleVersion: CUZ_MODULE_VERSION,
  });
}

export async function GET() {
  try {
    const report = getCuzHealthReport();
    const response = apiSuccess(report, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli-cuz/health', {
      surface: 'extrimli-cuz',
      contractVersion: CUZ_CONTRACT_VERSION,
      moduleVersion: CUZ_MODULE_VERSION,
      degradedSources: ['health-report-cuz'],
      error,
    });
  }
}
