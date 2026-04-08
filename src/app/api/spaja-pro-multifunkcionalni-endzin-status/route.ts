import { NextResponse } from 'next/server';
import {
  multifunkcionalniEndzin,
  spajaBaza,
  getMultifunkcionalnaStatistika,
} from '@/lib/spaja-pro-multifunkcionalni-endzin';
import { zasebniEndzini } from '@/lib/spaja-pro-zasebni-endzin';

/**
 * SpajaPro Multifunkcionalni Zajednički Endžin — Status API
 *
 * Zdravlje i operativni status zajedničkog endžina,
 * paralelnog rada svih 10 endžina i SPAJA BAZA.
 */
export async function GET() {
  const statistika = getMultifunkcionalnaStatistika();
  const aktivnih = zasebniEndzini.filter((e) => e.status === 'aktivan').length;
  const zdravlje = Math.round((aktivnih / zasebniEndzini.length) * 100);

  return NextResponse.json({
    sistem: 'SpajaPro Multifunkcionalni Endžin — Status',
    zdravlje: `${zdravlje}%`,
    status: multifunkcionalniEndzin.status,
    rezim: multifunkcionalniEndzin.rezim,
    paralelniRad: statistika.paralelniRad,
    beskonacneSesije: statistika.beskonacneSesije,
    endzini: {
      ukupno: zasebniEndzini.length,
      aktivni: aktivnih,
      sviParalelno: true,
    },
    spajaBaza: {
      status: spajaBaza.status,
      kapacitet: spajaBaza.kapacitet,
      kategorija: spajaBaza.kategorije.length,
      indeksa: spajaBaza.indeksi.length,
      beskonacno: spajaBaza.statistika.beskonacnoSkladiste,
    },
    koordinacija: multifunkcionalniEndzin.koordinacija,
    timestamp: new Date().toISOString(),
  });
}
