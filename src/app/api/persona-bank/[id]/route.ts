import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getPersona,
  updatePersona,
  archivePersona,
  PERSONA_BANK_CONTRACT_VERSION,
} from '@/lib/persona-bank';
import type { PersonaUpdateInput } from '@/lib/persona-bank';

export const dynamic = 'force-dynamic';

/**
 * GET /api/persona-bank/[id]
 *
 * Returns a single persona including full audit history.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const persona = getPersona(id);
    if (!persona) {
      return apiError('NOT_FOUND', `Persona not found: ${id}`, 404);
    }
    const response = apiSuccess(persona, 200);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('persona-bank', error);
  }
}

/**
 * PUT /api/persona-bank/[id]
 *
 * Updates mutable fields of a persona.
 * Requires X-Agent-Id header.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agentId = req.headers.get('x-agent-id');
  if (!agentId) {
    return apiError('BAD_REQUEST', 'X-Agent-Id header is required', 400);
  }

  try {
    const input: PersonaUpdateInput = await req.json();
    const persona = updatePersona(id, input, agentId);
    const response = apiSuccess(persona, 200);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Persona not found')) {
      return apiError('NOT_FOUND', error.message, 404);
    }
    if (error instanceof Error && error.message.startsWith('Cannot update archived')) {
      return apiError('CONFLICT', error.message, 409);
    }
    return apiInternalError('persona-bank', error);
  }
}

/**
 * POST /api/persona-bank/[id]/archive
 *
 * Soft-deletes (archives) a persona.
 * Requires X-Agent-Id header.
 * NOTE: archive action is handled by a sub-route; this endpoint is kept for
 * completeness but will 404 unless routing matches exactly.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agentId = req.headers.get('x-agent-id');
  if (!agentId) {
    return apiError('BAD_REQUEST', 'X-Agent-Id header is required', 400);
  }

  try {
    const persona = archivePersona(id, agentId);
    const response = apiSuccess(persona, 200);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Persona not found')) {
      return apiError('NOT_FOUND', error.message, 404);
    }
    return apiInternalError('persona-bank', error);
  }
}
