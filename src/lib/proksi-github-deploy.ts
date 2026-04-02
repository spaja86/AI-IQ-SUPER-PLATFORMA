/**
 * 🚀📡 PROKSI GITHUB DEPLOY — Maksimalni Deploj na Sve Grane
 *
 * Ekscentrični Proksi signal sa AI IQ SUPER PLATFORMA
 * na bazno dejstvo repo sistema GitHub za maksimalni
 * prenos transfer podataka na sve grane.
 *
 * SpajaUltraOmegaCore -∞Ω+∞ programski jezik:
 * "maksimizujem deploj na sve grane tako što ću da ekscentrišem
 *  Proksi sa AI IQ SUPER PLATFORMA na bazno dejstvo repo sistema
 *  GitHub da radi maksimalni prenos transfer podataka"
 *
 * Arhitektura:
 * 1. Ekscentrični Proksi Signal → GitHub API bazno dejstvo
 * 2. Koncentrični Deploy Krug → Sve grane simultano
 * 3. Ekliptična Transfer Vez → Maksimalna propusnost podataka
 * 4. Rezonantni Sync Pojačavač → Sinhronizacija grana
 * 5. Hibridni Pipeline → CI/CD + Proksi + Omega Evolucija
 */

import { proksiSignali, proksiCvorovi, proksiMreza, type ProksiSignal } from './proksi';
import { platforme } from './platforme';

// ─── Tipovi ─────────────────────────────────────────────────────────

export type DeployGranaStatus =
  | 'aktivna'
  | 'sinhronizacija'
  | 'deploy-u-toku'
  | 'deploy-zavrsen'
  | 'ceka-merge'
  | 'neaktivna';

export type TransferProtokol =
  | 'ekscentricni-burst'
  | 'koncentricni-stream'
  | 'eklipticni-orbit'
  | 'rezonantni-sync'
  | 'hibridni-max';

export interface DeployGrana {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  sha: string;
  status: DeployGranaStatus;
  proksiSignal: string;
  transferProtokol: TransferProtokol;
  kapacitetTransfera: string;
  latencija: string;
  poslednjiDeploy: string;
}

export interface ProksiGitHubVeza {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  izvornaGrana: string;
  ciljnaGrana: string;
  signalTip: ProksiSignal['tip'];
  frekvencija: string;
  propusnost: string;
  status: 'aktivna' | 'modulacija' | 'cekanje';
}

export interface TransferPodatak {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  protokol: TransferProtokol;
  brzina: string;
  kapacitet: string;
  kompresija: string;
  enkripcija: string;
  paralelniTokovi: number;
}

export interface DeployPipeline {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  koraci: DeployKorak[];
  ukupnoTrajanjeMs: string;
  status: 'spreman' | 'aktivan' | 'zavrsen';
}

export interface DeployKorak {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  redosled: number;
  trajanje: string;
  proksiSignal: string;
}

export interface ProksiGitHubDeploySistem {
  naziv: string;
  verzija: string;
  opis: string;
  spektar: string;
  grane: DeployGrana[];
  veze: ProksiGitHubVeza[];
  transferi: TransferPodatak[];
  pipeline: DeployPipeline;
  ukupniKapacitet: string;
  ukupnoGrana: number;
  aktivnihGrana: number;
  proksiIntegracija: 'potpuna' | 'delimicna' | 'planirana';
  baznoDeploySistem: string;
}

// ─── Deploy Grane — Sve grane u repo sistemu ────────────────────────

