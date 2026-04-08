import { NextResponse } from 'next/server';
import { zasebniEndzini, pokreniAnalizu } from '@/lib/spaja-pro-zasebni-endzin';
import type { SpajaProVerzija } from '@/lib/spaja-pro';

export const dynamic = 'force-dynamic';

/**
 * SpajaPro Zasebni Endžini — Analiza API
 *
 * Pokreće analizu upita kroz specifični zasebni endžin.
 * Simulira proces razmišljanja: prijem → razmišljanje → pretraživanje →
 * sklapanje → verifikacija → prezentacija.
 *
 * Analiza može da traje od 5 sekundi do par sati dok odgovor
 * potpuno ne sazri i bude što precizniji i tačniji.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { verzija: number; upit: string };
    const { verzija, upit } = body;

    if (!upit || typeof upit !== 'string') {
      return NextResponse.json({ error: 'Upit je obavezan.' }, { status: 400 });
    }

    const validneVerzije = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    if (!validneVerzije.includes(verzija)) {
      return NextResponse.json({ error: `Verzija ${verzija} nije validna. Validne: 6-15.` }, { status: 400 });
    }

    const endzin = zasebniEndzini.find((e) => e.verzija === verzija);
    if (!endzin) {
      return NextResponse.json({ error: `Zasebni endžin za v${verzija} nije pronađen.` }, { status: 404 });
    }

    const analiza = pokreniAnalizu(verzija as SpajaProVerzija, upit);

    const rezultat = [
      `╔══════════════════════════════════════════════════════════════╗`,
      `║  ${endzin.ikona} ${endzin.naziv} — ANALIZA`,
      `║  🧠 Kodno ime: ${endzin.kodnoIme}`,
      `║  📋 Status: ${endzin.status.toUpperCase()}`,
      `║  ⏱️  Procenjeno: ${analiza.procenjeniKrajSekundi}s`,
      `╚══════════════════════════════════════════════════════════════╝`,
      ``,
      `📝 UPIT: ${upit}`,
      ``,
      `🧠 RAZMIŠLJANJE (Analiza):`,
      `─────────────────────────────────────────────`,
      ...analiza.razmisljanje.map((r) => `  ${r}`),
      ``,
      `📊 PROGRES ANALIZE:`,
      `  • Faza: ${analiza.faza}`,
      `  • Progres: ${analiza.progres}%`,
      `  • Dubina: ${endzin.analizaKapacitet.dubinaNivoa} nivoa`,
      `  • Faze: ${endzin.analizaKapacitet.fazaAnaliza.join(' → ')}`,
      ``,
      ...(analiza.pronadenoIzvora > 0 ? [
        `🔎 GOOGLE PRETRAGA:`,
        `  • Pronađeno izvora: ${analiza.pronadenoIzvora}`,
        `  • Max rezultata: ${endzin.googlePretraga.maxRezultata}`,
        `  • Domeni: ${endzin.googlePretraga.domenFilteri.join(', ')}`,
        ``,
      ] : []),
      ...(analiza.slikeGenerisano > 0 ? [
        `🖼️ SLIKE:`,
        `  • Generisano slika: ${analiza.slikeGenerisano}`,
        `  • Max slika po odgovoru: ${endzin.slikePodrska.maxSlikaPoOdgovoru}`,
        `  • Formati: ${endzin.slikePodrska.formatSlike.join(', ')}`,
        ``,
      ] : []),
      `💬 PREDLOŽENI NASTAVCI KONVERZACIJE:`,
      ...analiza.predlozeniUpiti.map((p, i) => `  ${i + 1}. ${p}`),
      ``,
      `─────────────────────────────────────────────`,
      `✅ Analiza pokrenuta kroz ${endzin.naziv} (${endzin.kodnoIme})`,
    ].join('\n');

    return NextResponse.json({
      status: 'uspesno',
      endzin: endzin.naziv,
      kodnoIme: endzin.kodnoIme,
      verzija: endzin.verzija,
      analiza,
      rezultat,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Greška pri pokretanju analize. Pokušajte ponovo.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    engine: 'SpajaPro Zasebni Endžini — Analiza',
    opis: 'Pokreće analizu upita kroz specifični zasebni endžin (v6-v15) sa razmišljanjem, Google pretragom i slikama',
    metoda: 'POST',
    telo: {
      verzija: 'broj (6-15)',
      upit: 'tekst upita za analizu',
    },
    endzini: zasebniEndzini.map((e) => ({
      verzija: e.verzija,
      naziv: e.naziv,
      kodnoIme: e.kodnoIme,
      dubinaNivoa: e.analizaKapacitet.dubinaNivoa,
      minSekundi: e.analizaKapacitet.minVremeSekundi,
      maxSekundi: e.analizaKapacitet.maxVremeSekundi,
    })),
    timestamp: new Date().toISOString(),
  });
}
