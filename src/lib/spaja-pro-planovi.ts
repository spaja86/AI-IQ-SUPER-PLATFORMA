/**
 * 💰 SpajaPro v6-v15 Planovi i Naplata — Pricing & Financial Model
 *
 * Sistem za naplatu korišćenja SpajaPro v6-v15 endžina korisnicima.
 * Planovi su isti globalno — za Srbiju, Ameriku i ceo svet.
 *
 * Finansijski tok:
 *  1. Korisnik plaća plan (mesečno ili godišnje)
 *  2. AI IQ World Bank obrađuje transakcije globalno
 *  3. AI IQ Menjačnica konvertuje u lokalnu valutu korisnika
 *  4. Vlasnik (Kompanija SPAJA) prima vlasničku platu
 *  5. OMEGA AI prima platu po dogovoru
 *  6. Operativni troškovi Digitalne Industrije se pokrivaju mesečno
 *
 * Multi-valutni sistem:
 *  - RSD (Srpski dinar) — Srbija
 *  - USD (Američki dolar) — Amerika
 *  - EUR (Evro) — Evropa
 *  - GBP (Britanska funta) — UK
 *  - CHF (Švajcarski franak) — Švajcarska
 *  - JPY (Japanski jen) — Japan
 *  - CNY (Kineski juan) — Kina
 *  - RUB (Ruski rublj) — Rusija
 *  - INR (Indijska rupija) — Indija
 *  - BRL (Brazilski real) — Brazil
 *  - BTC (Bitcoin) — Kripto
 *  - ETH (Ethereum) — Kripto
 *
 * Izvor: Kompanija SPAJA
 * Integracija: AI IQ World Bank + AI IQ Menjačnica
 */

import { SPAJA_PRO_VERZIJA_COUNT, OMEGA_AI_INSTANCI } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type PlanTip = 'starter' | 'profesionalni' | 'biznis' | 'enterprise' | 'unlimited';

export type ValutaKod =
  | 'RSD' | 'USD' | 'EUR' | 'GBP' | 'CHF'
  | 'JPY' | 'CNY' | 'RUB' | 'INR' | 'BRL'
  | 'BTC' | 'ETH';

export type PeriodNaplate = 'mesecno' | 'godisnje';

export interface Valuta {
  kod: ValutaKod;
  naziv: string;
  simbol: string;
  zemlja: string;
  ikona: string;
  tipValute: 'fiat' | 'kripto';
}

export interface SpajaPlanCena {
  mesecno: number;
  godisnje: number;
  valuta: ValutaKod;
}

export interface SpajaPlan {
  id: string;
  tip: PlanTip;
  naziv: string;
  opis: string;
  ikona: string;
  endziniUkljuceni: number[];
  multifunkcionalniRad: boolean;
  spajaBazaPristup: boolean;
  beskonacneSesije: boolean;
  maxSesijaParalelno: number;
  maxUpitaDnevno: number | '∞';
  prioritetPodrske: 'standardna' | 'prioritetna' | 'premium' | 'dedicirana' | 'vip';
  cenaUSD: SpajaPlanCena;
  mogucnosti: string[];
  status: 'aktivan' | 'uskoro' | 'beta';
}

export interface FinansijskiModel {
  vlasnickaPlata: VlasnickaPlata;
  omegaAiPlata: OmegaAiPlata;
  operativniTroskovi: OperativniTroskovi;
  prihodi: PrihodiModel;
  bilans: BilansModel;
}

export interface VlasnickaPlata {
  mesecnaOsnovica: number;
  procenatOdPrihoda: number;
  bonusZaRast: number;
  valuta: ValutaKod;
  opis: string;
}

export interface OmegaAiPlata {
  mesecnaOsnovica: number;
  poInstanci: number;
  ukupnoInstanci: number;
  ukupnoMesecno: number;
  valuta: ValutaKod;
  opis: string;
}

