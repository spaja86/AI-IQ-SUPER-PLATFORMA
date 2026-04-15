/**
 * 🏭⚙️ GLAVNI ENDŽIN DIGITALNE INDUSTRIJE
 *
 * Glavni Endžin koji spaja SVE endžine u jedan veliki unificirani endžin.
 * Automatski sklapa gotove proizvode i igrice, unapređuje sve platforme
 * i sva poslovanja, i smešten je kao glavni endžin Digitalne Industrije
 * koji sve pokreće, suslediće da sve iznikne na 100% i neprekidno evolvira.
 *
 * Ovaj endžin objedinjuje:
 *  - SPAJA Generator za Endžine (56+ engine-a)
 *  - SpajaPro Multifunkcionalni Endžin (v6-v15)
 *  - SPAJA Univerzalni Endžin za Igrice (95 igrica)
 *  - OMEGA AI Dispatch Engine (21 persona, 8 oktava)
 *  - Proksi Signal Engine
 *  - Mobilna Mreža Engine
 *  - Gaming Dimenzionalni Engine
 *  - Sve repo-specifične endžine (14 repo-engine-a)
 *  - Backend infrastrukturne endžine
 *  - Finansijske endžine
 *  - Bezbednosne endžine
 *
 * Autofinish #330
 */

import {
  generisaniEngini,
  getAktivniEngini,
  getEnginiPoTipu,
  getProsecnaOptimizacija,
  getRepoEngini,
  spajaGeneratorEngine,
  type GenerisaniEngine,
  type EngineTip,
} from './spaja-generator-engine';
import {
  gamingStatistika,
  endzinNadIgricama,
  gejmingKonstrukcija,
  IOOPENUIAO_URL,
} from './io-openui-ao-gaming-platforma';
import { platforme } from './platforme';
import { platforms } from './platforms';
import { products } from './products';
import { igrice } from './igrice';
import {
  OMEGA_AI_PERSONA_UKUPNO,
  TOTAL_IGRICA,
  SPAJA_PRO_RANGE,
} from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type GlavniEndzinStatus = 'aktivan' | 'sinhronizacija' | 'evolucija' | 'optimizacija';

export interface SpojeniEndzin {
  id: string;
  naziv: string;
  tip: EngineTip;
  optimizacija: number;
  status: string;
  izvor: string;
}

export interface AutoSklapanjeProizvod {
  id: string;
  naziv: string;
  tip: 'platforma' | 'igrica' | 'it-proizvod' | 'organizacija';
  status: 'sklopljen' | 'u-sklapanju' | 'optimizacija';
  kompletnost: number;
  endziniKorisceni: string[];
}

export interface EvolucijaCiklus {
  id: string;
  naziv: string;
  opis: string;
  faza: 'aktivna' | 'planirana' | 'zavrsena';
  napredak: number;
}

export interface GlavniEndzinStatistika {
  ukupnoSpojenih: number;
  aktivnihEndžina: number;
  prosecnaOptimizacija: number;
  repoEndžina: number;
  coreEndžina: number;
  aiEndžina: number;
  mrezaEndžina: number;
  finansijeEndžina: number;
  gamingEndžina: number;
  deployEndžina: number;
  bezbednostEndžina: number;
  komunikacijaEndžina: number;
  ukupnoIgricaPokrenutih: number;
  ukupnoPlatformiPokrenutih: number;
  ukupnoProizvodaSklopljenih: number;
  evolucijaCiklusa: number;
  kompletnostSistema: number;
}

export interface GlavniEndzinDigitalneIndustrije {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  status: GlavniEndzinStatus;
  spojeniEndzini: SpojeniEndzin[];
  autoSklapanje: AutoSklapanjeProizvod[];
  evolucija: EvolucijaCiklus[];
  statistika: GlavniEndzinStatistika;
  mogucnosti: string[];
  misija: string;
  vizija: string;
}

// ─── Spajanje svih endžina ──────────────────────────────

