import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  renderPipeline,
  getPipeline,
  getNikolaSpajicFormulaSummary,
  chatGptIntegracioniUgovor,
} from '@/lib/spaja-render-medija';

export async function GET() {
  const formule = getNikolaSpajicFormulaSummary();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Render — Pipeline-i',
    verzija: APP_VERSION,
    ukupnoPipeline: renderPipeline.length,
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
    pipeline: getPipeline().map((p) => ({
      id: p.id,
      naziv: p.naziv,
      opis: p.opis,
      ikona: p.ikona,
      koraci: p.koraci,
      ulazniFormati: p.ulazniFormati,
      izlazniFormati: p.izlazniFormati,
    })),
    timestamp: new Date().toISOString(),
  });
}