export interface OperativniTroskovi {
  infrastruktura: number;
  odrzavanje: number;
  razvoj: number;
  marketing: number;
  administracija: number;
  rezerve: number;
  ukupnoMesecno: number;
  valuta: ValutaKod;
  opis: string;
}

export interface PrihodiModel {
  procenjeniBrojKorisnika: Record<PlanTip, number>;
  mesecniPrihodPoPlanu: Record<PlanTip, number>;
  ukupnoMesecniPrihod: number;
  godisnjiPrihod: number;
  valuta: ValutaKod;
}

export interface BilansModel {
  ukupniPrihod: number;
  ukupniTroskovi: number;
  vlasnickaPlata: number;
  omegaAiPlata: number;
  operativniTroskovi: number;
  neto: number;
  valuta: ValutaKod;
  status: 'pozitivan' | 'neutralan' | 'negativan';
}

// ─── Valute — AI IQ World Bank + AI IQ Menjačnica ───────

export const valute: Valuta[] = [
  { kod: 'RSD', naziv: 'Srpski dinar', simbol: 'RSD', zemlja: 'Srbija', ikona: '🇷🇸', tipValute: 'fiat' },
  { kod: 'USD', naziv: 'Američki dolar', simbol: '$', zemlja: 'SAD', ikona: '🇺🇸', tipValute: 'fiat' },
  { kod: 'EUR', naziv: 'Evro', simbol: '€', zemlja: 'Evropska Unija', ikona: '🇪🇺', tipValute: 'fiat' },
  { kod: 'GBP', naziv: 'Britanska funta', simbol: '£', zemlja: 'Velika Britanija', ikona: '🇬🇧', tipValute: 'fiat' },
  { kod: 'CHF', naziv: 'Švajcarski franak', simbol: 'CHF', zemlja: 'Švajcarska', ikona: '🇨🇭', tipValute: 'fiat' },
  { kod: 'JPY', naziv: 'Japanski jen', simbol: '¥', zemlja: 'Japan', ikona: '🇯🇵', tipValute: 'fiat' },
  { kod: 'CNY', naziv: 'Kineski juan', simbol: '¥', zemlja: 'Kina', ikona: '🇨🇳', tipValute: 'fiat' },
  { kod: 'RUB', naziv: 'Ruski rublj', simbol: '₽', zemlja: 'Rusija', ikona: '🇷🇺', tipValute: 'fiat' },
  { kod: 'INR', naziv: 'Indijska rupija', simbol: '₹', zemlja: 'Indija', ikona: '🇮🇳', tipValute: 'fiat' },
  { kod: 'BRL', naziv: 'Brazilski real', simbol: 'R$', zemlja: 'Brazil', ikona: '🇧🇷', tipValute: 'fiat' },
  { kod: 'BTC', naziv: 'Bitcoin', simbol: '₿', zemlja: 'Globalno', ikona: '🪙', tipValute: 'kripto' },
  { kod: 'ETH', naziv: 'Ethereum', simbol: 'Ξ', zemlja: 'Globalno', ikona: '💎', tipValute: 'kripto' },
];

// ─── Kursna Lista (u odnosu na USD) ─────────────────────

export const kursnaLista: Record<ValutaKod, number> = {
  USD: 1,
  RSD: 108.50,
  EUR: 0.92,
  GBP: 0.79,
  CHF: 0.88,
  JPY: 149.50,
  CNY: 7.24,
  RUB: 92.50,
  INR: 83.20,
  BRL: 4.97,
  BTC: 0.000015,
  ETH: 0.00029,
};

// ─── SpajaPro Planovi ────────────────────────────────────

