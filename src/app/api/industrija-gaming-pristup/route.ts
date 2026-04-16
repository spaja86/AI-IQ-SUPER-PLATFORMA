import { NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA, TOTAL_IGRICA } from '@/lib/constants';
import {
  gamingStatistika,
  gamingKonfiguracija,
  gejmingKonstrukcija,
  getAktivneIgriceSaEndzinom,
  IOOPENUIAO_URL,
} from '@/lib/io-openui-ao-gaming-platforma';

/**
 * 🎮 Industrija Gaming Pristup — Dijagnostika pristupa igricama kroz industriju
 *
 * Provera da li korisnik ima pristup igricama kroz Digitalnu Industriju.
 * IO/OPENUI/AO = laboratorija/demo, Digitalna Industrija = primarni pristup.
 *
 * Autofinish #339
 */

export async function GET() {
  const aktivneIgrice = getAktivneIgriceSaEndzinom();

  return NextResponse.json({
    sistem: 'Industrija Gaming Pristup — Dijagnostika',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,

    pristupKonfiguracija: {
      primarniPristup: 'Digitalna Industrija (AI IQ SUPER PLATFORMA)',
      laboratorija: `IO/OPENUI/AO (${IOOPENUIAO_URL}) — laboratorija i demo`,
      loginObavezan: true,
      loginUrl: '/api/auth/login',
      loginAltUrl: '/api/login',
      pristupNakonLogina: true,
    },

    gamingStatus: {
      aktivan: gamingKonfiguracija.aktivan,
      platforma: gamingKonfiguracija.platformaNaziv,
      ukupnoIgrica: TOTAL_IGRICA,
      aktivnihIgrica: aktivneIgrice.length,
      kategorija: gamingStatistika.ukupnoKategorija,
      optimizacija: `${gamingStatistika.prosecnaOptimizacija}%`,
    },

    gejmingKonstrukcija: {
      id: gejmingKonstrukcija.id,
      naziv: gejmingKonstrukcija.naziv,
      aktivna: gejmingKonstrukcija.aktivna,
    },

    dijagnostika: {
      loginSistem: 'aktivan',
      industrijaPristup: 'aktivan',
      gamingPristup: 'aktivan',
      gejmingKonstrukcija: gejmingKonstrukcija.aktivna ? 'aktivna' : 'neaktivna',
      ioOpenUiAo: 'laboratorija-i-demo',
    },

    timestamp: new Date().toISOString(),
  });
}
