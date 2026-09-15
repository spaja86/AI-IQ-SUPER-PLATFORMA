import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';
import { apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_SPAJA_KOD_CONTRACT_VERSION,
  EXTRIMLI_SPAJA_KOD_MODULE_VERSION,
  getExtrimliSpajaKodReport,
} from '@/lib/extrimli-extrondol';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getExtrimliSpajaKodReport();
    const response = apiSuccess(report, 200);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-spaja-kod',
      contractVersion: EXTRIMLI_SPAJA_KOD_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_SPAJA_KOD_MODULE_VERSION,
      degraded: report.publicSignals.degraded,
      degradedSources: report.blockers,
    });
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/spaja-kod', {
      surface: 'extrimli-spaja-kod',
      contractVersion: EXTRIMLI_SPAJA_KOD_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_SPAJA_KOD_MODULE_VERSION,
      degradedSources: ['spaja-kod-facade'],
      error,
    });
  }
}
