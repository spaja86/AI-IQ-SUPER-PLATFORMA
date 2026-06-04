import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { KOMPANIJA } from '@/lib/constants';
import { buildPolimerizacija2Report } from '@/lib/polimerizacija-2';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/polimerizacija-2'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildPolimerizacija2Report('public');
    return apiSuccess({
      sistem: 'Polimerizacija 2',
      opis: 'V2 operativni modul za lančano vezivanje, scan istoriju i trend kohezije.',
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('polimerizacija-2', error);
  }
}
