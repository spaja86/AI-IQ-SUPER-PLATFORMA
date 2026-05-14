// LAUCENTRICNI SPEKTAR — API ruta
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/laucentricni-spektar
// Spektralna analiza laucentričnog sistema — frekvencijsko razlaganje
// četiri koncentrična sloja oko laureatskog centra u harmoničke komponente.

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { buildLaucentricniSpektar } from '@/lib/laucentricni-spektar';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/laucentricni-spektar'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const spektar = buildLaucentricniSpektar(user.id);
    return apiSuccess({ spektar });
  } catch (error) {
    return apiInternalError('laucentricni-spektar', error);
  }
}
