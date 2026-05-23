/**
 * 📱 Owner Phone Auth — OTP verifikacioni tok za vlasnika
 *
 * In-memory OTP store sa mock SMS provajderom za inicijalnu fazu.
 * Priprema za zamenu sa Twilio / SMS provajderom kada bude konfigurisan.
 *
 * Bezbednost:
 *  - Max 3 OTP zahteva po broju u 10 minuta (anti-flood)
 *  - OTP istice za 5 minuta
 *  - Max 3 pokušaja verifikacije po OTP-u
 *  - Telefon se maskira u svim odgovorima — nikad punim brojem ka klijentu
 *  - devOtp polje postoji SAMO u non-production okruženjima
 *
 * Napomena o okruženjima:
 *  - development/test: OTP je vidljiv u devOtp polju odgovora i konzolnom logu
 *  - production: OTP se nikada ne šalje u odgovoru; isključivo putem SMS-a
 */

import { randomInt } from 'node:crypto';
import { OWNER_EMAIL, OWNER_BANK_RACUN_ID, OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from './constants';
import { maskirajTelefon, PhoneVerifikacijaStatus } from './owner-identity';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type OtpStatus = 'pending' | 'verified' | 'expired' | 'exhausted';

export interface OtpEntry {
  kod: string;
  telefon: string;
  email: string;
  kreiranMs: number;
  isticeMs: number;
  pokusaji: number;
  status: OtpStatus;
}

export interface OtpRequestRezultat {
  uspesno: boolean;
  maskiranTelefon: string;
  isteceZaSekundi: number;
  napomena: string;
  /** Samo u dev/test okruženju — u produkciji nikad nije prisutno */
  devOtp?: string;
}

export interface OtpVerifyRezultat {
  uspesno: boolean;
  jeOwner: boolean;
  ownerEmail?: string;
  ownerRacun?: string;
  napomena: string;
}

// ─── Konstante ────────────────────────────────────────────────────────────────

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minuta
const OTP_MAX_POKUSAJI = 3;
const OTP_DUZINA = 6;
const REQUEST_WINDOW_MS = 10 * 60 * 1000; // 10 minuta
const MAX_REQUESTS_PER_WINDOW = 3;

// ─── In-memory store ──────────────────────────────────────────────────────────

const otpStore = new Map<string, OtpEntry>();

interface RequestEntry {
  count: number;
  resetMs: number;
}

const requestCounts = new Map<string, RequestEntry>();

// ─── Helper funkcije ──────────────────────────────────────────────────────────

/** Kriptografski sigurni OTP generisanja */
function generisiOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(OTP_DUZINA, '0');
}

function normalizeTelefon(telefon: string): string {
  return telefon.replace(/\s+/g, '').toLowerCase();
}

function getOwnerPhoneBroj(): string {
  const envBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY];
  if (envBroj && envBroj.trim()) return normalizeTelefon(envBroj.trim());
  return normalizeTelefon(OWNER_PHONE_DEFAULT);
}

function isOwnerPhone(telefon: string): boolean {
  return normalizeTelefon(telefon) === getOwnerPhoneBroj();
}

