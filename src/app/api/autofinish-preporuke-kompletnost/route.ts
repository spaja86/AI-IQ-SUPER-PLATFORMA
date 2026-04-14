import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  TOTAL_IGRICA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';
import { getUkupnoAiPagePrompts, getUkupnoStranica } from '@/lib/ai-page-prompts';

export async function GET() {
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;
  const ukupnoPromptova = getUkupnoAiPagePrompts();
  const ukupnoStranica = getUkupnoStranica();

  const preporukeModuli = [
    {
      modul: 'Dashboard Preporuke',
      tip: 'dashboard-recommendations',
      status: 'kompletno',
      stavke: 24,
      opis: 'Dashboard prikazuje 24 linka u sekciji Istrazite jos — pokrivene sve 46 stranica',
    },
    {
      modul: 'Pocetna Preporuke',
      tip: 'homepage-recommendations',
      status: 'kompletno',
      stavke: 8,
      opis: '8 kartica u sekciji Preporucujemo — SpajaPro AI, Prompt, Gaming, TV, Banka, Menjacnica, Monitoring, Brouvzer',
    },
    {
      modul: 'Pocetna Istrazite Ekosistem',
      tip: 'homepage-explore',
      status: 'kompletno',
      stavke: 12,
      opis: '12 kartica u sekciji Istrazite ceo ekosistem — OMEGA AI, Kompjuter, Render, Lab, Mobilna, Proksi, Dimenzije, Generator, Suport, Bezbednost, Industrija, Deploy',
    },
    {
      modul: 'Login Preporuke',
      tip: 'login-recommendations',
      status: 'kompletno',
      stavke: 20,
      opis: 'Ulogovani korisnici vide 4 glavna modula + 8 preporuka + 8 brzih linkova',
    },
    {
      modul: 'AI Asistent Preporuke',
      tip: 'ai-assistant-recommendations',
      status: 'kompletno',
      stavke: ukupnoPromptova,
      opis: `AI Asistent ima ${ukupnoPromptova} kontekstualnih promptova na ${ukupnoStranica} stranica`,
    },
    {
      modul: 'Brzi Pristup',
      tip: 'quick-access',
      status: 'kompletno',
      stavke: 8,
      opis: 'Dashboard Brzi pristup — 8 najvaznijih modula na jedan klik',
    },
    {
      modul: 'Ekosistem u Brojevima',
      tip: 'ecosystem-stats',
      status: 'kompletno',
      stavke: 6,
      opis: 'Dashboard statisticki panel — Platforme, IT Proizvodi, Igrice, OMEGA AI, SpajaPro, Stranice',
    },
  ];

  const ukupnoPreporuka = preporukeModuli.reduce((sum, m) => sum + m.stavke, 0);
  const kompletiranihModula = preporukeModuli.filter((m) => m.status === 'kompletno').length;

  return NextResponse.json({
    status: 'aktivan',
    naziv: `Autofinish Preporuke Kompletnost — Iteracija #${AUTOFINISH_COUNT}`,
    opis: 'Pracenje kompletnosti svih preporuka, istrazivanja i feature discovery sistema na platformi',
    verzija: APP_VERSION,

    iteracija: {
      broj: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
      procenat: procenat.toExponential(2),
    },

    kompletnost: {
      ukupnoModula: preporukeModuli.length,
      kompletiranih: kompletiranihModula,
      kompletnostProcenat: `${Math.round((kompletiranihModula / preporukeModuli.length) * 100)}%`,
      ukupnoPreporuka,
      moduli: preporukeModuli,
    },

    pokrivenost: {
      stranice: TOTAL_PAGES,
      aiPromptovi: ukupnoPromptova,
      straniceSaPromptovima: ukupnoStranica,
      pokrivenostProcenat: `${Math.round((ukupnoStranica / TOTAL_PAGES) * 100)}%`,
    },

    ekosistem: {
      apiEndpointi: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      stranice: TOTAL_PAGES,
    },

    timestamp: new Date().toISOString(),
  });
}
