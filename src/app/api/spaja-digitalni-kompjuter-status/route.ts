import { getSpajaServerControlPlane } from '@/lib/spaja-server-control-plane';
import { DIGITALNI_KOMPJUTER_EVIDENCE } from '@/lib/spaja-digitalni-kompjuter';
import { NextResponse } from 'next/server';
import { spajaDigitalniKompjuterSistem, getSveKomponente } from '@/lib/spaja-digitalni-kompjuter';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET } from '@/lib/constants';

export async function GET() {
  const sistem = spajaDigitalniKompjuterSistem;
  const sveKomponente = getSveKomponente();

  return NextResponse.json({
    status: 'deklarisano',
    server: getSpajaServerControlPlane(),
    ...DIGITALNI_KOMPJUTER_EVIDENCE,
    naziv: 'SPAJA Digitalni Kompjuter — Status',
    verzija: APP_VERSION,

    zdravlje: {
      ukupnoKomponenti: sveKomponente.length,
      deklarisanoAktivnihKomponenti: sistem.statistika.deklarisanoAktivnihKomponenti,
      aktivnihKomponenti: null,
      procenatAktivnih: null,
      kompjuterTipovi: sistem.kompjuteri.map((k) => ({ naziv: k.naziv, tip: k.tip })),
      konzoleStatus: sistem.konzole.map((k) => ({ naziv: k.naziv, tip: k.tip, status: k.status, statusScope: k.statusScope })),
      dzojsticiStatus: sistem.dzojstici.status,
      statusScope: 'declaration-only',
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
    },

    timestamp: new Date().toISOString(),
  });
}
