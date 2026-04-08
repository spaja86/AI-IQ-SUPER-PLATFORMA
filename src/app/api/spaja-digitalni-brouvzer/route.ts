import { NextResponse } from 'next/server';
import {
  spajaDigitalniBrouvzer,
  brouvzerEntiteti,
  brouvzerModuli,
  getAktivniEntiteti,
  getAktivniModuli,
  getBrouvzerStatistika,
} from '@/lib/spaja-digitalni-brouvzer';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const statistika = getBrouvzerStatistika();
  const aktivniEnt = getAktivniEntiteti();
  const aktivniMod = getAktivniModuli();

  return NextResponse.json({
    sistem: 'SPAJA Digitalni Brouvzer',
    verzija: spajaDigitalniBrouvzer.verzija,
    appVerzija: APP_VERSION,
    opis: spajaDigitalniBrouvzer.opis,
    link: spajaDigitalniBrouvzer.link,
    generatorLink: spajaDigitalniBrouvzer.generatorLink,
    ukupnoEntiteta: brouvzerEntiteti.length,
    aktivnihEntiteta: aktivniEnt.length,
    ukupnoModula: brouvzerModuli.length,
    aktivnihModula: aktivniMod.length,
    statistika,
    entiteti: brouvzerEntiteti,
    moduli: brouvzerModuli,
    timestamp: new Date().toISOString(),
  });
}
