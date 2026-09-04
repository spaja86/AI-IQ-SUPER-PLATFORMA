import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getRepozitHealthReport, setRepozitHeaders } from '@/lib/repozit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getRepozitHealthReport();
    const response = apiSuccess(report, 200);
    setRepozitHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('repozit/health', error);
  }
}
