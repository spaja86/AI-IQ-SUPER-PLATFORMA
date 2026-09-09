import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { logApiCall } from '@/lib/logger';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { protokolManager } from '@/lib/protokoli/manager';
import type {
  ProtokolFilter,
  ProtokolIzvor,
  ProtokolKategorija,
  ProtokolKriticnost,
  ProtokolOkruzenje,
  ProtokolStatus,
} from '@/lib/protokoli/types';
import { resolveRequestId } from '@/lib/request-id';

function getReqId(request: NextRequest): string {
  return resolveRequestId(request.headers);
}

const VALID_KATEGORIJE: readonly ProtokolKategorija[] = [
  'komunikacioni',
  'bezbednosni',
  'poslovni',
  'operativni',
  'autentifikacioni',
  'transfer',
];
const VALID_STATUSI: readonly ProtokolStatus[] = ['aktivan', 'neaktivan', 'deprecated', 'u-testu', 'incident'];
const VALID_IZVORI: readonly ProtokolIzvor[] = [
  'spaja-protokoli',
  'autofinish-protokol-verifikacija',
  'vlasnicki-vip-plan-dispatch-protokoli',
];
const VALID_KRITICNOSTI: readonly ProtokolKriticnost[] = ['niska', 'srednja', 'visoka', 'kriticna'];
const VALID_OKRUZENJA: readonly ProtokolOkruzenje[] = ['razvoj', 'staging', 'produkcija', 'hibridno'];

function isOneOf<T extends string>(valid: readonly T[], value: string): value is T {
  return (valid as readonly string[]).includes(value);
}

function parseBoundedInt(rawValue: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(rawValue ?? String(fallback), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const reqId = getReqId(request);
  const route = '/api/protokoli';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, route), 120, 60);
    if (!allowed) {
      logApiCall('PROTOKOLI', {
        reqId,
        route,
        method: 'GET',
        statusCode: 429,
        durationMs: Date.now() - startedAt,
      });
      return apiError('TOO_MANY_REQUESTS', 'Previše zahteva. Pokušajte ponovo za 60 sekundi.');
    }

    const searchParams = 'nextUrl' in request && request.nextUrl ? request.nextUrl.searchParams : new URL(request.url).searchParams;
    const page = parseBoundedInt(searchParams.get('page'), 1, 1, 10000);
    const limit = parseBoundedInt(searchParams.get('limit'), 50, 1, 200);
    const kategorijaRaw = searchParams.get('kategorija');
    const statusRaw = searchParams.get('status');
    const izvorRaw = searchParams.get('izvor');
    const kriticnostRaw = searchParams.get('kriticnost');
    const okruzenjeRaw = searchParams.get('okruzenje');
    const vlasnikTim = searchParams.get('vlasnikTim')?.trim() || undefined;
    const q = searchParams.get('q')?.trim() || undefined;

    const kategorija = kategorijaRaw && isOneOf(VALID_KATEGORIJE, kategorijaRaw) ? kategorijaRaw : null;
    const status = statusRaw && isOneOf(VALID_STATUSI, statusRaw) ? statusRaw : null;
    const izvor = izvorRaw && isOneOf(VALID_IZVORI, izvorRaw) ? izvorRaw : null;
    const kriticnost = kriticnostRaw && isOneOf(VALID_KRITICNOSTI, kriticnostRaw) ? kriticnostRaw : null;
    const okruzenje = okruzenjeRaw && isOneOf(VALID_OKRUZENJA, okruzenjeRaw) ? okruzenjeRaw : null;

    if (kategorijaRaw && !kategorija) {
      return apiError('BAD_REQUEST', `Nepoznata kategorija protokola. Dozvoljeno: ${VALID_KATEGORIJE.join(', ')}.`);
    }
    if (statusRaw && !status) {
      return apiError('BAD_REQUEST', `Nepoznat status protokola. Dozvoljeno: ${VALID_STATUSI.join(', ')}.`);
    }
    if (izvorRaw && !izvor) {
      return apiError('BAD_REQUEST', `Nepoznat izvor protokola. Dozvoljeno: ${VALID_IZVORI.join(', ')}.`);
    }
    if (kriticnostRaw && !kriticnost) {
      return apiError('BAD_REQUEST', `Nepoznata kritičnost. Dozvoljeno: ${VALID_KRITICNOSTI.join(', ')}.`);
    }
    if (okruzenjeRaw && !okruzenje) {
      return apiError('BAD_REQUEST', `Nepoznato okruženje. Dozvoljeno: ${VALID_OKRUZENJA.join(', ')}.`);
    }

    const offset = (page - 1) * limit;
    const filter: ProtokolFilter = {
      ...(kategorija ? { kategorija } : {}),
      ...(status ? { status } : {}),
      ...(izvor ? { izvor } : {}),
      ...(kriticnost ? { kriticnost } : {}),
      ...(okruzenje ? { okruzenje } : {}),
      ...(vlasnikTim ? { vlasnikTim } : {}),
      ...(q ? { q } : {}),
    };

    const all = protokolManager.getAll(filter);
    const results = all.slice(offset, offset + limit);

    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'GET',
      statusCode: 200,
      durationMs: Date.now() - startedAt,
      extra: { ukupno: all.length, page, limit, filterKeys: Object.keys(filter) },
    });

    return apiSuccess({
      total: all.length,
      page,
      limit,
      results,
      filters: filter,
      summary: protokolManager.getCatalogSummary(),
      meta: protokolManager.getMeta(),
    });
  } catch (error) {
    logApiCall('PROTOKOLI', {
      reqId,
      route,
      method: 'GET',
      statusCode: 500,
      durationMs: Date.now() - startedAt,
      extra: { error: error instanceof Error ? error.message : String(error) },
    });
    return apiInternalError('protokoli-list', error);
  }
}
