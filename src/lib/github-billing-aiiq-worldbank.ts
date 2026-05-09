/**
 * 🏦💳 GITHUB BILLING — AI IQ WORLD BANK INTEGRACIJA
 *
 * Centralizacija svih GitHub plaćanja preko AI IQ World Bank.
 * GLAVNI ENDŽIN i OMEGA AI upravljaju svim kupovinama za projekte.
 *
 * Arhitektura:
 * 1. Billing Ownership — sva GitHub plaćanja idu preko AI IQ World Bank
 * 2. Role i odobrenja — GLAVNI ENDŽIN odobrava, OMEGA AI izvršava
 * 3. Kontrola i transparentnost — budžet limiti, audit trag, mesečni izveštaji
 * 4. Pilot faza — 1-2 GitHub troška, pa rollout na sve projekte
 * 5. Pravna usklađenost — ugovori i licence pod AI IQ World Bank
 */

import { APP_VERSION } from '@/lib/constants';
import { getKontaktKanal, primarniOperativniNalog } from '@/lib/kompanija-spaja-operativa';

// ─── Tipovi ─────────────────────────────────────────────────────────────────

export type GitHubBillingStatus =
  | 'aktivan'
  | 'u_obradi'
  | 'ceka_odobrenje'
  | 'odbijen'
  | 'pilot_faza';

export type GitHubTroskovnaKategorija =
  | 'github_actions'
  | 'github_packages'
  | 'github_codespaces'
  | 'github_copilot'
  | 'github_advanced_security'
  | 'github_enterprise'
  | 'repozitorijumi_privatni'
  | 'ostalo';

export type GitHubOdobravanjeUloga = 'glavni_endzin' | 'omega_ai_operativa' | 'uskladjenost';

export interface GitHubBillingRacun {
  id: string;
  naziv: string;
  banka: string;
  brojRacuna: string;
  valuta: string;
  vlasnik: string;
  status: 'aktivan' | 'neaktivan';
  opis: string;
}

export interface GitHubBillingUloga {
  uloga: GitHubOdobravanjeUloga;
  naziv: string;
  opis: string;
  odgovornosti: string[];
  kontakt: string;
}

export interface GitHubBillingTransakcija {
  id: string;
  datum: string;
  kategorija: GitHubTroskovnaKategorija;
  opis: string;
  iznos: number;
  valuta: string;
  status: GitHubBillingStatus;
  odobrio: GitHubOdobravanjeUloga;
  izvrsio: GitHubOdobravanjeUloga;
  projekat: string;
  fakturaBroj: string;
}

export interface GitHubBillingBudzet {
  mesecniLimitUSD: number;
  godisnjLimitUSD: number;
  iskoriscenMesecno: number;
  iskoriscenGodisnje: number;
  preostaloMesecno: number;
  upozorenjeNa: number;
  kriticnoNa: number;
}

export interface GitHubBillingIzvestaj {
  period: string;
  ukupnoTransakcija: number;
  ukupnoIznosUSD: number;
  poKategoriji: Record<GitHubTroskovnaKategorija, number>;
  budzet: GitHubBillingBudzet;
  status: 'uskladjeno' | 'prekoracenje' | 'upozorenje';
}

// ─── Konfigurisani billing račun AI IQ World Bank za GitHub ──────────────────

export const gitHubBillingRacun: GitHubBillingRacun = {
  id: 'aiiq-github-billing-001',
  naziv: 'AI IQ World Bank — GitHub Billing Račun',
  banka: 'AI IQ World Bank',
  brojRacuna: 'AIIQ-GITHUB-DIGI-IND-002-EUR',
  valuta: 'USD',
  vlasnik: 'Digitalna Industrija',
  status: 'aktivan',
  opis: 'Centralizovani račun za sva GitHub plaćanja Digitalne Industrije — operativni troškovi hosting/develop',
};

// ─── Role i odobrenja ─────────────────────────────────────────────────────────

