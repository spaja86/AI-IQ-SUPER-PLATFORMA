import { NextResponse } from 'next/server';
import {
  zasebniEndzini,
  getSveProgramskeJezike,
  getSveFramevorke,
} from '@/lib/spaja-pro-zasebni-endzin';

/**
 * SpajaPro Zasebni Endžini — Pregled API
 *
 * Detaljan pregled mogućnosti svakog zasebnog endžina.
 * Prikazuje programiranje, slike, Google pretragu, analizu i konverzaciju.
 */
export async function GET() {
  const sviJezici = getSveProgramskeJezike();
  const sviFramevorci = getSveFramevorke();

  return NextResponse.json({
    sistem: 'SpajaPro Zasebni Endžini — Detaljan Pregled',
    ukupnoEndzina: zasebniEndzini.length,
    programskiJezici: sviJezici,
    framevorci: sviFramevorci,
    endzini: zasebniEndzini.map((e) => ({
      verzija: e.verzija,
      id: e.id,
      naziv: e.naziv,
      kodnoIme: e.kodnoIme,
      ikona: e.ikona,
      opis: e.opis,
      status: e.status,
      rezimi: e.rezimi,
      analiza: {
        minVremeSekundi: e.analizaKapacitet.minVremeSekundi,
        maxVremeSekundi: e.analizaKapacitet.maxVremeSekundi,
        faze: e.analizaKapacitet.fazaAnaliza,
        dubinaNivoa: e.analizaKapacitet.dubinaNivoa,
        paralelnaAnaliza: e.analizaKapacitet.paralelnaAnaliza,
        samoVerifikacija: e.analizaKapacitet.samoVerifikacija,
      },
      konverzacija: {
        maxPredlozeniUpiti: e.konverzacija.maxPredlozeniUpiti,
        kontekstPamcenje: e.konverzacija.kontekstPamcenje,
        stilovi: e.konverzacija.stilKonverzacije,
        automatskiPredlozi: e.konverzacija.automatskiPredlozi,
        adaptivniOdgovori: e.konverzacija.adaptivniOdgovori,
      },
      slike: {
        generisanje: e.slikePodrska.generisanjeSlike,
        analiza: e.slikePodrska.analizaSlike,
        formati: e.slikePodrska.formatSlike,
        maxPoOdgovoru: e.slikePodrska.maxSlikaPoOdgovoru,
        vizualizacija: e.slikePodrska.vizualizacijaPodataka,
        dijagrami: e.slikePodrska.dijagrami,
      },
      googlePretraga: {
        aktivna: e.googlePretraga.aktivna,
        maxRezultata: e.googlePretraga.maxRezultata,
        filtriranje: e.googlePretraga.filtriranjeRelevantnosti,
        domeni: e.googlePretraga.domenFilteri,
        jezici: e.googlePretraga.jeziciPretrage,
      },
      programiranje: {
        jezici: e.programiranje.jezici,
        framevorci: e.programiranje.framevorci,
        codeReview: e.programiranje.codeReview,
        debugging: e.programiranje.debugging,
        refaktoring: e.programiranje.refaktoring,
        generisanjeTestova: e.programiranje.generisanjeTestova,
      },
    })),
    timestamp: new Date().toISOString(),
  });
}
