// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK API: /api/ekvivalent-network/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateEkvivalentNetwork, setEkvivalentHeaders } from '@/lib/ekvivalent-network';
import type { EkvivalentEdge, EkvivalentInput, EkvivalentNode } from '@/lib/ekvivalent-network';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;
    const { referenceId, nodes, edges, queryNodeId, queryDomain } = candidate;

    if (!Array.isArray(nodes) || nodes.length === 0) {
      return apiError('BAD_REQUEST', 'nodes is required (non-empty array)');
    }

    if (!Array.isArray(edges)) {
      return apiError('BAD_REQUEST', 'edges is required (array)');
    }

    const input: EkvivalentInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      nodes: nodes as EkvivalentNode[],
      edges: edges as EkvivalentEdge[],
      queryNodeId: typeof queryNodeId === 'string' ? queryNodeId : undefined,
      queryDomain: typeof queryDomain === 'string' ? (queryDomain as EkvivalentInput['queryDomain']) : undefined,
    };

    const result = evaluateEkvivalentNetwork(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setEkvivalentHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('ekvivalent-network/evaluate', error);
  }
}
