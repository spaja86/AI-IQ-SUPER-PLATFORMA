import { NextResponse } from 'next/server';
import {
  dimenzije,
  geometrijskeForme,
  zakoniManifestacije,
  dimenzionalniSistem,
  getBrojAktivnihDimenzija,
  getBrojSpoljasnjihDimenzija,
} from '@/lib/dimenzije';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivnih = getBrojAktivnihDimenzija();
  const spoljasnje = getBrojSpoljasnjihDimenzija();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Dimenzije Pregled — Kompletni Dimenzionalni Sistem',
    verzija: APP_VERSION,

    pregled: {
      ukupnoDimenzija: dimenzije.length,
      aktivnih,
      spoljasnje,
      geometrijskihFormi: geometrijskeForme.length,
      zakonaManifestacije: zakoniManifestacije.length,
    },

    sistem: {
      naziv: dimenzionalniSistem.naziv,
      ukupnihDimenzija: dimenzionalniSistem.ukupnihDimenzija,
      cirkularnaBaza: dimenzionalniSistem.cirkularnaBaza,
    },

    dimenzije: dimenzije.map((d) => ({
      id: d.id,
      naziv: d.naziv,
      ikona: d.ikona,
      tip: d.tip,
      nivo: d.nivo,
    })),

    forme: geometrijskeForme.map((f) => ({
      id: f.id,
      naziv: f.naziv,
      ikona: f.ikona,
      sloj: f.sloj,
    })),

    timestamp: new Date().toISOString(),
  });
}
