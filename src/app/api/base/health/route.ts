import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getBaseHealthReport, setBaseHeaders } from '@/lib/base';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getBaseHealthReport();
    const response = apiSuccess(report, 200);
    setBaseHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('base/health', error);
  }
}
