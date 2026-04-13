import { NextResponse } from 'next/server';
import { getSeoNominalniProtok } from '@/lib/seo-nominalni-protok';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';

export async function GET() {
  const pregled = getSeoNominalniProtok();

  return NextResponse.json({
    status: pregled.status,
    naziv: pregled.naziv,
    opis: pregled.opis,
    verzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,

    referentnaStopa: pregled.referentnaStopa,
    eksplatacija: pregled.eksplatacija,

    kanali: pregled.kanali.map((k) => ({
      oktava: k.oktava,
      naziv: k.naziv,
      ikona: k.ikona,
      bazniProtok: k.bazniProtok,
      rastFaktor: k.rastFaktor,
      nominalniKapacitet: k.nominalniKapacitet,
      doprinos: k.doprinos,
      seoMetrike: k.seoMetrike,
    })),

    ciklusi: pregled.ciklusi,

    metrke: {
      ukupniKapacitet: pregled.ukupniKapacitet,
      prosecniProtok: pregled.prosecniProtok,
      efikasnost: pregled.efikasnost,
      seoScoreUkupni: pregled.seoScoreUkupni,
    },

    omegaIntegracija: pregled.omegaIntegracija,

    timestamp: pregled.timestamp,
  });
}
