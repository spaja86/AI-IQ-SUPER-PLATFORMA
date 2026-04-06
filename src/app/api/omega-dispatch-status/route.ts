import { NextResponse } from 'next/server';
import { createDispatch, getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const dispatch = createDispatch();
  const summary = getDispatchSummary();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA AI Dispatch Status',
    verzija: APP_VERSION,

    dispatch: {
      ukupnoPersona: summary.ukupnoPersona,
      ukupnoOktava: summary.ukupnoOktava,
      zavrsenih: summary.zavrsenih,
      status: summary.status,
    },

    sinhronizacija: {
      mod: dispatch.sinhronizacija.mod,
      status: dispatch.sinhronizacija.status,
      ukupniProgres: dispatch.sinhronizacija.ukupniProgres,
    },

    matricnoJezgro: {
      dimenzija: dispatch.matricnoJezgro.dimenzija,
      ukupnoVeza: dispatch.matricnoJezgro.ukupnoVeza,
      aktivnihVeza: dispatch.matricnoJezgro.aktivnihVeza,
      status: dispatch.matricnoJezgro.status,
    },

    neuroloskaMreza: {
      ukupnoCvorova: dispatch.neuroloskaMreza.ukupnoCvorova,
      ukupnoSinapsi: dispatch.neuroloskaMreza.ukupnoSinapsi,
      prosecnaAktivacija: dispatch.neuroloskaMreza.prosecnaAktivacija,
      status: dispatch.neuroloskaMreza.status,
    },

    timestamp: new Date().toISOString(),
  });
}
