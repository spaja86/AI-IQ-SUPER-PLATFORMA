/**
 * 🤝 GIGATRON Affiliate — AI IQ SUPER PLATFORMA
 *
 * Affiliate / partner komisija logika — provizije, tracking događaja, isplate.
 * Kompanija SPAJA koristi affiliate program za distribuciju IT proizvoda.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type AffiliateEventTip =
  | 'klik'
  | 'pregled-proizvoda'
  | 'dodavanje-u-korpu'
  | 'kupovina'
  | 'povrat';

export type AffiliateIsplataStatus = 'na-cekanju' | 'odobrena' | 'isplacena' | 'otkazana';

export interface AffiliatePartner {
  id: string;
  naziv: string;
  email: string;
  /** Bazna provizija u % — može biti overriden po proizvodu */
  baznaProvizijaPct: number;
  aktivan: boolean;
  kreirano: string;
}

export interface AffiliateEvent {
  id: string;
  partnerId: string;
  tip: AffiliateEventTip;
  proizvodId: string;
  sku: string;
  /** Vrednost konverzije u EUR (0 za klikove) */
  vrednostEUR: number;
  /** Provizija u EUR (0 za ne-kupovine) */
  provizija: number;
  /** Provizija % iskorišćena za ovu transakciju */
  provizijaPct: number;
  sessionId?: string;
  timestamp: string;
  metapodaci?: Record<string, string>;
}

export interface AffiliateStat {
  partnerId: string;
  naziv: string;
  ukupnoKlikova: number;
  ukupnoKupovina: number;
  ukupnoVrednostEUR: number;
  ukupnoProvizija: number;
  konverzijskaStopa: number;
}

export interface AffiliateIsplata {
  id: string;
  partnerId: string;
  period: string;
  ukupnoProvizija: number;
  status: AffiliateIsplataStatus;
  kreirano: string;
  isplaceno?: string;
}

export interface TrackAffiliateInput {
  partnerId: string;
  tip: AffiliateEventTip;
  proizvodId: string;
  sku: string;
  vrednostEUR?: number;
  provizijaPct?: number;
  sessionId?: string;
  metapodaci?: Record<string, string>;
}

export interface TrackAffiliateRezultat {
  ok: boolean;
  event?: AffiliateEvent;
  poruka?: string;
}

export const MIN_ISPLATA_EUR = 10;
export const DEFAULT_PROVIZIJA_PCT = 3.0;

// ─── In-memory store ──────────────────────────────────────────────────────────

const eventiStore: AffiliateEvent[] = [];
const partneriStore = new Map<string, AffiliatePartner>();

// Demo partner
partneriStore.set('partner-spaja-001', {
  id: 'partner-spaja-001',
  naziv: 'Kompanija SPAJA — Digitalna Industrija',
  email: 'affiliate@spaja.dev',
  baznaProvizijaPct: DEFAULT_PROVIZIJA_PCT,
  aktivan: true,
  kreirano: '2026-01-01T00:00:00.000Z',
});

// ─── Helper Funkcije ──────────────────────────────────────────────────────────

function generisiEventId(): string {
  return `aff-evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function izracunajProviziju(vrednostEUR: number, provizijaPct: number): number {
  if (vrednostEUR <= 0 || provizijaPct <= 0) return 0;
  return Math.round(vrednostEUR * (provizijaPct / 100) * 100) / 100;
}

// ─── Tracking ─────────────────────────────────────────────────────────────────

export function trackAffiliateEvent(input: TrackAffiliateInput): TrackAffiliateRezultat {
  const partner = partneriStore.get(input.partnerId);
  if (!partner) {
    return { ok: false, poruka: `Partner '${input.partnerId}' nije pronađen.` };
  }
  if (!partner.aktivan) {
    return { ok: false, poruka: `Partner '${input.partnerId}' nije aktivan.` };
  }
  if (!input.proizvodId?.trim() || !input.sku?.trim()) {
    return { ok: false, poruka: 'ID proizvoda i SKU su obavezni.' };
  }

  const imaKupovinu = input.tip === 'kupovina';
  const vrednostEUR = imaKupovinu ? (input.vrednostEUR ?? 0) : 0;
  const provizijaPct = input.provizijaPct ?? partner.baznaProvizijaPct;
  const provizija = imaKupovinu ? izracunajProviziju(vrednostEUR, provizijaPct) : 0;

  const event: AffiliateEvent = {
    id: generisiEventId(),
    partnerId: input.partnerId,
    tip: input.tip,
    proizvodId: input.proizvodId,
    sku: input.sku,
    vrednostEUR,
    provizija,
    provizijaPct,
    sessionId: input.sessionId,
    timestamp: new Date().toISOString(),
    metapodaci: input.metapodaci,
  };

  eventiStore.push(event);
  return { ok: true, event };
}

// ─── Statistike ───────────────────────────────────────────────────────────────

export function getAffiliateStat(partnerId: string): AffiliateStat | null {
  const partner = partneriStore.get(partnerId);
  if (!partner) return null;

  const eventiPartnera = eventiStore.filter((e) => e.partnerId === partnerId);
  const klikovi = eventiPartnera.filter((e) => e.tip === 'klik').length;
  const kupovine = eventiPartnera.filter((e) => e.tip === 'kupovina');
  const ukupnoVrednostEUR = kupovine.reduce((s, e) => s + e.vrednostEUR, 0);
  const ukupnoProvizija = kupovine.reduce((s, e) => s + e.provizija, 0);
  const konverzijskaStopa = klikovi > 0 ? Math.round((kupovine.length / klikovi) * 10000) / 100 : 0;

  return {
    partnerId,
    naziv: partner.naziv,
    ukupnoKlikova: klikovi,
    ukupnoKupovina: kupovine.length,
    ukupnoVrednostEUR: Math.round(ukupnoVrednostEUR * 100) / 100,
    ukupnoProvizija: Math.round(ukupnoProvizija * 100) / 100,
    konverzijskaStopa,
  };
}

export function getAllAffiliateStatovi(): AffiliateStat[] {
  return Array.from(partneriStore.keys())
    .map((id) => getAffiliateStat(id))
    .filter((s): s is AffiliateStat => s !== null);
}

export function getAffiliateEventi(partnerId?: string): AffiliateEvent[] {
  if (partnerId) {
    return eventiStore.filter((e) => e.partnerId === partnerId);
  }
  return [...eventiStore];
}

export function getAffiliatePartner(partnerId: string): AffiliatePartner | null {
  return partneriStore.get(partnerId) ?? null;
}

export function registrujPartnera(partner: Omit<AffiliatePartner, 'kreirano'>): AffiliatePartner {
  const novi: AffiliatePartner = { ...partner, kreirano: new Date().toISOString() };
  partneriStore.set(novi.id, novi);
  return novi;
}

/**
 * Izračunava ukupnu proviziju za period (YYYY-MM) za datog partnera.
 */
export function izracunajMesecnuProviziju(partnerId: string, period: string): number {
  return eventiStore
    .filter(
      (e) =>
        e.partnerId === partnerId &&
        e.tip === 'kupovina' &&
        e.timestamp.startsWith(period),
    )
    .reduce((s, e) => s + e.provizija, 0);
}
