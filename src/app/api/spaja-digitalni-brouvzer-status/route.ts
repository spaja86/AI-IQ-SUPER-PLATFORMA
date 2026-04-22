import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  brouvzerEntiteti,
  brouvzerModuli,
  getAktivniEntiteti,
  getAktivniModuli,
  getBrouvzerStatistika,
  ekstremniMotori,
  ekstremniBackend,
  providniFrontendKomponente,
} from '@/lib/spaja-digitalni-brouvzer';
import { spajaDigitalniKompjuterSistem, KOMPJUTER_GPU_JEZGRA, KOMPJUTER_RAM_GB, KOMPJUTER_VRAM_GB } from '@/lib/spaja-digitalni-kompjuter';

export async function GET() {
  const statistika = getBrouvzerStatistika();
  const kompjuterStat = spajaDigitalniKompjuterSistem.statistika;

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Digitalni Brouvzer — EKSTREMNI — Status',
    verzija: APP_VERSION,
    link: 'https://chatgpt.com/c/69152051-4108-8328-9f58-d2d508b844f9',
    ekstremniRezim: statistika.ekstremniRezim,
    ukupnoEntiteta: brouvzerEntiteti.length,
    aktivnihEntiteta: getAktivniEntiteti().length,
    ukupnoModula: brouvzerModuli.length,
    aktivnihModula: getAktivniModuli().length,
    ukupnoMotora: ekstremniMotori.length,
    ukupnoBackendServisa: ekstremniBackend.length,
    ukupnoFrontendKomponenti: providniFrontendKomponente.length,
    pokrivenostIndustrije: `${statistika.pokrivenostIndustrije}%`,
    statistika,
    kompjuterSistem: {
      ukupnoKomponenti: kompjuterStat.ukupnoKomponenti,
      aktivnihKomponenti: kompjuterStat.aktivnihKomponenti,
      ukupnoKonzola: kompjuterStat.ukupnoKonzola,
      ukupnoKompjutera: kompjuterStat.ukupnoKompjutera,
      gpuJezgra: KOMPJUTER_GPU_JEZGRA,
      ramGB: KOMPJUTER_RAM_GB,
      vramGB: KOMPJUTER_VRAM_GB,
      generatorLink: spajaDigitalniKompjuterSistem.generatorLink,
    },
    entiteti: brouvzerEntiteti.map((e) => ({
      naziv: e.naziv,
      tip: e.tip,
      status: e.status,
      kategorija: e.kategorija,
    })),
    timestamp: new Date().toISOString(),
  });
}
