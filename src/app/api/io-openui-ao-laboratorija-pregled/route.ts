import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  ioOpenUIAOLaboratorija,
  simulacije,
  laboratorijskiAlati,
  getAktivneSimulacije,
  getLaboratorijaStatistika,
} from '@/lib/io-openui-ao-laboratorija-simulacije';

export async function GET() {
  const statistika = getLaboratorijaStatistika();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'IOOpenUIAO Laboratorija za Simulacije — Pregled',
    verzija: APP_VERSION,
    labVerzija: ioOpenUIAOLaboratorija.verzija,
    link: ioOpenUIAOLaboratorija.link,
    generatorLink: ioOpenUIAOLaboratorija.generatorLink,
    opis: ioOpenUIAOLaboratorija.opis,
    pregled: {
      ukupnoSimulacija: simulacije.length,
      aktivnihSimulacija: getAktivneSimulacije().length,
      ukupnoAlata: laboratorijskiAlati.length,
      prosecnaPreciznost: statistika.prosecnaPreciznost,
      ukupnoKategorija: statistika.ukupnoKategorija,
    },
    simulacije: simulacije.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      kategorija: s.kategorija,
      status: s.status,
      verzija: s.verzija,
      preciznost: `${s.preciznost}%`,
      parametri: s.parametri.length,
      rezultati: s.rezultati.length,
    })),
    alati: laboratorijskiAlati.map((a) => ({
      id: a.id,
      naziv: a.naziv,
      tip: a.tip,
      mogucnosti: a.mogucnosti.length,
    })),
    timestamp: new Date().toISOString(),
  });
}
