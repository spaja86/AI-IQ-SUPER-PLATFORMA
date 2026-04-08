import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  simulacije,
  laboratorijskiAlati,
  getAktivneSimulacije,
  getLaboratorijaStatistika,
} from '@/lib/io-openui-ao-laboratorija-simulacije';

export async function GET() {
  const statistika = getLaboratorijaStatistika();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'IOOpenUIAO Laboratorija za Simulacije — Status',
    verzija: APP_VERSION,
    link: 'https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6',
    ukupnoSimulacija: simulacije.length,
    aktivnihSimulacija: getAktivneSimulacije().length,
    ukupnoAlata: laboratorijskiAlati.length,
    prosecnaPreciznost: `${statistika.prosecnaPreciznost}%`,
    statistika,
    simulacije: simulacije.map((s) => ({
      naziv: s.naziv,
      kategorija: s.kategorija,
      status: s.status,
      preciznost: `${s.preciznost}%`,
    })),
    timestamp: new Date().toISOString(),
  });
}
