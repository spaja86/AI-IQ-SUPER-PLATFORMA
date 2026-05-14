// DIGATALNA EUREKA — API ruta
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/digatalna-eureka
// Ektridonalna eksinometrijska ekstaza u ekvivalentu epicentričnog eklubriona
// nad ekstaznim simetrskim digitalnim jedinjenjem u oktavnom sistemu.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { buildDigatalnaEureka } from '@/lib/digatalna-eureka';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digatalna-eureka'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const eureka = buildDigatalnaEureka(user.id);
    return apiSuccess({ eureka });
  } catch (error) {
    return apiInternalError('digatalna-eureka', error);
  }
}
