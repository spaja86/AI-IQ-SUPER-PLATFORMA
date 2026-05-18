import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildBarKod } from '@/lib/bar-kod';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/bar-kod'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildBarKod('public');

    return apiSuccess({
      sistem: 'BAR KOD — Digitalna Industrija',
      opis:
        'Centralni integer-only registar BAR KOD identifikatora i generatorskog obrtaja po jedinici funkcije za sve platforme.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('bar-kod', error);
  }
}
