import { NextResponse } from 'next/server';
import {
  spajaDigitalniBrouvzer,
  brouvzerEntiteti,
  brouvzerModuli,
  getAktivniEntiteti,
  getAktivniModuli,
  getBrouvzerStatistika,
  ekstremniMotori,
  ekstremniBackend,
  providniFrontendKomponente,
} from '@/lib/spaja-digitalni-brouvzer';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const statistika = getBrouvzerStatistika();
  const aktivniEnt = getAktivniEntiteti();
  const aktivniMod = getAktivniModuli();

  return NextResponse.json({
    sistem: 'SPAJA Digitalni Brouvzer — EKSTREMNI',
    verzija: spajaDigitalniBrouvzer.verzija,
    appVerzija: APP_VERSION,
    opis: spajaDigitalniBrouvzer.opis,
    link: spajaDigitalniBrouvzer.link,
    generatorLink: spajaDigitalniBrouvzer.generatorLink,
    bazaLink: spajaDigitalniBrouvzer.bazaLink,
    ekstremniRezim: spajaDigitalniBrouvzer.ekstremniRezim,
    ukupnoEntiteta: brouvzerEntiteti.length,
    aktivnihEntiteta: aktivniEnt.length,
    ukupnoModula: brouvzerModuli.length,
    aktivnihModula: aktivniMod.length,
    ukupnoMotora: ekstremniMotori.length,
    ukupnoBackendServisa: ekstremniBackend.length,
    ukupnoFrontendKomponenti: providniFrontendKomponente.length,
    statistika,
    entiteti: brouvzerEntiteti,
    moduli: brouvzerModuli,
    timestamp: new Date().toISOString(),
  });
}
