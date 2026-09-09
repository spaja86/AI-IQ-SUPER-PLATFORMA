import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  renderEngini,
  getAktivniEngini,
  getEnginiPoKategoriji,
  getNikolaSpajicFormulaSummary,
  chatGptIntegracioniUgovor,
} from '@/lib/spaja-render-medija';

export async function GET() {
  const formule = getNikolaSpajicFormulaSummary();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Render — Engine-i',
    verzija: APP_VERSION,
    ukupnoEngina: renderEngini.length,
    aktivnihEngina: getAktivniEngini().length,
    enginiPoKategoriji: {
      slika: getEnginiPoKategoriji('slika').length,
      video: getEnginiPoKategoriji('video').length,
      animacija: getEnginiPoKategoriji('animacija').length,
      '3d-model': getEnginiPoKategoriji('3d-model').length,
      'vektorska-grafika': getEnginiPoKategoriji('vektorska-grafika').length,
      'audio-vizuelno': getEnginiPoKategoriji('audio-vizuelno').length,
      hologram: getEnginiPoKategoriji('hologram').length,
      'vr-ar': getEnginiPoKategoriji('vr-ar').length,
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
    },
    engini: renderEngini.map((e) => ({
      id: e.id,
      naziv: e.naziv,
      opis: e.opis,
      ikona: e.ikona,
      kategorija: e.kategorija,
      status: e.status,
      verzija: e.verzija,
      formati: e.formati,
      mogucnosti: e.mogucnosti,
      rezolucija: e.rezolucija,
      fps: e.fps,
    })),
    timestamp: new Date().toISOString(),
  });
}
