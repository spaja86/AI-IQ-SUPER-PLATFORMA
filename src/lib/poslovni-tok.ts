// SpajaUltraOmegaCore -∞Ω+∞ — Poslovni Tok (Unified Business Flow)
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven kanonski poslovni tok koji spaja:
//   - Enterprise ugovore (pending → kontaktiran → potpisano)
//   - B2B nabavku (upit → ponuda → pregovori → odobrenje → placanje → isporuka → preuzeto)
// Canonical lifecycle: lead → kontaktiran → ponuda → ugovor → uplata → isporuka → zatvoreno

import { APP_VERSION } from '@/lib/constants';

// ── Kanonski status ────────────────────────────────────────────────────────

export type PoslovniTokStatus =
  | 'lead'
  | 'kontaktiran'
  | 'ponuda'
  | 'ugovor'
  | 'uplata'
  | 'isporuka'
  | 'zatvoreno'
  | 'otkazano';

export type PoslovniTokTip = 'enterprise' | 'b2b';
export type PoslovniTokPrioritet = 'nizak' | 'srednji' | 'visok' | 'kritican';

// ── SLA ciljevi po statusu (u satima) ─────────────────────────────────────

export const SLA_CILJEVI_SATI: Record<PoslovniTokStatus, number> = {
  lead: 4,          // Vreme do prvog kontakta od prijema leada
  kontaktiran: 48,  // Vreme do ponude od kontakta
  ponuda: 72,       // Vreme do ugovora od ponude
  ugovor: 48,       // Vreme do potpisanog ugovora
  uplata: 24,       // Vreme do uplate od potpisanog ugovora
  isporuka: 72,     // Vreme do isporuke od uplate
  zatvoreno: 0,     // Finale — bez daljeg SLA
  otkazano: 0,
};

// ── Obavezni dokumenti po statusu ─────────────────────────────────────────

export const OBAVEZNI_DOKUMENTI: Record<PoslovniTokStatus, string[]> = {
  lead: [],
  kontaktiran: [],
  ponuda: ['inicijalni-kontakt-zapis'],
  ugovor: ['ponuda-dokument', 'predracun'],
  uplata: ['potpisani-ugovor', 'faktura'],
  isporuka: ['potvrda-uplate', 'potvrda-logistike'],
  zatvoreno: ['zapisnik-primopredaje', 'potpisani-ugovor', 'potvrda-uplate'],
  otkazano: [],
};

// ── Status tranzicije ──────────────────────────────────────────────────────

export const STATUS_TRANZICIJE: Record<PoslovniTokStatus, PoslovniTokStatus[]> = {
  lead: ['kontaktiran', 'otkazano'],
  kontaktiran: ['ponuda', 'otkazano'],
  ponuda: ['ugovor', 'otkazano'],
  ugovor: ['uplata', 'otkazano'],
  uplata: ['isporuka', 'otkazano'],
  isporuka: ['zatvoreno', 'otkazano'],
  zatvoreno: [],
  otkazano: [],
};

// ── Interfejsi ────────────────────────────────────────────────────────────

export interface PoslovniDokument {
  kljuc: string;
  naziv: string;
  status: 'nedostaje' | 'primljeno' | 'verifikovano';
  verifikovao: string | null;
  blockchainTxHash: string | null;
  updatedAt: string;
}

export interface SlaFaza {
  status: PoslovniTokStatus;
  ulaznAt: string | null;
  ciljSati: number;
  protekloSati: number | null;
  prekoracen: boolean;
  napomena: string | null;
}

export interface BlockchainDokaz {
  txHash: string;
  mreza: 'polygon-mainnet' | 'polygon-amoy-testnet';
  chainId: 137 | 80002;
  dogadjaj: string;
  timestamp: string;
  adresaUgovora: string | null;
}

export interface KontaktKomunikacija {
  kanal: 'kontakt_forma' | 'email' | 'poziv' | 'sastanak';
  kontaktOsoba: string | null;
  napomena: string | null;
  kreatedAt: string;
  fallbackRazlog: string | null;
}

