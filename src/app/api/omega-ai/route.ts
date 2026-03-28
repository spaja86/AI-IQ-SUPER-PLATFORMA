import { NextResponse } from 'next/server';
import { createDispatch, getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { omegaPersone } from '@/lib/omega-ai';

export async function GET() {
  const dispatch = createDispatch();
  const summary = getDispatchSummary();

  return NextResponse.json({
    sistem: 'OMEGA AI Dispatch',
    verzija: '1.0.0',
    arhitektura: 'sekvencijalno-oktavni',
    ukupnoPersona: omegaPersone.length,
    ukupnoOktava: 8,
    dispatch,
    summary,
    timestamp: new Date().toISOString(),
  });
}
