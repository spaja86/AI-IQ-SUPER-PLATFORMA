import { NextResponse } from 'next/server';
import {
  spajaRenderMedija,
  renderEngini,
  renderPipeline,
  getAktivniEngini,
  getRenderStatistika,
  getNikolaSpajicFormulaSummary,
  chatGptIntegracioniUgovor,
} from '@/lib/spaja-render-medija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const statistika = getRenderStatistika();
  const aktivniEng = getAktivniEngini();
  const formule = getNikolaSpajicFormulaSummary();

  return NextResponse.json({
    sistem: 'SPAJA Render za Slike i Video',
    verzija: APP_VERSION,
    renderVerzija: spajaRenderMedija.verzija,
    appVerzija: APP_VERSION,
    opis: spajaRenderMedija.opis,
    link: spajaRenderMedija.link,
    generatorLink: spajaRenderMedija.generatorLink,
    ukupnoEngina: renderEngini.length,
    aktivnihEngina: aktivniEng.length,
    ukupnoPipeline: renderPipeline.length,
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
      ogranicenja: chatGptIntegracioniUgovor.ogranicenja,
      fallback: chatGptIntegracioniUgovor.fallback,
    },
    engini: renderEngini,
    pipeline: renderPipeline,
    timestamp: new Date().toISOString(),
  });
}
