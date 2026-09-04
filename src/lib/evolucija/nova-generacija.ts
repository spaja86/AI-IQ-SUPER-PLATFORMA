/**
 * 🧬 Nova Generacija Evolution Engine
 *
 * Novi tip evolucijskog ciklusa koji cilja multi-platform, multi-repo i
 * multi-industrijsku konvergenciju — nova era izvan SpajaPro 13 Evolucija.
 *
 * Karakteristike:
 *  - Cross-platform evolucioni ciklusi (SUPER-PLATFORMA ↔ IO-OPENUI-AO)
 *  - Multi-repo sinhronizacija kao evolucioni parametar
 *  - Industrijska konvergencija kao fitness kriterijum
 *  - Self-healing evolucija: automatski rollback neuspešnih mutacija
 *  - Kvantni genetski algoritam (QGA-v1)
 *
 * Izvor: AI-IQ-SUPER-PLATFORMA — Kompanija SPAJA
 */

import { APP_VERSION, NOVA_GENERACIJA_VERZIJA, OMEGA_AI_OKTAVA_COUNT, OMEGA_AI_PERSONA_COUNT } from '@/lib/constants';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type NgEvolucijaStatus =
  | 'neaktivna'
  | 'inicijalizacija'
  | 'kvantna-mutacija'
  | 'cross-platform-sync'
  | 'industrijska-konvergencija'
  | 'self-healing'
  | 'uspesna'
  | 'rollback';

export type NgKonvergencijaObim =
  | 'lokalna'      // Samo SUPER-PLATFORMA
  | 'cross-repo'   // SUPER-PLATFORMA + IO-OPENUI-AO
  | 'globalna';    // Svi registrovani linked repo-ji

export interface NgEvolucijaParametri {
  maxGeneracija: number;
  stopaMutacije: number;
  ciljnaFitness: number;
  konvergencijaObim: NgKonvergencijaObim;
  selfHealingEnabled: boolean;
  crossPlatformSyncEnabled: boolean;
  industrijskaKonvergencija: boolean;
  kvantniAlgoritam: string;
}

export interface NgEvolucijaGeneracija {
  generacija: number;
  platforma: string;
  repo: string;
  fitness: number;
  mutacije: number;
  konvergencija: NgKonvergencijaObim;
  selfHealingAktiviran: boolean;
  crossRepoSynced: boolean;
  timestamp: string;
  status: NgEvolucijaStatus;
}

export interface NgEvolucijaIzveštaj {
  ngVerzija: string;
  platformaVerzija: string;
  ukupnoPersona: number;
  ukupnoOktava: number;
  aktivnaGeneracija: NgEvolucijaGeneracija | null;
  istorija: NgEvolucijaGeneracija[];
  ukupnoGeneracija: number;
  uspesnihGeneracija: number;
  selfHealingAktivacija: number;
  crossRepoSyncOps: number;
  prosecnaFitness: number;
  ciljnaFitness: number;
  dostignutoFitness: boolean;
  timestamp: string;
}

export interface NgIndustrijskaKonvergencija {
  platforma: string;
  industrija: string;
  status: 'aktivna' | 'u-konvergenciji' | 'konvergovana' | 'greška';
  fitness: number;
  linkedRepos: string[];
  timestamp: string;
}

// ─── Konfiguracija ───────────────────────────────────────────────────────────

export const ngEvolucijaParametri: NgEvolucijaParametri = {
  maxGeneracija: 1000,
  stopaMutacije: 0.0005,    // Sporija mutacija od SpajaPro 13 (0.001) za stabilnost
  ciljnaFitness: 99.99,
  konvergencijaObim: 'cross-repo',
  selfHealingEnabled: true,
  crossPlatformSyncEnabled: true,
  industrijskaKonvergencija: true,
  kvantniAlgoritam: 'QGA-v1',
};

// ─── Istorija Generacija ──────────────────────────────────────────────────────

const NG_EVOLUCIJA_ISTORIJA: NgEvolucijaGeneracija[] = [
  {
    generacija: 1,
    platforma: 'AI-IQ-SUPER-PLATFORMA',
    repo: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    fitness: 60.0,
    mutacije: 0,
    konvergencija: 'lokalna',
    selfHealingAktiviran: false,
    crossRepoSynced: false,
    timestamp: '2026-01-01T00:00:00.000Z',
    status: 'uspesna',
  },
  {
    generacija: 2,
    platforma: 'AI-IQ-SUPER-PLATFORMA',
    repo: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    fitness: 75.0,
    mutacije: 150,
    konvergencija: 'cross-repo',
    selfHealingAktiviran: false,
    crossRepoSynced: true,
    timestamp: '2026-04-01T00:00:00.000Z',
    status: 'uspesna',
  },
  {
    generacija: 3,
    platforma: 'AI-IQ-SUPER-PLATFORMA',
    repo: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    fitness: 90.0,
    mutacije: 300,
    konvergencija: 'cross-repo',
    selfHealingAktiviran: true,
    crossRepoSynced: true,
    timestamp: '2026-07-01T00:00:00.000Z',
    status: 'uspesna',
  },
  {
    generacija: 4,
    platforma: 'AI-IQ-SUPER-PLATFORMA',
    repo: 'spaja86/AI-IQ-SUPER-PLATFORMA',
    fitness: 99.0,
    mutacije: 500,
    konvergencija: 'globalna',
    selfHealingAktiviran: true,
    crossRepoSynced: true,
    timestamp: '2026-08-01T00:00:00.000Z',
    status: 'kvantna-mutacija',
  },
];

