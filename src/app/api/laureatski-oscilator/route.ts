// LAUREATSKI OSCILATOR — API ruta
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/laureatski-oscilator

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { buildLaureatskiOscilator } from '@/lib/laureatski-oscilator';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/laureatski-oscilator'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const oscilator = buildLaureatskiOscilator(user.id);
    return apiSuccess({ oscilator });
  } catch (error) {
    return apiInternalError('laureatski-oscilator', error);
  }
}
