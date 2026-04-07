import { NextResponse } from 'next/server';
import { dimenzije } from '@/lib/dimenzije';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const nivoi = dimenzije.map((d) => d.nivo);
  const unikatniNivoi = [...new Set(nivoi)];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Dimenzije Status',
    verzija: APP_VERSION,

    pregled: {
      ukupnoDimenzija: dimenzije.length,
      nivoi: unikatniNivoi,
      raspon: `${unikatniNivoi[0]} — ${unikatniNivoi[unikatniNivoi.length - 1]}`,
      geometrijskiSlojevi: ['elipsoid', 'rezonanca', 'hiperbola', 'spirala'],
      zakoni: ['manifestacija', 'materijalizacija', 'hiperbolicki', 'algoritam-ekstazi', 'autorealizacija', 'sinhonometrijski'],
    },

    dimenzije: dimenzije.map((d) => ({
      id: d.id,
      naziv: d.naziv,
      nivo: d.nivo,
      tip: d.tip,
      opis: d.opis,
    })),

    timestamp: new Date().toISOString(),
  });
}
