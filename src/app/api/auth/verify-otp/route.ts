import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { verifyOwnerOtp } from '@/lib/owner-phone-auth';
import { ALL_PLATFORM_SCOPES, createPlatformScopedSession } from '@/lib/platform-auth/unified-auth';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/auth/verify-otp'), 10, 60);
    if (!allowed) return apiRateLimited(60);

    const body = (await request.json()) as Record<string, unknown>;
    const telefon = typeof body['telefon'] === 'string' ? body['telefon'].trim() : '';
    const otp = typeof body['otp'] === 'string' ? body['otp'].trim() : '';

    if (!telefon || !otp) return apiError('BAD_REQUEST', "Polja 'telefon' i 'otp' su obavezna.");

    const rezultat = verifyOwnerOtp(telefon, otp);
    if (!rezultat.uspesno) return apiError('UNAUTHORIZED', rezultat.napomena);

    const userId = rezultat.jeOwner ? 'owner' : `user-${telefon.replace(/\D+/g, '').slice(-8) || 'anon'}`;
    const bundle = createPlatformScopedSession(userId, [...ALL_PLATFORM_SCOPES]);

    return apiSuccess({
      uspesno: true,
      jeOwner: rezultat.jeOwner,
      ownerEmail: rezultat.ownerEmail,
      ownerRacun: rezultat.ownerRacun,
      napomena: rezultat.napomena,
      auth: bundle,
    });
  } catch (error) {
    return apiInternalError('auth/verify-otp', error);
  }
}
