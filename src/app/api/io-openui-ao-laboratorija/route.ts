import { NextResponse } from 'next/server';
import {
  ioOpenUIAOLaboratorija,
  simulacije,
  laboratorijskiAlati,
  getAktivneSimulacije,
  getLaboratorijaStatistika,
} from '@/lib/io-openui-ao-laboratorija-simulacije';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const statistika = getLaboratorijaStatistika();
  const aktivneSim = getAktivneSimulacije();

  return NextResponse.json({
    sistem: 'IOOpenUIAO Laboratorija za Simulacije',
    verzija: ioOpenUIAOLaboratorija.verzija,
    appVerzija: APP_VERSION,
    opis: ioOpenUIAOLaboratorija.opis,
    link: ioOpenUIAOLaboratorija.link,
    generatorLink: ioOpenUIAOLaboratorija.generatorLink,
    ukupnoSimulacija: simulacije.length,
    aktivnihSimulacija: aktivneSim.length,
    ukupnoAlata: laboratorijskiAlati.length,
    statistika,
    simulacije,
    alati: laboratorijskiAlati,
    timestamp: new Date().toISOString(),
  });
}
