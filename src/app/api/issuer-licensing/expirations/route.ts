import { type NextRequest } from 'next/server';
import { ΩClearanceLevel } from '@/lib/auth/types';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { requireIssuerIdentity } from '@/lib/issuer-licensing-auth';
import { getIssuerLicensingExpirations } from '@/lib/issuer-licensing';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireIssuerIdentity(request, ΩClearanceLevel.USER);
    if (!auth.ok) return auth.response;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/issuer-licensing/expirations'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const windowDaysParam = Number(request.nextUrl.searchParams.get('windowDays') ?? '90');
    const windowDays = Number.isFinite(windowDaysParam) && windowDaysParam > 0 ? windowDaysParam : 90;
    const expirations = getIssuerLicensingExpirations(windowDays);

    return apiSuccess({
      status: 'aktivan',
      sistem: 'Issuer Licensing Expirations',
      role: auth.identity.role,
      windowDays,
      ukupno: expirations.length,
      expirations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('issuer-licensing-expirations-get', error);
  }
}
