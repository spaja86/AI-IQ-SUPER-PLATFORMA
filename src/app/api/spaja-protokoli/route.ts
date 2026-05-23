import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  PROKSI_KAPACITET,
  MOBILNE_CENTRALE,
} from '@/lib/constants';
import { protokolManager } from '@/lib/protokoli/manager';

export async function GET() {
  const protokoli = protokolManager
    .getAll()
    .filter((protokol) => protokol.izvor === 'spaja-protokoli')
    .map((protokol) => ({
      naziv: protokol.naziv,
      verzija: protokol.verzija,
      tip: protokol.kategorija,
      opis: protokol.opis,
      kapacitet: protokol.kapacitet,
      latency: protokol.latency,
      status: protokol.status,
    }));

  const enkapsulacija = {
    formati: ['JSON', 'Binary', 'MatrixFormat', 'StreamFormat'],
    kompresija: 'OMEGA-LZ (prilagođeni algoritam)',
    enkripcija: 'AES-256 + MatrixCrypt',
    autentifikacija: 'OMEGA-Token + API Key',
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SpajaPro Protokoli — Transfer i Komunikacija',
    verzija: APP_VERSION,

    protokoli,
    ukupnoProtokola: protokoli.length,
    enkapsulacija,

    infrastruktura: {
      proksiKapacitet: PROKSI_KAPACITET,
      mobilneCentrale: MOBILNE_CENTRALE,
      aktivniProtokoli: protokoli.length,
    },

    timestamp: new Date().toISOString(),
  });
}
