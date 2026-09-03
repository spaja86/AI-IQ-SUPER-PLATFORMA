import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';
import { apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_EXTENDOL_CONTRACT_VERSION,
  EXTRIMLI_EXTENDOL_MODULE_VERSION,
  getExtrimliExtendolReport,
} from '@/lib/extrimli-extendol';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getExtrimliExtendolReport();
    const response = apiSuccess(report, 200);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-extendol',
      contractVersion: EXTRIMLI_EXTENDOL_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_EXTENDOL_MODULE_VERSION,
      degraded: report.degraded,
      degradedSources: report.degradedSources,
    });
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/extendol', {
      surface: 'extrimli-extendol',
      contractVersion: EXTRIMLI_EXTENDOL_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_EXTENDOL_MODULE_VERSION,
      degradedSources: ['extendol-report'],
      error,
    });
  }
}
