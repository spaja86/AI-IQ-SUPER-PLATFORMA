// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/health
// Kompanija SPAJA — Digitalna Industrija

import { apiSuccess } from '@/lib/api/response';
import { getExtrimliHealthReport, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';
import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  setExtrimliSurfaceHeaders(res, {
    surface: 'extrimli',
    contractVersion: EXTRIMLI_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_MODULE_VERSION,
  });
}

export async function GET() {
  try {
    const report   = getExtrimliHealthReport();
    const response = apiSuccess(report, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/health', {
      surface: 'extrimli',
      contractVersion: EXTRIMLI_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_MODULE_VERSION,
      degradedSources: ['health-report'],
      error,
    });
  }
}
