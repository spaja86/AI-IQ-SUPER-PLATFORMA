/**
 * 💸 Ekslatacija Proizvoda — AI IQ SUPER PLATFORMA
 *
 * Komercijalni lifecycle IT proizvoda — praćenje faza ekslatacije,
 * komercijalnih modela, prihoda i tržišne pokrivenosti Digitalne Industrije.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';
import { itProizvodi } from './it-proizvodi';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type EkslatacijaFaza =
  | 'istrazivanje'
  | 'razvoj'
  | 'pilot'
  | 'lansiranje'
  | 'skaliranje'
  | 'zrelost'
  | 'opadanje';

export type KomercijalnIModel =
  | 'b2b'
  | 'b2c'
  | 'saas'
  | 'licenciranje'
  | 'freemium'
  | 'api-pristup'
  | 'consulting';

export type EkslatacijaStatus = 'aktivan' | 'u_pripremi' | 'planiran' | 'povucen';

export interface ProizvodEkslatacija {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: string;
  fazaEkslatacije: EkslatacijaFaza;
  komercijalnIModel: KomercijalnIModel;
  status: EkslatacijaStatus;
  /** Mesečni prihod u EUR (procenjeni) */
  prihod: number;
  /** Godišnji rast u % */
  rast: number;
  /** Tržišna pokrivenost u % (0–100) */
  trzisnaPokrivenost: number;
  /** Indeks konkurentnosti (1–10) */
  konkurentnostIndex: number;
  ciljnoTrziste: string[];
  kanalProdaje: string[];
}

export interface EkslatacijaKanal {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: KomercijalnIModel;
  aktivnih: number;
  potencijalEUR: number;
}

export interface EkslatacijaMetrike {
  ukupnoProizvoda: number;
  aktivnih: number;
  uPripremi: number;
  planirani: number;
  povuceni: number;
  ukupanPotencijalPrihoda: number;
  prosecniRast: number;
  prosecnaPokrivenost: number;
  aktivnihKanala: number;
  fazama: Record<EkslatacijaFaza, number>;
  modelima: Record<KomercijalnIModel, number>;
}

export interface EkslatacijaRezultat {
  naziv: string;
  verzija: string;
  status: 'aktivan';
  timestamp: string;
  kompanija: string;
  metrike: EkslatacijaMetrike;
  kanali: EkslatacijaKanal[];
  poFazama: Array<{ faza: EkslatacijaFaza; broj: number; opis: string; ukupanPrihod: number }>;
  poModelima: Array<{ model: KomercijalnIModel; broj: number; ukupanPrihod: number }>;
  vrhunckiProizvodi: ProizvodEkslatacija[];
  sviProizvodi: Array<{
    id: string;
    naziv: string;
    ikona: string;
    faza: EkslatacijaFaza;
    model: KomercijalnIModel;
    status: EkslatacijaStatus;
    prihod: number;
    rast: number;
  }>;
}

// ─── Kanali Ekslatacije ───────────────────────────────────────────────────────

