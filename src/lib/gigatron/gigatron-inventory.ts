/**
 * 📊 GIGATRON Inventory — AI IQ SUPER PLATFORMA
 *
 * Upravljanje zalihama u realnom vremenu — dostupnost, rezervacije, sync.
 * Integriše se sa katalogom i it-proizvodi rutom.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import { gigatronKatalog, type GigatronProizvod, type GigatronDostupnost } from './gigatron-catalog';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export interface InventoryZapis {
  proizvodId: string;
  sku: string;
  naziv: string;
  kategorija: string;
  brand: string;
  kolicinaNaStanju: number;
  rezervisano: number;
  dostupno: number;
  dostupnost: GigatronDostupnost;
  poslednjaAzuriranje: string;
}

export interface InventoryRezervacija {
  id: string;
  proizvodId: string;
  kolicina: number;
  narudzbinaId?: string;
  kreirano: string;
  istice: string;
}

export interface InventoryAlert {
  tip: 'niske-zalihe' | 'nema-zaliha' | 'prekoracenje-rezervacija';
  proizvodId: string;
  sku: string;
  naziv: string;
  poruka: string;
  kolicinaNaStanju: number;
  prag: number;
}

export const NIZKE_ZALIHE_PRAG = 5;
export const REZERVACIJA_TRAJANJE_MIN = 30;

// ─── In-memory inventory store ────────────────────────────────────────────────

const inventoryStore = new Map<string, InventoryZapis>();
const rezervacijeStore = new Map<string, InventoryRezervacija>();

function initInventory(): void {
  for (const p of gigatronKatalog) {
    if (!inventoryStore.has(p.id)) {
      inventoryStore.set(p.id, {
        proizvodId: p.id,
        sku: p.sku,
        naziv: p.naziv,
        kategorija: p.kategorija,
        brand: p.brand,
        kolicinaNaStanju: p.kolicinaNaStanju,
        rezervisano: 0,
        dostupno: p.kolicinaNaStanju,
        dostupnost: p.dostupnost,
        poslednjaAzuriranje: new Date().toISOString(),
      });
    }
  }
}

// Inicijalizuj pri učitavanju
initInventory();

// ─── Helper ───────────────────────────────────────────────────────────────────

function odredjiDostupnost(kolicina: number): GigatronDostupnost {
  if (kolicina <= 0) return 'nije-dostupno';
  if (kolicina <= NIZKE_ZALIHE_PRAG) return 'ogranicene-zalihe';
  return 'na-stanju';
}

function generisiRezId(): string {
  return `rez-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Inventory API ────────────────────────────────────────────────────────────

export function getInventorySve(): InventoryZapis[] {
  return Array.from(inventoryStore.values());
}

export function getInventoryPoProizvodu(proizvodId: string): InventoryZapis | null {
  return inventoryStore.get(proizvodId) ?? null;
}

export function syncInventorySaKatalogom(katalog: GigatronProizvod[]): void {
  for (const p of katalog) {
    const zapis = inventoryStore.get(p.id);
    const rezervisano = zapis?.rezervisano ?? 0;
    const dostupno = Math.max(0, p.kolicinaNaStanju - rezervisano);
    inventoryStore.set(p.id, {
      proizvodId: p.id,
      sku: p.sku,
      naziv: p.naziv,
      kategorija: p.kategorija,
      brand: p.brand,
      kolicinaNaStanju: p.kolicinaNaStanju,
      rezervisano,
      dostupno,
      dostupnost: odredjiDostupnost(dostupno),
      poslednjaAzuriranje: new Date().toISOString(),
    });
  }
}

export function rezervisiProizvod(
  proizvodId: string,
  kolicina: number,
  narudzbinaId?: string,
): { ok: boolean; rezervacijaId?: string; poruka?: string } {
  const zapis = inventoryStore.get(proizvodId);
  if (!zapis) {
    return { ok: false, poruka: `Proizvod '${proizvodId}' nije pronađen u inventoru.` };
  }
  if (zapis.dostupno < kolicina) {
    return {
      ok: false,
      poruka: `Nedovoljne zalihe za '${zapis.naziv}'. Dostupno: ${zapis.dostupno}, Traženo: ${kolicina}.`,
    };
  }

  const sada = new Date();
  const istice = new Date(sada.getTime() + REZERVACIJA_TRAJANJE_MIN * 60 * 1000);

  const rezervacija: InventoryRezervacija = {
    id: generisiRezId(),
    proizvodId,
    kolicina,
    narudzbinaId,
    kreirano: sada.toISOString(),
    istice: istice.toISOString(),
  };

  rezervacijeStore.set(rezervacija.id, rezervacija);

  const novoRezervisano = zapis.rezervisano + kolicina;
  const novoDostupno = Math.max(0, zapis.kolicinaNaStanju - novoRezervisano);
  inventoryStore.set(proizvodId, {
    ...zapis,
    rezervisano: novoRezervisano,
    dostupno: novoDostupno,
    dostupnost: odredjiDostupnost(novoDostupno),
    poslednjaAzuriranje: sada.toISOString(),
  });

  return { ok: true, rezervacijaId: rezervacija.id };
}

export function otkaziRezervaciju(rezervacijaId: string): boolean {
  const rez = rezervacijeStore.get(rezervacijaId);
  if (!rez) return false;

  const zapis = inventoryStore.get(rez.proizvodId);
  if (zapis) {
    const novoRezervisano = Math.max(0, zapis.rezervisano - rez.kolicina);
    const novoDostupno = Math.max(0, zapis.kolicinaNaStanju - novoRezervisano);
    inventoryStore.set(rez.proizvodId, {
      ...zapis,
      rezervisano: novoRezervisano,
      dostupno: novoDostupno,
      dostupnost: odredjiDostupnost(novoDostupno),
      poslednjaAzuriranje: new Date().toISOString(),
    });
  }

  rezervacijeStore.delete(rezervacijaId);
  return true;
}

export function getInventoryAlerti(): InventoryAlert[] {
  const alerti: InventoryAlert[] = [];

  for (const zapis of inventoryStore.values()) {
    if (zapis.dostupno <= 0) {
      alerti.push({
        tip: 'nema-zaliha',
        proizvodId: zapis.proizvodId,
        sku: zapis.sku,
        naziv: zapis.naziv,
        poruka: `Proizvod '${zapis.naziv}' nema zaliha. Dostupno: ${zapis.dostupno}.`,
        kolicinaNaStanju: zapis.kolicinaNaStanju,
        prag: 0,
      });
    } else if (zapis.dostupno <= NIZKE_ZALIHE_PRAG) {
      alerti.push({
        tip: 'niske-zalihe',
        proizvodId: zapis.proizvodId,
        sku: zapis.sku,
        naziv: zapis.naziv,
        poruka: `Niske zalihe za '${zapis.naziv}'. Dostupno: ${zapis.dostupno} (prag: ${NIZKE_ZALIHE_PRAG}).`,
        kolicinaNaStanju: zapis.kolicinaNaStanju,
        prag: NIZKE_ZALIHE_PRAG,
      });
    }
  }

  return alerti;
}

export function getInventoryMetrike() {
  const svi = getInventorySve();
  const naStanju = svi.filter((z) => z.dostupnost === 'na-stanju').length;
  const ogranicene = svi.filter((z) => z.dostupnost === 'ogranicene-zalihe').length;
  const nisuDostupni = svi.filter((z) => z.dostupnost === 'nije-dostupno').length;
  const ukupnoDostupno = svi.reduce((s, z) => s + z.dostupno, 0);
  const ukupnoRezervisano = svi.reduce((s, z) => s + z.rezervisano, 0);

  return {
    ukupnoProizvoda: svi.length,
    naStanju,
    ograniceneZalihe: ogranicene,
    nisuDostupni,
    ukupnoDostupno,
    ukupnoRezervisano,
    brRezervacija: rezervacijeStore.size,
    timestamp: new Date().toISOString(),
  };
}
