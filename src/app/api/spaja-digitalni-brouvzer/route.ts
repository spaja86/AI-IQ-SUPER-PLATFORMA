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
import { spajaDigitalniKompjuterSistem, KOMPJUTER_GPU_JEZGRA, KOMPJUTER_RAM_GB, KOMPJUTER_VRAM_GB } from '@/lib/spaja-digitalni-kompjuter';

export async function GET() {
  const statistika = getBrouvzerStatistika();
  const aktivniEnt = getAktivniEntiteti();
  const aktivniMod = getAktivniModuli();
  const kompjuterStat = spajaDigitalniKompjuterSistem.statistika;

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
    entiteti: brouvzerEntiteti,
    moduli: brouvzerModuli,
    timestamp: new Date().toISOString(),
  });
}