function checkRequestLimit(normTel: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(normTel);
  if (!entry || now >= entry.resetMs) {
    requestCounts.set(normTel, { count: 1, resetMs: now + REQUEST_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count++;
  return true;
}

function sendMockSms(telefon: string, kod: string): void {
  // Mock SMS — u produkciji zameni sa Twilio ili sličnim provajderom
  // Nikad ne logujemo pun kod u produkciji; u dev logujemo samo maskiran broj
  const displayBroj = maskirajTelefon(telefon);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[OWNER-OTP] SMS → ${displayBroj}: OTP=${kod}`);
  } else {
    console.log(`[OWNER-OTP] SMS sent → ${displayBroj}`);
  }
}

// ─── Javne funkcije ───────────────────────────────────────────────────────────

/**
 * Zahteva OTP za vlasnički telefon.
 * Vraća maskiran telefon i trajanje; devOtp samo van produkcije.
 */
export function requestOwnerOtp(telefon: string): OtpRequestRezultat {
  const normTel = normalizeTelefon(telefon);

  if (!checkRequestLimit(normTel)) {
    return {
      uspesno: false,
      maskiranTelefon: maskirajTelefon(telefon),
      isteceZaSekundi: 0,
      napomena: `Previše OTP zahteva. Pokušajte ponovo za ${Math.round(REQUEST_WINDOW_MS / 60000)} minuta.`,
    };
  }

  const kod = generisiOtp();
  const now = Date.now();

  const entry: OtpEntry = {
    kod,
    telefon: normTel,
    email: isOwnerPhone(normTel) ? OWNER_EMAIL : '',
    kreiranMs: now,
    isticeMs: now + OTP_TTL_MS,
    pokusaji: 0,
    status: 'pending',
  };

  otpStore.set(normTel, entry);
  sendMockSms(telefon, kod);

  const rezultat: OtpRequestRezultat = {
    uspesno: true,
    maskiranTelefon: maskirajTelefon(telefon),
    isteceZaSekundi: Math.round(OTP_TTL_MS / 1000),
    napomena: `OTP je poslat na ${maskirajTelefon(telefon)}. Važi ${Math.round(OTP_TTL_MS / 60000)} minuta.`,
  };

  // Vidljivo samo van produkcije — za testiranje i razvoj
  if (process.env.NODE_ENV !== 'production') {
    rezultat.devOtp = kod;
  }

  return rezultat;
}

/**
 * Verifikuje OTP za vlasnički telefon.
 * Vraća jeOwner=true i ownerRacun ako je telefon vlasnički.
 */
export function verifyOwnerOtp(telefon: string, otp: string): OtpVerifyRezultat {
  const normTel = normalizeTelefon(telefon);
  const entry = otpStore.get(normTel);

  if (!entry) {
    return {
      uspesno: false,
      jeOwner: false,
      napomena: 'OTP nije pronađen za ovaj broj. Zatražite novi OTP.',
    };
  }

  if (entry.status === 'expired' || Date.now() > entry.isticeMs) {
    entry.status = 'expired';
    otpStore.set(normTel, entry);
    return {
      uspesno: false,
      jeOwner: false,
      napomena: 'OTP je istekao. Zatražite novi.',
    };
  }

  if (entry.status === 'exhausted') {
    return {
      uspesno: false,
      jeOwner: false,
      napomena: 'Previše neuspelih pokušaja. Zatražite novi OTP.',
    };
  }

  if (entry.status === 'verified') {
    return {
      uspesno: false,
      jeOwner: false,
      napomena: 'OTP je već iskorišćen. Zatražite novi.',
    };
  }

  entry.pokusaji++;

  if (entry.kod !== otp.trim()) {
    if (entry.pokusaji >= OTP_MAX_POKUSAJI) {
      entry.status = 'exhausted';
    }
    otpStore.set(normTel, entry);
    const preostalo = Math.max(0, OTP_MAX_POKUSAJI - entry.pokusaji);
    return {
      uspesno: false,
      jeOwner: false,
      napomena:
        preostalo > 0
          ? `Neispravan OTP. Preostalo pokušaja: ${preostalo}.`
          : 'Previše neuspelih pokušaja. Zatražite novi OTP.',
    };
  }

  // Verifikacija uspešna
  entry.status = 'verified';
  otpStore.set(normTel, entry);

  const jeOwner = isOwnerPhone(normTel);

  return {
    uspesno: true,
    jeOwner,
    ...(jeOwner ? { ownerEmail: entry.email } : {}),
    ...(jeOwner ? { ownerRacun: OWNER_BANK_RACUN_ID } : {}),
    napomena: jeOwner
      ? `Telefonska verifikacija uspešna. Vlasnički status potvrđen. Račun: ${OWNER_BANK_RACUN_ID}`
      : 'Telefonska verifikacija uspešna.',
  };
}

/**
 * Vraća trenutni status OTP-a za dati broj.
 * Koristi se za proveru u owner-identity route-u.
 */
export function getOtpStatus(telefon: string): OtpStatus | null {
  const normTel = normalizeTelefon(telefon);
  const entry = otpStore.get(normTel);
  if (!entry) return null;
  if (entry.status === 'pending' && Date.now() > entry.isticeMs) {
    entry.status = 'expired';
    otpStore.set(normTel, entry);
  }
  return entry.status;
}

/**
 * Vraća PhoneVerifikacijaStatus za owner-identity model.
 */
export function getOwnerPhoneVerifikacijaStatus(telefon: string): PhoneVerifikacijaStatus {
  const otpStatus = getOtpStatus(telefon);
  if (otpStatus === 'verified') return 'verifikovan';
  if (otpStatus === 'pending') return 'otp-poslan';
  return 'nije-verifikovan';
}

/**
 * Vraća ISO timestamp poslednje uspešne OTP verifikacije, ili null.
 */
export function getOwnerPoslednja_verifikacija(telefon: string): string | null {
  const normTel = normalizeTelefon(telefon);
  const entry = otpStore.get(normTel);
  if (!entry || entry.status !== 'verified') return null;
  return new Date(entry.kreiranMs).toISOString();
}
