import { NextResponse } from 'next/server';
import {
  multifunkcionalniEndzin,
  spajaBaza,
  getMultifunkcionalnaStatistika,
} from '@/lib/spaja-pro-multifunkcionalni-endzin';

/**
 * SpajaPro Multifunkcionalni Zajednički Endžin — API
 *
 * Svi 10 zasebnih endžina (v6-v15) rade zajedno u isto vreme
 * kroz zajednički endžin sa SPAJA BAZA integracijom i beskonačnim sesijama.
 */
export async function GET() {
  const statistika = getMultifunkcionalnaStatistika();

  return NextResponse.json({
    sistem: 'SpajaPro Multifunkcionalni Zajednički Endžin — Kompanija SPAJA',
    verzija: multifunkcionalniEndzin.verzija,
    opis: multifunkcionalniEndzin.opis,
    ikona: multifunkcionalniEndzin.ikona,
    rezim: multifunkcionalniEndzin.rezim,
    status: multifunkcionalniEndzin.status,
    statistika,
    sesija: multifunkcionalniEndzin.sesija,
    koordinacija: multifunkcionalniEndzin.koordinacija,
    spajaBaza: {
      naziv: spajaBaza.naziv,
      kapacitet: spajaBaza.kapacitet,
      kategorijaBroj: spajaBaza.kategorije.length,
      indeksiBroj: spajaBaza.indeksi.length,
      status: spajaBaza.status,
      beskonacno: spajaBaza.statistika.beskonacnoSkladiste,
    },
    aktivniEndzini: multifunkcionalniEndzin.aktivniZasebniEndzini.map((e) => ({
      verzija: e.verzija,
      naziv: e.naziv,
      kodnoIme: e.kodnoIme,
      ikona: e.ikona,
      status: e.status,
      rezimiBroj: e.rezimi.length,
    })),
    timestamp: new Date().toISOString(),
  });
}
