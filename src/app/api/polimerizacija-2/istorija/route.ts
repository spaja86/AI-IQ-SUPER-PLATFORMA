import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { getPolimerizacija2History } from '@/lib/polimerizacija-2';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/polimerizacija-2/istorija'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const istorija = getPolimerizacija2History();
    return apiSuccess({
      status: 'ok',
      ukupno: istorija.length,
      istorija,
    });
  } catch (error) {
    return apiInternalError('polimerizacija-2/istorija', error);
  }
}