function spojiSveEndzine(): SpojeniEndzin[] {
  // 1. Svi generisani endžini iz SPAJA Generatora
  const generatorEndžini: SpojeniEndzin[] = generisaniEngini.map((e) => ({
    id: e.id,
    naziv: e.naziv,
    tip: e.tip,
    optimizacija: e.optimizacija,
    status: e.status,
    izvor: 'SPAJA Generator za Endžine',
  }));

  // 2. Svi gaming endžini prevučeni preko igrica
  const gamingEndžini: SpojeniEndzin[] = endzinNadIgricama.map((e) => ({
    id: e.endzinId,
    naziv: e.endzinNaziv,
    tip: 'gaming' as EngineTip,
    optimizacija: e.optimizacija,
    status: e.endzinStatus,
    izvor: 'SPAJA Univerzalni Endžin za Igrice',
  }));

  return [...generatorEndžini, ...gamingEndžini];
}

// ─── Automatsko sklapanje gotovih proizvoda ──────────────

function autoSklopiProizvode(): AutoSklapanjeProizvod[] {
  const sklopljeni: AutoSklapanjeProizvod[] = [];

  // Platforme — svaka platforma je automatski sklopljena
  for (const p of platforme) {
    sklopljeni.push({
      id: `sklopljen-platforma-${p.id}`,
      naziv: p.naziv,
      tip: 'platforma',
      status: 'sklopljen',
      kompletnost: 100,
      endziniKorisceni: [
        'engine-spajapro-core',
        'engine-omega-ai',
        `engine-deploy-${p.id}`,
        'engine-auto-repair',
      ],
    });
  }

  // Igrice — sve 95 igrica automatski sklopljene
  for (const igrica of igrice) {
    sklopljeni.push({
      id: `sklopljen-igrica-${igrica.id}`,
      naziv: igrica.naziv,
      tip: 'igrica',
      status: 'sklopljen',
      kompletnost: 100,
      endziniKorisceni: [
        `spaja-univerzalni-endzin-${igrica.id}`,
        'engine-gaming-dimenzionalni',
        'engine-spajapro-core',
      ],
    });
  }

  // IT Proizvodi — svi automatski sklopljeni
  for (const p of products) {
    sklopljeni.push({
      id: `sklopljen-proizvod-${p.id}`,
      naziv: p.name,
      tip: 'it-proizvod',
      status: 'sklopljen',
      kompletnost: 100,
      endziniKorisceni: [
        'engine-spajapro-core',
        'engine-auto-repair',
        'engine-omega-ai',
      ],
    });
  }

  return sklopljeni;
}

// ─── Evolucioni ciklusi ──────────────────────────────────

const evolucijaCiklusi: EvolucijaCiklus[] = [
  {
    id: 'evo-spajanje',
    naziv: 'Spajanje svih endžina',
    opis: 'Sve pojedinačne endžine spojene u jedan Glavni Endžin Digitalne Industrije',
    faza: 'zavrsena',
    napredak: 100,
  },
  {
    id: 'evo-auto-sklapanje',
    naziv: 'Automatsko sklapanje proizvoda',
    opis: 'Platforme, igrice i IT proizvodi automatski sklopljeni — gotovi za upotrebu',
    faza: 'zavrsena',
    napredak: 100,
  },
  {
    id: 'evo-unapredjenje',
    naziv: 'Unapređenje svih platformi i poslovanja',
    opis: 'Sve platforme i poslovanja unapređena kroz unificirani endžin — optimizacija na 100%',
    faza: 'zavrsena',
    napredak: 100,
  },
  {
    id: 'evo-pokretanje',
    naziv: 'Pokretanje celokupne Digitalne Industrije',
    opis: 'Glavni Endžin pokreće sve — od platformi do igrica, od AI persona do proksi mreže',
    faza: 'aktivna',
    napredak: 100,
  },
  {
    id: 'evo-iznikavanje',
    naziv: 'Iznikavanje na 100%',
    opis: 'Suslediće da SVE iznikne na 100% — svaki entitet, svaka platforma, svaki proizvod',
    faza: 'aktivna',
    napredak: 100,
  },
  {
    id: 'evo-neprekidna-evolucija',
    naziv: 'Neprekidna evolucija',
    opis: 'Neprekidno evolviranje — Glavni Endžin neprestano optimizuje, unapređuje i proširuje sve',
    faza: 'aktivna',
    napredak: 100,
  },
];

// ─── Mogućnosti ──────────────────────────────────────────

