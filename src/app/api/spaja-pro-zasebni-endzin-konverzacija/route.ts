import { NextResponse } from 'next/server';
import { zasebniEndzini } from '@/lib/spaja-pro-zasebni-endzin';

export const dynamic = 'force-dynamic';

/**
 * SpajaPro Zasebni Endžini — Konverzacija API
 *
 * Generiše predložene nastavke konverzacije na osnovu upita korisnika
 * i verzije endžina. Svaki endžin ima specifične stilove konverzacije
 * i broj predloženih upita za nastavak.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { verzija: number; upit: string; pravac?: string };
    const { verzija, upit, pravac } = body;

    if (!upit || typeof upit !== 'string') {
      return NextResponse.json({ error: 'Upit je obavezan.' }, { status: 400 });
    }

    const endzin = zasebniEndzini.find((e) => e.verzija === verzija);
    if (!endzin) {
      return NextResponse.json({ error: `Zasebni endžin za v${verzija} nije pronađen.` }, { status: 400 });
    }

    const konv = endzin.konverzacija;
    const brojReci = upit.split(/\s+/).length;

    // Generate follow-up suggestions based on engine capabilities
    const predlozi: Array<{ id: number; tekst: string; tip: string; ikona: string }> = [];

    if (endzin.rezimi.includes('programiranje')) {
      predlozi.push({
        id: predlozi.length + 1,
        tekst: `Napiši kod za: "${upit.slice(0, 60)}"`,
        tip: 'programiranje',
        ikona: '💻',
      });
    }
    if (endzin.rezimi.includes('cavrljanje')) {
      predlozi.push({
        id: predlozi.length + 1,
        tekst: `Objasni detaljnije: "${upit.slice(0, 60)}"`,
        tip: 'cavrljanje',
        ikona: '💬',
      });
    }
    if (endzin.googlePretraga.aktivna) {
      predlozi.push({
        id: predlozi.length + 1,
        tekst: `Pretraži Google za: "${upit.slice(0, 60)}"`,
        tip: 'google-pretraga',
        ikona: '🔍',
      });
    }
    if (endzin.slikePodrska.generisanjeSlike) {
      predlozi.push({
        id: predlozi.length + 1,
        tekst: `Generiši sliku za: "${upit.slice(0, 60)}"`,
        tip: 'slike',
        ikona: '🖼️',
      });
    }
    if (endzin.rezimi.includes('analiza')) {
      predlozi.push({
        id: predlozi.length + 1,
        tekst: `Dublja analiza: "${upit.slice(0, 60)}"`,
        tip: 'analiza',
        ikona: '📊',
      });
    }

    // Limit to engine's max suggestions
    const ograniceniPredlozi = predlozi.slice(0, konv.maxPredlozeniUpiti);

    return NextResponse.json({
      status: 'uspesno',
      endzin: endzin.naziv,
      verzija: endzin.verzija,
      originalniUpit: upit,
      pravac: pravac ?? 'automatski',
      konverzacija: {
        stilovi: konv.stilKonverzacije,
        kontekstPamcenje: konv.kontekstPamcenje,
        adaptivniOdgovori: konv.adaptivniOdgovori,
        brojReciUpita: brojReci,
      },
      predlozeniNastavci: ograniceniPredlozi,
      ukupnoPredloga: ograniceniPredlozi.length,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Greška pri generisanju nastavka konverzacije.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    engine: 'SpajaPro Zasebni Endžini — Konverzacija',
    opis: 'Generiše predložene nastavke konverzacije — u kom pravcu korisnik želi da ide',
    metoda: 'POST',
    telo: {
      verzija: 'broj (6-15)',
      upit: 'originalni upit korisnika',
      pravac: 'opciono — željeni pravac konverzacije',
    },
    endzini: zasebniEndzini.map((e) => ({
      verzija: e.verzija,
      naziv: e.naziv,
      maxPredloga: e.konverzacija.maxPredlozeniUpiti,
      stilovi: e.konverzacija.stilKonverzacije,
      kontekstPamcenje: e.konverzacija.kontekstPamcenje,
    })),
    timestamp: new Date().toISOString(),
  });
}
