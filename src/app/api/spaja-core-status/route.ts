import { NextResponse } from 'next/server';
import { paradigme, tipoviPodataka, operatori, naredbe, kompajlerFaze } from '@/lib/spaja-ultra-omega-core';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SpajaUltraOmegaCore -∞Ω+∞ Status',
    verzija: APP_VERSION,

    jezgro: {
      paradigmi: paradigme.length,
      tipovaPodataka: tipoviPodataka.length,
      operatora: operatori.length,
      naredbi: naredbe.length,
      kompajlerFaza: kompajlerFaze.length,
    },

    paradigme: paradigme.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      paradigma: p.paradigma,
    })),

    kompajler: kompajlerFaze.map((f) => ({
      id: f.id,
      naziv: f.naziv,
      redosled: f.redosled,
    })),

    statistike: {
      ukupnoEntiteta: paradigme.length + tipoviPodataka.length + operatori.length + naredbe.length + kompajlerFaze.length,
      spektar: '-∞Ω+∞',
      oktavnihNivoa: 8,
      matricnoJezgro: '8×8',
    },

    timestamp: new Date().toISOString(),
  });
}
