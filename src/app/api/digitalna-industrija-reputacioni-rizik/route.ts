import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildDigitalnaIndustrijaReputacioniRizik } from '@/lib/digitalna-industrija-reputacioni-rizik';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digitalna-industrija-reputacioni-rizik'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildDigitalnaIndustrijaReputacioniRizik('public');

    return apiSuccess({
      sistem: 'Digitalna Industrija Reputacioni Rizik',
      opis:
        'Centralni registar reputacionog rizika (medijski, socijalni, regulatorni i partnerski) Digitalne Industrije u Republici Srbiji.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('digitalna-industrija-reputacioni-rizik', error);
  }
}
