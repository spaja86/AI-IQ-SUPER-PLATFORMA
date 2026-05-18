/**
 * 🏦 AI IQ WORLD BANK — Centralni modul
 *
 * Kanonski izvor istine za sve podatke o AI IQ World Bank:
 * profil, usluge, AI tehnologija, ERSTE računi, partneri,
 * transferi/dugovi, kontakt, srpske banke, GitHub billing i governance.
 *
 * Sve ostale komponente (sekvence, API rute, widget-i) treba da čitaju
 * podatke isključivo odavde, a ne hardkoduju ih direktno.
 */

import { APP_VERSION } from './constants';
import { getKontaktKanal, primarniOperativniNalog } from './kompanija-spaja-operativa';
import {
  gitHubBillingRacun,
  gitHubBillingBudzet,
  gitHubPilotTransakcije,
  gitHubBillingRolloutFaze,
  gitHubBillingUloge,
  gitHubBillingAuditLog,
  gitHubOrgBillingModel,
  getGitHubBillingStatistike,
} from './github-billing-aiiq-worldbank';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const AIIQ_WORLD_BANK_URL =
  'https://ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app/index.html';
export const AIIQ_WORLD_BANK_REPO = 'spaja86/Ai-Iq-World-Bank';
export const AIIQ_WORLD_BANK_KAMATNA_STOPA = 40;
export const AIIQ_WORLD_BANK_MIN_ULOG = 1_000;

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export interface WorldBankProfilBanke {
  naziv: string;
  ikona: string;
  url: string;
  repo: string;
  vlasnik: string;
  kompanija: string;
  lokacija: string;
  misija: string;
  vizija: string;
  vrednosti: string[];
  inovacija: string;
  status: 'aktivan';
}

export interface WorldBankKamatnaStopaPrompt {
  stopa: number;
  periodOpis: string;
  uslov: string;
  primeri: Array<{ ulog: string; zarada: string; ukupno: string }>;
}

export interface WorldBankServis {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  oznake: string[];
}

export interface WorldBankErsteRacun {
  tip: string;
  valuta: string;
  brojRacuna: string;
  opis: string;
  ikona: string;
}

export interface WorldBankErsteInfo {
  banka: string;
  vlasnikRacuna: string;
  vlasnik: {
    ime: string;
    registarskiBrojLicneKarte: string;
    jmbg: string;
  };
  racuni: WorldBankErsteRacun[];
  kartice: string;
  status: string;
}

export interface WorldBankOmegaAiFunkcija {
  id: string;
  naziv: string;
  opis: string;
  kategorija: string;
}

export interface WorldBankPartner {
  id: string;
  naziv: string;
  tip: string;
  opis: string;
  ikona: string;
  lokacija?: string;
  url?: string;
  status: string;
}

export interface WorldBankTransfer {
  id: string;
  izvorRacun: string;
  destinacijaRacun: string;
  iznos: number;
  valuta: string;
  opis: string;
  status: string;
  tip: string;
}

export interface WorldBankDug {
  partner: string;
  tip: string;
  iznos: number;
  valuta: string;
  opis: string;
  status: string;
  napomena: string;
}

export interface WorldBankKontaktKanal {
  tip: string;
  adresa: string;
  namena: string;
}

export interface WorldBankDrustvenaMreza {
  naziv: string;
  url: string;
  korisnickoIme: string;
  ikona: string;
}

export interface WorldBankSrpskaBanka {
  id: string;
  naziv: string;
  lokacija: string;
  valute: string[];
  statusZahteva: string;
}

export interface WorldBankGitHubBilling {
  racun: typeof gitHubBillingRacun;
  budzet: typeof gitHubBillingBudzet;
  pilotTransakcije: typeof gitHubPilotTransakcije;
  rolloutFaze: typeof gitHubBillingRolloutFaze;
  uloge: typeof gitHubBillingUloge;
  auditLog: typeof gitHubBillingAuditLog;
  orgModel: typeof gitHubOrgBillingModel;
  statistike: ReturnType<typeof getGitHubBillingStatistike>;
}

export interface WorldBankKPI {
  kamatnaStopaPrompt: number;
  aktivnihRacuna: number;
  transferaKnaDan: number;
  kredita: number;
  investicija: number;
  aiTacnost: number;
  partneraUkupno: number;
  srpskihBanaka: number;
  githubBillingTransakcija: number;
}

