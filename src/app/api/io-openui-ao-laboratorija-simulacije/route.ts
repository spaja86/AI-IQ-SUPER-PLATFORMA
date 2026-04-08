import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  simulacije,
  getAktivneSimulacije,
  getSimulacijePoKategoriji,
} from '@/lib/io-openui-ao-laboratorija-simulacije';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    sistem: 'IOOpenUIAO Laboratorija — Simulacije',
    verzija: APP_VERSION,
    ukupnoSimulacija: simulacije.length,
    aktivnihSimulacija: getAktivneSimulacije().length,
    simulacijePoKategoriji: {
      fizika: getSimulacijePoKategoriji('fizika').length,
      hemija: getSimulacijePoKategoriji('hemija').length,
      biologija: getSimulacijePoKategoriji('biologija').length,
      matematika: getSimulacijePoKategoriji('matematika').length,
      'ai-ml': getSimulacijePoKategoriji('ai-ml').length,
      inzenjerstvo: getSimulacijePoKategoriji('inzenjerstvo').length,
      ekonomija: getSimulacijePoKategoriji('ekonomija').length,
      ekologija: getSimulacijePoKategoriji('ekologija').length,
    },
    simulacije: simulacije.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      opis: s.opis,
      ikona: s.ikona,
      kategorija: s.kategorija,
      status: s.status,
      verzija: s.verzija,
      parametri: s.parametri,
      rezultati: s.rezultati,
      preciznost: `${s.preciznost}%`,
    })),
    timestamp: new Date().toISOString(),
  });
}
