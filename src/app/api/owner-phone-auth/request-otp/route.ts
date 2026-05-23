import { type NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { requestOwnerOtp } from '@/lib/owner-phone-auth';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * POST /api/owner-phone-auth/request-otp
 *
 * Zahteva OTP za vlasnički telefon.
 * Body: { telefon: string }
 *
 * Rate limit: max 5 zahteva/min po IP.
 * Dodatni anti-flood po broju telefona: max 3 OTP/10min (u owner-phone-auth.ts).
 *
 * Napomena o bezbednosti:
 *  - Telefon je uvek maskiran u odgovoru
 *  - devOtp je prisutan SAMO van produkcije
 *  - Endpoint ne otkriva da li je broj vlasnički
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/owner-phone-auth/request-otp'),
      5,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const body = (await request.json()) as Record<string, unknown>;
    const telefon = typeof body['telefon'] === 'string' ? body['telefon'].trim() : '';

    if (!telefon) {
      return apiError('BAD_REQUEST', "Polje 'telefon' je obavezno.");
    }

    const rezultat = requestOwnerOtp(telefon);

    if (!rezultat.uspesno) {
      return apiError('TOO_MANY_REQUESTS', rezultat.napomena);
    }

    return apiSuccess({
      maskiranTelefon: rezultat.maskiranTelefon,
      isteceZaSekundi: rezultat.isteceZaSekundi,
      napomena: rezultat.napomena,
      // Dev/test only — nikad u produkciji
      ...(rezultat.devOtp !== undefined ? { devOtp: rezultat.devOtp } : {}),
    });
  } catch (error) {
    return apiInternalError('owner-phone-auth/request-otp', error);
  }
}

export async function GET() {
  return apiSuccess({
    sistem: 'Owner Phone Auth — OTP Zahtev',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    opis: 'POST /api/owner-phone-auth/request-otp sa { telefon } za slanje OTP koda na vlasnički telefon.',
    napomena:
      'Owner autorizacija zahteva verifikovani telefon pre Vercel ownership prenosa. Telefon je uvek maskiran u odgovorima.',
    sledecaRuta: 'POST /api/owner-phone-auth/verify-otp',
  });
}
