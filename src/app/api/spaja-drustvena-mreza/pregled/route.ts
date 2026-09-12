import { apiSuccess } from '@/lib/api/response';
import {
  getSpajaDrustvenaMrezaPregled,
  spajaDrustvenaMrezaApiInternalError,
  withSpajaDrustvenaMrezaHeaders,
} from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pregled = getSpajaDrustvenaMrezaPregled();
    return withSpajaDrustvenaMrezaHeaders(apiSuccess(pregled, 200), pregled.readinessStatus);
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/pregled', error);
  }
}