export const ekslatacijaKanali: EkslatacijaKanal[] = [
  {
    id: 'direktna-prodaja',
    naziv: 'Direktna Prodaja',
    opis: 'Direktno fakturisanje korporativnim i enterprise klijentima kroz SPAJA sales tim',
    ikona: '🤝',
    tip: 'b2b',
    aktivnih: 8,
    potencijalEUR: 180000,
  },
  {
    id: 'saas-pretplata',
    naziv: 'SaaS Pretplata',
    opis: 'Mesečna i godišnja pretplata za platformske proizvode kroz samoposluživanje',
    ikona: '☁️',
    tip: 'saas',
    aktivnih: 12,
    potencijalEUR: 240000,
  },
  {
    id: 'api-marketplace',
    naziv: 'API Marketplace',
    opis: 'Naplata po pozivima i tokenu za AI i integracionse engine-e',
    ikona: '🌐',
    tip: 'api-pristup',
    aktivnih: 6,
    potencijalEUR: 120000,
  },
  {
    id: 'licencni-kanal',
    naziv: 'Licencni Kanal',
    opis: 'Enterprise licence za gaming engine-e, AI module i bezbednosne alate',
    ikona: '📜',
    tip: 'licenciranje',
    aktivnih: 5,
    potencijalEUR: 200000,
  },
  {
    id: 'partnerski-kanal',
    naziv: 'Partnerski Kanal',
    opis: 'Distribucija kroz partnere i resellere — affiliate i revenue sharing model',
    ikona: '🔗',
    tip: 'b2c',
    aktivnih: 4,
    potencijalEUR: 80000,
  },
  {
    id: 'freemium-konverzija',
    naziv: 'Freemium Konverzija',
    opis: 'Besplatan pristup sa premium unapređenjem — monitoring, analitika, deploy alati',
    ikona: '🆓',
    tip: 'freemium',
    aktivnih: 3,
    potencijalEUR: 60000,
  },
  {
    id: 'consulting-usluge',
    naziv: 'Consulting Usluge',
    opis: 'Implementacija i integracija na zahtev — SpajaPro + OMEGA AI consulting',
    ikona: '💼',
    tip: 'consulting',
    aktivnih: 3,
    potencijalEUR: 90000,
  },
];

// ─── Podaci: Katalog Ekslatiranih Proizvoda ───────────────────────────────────

