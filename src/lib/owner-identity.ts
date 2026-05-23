/**
 * 👑 Owner Identity — Jedinstveni izvor istine za vlasnički identitet
 *
 * Definiše kanonski model vlasničkog identiteta: email, telefon, verifikacioni
 * status, AI IQ World Bank račun i Vercel ownership status.
 *
 * Komponente:
 *  1. Owner profil (email, ime, GitHub)
 *  2. Telefonska verifikacija (broj, status, poslednja potvrda)
 *  3. AI IQ WORLD BANK vlasnički račun (kanonski: DIGI-IND-001)
 *  4. Vercel ownership/billing status
 *  5. Instalaciona poruka (za dodelu broja)
 *
 * Napomena: Ne uvozi iz kompanija-spaja-operativa.ts (izbegava kružne zavisnosti).
 * Sve owner konstante definisane su ovde ili u constants.ts.
 */

import { MOBILNI_POZIVNI, OWNER_EMAIL, OWNER_IME, OWNER_GITHUB, OWNER_VERCEL_EMAIL, OWNER_BANK_RACUN_ID, OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from './constants';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type PhoneVerifikacijaStatus = 'nije-verifikovan' | 'otp-poslan' | 'verifikovan';
export type VlasnickiRacunStatus = 'predlog' | 'aktivan' | 'zamrznut';
export type VercelOwnershipStatus = 'nepotvrdjen' | 'u-procesu' | 'potvrdjen';
export type InstalacijonaTip = 'dodela-broja' | 'aktivacija' | 'potvrda';

export interface OwnerPhoneIdentitet {
  /** Pun broj telefona vlasnika (iz env ili default centrale) */
  broj: string;
  /** Pozivni broj centrale */
  pozivniBroj: string;
  /** Status verifikacije */
  status: PhoneVerifikacijaStatus;
  /** ISO timestamp poslednje uspešne verifikacije */
  poslednja_verifikacija: string | null;
  /** Maskiran prikaz broja za API odgovore */
  maskiranBroj: string;
  /** Da li je broj instalacioni (install-ready) */
  instalacioniSpremnost: boolean;
}

export interface OwnerBankRacun {
  /** Kanonski AI IQ WORLD BANK identifikator */
  id: string;
  /** Naziv banke */
  banka: string;
  /** Broj računa (isti kao id) */
  brojRacuna: string;
  /** Tip računa */
  tip: 'dinarski' | 'devizni' | 'aiiq-interni';
  /** Valuta */
  valuta: string;
  /** Status */
  status: VlasnickiRacunStatus;
  /** Namena — za fakturisanje Vercel-a i sličnih usluga */
  namena: string[];
}

export interface VercelOwnershipChecklist {
  phoneVerified: boolean;
  ownerAccountAktivan: boolean;
  enterpriseRequestSpreman: boolean;
  enterpriseRequestPoslato: boolean;
}

export interface VercelOwnershipInfo {
  /** Vlasnički email na Vercel-u */
  accountEmail: string;
  /** Billing kontakt */
  billingKontakt: string;
  /** Status ownership prenosa */
  status: VercelOwnershipStatus;
  /** Checklist za prenos */
  checklist: VercelOwnershipChecklist;
  /** Bloker: zahteva verifikovanu telefonsku verifikaciju */
  zahtevaTelefonVerifikaciju: boolean;
  /** Blokator poruka — null ako nema blokatora */
  blokator: string | null;
}

export interface InstalacionaPoruka {
  tip: InstalacijonaTip;
  poruka: string;
  /** Maskiran telefon */
  telefon: string;
  racunBroj: string;
  instrukcije: string[];
}

export interface OwnerIdentity {
  email: string;
  ime: string;
  githubOwner: string;
  telefon: OwnerPhoneIdentitet;
  bankRacun: OwnerBankRacun;
  vercel: VercelOwnershipInfo;
  /** Da li je owner telefonski verifikovan */
  verifikovan: boolean;
  napomena: string;
}

// ─── Helper — maskiranje telefona ─────────────────────────────────────────────

/**
 * Maskira broj telefona — ostavlja prvih 4 i poslednjih 4 karaktera.
 * Primer: +38177-001-0001 → +381**-***-0001
 */
export function maskirajTelefon(broj: string): string {
  const clean = broj.replace(/\s+/g, '');
  if (clean.length <= 8) return '****';
  const prefiks = clean.slice(0, 4);
  const sufiks = clean.slice(-4);
  const sredina = '*'.repeat(Math.max(1, clean.length - 8));
  return `${prefiks}${sredina}${sufiks}`;
}

// ─── Owner telefon ────────────────────────────────────────────────────────────

/** Vlasnički telefon — iz env var ili default centrale #1 */
function getOwnerTelefonBroj(): string {
  const envBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY];
  if (envBroj && envBroj.trim()) return envBroj.trim();
  return OWNER_PHONE_DEFAULT;
}

/** Pozivni broj prve centrale — guardirano */
function getPozivniBroj(): string {
  return MOBILNI_POZIVNI[0] ?? '+38177';
}

// ─── Owner Identity model ─────────────────────────────────────────────────────

