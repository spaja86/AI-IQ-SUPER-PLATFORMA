import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildGejmingLikovi } from '@/lib/gejming-likovi';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/gejming-likovi'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const rezultat = buildGejmingLikovi('public');

    return apiSuccess({
      sistem: 'Industrija Gejming Likova',
      opis:
        'Centralni katalog gaming entiteta: likovi (playable/NPC), objekti, subjekti, okruženja, sredstva, vozila, oružja i kostimi.',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      rezultat,
    });
  } catch (error) {
    return apiInternalError('gejming-likovi', error);
  }
}
