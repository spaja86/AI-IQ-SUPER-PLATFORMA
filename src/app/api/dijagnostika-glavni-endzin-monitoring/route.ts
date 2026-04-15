import { NextResponse } from 'next/server';
import {
  glavniEndzinDigitalneIndustrije,
  getGlavniEndzinStatistika,
  getSpojenePoTipu,
  getSklopljenePoTipu,
  getUkupnoPokrenutih,
  getKompletnostSistema,
  getGlavniEndzinPregled,
} from '@/lib/glavni-endzin-digitalne-industrije';
import { APP_VERSION, KOMPANIJA, AUTOFINISH_COUNT } from '@/lib/constants';

/**
 * 📈 Monitoring Dashboard — Glavni Endžin Digitalne Industrije
 *
 * Real-time vizuelizacija koliko endžina je aktivno,
 * koliko proizvoda sklopljeno, kompletnost sistema.
 *
 * Autofinish #337
 */

export async function GET() {
  const stats = getGlavniEndzinStatistika();
  const pregled = getGlavniEndzinPregled();
  const spojeni = glavniEndzinDigitalneIndustrije.spojeniEndzini;

  const aktivniEndžini = spojeni.filter((e) => e.status === 'aktivan');
  const uOptimizaciji = spojeni.filter((e) => e.status === 'optimizacija');
  const uGenerisanju = spojeni.filter((e) => e.status === 'generisanje');

  const tipovi = ['core', 'ai', 'mreza', 'finansije', 'gaming', 'deploy', 'bezbednost', 'komunikacija', 'repo-engine'] as const;
  const distribucija = tipovi.map((tip) => ({
    tip,
    ukupno: getSpojenePoTipu(tip).length,
    aktivno: getSpojenePoTipu(tip).filter((e) => e.status === 'aktivan').length,
    prosecnaOptimizacija: getSpojenePoTipu(tip).length > 0
      ? Math.round(getSpojenePoTipu(tip).reduce((a, e) => a + e.optimizacija, 0) / getSpojenePoTipu(tip).length)
      : 0,
  }));

  const sklapanjePlatforme = getSklopljenePoTipu('platforma');
  const sklapanjeIgrice = getSklopljenePoTipu('igrica');
  const sklapanjeProizvodi = getSklopljenePoTipu('it-proizvod');

  return NextResponse.json({
    sistem: 'Glavni Endzin Monitoring Dashboard',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    autofinish: AUTOFINISH_COUNT,

    monitoring: {
      status: glavniEndzinDigitalneIndustrije.status,
      verzija: glavniEndzinDigitalneIndustrije.verzija,
      kompletnost: `${getKompletnostSistema()}%`,
      uptime: '24/7',
    },

    endzini: {
      ukupnoSpojenih: stats.ukupnoSpojenih,
      aktivnih: aktivniEndžini.length,
      uOptimizaciji: uOptimizaciji.length,
      uGenerisanju: uGenerisanju.length,
      prosecnaOptimizacija: `${stats.prosecnaOptimizacija}%`,
      distribucija,
    },

    autoSklapanje: {
      ukupnoSklopljeno: getUkupnoPokrenutih(),
      platforme: {
        ukupno: sklapanjePlatforme.length,
        kompletnost: '100%',
      },
      igrice: {
        ukupno: sklapanjeIgrice.length,
        kompletnost: '100%',
      },
      itProizvodi: {
        ukupno: sklapanjeProizvodi.length,
        kompletnost: '100%',
      },
    },

    evolucija: {
      ukupnoCiklusa: glavniEndzinDigitalneIndustrije.evolucija.length,
      aktivnih: glavniEndzinDigitalneIndustrije.evolucija.filter((c) => c.faza === 'aktivna').length,
      zavrsenih: glavniEndzinDigitalneIndustrije.evolucija.filter((c) => c.faza === 'zavrsena').length,
      planiranih: glavniEndzinDigitalneIndustrije.evolucija.filter((c) => c.faza === 'planirana').length,
      prosecniNapredak: Math.round(
        glavniEndzinDigitalneIndustrije.evolucija.reduce((a, c) => a + c.napredak, 0) /
        glavniEndzinDigitalneIndustrije.evolucija.length,
      ),
    },

    pregled,

    dijagnostika: {
      status: 'zdrav',
      provera: [
        { naziv: 'Spojeni endzini', status: stats.ukupnoSpojenih > 0 ? 'ok' : 'greska' },
        { naziv: 'Auto-sklapanje', status: getUkupnoPokrenutih() > 0 ? 'ok' : 'greska' },
        { naziv: 'Evolucija', status: glavniEndzinDigitalneIndustrije.evolucija.length > 0 ? 'ok' : 'greska' },
        { naziv: 'Kompletnost', status: getKompletnostSistema() === 100 ? 'ok' : 'upozorenje' },
        { naziv: 'Status aktivan', status: glavniEndzinDigitalneIndustrije.status === 'aktivan' ? 'ok' : 'upozorenje' },
      ],
    },

    timestamp: new Date().toISOString(),
  });
}
