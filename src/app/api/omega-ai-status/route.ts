import { NextResponse } from 'next/server';
import { omegaPersone, type OmegaKategorija } from '@/lib/omega-ai';
import { APP_VERSION, OMEGA_AI_PERSONA_COUNT, OMEGA_AI_OKTAVA_COUNT } from '@/lib/constants';

export async function GET() {
  const kategorije = [...new Set(omegaPersone.map((p) => p.kategorija))] as OmegaKategorija[];
  const poKategoriji = kategorije.map((kat) => ({
    kategorija: kat,
    persona: omegaPersone.filter((p) => p.kategorija === kat).length,
  }));

  const poOktavi = Array.from({ length: OMEGA_AI_OKTAVA_COUNT }, (_, i) => ({
    oktava: i + 1,
    persona: omegaPersone.filter((p) => p.oktavniNivo === (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8).length,
  }));

  const aktivne = omegaPersone.filter((p) => p.aktivna);

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA AI Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
      detektovano: omegaPersone.length,
      aktivnih: aktivne.length,
      oktava: OMEGA_AI_OKTAVA_COUNT,
      kategorija: kategorije.length,
    },

    poKategoriji,
    poOktavi,

    persone: omegaPersone.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      kategorija: p.kategorija,
      oktavniNivo: p.oktavniNivo,
      prioritet: p.prioritet,
      aktivna: p.aktivna,
    })),

    timestamp: new Date().toISOString(),
  });
}
