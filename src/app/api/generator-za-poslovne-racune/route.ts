import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildGeneratorZaPoslovneRacune } from '@/lib/generator-za-poslovne-racune';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/generator-za-poslovne-racune'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildGeneratorZaPoslovneRacune('public');

    return apiSuccess({
      sistem: 'Generator za Poslovne Račune',
      opis:
        'AI IQ World Bank modul za simulaciono generisanje poslovnih računa (RSD/EUR/USD), validacije, KYC/KYB status, formalni invoice blok (issuer/owner/phone) i operativne preporuke.',
      izvor: KOMPANIJA,
      verzija: APP_VERSION,
      formalniRacun: rezultat.formalniRacun,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('generator-za-poslovne-racune', error);
  }
}
