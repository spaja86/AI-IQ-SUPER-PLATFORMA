import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  spajaDigitalniBrouvzer,
  ekstremniMotori,
  ekstremniBackend,
  providniFrontendKomponente,
  getEkstremniMotori,
  getEkstremniBackend,
  getProvidniFrontend,
  getEkstremneMogucnosti,
  getBrouvzerStatistika,
} from '@/lib/spaja-digitalni-brouvzer';

export async function GET() {
  const statistika = getBrouvzerStatistika();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Digitalni Brouvzer — EKSTREMNI',
    verzija: APP_VERSION,
    brouvzerVerzija: spajaDigitalniBrouvzer.verzija,
    ekstremniRezim: spajaDigitalniBrouvzer.ekstremniRezim,
    link: spajaDigitalniBrouvzer.link,
    generatorLink: spajaDigitalniBrouvzer.generatorLink,
    bazaLink: spajaDigitalniBrouvzer.bazaLink,
    opis: spajaDigitalniBrouvzer.opis,
    motori: {
      ukupno: ekstremniMotori.length,
      aktivnih: getEkstremniMotori().length,
      lista: ekstremniMotori.map((m) => ({
        id: m.id,
        naziv: m.naziv,
        tip: m.tip,
        status: m.status,
        verzija: m.verzija,
        mogucnosti: m.mogucnosti,
      })),
    },
    backend: {
      ukupno: ekstremniBackend.length,
      aktivnih: getEkstremniBackend().length,
      lista: ekstremniBackend.map((b) => ({
        id: b.id,
        naziv: b.naziv,
        tip: b.tip,
        status: b.status,
        mogucnosti: b.mogucnosti,
      })),
    },
    providniFrontend: {
      ukupno: providniFrontendKomponente.length,
      aktivnih: getProvidniFrontend().length,
      lista: providniFrontendKomponente.map((f) => ({
        id: f.id,
        naziv: f.naziv,
        tip: f.tip,
        status: f.status,
        mogucnosti: f.mogucnosti,
      })),
    },
    mogucnosti: getEkstremneMogucnosti(),
    statistika,
    timestamp: new Date().toISOString(),
  });
}
