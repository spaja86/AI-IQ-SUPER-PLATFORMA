import { NextResponse } from 'next/server';
import { sajtovi, getSajtoviPoKategoriji, getBrojSajtova } from '@/lib/sajtovi';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    ukupno: getBrojSajtova(),
    kategorije: {
      ekosistem: getSajtoviPoKategoriji('ekosistem').length,
      tehnolosiPartner: getSajtoviPoKategoriji('tehnoloski-partner').length,
      drustvenaMreza: getSajtoviPoKategoriji('drustvena-mreza').length,
    },
    sajtovi: sajtovi.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      url: s.url,
      ikona: s.ikona,
      kategorija: s.kategorija,
      opis: s.opis,
    })),
    timestamp: new Date().toISOString(),
  });
}
