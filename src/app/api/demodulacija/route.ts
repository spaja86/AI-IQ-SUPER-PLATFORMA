import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildDemodulacija } from '@/lib/demodulacija';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/demodulacija'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildDemodulacija('public');

    return apiSuccess({
      sistem: 'Demodulacija',
      opis: 'Operativni modul za rekonstrukciju modulisanih tokova kroz filtraciju, dekodovanje i proveru kvaliteta izlaznog signala.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('demodulacija', error);
  }
}
