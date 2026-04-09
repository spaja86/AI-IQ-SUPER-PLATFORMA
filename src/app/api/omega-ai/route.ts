import { NextResponse } from 'next/server';
import { createDispatch, getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { omegaPersone } from '@/lib/omega-ai';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const dispatch = createDispatch();
  const summary = getDispatchSummary();

  return NextResponse.json({
    sistem: 'OMEGA AI Dispatch',
    verzija: APP_VERSION,
    arhitektura: 'sekvencijalno-oktavni',
    ukupnoPersona: omegaPersone.length,
    ukupnoOktava: 8,
    dispatch,
    summary,
    timestamp: new Date().toISOString(),
  });
}
