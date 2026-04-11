import { NextResponse } from 'next/server';
import {
  pokreniMultifunkcionalniRad,
  spajaBaza,
  type BazaKategorija,
} from '@/lib/spaja-pro-multifunkcionalni-endzin';
import { zasebniEndzini } from '@/lib/spaja-pro-zasebni-endzin';

export const dynamic = 'force-dynamic';

/**
 * SpajaPro Multifunkcionalni Endžin — Beskonačna Sesija API
 *
 * Pokreće beskonačnu sesiju gde svi 10 endžina rade paralelno.
 * Sesija nikad ne ističe — korisnik može da ispisuje do iznemoglosti.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { upit: string; kategorija?: string };
    const { upit, kategorija } = body;

    if (!upit || typeof upit !== 'string') {
      return NextResponse.json({ error: 'Upit je obavezan.' }, { status: 400 });
    }

    const kat = (kategorija as BazaKategorija) ?? 'univerzalna';
    const sesija = pokreniMultifunkcionalniRad(upit, kat);

    const rezultat = [
      `╔══════════════════════════════════════════════════════════════════════╗`,
      `║  🔥 MULTIFUNKCIONALNI ZAJEDNIČKI ENDŽIN — BESKONAČNA SESIJA`,
      `║  📋 Sesija: ${sesija.id}`,
      `║  ♾️  Status: BESKONAČNA`,
      `║  ⚡ Aktivni endžini: ${sesija.aktivniEndzini.length}/10 (paralelno)`,
      `║  🗃️ SPAJA BAZA: ${spajaBaza.kapacitet}`,
      `╚══════════════════════════════════════════════════════════════════════╝`,
      ``,
      `📝 UPIT: ${upit}`,
      `📂 KATEGORIJA: ${kat}`,
      ``,
      `⚡ PARALELNI RAD ENDŽINA:`,
      `─────────────────────────────────────────────────────────`,
      ...zasebniEndzini.map((e) => `  ${e.ikona} v${e.verzija} ${e.kodnoIme} — ${e.status.toUpperCase()} — dubina: ${e.analizaKapacitet.dubinaNivoa}`),
      ``,
      `🗃️ SPAJA BAZA PRETRAGA:`,
      `  • Kategorija: ${kat}`,
      `  • Kapacitet: ∞ (beskonačno)`,
      `  • Zapisi: ∞`,
      `  • Brzina: ${spajaBaza.statistika.brzinaPretrage}`,
      ``,
      `📌 SMERNICE ZA NASTAVAK SESIJE (${sesija.smernice.length}):`,
      `─────────────────────────────────────────────────────────`,
      ...sesija.smernice.map((s) => `  ${s.ikona} ${s.id}. ${s.tekst}`),
      ``,
      `─────────────────────────────────────────────────────────`,
      `♾️ Sesija je BESKONAČNA — nastavite sa bilo kojom smernicom`,
      `🗃️ SPAJA BAZA ima ∞ zapisa — manevrisajte do iznemoglosti`,
    ].join('\n');

    return NextResponse.json({
      status: 'uspesno',
      sesija,
      rezultat,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Greška pri pokretanju beskonačne sesije.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    engine: 'SpajaPro Multifunkcionalni Endžin — Beskonačna Sesija',
    opis: 'Pokreće beskonačnu sesiju sa svim 10 endžinima paralelno i SPAJA BAZA integracijom',
    metoda: 'POST',
    telo: {
      upit: 'tekst upita korisnika',
      kategorija: 'opciono — kategorija SPAJA BAZE (programiranje, analitika, dizajn, nauka, matematika, jezici, istorija, geografija, tehnologija, medicina, pravo, ekonomija, umetnost, muzika, sport, univerzalna)',
    },
    beskonacnaSesija: true,
    spajaBazaKapacitet: '∞',
    timestamp: new Date().toISOString(),
  });
}
