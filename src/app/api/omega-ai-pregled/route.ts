import { NextResponse } from 'next/server';
import {
  omegaPersone,
  getAktivnePersone,
  getBrojPoOktavi,
  oktavniNazivi,
} from '@/lib/omega-ai';
import { APP_VERSION, OMEGA_AI_PERSONA_COUNT, OMEGA_AI_OKTAVA_COUNT } from '@/lib/constants';

export async function GET() {
  const aktivne = getAktivnePersone();
  const poOktavi = getBrojPoOktavi();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA AI Pregled — Kompletni AI Persona Sistem',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
      aktivnih: aktivne.length,
      oktava: OMEGA_AI_OKTAVA_COUNT,
    },

    poOktavi: Object.entries(poOktavi).map(([oktava, broj]) => ({
      oktava: Number(oktava),
      naziv: oktavniNazivi[Number(oktava) as keyof typeof oktavniNazivi] ?? `Oktava ${oktava}`,
      persona: broj,
    })),

    persone: omegaPersone.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      kategorija: p.kategorija,
      oktavniNivo: p.oktavniNivo,
    })),

    timestamp: new Date().toISOString(),
  });
}