export const gitHubBillingUloge: GitHubBillingUloga[] = [
  {
    uloga: 'glavni_endzin',
    naziv: 'GLAVNI ENDŽIN',
    opis: 'Odobrava sve GitHub troškove i budžetske limite za projekte Digitalne Industrije',
    odgovornosti: [
      'Odobravanje mesečnih GitHub faktura',
      'Postavljanje budžetskih limita po projektu',
      'Finalna saglasnost za nove GitHub servise',
      'Praćenje ROI za svaki GitHub trošak',
      'Odobravanje novih GitHub Enterprise licence',
    ],
    kontakt: getKontaktKanal('sales')?.email ?? primarniOperativniNalog.email,
  },
  {
    uloga: 'omega_ai_operativa',
    naziv: 'OMEGA AI Operativa',
    opis: 'Izvršava kupovine i upravljanje GitHub servisima u ime Digitalne Industrije',
    odgovornosti: [
      'Izvršavanje odobrenih GitHub kupovina',
      'Praćenje GitHub Actions potrošnje',
      'Optimizacija GitHub Packages storage',
      'Upravljanje GitHub Copilot seatovima',
      'Generisanje mesečnih troškovnih izveštaja',
    ],
    kontakt: getKontaktKanal('tech')?.email ?? 'tech@spaja.rs',
  },
  {
    uloga: 'uskladjenost',
    naziv: 'Usklađenost i Audit',
    opis: 'Kontroliše usklađenost plaćanja sa internim pravilima i pravnom regulativom',
    odgovornosti: [
      'Audit trag svih GitHub transakcija',
      'Provjera usklađenosti sa poreskim propisima',
      'Upravljanje ugovorima i licencama',
      'Mesečni audit izveštaj',
      'Praćenje GDPR usklađenosti za GitHub podatke',
    ],
    kontakt: getKontaktKanal('security')?.email ?? 'security@kompanija-spaja.rs',
  },
];

// ─── Budžet konfiguracija ─────────────────────────────────────────────────────

export const gitHubBillingBudzet: GitHubBillingBudzet = {
  mesecniLimitUSD: 500,
  godisnjLimitUSD: 5_000,
  iskoriscenMesecno: 0,
  iskoriscenGodisnje: 0,
  preostaloMesecno: 500,
  upozorenjeNa: 400,
  kriticnoNa: 475,
};

// ─── Pilot transakcije ────────────────────────────────────────────────────────

export const gitHubPilotTransakcije: GitHubBillingTransakcija[] = [
  {
    id: 'GITHUB-TRX-001',
    datum: new Date().toISOString(),
    kategorija: 'github_actions',
    opis: 'GitHub Actions — CI/CD minuti za AI IQ SUPER PLATFORMA repozitorijum (pilot)',
    iznos: 10,
    valuta: 'USD',
    status: 'pilot_faza',
    odobrio: 'glavni_endzin',
    izvrsio: 'omega_ai_operativa',
    projekat: 'AI IQ SUPER PLATFORMA',
    fakturaBroj: 'GH-PILOT-2026-001',
  },
  {
    id: 'GITHUB-TRX-002',
    datum: new Date().toISOString(),
    kategorija: 'github_packages',
    opis: 'GitHub Packages — Docker image storage za Digitalna Industrija ekosistem (pilot)',
    iznos: 8,
    valuta: 'USD',
    status: 'pilot_faza',
    odobrio: 'glavni_endzin',
    izvrsio: 'omega_ai_operativa',
    projekat: 'Digitalna Industrija Ekosistem',
    fakturaBroj: 'GH-PILOT-2026-002',
  },
];

// ─── GitHub organizacioni billing model ───────────────────────────────────────

export interface GitHubOrgBillingModel {
  organizacija: string;
  billingOwner: string;
  operativniKorisnik: string;
  platforma: string;
  model: 'kreditna_kartica' | 'fakturisanje' | 'prepaid';
  kartica: {
    tip: string;
    vlasnik: string;
    banka: string;
    opis: string;
  };
}

export const gitHubOrgBillingModel: GitHubOrgBillingModel = {
  organizacija: 'spaja86 (GitHub nalog)',
  billingOwner: 'AI IQ World Bank — Digitalna Industrija',
  operativniKorisnik: 'spajicn@yahoo.com',
  platforma: 'GitHub',
  model: 'kreditna_kartica',
  kartica: {
    tip: 'poslovna kreditna kartica',
    vlasnik: 'AI IQ World Bank',
    banka: 'AI IQ World Bank (ERSTE Banka DOO Smederevo)',
    opis: 'Kartica izdata na AI IQ World Bank / Digitalna Industrija — za sve GitHub operativne troškove',
  },
};

// ─── Audit trag ──────────────────────────────────────────────────────────────

export interface GitHubBillingAuditZapis {
  id: string;
  timestamp: string;
  akcija: string;
  izvrsio: string;
  detalji: string;
  status: 'uspesno' | 'neuspesno' | 'u_toku';
}