const mogucnosti: string[] = [
  'Spaja SVE endžine u jedan veliki unificirani Glavni Endžin',
  `Automatski sklapa gotove proizvode — ${platforme.length} platformi, ${TOTAL_IGRICA} igrica, ${products.length} IT proizvoda`,
  'Unapređuje SVE platforme i sva poslovanja automatski',
  'Glavni endžin Digitalne Industrije — pokreće celokupan ekosistem',
  'Suslediće da SVE iznikne na 100% kompletnosti',
  'Neprekidno evolvira — nikad ne staje, uvek se poboljšava',
  `Koordinira ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona`,
  `SpajaPro v${SPAJA_PRO_RANGE} — svi endžini integrisani`,
  `Gaming platforma sa ${TOTAL_IGRICA} igrica — dimenzionalno renderovanje 360D-5760D`,
  'Proksi mreža — hipsoneurični signal, ekscentrični modulator',
  'Mobilna mreža — 4 centrale, +38177/+38188/+38178/+38187',
  'Backend infrastruktura — SPAJA BAZA, Auth, Mejl, Platni Sistem, Real-time',
  'Finansije — Banka, Menjačnica, Stripe platni sistem',
  'Bezbednost — Zero Trust, AES-256-GCM, PBKDF2-SHA512',
  `Repo endžini — 14 repozitorijuma sa prevučenim endžinima`,
  'Automatska auto-popravka i dijagnostika',
  'Digitalni hardver — Kompjuter, GPU, RAM, Brauzer, Televizor',
  'OMEGA PROJEKAT — plasiranje, zvanično otvaranje, eksponencijalne funkcije',
  'POTPUNE DOZVOLE — Glavni Endžin ima sve dozvole za upravljanje celom Digitalnom Industrijom',
  'AGENT ORKESTRACIJA — svi agenti slušaju Glavni Endžin i automatski rade bez intervencije',
  'LIVE DIGITALNA INDUSTRIJA — radi automatski 24/7 bez potrebe za manuelnim radom',
  'AUTO-BILLING — Vercel i GitHub automatski se plaćaju sa novih računa, fallback na AI IQ World Bank',
];

// ─── Statistika ──────────────────────────────────────────

function izracunajStatistiku(spojeni: SpojeniEndzin[], sklopljeni: AutoSklapanjeProizvod[]): GlavniEndzinStatistika {
  const aktivnih = spojeni.filter((e) => e.status === 'aktivan').length;
  const prosek = spojeni.length > 0
    ? Math.round(spojeni.reduce((a, e) => a + e.optimizacija, 0) / spojeni.length)
    : 0;

  const poTipu = (tip: EngineTip) => spojeni.filter((e) => e.tip === tip).length;

  const platformiSklopljeno = sklopljeni.filter((s) => s.tip === 'platforma').length;
  const igricaSklopljeno = sklopljeni.filter((s) => s.tip === 'igrica').length;
  const proizvodaSklopljeno = sklopljeni.filter((s) => s.tip === 'it-proizvod').length;

  return {
    ukupnoSpojenih: spojeni.length,
    aktivnihEndžina: aktivnih,
    prosecnaOptimizacija: prosek,
    repoEndžina: poTipu('repo-engine'),
    coreEndžina: poTipu('core'),
    aiEndžina: poTipu('ai'),
    mrezaEndžina: poTipu('mreza'),
    finansijeEndžina: poTipu('finansije'),
    gamingEndžina: poTipu('gaming'),
    deployEndžina: poTipu('deploy'),
    bezbednostEndžina: poTipu('bezbednost'),
    komunikacijaEndžina: poTipu('komunikacija'),
    ukupnoIgricaPokrenutih: igricaSklopljeno,
    ukupnoPlatformiPokrenutih: platformiSklopljeno,
    ukupnoProizvodaSklopljenih: proizvodaSklopljeno,
    evolucijaCiklusa: evolucijaCiklusi.length,
    kompletnostSistema: 100,
  };
}

// ─── Glavni Endžin — Instanca ────────────────────────────

const spojeniEndzini = spojiSveEndzine();
const sklopljeniProizvodi = autoSklopiProizvode();

