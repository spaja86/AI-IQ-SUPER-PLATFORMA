import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildEgzistencijaPrilivIzvestaj } from '@/lib/egzistencija-pravilnik';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/egzistencija-pravilnik-priliv'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildEgzistencijaPrilivIzvestaj('public');

    return apiSuccess({
      sistem: 'Egzistencija Pravilnik — Priliv',
      opis:
        'Pravilnik prililva resursa: tipovi, limiti i validaciona pravila za sve dolazne tokove na platformi.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('egzistencija-pravilnik-priliv', error);
  }
}
