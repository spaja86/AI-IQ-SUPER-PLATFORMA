import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildMikrofile } from '@/lib/mikrofile';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const MIKROFILE_SISTEM_NAZIV = 'MIKROFILE — Digitalna Industrija';

export async function GET(request: NextRequest) {
  try {
    const requestIp = (request as NextRequest & { ip?: string }).ip;
    const ip =
      requestIp ??
      request.headers.get('x-real-ip')?.trim() ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/mikrofile'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildMikrofile('public');

    return apiSuccess({
      sistem: MIKROFILE_SISTEM_NAZIV,
      opis:
        'Centralni mikro-digitalni registar fajlova i metapodataka za fakture, licence, ugovore, izveštaje i BAR KOD reference.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('mikrofile', error);
  }
}
