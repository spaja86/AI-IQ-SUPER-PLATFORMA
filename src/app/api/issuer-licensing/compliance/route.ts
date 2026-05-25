import { type NextRequest } from 'next/server';
import { ΩClearanceLevel } from '@/lib/auth/types';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { requireIssuerIdentity } from '@/lib/issuer-licensing-auth';
import { getIssuerLicensingComplianceReport } from '@/lib/issuer-licensing';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireIssuerIdentity(request, ΩClearanceLevel.USER);
    if (!auth.ok) return auth.response;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/issuer-licensing/compliance'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const periodTipParam = request.nextUrl.searchParams.get('periodTip');
    const periodTip = periodTipParam === 'kvartalni' ? 'kvartalni' : 'mesecni';
    const izvestaj = getIssuerLicensingComplianceReport(periodTip);

    return apiSuccess({
      status: 'aktivan',
      sistem: 'Issuer Licensing Compliance Izvestaj',
      role: auth.identity.role,
      izvestaj,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('issuer-licensing-compliance-get', error);
  }
}