export function kreirajAuditZapis(
  akcija: string,
  izvrsio: string,
  detalji: string,
  status: GitHubBillingAuditZapis['status'] = 'uspesno'
): GitHubBillingAuditZapis {
  return {
    id: `AUDIT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    akcija,
    izvrsio,
    detalji,
    status,
  };
}

// ─── Inicijalni audit log (setup aktivnosti) ─────────────────────────────────

export const gitHubBillingAuditLog: GitHubBillingAuditZapis[] = [
  kreirajAuditZapis(
    'billing_ownership_transfer',
    'GLAVNI ENDŽIN',
    'GitHub billing ownership prebačen sa ličnog naloga spajicn@yahoo.com na AI IQ World Bank / Digitalna Industrija',
    'uspesno'
  ),
  kreirajAuditZapis(
    'billing_account_setup',
    'OMEGA AI Operativa',
    'Konfigurisan AIIQ-GITHUB-DIGI-IND-002-EUR račun kao primarni GitHub billing račun',
    'uspesno'
  ),
  kreirajAuditZapis(
    'pilot_transactions_initiated',
    'OMEGA AI Operativa',
    'Pokrenute 2 pilot transakcije: GitHub Actions (10 USD) i GitHub Packages (8 USD)',
    'uspesno'
  ),
  kreirajAuditZapis(
    'budget_limits_configured',
    'GLAVNI ENDŽIN',
    `Budžetski limiti postavljeni: mesečno ${gitHubBillingBudzet.mesecniLimitUSD} USD, godišnje ${gitHubBillingBudzet.godisnjLimitUSD} USD`,
    'uspesno'
  ),
];

// ─── Rollout plan ─────────────────────────────────────────────────────────────

export interface GitHubBillingRolloutFaza {
  faza: number;
  naziv: string;
  opis: string;
  trajanje: string;
  stavke: string[];
  status: 'zavrsena' | 'u_toku' | 'planirana';
}

export const gitHubBillingRolloutFaze: GitHubBillingRolloutFaza[] = [
  {
    faza: 1,
    naziv: 'Pilot Faza',
    opis: 'Testiranje billing modela sa 1-2 GitHub troška kroz AI IQ World Bank',
    trajanje: '1 mesec',
    stavke: [
      'GitHub Actions CI/CD minuti — pilot transakcija 10 USD',
      'GitHub Packages storage — pilot transakcija 8 USD',
      'Verifikacija knjiženja i toka odobrenja',
      'Audit trag validacija',
    ],
    status: 'u_toku',
  },
  {
    faza: 2,
    naziv: 'Delimični Rollout',
    opis: 'Proširenje na sve aktivne GitHub servise',
    trajanje: '2 meseca',
    stavke: [
      'GitHub Copilot licence za sve Digitalna Industrija timove',
      'GitHub Enterprise licence',
      'GitHub Advanced Security',
      'Sve privatne repozitorijum naknade',
    ],
    status: 'planirana',
  },
  {
    faza: 3,
    naziv: 'Potpuni Rollout',
    opis: 'Centralizacija svih GitHub troškova kroz AI IQ World Bank — legalno i računovodstveno usklađeno',
    trajanje: '1 mesec',
    stavke: [
      'Sve GitHub fakture konsolidovane na AI IQ World Bank',
      'Automatski mesečni izveštaji i budget alerting',
      'Pravna dokumentacija i licencni ugovori finalizovani',
      'Godišnji audit plan aktiviran',
    ],
    status: 'planirana',
  },
];

// ─── Statistike sistema ───────────────────────────────────────────────────────

export function getGitHubBillingStatistike() {
  const ukupnoPilot = gitHubPilotTransakcije.reduce((sum, t) => sum + t.iznos, 0);
  return {
    verzija: APP_VERSION,
    ukupnoTransakcija: gitHubPilotTransakcije.length,
    ukupnoIznosUSD: ukupnoPilot,
    aktivneFaze: gitHubBillingRolloutFaze.filter((f) => f.status === 'u_toku').length,
    ukupnoFaza: gitHubBillingRolloutFaze.length,
    auditZapisa: gitHubBillingAuditLog.length,
    budzet: {
      mesecniLimitUSD: gitHubBillingBudzet.mesecniLimitUSD,
      iskoriscenProcent: Math.round((ukupnoPilot / gitHubBillingBudzet.mesecniLimitUSD) * 100),
    },
  };
}
