import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import {
  buildThem,
  executeThemTask,
  getThemInfo,
  executeHandoff,
  THEM_CONTRACT_VERSION,
  THEM_MODEL_VERSION,
} from '@/lib/tarken-hingil-ekolan-maksimus';
import type { ThemTaskInput, ThemHandoffRequest } from '@/lib/tarken-hingil-ekolan-maksimus';

export const dynamic = 'force-dynamic';
export const THEM_RATE_LIMIT = 60;
export const THEM_RATE_WINDOW_SECONDS = 60;

/**
 * GET /api/tarken-hingil-ekolan-maksimus
 *
 * Vraća status, personu i KPI metrike THEM apex agenta.
 *
 * @returns ThemSvega | 429 | 500
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/tarken-hingil-ekolan-maksimus'),
    THEM_RATE_LIMIT,
    THEM_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(THEM_RATE_WINDOW_SECONDS);
  }

  try {
    const rezultat = await buildThem();
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Them-Contract-Version', THEM_CONTRACT_VERSION);
    response.headers.set('X-Them-Model-Version', THEM_MODEL_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('tarken-hingil-ekolan-maksimus', error);
  }
}

/**
 * POST /api/tarken-hingil-ekolan-maksimus
 *
 * Pokreće THEM zadatak (strateška orkestracija, adaptivni signal, ekoloski monitoring, industrijska konvergencija).
 *
 * Body: ThemTaskInput
 *
 * @returns ThemTaskResult | 400 | 429 | 500
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/tarken-hingil-ekolan-maksimus/post'),
    THEM_RATE_LIMIT,
    THEM_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(THEM_RATE_WINDOW_SECONDS);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('BAD_REQUEST', 'Invalid JSON body');
  }

  const input = body as Partial<ThemTaskInput>;
  const validTipovi: ThemTaskInput['tip'][] = [
    'strateska-orkestracija',
    'adaptivni-signal',
    'ekoloski-monitoring',
    'industrijska-konvergencija',
  ];

  if (!input.tip || !validTipovi.includes(input.tip)) {
    return apiError(
      'BAD_REQUEST',
      `Neispravan tip zadatka. Dozvoljeni: ${validTipovi.join(', ')}`,
    );
  }

  try {
    const rezultat = await executeThemTask({
      tip: input.tip,
      kontekst: typeof input.kontekst === 'string' ? input.kontekst : undefined,
      prioritet: ['apex', 'visok', 'srednji', 'nizak'].includes(input.prioritet ?? '')
        ? (input.prioritet as ThemTaskInput['prioritet'])
        : 'apex',
      targetAgent: typeof input.targetAgent === 'string' ? input.targetAgent : undefined,
    });
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Them-Contract-Version', THEM_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('tarken-hingil-ekolan-maksimus', error);
  }
}

/**
 * PATCH /api/tarken-hingil-ekolan-maksimus
 *
 * Pokreće handoff na linked agent (MAKSIMUS 2/3 ili ANOTHER MAKS).
 *
 * Body: ThemHandoffRequest
 *
 * @returns ThemHandoffResult | 400 | 429 | 500
 */
export async function PATCH(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/tarken-hingil-ekolan-maksimus/handoff'),
    THEM_RATE_LIMIT,
    THEM_RATE_WINDOW_SECONDS,
  );

  if (!allowed) {
    return apiRateLimited(THEM_RATE_WINDOW_SECONDS);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('BAD_REQUEST', 'Invalid JSON body');
  }

  const req2 = body as Partial<ThemHandoffRequest>;
  const validAgents: ThemHandoffRequest['targetAgent'][] = ['maksimus-2', 'another-maks'];

  if (!req2.targetAgent || !validAgents.includes(req2.targetAgent)) {
    return apiError(
      'BAD_REQUEST',
      `Neispravan targetAgent. Dozvoljeni: ${validAgents.join(', ')}`,
    );
  }

  if (!req2.razlog || req2.razlog.trim().length === 0) {
    return apiError('BAD_REQUEST', 'Handoff zahteva razlog.');
  }

  try {
    const rezultat = executeHandoff({
      targetAgent: req2.targetAgent,
      razlog: req2.razlog,
      kontekst: typeof req2.kontekst === 'string' ? req2.kontekst : undefined,
    });
    const response = apiSuccess(rezultat, 200);
    response.headers.set('X-Them-Contract-Version', THEM_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('tarken-hingil-ekolan-maksimus/handoff', error);
  }
}

// Named export for info — used by engine registry / health checks
export function getThemRouteInfo() {
  return getThemInfo();
}
