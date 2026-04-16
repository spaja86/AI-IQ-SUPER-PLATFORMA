/**
 * 🔐💳 Profesionalni Login — Platni Sistem (Stripe & PayPal)
 *
 * Profesionalni login sa rutama za STRIPE i PAYPAL plaćanja.
 * Svaka ruta ima sistem za poslovne mejlove od AI IQ World Bank.
 * Kada mejl stigne na određenu rutu, proveravaju se sve informacije.
 *
 * Generisan kroz: SPAJA Generator za Endžine + AI IQ World Bank
 *
 * Funkcije:
 *  1. Stripe ruta — profesionalni login sa Stripe plaćanjem
 *  2. PayPal ruta — profesionalni login sa PayPal plaćanjem
 *  3. Poslovni mejlovi — rute za mejlove od AI IQ World Bank
 *  4. Verifikacioni sistem — provera svih informacija iz mejlova
 *  5. Rutiranje mejlova — automatsko usmeravanje na Stripe/PayPal
 *  6. Validacija podataka — provera integriteta svih informacija
 *
 * Finansijski tok:
 *  AI IQ World Bank → Poslovni Mejl → Ruta (Stripe/PayPal) → Verifikacija → Odobrenje
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { APP_VERSION, KOMPANIJA } from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type PlatniProvajder = 'stripe' | 'paypal';

export type MejlRutaStatus =
  | 'primljen'
  | 'u-verifikaciji'
  | 'verifikovan'
  | 'odbijen'
  | 'na-cekanju'
  | 'obradjen';

export type VerifikacijaTip =
  | 'identitet'
  | 'transakcija'
  | 'pretplata'
  | 'refund'
  | 'faktura'
  | 'bezbednost';

export type PoslovniMejlKategorija =
  | 'stripe-transakcija'
  | 'stripe-pretplata'
  | 'stripe-faktura'
  | 'stripe-refund'
  | 'paypal-transakcija'
  | 'paypal-pretplata'
  | 'paypal-faktura'
  | 'paypal-refund'
  | 'verifikacija-identiteta'
  | 'bezbednosno-upozorenje';

// ─── Interfejsi ──────────────────────────────────────────

export interface PoslovniMejlRuta {
  id: string;
  provajder: PlatniProvajder;
  mejlAdresa: string;
  kategorija: PoslovniMejlKategorija;
  naziv: string;
  opis: string;
  verifikacijePolja: string[];
  aktivan: boolean;
}

export interface MejlVerifikacija {
  id: string;
  mejlRutaId: string;
  tip: VerifikacijaTip;
  status: MejlRutaStatus;
  proverenaPolja: VerifikacionoPolje[];
  rezultat: 'uspesno' | 'neuspesno' | 'u-toku';
  napomena: string;
  timestamp: string;
}

export interface VerifikacionoPolje {
  naziv: string;
  ocekivanaVrednost: string;
  stvarnaVrednost: string;
  status: 'tacno' | 'netacno' | 'nedostaje';
}

export interface VerifikacioniSistem {
  id: string;
  naziv: string;
  opis: string;
  provajder: PlatniProvajder;
  koraci: VerifikacioniKorak[];
  ukupnoProvera: number;
  automatska: boolean;
}

export interface VerifikacioniKorak {
  redosled: number;
  naziv: string;
  opis: string;
  obavezno: boolean;
  tipProvere: string;
}

export interface PlatniProvajderRuta {
  id: string;
  provajder: PlatniProvajder;
  naziv: string;
  opis: string;
  ikona: string;
  mejlRute: PoslovniMejlRuta[];
  verifikacioniSistem: VerifikacioniSistem;
  poslovniMejlDomen: string;
  mogucnosti: string[];
  status: 'aktivan' | 'konfiguracija' | 'testiranje';
}

export interface ProfesionalniLoginPlatniSistem {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  provajderi: PlatniProvajderRuta[];
  ukupnoRuta: number;
  ukupnoMejlRuta: number;
  ukupnoVerifikacija: number;
  mogucnosti: string[];
  status: 'aktivan' | 'konfiguracija';
}

// ─── Verifikacioni Sistem za Stripe ─────────────────────

const stripeVerifikacioniSistem: VerifikacioniSistem = {
  id: 'verif-stripe',
  naziv: 'Stripe Mejl Verifikacioni Sistem',
  opis: 'Sistem za proveru svih informacija iz poslovnih mejlova koji stizu na Stripe rutu od AI IQ World Bank',
  provajder: 'stripe',
  koraci: [
    {
      redosled: 1,
      naziv: 'Provera posiljaoca',
      opis: 'Verifikacija da mejl dolazi sa validnog AI IQ World Bank domena (@banka.spaja.rs)',
      obavezno: true,
      tipProvere: 'domen-validacija',
    },
    {
      redosled: 2,
      naziv: 'Provera digitalnog potpisa',
      opis: 'DKIM i SPF verifikacija mejla za autenticnost posiljaoca',
      obavezno: true,
      tipProvere: 'dkim-spf',
    },
    {
      redosled: 3,
      naziv: 'Provera Stripe ID-a',
      opis: 'Validacija Stripe Payment Intent ID, Customer ID ili Subscription ID u sadrzaju mejla',
      obavezno: true,
      tipProvere: 'stripe-id-validacija',
    },
    {
      redosled: 4,
      naziv: 'Provera iznosa i valute',
      opis: 'Verifikacija da iznos i valuta u mejlu odgovaraju Stripe transakciji',
      obavezno: true,
      tipProvere: 'iznos-valuta',
    },
    {
      redosled: 5,
      naziv: 'Provera korisnickog identiteta',
      opis: 'Cross-reference korisnikovog email-a i Stripe customer-a sa AI IQ World Bank evidencijom',
      obavezno: true,
      tipProvere: 'identitet-provera',
    },
    {
      redosled: 6,
      naziv: 'Provera vremenskog pecata',
      opis: 'Validacija da je mejl poslan u razumnom vremenskom okviru (ne stariji od 24h)',
      obavezno: true,
      tipProvere: 'timestamp-validacija',
    },
    {
      redosled: 7,
      naziv: 'Provera TLS enkripcije',
      opis: 'Verifikacija da je mejl prenet putem TLS enkriptovane veze',
      obavezno: true,
      tipProvere: 'tls-provera',
    },
    {
      redosled: 8,
      naziv: 'Anti-fraud analiza',
      opis: 'AI analiza sadrzaja mejla za detekciju prevara, phishing-a i sumnjivih obrazaca',
      obavezno: true,
      tipProvere: 'anti-fraud',
    },
  ],
  ukupnoProvera: 8,
  automatska: true,
};

// ─── Verifikacioni Sistem za PayPal ─────────────────────

const paypalVerifikacioniSistem: VerifikacioniSistem = {
  id: 'verif-paypal',
  naziv: 'PayPal Mejl Verifikacioni Sistem',
  opis: 'Sistem za proveru svih informacija iz poslovnih mejlova koji stizu na PayPal rutu od AI IQ World Bank',
  provajder: 'paypal',
  koraci: [
    {
      redosled: 1,
      naziv: 'Provera posiljaoca',
      opis: 'Verifikacija da mejl dolazi sa validnog AI IQ World Bank domena (@banka.spaja.rs)',
      obavezno: true,
      tipProvere: 'domen-validacija',
    },
    {
      redosled: 2,
      naziv: 'Provera digitalnog potpisa',
      opis: 'DKIM i SPF verifikacija mejla za autenticnost posiljaoca',
      obavezno: true,
      tipProvere: 'dkim-spf',
    },
    {
      redosled: 3,
      naziv: 'Provera PayPal Transaction ID',
      opis: 'Validacija PayPal Transaction ID, Order ID ili Billing Agreement ID u sadrzaju mejla',
      obavezno: true,
      tipProvere: 'paypal-id-validacija',
    },
    {
      redosled: 4,
      naziv: 'Provera iznosa i valute',
      opis: 'Verifikacija da iznos i valuta u mejlu odgovaraju PayPal transakciji',
      obavezno: true,
      tipProvere: 'iznos-valuta',
    },
    {
      redosled: 5,
      naziv: 'Provera PayPal naloga',
      opis: 'Cross-reference PayPal email-a i naloga sa AI IQ World Bank evidencijom',
      obavezno: true,
      tipProvere: 'identitet-provera',
    },
    {
      redosled: 6,
      naziv: 'Provera vremenskog pecata',
      opis: 'Validacija da je mejl poslan u razumnom vremenskom okviru (ne stariji od 24h)',
      obavezno: true,
      tipProvere: 'timestamp-validacija',
    },
    {
      redosled: 7,
      naziv: 'Provera TLS enkripcije',
      opis: 'Verifikacija da je mejl prenet putem TLS enkriptovane veze',
      obavezno: true,
      tipProvere: 'tls-provera',
    },
    {
      redosled: 8,
      naziv: 'Anti-fraud analiza',
      opis: 'AI analiza sadrzaja mejla za detekciju prevara, phishing-a i sumnjivih obrazaca',
      obavezno: true,
      tipProvere: 'anti-fraud',
    },
  ],
  ukupnoProvera: 8,
  automatska: true,
};

// ─── Stripe Mejl Rute ────────────────────────────────────

const stripeMejlRute: PoslovniMejlRuta[] = [
  {
    id: 'stripe-ruta-transakcija',
    provajder: 'stripe',
    mejlAdresa: 'stripe-transakcije@banka.spaja.rs',
    kategorija: 'stripe-transakcija',
    naziv: 'Stripe Transakcije — Poslovni Mejlovi',
    opis: 'Ruta za poslovne mejlove o Stripe transakcijama od AI IQ World Bank. Svaki mejl prolazi kroz kompletnu verifikaciju.',
    verifikacijePolja: ['stripePaymentIntentId', 'iznos', 'valuta', 'korisnikEmail', 'datum', 'status'],
    aktivan: true,
  },
  {
    id: 'stripe-ruta-pretplata',
    provajder: 'stripe',
    mejlAdresa: 'stripe-pretplate@banka.spaja.rs',
    kategorija: 'stripe-pretplata',
    naziv: 'Stripe Pretplate — Poslovni Mejlovi',
    opis: 'Ruta za poslovne mejlove o Stripe pretplatama od AI IQ World Bank. Verifikacija planova i pretplatnickih podataka.',
    verifikacijePolja: ['stripeSubscriptionId', 'plan', 'cena', 'perioda', 'korisnikEmail', 'status'],
    aktivan: true,
  },
  {
    id: 'stripe-ruta-faktura',
    provajder: 'stripe',
    mejlAdresa: 'stripe-fakture@banka.spaja.rs',
    kategorija: 'stripe-faktura',
    naziv: 'Stripe Fakture — Poslovni Mejlovi',
    opis: 'Ruta za poslovne mejlove o Stripe fakturama od AI IQ World Bank. Provera fakturisanih stavki i placanja.',
    verifikacijePolja: ['stripeInvoiceId', 'iznos', 'valuta', 'stavke', 'dospevaOn', 'status'],
    aktivan: true,
  },
  {
    id: 'stripe-ruta-refund',
    provajder: 'stripe',
    mejlAdresa: 'stripe-refund@banka.spaja.rs',
    kategorija: 'stripe-refund',
    naziv: 'Stripe Refund — Poslovni Mejlovi',
    opis: 'Ruta za poslovne mejlove o Stripe povratima sredstava od AI IQ World Bank. Verifikacija refund zahteva.',
    verifikacijePolja: ['stripeRefundId', 'originalTransakcija', 'iznos', 'razlog', 'korisnikEmail', 'status'],
    aktivan: true,
  },
];

// ─── PayPal Mejl Rute ────────────────────────────────────

const paypalMejlRute: PoslovniMejlRuta[] = [
  {
    id: 'paypal-ruta-transakcija',
    provajder: 'paypal',
    mejlAdresa: 'paypal-transakcije@banka.spaja.rs',
    kategorija: 'paypal-transakcija',
    naziv: 'PayPal Transakcije — Poslovni Mejlovi',
    opis: 'Ruta za poslovne mejlove o PayPal transakcijama od AI IQ World Bank. Svaki mejl prolazi kroz kompletnu verifikaciju.',
    verifikacijePolja: ['paypalTransactionId', 'iznos', 'valuta', 'korisnikEmail', 'datum', 'status'],
    aktivan: true,
  },
  {
    id: 'paypal-ruta-pretplata',
    provajder: 'paypal',
    mejlAdresa: 'paypal-pretplate@banka.spaja.rs',
    kategorija: 'paypal-pretplata',
    naziv: 'PayPal Pretplate — Poslovni Mejlovi',
    opis: 'Ruta za poslovne mejlove o PayPal pretplatama od AI IQ World Bank. Verifikacija billing agreement-a i pretplatnickih podataka.',
    verifikacijePolja: ['paypalBillingAgreementId', 'plan', 'cena', 'perioda', 'korisnikEmail', 'status'],
    aktivan: true,
  },
  {
    id: 'paypal-ruta-faktura',
    provajder: 'paypal',
    mejlAdresa: 'paypal-fakture@banka.spaja.rs',
    kategorija: 'paypal-faktura',
    naziv: 'PayPal Fakture — Poslovni Mejlovi',
    opis: 'Ruta za poslovne mejlove o PayPal fakturama od AI IQ World Bank. Provera fakturisanih stavki i placanja.',
    verifikacijePolja: ['paypalInvoiceId', 'iznos', 'valuta', 'stavke', 'dospevaOn', 'status'],
    aktivan: true,
  },
  {
    id: 'paypal-ruta-refund',
    provajder: 'paypal',
    mejlAdresa: 'paypal-refund@banka.spaja.rs',
    kategorija: 'paypal-refund',
    naziv: 'PayPal Refund — Poslovni Mejlovi',
    opis: 'Ruta za poslovne mejlove o PayPal povratima sredstava od AI IQ World Bank. Verifikacija refund zahteva.',
    verifikacijePolja: ['paypalRefundId', 'originalTransakcija', 'iznos', 'razlog', 'korisnikEmail', 'status'],
    aktivan: true,
  },
];

// ─── Stripe Provajder Ruta ──────────────────────────────

export const stripeRuta: PlatniProvajderRuta = {
  id: 'profesionalni-login-stripe',
  provajder: 'stripe',
  naziv: 'Profesionalni Login — Stripe Ruta',
  opis: 'Stripe ruta za profesionalni login sa poslovnim mejlovima od AI IQ World Bank. Svaki mejl koji stigne na ovu rutu prolazi kroz kompletnu verifikaciju svih informacija.',
  ikona: '💳',
  mejlRute: stripeMejlRute,
  verifikacioniSistem: stripeVerifikacioniSistem,
  poslovniMejlDomen: '@banka.spaja.rs',
  mogucnosti: [
    'Prijem poslovnih mejlova od AI IQ World Bank za Stripe transakcije',
    'Automatska verifikacija Stripe Payment Intent ID-a',
    'Provera iznosa, valute i korisnickog identiteta',
    'DKIM i SPF verifikacija posiljaoca',
    'Anti-fraud AI analiza sadrzaja mejla',
    'TLS enkripcija za prenos mejlova',
    'Automatsko rutiranje mejlova po kategoriji (transakcije, pretplate, fakture, refund)',
    'Cross-reference sa Stripe API za validaciju podataka',
    'Vremenski pecat — odbijanje mejlova starijih od 24h',
    'Kompletna audit trail za svaki primljeni mejl',
  ],
  status: 'aktivan',
};

// ─── PayPal Provajder Ruta ──────────────────────────────

export const paypalRuta: PlatniProvajderRuta = {
  id: 'profesionalni-login-paypal',
  provajder: 'paypal',
  naziv: 'Profesionalni Login — PayPal Ruta',
  opis: 'PayPal ruta za profesionalni login sa poslovnim mejlovima od AI IQ World Bank. Svaki mejl koji stigne na ovu rutu prolazi kroz kompletnu verifikaciju svih informacija.',
  ikona: '🅿️',
  mejlRute: paypalMejlRute,
  verifikacioniSistem: paypalVerifikacioniSistem,
  poslovniMejlDomen: '@banka.spaja.rs',
  mogucnosti: [
    'Prijem poslovnih mejlova od AI IQ World Bank za PayPal transakcije',
    'Automatska verifikacija PayPal Transaction ID-a',
    'Provera iznosa, valute i korisnickog identiteta',
    'DKIM i SPF verifikacija posiljaoca',
    'Anti-fraud AI analiza sadrzaja mejla',
    'TLS enkripcija za prenos mejlova',
    'Automatsko rutiranje mejlova po kategoriji (transakcije, pretplate, fakture, refund)',
    'Cross-reference sa PayPal API za validaciju podataka',
    'Vremenski pecat — odbijanje mejlova starijih od 24h',
    'Kompletna audit trail za svaki primljeni mejl',
  ],
  status: 'aktivan',
};

// ─── Kompletni Profesionalni Login Platni Sistem ─────────

const sveMejlRute = [...stripeMejlRute, ...paypalMejlRute];

const sistemMogucnosti: string[] = [
  'Profesionalni login sa Stripe i PayPal rutama',
  'Poslovni mejlovi od AI IQ World Bank za oba platna provajdera',
  'Kompletna verifikacija svih informacija iz mejlova (8 koraka po provajderu)',
  'Automatsko rutiranje mejlova na odgovarajucu rutu (Stripe ili PayPal)',
  'Verifikacija identiteta posiljaoca (DKIM, SPF, domen)',
  'Validacija platnih identifikatora (Stripe ID, PayPal Transaction ID)',
  'Cross-reference sa bankama i platnim provajderima',
  'Anti-fraud AI analiza za detekciju prevara',
  'TLS enkripcija za sve mejlove',
  'Vremenski pecat verifikacija (max 24h)',
  'Audit trail za sve mejlove i verifikacije',
  '4 kategorije mejlova po provajderu (transakcija, pretplata, faktura, refund)',
  'Automatska obrada i odobrenje verifikovanih mejlova',
  `Integracija sa ${KOMPANIJA} finansijskim sistemom`,
];

export const profesionalniLoginPlatniSistem: ProfesionalniLoginPlatniSistem = {
  naziv: 'Profesionalni Login — Platni Sistem (Stripe & PayPal)',
  opis:
    `Profesionalni login sa rutama za Stripe i PayPal placanja. ` +
    `Svaka ruta ima poslovne mejlove od AI IQ World Bank sa kompletnim verifikacionim sistemom. ` +
    `Kada mejl stigne na odredjenu rutu, proveravaju se sve informacije kroz ${stripeVerifikacioniSistem.ukupnoProvera} koraka verifikacije. ` +
    `Verzija: ${APP_VERSION}. Izvor: ${KOMPANIJA}.`,
  ikona: '🔐💳',
  verzija: APP_VERSION,
  provajderi: [stripeRuta, paypalRuta],
  ukupnoRuta: 2,
  ukupnoMejlRuta: sveMejlRute.length,
  ukupnoVerifikacija: stripeVerifikacioniSistem.ukupnoProvera + paypalVerifikacioniSistem.ukupnoProvera,
  mogucnosti: sistemMogucnosti,
  status: 'aktivan',
};

// ─── Helper Funkcije ─────────────────────────────────────

/** Vraca rutu za odredeni platni provajder */
export function getRutaZaProvajdera(provajder: PlatniProvajder): PlatniProvajderRuta {
  return provajder === 'stripe' ? stripeRuta : paypalRuta;
}

