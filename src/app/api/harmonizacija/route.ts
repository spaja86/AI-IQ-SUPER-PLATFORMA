import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildHarmonizacija } from '@/lib/harmonizacija';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/harmonizacija'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildHarmonizacija('public');
    return apiSuccess({
      sistem: 'Harmonizacija',
      opis: 'Operativni modul za harmonizaciju procesnih slojeva i sinhronizaciju sistemskih komponenti.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('harmonizacija', error);
  }
}
