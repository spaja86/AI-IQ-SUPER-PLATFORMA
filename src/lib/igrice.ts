/**
 * 🎮 IGRICE — Sistem Igara vezan za Dimenzije
 *
 * SpajaUltraOmegaCore -∞Ω+∞ programski jezik
 *
 * Svaka igrica je vezana za dimenzionalni sistem (360D–5760D).
 * Prilikom pokretanja igrice, sistem pita igrača koju dimenziju želi (D).
 * Izabrana dimenzija određuje:
 *   - Geometrijske slojeve (elipsoid, rezonanca, hiperbola, spirala)
 *   - Zakone manifestacije koji važe u tom dimenzionalnom prostoru
 *   - Vizuelni prikaz (unutrašnji ili spoljašnji sa 3D naočarima)
 *   - Snagu renderovanja i kompleksnost okruženja
 *
 * Dimenzije: 360D, 720D, 1440D, 2880D, 5760D
 * Cirkularne formule: oduzimanje gornje i donje strane = različite dimenzije
 */

import type { DimenzijaNivo, Dimenzija, GeometrijskaForma, ManifestacioniZakon } from './dimenzije';
import { dimenzije, getFormePoDimenziji, getZakoniPoDimenziji } from './dimenzije';

// ─── Tipovi igrica ──────────────────────────────────────────────────

export type KategorijaIgrice =
  | 'akcija'
  | 'avantura'
  | 'logicka'
  | 'simulacija'
  | 'strategija';

export type StatusIgrice = 'aktivna' | 'beta' | 'razvoj' | 'planirana';

export interface DimenzionalniRezim {
  nivo: DimenzijaNivo;
  naziv: string;
  opis: string;
  geometrijskiSlojevi: string[];
  zakoni: string[];
  snagaRenderovanja: string;
  vizuelniPrikaz: 'unutrasnji' | 'spoljasnji-3d';
}

export interface Igrica {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: KategorijaIgrice;
  podrzaneDimenzije: DimenzijaNivo[];
  podrazumevanaDimenzija: DimenzijaNivo;
  dimenzionalniRezimi: DimenzionalniRezim[];
  funkcije: string[];
  status: StatusIgrice;
}

export interface IgricaSesija {
  igricaId: string;
  izabranaDimenzija: DimenzijaNivo;
  dimenzija: Dimenzija;
  forme: GeometrijskaForma[];
  zakoni: ManifestacioniZakon[];
  vremePokretanja: string;
}

export interface IgriceSistem {
  naziv: string;
  opis: string;
  igrice: Igrica[];
  podrzaneDimenzije: DimenzijaNivo[];
  pitaDimenzijuPriPokretanju: boolean;
  ukupnoIgrica: number;
}

// ─── Generisanje dimenzionalnih režima za igricu ────────────────────

