import { NextResponse } from 'next/server';
import { getZvanicnoOtvaranje } from '@/lib/omega-projekat-zvanicno-otvaranje';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const otvaranje = getZvanicnoOtvaranje();

  return NextResponse.json({
    status: otvaranje.status,
    verzija: APP_VERSION,
    naziv: otvaranje.naziv,
    opis: otvaranje.opis,
    datumOtvaranja: otvaranje.datumOtvaranja,
    saglasnostOsnivaca: otvaranje.saglasnostOsnivaca,

    monologVerifikacija: otvaranje.monologVerifikacija,

    potvrde: otvaranje.potvrde.map((p) => ({
      redosled: p.redosled,
      naziv: p.naziv,
      faza: p.faza,
      status: p.status,
      datum: p.datum,
    })),

    ekosistem: otvaranje.ekosistem,

    summary: {
      ukupnoPotvrda: otvaranje.ukupnoPotvrda,
      potvrdjenihPotvrda: otvaranje.potvrdjenihPotvrda,
      procenat: `${Math.round((otvaranje.potvrdjenihPotvrda / otvaranje.ukupnoPotvrda) * 100)}%`,
    },

    timestamp: new Date().toISOString(),
  });
}
