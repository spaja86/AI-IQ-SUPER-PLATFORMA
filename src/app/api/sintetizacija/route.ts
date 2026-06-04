import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildSintetizacija } from '@/lib/sintetizacija';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/sintetizacija'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildSintetizacija('public');

    return apiSuccess({
      sistem: 'Sintetizacija',
      opis: 'Operativni modul za sintezu i integraciju procesnih entiteta u koherentne strukture.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('sintetizacija', error);
  }
}