export const ekslatacijaProizvodi: ProizvodEkslatacija[] = [
  {
    id: 'omega-ai-engine',
    naziv: 'OMEGA AI Engine',
    opis: 'Centralni AI engine sa SpajaPro Prompt integracijom — flagship proizvod za B2B ekslataciju',
    ikona: '🧠',
    kategorija: 'ai',
    fazaEkslatacije: 'skaliranje',
    komercijalnIModel: 'saas',
    status: 'aktivan',
    prihod: 45000,
    rast: 38,
    trzisnaPokrivenost: 62,
    konkurentnostIndex: 9,
    ciljnoTrziste: ['enterprise', 'mid-market', 'gaming-studio'],
    kanalProdaje: ['saas-pretplata', 'api-marketplace', 'direktna-prodaja'],
  },
  {
    id: 'spajapro-prompt-engine',
    naziv: 'SpajaPro Prompt Engine',
    opis: 'SpajaPro 6-15 — zamena za ChatGPT u ekosistemu, visok potencijal licenciranja',
    ikona: '🌟',
    kategorija: 'ai',
    fazaEkslatacije: 'lansiranje',
    komercijalnIModel: 'licenciranje',
    status: 'aktivan',
    prihod: 28000,
    rast: 55,
    trzisnaPokrivenost: 35,
    konkurentnostIndex: 8,
    ciljnoTrziste: ['enterprise', 'tech-partner', 'gaming-studio'],
    kanalProdaje: ['licencni-kanal', 'direktna-prodaja', 'api-marketplace'],
  },
  {
    id: 'spaja-shield',
    naziv: 'SPAJA Shield',
    opis: 'Bezbednosni štit — WAF, DDoS zaštita, rate limiting za platforme',
    ikona: '🛡️',
    kategorija: 'bezbednost',
    fazaEkslatacije: 'zrelost',
    komercijalnIModel: 'saas',
    status: 'aktivan',
    prihod: 32000,
    rast: 18,
    trzisnaPokrivenost: 78,
    konkurentnostIndex: 8,
    ciljnoTrziste: ['enterprise', 'finansijska-institucija', 'gaming-studio'],
    kanalProdaje: ['saas-pretplata', 'licencni-kanal', 'direktna-prodaja'],
  },
  {
    id: 'spaja-accelerator',
    naziv: 'SPAJA Accelerator',
    opis: 'Ubrzanje performansi svih platformi — CDN, edge caching, lazy loading',
    ikona: '⚡',
    kategorija: 'ubrzanje',
    fazaEkslatacije: 'zrelost',
    komercijalnIModel: 'saas',
    status: 'aktivan',
    prihod: 22000,
    rast: 12,
    trzisnaPokrivenost: 82,
    konkurentnostIndex: 7,
    ciljnoTrziste: ['mid-market', 'enterprise', 'startup'],
    kanalProdaje: ['saas-pretplata', 'freemium-konverzija'],
  },
  {
    id: 'spaja-game-engine',
    naziv: 'SPAJA Game Engine',
    opis: 'Dimenzionalni game engine 360D–5760D — premium licenca za gaming studije',
    ikona: '🎮',
    kategorija: 'gaming',
    fazaEkslatacije: 'lansiranje',
    komercijalnIModel: 'licenciranje',
    status: 'aktivan',
    prihod: 38000,
    rast: 72,
    trzisnaPokrivenost: 28,
    konkurentnostIndex: 10,
    ciljnoTrziste: ['gaming-studio', 'indie-developer', 'enterprise'],
    kanalProdaje: ['licencni-kanal', 'direktna-prodaja', 'partnerski-kanal'],
  },
  {
    id: 'spaja-monitor',
    naziv: 'SPAJA Monitor',
    opis: 'Monitoring svih servisa u realnom vremenu — freemium ulazna tačka ekosistema',
    ikona: '📊',
    kategorija: 'monitoring',
    fazaEkslatacije: 'skaliranje',
    komercijalnIModel: 'freemium',
    status: 'aktivan',
    prihod: 15000,
    rast: 44,
    trzisnaPokrivenost: 55,
    konkurentnostIndex: 7,
    ciljnoTrziste: ['startup', 'mid-market', 'developer'],
    kanalProdaje: ['freemium-konverzija', 'saas-pretplata'],
  },
  {
    id: 'spaja-api-gateway',
    naziv: 'SPAJA API Gateway',
    opis: 'Centralni API gateway — naplata po API pozivu za integracione partnere',
    ikona: '🌐',
    kategorija: 'integracija',
    fazaEkslatacije: 'skaliranje',
    komercijalnIModel: 'api-pristup',
    status: 'aktivan',
    prihod: 19000,
    rast: 31,
    trzisnaPokrivenost: 48,
    konkurentnostIndex: 8,
    ciljnoTrziste: ['enterprise', 'mid-market', 'tech-partner'],
    kanalProdaje: ['api-marketplace', 'direktna-prodaja'],
  },
  {
    id: 'spaja-multiplayer-server',
    naziv: 'SPAJA Multiplayer Server',
    opis: 'Multiplayer server za dimenzionalne igrice — SaaS za gaming studije',
    ikona: '👥',
    kategorija: 'gaming',
    fazaEkslatacije: 'pilot',
    komercijalnIModel: 'saas',
    status: 'aktivan',
    prihod: 12000,
    rast: 88,
    trzisnaPokrivenost: 15,
    konkurentnostIndex: 9,
    ciljnoTrziste: ['gaming-studio', 'indie-developer'],
    kanalProdaje: ['saas-pretplata', 'direktna-prodaja'],
  },
  {
    id: 'spaja-data-sync',
    naziv: 'SPAJA Data Sync',
    opis: 'Sinhronizacija podataka između platformi — B2B integracija sa finansijskim institucijama',
    ikona: '📡',
    kategorija: 'podaci',
    fazaEkslatacije: 'lansiranje',
    komercijalnIModel: 'b2b',
    status: 'aktivan',
    prihod: 25000,
    rast: 42,
    trzisnaPokrivenost: 33,
    konkurentnostIndex: 7,
    ciljnoTrziste: ['finansijska-institucija', 'enterprise', 'tech-partner'],
    kanalProdaje: ['direktna-prodaja', 'partnerski-kanal'],
  },
  {
    id: 'spaja-deploy',
    naziv: 'SPAJA Deploy',
    opis: 'Automatski deploy na sve platforme — zero-downtime, rollback, preview environments',
    ikona: '🚀',
    kategorija: 'deploy',
    fazaEkslatacije: 'zrelost',
    komercijalnIModel: 'saas',
    status: 'aktivan',
    prihod: 18000,
    rast: 15,
    trzisnaPokrivenost: 71,
    konkurentnostIndex: 7,
    ciljnoTrziste: ['developer', 'startup', 'mid-market'],
    kanalProdaje: ['saas-pretplata', 'freemium-konverzija'],
  },
  {
    id: 'spaja-vr-ar-engine',
    naziv: 'SPAJA VR/AR Engine',
    opis: 'VR i AR engine za dimenzionalne igrice — pilot sa odabranim gaming studijima',
    ikona: '🥽',
    kategorija: 'gaming',
    fazaEkslatacije: 'istrazivanje',
    komercijalnIModel: 'consulting',
    status: 'u_pripremi',
    prihod: 8000,
    rast: 120,
    trzisnaPokrivenost: 8,
    konkurentnostIndex: 10,
    ciljnoTrziste: ['gaming-studio', 'enterprise'],
    kanalProdaje: ['consulting-usluge', 'direktna-prodaja'],
  },
  {
    id: 'spaja-firewall',
    naziv: 'SPAJA Firewall',
    opis: 'Napredni firewall sa AI detekcijom — banking i fintech sektor',
    ikona: '🔒',
    kategorija: 'bezbednost',
    fazaEkslatacije: 'skaliranje',
    komercijalnIModel: 'licenciranje',
    status: 'aktivan',
    prihod: 29000,
    rast: 25,
    trzisnaPokrivenost: 52,
    konkurentnostIndex: 9,
    ciljnoTrziste: ['finansijska-institucija', 'enterprise'],
    kanalProdaje: ['licencni-kanal', 'direktna-prodaja'],
  },
  {
    id: 'spaja-integrator',
    naziv: 'SPAJA Integrator',
    opis: 'Integracija između platformi — consulting-driven model za complex enterprise deplojeve',
    ikona: '🔗',
    kategorija: 'integracija',
    fazaEkslatacije: 'razvoj',
    komercijalnIModel: 'consulting',
    status: 'u_pripremi',
    prihod: 6000,
    rast: 95,
    trzisnaPokrivenost: 10,
    konkurentnostIndex: 8,
    ciljnoTrziste: ['enterprise', 'finansijska-institucija'],
    kanalProdaje: ['consulting-usluge'],
  },
  {
    id: 'spaja-game-analytics',
    naziv: 'SPAJA Game Analytics',
    opis: 'Analitika za dimenzionalne igrice — freemium za indie studije, premium za enterprise',
    ikona: '📈',
    kategorija: 'gaming',
    fazaEkslatacije: 'pilot',
    komercijalnIModel: 'freemium',
    status: 'u_pripremi',
    prihod: 5000,
    rast: 110,
    trzisnaPokrivenost: 12,
    konkurentnostIndex: 8,
    ciljnoTrziste: ['gaming-studio', 'indie-developer'],
    kanalProdaje: ['freemium-konverzija', 'saas-pretplata'],
  },
  {
    id: 'spaja-crypto',
    naziv: 'SPAJA Crypto',
    opis: 'Kriptografski modul za enkripciju — planiran za banking regulatorna usklađenost',
    ikona: '🔐',
    kategorija: 'bezbednost',
    fazaEkslatacije: 'istrazivanje',
    komercijalnIModel: 'b2b',
    status: 'planiran',
    prihod: 0,
    rast: 0,
    trzisnaPokrivenost: 5,
    konkurentnostIndex: 7,
    ciljnoTrziste: ['finansijska-institucija', 'enterprise'],
    kanalProdaje: ['direktna-prodaja'],
  },
  {
    id: 'gigatron-procurement',
    naziv: 'GIGATRON Procurement Integration',
    opis: 'B2B IT i elektronika procurement integracija — katalog, narudžbine, affiliate program i upravljanje zalihama. Izvor: GIGATRON (platforms/gigatron)',
    ikona: '🛒',
    kategorija: 'integracija',
    fazaEkslatacije: 'lansiranje',
    komercijalnIModel: 'b2b',
    status: 'aktivan',
    prihod: 22000,
    rast: 65,
    trzisnaPokrivenost: 28,
    konkurentnostIndex: 8,
    ciljnoTrziste: ['enterprise', 'mid-market', 'tech-partner'],
    kanalProdaje: ['direktna-prodaja', 'partnerski-kanal', 'api-marketplace'],
  },
  {
    id: 'gigatron-affiliate',
    naziv: 'GIGATRON Affiliate Program',
    opis: 'Affiliate / partner provizija program za IT i elektroniku distribuciju kroz Kompanija SPAJA mrežu partnera',
    ikona: '🤝',
    kategorija: 'integracija',
    fazaEkslatacije: 'pilot',
    komercijalnIModel: 'b2c',
    status: 'u_pripremi',
    prihod: 8000,
    rast: 90,
    trzisnaPokrivenost: 15,
    konkurentnostIndex: 7,
    ciljnoTrziste: ['mid-market', 'startup', 'tech-partner'],
    kanalProdaje: ['partnerski-kanal', 'freemium-konverzija'],
  },
];

