import { NextResponse } from 'next/server';
import { spajaDigitalniKompjuterSistem, getSveKomponente } from '@/lib/spaja-digitalni-kompjuter';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET } from '@/lib/constants';

export async function GET() {
  const sistem = spajaDigitalniKompjuterSistem;
  const sveKomponente = getSveKomponente();
  const aktivnih = sveKomponente.filter((k) => k.status === 'aktivan').length;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Digitalni Kompjuter — Status',
    verzija: APP_VERSION,

    zdravlje: {
      ukupnoKomponenti: sveKomponente.length,
      aktivnihKomponenti: aktivnih,
      procenatAktivnih: Math.round((aktivnih / sveKomponente.length) * 100),
      kompjuterTipovi: sistem.kompjuteri.map((k) => ({ naziv: k.naziv, tip: k.tip })),
      konzoleStatus: sistem.konzole.map((k) => ({ naziv: k.naziv, tip: k.tip, status: k.status })),
      dzojsticiStatus: sistem.dzojstici.status,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
    },

    timestamp: new Date().toISOString(),
  });
}
