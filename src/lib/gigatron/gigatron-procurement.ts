/**
 * 📦 GIGATRON Procurement — AI IQ SUPER PLATFORMA
 *
 * B2B nabavni domenski model — narudžbine, dobavljači, ugovori.
 * Pokriva puni lifecycle B2B procurement narudžbina za Kompanija SPAJA.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import type { GigatronProizvod } from './gigatron-catalog';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type NarudzbinaStatus =
  | 'kreirana'
  | 'potvrdjeno'
  | 'u-obradi'
  | 'isporuceno'
  | 'otkazano'
  | 'povrat';

export type NarudzbinaUrgentnost = 'standardna' | 'ekspres' | 'hitna';

export interface NarudzbinaStavka {
  proizvodId: string;
  sku: string;
  naziv: string;
  kolicina: number;
  cenaPoKomEUR: number;
  ukupnoCenaEUR: number;
}

export interface NarudzbinaAdresa {
  kompanija: string;
  ulica: string;
  grad: string;
  postanskiBroj: string;
  drzava: string;
  kontaktOsoba: string;
  telefon: string;
}

export interface GigatronNarudzbina {
  id: string;
  broj: string;
  status: NarudzbinaStatus;
  urgentnost: NarudzbinaUrgentnost;
  stavke: NarudzbinaStavka[];
  adresaIsporuke: NarudzbinaAdresa;
  /** Ukupna vrednost bez PDV-a u EUR */
  ukupnoEUR: number;
  /** PDV 20% */
  pdvEUR: number;
  /** Ukupno sa PDV-om u EUR */
  ukupnoSaPdvEUR: number;
  napomena?: string;
  kreirano: string;
  azurirano: string;
  /** Procenjeni datum isporuke (ISO date) */
  procenjenaIsporuka?: string;
}

export interface KreirajNarudzbuInput {
  stavke: Array<{ proizvodId: string; kolicina: number }>;
  adresaIsporuke: NarudzbinaAdresa;
  urgentnost?: NarudzbinaUrgentnost;
  napomena?: string;
}

export interface NarudzbinaGreskaValidacije {
  polje: string;
  poruka: string;
}

export interface KreirajNarudzbuRezultat {
  ok: boolean;
  narudzbina?: GigatronNarudzbina;
  greske?: NarudzbinaGreskaValidacije[];
}

export const PDV_STOPA = 0.20;
export const MIN_B2B_KOLICINA = 1;
export const MAX_B2B_KOLICINA = 500;
export const MAX_STAVKI_PO_NARUDZBINI = 50;

// ─── In-memory store (zamena za DB u production-u) ────────────────────────────

const narudzbineStore = new Map<string, GigatronNarudzbina>();
let narudzbinaCounter = 1000;

// ─── Helper Funkcije ──────────────────────────────────────────────────────────

function generisiBrojNarudzbine(): string {
  narudzbinaCounter++;
  return `GTR-B2B-${new Date().getFullYear()}-${String(narudzbinaCounter).padStart(6, '0')}`;
}