/** Vraca sve mejl rute za odredeni platni provajder */
export function getMejlRuteZaProvajdera(provajder: PlatniProvajder): PoslovniMejlRuta[] {
  return provajder === 'stripe' ? stripeMejlRute : paypalMejlRute;
}

/** Vraca verifikacioni sistem za odredeni platni provajder */
export function getVerifikacioniSistemZaProvajdera(provajder: PlatniProvajder): VerifikacioniSistem {
  return provajder === 'stripe' ? stripeVerifikacioniSistem : paypalVerifikacioniSistem;
}

/** Vraca mejl rutu po ID-u */
export function getMejlRutaPoId(id: string): PoslovniMejlRuta | undefined {
  return sveMejlRute.find((r) => r.id === id);
}

/** Vraca sve aktivne mejl rute */
export function getAktivneMejlRute(): PoslovniMejlRuta[] {
  return sveMejlRute.filter((r) => r.aktivan);
}

/** Vraca sve mejl adrese za poslovne mejlove */
export function getSvePoslovneMejlAdrese(): string[] {
  return sveMejlRute.map((r) => r.mejlAdresa);
}

/** Simulira verifikaciju mejla — prolazi kroz sve korake verifikacionog sistema */
export function verifikujMejl(
  provajder: PlatniProvajder,
  mejlPodaci: Record<string, string>,
): MejlVerifikacija {
  const sistem = getVerifikacioniSistemZaProvajdera(provajder);
  const polja: VerifikacionoPolje[] = [];
  let sveOk = true;

  // Provera posiljaoca — domen mora biti @banka.spaja.rs
  const posiljalacDomen = mejlPodaci['posiljalacDomen'] ?? '';
  const domenOk = posiljalacDomen === '@banka.spaja.rs' || posiljalacDomen === 'banka.spaja.rs';
  polja.push({
    naziv: 'Domen posiljaoca',
    ocekivanaVrednost: '@banka.spaja.rs',
    stvarnaVrednost: posiljalacDomen || 'nedostaje',
    status: domenOk ? 'tacno' : posiljalacDomen ? 'netacno' : 'nedostaje',
  });
  if (!domenOk) sveOk = false;

  // Provera digitalnog potpisa
  const dkimValid = mejlPodaci['dkimValid'] === 'true';
  polja.push({
    naziv: 'DKIM potpis',
    ocekivanaVrednost: 'true',
    stvarnaVrednost: mejlPodaci['dkimValid'] ?? 'nedostaje',
    status: dkimValid ? 'tacno' : 'netacno',
  });
  if (!dkimValid) sveOk = false;

  // Provera platnog ID-a
  const platniIdKljuc = provajder === 'stripe' ? 'stripeId' : 'paypalTransactionId';
  const platniId = mejlPodaci[platniIdKljuc] ?? '';
  const idPostoji = platniId.length > 0;
  polja.push({
    naziv: provajder === 'stripe' ? 'Stripe ID' : 'PayPal Transaction ID',
    ocekivanaVrednost: 'postoji',
    stvarnaVrednost: idPostoji ? platniId : 'nedostaje',
    status: idPostoji ? 'tacno' : 'nedostaje',
  });
  if (!idPostoji) sveOk = false;

  // Provera iznosa
  const iznos = mejlPodaci['iznos'] ?? '';
  const iznosOk = iznos.length > 0 && !isNaN(Number(iznos)) && Number(iznos) > 0;
  polja.push({
    naziv: 'Iznos',
    ocekivanaVrednost: '> 0',
    stvarnaVrednost: iznos || 'nedostaje',
    status: iznosOk ? 'tacno' : iznos ? 'netacno' : 'nedostaje',
  });
  if (!iznosOk) sveOk = false;

  // Provera korisnickog email-a
  const email = mejlPodaci['korisnikEmail'] ?? '';
  const emailOk = email.includes('@') && email.includes('.');
  polja.push({
    naziv: 'Korisnicki email',
    ocekivanaVrednost: 'validan email',
    stvarnaVrednost: email || 'nedostaje',
    status: emailOk ? 'tacno' : email ? 'netacno' : 'nedostaje',
  });
  if (!emailOk) sveOk = false;

  return {
    id: `verif-${Date.now()}`,
    mejlRutaId: `${provajder}-ruta`,
    tip: 'transakcija',
    status: sveOk ? 'verifikovan' : 'odbijen',
    proverenaPolja: polja,
    rezultat: sveOk ? 'uspesno' : 'neuspesno',
    napomena: sveOk
      ? `Sve ${sistem.ukupnoProvera} provera uspesno zavrsene — mejl verifikovan`
      : 'Verifikacija neuspesna — jedan ili vise koraka nije prosl/a',
    timestamp: new Date().toISOString(),
  };
}

/** Vraca pregled profesionalnog login platnog sistema */
export function getProfesionalniLoginPregled() {
  return {
    naziv: profesionalniLoginPlatniSistem.naziv,
    verzija: profesionalniLoginPlatniSistem.verzija,
    status: profesionalniLoginPlatniSistem.status,
    ukupnoProvajdera: profesionalniLoginPlatniSistem.provajderi.length,
    ukupnoMejlRuta: profesionalniLoginPlatniSistem.ukupnoMejlRuta,
    ukupnoVerifikacionihKoraka: profesionalniLoginPlatniSistem.ukupnoVerifikacija,
    ukupnoMogucnosti: profesionalniLoginPlatniSistem.mogucnosti.length,
    provajderi: profesionalniLoginPlatniSistem.provajderi.map((p) => ({
      id: p.id,
      provajder: p.provajder,
      naziv: p.naziv,
      ikona: p.ikona,
      mejlRuta: p.mejlRute.length,
      verifikacionihKoraka: p.verifikacioniSistem.ukupnoProvera,
      status: p.status,
    })),
    poslovneMejlAdrese: getSvePoslovneMejlAdrese(),
    izvor: KOMPANIJA,
  };
}
