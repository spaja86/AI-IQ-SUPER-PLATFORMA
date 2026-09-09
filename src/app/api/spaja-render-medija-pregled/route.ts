import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  spajaRenderMedija,
  renderEngini,
  renderPipeline,
  getAktivniEngini,
  getRenderStatistika,
  getNikolaSpajicFormulaSummary,
  chatGptIntegracioniUgovor,
} from '@/lib/spaja-render-medija';

export async function GET() {
  const statistika = getRenderStatistika();
  const formule = getNikolaSpajicFormulaSummary();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Render za Slike i Video — Pregled',
    verzija: APP_VERSION,
    renderVerzija: spajaRenderMedija.verzija,
    link: spajaRenderMedija.link,
    generatorLink: spajaRenderMedija.generatorLink,
    opis: spajaRenderMedija.opis,
    pregled: {
      ukupnoEngina: renderEngini.length,
      aktivnihEngina: getAktivniEngini().length,
      ukupnoPipeline: renderPipeline.length,
      ukupnoFormata: statistika.ukupnoFormata,
      ukupnoKategorija: statistika.ukupnoKategorija,
    },
    nikolaSpajicFormule: formule,
    formulaStatusPoKategoriji: {
      slika: {
        score: formule.slika.score,
        status: formule.slika.status,
        preporuka: formule.slika.preporuka,
        objasnjenje: formule.slika.objasnjenje,
      },
      video: {
        score: formule.video.score,
        status: formule.video.status,
        preporuka: formule.video.preporuka,
        objasnjenje: formule.video.objasnjenje,
      },
    },
    chatGptIntegracija: {
      mode: chatGptIntegracioniUgovor.mode,
      runtimeEvaluacija: chatGptIntegracioniUgovor.runtimeEvaluacija,
      validacija: chatGptIntegracioniUgovor.validacija,
      fallback: chatGptIntegracioniUgovor.fallback,
    },
    engini: renderEngini.map((e) => ({
      id: e.id,
      naziv: e.naziv,
      kategorija: e.kategorija,
      status: e.status,
      verzija: e.verzija,
      rezolucija: e.rezolucija,
      formati: e.formati.length,
      mogucnosti: e.mogucnosti.length,
    })),
    pipeline: renderPipeline.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      koraci: p.koraci.length,
      ulazniFormati: p.ulazniFormati.length,
      izlazniFormati: p.izlazniFormati.length,
    })),
    timestamp: new Date().toISOString(),
  });
}