function generisiId(): string {
  return `narudzbina-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function procenjenaIsporukaDatum(urgentnost: NarudzbinaUrgentnost): string {
  const danas = new Date();
  const dani = urgentnost === 'hitna' ? 1 : urgentnost === 'ekspres' ? 2 : 5;
  danas.setDate(danas.getDate() + dani);
  return danas.toISOString().split('T')[0]!;
}

// ─── Validacija ───────────────────────────────────────────────────────────────

export function validirajNarudzbu(
  input: KreirajNarudzbuInput,
  katalog: GigatronProizvod[],
): NarudzbinaGreskaValidacije[] {
  const greske: NarudzbinaGreskaValidacije[] = [];

  if (!input.stavke || input.stavke.length === 0) {
    greske.push({ polje: 'stavke', poruka: 'Narudžbina mora imati barem jednu stavku.' });
    return greske;
  }

  if (input.stavke.length > MAX_STAVKI_PO_NARUDZBINI) {
    greske.push({ polje: 'stavke', poruka: `Maksimalan broj stavki po narudžbini je ${MAX_STAVKI_PO_NARUDZBINI}.` });
  }

  for (const stavka of input.stavke) {
    const proizvod = katalog.find((p) => p.id === stavka.proizvodId);
    if (!proizvod) {
      greske.push({ polje: 'stavke', poruka: `Proizvod sa ID '${stavka.proizvodId}' nije pronađen.` });
      continue;
    }
    if (proizvod.status !== 'aktivan') {
      greske.push({ polje: 'stavke', poruka: `Proizvod '${proizvod.naziv}' nije dostupan za narudžbu.` });
    }
    if (stavka.kolicina < MIN_B2B_KOLICINA || stavka.kolicina > MAX_B2B_KOLICINA) {
      greske.push({
        polje: 'stavke',
        poruka: `Količina za '${proizvod.naziv}' mora biti između ${MIN_B2B_KOLICINA} i ${MAX_B2B_KOLICINA}.`,
      });
    }
    if (
      proizvod.dostupnost !== 'na-stanju' &&
      proizvod.dostupnost !== 'ogranicene-zalihe' &&
      proizvod.dostupnost !== 'na-narudzbu'
    ) {
      greske.push({ polje: 'stavke', poruka: `Proizvod '${proizvod.naziv}' nije dostupan za narudžbu.` });
    }
    if (
      (proizvod.dostupnost === 'ogranicene-zalihe' || proizvod.dostupnost === 'na-stanju') &&
      stavka.kolicina > proizvod.kolicinaNaStanju
    ) {
      greske.push({
        polje: 'stavke',
        poruka: `Tražena količina (${stavka.kolicina}) za '${proizvod.naziv}' prevazilazi zalihe (${proizvod.kolicinaNaStanju}).`,
      });
    }
  }

  const adresa = input.adresaIsporuke;
  if (!adresa) {
    greske.push({ polje: 'adresaIsporuke', poruka: 'Adresa isporuke je obavezna.' });
  } else {
    if (!adresa.kompanija?.trim()) greske.push({ polje: 'adresaIsporuke.kompanija', poruka: 'Naziv kompanije je obavezan.' });
    if (!adresa.ulica?.trim()) greske.push({ polje: 'adresaIsporuke.ulica', poruka: 'Ulica je obavezna.' });
    if (!adresa.grad?.trim()) greske.push({ polje: 'adresaIsporuke.grad', poruka: 'Grad je obavezan.' });
    if (!adresa.drzava?.trim()) greske.push({ polje: 'adresaIsporuke.drzava', poruka: 'Država je obavezna.' });
  }

  return greske;
}

// ─── Kreiranje Narudžbine ─────────────────────────────────────────────────────

export function kreirajNarudzbu(
  input: KreirajNarudzbuInput,
  katalog: GigatronProizvod[],
): KreirajNarudzbuRezultat {
  const greske = validirajNarudzbu(input, katalog);
  if (greske.length > 0) {
    return { ok: false, greske };
  }

  const stavke: NarudzbinaStavka[] = input.stavke.map((s) => {
    const proizvod = katalog.find((p) => p.id === s.proizvodId)!;
    return {
      proizvodId: s.proizvodId,
      sku: proizvod.sku,
      naziv: proizvod.naziv,
      kolicina: s.kolicina,
      cenaPoKomEUR: proizvod.cenaEUR,
      ukupnoCenaEUR: proizvod.cenaEUR * s.kolicina,
    };
  });

  const ukupnoEUR = stavke.reduce((s, st) => s + st.ukupnoCenaEUR, 0);
  const pdvEUR = Math.round(ukupnoEUR * PDV_STOPA * 100) / 100;
  const ukupnoSaPdvEUR = Math.round((ukupnoEUR + pdvEUR) * 100) / 100;
  const urgentnost = input.urgentnost ?? 'standardna';
  const sada = new Date().toISOString();

  const narudzbina: GigatronNarudzbina = {
    id: generisiId(),
    broj: generisiBrojNarudzbine(),
    status: 'kreirana',
    urgentnost,
    stavke,
    adresaIsporuke: input.adresaIsporuke,
    ukupnoEUR,
    pdvEUR,
    ukupnoSaPdvEUR,
    napomena: input.napomena,
    kreirano: sada,
    azurirano: sada,
    procenjenaIsporuka: procenjenaIsporukaDatum(urgentnost),
  };

  narudzbineStore.set(narudzbina.id, narudzbina);
  return { ok: true, narudzbina };
}

// ─── Dohvatanje Narudžbine ────────────────────────────────────────────────────

export function getNarudzbinaById(id: string): GigatronNarudzbina | null {
  return narudzbineStore.get(id) ?? null;
}

export function getSveNarudzbine(): GigatronNarudzbina[] {
  return Array.from(narudzbineStore.values());
}

export function getNarudzbinePoStatusu(status: NarudzbinaStatus): GigatronNarudzbina[] {
  return Array.from(narudzbineStore.values()).filter((n) => n.status === status);
}

export function azurirajStatusNarudzbine(
  id: string,
  status: NarudzbinaStatus,
): GigatronNarudzbina | null {
  const narudzbina = narudzbineStore.get(id);
  if (!narudzbina) return null;
  const azurirana = { ...narudzbina, status, azurirano: new Date().toISOString() };
  narudzbineStore.set(id, azurirana);
  return azurirana;
}
