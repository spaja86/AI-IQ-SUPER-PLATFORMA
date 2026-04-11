import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
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

export async function GET() {
  const statistika = getBrouvzerStatistika();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Digitalni Brouvzer — EKSTREMNI — Pregled',
    verzija: APP_VERSION,
    brouvzerVerzija: spajaDigitalniBrouvzer.verzija,
    link: spajaDigitalniBrouvzer.link,
    generatorLink: spajaDigitalniBrouvzer.generatorLink,
    bazaLink: spajaDigitalniBrouvzer.bazaLink,
    opis: spajaDigitalniBrouvzer.opis,
    ekstremniRezim: spajaDigitalniBrouvzer.ekstremniRezim,
    pregled: {
      ukupnoEntiteta: brouvzerEntiteti.length,
      aktivnihEntiteta: getAktivniEntiteti().length,
      ukupnoModula: brouvzerModuli.length,
      aktivnihModula: getAktivniModuli().length,
      ukupnoMotora: ekstremniMotori.length,
      ukupnoBackendServisa: ekstremniBackend.length,
      ukupnoFrontendKomponenti: providniFrontendKomponente.length,
      pokrivenostIndustrije: statistika.pokrivenostIndustrije,
    },
    entiteti: brouvzerEntiteti.map((e) => ({
      id: e.id,
      naziv: e.naziv,
      tip: e.tip,
      status: e.status,
      kategorija: e.kategorija,
      url: e.url,
      funkcije: e.funkcije.length,
    })),
    moduli: brouvzerModuli.map((m) => ({
      id: m.id,
      naziv: m.naziv,
      status: m.status,
      verzija: m.verzija,
      mogucnosti: m.mogucnosti.length,
    })),
    motori: ekstremniMotori.map((m) => ({
      id: m.id,
      naziv: m.naziv,
      tip: m.tip,
      verzija: m.verzija,
      mogucnosti: m.mogucnosti.length,
    })),
    timestamp: new Date().toISOString(),
  });
}