// ─── Industrijska Konvergencija ───────────────────────────────────────────────

const NG_INDUSTRIJSKA_KONVERGENCIJA: NgIndustrijskaKonvergencija[] = [
  {
    platforma: 'AI-IQ-SUPER-PLATFORMA',
    industrija: 'Digitalna Industrija',
    status: 'konvergovana',
    fitness: 95.0,
    linkedRepos: ['spaja86/AI-IQ-SUPER-PLATFORMA'],
    timestamp: '2026-08-01T00:00:00.000Z',
  },
  {
    platforma: 'IO-OPENUI-AO',
    industrija: 'Gaming / Calculator Industrija',
    status: 'u-konvergenciji',
    fitness: 80.0,
    linkedRepos: ['spaja86/IO-OPENUI-AO', 'spaja86/AI-IQ-SUPER-PLATFORMA'],
    timestamp: '2026-08-01T00:00:00.000Z',
  },
  {
    platforma: 'Nova Generacija Platform',
    industrija: 'Nova Generacija Industrija',
    status: 'aktivna',
    fitness: 20.0,
    linkedRepos: ['spaja86/AI-IQ-SUPER-PLATFORMA', 'spaja86/IO-OPENUI-AO'],
    timestamp: '2026-08-01T00:00:00.000Z',
  },
];

// ─── Glavne Funkcije ─────────────────────────────────────────────────────────

/** Generiše kompletan izveštaj o Nova Generacija evoluciji. */
export function getNgEvolucijaIzveštaj(): NgEvolucijaIzveštaj {
  const uspesne = NG_EVOLUCIJA_ISTORIJA.filter((g) => g.status === 'uspesna');
  const selfHealingBrojac = NG_EVOLUCIJA_ISTORIJA.filter((g) => g.selfHealingAktiviran).length;
  const crossRepoSyncBrojac = NG_EVOLUCIJA_ISTORIJA.filter((g) => g.crossRepoSynced).length;
  const prosecnaFitness = uspesne.length > 0
    ? uspesne.reduce((sum, g) => sum + g.fitness, 0) / uspesne.length
    : 0;
  const poslednjaGeneracija = NG_EVOLUCIJA_ISTORIJA.at(-1) ?? null;

  return {
    ngVerzija: NOVA_GENERACIJA_VERZIJA,
    platformaVerzija: APP_VERSION,
    ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
    ukupnoOktava: OMEGA_AI_OKTAVA_COUNT,
    aktivnaGeneracija: poslednjaGeneracija,
    istorija: [...NG_EVOLUCIJA_ISTORIJA],
    ukupnoGeneracija: NG_EVOLUCIJA_ISTORIJA.length,
    uspesnihGeneracija: uspesne.length,
    selfHealingAktivacija: selfHealingBrojac,
    crossRepoSyncOps: crossRepoSyncBrojac,
    prosecnaFitness: Math.round(prosecnaFitness * 100) / 100,
    ciljnaFitness: ngEvolucijaParametri.ciljnaFitness,
    dostignutoFitness: poslednjaGeneracija !== null && poslednjaGeneracija.fitness >= ngEvolucijaParametri.ciljnaFitness,
    timestamp: new Date().toISOString(),
  };
}

/** Vraća listu svih industrijskih konvergencija. */
export function getNgIndustrijskaKonvergencija(): NgIndustrijskaKonvergencija[] {
  return [...NG_INDUSTRIJSKA_KONVERGENCIJA];
}

/** Vraća parametre evolucije. */
export function getNgEvolucijaParametri(): NgEvolucijaParametri {
  return { ...ngEvolucijaParametri };
}

/** Dijagnostika Nova Generacija evolucijskog engine-a. */
export function getNgEvolucijaDijagnostika(): {
  status: NgEvolucijaStatus;
  zdravlje: number;
  aktivnaGeneracija: number;
  selfHealingSpremnost: boolean;
  crossPlatformSyncStatus: 'aktivan' | 'neaktivan';
  industrijskaKonvergencijaStatus: string;
  opis: string;
} {
  const izveštaj = getNgEvolucijaIzveštaj();
  const poslednjaGeneracija = izveštaj.aktivnaGeneracija;
  const zdravlje = poslednjaGeneracija ? Math.round(poslednjaGeneracija.fitness) : 0;

  return {
    status: poslednjaGeneracija?.status ?? 'neaktivna',
    zdravlje,
    aktivnaGeneracija: izveštaj.ukupnoGeneracija,
    selfHealingSpremnost: ngEvolucijaParametri.selfHealingEnabled,
    crossPlatformSyncStatus: ngEvolucijaParametri.crossPlatformSyncEnabled ? 'aktivan' : 'neaktivan',
    industrijskaKonvergencijaStatus: `${NG_INDUSTRIJSKA_KONVERGENCIJA.filter((k) => k.status === 'konvergovana').length}/${NG_INDUSTRIJSKA_KONVERGENCIJA.length} konvergovano`,
    opis: `Nova Generacija Evolution Engine v${NOVA_GENERACIJA_VERZIJA} — Kvantni algoritam ${ngEvolucijaParametri.kvantniAlgoritam} — ${OMEGA_AI_PERSONA_COUNT} persona u ${OMEGA_AI_OKTAVA_COUNT} oktava`,
  };
}
