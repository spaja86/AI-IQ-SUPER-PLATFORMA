import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  listPersonas,
  registerPersona,
  bulkImportPersonas,
  PERSONA_BANK_CONTRACT_VERSION,
} from '@/lib/persona-bank';
import type { PersonaBankListFilter, PersonaRegistrationInput, PersonaType, PersonaStatus } from '@/lib/persona-bank';

export const dynamic = 'force-dynamic';

/**
 * GET /api/persona-bank
 *
 * Returns all personas, with optional filters: type, status, octave, agent.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter: PersonaBankListFilter = {};

    const type = searchParams.get('type');
    if (type) filter.type = type as PersonaType;

    const status = searchParams.get('status');
    if (status) filter.status = status as PersonaStatus;

    const octaveRaw = searchParams.get('octave');
    if (octaveRaw) {
      const octave = parseInt(octaveRaw, 10);
      if (!isNaN(octave)) filter.octave = octave;
    }

    const agent = searchParams.get('agent');
    if (agent) filter.agent = agent;

    const personas = listPersonas(filter);
    const response = apiSuccess({ personas, count: personas.length }, 200);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('persona-bank', error);
  }
}

/**
 * POST /api/persona-bank
 *
 * Register a new persona or bulk import an array of personas.
 * Requires X-Agent-Id header.
 *
 * Single: PersonaRegistrationInput
 * Bulk: { personas: PersonaRegistrationInput[] }
 */
export async function POST(req: NextRequest) {
  const agentId = req.headers.get('x-agent-id');
  if (!agentId) {
    return apiError('BAD_REQUEST', 'X-Agent-Id header is required', 400);
  }

  try {
    const body: unknown = await req.json();

    if (body && typeof body === 'object' && 'personas' in body && Array.isArray((body as { personas: unknown }).personas)) {
      const inputs = (body as { personas: PersonaRegistrationInput[] }).personas;
      const result = bulkImportPersonas(inputs, agentId);
      const response = apiSuccess(result, 200);
      response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
      return response;
    }

    const input = body as PersonaRegistrationInput;
    if (!input.name || !input.type || input.octave === undefined || input.hipermrezaNode === undefined || !input.attributes) {
      return apiError('BAD_REQUEST', 'Missing required fields: name, type, octave, hipermrezaNode, attributes', 400);
    }

    const persona = registerPersona(input, agentId);
    const response = apiSuccess(persona, 201);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('persona-bank', error);
  }
}
