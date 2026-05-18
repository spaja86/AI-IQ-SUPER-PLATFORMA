import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import {
  buildAIIQWorldBankLicencniRegistar,
  getLicencniChecklistPoDelatnosti,
} from '@/lib/aiiq-world-bank-licencni-registar';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/aiiq-world-bank-licencna-checklista'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const reg = buildAIIQWorldBankLicencniRegistar();
    const delatnostId = request.nextUrl.searchParams.get('delatnostId') ?? reg.delatnosti[0]?.id;

    if (!delatnostId) {
      return apiSuccess({
        sistem: 'AI IQ WORLD BANK Licencna Checklista',
        verzija: APP_VERSION,
        delatnostId: null,
        stavke: [],
      });
    }

    const delatnost = reg.delatnosti.find((x) => x.id === delatnostId) ?? null;

    return apiSuccess({
      sistem: 'AI IQ WORLD BANK Licencna Checklista',
      verzija: APP_VERSION,
      delatnostId,
      delatnost,
      stavke: getLicencniChecklistPoDelatnosti(delatnostId),
      dostupneDelatnosti: reg.delatnosti.map((x) => ({ id: x.id, naziv: x.naziv })),
    });
  } catch (error) {
    return apiInternalError('aiiq-world-bank-licencna-checklista', error);
  }
}
