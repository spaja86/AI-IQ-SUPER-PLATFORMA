import { NextResponse } from 'next/server';
import {
  spajaBaza,
  spajaBazaIndeksi,
  pretraziSpajaBazu,
  type BazaKategorija,
} from '@/lib/spaja-pro-multifunkcionalni-endzin';

export const dynamic = 'force-dynamic';

/**
 * SpajaPro Multifunkcionalni Endžin — SPAJA BAZA API
 *
 * Pristup SPAJA BAZI — beskonačnoj bazi podataka Kompanije SPAJA.
 * Korisnik može da manevriše i ispisuje do iznemoglosti.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { upit: string; kategorija?: string };
    const { upit, kategorija } = body;

    if (!upit || typeof upit !== 'string') {
      return NextResponse.json({ error: 'Upit je obavezan.' }, { status: 400 });
    }

    const kat = (kategorija as BazaKategorija) ?? 'univerzalna';
    const rezultat = pretraziSpajaBazu(kat, upit);

    return NextResponse.json({
      status: 'uspesno',
      baza: spajaBaza.naziv,
      kapacitet: spajaBaza.kapacitet,
      pretraga: {
        kategorija: rezultat.kategorija,
        indeks: rezultat.indeks,
        rezultatiBroj: rezultat.rezultatiBroj,
        dubina: rezultat.dubina,
        beskonacno: rezultat.beskonacno,
      },
      smernice: rezultat.smernice,
      upit,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Greška pri pretrazi SPAJA BAZE.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA BAZA — Beskonačna Baza Podataka — Kompanija SPAJA',
    opis: spajaBaza.opis,
    kapacitet: spajaBaza.kapacitet,
    beskonacno: spajaBaza.statistika.beskonacnoSkladiste,
    status: spajaBaza.status,
    statistika: spajaBaza.statistika,
    kategorije: spajaBaza.kategorije,
    indeksi: spajaBazaIndeksi.map((i) => ({
      id: i.id,
      naziv: i.naziv,
      kategorija: i.kategorija,
      brojZapisa: i.brojZapisa,
      dubina: i.dubina,
      ikona: i.ikona,
    })),
    timestamp: new Date().toISOString(),
  });
}
