import { NextResponse } from 'next/server';
import { zasebniEndzini, getPoStatusuZasebni } from '@/lib/spaja-pro-zasebni-endzin';

/**
 * SpajaPro Zasebni Endžini — Status API
 *
 * Vraća zdravlje i operativni status svih 10 zasebnih endžina.
 */
export async function GET() {
  const poStatusu = getPoStatusuZasebni();
  const ukupno = zasebniEndzini.length;
  const aktivnih = zasebniEndzini.filter((e) => e.status === 'aktivan').length;
  const zdravlje = Math.round((aktivnih / ukupno) * 100);

  return NextResponse.json({
    sistem: 'SpajaPro Zasebni Endžini — Status',
    zdravlje: `${zdravlje}%`,
    ukupnoEndzina: ukupno,
    poStatusu,
    endzini: zasebniEndzini.map((e) => ({
      verzija: e.verzija,
      naziv: e.naziv,
      ikona: e.ikona,
      status: e.status,
      rezimiBroj: e.rezimi.length,
      googlePretraga: e.googlePretraga.aktivna ? 'AKTIVNA' : 'NEAKTIVNA',
      generisanjeSlike: e.slikePodrska.generisanjeSlike ? 'DA' : 'NE',
      analizaDubina: e.analizaKapacitet.dubinaNivoa,
      kontekstPamcenje: e.konverzacija.kontekstPamcenje,
    })),
    timestamp: new Date().toISOString(),
  });
}