// ─── Opisi faza ekslatacije ───────────────────────────────────────────────────

const FAZA_OPISI: Record<EkslatacijaFaza, string> = {
  istrazivanje: 'Istraživanje tržišta, validacija ideje i feasibility analiza',
  razvoj: 'Aktivni razvoj MVP-a sa prvim pilot klijentima',
  pilot: 'Pilot deployment kod odabranih klijenata — prikupljanje feedback-a',
  lansiranje: 'Javno lansiranje na tržište — aktivna akvizicija novih klijenata',
  skaliranje: 'Skaliranje prodaje, partnerskih kanala i tržišne pokrivenosti',
  zrelost: 'Zreli proizvod sa stabilnom bazom korisnika i prihodom',
  opadanje: 'Opadanje potražnje — planirano povlačenje ili reimaginacija',
};

// ─── Helper Funkcije ──────────────────────────────────────────────────────────

export function getEkslatacijaMetrike(): EkslatacijaMetrike {
  const aktivnih = ekslatacijaProizvodi.filter((p) => p.status === 'aktivan').length;
  const uPripremi = ekslatacijaProizvodi.filter((p) => p.status === 'u_pripremi').length;
  const planirani = ekslatacijaProizvodi.filter((p) => p.status === 'planiran').length;
  const povuceni = ekslatacijaProizvodi.filter((p) => p.status === 'povucen').length;
  const ukupanPotencijalPrihoda = ekslatacijaProizvodi.reduce((sum, p) => sum + p.prihod, 0);
  const aktivniProizvodi = ekslatacijaProizvodi.filter((p) => p.status === 'aktivan');
  const prosecniRast =
    aktivniProizvodi.length > 0
      ? Math.round(aktivniProizvodi.reduce((sum, p) => sum + p.rast, 0) / aktivniProizvodi.length)
      : 0;
  const prosecnaPokrivenost =
    aktivniProizvodi.length > 0
      ? Math.round(aktivniProizvodi.reduce((sum, p) => sum + p.trzisnaPokrivenost, 0) / aktivniProizvodi.length)
      : 0;

  const fazama = ekslatacijaProizvodi.reduce(
    (acc, p) => {
      acc[p.fazaEkslatacije] = (acc[p.fazaEkslatacije] ?? 0) + 1;
      return acc;
    },
    {} as Record<EkslatacijaFaza, number>,
  );

  const modelima = ekslatacijaProizvodi.reduce(
    (acc, p) => {
      acc[p.komercijalnIModel] = (acc[p.komercijalnIModel] ?? 0) + 1;
      return acc;
    },
    {} as Record<KomercijalnIModel, number>,
  );

  return {
    ukupnoProizvoda: ekslatacijaProizvodi.length,
    aktivnih,
    uPripremi,
    planirani,
    povuceni,
    ukupanPotencijalPrihoda,
    prosecniRast,
    prosecnaPokrivenost,
    aktivnihKanala: ekslatacijaKanali.length,
    fazama,
    modelima,
  };
}

