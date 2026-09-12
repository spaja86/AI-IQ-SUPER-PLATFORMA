import { apiSuccess } from '@/lib/api/response';
import {
  getSpajaDrustvenaMrezaHealthReport,
  spajaDrustvenaMrezaApiInternalError,
  withSpajaDrustvenaMrezaHeaders,
} from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getSpajaDrustvenaMrezaHealthReport();
    return withSpajaDrustvenaMrezaHeaders(apiSuccess(report, 200), report.readinessStatus);
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/health', error);
  }
}
