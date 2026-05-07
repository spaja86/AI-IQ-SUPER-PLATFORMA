import { APP_VERSION } from './constants';
import { KOMPJUTER_GPU_JEZGRA, KOMPJUTER_RAM_GB } from './spaja-digitalni-kompjuter';
import { spajaDigitalniBrouvzer } from './spaja-digitalni-brouvzer';
import { igrice } from './igrice';
import type { DimenzijaNivo } from './dimenzije';

export type ProzorStatus = 'aktivan' | 'startup' | 'ucitavanje' | 'sinhronizacija';
export type ProzorRezim = 'startup-shell' | 'gaming-runtime' | 'brouvzer-bridge';
export type ProzorKanalTip = 'audio' | 'vizuelni' | 'haptic' | 'signalni' | 'mrezni' | 'gpu';

export interface ProzorKanal {
  id: string;
  naziv: string;
  tip: ProzorKanalTip;
  status: ProzorStatus;
  opis: string;
  protokGbps: number;
}

export interface ProzorSnaga {
  gpuJezgra: number;
  ramGB: number;
  cpuKanali: number;
  cipKanali: number;
  faktorBrouvzera: number;
  ukupnaSnagaIndex: number;
}

export interface AplikacionaPlatforma {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  href: string;
  kategorije: string[];
}

export interface DigitalniProzorStatistika {
  aktivnihIgrica: number;
  aktivnihKanala: number;
  protokGbps: number;
  snagaProzora: number;
}

export interface DigitalniProzor {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  brouvzerLink: string;
  rezim: ProzorRezim;
  kompijuterSnaga: ProzorSnaga;
  stimulacioniKanali: ProzorKanal[];
  eksponencijalniOdraz: Record<DimenzijaNivo, number>;
  aplikacionePlatforme: AplikacionaPlatforma[];
  statistika: DigitalniProzorStatistika;
}

const EKSPONENCIJALNI_MULTIPLIKATOR: Record<DimenzijaNivo, number> = {
  '360D': 1.36,
  '720D': 1.72,
  '1440D': 2.14,
  '2880D': 2.88,
  '5760D': 3.74,
};

const stimulacioniKanali: ProzorKanal[] = [
  {
    id: 'kanal-audio',
    naziv: 'Audio stimulacioni kanal',
    tip: 'audio',
    status: 'aktivan',
    opis: 'Sinhronizuje zvuk i odziv igrice prema dimenzionalnom nivou.',
    protokGbps: 120,
  },
  {
    id: 'kanal-vizuelni',
    naziv: 'Vizuelni stimulacioni kanal',
    tip: 'vizuelni',
    status: 'aktivan',
    opis: 'Prosleđuje render signal iz Brouvzera u Prozor shell.',
    protokGbps: 340,
  },
  {
    id: 'kanal-haptic',
    naziv: 'Haptic stimulacioni kanal',
    tip: 'haptic',
    status: 'aktivan',
    opis: 'Obrađuje povratne impulse kontrolera i konzola.',
    protokGbps: 90,
  },
  {
    id: 'kanal-signalni',
    naziv: 'Signalni protok kanal',
    tip: 'signalni',
    status: 'aktivan',
    opis: 'Stabilizuje startup handshake između BROUVZER i PROZOR sloja.',
    protokGbps: 260,
  },
  {
    id: 'kanal-mrezni',
    naziv: 'Mrežni stimulacioni kanal',
    tip: 'mrezni',
    status: 'aktivan',
    opis: 'Obezbeđuje low-latency podatkovni protok tokom gaming sesije.',
    protokGbps: 420,
  },
  {
    id: 'kanal-gpu',
    naziv: 'GPU kanal',
    tip: 'gpu',
    status: 'aktivan',
    opis: 'Direktan GPU most za eksponencijalni odraz snage.',
    protokGbps: 680,
  },
];

