import { NextResponse } from 'next/server';
import {
  glavniEndzinDigitalneIndustrije,
  getGlavniEndzinStatistika,
  getSklopljenePoTipu,
  getSpojenePoTipu,
} from '@/lib/glavni-endzin-digitalne-industrije';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * 🏭⚙️ Glavni Endžin Digitalne Industrije — API
 *
 * Centralni endpoint za Glavni Endžin koji spaja SVE endžine
 * u jedan veliki unificirani endžin i automatski sklapa
 * gotove proizvode, igrice i platforme.
 *
 * Autofinish #330
 */

export async function GET() {
  const stats = getGlavniEndzinStatistika();

  return NextResponse.json({
    sistem: 'Glavni Endzin Digitalne Industrije',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,

    glavniEndzin: {
      id: glavniEndzinDigitalneIndustrije.id,
      naziv: glavniEndzinDigitalneIndustrije.naziv,
      opis: glavniEndzinDigitalneIndustrije.opis,
      ikona: glavniEndzinDigitalneIndustrije.ikona,
      verzija: glavniEndzinDigitalneIndustrije.verzija,
      status: glavniEndzinDigitalneIndustrije.status,
      misija: glavniEndzinDigitalneIndustrije.misija,
      vizija: glavniEndzinDigitalneIndustrije.vizija,
      mogucnosti: glavniEndzinDigitalneIndustrije.mogucnosti,
    },

    statistika: {
      ukupnoSpojenih: stats.ukupnoSpojenih,
      aktivnihEndžina: stats.aktivnihEndžina,
      prosecnaOptimizacija: `${stats.prosecnaOptimizacija}%`,
      kompletnostSistema: `${stats.kompletnostSistema}%`,
      poTipu: {
        core: stats.coreEndžina,
        ai: stats.aiEndžina,
        mreza: stats.mrezaEndžina,
        finansije: stats.finansijeEndžina,
        gaming: stats.gamingEndžina,
        deploy: stats.deployEndžina,
        bezbednost: stats.bezbednostEndžina,
        komunikacija: stats.komunikacijaEndžina,
        repoEngine: stats.repoEndžina,
      },
    },

    autoSklapanje: {
      ukupnoSklopljeno: stats.ukupnoPlatformiPokrenutih + stats.ukupnoIgricaPokrenutih + stats.ukupnoProizvodaSklopljenih,
      platforme: {
        ukupno: stats.ukupnoPlatformiPokrenutih,
        status: 'sve-sklopljene',
      },
      igrice: {
        ukupno: stats.ukupnoIgricaPokrenutih,
        status: 'sve-sklopljene',
      },
      itProizvodi: {
        ukupno: stats.ukupnoProizvodaSklopljenih,
        status: 'svi-sklopljeni',
      },
    },

    evolucija: {
      ukupnoCiklusa: stats.evolucijaCiklusa,
      ciklusi: glavniEndzinDigitalneIndustrije.evolucija.map((c) => ({
        id: c.id,
        naziv: c.naziv,
        opis: c.opis,
        faza: c.faza,
        napredak: `${c.napredak}%`,
      })),
    },

    spojeniEndzini: {
      ukupno: stats.ukupnoSpojenih,
      poIzvoru: {
        spajaGenerator: getSpojenePoTipu('core').length + getSpojenePoTipu('ai').length +
          getSpojenePoTipu('mreza').length + getSpojenePoTipu('finansije').length +
          getSpojenePoTipu('deploy').length + getSpojenePoTipu('bezbednost').length +
          getSpojenePoTipu('komunikacija').length + getSpojenePoTipu('repo-engine').length,
        gamingUniverzalni: getSpojenePoTipu('gaming').length,
      },
    },

    timestamp: new Date().toISOString(),
  });
}
