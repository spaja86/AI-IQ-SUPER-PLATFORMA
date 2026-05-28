import { APP_VERSION, BASE_URL, KOMPANIJA } from './constants';

export type DistribucijaKanalTip = 'cdn' | 'edge' | 'tv' | 'api' | 'partner';
export type DistribucijaStatus = 'aktivan' | 'degradiran' | 'odrzavanje';

export interface DistribucijaCvor {
  id: string;
  naziv: string;
  regija: string;
  status: DistribucijaStatus;
  latencijaMs: number;
  kapacitetGbps: number;
}

export interface DistribucijaKanal {
  id: string;
  naziv: string;
  tip: DistribucijaKanalTip;
  status: DistribucijaStatus;
  dnevniPrometTb: number;
  errorRatePct: number;
}

export interface DistribucijaKpi {
  ukupnoCvorova: number;
  aktivnihCvorova: number;
  ukupnoKanala: number;
  aktivnihKanala: number;
  dnevniPrometTb: number;
  prosecnaLatencijaMs: number;
  prosecniErrorRatePct: number;
}

export interface DistribucijaReadiness {
  status: 'spremno' | 'oprez' | 'blokirano';
  score: number;
  blokatori: string[];
  preporuke: string[];
}

export interface DistribucijaModel {
  naziv: string;
  opis: string;
  verzija: string;
  kompanija: string;
  sourceOfTruth: '/api/distribucija';
  status: DistribucijaStatus;
  cvorovi: DistribucijaCvor[];
  kanali: DistribucijaKanal[];
  kpi: DistribucijaKpi;
  readiness: DistribucijaReadiness;
  dashboardLink: '/distribucija';
  apiLink: '/api/distribucija';
  docsLink: string;
}

const cvorovi: DistribucijaCvor[] = [
  { id: 'dist-eu-1', naziv: 'Distribucija EU 1', regija: 'Evropa', status: 'aktivan', latencijaMs: 3.2, kapacitetGbps: 220 },
  { id: 'dist-us-1', naziv: 'Distribucija US 1', regija: 'Severna Amerika', status: 'aktivan', latencijaMs: 4.1, kapacitetGbps: 210 },
  { id: 'dist-apac-1', naziv: 'Distribucija APAC 1', regija: 'Azija Pacifik', status: 'aktivan', latencijaMs: 5.4, kapacitetGbps: 180 },
  { id: 'dist-me-1', naziv: 'Distribucija ME 1', regija: 'Bliski Istok', status: 'aktivan', latencijaMs: 6.3, kapacitetGbps: 150 },
  { id: 'dist-balkan-1', naziv: 'Distribucija Balkan 1', regija: 'Srbija / Balkan', status: 'aktivan', latencijaMs: 2.6, kapacitetGbps: 260 },
];

const kanali: DistribucijaKanal[] = [
  { id: 'kanal-cdn', naziv: 'CDN Distribucija', tip: 'cdn', status: 'aktivan', dnevniPrometTb: 410, errorRatePct: 0.08 },
  { id: 'kanal-edge', naziv: 'Edge Isporuka', tip: 'edge', status: 'aktivan', dnevniPrometTb: 360, errorRatePct: 0.11 },
  { id: 'kanal-tv', naziv: 'TV Signal Kanali', tip: 'tv', status: 'aktivan', dnevniPrometTb: 190, errorRatePct: 0.15 },
  { id: 'kanal-api', naziv: 'API Gateway Distribucija', tip: 'api', status: 'aktivan', dnevniPrometTb: 140, errorRatePct: 0.07 },
  { id: 'kanal-partner', naziv: 'Partner Dispatch', tip: 'partner', status: 'aktivan', dnevniPrometTb: 72, errorRatePct: 0.2 },
];

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function buildKpi(): DistribucijaKpi {
  const ukupnoCvorova = cvorovi.length;
  const aktivnihCvorova = cvorovi.filter((cvor) => cvor.status === 'aktivan').length;
  const ukupnoKanala = kanali.length;
  const aktivnihKanala = kanali.filter((kanal) => kanal.status === 'aktivan').length;
  const dnevniPrometTb = kanali.reduce((sum, kanal) => sum + kanal.dnevniPrometTb, 0);
  const prosecnaLatencijaMs = round2(cvorovi.reduce((sum, cvor) => sum + cvor.latencijaMs, 0) / ukupnoCvorova);
  const prosecniErrorRatePct = round2(kanali.reduce((sum, kanal) => sum + kanal.errorRatePct, 0) / ukupnoKanala);

  return {
    ukupnoCvorova,
    aktivnihCvorova,
    ukupnoKanala,
    aktivnihKanala,
    dnevniPrometTb,
    prosecnaLatencijaMs,
    prosecniErrorRatePct,
  };
}

function buildReadiness(kpi: DistribucijaKpi): DistribucijaReadiness {
  const blokatori: string[] = [];
  if (kpi.aktivnihCvorova < kpi.ukupnoCvorova) blokatori.push('Nisu svi čvorovi aktivni');
  if (kpi.prosecniErrorRatePct > 1) blokatori.push('Error rate je iznad ciljanog praga');
  if (kpi.prosecnaLatencijaMs > 25) blokatori.push('Latencija je iznad ciljanog praga');

  const status: DistribucijaReadiness['status'] = blokatori.length === 0 ? 'spremno' : blokatori.length === 1 ? 'oprez' : 'blokirano';
  const score = Math.max(0, 100 - blokatori.length * 20);

  return {
    status,
    score,
    blokatori,
    preporuke: blokatori.length === 0
      ? ['Nastaviti standardni monitoring distribucije']
      : ['Povećati kapacitet ugroženih kanala', 'Verifikovati failover politiku i alarming'],
  };
}

const kpi = buildKpi();
const readiness = buildReadiness(kpi);

export const distribucijaModel: DistribucijaModel = {
  naziv: 'DISTRIBUCIJA — Globalni operativni modul',
  opis: 'Jedinstveni model za distribuciju sadržaja, API saobraćaja i partnerskih kanala.',
  verzija: APP_VERSION,
  kompanija: KOMPANIJA,
  sourceOfTruth: '/api/distribucija',
  status: readiness.status === 'spremno' ? 'aktivan' : readiness.status === 'oprez' ? 'degradiran' : 'odrzavanje',
  cvorovi,
  kanali,
  kpi,
  readiness,
  dashboardLink: '/distribucija',
  apiLink: '/api/distribucija',
  docsLink: `${BASE_URL}/distribucija`,
};

export function getDistribucijaModel(): DistribucijaModel {
  return distribucijaModel;
}

export function getDistribucijaKpi(): DistribucijaKpi {
  return distribucijaModel.kpi;
}

export function getDistribucijaReadiness(): DistribucijaReadiness {
  return distribucijaModel.readiness;
}

