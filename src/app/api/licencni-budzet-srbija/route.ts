import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildLicencniBudzetSrbija } from '@/lib/licencni-budzet-srbija';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/licencni-budzet-srbija'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildLicencniBudzetSrbija('public');

    return apiSuccess({
      sistem: 'Licencni Budžet Srbija',
      opis:
        'Budžetski plan nabavke svih licenci u okviru AI IQ World Bank Srbija procurement režima — raspored troškova, kategorije i faze plaćanja.',
      izvor: KOMPANIJA,
      verzija: APP_VERSION,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('licencni-budzet-srbija', error);
  }
}
