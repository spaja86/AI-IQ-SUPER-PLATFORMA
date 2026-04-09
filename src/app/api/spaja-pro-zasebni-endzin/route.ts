import { NextResponse } from 'next/server';
import {
  zasebniEndzini,
  getAktivniZasebniEndzini,
  getBetaZasebniEndzini,
  getEndziniSaGooglePretragom,
  getEndziniSaSlikama,
  getUkupnoRezima,
  getMaxKontekstPamcenje,
  getMaxSlikaPoOdgovoru,
  getPoStatusuZasebni,
  getSveProgramskeJezike,
  getSveFramevorke,
} from '@/lib/spaja-pro-zasebni-endzin';
import { APP_VERSION } from '@/lib/constants';

/**
 * SpajaPro Zasebni Endžini — API Endpoint
 *
 * Svaki SpajaPro v6-v15 ima zasebni endžin specifičan samom sebi.
 * Endpoint vraća kompletni pregled svih 10 zasebnih endžina.
 */
export async function GET() {
  const aktivni = getAktivniZasebniEndzini();
  const beta = getBetaZasebniEndzini();
  const saGooglePretragom = getEndziniSaGooglePretragom();
  const saSlikama = getEndziniSaSlikama();
  const poStatusu = getPoStatusuZasebni();

  return NextResponse.json({
    sistem: 'SpajaPro Zasebni Endžini — Kompanija SPAJA',
    verzija: APP_VERSION,
    opis: 'Svaki SpajaPro v6-v15 ima zasebni endžin koji je specifičan samom sebi — za programiranje, čavrljanje, Google pretragu, analizu i slike',
    statistike: {
      ukupnoEndzina: zasebniEndzini.length,
      aktivnih: aktivni.length,
      beta: beta.length,
      saGooglePretragom: saGooglePretragom.length,
      saSlikama: saSlikama.length,
      ukupnoRezima: getUkupnoRezima(),
      maxKontekstPamcenje: getMaxKontekstPamcenje(),
      maxSlikaPoOdgovoru: getMaxSlikaPoOdgovoru(),
      programskiJezici: getSveProgramskeJezike().length,
      framevorci: getSveFramevorke().length,
      poStatusu,
    },
    endzini: zasebniEndzini.map((e) => ({
      verzija: e.verzija,
      id: e.id,
      naziv: e.naziv,
      kodnoIme: e.kodnoIme,
      ikona: e.ikona,
      status: e.status,
      rezimi: e.rezimi,
      analizaDubina: e.analizaKapacitet.dubinaNivoa,
      analizaMinSekundi: e.analizaKapacitet.minVremeSekundi,
      analizaMaxSekundi: e.analizaKapacitet.maxVremeSekundi,
      paralelnaAnaliza: e.analizaKapacitet.paralelnaAnaliza,
      samoVerifikacija: e.analizaKapacitet.samoVerifikacija,
      maxPredlozeniUpiti: e.konverzacija.maxPredlozeniUpiti,
      kontekstPamcenje: e.konverzacija.kontekstPamcenje,
      googlePretraga: e.googlePretraga.aktivna,
      googleMaxRezultata: e.googlePretraga.maxRezultata,
      generisanjeSlike: e.slikePodrska.generisanjeSlike,
      maxSlika: e.slikePodrska.maxSlikaPoOdgovoru,
      programskiJezici: e.programiranje.jezici.length,
      framevorci: e.programiranje.framevorci.length,
      codeReview: e.programiranje.codeReview,
      debugging: e.programiranje.debugging,
    })),
    timestamp: new Date().toISOString(),
  });
}
