import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';
import { apiSuccess } from '@/lib/api/response';
import {
  EXTRONDEND_CONTRACT_VERSION,
  EXTRONDEND_MODULE_VERSION,
  getExtrimliExtrondendReport,
} from '@/lib/extrimli-extrondend';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getExtrimliExtrondendReport();
    const response = apiSuccess(report, 200);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-extrondend',
      contractVersion: EXTRONDEND_CONTRACT_VERSION,
      moduleVersion: EXTRONDEND_MODULE_VERSION,
      degraded: report.degraded,
      degradedSources: report.degradedSources,
    });
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/extrondend', {
      surface: 'extrimli-extrondend',
      contractVersion: EXTRONDEND_CONTRACT_VERSION,
      moduleVersion: EXTRONDEND_MODULE_VERSION,
      degradedSources: ['extrondend-report'],
      error,
    });
  }
}