const aplikacionePlatforme: AplikacionaPlatforma[] = [
  {
    id: 'platforma-startup-launcher',
    naziv: 'Startup Launcher',
    opis: 'Brzi pokretač igrica i gaming sesija unutar DIGITALNI PROZOR sloja.',
    ikona: '🚀',
    href: '/igrice',
    kategorije: ['akcija', 'avantura', 'simulacija'],
  },
  {
    id: 'platforma-dimenzionalni-izbor',
    naziv: 'Dimenzionalni izbor',
    opis: 'Modul za izbor 360D–5760D režima i pripremu rendering profila.',
    ikona: '🌀',
    href: '/dimenzije',
    kategorije: ['logicka', 'edukativna', 'kreativna'],
  },
  {
    id: 'platforma-gaming-control',
    naziv: 'Gaming Control',
    opis: 'Status traka i runtime kontrola između Brouvzer-a i Game Endžina.',
    ikona: '🎮',
    href: '/io-openui-ao-gaming-platforma',
    kategorije: ['sportska', 'trka', 'rpg'],
  },
];

export function kalkulisiEksponencijalniOdraz(dimenzija: DimenzijaNivo): number {
  const gpuMilioni = KOMPJUTER_GPU_JEZGRA / 1_000_000;
  const ramFaktor = Math.log10(KOMPJUTER_RAM_GB);
  const vrednost = gpuMilioni * EKSPONENCIJALNI_MULTIPLIKATOR[dimenzija] * ramFaktor;
  return Number(vrednost.toFixed(2));
}

export function getProzorSnagu(): ProzorSnaga {
  const faktorBrouvzera = 1.6;
  const ukupnaSnagaIndex = Number(
    ((KOMPJUTER_GPU_JEZGRA / 1_000_000) * Math.log10(KOMPJUTER_RAM_GB) * faktorBrouvzera).toFixed(2),
  );

  return {
    gpuJezgra: KOMPJUTER_GPU_JEZGRA,
    ramGB: KOMPJUTER_RAM_GB,
    cpuKanali: 2,
    cipKanali: 2,
    faktorBrouvzera,
    ukupnaSnagaIndex,
  };
}

export function getStimulacioneKanale(): ProzorKanal[] {
  return stimulacioniKanali.filter((kanal) => kanal.status === 'aktivan');
}

function getProzorStatistiku(): DigitalniProzorStatistika {
  const aktivnihKanala = getStimulacioneKanale().length;
  return {
    aktivnihIgrica: igrice.filter((igrica) => igrica.status === 'aktivna' || igrica.status === 'beta').length,
    aktivnihKanala,
    protokGbps: getStimulacioneKanale().reduce((sum, kanal) => sum + kanal.protokGbps, 0),
    snagaProzora: getProzorSnagu().ukupnaSnagaIndex,
  };
}

export const spajaDigitalniProzor: DigitalniProzor = {
  naziv: 'DIGITALNI PROZOR',
  opis:
    'Aplikaciona startup platforma za pokretanje igrica iz DIGITALNI BROUVZER-a. ' +
    'DIGITALNI KOMPIJUTER protokuje stimulacionim kanalima eksponencijalni odraz snage ' +
    'koji se manifestuje u PROZOR shell-u pre pokretanja Gaming Endžina.',
  ikona: '🪟',
  verzija: APP_VERSION,
  brouvzerLink: spajaDigitalniBrouvzer.link,
  rezim: 'startup-shell',
  kompijuterSnaga: getProzorSnagu(),
  stimulacioniKanali: getStimulacioneKanale(),
  eksponencijalniOdraz: {
    '360D': kalkulisiEksponencijalniOdraz('360D'),
    '720D': kalkulisiEksponencijalniOdraz('720D'),
    '1440D': kalkulisiEksponencijalniOdraz('1440D'),
    '2880D': kalkulisiEksponencijalniOdraz('2880D'),
    '5760D': kalkulisiEksponencijalniOdraz('5760D'),
  },
  aplikacionePlatforme,
  statistika: getProzorStatistiku(),
};

