import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildDigitalnaIndustrijaKursneRazlike } from '@/lib/digitalna-industrija-kursne-razlike';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digitalna-industrija-kursne-razlike'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildDigitalnaIndustrijaKursneRazlike('public');

    return apiSuccess({
      sistem: 'Digitalna Industrija Kursne Razlike',
      opis:
        'Centralni FX obračun kursnih razlika za ključne dokumente Digitalne Industrije u Republici Srbiji.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('digitalna-industrija-kursne-razlike', error);
  }
}
