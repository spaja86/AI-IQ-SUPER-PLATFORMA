import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { getPolimerizacija2Status } from '@/lib/polimerizacija-2';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/polimerizacija-2/status'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    return apiSuccess(getPolimerizacija2Status());
  } catch (error) {
    return apiInternalError('polimerizacija-2/status', error);
  }
}
