import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';
import { apiSuccess } from '@/lib/api/response';
import {
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_MODULE_VERSION,
  getExtrimliExtrondolReport,
} from '@/lib/extrimli-extrondol';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getExtrimliExtrondolReport();
    const response = apiSuccess(report, 200);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-extrondol',
      contractVersion: EXTRONDOL_CONTRACT_VERSION,
      moduleVersion: EXTRONDOL_MODULE_VERSION,
      degraded: report.degraded,
      degradedSources: report.degradedSources,
    });
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/extrondol', {
      surface: 'extrimli-extrondol',
      contractVersion: EXTRONDOL_CONTRACT_VERSION,
      moduleVersion: EXTRONDOL_MODULE_VERSION,
      degradedSources: ['extrondol-report'],
      error,
    });
  }
}