export interface AiIqWorldBankRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  profil: WorldBankProfilBanke;
  kamatnaStopaPrompt: WorldBankKamatnaStopaPrompt;
  usluge: WorldBankServis[];
  bezbednost: string[];
  ersteInfo: WorldBankErsteInfo;
  omegaAiTehnologija: {
    opis: string;
    funkcije: WorldBankOmegaAiFunkcija[];
  };
  smederevoEkspanzija: {
    lokacija: string;
    opis: string;
    aktivnosti: string[];
  };
  partneri: WorldBankPartner[];
  transferi: WorldBankTransfer[];
  dugovi: {
    ukupnoUSD: number;
    stavke: WorldBankDug[];
    napomena: string;
  };
  kontakt: WorldBankKontaktKanal[];
  drustvneMreze: WorldBankDrustvenaMreza[];
  srpskeBanke: {
    zahtev: string;
    banke: WorldBankSrpskaBanka[];
    mesniPorez: { opis: string; teritorija: string; status: string };
  };
  githubBilling: WorldBankGitHubBilling;
  kpi: WorldBankKPI;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAiIqWorldBank(userId: string): AiIqWorldBankRezultat {
  const supportKontakt = getKontaktKanal('support');
  const billingKontakt = getKontaktKanal('billing');
  const salesKontakt = getKontaktKanal('sales');
  const billingStats = getGitHubBillingStatistike();

  const profil: WorldBankProfilBanke = {
    naziv: 'AI IQ World Bank',
    ikona: '🏦',
    url: AIIQ_WORLD_BANK_URL,
    repo: AIIQ_WORLD_BANK_REPO,
    vlasnik: 'Nikola Spajić',
    kompanija: 'Digitalna Industrija',
    lokacija: 'Smederevo, Srbija',
    misija: 'Globalna digitalna banka sa AI optimizacijom za sve korisnike',
    vizija: 'Vodeća svetska AI banka sa 40% pozitivnom kamatnom stopom',
    vrednosti: ['Transparentnost', 'Pouzdanost', 'Sigurnost', 'Pristupačnost'],
    inovacija: 'Spajanje tradicionalnog bankarstva sa naprednim AI tehnologijama',
    status: 'aktivan',
  };

  const kamatnaStopaPrompt: WorldBankKamatnaStopaPrompt = {
    stopa: AIIQ_WORLD_BANK_KAMATNA_STOPA,
    periodOpis: '40% mesečno na štedne račune',
    uslov: 'Mesec dana (30 dana) bez povlačenja sredstava',
    primeri: [
      { ulog: '1.000 RSD', zarada: '400 RSD', ukupno: '1.400 RSD' },
      { ulog: '5.000 RSD', zarada: '2.000 RSD', ukupno: '7.000 RSD' },
      { ulog: '10.000 RSD', zarada: '4.000 RSD', ukupno: '14.000 RSD' },
      { ulog: '50.000 RSD', zarada: '20.000 RSD', ukupno: '70.000 RSD' },
      { ulog: '100.000 RSD', zarada: '40.000 RSD', ukupno: '140.000 RSD' },
      { ulog: '500.000 RSD', zarada: '200.000 RSD', ukupno: '700.000 RSD' },
      { ulog: '1.000.000 RSD', zarada: '400.000 RSD', ukupno: '1.400.000 RSD' },
    ],
  };

  const usluge: WorldBankServis[] = [
    {
      id: 'stedni-racun',
      naziv: 'Štedni račun 40%',
      opis: 'Pozitivna kamatna stopa od 40% mesečno. Ulozite 1.000 RSD, za mesec dana podignite 1.400 RSD. Uslov: 30 dana bez povlačenja.',
      ikona: '💰',
      oznake: ['40% kamata', 'Mesečno', 'Sigurno'],
    },
    {
      id: 'racuni',
      naziv: 'Računi',
      opis: 'Digitalni računi sa multi-valutnom podrškom — RSD, EUR, USD, kripto',
      ikona: '👤',
      oznake: ['Fiat', 'Kripto', 'Multi-valuta'],
    },
    {
      id: 'transferi',
      naziv: 'Transferi',
      opis: 'Globalni transferi u realnom vremenu — instant, SWIFT, blockchain',
      ikona: '💸',
      oznake: ['Instant', 'SWIFT', 'Blockchain'],
    },
    {
      id: 'krediti',
      naziv: 'Krediti',
      opis: 'AI-optimizovani kreditni proizvodi sa niskim kamatama',
      ikona: '📋',
      oznake: ['AI scoring', 'Fleksibilno', 'Niske kamate'],
    },
    {
      id: 'investicije',
      naziv: 'Investicije',
      opis: 'Pametno investiranje sa AI preporukama — akcije, kripto, fondovi',
      ikona: '📈',
      oznake: ['Akcije', 'Kripto', 'Fondovi'],
    },
    {
      id: 'analitika',
      naziv: 'Analitika',
      opis: 'Sve se može proveriti i analizirati — ekstremno jaka banka',
      ikona: '🔍',
      oznake: ['AI analiza', 'Transparentnost', 'Real-time'],
    },
  ];

  const bezbednost: string[] = [
    'E2E enkripcija',
    'Biometrička autentifikacija',
    '2FA',
    'AI fraud detekcija',
    'Višeslojna zaštita transakcija',
    'Blockchain verifikacija',
  ];

  const ersteInfo: WorldBankErsteInfo = {
    banka: 'ERSTE Banka DOO Smederevo',
    vlasnikRacuna: 'Digitalna Industrija',
    vlasnik: {
      ime: 'Nikola Spajić',
      registarskiBrojLicneKarte: '015639997',
      jmbg: '0312986850017',
    },
    racuni: [
      {
        tip: 'dinarski',
        valuta: 'RSD',
        brojRacuna: '025897158',
        opis: 'Poslovni dinarski račun za domaće transakcije',
        ikona: '🇷🇸',
      },
      {
        tip: 'devizni',
        valuta: 'EUR',
        brojRacuna: '038971285',
        opis: 'Devizni račun u evrima za međunarodne transakcije',
        ikona: '🇪🇺',
      },
      {
        tip: 'devizni',
        valuta: 'USD',
        brojRacuna: '05364215985',
        opis: 'Devizni račun u dolarima za globalne transakcije',
        ikona: '🇺🇸',
      },
    ],
    kartice: 'Izdate na ERSTE Banka DOO Smederevo',
    status: 'aktivni',
  };

  const omegaAiTehnologija = {
    opis: 'Omega AI pokreće sve AI funkcije AI IQ World Bank',
    funkcije: [
      {
        id: 'ai-scoring',
        naziv: 'AI Scoring sistem',
        opis: 'Analiza kreditne sposobnosti korisnika u realnom vremenu sa 97% tačnosti',
        kategorija: 'kreditiranje',
      },
      {
        id: 'ai-fraud',
        naziv: 'AI Fraud detekcija',
        opis: 'Automatska detekcija sumnjivih transakcija pomoću Omega AI modela',
        kategorija: 'bezbednost',
      },
      {
        id: 'ai-investicije',
        naziv: 'AI Investicioni savetnik',
        opis: 'Pametne preporuke za investiranje u akcije, kripto i fondove',
        kategorija: 'investicije',
      },
      {
        id: 'ai-predikcija',
        naziv: 'AI Predikcija tržišta',
        opis: 'Predviđanje kretanja tržišta na osnovu analize velikih podataka',
        kategorija: 'analitika',
      },
      {
        id: 'ai-optimizacija',
        naziv: 'AI Optimizacija transakcija',
        opis: 'Automatska optimizacija rutiranja transakcija za najniže provizije',
        kategorija: 'transakcije',
      },
      {
        id: 'ai-podrska',
        naziv: 'AI Korisnička podrška',
        opis: '24/7 chatbot za korisničku podršku i rešavanje problema',
        kategorija: 'podrska',
      },
    ],
  };

  const smederevoEkspanzija = {
    lokacija: 'Smederevo, Srbija',
    opis: 'Sedište AI IQ World Bank i Digitalne Industrije',
    aktivnosti: [
      'Sedište kompanije i centar razvoja svih platformi',
      'ERSTE Banka DOO Smederevo — zvanični bankarski partner',
      'Globalna ekspanzija iz Smedereva ka celom svetu',
      'Tehnološki hub za razvoj platformi i AI sistema',
      'Lokalna partnerstva sa institucijama i kompanijama',
      'Kontinuirano širenje servisa i korisničke baze',
    ],
  };

  const partneri: WorldBankPartner[] = [
    {
      id: 'erste-banka',
      naziv: 'ERSTE Banka DOO Smederevo',
      tip: 'bankarski',
      opis: 'Zvanični bankarski partner — dinarski i devizni računi za Digitalnu Industriju',
      ikona: '🏦',
      lokacija: 'Smederevo',
      status: 'aktivan',
    },
    {
      id: 'kompanija-spaja',
      naziv: 'Kompanija SPAJA',
      tip: 'matična',
      opis: 'Matična kompanija koja upravlja celim digitalnim ekosistemom',
      ikona: '🏢',
      url: 'https://www.kompanija-spaja.com',
      status: 'aktivan',
    },
    {
      id: 'omega-ai',
      naziv: 'Omega AI',
      tip: 'tehnološki',
      opis: 'AI tehnološki partner — 40.000.562 AI persona za naprednu analitiku',
      ikona: '🧠',
      status: 'aktivan',
    },
    {
      id: 'ai-iq-menjacnica',
      naziv: 'AI IQ Menjačnica',
      tip: 'finansijski',
      opis: 'Partnerska menjačnica za konverziju valuta i kripto trgovinu',
      ikona: '💱',
      status: 'aktivan',
    },
    {
      id: 'vercel',
      naziv: 'Vercel',
      tip: 'hosting',
      opis: 'Hosting i deploy partner za sve digitalne platforme',
      ikona: '▲',
      url: 'https://www.vercel.com',
      status: 'aktivan',
    },
    {
      id: 'github',
      naziv: 'GitHub',
      tip: 'razvoj',
      opis: 'Poslovni partner za razvoj koda, GitHub agente i enterprise licence Digitalne Industrije',
      ikona: '🐙',
      url: 'https://www.github.com',
      status: 'aktivan',
    },
  ];

  const transferi: WorldBankTransfer[] = [
    {
      id: 'TRX-AIIQWB-001',
      izvorRacun: 'DIGI-IND-001',
      destinacijaRacun: 'DIGI-IND-002-EUR',
      iznos: 10_000,
      valuta: 'EUR',
      opis: 'Transfer 10.000 EUR sa glavnog računa na novi generisani EUR račun za operativne troškove',
      status: 'izvrseno',
      tip: 'interni-transfer',
    },
  ];

  const dugovi = {
    ukupnoUSD: 1_000,
    stavke: [
      {
        partner: 'Vercel',
        tip: 'hosting-i-deploy',
        iznos: 1_000,
        valuta: 'USD',
        opis: 'Dug za Vercel hosting i deploy servise — oko $1.000',
        status: 'aktivan',
        napomena: 'Čeka se konačna sumacija svih Vercel faktura za precizni iznos',
      },
    ],
    napomena: 'Dugovi se sumarišu — čeka se konačna potvrda iznosa. Trenutni procenjeni ukupni dug: ~$1.000 (Vercel).',
  };

  const kontakt: WorldBankKontaktKanal[] = [
    {
      tip: 'podrška',
      adresa: supportKontakt?.email ?? 'support@spaja.rs',
      namena: 'Korisnička podrška, onboarding i opšti upiti',
    },
    {
      tip: 'billing',
      adresa: billingKontakt?.email ?? 'billing@spaja.rs',
      namena: 'Fakture, potvrde, Vercel/GitHub troškovi i finansijska administracija',
    },
    {
      tip: 'biznis',
      adresa: salesKontakt?.email ?? 'sales@spaja.rs',
      namena: 'Poslovna saradnja, pregovori i enterprise zahtevi',
    },
    {
      tip: 'fallback',
      adresa: primarniOperativniNalog.email,
      namena: 'Privremeni fallback dok se kompanijski kanali ne potvrde',
    },
  ];

  const drustvneMreze: WorldBankDrustvenaMreza[] = [
    {
      naziv: 'Facebook',
      url: 'https://www.facebook.com/Spaja86',
      korisnickoIme: 'Spaja86',
      ikona: '📘',
    },
    {
      naziv: 'Facebook (Digitalna Industrija)',
      url: 'https://www.facebook.com/profile.php?id=61583240952997',
      korisnickoIme: 'Digitalna Industrija',
      ikona: '📘',
    },
    {
      naziv: 'Instagram',
      url: 'https://www.instagram.com/spaja.1986',
      korisnickoIme: '@spaja.1986',
      ikona: '📸',
    },
    {
      naziv: 'TikTok',
      url: 'https://www.tiktok.com/@spaja.1986',
      korisnickoIme: '@spaja.1986',
      ikona: '🎵',
    },
    {
      naziv: 'YouTube',
      url: 'https://www.youtube.com/@spajanikopenevolution',
      korisnickoIme: 'SpajaNikopEvolution',
      ikona: '📺',
    },
  ];

  const srpskeBanke = {
    zahtev:
      'Kompanija "Digitalna Industrija" — vlasnik Nikola Spajić, JMBG: 0312986850017 — upućuje formalni zahtev svim bankama u Republici Srbiji za registraciju poslovnih računa, uspostavljanje mesnog poreza i potpisivanje ugovora o poslovnoj saradnji.',
    banke: [
      { id: 'banca-intesa', naziv: 'Banca Intesa a.d. Beograd', lokacija: 'Beograd', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
      { id: 'unicredit', naziv: 'UniCredit Bank Srbija a.d.', lokacija: 'Beograd', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
      { id: 'raiffeisen', naziv: 'Raiffeisen Bank a.d. Beograd', lokacija: 'Beograd', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
      { id: 'komercijalna', naziv: 'Komercijalna banka a.d. Beograd', lokacija: 'Beograd', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
      { id: 'otp', naziv: 'OTP banka Srbija a.d.', lokacija: 'Novi Sad', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
      { id: 'erste', naziv: 'Erste Bank a.d. Novi Sad', lokacija: 'Novi Sad / Smederevo', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'aktivna-saradnja' },
      { id: 'nlb', naziv: 'NLB Komercijalna banka', lokacija: 'Beograd', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
      { id: 'addiko', naziv: 'Addiko Bank a.d. Beograd', lokacija: 'Beograd', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
      { id: 'srpska', naziv: 'Srpska banka a.d. Beograd', lokacija: 'Beograd', valute: ['RSD'], statusZahteva: 'zahtev-poslat' },
      { id: 'halkbank', naziv: 'Halkbank a.d. Beograd', lokacija: 'Beograd', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
      { id: 'yettel', naziv: 'Yettel Bank (ex Telenor)', lokacija: 'Beograd', valute: ['RSD', 'EUR'], statusZahteva: 'zahtev-poslat' },
      { id: 'direktna', naziv: 'Direktna banka a.d. Kragujevac', lokacija: 'Kragujevac', valute: ['RSD', 'EUR', 'USD'], statusZahteva: 'zahtev-poslat' },
    ],
    mesniPorez: {
      opis: 'Kompanija Digitalna Industrija podnosi zahtev za uspostavljanje i registraciju mesnog poreza na teritoriji Smedereva i celokupne Srbije.',
      teritorija: 'Smederevo, Republika Srbija',
      status: 'zahtev-u-toku',
    },
  };

  const githubBilling: WorldBankGitHubBilling = {
    racun: gitHubBillingRacun,
    budzet: gitHubBillingBudzet,
    pilotTransakcije: gitHubPilotTransakcije,
    rolloutFaze: gitHubBillingRolloutFaze,
    uloge: gitHubBillingUloge,
    auditLog: gitHubBillingAuditLog,
    orgModel: gitHubOrgBillingModel,
    statistike: billingStats,
  };

  const kpi: WorldBankKPI = {
    kamatnaStopaPrompt: AIIQ_WORLD_BANK_KAMATNA_STOPA,
    aktivnihRacuna: 5_000,
    transferaKnaDan: 12_000,
    kredita: 2_500,
    investicija: 800,
    aiTacnost: 97,
    partneraUkupno: partneri.length,
    srpskihBanaka: srpskeBanke.banke.length,
    githubBillingTransakcija: billingStats.ukupnoTransakcija,
  };

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    profil,
    kamatnaStopaPrompt,
    usluge,
    bezbednost,
    ersteInfo,
    omegaAiTehnologija,
    smederevoEkspanzija,
    partneri,
    transferi,
    dugovi,
    kontakt,
    drustvneMreze,
    srpskeBanke,
    githubBilling,
    kpi,
  };
}
