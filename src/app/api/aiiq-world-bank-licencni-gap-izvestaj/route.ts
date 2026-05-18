import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import { buildAIIQWorldBankLicencniRegistar } from '@/lib/aiiq-world-bank-licencni-registar';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/aiiq-world-bank-licencni-gap-izvestaj'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const reg = buildAIIQWorldBankLicencniRegistar();
    const kriticni = reg.gapovi.filter((x) => x.rizik === 'kriticno');

    return apiSuccess({
      sistem: 'AI IQ WORLD BANK Gap Izvestaj',
      verzija: APP_VERSION,
      summary: {
        ukupnoGapova: reg.gapovi.length,
        kriticnihGapova: kriticni.length,
        topPrioritet: reg.gapovi.slice(0, 10),
      },
      gapovi: reg.gapovi,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('aiiq-world-bank-licencni-gap-izvestaj', error);
  }
}
