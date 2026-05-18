import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import { buildAIIQWorldBankLicencniRegistar } from '@/lib/aiiq-world-bank-licencni-registar';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/aiiq-world-bank-licencna-nabavka-status'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const reg = buildAIIQWorldBankLicencniRegistar();
    const aktivne = reg.nabavka.filter((x) => x.status === 'u_toku' || x.status === 'nije_pokrenuto');

    return apiSuccess({
      sistem: 'AI IQ WORLD BANK Licencna Nabavka Status',
      verzija: APP_VERSION,
      summary: {
        ukupnoNabavki: reg.nabavka.length,
        aktivnih: aktivne.length,
        kriticnihAktivnih: aktivne.filter((x) => x.rizik === 'kriticno').length,
      },
      nabavka: reg.nabavka,
      aktivne,
      b2bMeta: reg.b2bMeta,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('aiiq-world-bank-licencna-nabavka-status', error);
  }
}
