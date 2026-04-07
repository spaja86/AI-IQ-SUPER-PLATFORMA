import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_PAGES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  SPAJA_PRO_VERZIJA_COUNT,
  PROKSI_KAPACITET,
  MOBILNE_CENTRALE,
} from '@/lib/constants';

export async function GET() {
  const statistike = getStatistike();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Kompletna Statistika — Svi Moduli',
    verzija: APP_VERSION,

    platforma: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      omegaAIPersone: OMEGA_AI_PERSONA_COUNT,
      omegaAIOktave: OMEGA_AI_OKTAVA_COUNT,
      spajaProVerzije: SPAJA_PRO_VERZIJA_COUNT,
      proksiKapacitet: PROKSI_KAPACITET,
      mobilneCentrale: MOBILNE_CENTRALE,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
      procenat: ((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100).toExponential(2),
    },

    moduli: {
      platforme: statistike.ukupnoPlatformi,
      itProizvodi: statistike.ukupnoProizvoda,
      promptovi: statistike.ukupnoPromptova,
      navigacija: statistike.ukupnoStranica,
      sajtovi: statistike.ukupnoSajtova,
      dimenzije: statistike.ukupnoDimenzija,
      mobilnaCentrala: statistike.ukupnoMobilnihCentrala,
      mobilniServisi: statistike.ukupnoMobilnihServisa,
      proksiSignali: statistike.ukupnoProksiSignala,
      proksiCvorovi: statistike.ukupnoProksiCvorova,
      kompanijeEN: statistike.ukupnoKompanija,
      organizacijeEN: statistike.ukupnoOrganizacija,
      proizvodiEN: statistike.ukupnoProducts,
    },

    zdravlje: {
      ukupnoProvera: statistike.ukupnoDijagnostika,
      zdravljeProcenat: statistike.zdravljeSistema,
    },

    rast: {
      pocetneRute: 16,
      trenutneRute: TOTAL_ROUTES,
      rastProcenat: `${((TOTAL_ROUTES / 16) * 100 - 100).toFixed(0)}%`,
      pocetniAPI: 7,
      trenutniAPI: TOTAL_API_ROUTES,
      apiRastProcenat: `${((TOTAL_API_ROUTES / 7) * 100 - 100).toFixed(0)}%`,
    },

    timestamp: new Date().toISOString(),
  });
}
