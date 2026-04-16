import { NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA, TOTAL_IGRICA } from '@/lib/constants';
import { digitalnaIndustrija, getIndustrijaStats } from '@/lib/industrija';
import {
  gamingStatistika,
  gamingKonfiguracija,
  gejmingKonstrukcija,
  getAktivneIgriceSaEndzinom,
  getIgriceSaEndzinomPoKategoriji,
  IOOPENUIAO_URL,
} from '@/lib/io-openui-ao-gaming-platforma';
import { igriceSistem, OBAVEZNI_ZAHTEVI } from '@/lib/igrice';

/**
 * 🎮 Industrija Gaming — Igrice primarno kroz Digitalnu Industriju
 *
 * Sve igrice se koriste primarno kroz Digitalnu Industriju Kompanije SPAJA.
 * IO/OPENUI/AO sajt sluzi kao laboratorija i demo.
 * Pristup igricama je obezbeđen nakon logovanja na platformu.
 *
 * Autofinish #338
 */

export async function GET() {
  const aktivneIgrice = getAktivneIgriceSaEndzinom();
  const industrijaStats = getIndustrijaStats();

  // Igrice po kategoriji
  const kategorije = [
    'akcija', 'avantura', 'logicka', 'simulacija', 'strategija',
    'edukativna', 'kreativna', 'arkadna', 'rpg', 'borbena',
    'muzicka', 'horor', 'sportska', 'mmo', 'trka',
    'detektivska', 'zivotna-simulacija', 'retro',
  ] as const;

  const igricePoKategoriji = kategorije.map((kat) => {
    const igrice = getIgriceSaEndzinomPoKategoriji(kat);
    return {
      kategorija: kat,
      ukupno: igrice.length,
      igrice: igrice.map((i) => ({
        id: i.igricaId,
        naziv: i.igricaNaziv,
        ikona: i.igricaIkona,
        status: i.igricaStatus,
        endzin: i.endzinNaziv,
        optimizacija: `${i.optimizacija}%`,
      })),
    };
  }).filter((k) => k.ukupno > 0);

  return NextResponse.json({
    sistem: 'Industrija Gaming — Digitalna Industrija',
    opis:
      'Igrice se koriste primarno kroz Digitalnu Industriju Kompanije SPAJA. ' +
      'IO/OPENUI/AO sajt sluzi kao laboratorija i demo okruzenje. ' +
      'Pristup igricama je obezbeđen nakon logovanja na platformu — ' +
      'svaki ulogovani korisnik dobija Gaming Pristup sa Otavnom Konstrukcijom Gejminga.',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,

    industrija: {
      naziv: digitalnaIndustrija.name,
      misija: digitalnaIndustrija.mission,
      statistika: industrijaStats,
    },

    gamingPregled: {
      primarniPristup: 'Digitalna Industrija (AI IQ SUPER PLATFORMA)',
      laboratorija: `IO/OPENUI/AO (${IOOPENUIAO_URL}) — laboratorija i demo`,
      ukupnoIgrica: TOTAL_IGRICA,
      aktivnihIgrica: aktivneIgrice.length,
      kategorija: gamingStatistika.ukupnoKategorija,
      prosecnaOptimizacija: `${gamingStatistika.prosecnaOptimizacija}%`,
      platformaNaziv: gamingKonfiguracija.platformaNaziv,
      dimenzije: igriceSistem.podrzaneDimenzije,
    },

    igricePoKategoriji,

    gejmingKonstrukcija: {
      id: gejmingKonstrukcija.id,
      naziv: gejmingKonstrukcija.naziv,
      opis: gejmingKonstrukcija.opis,
      aktivna: gejmingKonstrukcija.aktivna,
      verzija: gejmingKonstrukcija.verzija,
    },

    obavezniZahtevi: OBAVEZNI_ZAHTEVI,

    pristup: {
      nacin: 'Login na AI IQ SUPER PLATFORMA → automatski gaming pristup',
      loginUrl: '/login',
      dashboardUrl: '/dashboard',
      igriceUrl: '/igrice',
      gamingPlatformaUrl: '/io-openui-ao-gaming-platforma',
      industrijaUrl: '/industrija',
    },

    timestamp: new Date().toISOString(),
  });
}
