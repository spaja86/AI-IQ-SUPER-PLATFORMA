import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildKristalizacija } from '@/lib/kristalizacija';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/kristalizacija'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildKristalizacija('public');

    return apiSuccess({
      sistem: 'Kristalizacija',
      opis: 'Operativni modul za kristalizaciju procesnih tokova i stabilizaciju jezgra sistema.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('kristalizacija', error);
  }
}
