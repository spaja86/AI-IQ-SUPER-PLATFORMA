import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getEkslatacijaMetrike, getVrhunckiProizvodi } from '@/lib/ekslatacija-proizvoda';

export async function GET() {
  const metrike = getEkslatacijaMetrike();
  const top3 = getVrhunckiProizvodi(3);

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Ekslatacija Proizvoda — Pregled',
    verzija: APP_VERSION,

    pregled: {
      ukupnoProizvoda: metrike.ukupnoProizvoda,
      aktivnih: metrike.aktivnih,
      uPripremi: metrike.uPripremi,
      planirani: metrike.planirani,
      ukupanPotencijalPrihoda: metrike.ukupanPotencijalPrihoda,
      prosecniRast: metrike.prosecniRast,
      prosecnaPokrivenost: metrike.prosecnaPokrivenost,
      aktivnihKanala: metrike.aktivnihKanala,
    },

    poFazama: Object.entries(metrike.fazama).map(([faza, broj]) => ({ faza, broj })),
    poModelima: Object.entries(metrike.modelima).map(([model, broj]) => ({ model, broj })),

    top3Proizvoda: top3.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      faza: p.fazaEkslatacije,
      prihod: p.prihod,
    })),

    timestamp: new Date().toISOString(),
  });
}
