import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildBankPrototypeSummary } from '@/lib/bank-prototype';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/ai-iq-world-bank'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildBankPrototypeSummary();

    return apiSuccess({
      sistem: 'AI IQ World Bank — Sve o njoj',
      opis:
        'Javni, redigovani pregled prototipa. Bez bankovnih računa, ličnih podataka i potvrđenih uplata.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('ai-iq-world-bank', error);
  }
}
