import { apiSuccess } from '@/lib/api/response';
import {
  getSpajaBioskopHealthReport,
  SPAJA_BIOSKOP_API_RESPONSE_MAX_MS,
  SPAJA_BIOSKOP_CONTRACT_VERSION,
  SPAJA_BIOSKOP_MODULE_VERSION,
} from '@/lib/spaja-bioskop';

export const dynamic = 'force-dynamic';

export async function GET() {
  const report = getSpajaBioskopHealthReport();
  const response = apiSuccess(report, 200);
  response.headers.set('X-Spaja-Bioskop-Contract-Version', SPAJA_BIOSKOP_CONTRACT_VERSION);
  response.headers.set('X-Spaja-Bioskop-Module-Version', SPAJA_BIOSKOP_MODULE_VERSION);
  response.headers.set('X-Spaja-Bioskop-Max-Api-Ms', String(SPAJA_BIOSKOP_API_RESPONSE_MAX_MS));
  return response;
}
