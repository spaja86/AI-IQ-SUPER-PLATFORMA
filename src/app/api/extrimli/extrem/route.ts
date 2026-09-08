import { apiExtrimliDegradedResponse, setExtrimliSurfaceHeaders } from '@/app/api/extrimli/_shared';
import { apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  getExtrimliExtremProfilerReport,
} from '@/lib/extrimli-extrem';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getExtrimliExtremProfilerReport();
    const response = apiSuccess(report, 200);
    setExtrimliSurfaceHeaders(response, {
      surface: 'extrimli-extrem',
      contractVersion: EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
      degraded: report.degraded,
      degradedSources: report.degradedSources,
    });
    return response;
  } catch (error) {
    return apiExtrimliDegradedResponse('extrimli/extrem', {
      surface: 'extrimli-extrem',
      contractVersion: EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
      moduleVersion: EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
      degradedSources: ['extrem-profiler-report'],
      error,
    });
  }
}
