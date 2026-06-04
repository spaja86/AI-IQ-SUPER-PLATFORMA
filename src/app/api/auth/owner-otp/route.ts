import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { requestOwnerOtp } from '@/lib/owner-phone-auth';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/auth/owner-otp'), 5, 60);
    if (!allowed) return apiRateLimited(60);

    const body = (await request.json()) as Record<string, unknown>;
    const telefon = typeof body['telefon'] === 'string' ? body['telefon'].trim() : '';

    if (!telefon) return apiError('BAD_REQUEST', "Polje 'telefon' je obavezno.");

    const rezultat = requestOwnerOtp(telefon);
    if (!rezultat.uspesno) return apiError('TOO_MANY_REQUESTS', rezultat.napomena);

    return apiSuccess({
      maskiranTelefon: rezultat.maskiranTelefon,
      isteceZaSekundi: rezultat.isteceZaSekundi,
      napomena: rezultat.napomena,
      ...(rezultat.devOtp !== undefined ? { devOtp: rezultat.devOtp } : {}),
    });
  } catch (error) {
    return apiInternalError('auth/owner-otp', error);
  }
}
