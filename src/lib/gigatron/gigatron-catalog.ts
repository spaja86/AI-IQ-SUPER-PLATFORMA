/**
 * 🛒 GIGATRON Katalog — AI IQ SUPER PLATFORMA
 *
 * Katalog IT/elektronike proizvoda za B2B procurement i affiliate program.
 * Kategorije, brand-ovi, SKU upravljanje i cenovni model.
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type GigatronKategorija =
  | 'laptopovi'
  | 'desktop-racunari'
  | 'mobilni-telefoni'
  | 'tableti'
  | 'monitori'
  | 'stampaci'
  | 'mreza-i-komunikacije'
  | 'komponente'
  | 'periferni-uredjaji'
  | 'gaming-oprema'
  | 'kucni-uredjaji'
  | 'audio-video'
  | 'foto-video';

export type GigatronBrand =
  | 'Apple'
  | 'Samsung'
  | 'Dell'
  | 'HP'
  | 'Lenovo'
  | 'Asus'
  | 'Acer'
  | 'MSI'
  | 'LG'
  | 'Sony'
  | 'Philips'
  | 'Canon'
  | 'Logitech'
  | 'Razer'
  | 'SteelSeries'
  | 'TP-Link'
  | 'Cisco'
  | 'Western Digital'
  | 'Kingston'
  | 'Corsair';

export type GigatronDostupnost = 'na-stanju' | 'ogranicene-zalihe' | 'na-narudzbu' | 'nije-dostupno';

export type GigatronStatus = 'aktivan' | 'povucen' | 'planiran';

export interface GigatronProizvod {
  id: string;
  sku: string;
  naziv: string;
  opis: string;
  kategorija: GigatronKategorija;
  brand: GigatronBrand;
  /** Cena u EUR bez PDV-a */
  cenaEUR: number;
  /** Cena u RSD bez PDV-a */
  cenaRSD: number;
  dostupnost: GigatronDostupnost;
  kolicinaNaStanju: number;
  /** Affiliate provizija u % */
  affiliateProvizijaPct: number;
  status: GigatronStatus;
  tehnickeKarakteristike: Record<string, string>;
  ikona: string;
}

export interface GigatronKatalogFilteri {
  kategorija?: GigatronKategorija;
  brand?: GigatronBrand;
  minCenaEUR?: number;
  maxCenaEUR?: number;
  dostupnost?: GigatronDostupnost;
  pretraga?: string;
}

export interface GigatronKatalogRezultat {
  ukupno: number;
  stranica: number;
  ukupnoStranica: number;
  proizvodi: GigatronProizvod[];
}

// ─── Katalog Proizvoda ────────────────────────────────────────────────────────

