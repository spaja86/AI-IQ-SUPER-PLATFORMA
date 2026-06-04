import { type NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { getPolimerizacija2Trend } from '@/lib/polimerizacija-2';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/polimerizacija-2/trendovi'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const { searchParams } = new URL(request.url);
    const nRaw = searchParams.get('n');
    let n = 5;
    if (nRaw !== null) {
      const parsed = Number.parseInt(nRaw, 10);
      if (Number.isNaN(parsed) || parsed < 1 || parsed > 10) {
        return apiError('BAD_REQUEST', 'Parametar n mora biti ceo broj u opsegu 1-10');
      }
      n = parsed;
    }

    return apiSuccess({
      status: 'ok',
      n,
      trendovi: getPolimerizacija2Trend(n),
    });
  } catch (error) {
    return apiInternalError('polimerizacija-2/trendovi', error);
  }
}