const ownerBankRacun: OwnerBankRacun = {
  id: OWNER_BANK_RACUN_ID,
  banka: 'AI IQ World Bank',
  brojRacuna: OWNER_BANK_RACUN_ID,
  tip: 'aiiq-interni',
  valuta: 'USD',
  status: 'aktivan',
  namena: [
    'Vercel billing referenca',
    'GitHub billing',
    'Operativni troškovi platforme',
    'Enterprise fakturisanje',
  ],
};

function parseBooleanEnvVar(key: string): boolean {
  return /^(1|true|yes)$/i.test(process.env[key] ?? '');
}

function getVercelOwnershipChecklist(phoneStatus: PhoneVerifikacijaStatus): VercelOwnershipChecklist {
  return {
    phoneVerified: phoneStatus === 'verifikovan',
    ownerAccountAktivan: ownerBankRacun.status === 'aktivan',
    enterpriseRequestSpreman: parseBooleanEnvVar('SPAJA_VERCEL_ENTERPRISE_REQUEST_READY'),
    enterpriseRequestPoslato: parseBooleanEnvVar('SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED'),
  };
}

/**
 * Vraća kompletni owner identity model.
 * Telefonski status dolazi iz owner-phone-auth OTP store-a (ili default).
 */
export function getOwnerIdentity(phoneStatus: PhoneVerifikacijaStatus = 'nije-verifikovan', poslednja_verifikacija: string | null = null): OwnerIdentity {
  const telefonBroj = getOwnerTelefonBroj();
  const maskiranBroj = maskirajTelefon(telefonBroj);

  const telefon: OwnerPhoneIdentitet = {
    broj: telefonBroj,
    pozivniBroj: getPozivniBroj(),
    status: phoneStatus,
    poslednja_verifikacija,
    maskiranBroj,
    instalacioniSpremnost: phoneStatus !== 'nije-verifikovan',
  };

  const checklist = getVercelOwnershipChecklist(phoneStatus);

  const vercelStatus: VercelOwnershipStatus = checklist.enterpriseRequestPoslato
    ? 'u-procesu'
    : 'nepotvrdjen';

  const blokator = !checklist.phoneVerified
    ? 'Telefonska verifikacija je obavezna pre slanja Vercel enterprise zahteva.'
    : null;

  return {
    email: OWNER_EMAIL,
    ime: OWNER_IME,
    githubOwner: OWNER_GITHUB,
    telefon,
    bankRacun: ownerBankRacun,
    vercel: {
      accountEmail: OWNER_VERCEL_EMAIL,
      billingKontakt: 'billing@spaja.rs',
      status: vercelStatus,
      checklist,
      zahtevaTelefonVerifikaciju: true,
      blokator,
    },
    verifikovan: phoneStatus === 'verifikovan',
    napomena: `Primarni operativni nalog ostaje ${OWNER_EMAIL} dok se telefonska verifikacija ne završi i Vercel ownership prenos ne potvrdi.`,
  };
}

/**
 * Proverava da li je email vlasnički.
 * Koristi se u login ruti umesto hardkodovane provere.
 */
export function isOwnerEmail(email: string): boolean {
  return email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase();
}

/**
 * Vraća instalacionu poruku za dati tip.
 */
export function getOwnerInstalacionaPoruka(
  tip: InstalacijonaTip = 'dodela-broja',
  phoneStatus: PhoneVerifikacijaStatus = 'nije-verifikovan',
): InstalacionaPoruka {
  const identity = getOwnerIdentity(phoneStatus);

  const instrukcije: Record<InstalacijonaTip, string[]> = {
    'dodela-broja': [
      `Broj ${identity.telefon.maskiranBroj} je dodeljen sa centrale ${identity.telefon.pozivniBroj}`,
      'Instalirati SIM karticu u telefon',
      `Vlasnički račun AI IQ WORLD BANK: ${identity.bankRacun.brojRacuna}`,
      'Pokrenuti OTP verifikaciju: POST /api/owner-phone-auth/request-otp',
      'Potvrditi OTP kod: POST /api/owner-phone-auth/verify-otp',
      'Nakon verifikacije — Vercel ownership prenos može početi',
    ],
    'aktivacija': [
      'OTP je poslat na vlasnički broj',
      'Uneti dobijeni OTP kod na /api/owner-phone-auth/verify-otp',
      'Nakon verifikacije, owner privilegija se aktivira automatski',
    ],
    'potvrda': [
      'Telefonska verifikacija je uspešna',
      `Vlasnički račun ${identity.bankRacun.brojRacuna} je aktivan`,
      `Vercel account: ${identity.vercel.accountEmail}`,
      'Vercel ownership proces može da počne — pošaljite enterprise zahtev',
    ],
  };

  return {
    tip,
    poruka:
      tip === 'dodela-broja'
        ? `Instalaciona poruka: Broj telefona spreman za instalaciju. Vlasnički račun: ${identity.bankRacun.brojRacuna}`
        : tip === 'aktivacija'
          ? 'OTP verifikacija u toku — proverite telefon'
          : 'Verifikacija uspešna — vlasnički status aktivan',
    telefon: identity.telefon.maskiranBroj,
    racunBroj: identity.bankRacun.brojRacuna,
    instrukcije: instrukcije[tip],
  };
}
