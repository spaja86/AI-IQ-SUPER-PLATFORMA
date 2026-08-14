import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildMaksimus,
  executeMaksimусTask,
  getMaksimусInfo,
  MAKSIMUS_CONTRACT_VERSION,
  MAKSIMUS_MODEL_VERSION,
} from '@/lib/maksimus';
import type { MaksimусTaskInput } from '@/lib/maksimus';

export const dynamic = 'force-dynamic';
export const MAKSIMUS_RATE_LIMIT = 60;
export const MAKSIMUS_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/maksimus
 *
 * Vraća status i trenutnu personu MAKSIMUS agenta.
 *
 * @returns MaksimуsSvega | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/maksimus'),
    MAKSIMUS_RATE_LIMIT,
    MAKSIMUS_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(MAKSIMUS_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildMaksimus();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Maksimus-Contract-Version', MAKSIMUS_CONTRACT_VERSION);
    response.headers.set('X-Maksimus-Model-Version', MAKSIMUS_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('maksimus', error);
  }
}

/**
 * POST /api/maksimus
 *
 * Pokreće MAKSIMUS zadatak (analitička orkestracija, razvojna strategija, platforma koordinacija).
 *
 * Body: MaksimусTaskInput
 *
 * @returns MaksimусTaskResult | 400 | 429 | 500
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/maksimus/post'),
    MAKSIMUS_RATE_LIMIT,
    MAKSIMUS_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(MAKSIMUS_RATE_WINDOW_SECONDS);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('BAD_REQUEST', 'Invalid JSON body');
  }

  const input = body as Partial<MaksimусTaskInput>;
  const validTipovi: MaksimусTaskInput['tip'][] = [
    'analiticka-orkestracija',
    'razvojna-strategija',
    'platforma-koordinacija',
  ];

  if (!input.tip || !validTipovi.includes(input.tip)) {
    return apiError(
      'BAD_REQUEST',
      `Neispravan tip zadatka. Dozvoljeni: ${validTipovi.join(', ')}`,
    );
  }

  try {
    const rezultat = await executeMaksimусTask({
      tip: input.tip,
      kontekst: typeof input.kontekst === 'string' ? input.kontekst : undefined,
      prioritet: ['visok', 'srednji', 'nizak'].includes(input.prioritet ?? '')
        ? (input.prioritet as MaksimусTaskInput['prioritet'])
        : 'srednji',
    });
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Maksimus-Contract-Version', MAKSIMUS_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('maksimus', error);
  }
}

// Named export for info — used by engine registry / health checks
export function getMaksimусRouteInfo() {
  return getMaksimусInfo();
}
