import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildDigitalnaIndustrijaPozicije } from '@/lib/digitalna-industrija-pozicije';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digitalna-industrija-pozicije'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildDigitalnaIndustrijaPozicije('public');

    return apiSuccess({
      sistem: 'Digitalna Industrija Pozicije',
      opis:
        'Centralni registar pozicija u Digitalnoj Industriji (inženjering, AI/analitika, operacije i rast) u Republici Srbiji.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('digitalna-industrija-pozicije', error);
  }
}
