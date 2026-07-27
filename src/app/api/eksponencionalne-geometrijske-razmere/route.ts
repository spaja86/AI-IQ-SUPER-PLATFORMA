import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getEksponencionalneGeometrijskeRazmere } from '@/lib/eksponencionalne-geometrijske-razmere';

export async function GET() {
  const razmere = getEksponencionalneGeometrijskeRazmere();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Eksponencionalne Geometrijske Razmere',
    opis: 'Kombinovani model razmera kroz 12 oktava i dimenzionalni opseg 360D–5760D.',
    verzija: APP_VERSION,
    sazetak: {
      scope: razmere.scope,
      oktavniModel: razmere.oktavniModel,
      obavezniIzlazi: razmere.obavezniIzlazi,
      kombinovaniIndeks: razmere.agregati.kombinovaniIndeks,
      dominantniDomen: razmere.agregati.dominantniDomen,
      validacija: razmere.validacija,
    },
    detalji: razmere,
    timestamp: new Date().toISOString(),
  });
}
