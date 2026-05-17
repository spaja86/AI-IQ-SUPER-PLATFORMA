import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildValidatorPoslovnihRacuna } from '@/lib/validator-poslovnih-racuna';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/validator-poslovnih-racuna'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildValidatorPoslovnihRacuna('public');

    return apiSuccess({
      sistem: 'Validator Poslovnih Računa',
      opis:
        'AI IQ World Bank validator nad generator izlazom za format, compliance i operativne provere poslovnih računa.',
      izvor: KOMPANIJA,
      verzija: APP_VERSION,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('validator-poslovnih-racuna', error);
  }
}
