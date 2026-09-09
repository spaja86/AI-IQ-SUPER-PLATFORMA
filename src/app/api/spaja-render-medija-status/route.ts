import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
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
    sistem: 'SPAJA Render za Slike i Video — Status',
    verzija: APP_VERSION,
    link: 'https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6',
    ukupnoEngina: renderEngini.length,
    aktivnihEngina: getAktivniEngini().length,
    ukupnoPipeline: renderPipeline.length,
    ukupnoFormata: statistika.ukupnoFormata,
    statistika,
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
    },
    engini: renderEngini.map((e) => ({
      naziv: e.naziv,
      kategorija: e.kategorija,
      status: e.status,
      rezolucija: e.rezolucija,
    })),
    timestamp: new Date().toISOString(),
  });
}
