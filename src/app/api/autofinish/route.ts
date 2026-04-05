import { NextResponse } from 'next/server';
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
  SPAJA_PRO_RANGE,
} from '@/lib/constants';

export async function GET() {
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Sistem',
    opis: `Kontinualno poboljšanje AI IQ SUPER PLATFORMA — ${AUTOFINISH_COUNT}/${AUTOFINISH_TARGET.toLocaleString()} iteracija`,

    trenutniStatus: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
      procenat: procenat.toExponential(2),
      verzija: APP_VERSION,
    },

    platforma: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      omegaAIPersone: OMEGA_AI_PERSONA_COUNT,
      spajaProVerzije: SPAJA_PRO_RANGE,
    },

    istorija: Array.from({ length: AUTOFINISH_COUNT }, (_, i) => ({
      iteracija: i + 1,
      opis: getAutofinishOpis(i + 1),
    })),

    timestamp: new Date().toISOString(),
  });
}

function getAutofinishOpis(n: number): string {
  const opisi: Record<number, string> = {
    1: 'Inicijalni fix — TypeScript greške, sekvence, deploy',
    2: 'Organizacije, kompanije, proizvodi — EN stranice',
    3: 'Proksi, Mobilna Mreža, WiFi Antena',
    4: 'Dimenzije, auto-popravka, dijagnostike',
    5: 'Igrice sistem — 36 igrica, gaming IT proizvodi',
    6: 'Igrice proširenje — 90 igrica, 56 IT proizvoda',
    7: 'Ekstremne igrice — 95 igrica, linkovi, OpenAI + OMEGA AI',
    8: 'Dashboard proširenje, evolucija, 30 statistika',
    9: 'Ekosistem API, 43 rute, finalna optimizacija v6.6.0',
    10: 'Constants centralizacija, SEO metadata za sve stranice',
    11: '4 nova API (platforme, igrice, dimenzije, navigacija), 23 dijagnostike',
    12: 'Version bump v6.7.0, hardkodovani stringovi → konstante',
    13: '4 nova API (mobilna-mreza, proksi, sajtovi, industrija), 27 dijagnostika, 51 ruta',
  };
  return opisi[n] ?? `Autofinish iteracija #${n}`;
}
