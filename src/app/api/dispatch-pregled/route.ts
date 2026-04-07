import { NextResponse } from 'next/server';
import {
  createDispatch,
  getDispatchSummary,
} from '@/lib/omega-ai-dispatch';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const dispatch = createDispatch();
  const summary = getDispatchSummary();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Dispatch Pregled — OMEGA AI Dispatch Sistem',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPersona: summary.ukupnoPersona,
      ukupnoOktava: summary.ukupnoOktava,
      zavrsenih: summary.zavrsenih,
      status: summary.status,
    },

    dispatch: {
      ukupnoPersona: dispatch.ukupnoPersona,
      ukupnoOktava: dispatch.ukupnoOktava,
      zavrsenih: dispatch.zavrsenih,
      aktivnih: dispatch.aktivnih,
      ceka: dispatch.ceka,
      timestamp: dispatch.timestamp,
    },

    summary,

    timestamp: new Date().toISOString(),
  });
}
