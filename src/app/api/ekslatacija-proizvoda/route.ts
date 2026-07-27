import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getEkslatacijaPregled } from '@/lib/ekslatacija-proizvoda';

export async function GET() {
  const pregled = getEkslatacijaPregled();

  return NextResponse.json({
    naziv: pregled.naziv,
    verzija: pregled.verzija,
    status: pregled.status,
    timestamp: pregled.timestamp,
    kompanija: pregled.kompanija,
    appVerzija: APP_VERSION,

    metrike: {
      ukupnoProizvoda: pregled.metrike.ukupnoProizvoda,
      aktivnih: pregled.metrike.aktivnih,
      uPripremi: pregled.metrike.uPripremi,
      planirani: pregled.metrike.planirani,
      povuceni: pregled.metrike.povuceni,
      ukupanPotencijalPrihoda: pregled.metrike.ukupanPotencijalPrihoda,
      prosecniRast: pregled.metrike.prosecniRast,
      prosecnaPokrivenost: pregled.metrike.prosecnaPokrivenost,
      aktivnihKanala: pregled.metrike.aktivnihKanala,
    },

    poFazama: pregled.poFazama,
    poModelima: pregled.poModelima,

    vrhunckiProizvodi: pregled.vrhunckiProizvodi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      faza: p.fazaEkslatacije,
      model: p.komercijalnIModel,
      prihod: p.prihod,
      rast: p.rast,
      trzisnaPokrivenost: p.trzisnaPokrivenost,
      konkurentnostIndex: p.konkurentnostIndex,
    })),

    kanali: pregled.kanali.map((k) => ({
      id: k.id,
      naziv: k.naziv,
      tip: k.tip,
      aktivnih: k.aktivnih,
      potencijalEUR: k.potencijalEUR,
    })),

    sviProizvodi: pregled.sviProizvodi,
  });
}
