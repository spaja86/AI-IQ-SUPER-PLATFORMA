// LAUREATSKI SIGNAL — API ruta
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/laureatski-signal

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { buildLaureatskiSignal } from '@/lib/laureatski-signal';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/laureatski-signal'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const signal = buildLaureatskiSignal(user.id);
    return apiSuccess({ signal });
  } catch (error) {
    return apiInternalError('laureatski-signal', error);
  }
}
