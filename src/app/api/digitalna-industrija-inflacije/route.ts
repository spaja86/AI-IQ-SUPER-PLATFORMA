import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildDigitalnaIndustrijaInflacije } from '@/lib/digitalna-industrija-inflacije';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digitalna-industrija-inflacije'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildDigitalnaIndustrijaInflacije('public');

    return apiSuccess({
      sistem: 'Digitalna Industrija Inflacije',
      opis:
        'Centralni makroekonomski registar inflacije sa CPI, mesečnim, godišnjim i baznim pokazateljima Digitalne Industrije u Republici Srbiji.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('digitalna-industrija-inflacije', error);
  }
}