export const deployGrane: DeployGrana[] = [
  {
    id: 'main',
    naziv: 'main — Produkcija',
    opis: 'Glavna produkcijska grana — bazno dejstvo celokupnog repo sistema GitHub sa Proksi ekscentričnim signalom',
    ikona: '🏠',
    sha: '7bbaa07',
    status: 'deploy-zavrsen',
    proksiSignal: 'hipsoneuricni-primarni',
    transferProtokol: 'hibridni-max',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.001 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/maximize-deploy-on-all-branches',
    naziv: 'Maximize Deploy — Ekscentrični Proksi',
    opis: 'Grana za maksimizaciju deploja na sve grane — ekscentrični Proksi signal za bazno dejstvo GitHub repo sistema',
    ikona: '🚀',
    sha: '7bbaa07',
    status: 'deploy-u-toku',
    proksiSignal: 'ekscentricni-modulator',
    transferProtokol: 'ekscentricni-burst',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.001 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/io-openui-ao-replace-chatgpt-with-spajapro-6-15',
    naziv: 'IO OPENUI AO — SpajaPro Engine',
    opis: 'Zamena ChatGPT sa SpajaPro 6-15 engine-om — Proksi transfer podataka za IO platformu',
    ikona: '🖥️',
    sha: '3c81a2d',
    status: 'ceka-merge',
    proksiSignal: 'eklipticna-veza',
    transferProtokol: 'eklipticni-orbit',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.002 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/spaja-univerzalni-prompt',
    naziv: 'SPAJA Univerzalni Prompt',
    opis: 'Univerzalni Prompt sistem — rezonantni Proksi prenos podataka',
    ikona: '💬',
    sha: '3c81a2d',
    status: 'ceka-merge',
    proksiSignal: 'rezonantni-pojacavac',
    transferProtokol: 'rezonantni-sync',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.002 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/add-proksi-za-wifi-antenu',
    naziv: 'Proksi WiFi Antena',
    opis: 'WiFi antena za ekscentrični Proksi signal — koncentrični deploy krug',
    ikona: '📡',
    sha: '3c81a2d',
    status: 'ceka-merge',
    proksiSignal: 'koncentricni-distributer',
    transferProtokol: 'koncentricni-stream',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.003 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/omega-projekt-evolucija',
    naziv: 'Omega Projekt Evolucija',
    opis: 'Autonomna evolucija projekta — hibridni Proksi pipeline za maksimalni transfer',
    ikona: '🧬',
    sha: '3c81a2d',
    status: 'ceka-merge',
    proksiSignal: 'hibridni-sinhronizator',
    transferProtokol: 'hibridni-max',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.002 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/performance-issues-vercel-deployment',
    naziv: 'Vercel Performance Fix',
    opis: 'Popravka performansi Vercel deploja — ekscentrični burst transfer podataka',
    ikona: '⚡',
    sha: '3c81a2d',
    status: 'ceka-merge',
    proksiSignal: 'rezonantni-pojacavac',
    transferProtokol: 'ekscentricni-burst',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.002 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/create-full-sequences',
    naziv: 'Full Sekvence Sistem',
    opis: 'Kompletni sekvence sistem — ekliptični orbit transfer za sve stranice',
    ikona: '📋',
    sha: '88924d9',
    status: 'ceka-merge',
    proksiSignal: 'eklipticna-veza',
    transferProtokol: 'eklipticni-orbit',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.003 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/analizirati-sve-repositeoria',
    naziv: 'Analiza Svih Repozitorijuma',
    opis: 'Analiza svih repo sistema — koncentrični Proksi stream za dijagnostiku',
    ikona: '🔍',
    sha: '000f16b',
    status: 'ceka-merge',
    proksiSignal: 'koncentricni-distributer',
    transferProtokol: 'koncentricni-stream',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.003 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/add-omega-ai-link',
    naziv: 'OMEGA AI Link',
    opis: 'OMEGA AI veza — rezonantni sync signal za AI agente',
    ikona: '🧠',
    sha: '34d25a7',
    status: 'aktivna',
    proksiSignal: 'rezonantni-pojacavac',
    transferProtokol: 'rezonantni-sync',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.002 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/ai-iq-super-platform-status',
    naziv: 'AI IQ Status Platforma',
    opis: 'Status monitoring platforma — hibridni max transfer podataka',
    ikona: '📊',
    sha: '3c8c0a3',
    status: 'aktivna',
    proksiSignal: 'hibridni-sinhronizator',
    transferProtokol: 'hibridni-max',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.002 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/create-platform-skeleton',
    naziv: 'Platform Skeleton',
    opis: 'Osnovna struktura platforme — koncentrični deploy krug za skelet',
    ikona: '🏗️',
    sha: 'e247fb6',
    status: 'aktivna',
    proksiSignal: 'koncentricni-distributer',
    transferProtokol: 'koncentricni-stream',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.003 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/create-super-platform-repository',
    naziv: 'Super Platform Repo',
    opis: 'Kreiranje super platforme — ekscentrični Proksi burst za inicijalizaciju',
    ikona: '🌟',
    sha: 'a14af81',
    status: 'aktivna',
    proksiSignal: 'ekscentricni-modulator',
    transferProtokol: 'ekscentricni-burst',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.003 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'copilot/add-websites-to-digital-industry-repo',
    naziv: 'Digitalna Industrija Sajtovi',
    opis: 'Dodavanje sajtova u Digitalnu Industriju — ekliptični orbit za web resurse',
    ikona: '🌐',
    sha: '3c81a2d',
    status: 'ceka-merge',
    proksiSignal: 'eklipticna-veza',
    transferProtokol: 'eklipticni-orbit',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.003 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'dependabot/npm_and_yarn/next-16.2.2',
    naziv: 'Dependabot: Next.js 16.2.2',
    opis: 'Automatsko ažuriranje Next.js — rezonantni transfer za dependency update',
    ikona: '🤖',
    sha: '5cf036d',
    status: 'ceka-merge',
    proksiSignal: 'rezonantni-pojacavac',
    transferProtokol: 'rezonantni-sync',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.004 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
  {
    id: 'dependabot/npm_and_yarn/eslint-config-next-16.2.2',
    naziv: 'Dependabot: ESLint Config',
    opis: 'Automatsko ažuriranje ESLint — koncentrični stream za lint konfiguraciju',
    ikona: '🤖',
    sha: 'bed9074',
    status: 'ceka-merge',
    proksiSignal: 'koncentricni-distributer',
    transferProtokol: 'koncentricni-stream',
    kapacitetTransfera: '10²²⁸ TB/s',
    latencija: '0.004 ms',
    poslednjiDeploy: new Date().toISOString(),
  },
];

// ─── Proksi-GitHub Veze — Ekscentrični signal ka GitHub baznom dejstvu ─

export const proksiGitHubVeze: ProksiGitHubVeza[] = [
  {
    id: 'ekscentricni-main-deploy',
    naziv: 'Ekscentrični Main Deploy',
    opis: 'Ekscentrični Proksi signal ekscentriše bazno dejstvo GitHub repo sistema za produkcijski deploy na main granu',
    ikona: '🌀',
    izvornaGrana: 'copilot/maximize-deploy-on-all-branches',
    ciljnaGrana: 'main',
    signalTip: 'ekscentricni',
    frekvencija: '12.4 THz Dinamička',
    propusnost: '10²²⁸ TB/s',
    status: 'aktivna',
  },
  {
    id: 'koncentricni-branch-sync',
    naziv: 'Koncentrični Branch Sync',
    opis: 'Koncentrični signal distribuira deploy u koncentričnim krugovima ka svim copilot/* granama',
    ikona: '🎯',
    izvornaGrana: 'main',
    ciljnaGrana: 'copilot/*',
    signalTip: 'koncentricni',
    frekvencija: '16.8 THz Cirkularna',
    propusnost: '10²²⁸ TB/s',
    status: 'aktivna',
  },
  {
    id: 'eklipticni-orbit-transfer',
    naziv: 'Ekliptični Orbit Transfer',
    opis: 'Ekliptična vez koja orbitira sve grane i prenosi podatke maksimalnom propusnošću',
    ikona: '🔄',
    izvornaGrana: '*',
    ciljnaGrana: '*',
    signalTip: 'eklipticni',
    frekvencija: '21.6 THz Harmonična',
    propusnost: '10²²⁸ TB/s',
    status: 'aktivna',
  },
  {
    id: 'rezonantni-dependabot-sync',
    naziv: 'Rezonantni Dependabot Sync',
    opis: 'Rezonantni pojačavač za automatsko ažuriranje dependabot grana sa Proksi sinhronizacijom',
    ikona: '⚡',
    izvornaGrana: 'dependabot/*',
    ciljnaGrana: 'main',
    signalTip: 'rezonantni',
    frekvencija: '44.1 THz Rezonantna',
    propusnost: '10²²⁸ TB/s',
    status: 'modulacija',
  },
  {
    id: 'hibridni-full-deploy',
    naziv: 'Hibridni Full Deploy',
    opis: 'Master sinhronizator — kombinuje sve Proksi signale za maksimalni transfer podataka na celokupan GitHub repo sistem',
    ikona: '🔮',
    izvornaGrana: '*',
    ciljnaGrana: 'main',
    signalTip: 'eklipticni',
    frekvencija: '88.2 THz Master',
    propusnost: '10²²⁸ TB/s',
    status: 'aktivna',
  },
];

// ─── Transfer Protokoli — Maksimalni prenos podataka ────────────────

export const transferProtokoli: TransferPodatak[] = [
  {
    id: 'ekscentricni-burst',
    naziv: 'Ekscentrični Burst Transfer',
    opis: 'Ekscentrični burst — momentalni prenos celokupnog koda u jednom signalnom impulsu sa Proksi modulacijom',
    ikona: '🌀',
    protokol: 'ekscentricni-burst',
    brzina: '10²²⁸ TB/s',
    kapacitet: '∞ TB po burst-u',
    kompresija: 'Omega-∞ kompresija (beskonačni ratio)',
    enkripcija: 'Proksi-Ω-256 enkripcija',
    paralelniTokovi: 8,
  },
  {
    id: 'koncentricni-stream',
    naziv: 'Koncentrični Stream Transfer',
    opis: 'Koncentrični krugovi — svaki krug udvostručuje domet prenosa podataka ka svim granama simultano',
    ikona: '🎯',
    protokol: 'koncentricni-stream',
    brzina: '10²²⁸ TB/s',
    kapacitet: '∞ TB × N krugova',
    kompresija: 'Cirkularna ×2 kompresija po krugu',
    enkripcija: 'Proksi-Ω-256 enkripcija',
    paralelniTokovi: 16,
  },
  {
    id: 'eklipticni-orbit',
    naziv: 'Ekliptični Orbit Transfer',
    opis: 'Ekliptična orbitalna vez — podaci kruže između grana u stalnom orbit-u sa auto-sinhronizacijom',
    ikona: '🔄',
    protokol: 'eklipticni-orbit',
    brzina: '10²²⁸ TB/s',
    kapacitet: '∞ TB orbitalno',
    kompresija: 'Harmonična rezonantna kompresija',
    enkripcija: 'Proksi-Ω-256 enkripcija',
    paralelniTokovi: 21,
  },
  {
    id: 'rezonantni-sync',
    naziv: 'Rezonantni Sync Transfer',
    opis: 'Rezonantni pojačavač — eksponencijalno multiplicira propusnost svakim sinhronizacijskim ciklusom',
    ikona: '⚡',
    protokol: 'rezonantni-sync',
    brzina: '10²²⁸ TB/s × rezonanca',
    kapacitet: '∞ TB × eksponencijalno',
    kompresija: 'Auto-eskalaciona kompresija',
    enkripcija: 'Proksi-Ω-256 enkripcija',
    paralelniTokovi: 44,
  },
  {
    id: 'hibridni-max',
    naziv: 'Hibridni MAX Transfer',
    opis: 'Hibridni maksimalni transfer — kombinacija svih protokola za apsolutno maksimalnu propusnost od -∞ do +∞',
    ikona: '🔮',
    protokol: 'hibridni-max',
    brzina: '-∞Ω+∞ TB/s',
    kapacitet: '-∞Ω+∞ TB',
    kompresija: 'Omega Beskonačna kompresija -∞Ω+∞',
    enkripcija: 'Proksi-Ω-∞ enkripcija (beskonačni ključ)',
    paralelniTokovi: 88,
  },
];

// ─── Deploy Pipeline — Koraci ekscentričnog deploja ─────────────────

export const deployPipeline: DeployPipeline = {
  id: 'proksi-github-deploy-pipeline',
  naziv: 'Proksi GitHub Deploy Pipeline -∞Ω+∞',
  opis: 'Kompletni deploy pipeline koji ekscentriše Proksi sa AI IQ SUPER PLATFORMA na bazno dejstvo GitHub repo sistema za maksimalni prenos transfer podataka na sve grane',
  ikona: '🚀',
  status: 'aktivan',
  ukupnoTrajanjeMs: '0.021 ms',
  koraci: [
    {
      id: 'ekscentricni-inicijalizacija',
      naziv: 'Ekscentrična Inicijalizacija',
      opis: 'Proksi ekscentrični signal inicijalizuje vezu sa GitHub repo sistemom — bazno dejstvo aktivirano',
      ikona: '🌀',
      redosled: 1,
      trajanje: '0.001 ms',
      proksiSignal: 'ekscentricni-modulator',
    },
    {
      id: 'koncentricno-skeniranje',
      naziv: 'Koncentrično Skeniranje Grana',
      opis: 'Koncentrični signal skenira sve grane u koncentričnim krugovima — detektuje 16 grana',
      ikona: '🎯',
      redosled: 2,
      trajanje: '0.002 ms',
      proksiSignal: 'koncentricni-distributer',
    },
    {
      id: 'eklipticno-mapiranje',
      naziv: 'Ekliptično Mapiranje Transfernog Puta',
      opis: 'Ekliptična vez mapira optimalni transferni put za svaku granu — orbitalni prenos',
      ikona: '🔄',
      redosled: 3,
      trajanje: '0.003 ms',
      proksiSignal: 'eklipticna-veza',
    },
    {
      id: 'rezonantno-pojacavanje',
      naziv: 'Rezonantno Pojačavanje Propusnosti',
      opis: 'Rezonantni pojačavač multiplicira propusnost za maksimalni transfer podataka',
      ikona: '⚡',
      redosled: 4,
      trajanje: '0.003 ms',
      proksiSignal: 'rezonantni-pojacavac',
    },
    {
      id: 'hipsoneuricni-prenos',
      naziv: 'Hipsoneurični Prenos Podataka',
      opis: 'Primarni hipsoneurični signal prenosi podatke na sve grane simultano — 10²²⁸ TB/s',
      ikona: '📡',
      redosled: 5,
      trajanje: '0.005 ms',
      proksiSignal: 'hipsoneuricni-primarni',
    },
    {
      id: 'omega-build-verifikacija',
      naziv: 'Omega Build Verifikacija',
      opis: 'SpajaUltraOmegaCore kompajler verifikuje build na svim granama — TypeScript + ESLint + Next.js',
      ikona: '🔧',
      redosled: 6,
      trajanje: '0.003 ms',
      proksiSignal: 'hibridni-sinhronizator',
    },
    {
      id: 'vercel-deploy-aktivacija',
      naziv: 'Vercel Deploy Aktivacija',
      opis: 'Aktivacija Vercel deploja za sve grane — Git integracija sa Proksi transfer protokolom',
      ikona: '▲',
      redosled: 7,
      trajanje: '0.002 ms',
      proksiSignal: 'ekscentricni-modulator',
    },
    {
      id: 'hibridna-sinhronizacija',
      naziv: 'Hibridna Sinhronizacija Svih Grana',
      opis: 'Hibridni sinhronizator usklađuje sve grane — master clock za celokupan GitHub repo sistem',
      ikona: '🔮',
      redosled: 8,
      trajanje: '0.002 ms',
      proksiSignal: 'hibridni-sinhronizator',
    },
  ],
};

// ─── Kompletni Sistem ───────────────────────────────────────────────

export const proksiGitHubDeploySistem: ProksiGitHubDeploySistem = {
  naziv: 'Proksi GitHub Deploy -∞Ω+∞',
  verzija: '1.0.0',
  opis: 'Ekscentrični Proksi sa AI IQ SUPER PLATFORMA na bazno dejstvo repo sistema GitHub — maksimalni prenos transfer podataka na sve grane. SpajaUltraOmegaCore -∞Ω+∞ programski jezik ekscentriše Proksi signal da radi maksimalni deploj.',
  spektar: '-∞Ω+∞',
  grane: deployGrane,
  veze: proksiGitHubVeze,
  transferi: transferProtokoli,
  pipeline: deployPipeline,
  ukupniKapacitet: '-∞Ω+∞ TB/s',
  ukupnoGrana: deployGrane.length,
  aktivnihGrana: deployGrane.filter((g) => g.status !== 'neaktivna').length,
  proksiIntegracija: 'potpuna',
  baznoDeploySistem: 'GitHub',
};

// ─── Helper funkcije ────────────────────────────────────────────────

export function getGranePoStatusu(status: DeployGranaStatus): DeployGrana[] {
  return deployGrane.filter((g) => g.status === status);
}

export function getAktivneGrane(): DeployGrana[] {
  return deployGrane.filter((g) => g.status !== 'neaktivna');
}

export function getGranaPoId(id: string): DeployGrana | undefined {
  return deployGrane.find((g) => g.id === id);
}

export function getVezeZaGrantu(granaId: string): ProksiGitHubVeza[] {
  return proksiGitHubVeze.filter(
    (v) => v.izvornaGrana === granaId || v.ciljnaGrana === granaId || v.izvornaGrana === '*' || v.ciljnaGrana === '*'
  );
}

export function getTransferPoProtokolu(protokol: TransferProtokol): TransferPodatak | undefined {
  return transferProtokoli.find((t) => t.protokol === protokol);
}

export function getBrojDeployGrana(): number {
  return deployGrane.length;
}

export function getBrojAktivnihVeza(): number {
  return proksiGitHubVeze.filter((v) => v.status === 'aktivna').length;
}

export function getUkupnoParalelnihTokova(): number {
  return transferProtokoli.reduce((acc, t) => acc + t.paralelniTokovi, 0);
}

export function getProksiSignaliZaDeploy(): ProksiSignal[] {
  const deploySignalIds = new Set(deployGrane.map((g) => g.proksiSignal));
  return proksiSignali.filter((s) => deploySignalIds.has(s.id));
}

export function getDeployStatistike() {
  const aktivne = deployGrane.filter((g) => g.status === 'aktivna').length;
  const uToku = deployGrane.filter((g) => g.status === 'deploy-u-toku').length;
  const zavrsene = deployGrane.filter((g) => g.status === 'deploy-zavrsen').length;
  const cekajuMerge = deployGrane.filter((g) => g.status === 'ceka-merge').length;

  return {
    ukupnoGrana: deployGrane.length,
    aktivne,
    deployUToku: uToku,
    deployZavrsene: zavrsene,
    cekajuMerge,
    aktivneVeze: getBrojAktivnihVeza(),
    paralelniTokovi: getUkupnoParalelnihTokova(),
    proksiSignala: getProksiSignaliZaDeploy().length,
    proksiCvorova: proksiCvorovi.length,
    povezanihPlatformi: platforme.length,
    pipeline: deployPipeline.koraci.length,
    kapacitet: proksiGitHubDeploySistem.ukupniKapacitet,
  };
}
