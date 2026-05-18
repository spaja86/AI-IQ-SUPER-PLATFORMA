import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildAIIQWorldBankLicencniRegistar } from '@/lib/aiiq-world-bank-licencni-registar';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/aiiq-world-bank-licencni-registar'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const registar = buildAIIQWorldBankLicencniRegistar();

    return apiSuccess({
      sistem: 'AI IQ WORLD BANK Licencni Registar',
      opis: 'Centralni registar licenci za Srbiju sa mapiranjem statusa, dokaza, gap analize i nabavke.',
      izvor: KOMPANIJA,
      verzija: APP_VERSION,
      registar,
    });
  } catch (error) {
    return apiInternalError('aiiq-world-bank-licencni-registar', error);
  }
}
