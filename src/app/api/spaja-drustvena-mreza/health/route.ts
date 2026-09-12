import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getSpajaDrustvenaMrezaHealthReport, setSpajaDrustvenaMrezaHeaders } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getSpajaDrustvenaMrezaHealthReport();
    const response = apiSuccess(report, 200);
    setSpajaDrustvenaMrezaHeaders(response, report.readinessStatus);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/health', error);
  }
}
