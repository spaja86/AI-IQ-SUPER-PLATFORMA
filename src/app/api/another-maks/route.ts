import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildAnotherMaks,
  executeAnotherMaksTask,
  getAnotherMaksInfo,
  ANOTHER_MAKS_CONTRACT_VERSION,
  ANOTHER_MAKS_MODEL_VERSION,
} from '@/lib/another-maks';
import type { AnotherMaksTaskInput } from '@/lib/another-maks';

export const dynamic = 'force-dynamic';
export const ANOTHER_MAKS_RATE_LIMIT = 60;
export const ANOTHER_MAKS_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/another-maks
 *
 * Vraća status i trenutnu personu ANOTHER MAKS agenta.
 *
 * @returns AnotherMaksSvega | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/another-maks'),
    ANOTHER_MAKS_RATE_LIMIT,
    ANOTHER_MAKS_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(ANOTHER_MAKS_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildAnotherMaks();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-AnotherMaks-Contract-Version', ANOTHER_MAKS_CONTRACT_VERSION);
    response.headers.set('X-AnotherMaks-Model-Version', ANOTHER_MAKS_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('another-maks', error);
  }
}

/**
 * POST /api/another-maks
 *
 * Pokreće ANOTHER MAKS zadatak (kreativna sinteza, generativna orkestracija, inovacioni signal).
 *
 * Body: AnotherMaksTaskInput
 *
 * @returns AnotherMaksTaskResult | 400 | 429 | 500
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/another-maks/post'),
    ANOTHER_MAKS_RATE_LIMIT,
    ANOTHER_MAKS_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(ANOTHER_MAKS_RATE_WINDOW_SECONDS);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('BAD_REQUEST', 'Invalid JSON body');
  }

  const input = body as Partial<AnotherMaksTaskInput>;
  const validTipovi: AnotherMaksTaskInput['tip'][] = [
    'kreativna-sinteza',
    'generativna-orkestracija',
    'inovacioni-signal',
  ];

  if (!input.tip || !validTipovi.includes(input.tip)) {
    return apiError(
      'BAD_REQUEST',
      `Neispravan tip zadatka. Dozvoljeni: ${validTipovi.join(', ')}`,
    );
  }

  try {
    const rezultat = await executeAnotherMaksTask({
      tip: input.tip,
      kontekst: typeof input.kontekst === 'string' ? input.kontekst : undefined,
      prioritet: ['visok', 'srednji', 'nizak'].includes(input.prioritet ?? '')
        ? (input.prioritet as AnotherMaksTaskInput['prioritet'])
        : 'srednji',
    });
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-AnotherMaks-Contract-Version', ANOTHER_MAKS_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('another-maks', error);
  }
}

// Named export for info — used by engine registry / health checks
export function getAnotherMaksRouteInfo() {
  return getAnotherMaksInfo();
}
