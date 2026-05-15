// MOZAK LOGIKA — API ruta
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/mozak-logika

import { type NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  glavniEndzinDigitalneIndustrije,
  getGlavniEndzinStatistika,
} from '@/lib/glavni-endzin-digitalne-industrije';
import { buildMozakLogika } from '@/lib/mozak-logika';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/mozak-logika'),
      30,
      60,
    );
    if (!allowed) {
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte za 60 sekundi.');
    }

    const rezultat = buildMozakLogika(user.id, {
      glavniEndzinId: glavniEndzinDigitalneIndustrije.id,
      glavniEndzinNaziv: glavniEndzinDigitalneIndustrije.naziv,
      glavniEndzinVerzija: glavniEndzinDigitalneIndustrije.verzija,
      statistika: getGlavniEndzinStatistika(),
      spojeniEndzini: glavniEndzinDigitalneIndustrije.spojeniEndzini,
      evolucija: glavniEndzinDigitalneIndustrije.evolucija,
      mogucnosti: glavniEndzinDigitalneIndustrije.mogucnosti,
    });

    return apiSuccess({ rezultat });
  } catch (error) {
    return apiInternalError('mozak-logika', error);
  }
}
