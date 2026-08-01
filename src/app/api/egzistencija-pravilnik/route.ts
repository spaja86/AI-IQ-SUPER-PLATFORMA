import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildEgzistencijaPravilnikIzvestaj } from '@/lib/egzistencija-pravilnik';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/egzistencija-pravilnik'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildEgzistencijaPravilnikIzvestaj('public');

    return apiSuccess({
      sistem: 'Egzistencija Pravilnik',
      opis:
        'Pravilnik životnog ciklusa i tokova resursa (Priliv / Odliv) za sve entitete na platformi.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('egzistencija-pravilnik', error);
  }
}
