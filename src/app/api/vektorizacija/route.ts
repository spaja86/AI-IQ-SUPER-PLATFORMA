import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildVektorizacija } from '@/lib/vektorizacija';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/vektorizacija'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildVektorizacija('public');

    return apiSuccess({
      sistem: 'Vektorizacija',
      opis: 'Operativni modul za vektorizaciju procesnih tokova i projekciju multi-dimenzionalnih entiteta.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('vektorizacija', error);
  }
}
