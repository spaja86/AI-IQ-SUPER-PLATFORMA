import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildAiIqWorldBank } from '@/lib/ai-iq-world-bank';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/ai-iq-world-bank'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildAiIqWorldBank('public');

    return apiSuccess({
      sistem: 'AI IQ World Bank — Sve o njoj',
      opis:
        'Objedinjeni endpoint koji izlaže kompletan profil AI IQ World Bank: usluge, AI tehnologija, ERSTE računi, partneri, transferi, dugovi, kontakt, srpske banke i GitHub billing governance.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('ai-iq-world-bank', error);
  }
}