function kreirajDimenzionalneRezime(podrzaneDim: DimenzijaNivo[]): DimenzionalniRezim[] {
  return podrzaneDim.map((nivo) => {
    const dim = dimenzije.find((d) => d.nivo === nivo);
    if (!dim) {
      return {
        nivo,
        naziv: `${nivo} Režim`,
        opis: `Dimenzionalni režim ${nivo}`,
        geometrijskiSlojevi: [],
        zakoni: [],
        snagaRenderovanja: 'nepoznata',
        vizuelniPrikaz: 'unutrasnji' as const,
      };
    }
    const forme = getFormePoDimenziji(nivo);
    const zakoni = getZakoniPoDimenziji(nivo);
    return {
      nivo,
      naziv: `${nivo} — ${dim.naziv.split(' — ')[1] || dim.naziv}`,
      opis: `Igraj u ${nivo} dimenziji: ${dim.geometrijskiSlojevi.length} geometrijskih slojeva, ${zakoni.length} zakona manifestacije, snaga ${dim.snaga}`,
      geometrijskiSlojevi: forme.map((f) => f.naziv),
      zakoni: zakoni.map((z) => z.naziv),
      snagaRenderovanja: dim.snaga,
      vizuelniPrikaz: dim.tip === 'spoljasnja' ? 'spoljasnji-3d' as const : 'unutrasnji' as const,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════
// IGRICE
// ═══════════════════════════════════════════════════════════════════

const sveDimenzije: DimenzijaNivo[] = ['360D', '720D', '1440D', '2880D', '5760D'];

export const igrice: Igrica[] = [
  {
    id: 'igrica-omega-lavirint',
    naziv: 'Omega Lavirint',
    opis: 'Navigiraj kroz dimenzionalni lavirint generisan cirkularnim formulama. Elipsoidne zidove, rezonantne prolaze i hiperboličke portale — sve se menja prema izabranoj dimenziji (D). U 5760D lavirint se reprodukuje sa punim vizuelnim efektima.',
    ikona: '🌀',
    kategorija: 'avantura',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni lavirint generisan formulama',
      'Elipsoidni zidovi i rezonantni prolazi',
      'Hiperbolički portali između nivoa',
      'Spiralni koridor u višim dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
  },
  {
    id: 'igrica-spiralni-trke',
    naziv: 'Spiralne Trke',
    opis: 'Trke kroz spiralne staze u dimenzionalnom prostoru. Staze se formiraju prema spiralnim formulama — u 360D su bazične, u 5760D staze su heksa-deka-cirkularne sa punom reprodukcijom. Izaberi dimenziju (D) pre starta.',
    ikona: '🏎️',
    kategorija: 'akcija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Spiralne staze po dimenzionalnim formulama',
      'Rezonantni ubrzivači na stazi',
      'Hiperbolički skokovi između dimenzija',
      'Multi-dimenzionalni prikaz terena',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
  },
  {
    id: 'igrica-elipsoidni-slagalice',
    naziv: 'Elipsoidne Slagalice',
    opis: 'Logička igra sa elipsoidnim oblicima koji se uklapaju prema rezonantnim frekvencijama. Svaka dimenzija (D) donosi nove geometrijske slojeve i složenije slagalice. U višim dimenzijama zakoni manifestacije menjaju pravila igre.',
    ikona: '🧩',
    kategorija: 'logicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Elipsoidni oblici za slaganje',
      'Rezonantne frekvencije kao hint sistem',
      'Geometrijski slojevi po dimenzijama',
      'Zakoni manifestacije menjaju pravila',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
  },
  {
    id: 'igrica-dimenzionalni-graditelj',
    naziv: 'Dimenzionalni Graditelj',
    opis: 'Simulacija gradnje struktura u dimenzionalnom prostoru. Koristi Elipsoid, Rezonance, Hiperbole i Spirale kao građevinske blokove. Viša dimenzija (D) = više blokova, složenije formule, impresivnija gradnja.',
    ikona: '🏗️',
    kategorija: 'simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Geometrijske forme kao građevinski blokovi',
      'Elipsoid, Rezonanca, Hiperbola, Spirala blokovi',
      'Dimenzionalna fizika — snaga renderovanja po D',
      'Manifestacioni zakoni utiču na stabilnost',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
  },
  {
    id: 'igrica-omega-strategija',
    naziv: 'Omega Strategija',
    opis: 'Strateška igra na dimenzionalnoj mapi. Kontroliši teritorije definisane cirkularnim formulama. Svaka dimenzija (D) proširuje mapu — 360D je bazična, a 5760D pokriva celokupan heksa-deka-cirkularni prostor sa svim zakonima.',
    ikona: '🗺️',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalna mapa sa cirkularnim formulama',
      'Teritorije po geometrijskim slojevima',
      'Zakoni manifestacije kao strateški resursi',
      'Autorealizacija i Sinhonometrija u višim D',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
  },
];

// ═══════════════════════════════════════════════════════════════════
// SISTEM
// ═══════════════════════════════════════════════════════════════════

export const igriceSistem: IgriceSistem = {
  naziv: 'SpajaUltraOmegaCore Igrice — Dimenzionalni Gaming Sistem',
  opis: 'Sistem igara vezan za dimenzije (360D–5760D). Prilikom pokretanja svake igrice, sistem pita igrača koju dimenziju želi (D). Izabrana dimenzija određuje geometrijske slojeve, zakone manifestacije, vizuelni prikaz i snagu renderovanja. Spoljašnje dimenzije (1440D+) zahtevaju 3D naočare.',
  igrice,
  podrzaneDimenzije: sveDimenzije,
  pitaDimenzijuPriPokretanju: true,
  ukupnoIgrica: igrice.length,
};

// ─── Helper funkcije ────────────────────────────────────────────────

/** Pokreni igricu — kreira sesiju sa izabranom dimenzijom */
export function pokreniIgricu(igricaId: string, dimenzija: DimenzijaNivo): IgricaSesija | null {
  const igrica = igrice.find((i) => i.id === igricaId);
  if (!igrica) return null;
  if (!igrica.podrzaneDimenzije.includes(dimenzija)) return null;

  const dim = dimenzije.find((d) => d.nivo === dimenzija);
  if (!dim) return null;

  return {
    igricaId: igrica.id,
    izabranaDimenzija: dimenzija,
    dimenzija: dim,
    forme: getFormePoDimenziji(dimenzija),
    zakoni: getZakoniPoDimenziji(dimenzija),
    vremePokretanja: new Date().toISOString(),
  };
}

/** Vraća igrice po kategoriji */
export function getIgricePoKategoriji(kategorija: KategorijaIgrice): Igrica[] {
  return igrice.filter((i) => i.kategorija === kategorija);
}

/** Vraća igrice koje podržavaju datu dimenziju */
export function getIgricePoDimenziji(nivo: DimenzijaNivo): Igrica[] {
  return igrice.filter((i) => i.podrzaneDimenzije.includes(nivo));
}

/** Vraća dimenzionalni režim za igricu i dimenziju */
export function getDimenzionalniRezim(igricaId: string, nivo: DimenzijaNivo): DimenzionalniRezim | null {
  const igrica = igrice.find((i) => i.id === igricaId);
  if (!igrica) return null;
  return igrica.dimenzionalniRezimi.find((r) => r.nivo === nivo) ?? null;
}

/** Broj aktivnih igrica */
export function getBrojAktivnihIgrica(): number {
  return igrice.filter((i) => i.status === 'aktivna').length;
}

/** Sve kategorije igrica */
export function getSveKategorijeIgrica(): KategorijaIgrice[] {
  return [...new Set(igrice.map((i) => i.kategorija))];
}

/** Tekst za prikaz dimenzionalnog pitanja pri pokretanju */
export function getDimenzionalnoPitanje(igricaId: string): string {
  const igrica = igrice.find((i) => i.id === igricaId);
  if (!igrica) return '';
  const opcije = igrica.podrzaneDimenzije.join(' | ');
  return `🎮 ${igrica.naziv} — Koju dimenziju želiš (D)?\n\nIzaberi: ${opcije}\n\nPodrazumevano: ${igrica.podrazumevanaDimenzija}`;
}
