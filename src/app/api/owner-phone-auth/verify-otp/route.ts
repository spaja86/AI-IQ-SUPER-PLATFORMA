import { type NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyOwnerOtp } from '@/lib/owner-phone-auth';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * POST /api/owner-phone-auth/verify-otp
 *
 * Verifikuje OTP za vlasnički telefon.
 * Body: { telefon: string, otp: string }
 *
 * Rate limit: max 10 zahteva/min po IP.
 * Dodatna zaštita: max 3 pokušaja po OTP kodu (u owner-phone-auth.ts).
 *
 * Uspešna verifikacija:
 *  - Vraća jeOwner=true i ownerRacun='DIGI-IND-001' za vlasnički telefon
 *  - Aktivira owner privilegiju u login toku
 *  - Dozvoljava pokretanje Vercel ownership procesa
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/owner-phone-auth/verify-otp'),
      10,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const body = (await request.json()) as Record<string, unknown>;
    const telefon = typeof body['telefon'] === 'string' ? body['telefon'].trim() : '';
    const otp = typeof body['otp'] === 'string' ? body['otp'].trim() : '';

    if (!telefon || !otp) {
      return apiError('BAD_REQUEST', "Polja 'telefon' i 'otp' su obavezna.");
    }

    const rezultat = verifyOwnerOtp(telefon, otp);

    if (!rezultat.uspesno) {
      return apiError('UNAUTHORIZED', rezultat.napomena);
    }

    return apiSuccess({
      uspesno: true,
      jeOwner: rezultat.jeOwner,
      ...(rezultat.ownerEmail !== undefined ? { ownerEmail: rezultat.ownerEmail } : {}),
      ...(rezultat.ownerRacun !== undefined ? { ownerRacun: rezultat.ownerRacun } : {}),
      napomena: rezultat.napomena,
    });
  } catch (error) {
    return apiInternalError('owner-phone-auth/verify-otp', error);
  }
}

export async function GET() {
  return apiSuccess({
    sistem: 'Owner Phone Auth — OTP Verifikacija',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    opis: 'POST /api/owner-phone-auth/verify-otp sa { telefon, otp } za potvrdu OTP koda.',
    napomena:
      'Uspešna verifikacija aktivira vlasnički status i dozvoljava pokretanje Vercel ownership procesa.',
    pretodnaRuta: 'POST /api/owner-phone-auth/request-otp',
  });
}
