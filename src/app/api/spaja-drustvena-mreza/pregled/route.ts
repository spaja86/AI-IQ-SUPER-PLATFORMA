import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getSpajaDrustvenaMrezaPregled, setSpajaDrustvenaMrezaHeaders } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pregled = getSpajaDrustvenaMrezaPregled();
    const response = apiSuccess(pregled, 200);
    setSpajaDrustvenaMrezaHeaders(response, pregled.readinessStatus);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/pregled', error);
  }
}
