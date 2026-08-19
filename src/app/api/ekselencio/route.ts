// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO API Route
// Kompanija SPAJA — Digitalna Industrija

import { NextResponse } from 'next/server';

import { evaluateEkselencio, getEkselencioHealthReport, upsertEkselencioSession } from '@/lib/ekselencio';
import { setEkselencioHeaders } from '@/lib/ekselencio/route-utils';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!body.agentId || typeof body.agentId !== 'string' || body.agentId.trim() === '') {
      return NextResponse.json(
        { error: 'agentId is required and must be a string' },
        { status: 400 },
      );
    }

    const result = evaluateEkselencio({
      agentId: body.agentId,
      domainScores: body.domainScores ?? {},
      context: body.context,
      historyVector: body.historyVector,
    });

    upsertEkselencioSession(result);

    const response = NextResponse.json(result, { status: 200 });
    setEkselencioHeaders(response, result);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function GET(): Promise<NextResponse> {
  const report = getEkselencioHealthReport();
  const response = NextResponse.json(report, { status: 200 });
  setEkselencioHeaders(response);
  return response;
}