export function getProizvodiPoFazi(): Record<EkslatacijaFaza, ProizvodEkslatacija[]> {
  return ekslatacijaProizvodi.reduce(
    (acc, p) => {
      if (!acc[p.fazaEkslatacije]) acc[p.fazaEkslatacije] = [];
      acc[p.fazaEkslatacije].push(p);
      return acc;
    },
    {} as Record<EkslatacijaFaza, ProizvodEkslatacija[]>,
  );
}

export function getProizvodiPoModelu(): Record<KomercijalnIModel, ProizvodEkslatacija[]> {
  return ekslatacijaProizvodi.reduce(
    (acc, p) => {
      if (!acc[p.komercijalnIModel]) acc[p.komercijalnIModel] = [];
      acc[p.komercijalnIModel].push(p);
      return acc;
    },
    {} as Record<KomercijalnIModel, ProizvodEkslatacija[]>,
  );
}

export function getVrhunckiProizvodi(limit = 5): ProizvodEkslatacija[] {
  return [...ekslatacijaProizvodi].sort((a, b) => b.prihod - a.prihod).slice(0, limit);
}

export function getEkslatacijaPregled(): EkslatacijaRezultat {
  const metrike = getEkslatacijaMetrike();
  const poFazi = getProizvodiPoFazi();
  const poModelu = getProizvodiPoModelu();

  const fazaRedosled: EkslatacijaFaza[] = [
    'istrazivanje',
    'razvoj',
    'pilot',
    'lansiranje',
    'skaliranje',
    'zrelost',
    'opadanje',
  ];

  const poFazama = fazaRedosled
    .filter((faza) => (poFazi[faza] ?? []).length > 0)
    .map((faza) => {
      const proizvodi = poFazi[faza] ?? [];
      return {
        faza,
        broj: proizvodi.length,
        opis: FAZA_OPISI[faza],
        ukupanPrihod: proizvodi.reduce((sum, p) => sum + p.prihod, 0),
      };
    });

  const modelRedosled: KomercijalnIModel[] = [
    'saas',
    'licenciranje',
    'b2b',
    'api-pristup',
    'freemium',
    'consulting',
    'b2c',
  ];

  const poModelima = modelRedosled
    .filter((model) => (poModelu[model] ?? []).length > 0)
    .map((model) => {
      const proizvodi = poModelu[model] ?? [];
      return {
        model,
        broj: proizvodi.length,
        ukupanPrihod: proizvodi.reduce((sum, p) => sum + p.prihod, 0),
      };
    });

  return {
    naziv: `Ekslatacija Proizvoda — ${KOMPANIJA}`,
    verzija: APP_VERSION,
    status: 'aktivan',
    timestamp: new Date().toISOString(),
    kompanija: KOMPANIJA,
    metrike,
    kanali: ekslatacijaKanali,
    poFazama,
    poModelima,
    vrhunckiProizvodi: getVrhunckiProizvodi(),
    sviProizvodi: ekslatacijaProizvodi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      faza: p.fazaEkslatacije,
      model: p.komercijalnIModel,
      status: p.status,
      prihod: p.prihod,
      rast: p.rast,
    })),
  };
}

/** Ukupan mesečni potencijal prihoda svih kanala u EUR */
export function getUkupniKanalniPotencijal(): number {
  return ekslatacijaKanali.reduce((sum, k) => sum + k.potencijalEUR, 0);
}

/** Pronalazi IT proizvod iz it-proizvodi.ts po ID-u */
export function findItProizvodById(id: string) {
  return itProizvodi.find((p) => p.id === id) ?? null;
}
