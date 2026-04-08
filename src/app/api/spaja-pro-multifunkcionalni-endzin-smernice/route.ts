import { NextResponse } from 'next/server';
import {
  generisiSmernice,
  type BazaKategorija,
} from '@/lib/spaja-pro-multifunkcionalni-endzin';
import { zasebniEndzini } from '@/lib/spaja-pro-zasebni-endzin';

export const dynamic = 'force-dynamic';

/**
 * SpajaPro Multifunkcionalni Endžin — Smernice API
 *
 * Generiše proširene smernice i opcije za nastavak građenja sesije.
 * Svaki endžin doprinosi smernicama, plus SPAJA BAZA predlozi.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { upit: string; kategorija?: string };
    const { upit, kategorija } = body;

    if (!upit || typeof upit !== 'string') {
      return NextResponse.json({ error: 'Upit je obavezan.' }, { status: 400 });
    }

    const kat = (kategorija as BazaKategorija) ?? 'univerzalna';
    const smernice = generisiSmernice(upit, kat);

    return NextResponse.json({
      status: 'uspesno',
      upit,
      kategorija: kat,
      ukupnoSmernica: smernice.length,
      izvorEndzina: zasebniEndzini.length,
      smernice: smernice.map((s) => ({
        id: s.id,
        tekst: s.tekst,
        tip: s.tip,
        ikona: s.ikona,
        prioritet: s.prioritet,
        endzinVerzija: s.endzinVerzija,
      })),
      napomena: 'Izaberite smernice za nastavak beskonačne sesije. SPAJA BAZA ima ∞ zapisa.',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Greška pri generisanju smernica.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    engine: 'SpajaPro Multifunkcionalni Endžin — Smernice',
    opis: 'Generiše proširene smernice i opcije za nastavak sesije iz svih 10 endžina + SPAJA BAZA',
    metoda: 'POST',
    telo: {
      upit: 'tekst upita korisnika',
      kategorija: 'opciono — kategorija SPAJA BAZE',
    },
    timestamp: new Date().toISOString(),
  });
}
