import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildGejmingIndustrija } from '@/lib/gejming-industrija';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/gejming-industrija'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildGejmingIndustrija('public');

    return apiSuccess({
      sistem: 'Gejming Industrija',
      opis:
        'Nad-sloj koji objedinjuje katalog igara, lifecycle tokove, creation pipeline, distribuciju/monetizaciju i pristup korisnika.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('gejming-industrija', error);
  }
}