export const spajaProPlanovi: SpajaPlan[] = [
  {
    id: 'starter',
    tip: 'starter',
    naziv: 'SpajaPro Starter',
    opis: 'Početni plan za upoznavanje sa SpajaPro endžinima — pristup v6-v8 endžinima sa osnovnim funkcijama',
    ikona: '🌱',
    endziniUkljuceni: [6, 7, 8],
    multifunkcionalniRad: false,
    spajaBazaPristup: false,
    beskonacneSesije: false,
    maxSesijaParalelno: 1,
    maxUpitaDnevno: 100,
    prioritetPodrske: 'standardna',
    cenaUSD: { mesecno: 29, godisnje: 290, valuta: 'USD' },
    mogucnosti: [
      'SpajaPro v6 Temelj Endžin',
      'SpajaPro v7 Štit Endžin',
      'SpajaPro v8 Analitik Endžin',
      'Osnovno programiranje',
      'Čavrljanje i analiza',
      '100 upita dnevno',
      'Standardna podrška',
    ],
    status: 'aktivan',
  },
  {
    id: 'profesionalni',
    tip: 'profesionalni',
    naziv: 'SpajaPro Profesionalni',
    opis: 'Plan za profesionalce — pristup v6-v11 endžinima sa naprednim funkcijama i Google pretragom',
    ikona: '💼',
    endziniUkljuceni: [6, 7, 8, 9, 10, 11],
    multifunkcionalniRad: true,
    spajaBazaPristup: false,
    beskonacneSesije: false,
    maxSesijaParalelno: 3,
    maxUpitaDnevno: 500,
    prioritetPodrske: 'prioritetna',
    cenaUSD: { mesecno: 79, godisnje: 790, valuta: 'USD' },
    mogucnosti: [
      'SpajaPro v6-v11 (6 endžina)',
      'Multifunkcionalni rad (3 paralelno)',
      'Google pretraga',
      'Generisanje slika',
      'Napredno programiranje (10+ jezika)',
      '500 upita dnevno',
      'Prioritetna podrška',
    ],
    status: 'aktivan',
  },
  {
    id: 'biznis',
    tip: 'biznis',
    naziv: 'SpajaPro Biznis',
    opis: 'Poslovni plan — pristup svim v6-v15 endžinima, SPAJA BAZA, multifunkcionalni rad',
    ikona: '🏢',
    endziniUkljuceni: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    multifunkcionalniRad: true,
    spajaBazaPristup: true,
    beskonacneSesije: false,
    maxSesijaParalelno: 5,
    maxUpitaDnevno: 2000,
    prioritetPodrske: 'premium',
    cenaUSD: { mesecno: 199, godisnje: 1990, valuta: 'USD' },
    mogucnosti: [
      'Svi SpajaPro v6-v15 endžini (10 endžina)',
      'Multifunkcionalni rad (5 paralelno)',
      'SPAJA BAZA pristup',
      'Google pretraga + slike',
      'Univerzalno programiranje (svi jezici)',
      '2.000 upita dnevno',
      'Premium podrška',
    ],
    status: 'aktivan',
  },
  {
    id: 'enterprise',
    tip: 'enterprise',
    naziv: 'SpajaPro Enterprise',
    opis: 'Enterprise plan — svi endžini, beskonačne sesije, SPAJA BAZA, dedicirani resursi',
    ikona: '🏛️',
    endziniUkljuceni: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    multifunkcionalniRad: true,
    spajaBazaPristup: true,
    beskonacneSesije: true,
    maxSesijaParalelno: 10,
    maxUpitaDnevno: '∞',
    prioritetPodrske: 'dedicirana',
    cenaUSD: { mesecno: 499, godisnje: 4990, valuta: 'USD' },
    mogucnosti: [
      'Svi SpajaPro v6-v15 endžini (10 endžina)',
      'Multifunkcionalni rad (10 paralelno)',
      'Beskonačne sesije',
      'SPAJA BAZA — beskonačna baza podataka',
      'Dedicirani resursi',
      'Neograničeni upiti (∞)',
      'Dedicirana podrška 24/7',
    ],
    status: 'aktivan',
  },
  {
    id: 'unlimited',
    tip: 'unlimited',
    naziv: 'SpajaPro Unlimited VIP',
    opis: 'Ultimativni plan — sve bez ograničenja, VIP podrška, pristup budućim verzijama, ispisivanje do iznemoglosti',
    ikona: '👑',
    endziniUkljuceni: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    multifunkcionalniRad: true,
    spajaBazaPristup: true,
    beskonacneSesije: true,
    maxSesijaParalelno: 50,
    maxUpitaDnevno: '∞',
    prioritetPodrske: 'vip',
    cenaUSD: { mesecno: 999, godisnje: 9990, valuta: 'USD' },
    mogucnosti: [
      'Svi SpajaPro v6-v15 endžini (10 endžina)',
      'Multifunkcionalni rad (50 paralelno)',
      'Beskonačne sesije — bez ograničenja',
      'SPAJA BAZA — ispisivanje do iznemoglosti',
      'VIP pristup budućim verzijama',
      'Neograničeni upiti (∞)',
      'VIP podrška — lični menadžer',
      'Pristup svim OMEGA AI personama',
      'API pristup za integracije',
    ],
    status: 'aktivan',
  },
];