export const gigatronKatalog: GigatronProizvod[] = [
  {
    id: 'gtron-001',
    sku: 'APPLE-MBP-M3-14',
    naziv: 'Apple MacBook Pro 14" M3',
    opis: 'Profesionalni laptop sa Apple M3 čipom, 16GB RAM, 512GB SSD — idealan za razvoj i dizajn',
    kategorija: 'laptopovi',
    brand: 'Apple',
    cenaEUR: 1999,
    cenaRSD: 234000,
    dostupnost: 'na-stanju',
    kolicinaNaStanju: 8,
    affiliateProvizijaPct: 2.5,
    status: 'aktivan',
    tehnickeKarakteristike: {
      procesor: 'Apple M3',
      ram: '16GB',
      skladistenje: '512GB SSD',
      ekran: '14.2" Liquid Retina XDR',
      os: 'macOS Sonoma',
    },
    ikona: '💻',
  },
  {
    id: 'gtron-002',
    sku: 'LENOVO-THINKPAD-X1C',
    naziv: 'Lenovo ThinkPad X1 Carbon Gen 12',
    opis: 'Ultrabook poslovne klase — Intel Core Ultra 7, 16GB LPDDR5, 512GB SSD, 14" IPS',
    kategorija: 'laptopovi',
    brand: 'Lenovo',
    cenaEUR: 1499,
    cenaRSD: 175500,
    dostupnost: 'na-stanju',
    kolicinaNaStanju: 15,
    affiliateProvizijaPct: 3.0,
    status: 'aktivan',
    tehnickeKarakteristike: {
      procesor: 'Intel Core Ultra 7 155U',
      ram: '16GB LPDDR5',
      skladistenje: '512GB NVMe SSD',
      ekran: '14" IPS 1920×1200',
      os: 'Windows 11 Pro',
    },
    ikona: '💻',
  },
  {
    id: 'gtron-003',
    sku: 'SAMSUNG-S24U',
    naziv: 'Samsung Galaxy S24 Ultra 256GB',
    opis: 'Flagship Android telefon sa S Pen, 200MP kamerom i AI mogućnostima',
    kategorija: 'mobilni-telefoni',
    brand: 'Samsung',
    cenaEUR: 1299,
    cenaRSD: 152200,
    dostupnost: 'na-stanju',
    kolicinaNaStanju: 22,
    affiliateProvizijaPct: 3.5,
    status: 'aktivan',
    tehnickeKarakteristike: {
      procesor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      skladistenje: '256GB',
      ekran: '6.8" QHD+ Dynamic AMOLED 2X',
      kamera: '200MP + 50MP + 12MP + 10MP',
    },
    ikona: '📱',
  },
  {
    id: 'gtron-004',
    sku: 'DELL-U2724D',
    naziv: 'Dell UltraSharp 27" 4K Monitor U2724D',
    opis: 'Profesionalni 4K IPS monitor za grafički dizajn i poslovnu upotrebu',
    kategorija: 'monitori',
    brand: 'Dell',
    cenaEUR: 699,
    cenaRSD: 81900,
    dostupnost: 'na-stanju',
    kolicinaNaStanju: 10,
    affiliateProvizijaPct: 4.0,
    status: 'aktivan',
    tehnickeKarakteristike: {
      rezolucija: '3840×2160 (4K UHD)',
      panel: 'IPS',
      dijagonala: '27"',
      osvetljenost: '400 cd/m²',
      konektivnost: 'HDMI 2.0, DP 1.4, USB-C 90W',
    },
    ikona: '🖥️',
  },
  {
    id: 'gtron-005',
    sku: 'ASUS-ROG-STRIX-G16',
    naziv: 'ASUS ROG Strix G16 Gaming Laptop',
    opis: 'Gaming laptop sa Intel Core i9, RTX 4070, 32GB RAM — za zahtevne igre i kreativni rad',
    kategorija: 'gaming-oprema',
    brand: 'Asus',
    cenaEUR: 1799,
    cenaRSD: 210800,
    dostupnost: 'ogranicene-zalihe',
    kolicinaNaStanju: 4,
    affiliateProvizijaPct: 3.0,
    status: 'aktivan',
    tehnickeKarakteristike: {
      procesor: 'Intel Core i9-14900HX',
      gpu: 'NVIDIA RTX 4070 8GB',
      ram: '32GB DDR5',
      skladistenje: '1TB NVMe SSD',
      ekran: '16" QHD+ 240Hz',
    },
    ikona: '🎮',
  },
  {
    id: 'gtron-006',
    sku: 'TPLINK-ARCHER-AX90',
    naziv: 'TP-Link Archer AX90 Wi-Fi 6 Router',
    opis: 'Tri-band Wi-Fi 6 router za poslovne mreže — do 6600Mbps, 8 antene',
    kategorija: 'mreza-i-komunikacije',
    brand: 'TP-Link',
    cenaEUR: 249,
    cenaRSD: 29200,
    dostupnost: 'na-stanju',
    kolicinaNaStanju: 30,
    affiliateProvizijaPct: 5.0,
    status: 'aktivan',
    tehnickeKarakteristike: {
      standard: 'Wi-Fi 6 (802.11ax)',
      frekvencija: 'Tri-band (2.4GHz + 5GHz + 5GHz)',
      brzina: 'do 6600 Mbps',
      portovi: '1× 2.5G WAN + 4× Gigabit LAN + 1× USB 3.0',
      antene: '8× eksterne',
    },
    ikona: '📡',
  },
  {
    id: 'gtron-007',
    sku: 'WD-MY-CLOUD-EX2',
    naziv: 'Western Digital My Cloud EX2 Ultra 8TB NAS',
    opis: 'Mrežni storage za male i srednje poslovne potrebe — RAID podrška, remote pristup',
    kategorija: 'komponente',
    brand: 'Western Digital',
    cenaEUR: 399,
    cenaRSD: 46800,
    dostupnost: 'na-narudzbu',
    kolicinaNaStanju: 0,
    affiliateProvizijaPct: 4.5,
    status: 'aktivan',
    tehnickeKarakteristike: {
      kapacitet: '8TB (2×4TB)',
      interfejs: 'Ethernet Gigabit',
      raid: 'RAID 0/1',
      portovi: '2× USB 3.0',
      os: 'My Cloud OS 5',
    },
    ikona: '💾',
  },
  {
    id: 'gtron-008',
    sku: 'LOGITECH-MX-MASTER-3S',
    naziv: 'Logitech MX Master 3S Miš',
    opis: 'Ergonomski profesionalni miš sa 8000 DPI, tihi klikovi i MagSpeed scroll točkić',
    kategorija: 'periferni-uredjaji',
    brand: 'Logitech',
    cenaEUR: 99,
    cenaRSD: 11600,
    dostupnost: 'na-stanju',
    kolicinaNaStanju: 50,
    affiliateProvizijaPct: 6.0,
    status: 'aktivan',
    tehnickeKarakteristike: {
      senzor: 'Darkfield 8000 DPI',
      baterija: 'do 70 dana',
      konekcija: 'Bluetooth + USB Logi Bolt',
      ergonomija: 'Desnoručni dizajn',
    },
    ikona: '🖱️',
  },
  {
    id: 'gtron-009',
    sku: 'HP-LASERJET-PRO-MFP',
    naziv: 'HP LaserJet Pro MFP M428fdw',
    opis: 'Poslovni multifunkcijski laser štampač — print/scan/copy/fax, Wi-Fi, duplex',
    kategorija: 'stampaci',
    brand: 'HP',
    cenaEUR: 399,
    cenaRSD: 46800,
    dostupnost: 'na-stanju',
    kolicinaNaStanju: 12,
    affiliateProvizijaPct: 4.0,
    status: 'aktivan',
    tehnickeKarakteristike: {
      tip: 'Laser MFP (print/copy/scan/fax)',
      brzina: '38 str/min',
      rezolucija: '1200×1200 dpi',
      konekcija: 'Wi-Fi, Ethernet, USB, NFC',
      duplex: 'Automatski dvostrani ispis',
    },
    ikona: '🖨️',
  },
  {
    id: 'gtron-010',
    sku: 'CORSAIR-DDR5-32GB',
    naziv: 'Corsair Vengeance DDR5 32GB (2×16GB) 5600MHz',
    opis: 'High-performance DDR5 RAM za radne stanice i gaming sisteme',
    kategorija: 'komponente',
    brand: 'Corsair',
    cenaEUR: 149,
    cenaRSD: 17500,
    dostupnost: 'na-stanju',
    kolicinaNaStanju: 35,
    affiliateProvizijaPct: 5.5,
    status: 'aktivan',
    tehnickeKarakteristike: {
      kapacitet: '32GB (2×16GB)',
      tip: 'DDR5',
      brzina: '5600MHz',
      cas: 'CL36',
      napon: '1.25V',
    },
    ikona: '🧩',
  },
];

