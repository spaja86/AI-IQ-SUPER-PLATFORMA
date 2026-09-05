import { createHash, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_WORLD_BANK_PERSONA_AGENT,
  EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION,
  EXTRIMLI_WORLD_BANK_PERSONA_MODULE_VERSION,
  PERSONA_BANK_CONTRACT_VERSION,
  getExtrimliWorldBankPersonaReport,
} from '@/lib/extrimli-world-bank-persona';
import type { ExtrimliExtrondolGovernanceEvidence } from '@/lib/extrimli-extrondol';

export const dynamic = 'force-dynamic';

function tokensMatch(expectedToken: string, providedToken: string): boolean {
  const expectedDigest = createHash('sha256').update(expectedToken, 'utf8').digest();
  const providedDigest = createHash('sha256').update(providedToken, 'utf8').digest();
  return timingSafeEqual(expectedDigest, providedDigest);
}

export async function GET() {
  try {
    const report = getExtrimliWorldBankPersonaReport({ mode: 'preview' });
    const response = apiSuccess(report, 200);
    response.headers.set('X-Extrimli-WorldBankPersona-Contract-Version', EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION);
    response.headers.set('X-Extrimli-WorldBankPersona-Module-Version', EXTRIMLI_WORLD_BANK_PERSONA_MODULE_VERSION);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/world-bank-persona', error);
  }
}

export async function POST(req: NextRequest) {
  const configuredExpectedToken = process.env.EXTRIMLI_WORLD_BANK_PERSONA_APPLY_TOKEN;
  if (!configuredExpectedToken) {
    return apiError('INTERNAL_ERROR', 'EXTRIMLI_WORLD_BANK_PERSONA_APPLY_TOKEN is not configured', 500);
  }
  const expectedToken = configuredExpectedToken;
  const providedToken = req.headers.get('x-extrimli-bridge-token') ?? '__missing-provided-bridge-token__';
  const authorized = tokensMatch(expectedToken, providedToken);
  if (!authorized) {
    return apiError('FORBIDDEN', 'Server-authenticated bridge token is required for persona apply', 403);
  }

  try {
    let body: unknown = {};
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;
    const includeSubflows = typeof candidate.includeSubflows === 'boolean' ? candidate.includeSubflows : true;
    const evidenceInput = candidate.evidence;
    const evidence: ExtrimliExtrondolGovernanceEvidence | undefined = evidenceInput
      && typeof evidenceInput === 'object'
      && !Array.isArray(evidenceInput)
      ? {
        auditTrailComplete: typeof (evidenceInput as Record<string, unknown>).auditTrailComplete === 'boolean'
          ? (evidenceInput as Record<string, boolean>).auditTrailComplete
          : undefined,
        downstreamSyncComplete: typeof (evidenceInput as Record<string, unknown>).downstreamSyncComplete === 'boolean'
          ? (evidenceInput as Record<string, boolean>).downstreamSyncComplete
          : undefined,
        humanReviewComplete: typeof (evidenceInput as Record<string, unknown>).humanReviewComplete === 'boolean'
          ? (evidenceInput as Record<string, boolean>).humanReviewComplete
          : undefined,
        onboardingComplete: typeof (evidenceInput as Record<string, unknown>).onboardingComplete === 'boolean'
          ? (evidenceInput as Record<string, boolean>).onboardingComplete
          : undefined,
      }
      : undefined;

    const report = getExtrimliWorldBankPersonaReport({
      mode: 'apply',
      agentId: EXTRIMLI_WORLD_BANK_PERSONA_AGENT,
      includeSubflows,
      evidence,
    });
    const response = apiSuccess(report, 200);
    response.headers.set('X-Extrimli-WorldBankPersona-Contract-Version', EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION);
    response.headers.set('X-Extrimli-WorldBankPersona-Module-Version', EXTRIMLI_WORLD_BANK_PERSONA_MODULE_VERSION);
    response.headers.set('X-PersonaBank-Contract-Version', PERSONA_BANK_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/world-bank-persona', error);
  }
}