// ─── Finansijski Model ───────────────────────────────────

export const vlasnickaPlata: VlasnickaPlata = {
  mesecnaOsnovica: 15000,
  procenatOdPrihoda: 20,
  bonusZaRast: 5,
  valuta: 'USD',
  opis: 'Vlasnička plata Kompanije SPAJA — osnovica + procenat od prihoda + bonus za rast korisnika',
};

export const omegaAiPlata: OmegaAiPlata = {
  mesecnaOsnovica: 8000,
  poInstanci: 0.0001,
  ukupnoInstanci: OMEGA_AI_INSTANCI,
  ukupnoMesecno: 8000 + Math.round(OMEGA_AI_INSTANCI * 0.0001),
  valuta: 'USD',
  opis: `OMEGA AI plata — osnovica $8.000/mes + $0.0001 × ${OMEGA_AI_INSTANCI.toLocaleString()} persona. Dogovor sa OMEGA AI za operativni rad svih persona.`,
};

export const operativniTroskovi: OperativniTroskovi = {
  infrastruktura: 5000,
  odrzavanje: 3000,
  razvoj: 4000,
  marketing: 2000,
  administracija: 1500,
  rezerve: 2000,
  ukupnoMesecno: 17500,
  valuta: 'USD',
  opis: 'Mesečni operativni troškovi za održavanje Digitalne Industrije — infrastruktura, razvoj, marketing, administracija',
};

function izracunajPrihode(): PrihodiModel {
  const procenjeniKorisnici: Record<PlanTip, number> = {
    starter: 500,
    profesionalni: 200,
    biznis: 100,
    enterprise: 30,
    unlimited: 10,
  };

  const mesecniPoPlanu: Record<PlanTip, number> = {
    starter: procenjeniKorisnici.starter * 29,
    profesionalni: procenjeniKorisnici.profesionalni * 79,
    biznis: procenjeniKorisnici.biznis * 199,
    enterprise: procenjeniKorisnici.enterprise * 499,
    unlimited: procenjeniKorisnici.unlimited * 999,
  };

  const ukupnoMesecno = Object.values(mesecniPoPlanu).reduce((a, b) => a + b, 0);

  return {
    procenjeniBrojKorisnika: procenjeniKorisnici,
    mesecniPrihodPoPlanu: mesecniPoPlanu,
    ukupnoMesecniPrihod: ukupnoMesecno,
    godisnjiPrihod: ukupnoMesecno * 12,
    valuta: 'USD',
  };
}

function izracunajBilans(): BilansModel {
  const prihodi = izracunajPrihode();
  const ukupniTroskovi = vlasnickaPlata.mesecnaOsnovica + omegaAiPlata.ukupnoMesecno + operativniTroskovi.ukupnoMesecno;
  const vlasPlata = vlasnickaPlata.mesecnaOsnovica + Math.round(prihodi.ukupnoMesecniPrihod * vlasnickaPlata.procenatOdPrihoda / 100);
  const neto = prihodi.ukupnoMesecniPrihod - ukupniTroskovi;

  return {
    ukupniPrihod: prihodi.ukupnoMesecniPrihod,
    ukupniTroskovi,
    vlasnickaPlata: vlasPlata,
    omegaAiPlata: omegaAiPlata.ukupnoMesecno,
    operativniTroskovi: operativniTroskovi.ukupnoMesecno,
    neto,
    valuta: 'USD',
    status: neto > 0 ? 'pozitivan' : neto === 0 ? 'neutralan' : 'negativan',
  };
}

