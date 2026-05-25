import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildPerkolizonik } from '@/lib/perkolizonik';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/perkolizonik'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildPerkolizonik('public');
    return apiSuccess({
      sistem: 'Perkolizonik',
      opis: 'Operativni modul za stabilizaciju tokova, latencije i kapaciteta.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('perkolizonik', error);
  }
}