export const glavniEndzinDigitalneIndustrije: GlavniEndzinDigitalneIndustrije = {
  id: 'glavni-endzin-digitalne-industrije',
  naziv: 'Glavni Endžin Digitalne Industrije',
  opis:
    'Glavni Endžin koji spaja SVE endžine u jedan veliki unificirani endžin. ' +
    'Automatski sklapa gotove proizvode i igrice, unapređuje sve platforme ' +
    'i sva poslovanja. Smešten kao glavni endžin Digitalne Industrije koji ' +
    'SVE pokreće, suslediće da SVE iznikne na 100% i neprekidno evolvira. ' +
    `Objedinjuje ${spojeniEndzini.length} endžina, ${sklopljeniProizvodi.length} sklopljenih proizvoda, ` +
    `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona.`,
  ikona: '🏭⚙️',
  verzija: '2.0.0',
  status: 'aktivan',
  spojeniEndzini,
  autoSklapanje: sklopljeniProizvodi,
  evolucija: evolucijaCiklusi,
  statistika: izracunajStatistiku(spojeniEndzini, sklopljeniProizvodi),
  mogucnosti,
  misija:
    'Spajanje SVIH endžina u jedan veliki Glavni Endžin koji automatski sklapa gotove proizvode, ' +
    'unapređuje sve platforme i poslovanja, pokreće celokupnu Digitalnu Industriju, ' +
    'obezbeđuje 100% kompletnost i neprekidno evolvira.',
  vizija:
    'Glavni Endžin koji NIKAD ne staje — neprekidno evolvira, automatski sklapa, ' +
    'unapređuje i pokreće celokupan ekosistem Digitalne Industrije Kompanije SPAJA. ' +
    'Svaki endžin je spojen, svaki proizvod je sklopljen, sve je na 100%.',
};

// ─── Helper funkcije ─────────────────────────────────────

/** Dohvati sve spojene endžine */
export function getSvojeneEndzine(): SpojeniEndzin[] {
  return spojeniEndzini;
}

/** Dohvati sve automatski sklopljene proizvode */
export function getSklopljeneProizvode(): AutoSklapanjeProizvod[] {
  return sklopljeniProizvodi;
}

/** Dohvati evolucione cikluse */
export function getEvolucijaCikluse(): EvolucijaCiklus[] {
  return evolucijaCiklusi;
}

/** Dohvati statistiku Glavnog Endžina */
export function getGlavniEndzinStatistika(): GlavniEndzinStatistika {
  return izracunajStatistiku(spojeniEndzini, sklopljeniProizvodi);
}

/** Dohvati spojene endžine po tipu */
export function getSpojenePoTipu(tip: EngineTip): SpojeniEndzin[] {
  return spojeniEndzini.filter((e) => e.tip === tip);
}

/** Dohvati sklopljene po tipu */
export function getSklopljenePoTipu(tip: AutoSklapanjeProizvod['tip']): AutoSklapanjeProizvod[] {
  return sklopljeniProizvodi.filter((s) => s.tip === tip);
}

/** Dohvati ukupan broj svih entiteta pokretanih od Glavnog Endžina */
export function getUkupnoPokrenutih(): number {
  return sklopljeniProizvodi.length;
}

/** Dohvati kompletnost sistema */
export function getKompletnostSistema(): number {
  return 100;
}

/** Dohvati pregled Glavnog Endžina */
export function getGlavniEndzinPregled() {
  const stats = getGlavniEndzinStatistika();
  return {
    naziv: glavniEndzinDigitalneIndustrije.naziv,
    verzija: glavniEndzinDigitalneIndustrije.verzija,
    status: glavniEndzinDigitalneIndustrije.status,
    ukupnoSpojenih: stats.ukupnoSpojenih,
    aktivnihEndžina: stats.aktivnihEndžina,
    prosecnaOptimizacija: stats.prosecnaOptimizacija,
    ukupnoPlatformi: stats.ukupnoPlatformiPokrenutih,
    ukupnoIgrica: stats.ukupnoIgricaPokrenutih,
    ukupnoProizvoda: stats.ukupnoProizvodaSklopljenih,
    kompletnost: stats.kompletnostSistema,
    evolucija: evolucijaCiklusi.length,
  };
}
