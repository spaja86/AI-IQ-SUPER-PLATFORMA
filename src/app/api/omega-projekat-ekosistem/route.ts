import { NextResponse } from 'next/server';
import { APP_VERSION, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_PAGES, TOTAL_DIAGNOSTIKA, AUTOFINISH_COUNT, OMEGA_AI_PERSONA_UKUPNO, OMEGA_AI_PERSONA_COUNT, OMEGA_AI_OKTAVA_COUNT, KOMPANIJA } from '@/lib/constants';
import { getPlasiranjeSummary, plasiranjeSistemi, plasiranjeKoraci } from '@/lib/omega-projekat-plasiranje';
import { getStatistike } from '@/lib/statistika';
import { getSpecSummary } from '@/lib/spaja-ultra-omega-core';

export async function GET() {
  const plasiranje = getPlasiranjeSummary();
  const stats = getStatistike();
  const ultraCore = getSpecSummary();

  const aktivnihSistema = plasiranjeSistemi.filter((s) => s.status === 'uspešno').length;
  const zavrsenihFaza = plasiranjeKoraci.filter((k) => k.zavrsen).length;

  return NextResponse.json({
    status: 'OPERATIVNO',
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
    projekat: 'OMEGA PROJEKAT — Kompletni Ekosistem',

    ekosistem: {
      ukupnoRuta: TOTAL_ROUTES,
      apiEndpointa: TOTAL_API_ROUTES,
      stranica: TOTAL_PAGES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
    },

    omegaAi: {
      ukupnoPersona: OMEGA_AI_PERSONA_UKUPNO,
      brojPersona: OMEGA_AI_PERSONA_COUNT,
      oktava: OMEGA_AI_OKTAVA_COUNT,
    },

    plasiranje: {
      status: plasiranje.status,
      saglasnost: plasiranje.saglasnost,
      fazaProgres: plasiranje.fazaProgres,
      sistemiProgres: plasiranje.sistemiProgres,
      aktivnihSistema,
      zavrsenihFaza,
    },

    statistike: {
      platformi: stats.ukupnoPlatformi,
      aktivnihPlatformi: stats.aktivnihPlatformi,
      proizvoda: stats.ukupnoProizvoda,
      igrica: stats.ukupnoIgrica,
      promptova: stats.ukupnoPromptova,
      generatorEngina: stats.generatorEngina,
      dimenzija: stats.ukupnoDimenzija,
    },

    ultraOmegaCore: {
      naziv: ultraCore.naziv,
      verzija: ultraCore.verzija,
      paradigmi: ultraCore.paradigmi,
      tipovaPodataka: ultraCore.tipovaPodataka,
      operatora: ultraCore.operatora,
      naredbi: ultraCore.naredbi,
    },

    sistemi: plasiranjeSistemi.map((s) => ({
      naziv: s.naziv,
      status: s.status,
      progres: s.progres,
    })),

    timestamp: new Date().toISOString(),
  });
}
