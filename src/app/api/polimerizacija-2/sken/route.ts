import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { buildPolimerizacija2Report } from '@/lib/polimerizacija-2';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/polimerizacija-2/sken'), 8, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildPolimerizacija2Report('api-sken');
    return apiSuccess(
      {
        status: 'started',
        poruka: 'Polimerizacija 2 sken je pokrenut i završen.',
        scanId: rezultat.scanId,
        indeksKohezije: rezultat.indeksKohezije,
        trendDelta: rezultat.trendovi.at(-1)?.delta ?? 0,
      },
      202,
    );
  } catch (error) {
    return apiInternalError('polimerizacija-2/sken', error);
  }
}
