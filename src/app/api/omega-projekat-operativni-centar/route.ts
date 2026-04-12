import { NextResponse } from 'next/server';
import { getOperativniCentar } from '@/lib/omega-projekat-operativni-centar';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const centar = getOperativniCentar();

  return NextResponse.json({
    status: centar.status,
    verzija: APP_VERSION,
    naziv: centar.naziv,
    opis: centar.opis,

    pregled: {
      ukupnoModula: centar.ukupnoModula,
      aktivnihModula: centar.aktivnihModula,
      ukupnoZdravlje: `${centar.ukupnoZdravlje}%`,
    },

    moduli: centar.moduli.map((m) => ({
      id: m.id,
      naziv: m.naziv,
      opis: m.opis,
      ikona: m.ikona,
      status: m.status,
      zdravlje: `${m.zdravlje}%`,
      metrike: m.metrike,
    })),

    ekosistem: centar.ekosistemPregled,
    milestone: centar.milestone,

    timestamp: new Date().toISOString(),
  });
}
