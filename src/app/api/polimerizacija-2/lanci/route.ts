import { type NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildPolimerizacija2Report,
  filterLanci,
  type PolimerizacijaFazaProcesa,
  type PolimerizacijaLanac,
} from '@/lib/polimerizacija-2';

const VALID_FAZE: PolimerizacijaFazaProcesa[] = [
  'inicijacija',
  'propagacija',
  'terminacija',
  'kroslink',
  'umrezavanje',
  'purifikacija',
];
const VALID_STATUSI: PolimerizacijaLanac['status'][] = ['aktivan', 'optimizacija', 'kritican'];

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/polimerizacija-2/lanci'), 90, 60);
    if (!allowed) return apiRateLimited(60);

    const { searchParams } = new URL(request.url);
    const fazaRaw = searchParams.get('faza');
    const statusRaw = searchParams.get('status');
    const minKohezijaRaw = searchParams.get('minKohezija');

    if (fazaRaw && !VALID_FAZE.includes(fazaRaw as PolimerizacijaFazaProcesa)) {
      return apiError('BAD_REQUEST', `Nevalidna faza. Dozvoljeno: ${VALID_FAZE.join(', ')}`);
    }
    if (statusRaw && !VALID_STATUSI.includes(statusRaw as PolimerizacijaLanac['status'])) {
      return apiError('BAD_REQUEST', `Nevalidan status. Dozvoljeno: ${VALID_STATUSI.join(', ')}`);
    }

    let minKohezija: number | undefined;
    if (minKohezijaRaw !== null) {
      const parsed = Number(minKohezijaRaw);
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 1) {
        return apiError('BAD_REQUEST', 'minKohezija mora biti broj u opsegu 0-1');
      }
      minKohezija = parsed;
    }

    const report = buildPolimerizacija2Report('public-lanci');
    const lanci = filterLanci(
      report.lanci,
      fazaRaw as PolimerizacijaFazaProcesa | undefined,
      minKohezija,
      statusRaw as PolimerizacijaLanac['status'] | undefined,
    );

    return apiSuccess({
      ukupno: lanci.length,
      filteri: {
        faza: fazaRaw ?? 'all',
        status: statusRaw ?? 'all',
        minKohezija: minKohezija ?? null,
      },
      lanci,
      scanId: report.scanId,
    });
  } catch (error) {
    return apiInternalError('polimerizacija-2/lanci', error);
  }
}
