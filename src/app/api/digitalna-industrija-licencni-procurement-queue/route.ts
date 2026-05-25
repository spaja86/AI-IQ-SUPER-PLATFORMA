import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import {
  getLicencniPortfolioProcurementQueue,
  getLicencniPortfolioBlokatori,
} from '@/lib/digitalna-industrija-licencni-portfolio';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digitalna-industrija-licencni-procurement-queue'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const queue = getLicencniPortfolioProcurementQueue();
    const blokatori = getLicencniPortfolioBlokatori();

    return apiSuccess({
      status: 'aktivan',
      naziv: 'Licencni Procurement Queue — Digitalna Industrija',
      verzija: APP_VERSION,
      summary: {
        ukupnoUQueuu: queue.length,
        blokirajucihLegalanRad: blokatori.filter((s) => s.blokator === 'blokira_legalan_rad').length,
        blokirajucihPlatforme: blokatori.filter((s) => s.blokator === 'blokira_platforme').length,
        top5Prioritetnih: queue.slice(0, 5).map((s) => ({
          id: s.id,
          naziv: s.naziv,
          entitet: s.entitet,
          blokator: s.blokator,
          status: s.status,
          rok: s.rok,
          budzetRSD: s.budzetRSD,
        })),
      },
      blokatori,
      queue,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('digitalna-industrija-licencni-procurement-queue', error);
  }
}
