import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildDigitalnaIndustrijaKapitalniRizik } from '@/lib/digitalna-industrija-kapitalni-rizik';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digitalna-industrija-kapitalni-rizik'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildDigitalnaIndustrijaKapitalniRizik('public');

    return apiSuccess({
      sistem: 'Digitalna Industrija Kapitalni Rizik',
      opis:
        'Centralni registar adekvatnosti kapitala (CAR, CET1, Tier1/Tier2 i kapitalnih bafera) Digitalne Industrije u Republici Srbiji.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('digitalna-industrija-kapitalni-rizik', error);
  }
}