export interface PoslovniTokSlucaj {
  id: string;
  tip: PoslovniTokTip;
  status: PoslovniTokStatus;
  prioritet: PoslovniTokPrioritet;
  naziv: string;
  vlasnik: string;
  kontaktEmail: string;
  dokumentacija: PoslovniDokument[];
  komunikacija: KontaktKomunikacija[];
  slaFaze: SlaFaza[];
  blockchain: BlockchainDokaz | null;
  baza: {
    enterpriseSourcingId: string | null;
    b2bProcurementId: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KpiPodaci {
  ukupnoSlucajeva: number;
  zatvorenih: number;
  otkazanih: number;
  aktivnih: number;
  stopaZatvaranja: number;   // %
  prosecnoVremeUgovoraSati: number | null;
  prosecnoVremeIsporukeSati: number | null;
  slucajeviSaKompletanimDokumentima: number;
  procenatKompletnihDokumenata: number;  // %
  slucajeviSaBlockchainTragom: number;
  procenatBlockchainTraga: number;       // %
  slaPrekoracenih: number;
  slaUTolernaciji: number;
  kpiOcena: number;          // 0-100
}

export interface SlaIzvestaj {
  slucajId: string;
  tip: PoslovniTokTip;
  naziv: string;
  status: PoslovniTokStatus;
  prekoracenihFaza: number;
  kriticneFaze: SlaFaza[];
  ukupnoProtekloSati: number | null;
  eskalacioniNivo: 1 | 2 | 3;
}

// ── Pomoćne funkcije ──────────────────────────────────────────────────────

function izracunajProtekloSati(odIso: string): number {
  const od = new Date(odIso).getTime();
  const sada = Date.now();
  return Math.max(0, (sada - od) / 3600_000);
}

export function kreirajSlaFaze(
  statusTimestamps: Partial<Record<PoslovniTokStatus, string>>,
  trenutniStatus: PoslovniTokStatus,
): SlaFaza[] {
  const redosled: PoslovniTokStatus[] = [
    'lead', 'kontaktiran', 'ponuda', 'ugovor', 'uplata', 'isporuka', 'zatvoreno',
  ];
  return redosled.map((status) => {
    const ulaznAt = statusTimestamps[status] ?? null;
    const ciljSati = SLA_CILJEVI_SATI[status];
    const protekloSati = ulaznAt ? izracunajProtekloSati(ulaznAt) : null;
    const prekoracen =
      ulaznAt !== null &&
      protekloSati !== null &&
      ciljSati > 0 &&
      protekloSati > ciljSati &&
      status === trenutniStatus;
    return {
      status,
      ulaznAt,
      ciljSati,
      protekloSati,
      prekoracen,
      napomena: prekoracen
        ? `SLA prekoračen za ${Math.round(protekloSati! - ciljSati)} sati`
        : null,
    };
  });
}

export function proveraDocumentGate(
  dokumentacija: PoslovniDokument[],
  sledeciFaza: PoslovniTokStatus,
): { ok: boolean; nedostaje: string[] } {
  const potrebni = OBAVEZNI_DOKUMENTI[sledeciFaza];
  const nedostaje: string[] = [];
  for (const kljuc of potrebni) {
    const doc = dokumentacija.find((d) => d.kljuc === kljuc);
    if (!doc || doc.status !== 'verifikovano') {
      nedostaje.push(kljuc);
    }
  }
  return { ok: nedostaje.length === 0, nedostaje };
}

export function mozeTransicija(
  slucaj: PoslovniTokSlucaj,
  sledeciFaza: PoslovniTokStatus,
): { ok: boolean; razlog?: string } {
  const dozvoljeni = STATUS_TRANZICIJE[slucaj.status];
  if (!dozvoljeni.includes(sledeciFaza)) {
    return { ok: false, razlog: `Nedozvoljen prelaz iz ${slucaj.status} u ${sledeciFaza}.` };
  }
  const docGate = proveraDocumentGate(slucaj.dokumentacija, sledeciFaza);
  if (!docGate.ok) {
    return {
      ok: false,
      razlog: `Nedostaju verifikovani dokumenti za prelaz u ${sledeciFaza}: ${docGate.nedostaje.join(', ')}`,
    };
  }
  return { ok: true };
}

export function izracunajKpi(slucajevi: PoslovniTokSlucaj[]): KpiPodaci {
  const ukupno = slucajevi.length;
  if (ukupno === 0) {
    return {
      ukupnoSlucajeva: 0,
      zatvorenih: 0,
      otkazanih: 0,
      aktivnih: 0,
      stopaZatvaranja: 0,
      prosecnoVremeUgovoraSati: null,
      prosecnoVremeIsporukeSati: null,
      slucajeviSaKompletanimDokumentima: 0,
      procenatKompletnihDokumenata: 0,
      slucajeviSaBlockchainTragom: 0,
      procenatBlockchainTraga: 0,
      slaPrekoracenih: 0,
      slaUTolernaciji: 0,
      kpiOcena: 0,
    };
  }

  const zatvoreni = slucajevi.filter((s) => s.status === 'zatvoreno');
  const otkazani = slucajevi.filter((s) => s.status === 'otkazano');
  const aktivni = slucajevi.filter((s) => s.status !== 'zatvoreno' && s.status !== 'otkazano');

  const stopaZatvaranja = Math.round((zatvoreni.length / ukupno) * 100);

  // Prosečno vreme do ugovora (faze lead → ugovor)
  const vremenaDo = zatvoreni
    .map((s) => {
      const leadFaza = s.slaFaze.find((f) => f.status === 'lead' && f.ulaznAt);
      const ugovorFaza = s.slaFaze.find((f) => f.status === 'ugovor' && f.ulaznAt);
      if (!leadFaza?.ulaznAt || !ugovorFaza?.ulaznAt) return null;
      return (new Date(ugovorFaza.ulaznAt).getTime() - new Date(leadFaza.ulaznAt).getTime()) / 3600_000;
    })
    .filter((v): v is number => v !== null);

  const prosecnoVremeUgovoraSati =
    vremenaDo.length > 0 ? Math.round(vremenaDo.reduce((a, b) => a + b, 0) / vremenaDo.length) : null;

  // Prosečno vreme do isporuke (uplata → isporuka)
  const vremenIsporuke = zatvoreni
    .map((s) => {
      const uplataFaza = s.slaFaze.find((f) => f.status === 'uplata' && f.ulaznAt);
      const isporukaFaza = s.slaFaze.find((f) => f.status === 'isporuka' && f.ulaznAt);
      if (!uplataFaza?.ulaznAt || !isporukaFaza?.ulaznAt) return null;
      return (new Date(isporukaFaza.ulaznAt).getTime() - new Date(uplataFaza.ulaznAt).getTime()) / 3600_000;
    })
    .filter((v): v is number => v !== null);

  const prosecnoVremeIsporukeSati =
    vremenIsporuke.length > 0
      ? Math.round(vremenIsporuke.reduce((a, b) => a + b, 0) / vremenIsporuke.length)
      : null;

  // Kompletna dokumentacija — svi obavezni dokumenti za zatvorene slučajeve
  const slucajeviSaKompletanimDokumentima = zatvoreni.filter((s) => {
    const potrebni = OBAVEZNI_DOKUMENTI.zatvoreno;
    return potrebni.every((kljuc) =>
      s.dokumentacija.some((d) => d.kljuc === kljuc && d.status === 'verifikovano'),
    );
  }).length;
  const procenatKompletnihDokumenata =
    zatvoreni.length > 0
      ? Math.round((slucajeviSaKompletanimDokumentima / zatvoreni.length) * 100)
      : 0;

  // Blockchain trag
  const slucajeviSaBlockchainTragom = slucajevi.filter((s) => s.blockchain !== null).length;
  const procenatBlockchainTraga = Math.round((slucajeviSaBlockchainTragom / ukupno) * 100);

  // SLA
  const slaPrekoracenih = aktivni.filter((s) => s.slaFaze.some((f) => f.prekoracen)).length;
  const slaUTolernaciji = aktivni.length - slaPrekoracenih;

  // KPI ocena (0-100) — ponderisana metrika
  const kpiOcena = Math.round(
    stopaZatvaranja * 0.35 +
      procenatKompletnihDokumenata * 0.30 +
      procenatBlockchainTraga * 0.15 +
      (ukupno > 0 ? ((ukupno - slaPrekoracenih) / ukupno) * 100 * 0.20 : 0),
  );

  return {
    ukupnoSlucajeva: ukupno,
    zatvorenih: zatvoreni.length,
    otkazanih: otkazani.length,
    aktivnih: aktivni.length,
    stopaZatvaranja,
    prosecnoVremeUgovoraSati,
    prosecnoVremeIsporukeSati,
    slucajeviSaKompletanimDokumentima,
    procenatKompletnihDokumenata,
    slucajeviSaBlockchainTragom,
    procenatBlockchainTraga,
    slaPrekoracenih,
    slaUTolernaciji,
    kpiOcena,
  };
}

export function izracunajSlaIzvestaj(slucaj: PoslovniTokSlucaj): SlaIzvestaj {
  const kriticneFaze = slucaj.slaFaze.filter((f) => f.prekoracen);
  const prekoracenihFaza = kriticneFaze.length;
  const leadFaza = slucaj.slaFaze.find((f) => f.status === 'lead');
  const ukupnoProtekloSati = leadFaza?.ulaznAt ? izracunajProtekloSati(leadFaza.ulaznAt) : null;

  let eskalacioniNivo: 1 | 2 | 3 = 1;
  if (prekoracenihFaza >= 2 || slucaj.prioritet === 'kritican') eskalacioniNivo = 3;
  else if (prekoracenihFaza === 1 || slucaj.prioritet === 'visok') eskalacioniNivo = 2;

  return {
    slucajId: slucaj.id,
    tip: slucaj.tip,
    naziv: slucaj.naziv,
    status: slucaj.status,
    prekoracenihFaza,
    kriticneFaze,
    ukupnoProtekloSati,
    eskalacioniNivo,
  };
}

// ── Demo/fallback slučajevi ──────────────────────────────────────────────

const now = new Date().toISOString();

export const demoSlucajevi: PoslovniTokSlucaj[] = [
  {
    id: 'ptok-ent-vercel-001',
    tip: 'enterprise',
    status: 'kontaktiran',
    prioritet: 'visok',
    naziv: 'Vercel Enterprise Ugovor — Digitalna Industrija',
    vlasnik: 'Poslovni kontakt',
    kontaktEmail: 'sales@spaja.rs',
    dokumentacija: [
      { kljuc: 'inicijalni-kontakt-zapis', naziv: 'Inicijalni kontakt zapis', status: 'verifikovano', verifikovao: 'sales@spaja.rs', blockchainTxHash: null, updatedAt: now },
    ],
    komunikacija: [
      { kanal: 'kontakt_forma', kontaktOsoba: 'Vercel Sales', napomena: 'Zahtev podnet via https://vercel.com/contact/sales', kreatedAt: now, fallbackRazlog: null },
    ],
    slaFaze: kreirajSlaFaze({ lead: now, kontaktiran: now }, 'kontaktiran'),
    blockchain: null,
    baza: { enterpriseSourcingId: 'vercel', b2bProcurementId: null },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'ptok-b2b-lux-001',
    tip: 'b2b',
    status: 'ugovor',
    prioritet: 'kritican',
    naziv: 'B2B Nabavka — Lamborghini FULL OPREMA',
    vlasnik: 'Nikola Spajić',
    kontaktEmail: 'sales@spaja.rs',
    dokumentacija: [
      { kljuc: 'inicijalni-kontakt-zapis', naziv: 'Inicijalni kontakt zapis', status: 'verifikovano', verifikovao: 'sales@spaja.rs', blockchainTxHash: null, updatedAt: now },
      { kljuc: 'ponuda-dokument', naziv: 'Ponuda od dilera', status: 'verifikovano', verifikovao: 'billing@spaja.rs', blockchainTxHash: null, updatedAt: now },
      { kljuc: 'predracun', naziv: 'Predračun', status: 'primljeno', verifikovao: null, blockchainTxHash: null, updatedAt: now },
    ],
    komunikacija: [
      { kanal: 'email', kontaktOsoba: 'Luksuzni auto partner', napomena: 'Upit poslan via sales@spaja.rs', kreatedAt: now, fallbackRazlog: null },
    ],
    slaFaze: kreirajSlaFaze({ lead: now, kontaktiran: now, ponuda: now, ugovor: now }, 'ugovor'),
    blockchain: null,
    baza: { enterpriseSourcingId: null, b2bProcurementId: 'b2b-proc-001' },
    createdAt: now,
    updatedAt: now,
  },
];

export function getPoslovniTokMeta() {
  return {
    naziv: 'Poslovni Tok — Unified Business Flow',
    verzija: APP_VERSION,
    opis: 'Jedinstven kanonski poslovni tok koji spaja enterprise ugovore i B2B nabavku sa SLA praćenjem, document gate-ovima, blockchain verifikacijom i KPI dashboard-om.',
    canonicalLifecycle: ['lead', 'kontaktiran', 'ponuda', 'ugovor', 'uplata', 'isporuka', 'zatvoreno'],
    tipoviTokova: ['enterprise', 'b2b'],
    slaTargeti: SLA_CILJEVI_SATI,
    documentGateovi: OBAVEZNI_DOKUMENTI,
    kpiKomponente: [
      'stopa zatvaranja slučajeva',
      'prosečno vreme do ugovora',
      'prosečno vreme do isporuke',
      'procenat kompletne dokumentacije',
      'procenat blockchain traga',
      'SLA prekoračenja',
    ],
    blockchainMreza: 'Polygon Mainnet (chainId: 137)',
    napomena:
      'Prelaz u sledeći status je blokiran dok svi obavezni dokumenti za tu fazu nisu verifikovani. Blockchain verifikacija se koristi za enterprise i B2B visokovredne slučajeve.',
  };
}
