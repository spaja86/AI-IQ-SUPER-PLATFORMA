import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';
import { apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_KORON_CONTRACT_VERSION,
  EXTRIMLI_KORON_MODULE_VERSION,
  getExtrimliKoronHealthReport,
} from '@/lib/extrimli-koron';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getExtrimliKoronHealthReport();
    const response = apiSuccess(report, 200);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-koron',
      contractVersion: EXTRIMLI_KORON_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_KORON_MODULE_VERSION,
      degraded: report.degraded,
      degradedSources: report.degradedSources,
    });
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/koron', {
      surface: 'extrimli-koron',
      contractVersion: EXTRIMLI_KORON_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_KORON_MODULE_VERSION,
      degradedSources: ['koron-report'],
      error,
    });
  }
}
