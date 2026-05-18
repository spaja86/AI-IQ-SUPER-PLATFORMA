import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import { getLicencniExpirations } from '@/lib/aiiq-world-bank-licencni-registar';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/aiiq-world-bank-licencni-expirations'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const windowDaysRaw = Number(request.nextUrl.searchParams.get('windowDays') ?? 90);
    const windowDays = Number.isFinite(windowDaysRaw) && windowDaysRaw > 0 ? Math.round(windowDaysRaw) : 90;
    const stavke = getLicencniExpirations(windowDays);

    return apiSuccess({
      sistem: 'AI IQ WORLD BANK Licencni Expirations',
      verzija: APP_VERSION,
      windowDays,
      ukupno: stavke.length,
      stavke,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('aiiq-world-bank-licencni-expirations', error);
  }
}