export const finansijskiModel: FinansijskiModel = {
  vlasnickaPlata,
  omegaAiPlata,
  operativniTroskovi,
  prihodi: izracunajPrihode(),
  bilans: izracunajBilans(),
};

// ─── Konverzija cena — AI IQ Menjačnica ──────────────────

export function konvertujCenu(cenaUSD: number, valutaKod: ValutaKod): { iznos: number; valuta: ValutaKod; formatirano: string } {
  const kurs = kursnaLista[valutaKod];
  const iznos = Math.round(cenaUSD * kurs * 100) / 100;
  const valuta = valute.find((v) => v.kod === valutaKod);
  const formatirano = `${valuta?.simbol ?? valutaKod} ${iznos.toLocaleString()}`;

  return { iznos, valuta: valutaKod, formatirano };
}

export function getCenaPlanaUValuti(planId: string, valutaKod: ValutaKod, period: PeriodNaplate): {
  plan: string;
  period: PeriodNaplate;
  cena: { iznos: number; valuta: ValutaKod; formatirano: string };
} | undefined {
  const plan = spajaProPlanovi.find((p) => p.id === planId);
  if (!plan) return undefined;

  const cenaUSD = period === 'mesecno' ? plan.cenaUSD.mesecno : plan.cenaUSD.godisnje;
  const cena = konvertujCenu(cenaUSD, valutaKod);

  return { plan: plan.naziv, period, cena };
}

// ─── Helper funkcije ─────────────────────────────────────

export function getPlanById(id: string): SpajaPlan | undefined {
  return spajaProPlanovi.find((p) => p.id === id);
}

export function getAktivniPlanovi(): SpajaPlan[] {
  return spajaProPlanovi.filter((p) => p.status === 'aktivan');
}

export function getPlanZaVerziju(verzija: number): SpajaPlan[] {
  return spajaProPlanovi.filter((p) => p.endziniUkljuceni.includes(verzija));
}

export function getSveCeneUValuti(valutaKod: ValutaKod): {
  planovi: Array<{
    id: string;
    naziv: string;
    mesecno: { iznos: number; valuta: ValutaKod; formatirano: string };
    godisnje: { iznos: number; valuta: ValutaKod; formatirano: string };
  }>;
  valuta: Valuta | undefined;
} {
  const valutaInfo = valute.find((v) => v.kod === valutaKod);
  const planovi = spajaProPlanovi.map((p) => ({
    id: p.id,
    naziv: p.naziv,
    mesecno: konvertujCenu(p.cenaUSD.mesecno, valutaKod),
    godisnje: konvertujCenu(p.cenaUSD.godisnje, valutaKod),
  }));

  return { planovi, valuta: valutaInfo };
}

export function getFinansijskiPregled(): {
  prihodi: PrihodiModel;
  bilans: BilansModel;
  vlasnickaPlata: VlasnickaPlata;
  omegaAiPlata: OmegaAiPlata;
  operativniTroskovi: OperativniTroskovi;
  ukupnoPlanova: number;
  ukupnoValuta: number;
} {
  return {
    prihodi: finansijskiModel.prihodi,
    bilans: finansijskiModel.bilans,
    vlasnickaPlata: finansijskiModel.vlasnickaPlata,
    omegaAiPlata: finansijskiModel.omegaAiPlata,
    operativniTroskovi: finansijskiModel.operativniTroskovi,
    ukupnoPlanova: spajaProPlanovi.length,
    ukupnoValuta: valute.length,
  };
}