// ─── Helper Funkcije ──────────────────────────────────────────────────────────

export function getGigatronKatalog(
  filteri: GigatronKatalogFilteri = {},
  stranica = 1,
  poStranici = 10,
): GigatronKatalogRezultat {
  let rezultat = gigatronKatalog.filter((p) => p.status === 'aktivan');

  if (filteri.kategorija) {
    rezultat = rezultat.filter((p) => p.kategorija === filteri.kategorija);
  }
  if (filteri.brand) {
    rezultat = rezultat.filter((p) => p.brand === filteri.brand);
  }
  if (filteri.minCenaEUR !== undefined) {
    rezultat = rezultat.filter((p) => p.cenaEUR >= filteri.minCenaEUR!);
  }
  if (filteri.maxCenaEUR !== undefined) {
    rezultat = rezultat.filter((p) => p.cenaEUR <= filteri.maxCenaEUR!);
  }
  if (filteri.dostupnost) {
    rezultat = rezultat.filter((p) => p.dostupnost === filteri.dostupnost);
  }
  if (filteri.pretraga) {
    const q = filteri.pretraga.toLowerCase();
    rezultat = rezultat.filter(
      (p) =>
        p.naziv.toLowerCase().includes(q) ||
        p.opis.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    );
  }

  const ukupno = rezultat.length;
  const ukupnoStranica = Math.max(1, Math.ceil(ukupno / poStranici));
  const odakle = (stranica - 1) * poStranici;
  const proizvodi = rezultat.slice(odakle, odakle + poStranici);

  return { ukupno, stranica, ukupnoStranica, proizvodi };
}

export function getGigatronProizvodById(id: string): GigatronProizvod | null {
  return gigatronKatalog.find((p) => p.id === id) ?? null;
}

export function getGigatronProizvodBySku(sku: string): GigatronProizvod | null {
  return gigatronKatalog.find((p) => p.sku === sku) ?? null;
}

export function getGigatronKategorije(): GigatronKategorija[] {
  const kat = new Set(gigatronKatalog.map((p) => p.kategorija));
  return Array.from(kat);
}

export function getGigatronBrandovi(): GigatronBrand[] {
  const brendovi = new Set(gigatronKatalog.map((p) => p.brand));
  return Array.from(brendovi);
}

export function getGigatronKatalogMetrike() {
  const aktivni = gigatronKatalog.filter((p) => p.status === 'aktivan');
  const naStanju = aktivni.filter((p) => p.dostupnost === 'na-stanju').length;
  const ukupnoKolicina = aktivni.reduce((s, p) => s + p.kolicinaNaStanju, 0);
  const prosecnaCenaEUR = aktivni.length > 0
    ? Math.round(aktivni.reduce((s, p) => s + p.cenaEUR, 0) / aktivni.length)
    : 0;

  return {
    ukupnoProizvoda: gigatronKatalog.length,
    aktivnih: aktivni.length,
    naStanju,
    ukupnoKolicina,
    prosecnaCenaEUR,
    kategorija: getGigatronKategorije().length,
    brendovi: getGigatronBrandovi().length,
  };
}
