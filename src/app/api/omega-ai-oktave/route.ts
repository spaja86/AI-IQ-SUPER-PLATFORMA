import { NextResponse } from 'next/server';
import {
  getPersonePoOktavi,
  getBrojPoOktavi,
  oktavniNazivi,
  getAktivnePersone,
} from '@/lib/omega-ai';
import {
  APP_VERSION,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
} from '@/lib/constants';
import type { OktavniNivo } from '@/lib/omega-ai';

export async function GET() {
  const brojPoOktavi = getBrojPoOktavi();
  const aktivne = getAktivnePersone();

  const oktave = (Object.keys(oktavniNazivi) as unknown as OktavniNivo[]).map((nivo) => {
    const persone = getPersonePoOktavi(nivo);
    return {
      nivo,
      naziv: oktavniNazivi[nivo],
      persone: persone.length,
      aktivnih: persone.filter((p) => p.aktivna).length,
      lista: persone.map((p) => ({ id: p.id, naziv: p.naziv, aktivna: p.aktivna })),
    };
  });

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA AI Oktave — Oktavni Sistem',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
      ukupnoOktava: OMEGA_AI_OKTAVA_COUNT,
      aktivnih: aktivne.length,
    },

    brojPoOktavi,
    oktave,

    timestamp: new Date().toISOString(),
  });
}
