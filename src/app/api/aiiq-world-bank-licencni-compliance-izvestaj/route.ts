import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import { getLicencniComplianceIzvestaj } from '@/lib/aiiq-world-bank-licencni-registar';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/aiiq-world-bank-licencni-compliance-izvestaj'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const periodTipParam = request.nextUrl.searchParams.get('periodTip');
    const periodTip = periodTipParam === 'kvartalni' ? 'kvartalni' : 'mesecni';
    const izvestaj = getLicencniComplianceIzvestaj(periodTip);

    return apiSuccess({
      sistem: 'AI IQ WORLD BANK Licencni Compliance Izvestaj',
      verzija: APP_VERSION,
      izvestaj,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('aiiq-world-bank-licencni-compliance-izvestaj', error);
  }
}
