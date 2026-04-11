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
 * ZAHTEVI: Digitalni Kompjuter + Digitalni Brauzer su neophodni za pokretanje!
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
  | 'strategija'
  | 'edukativna'
  | 'kreativna'
  | 'arkadna'
  | 'rpg'
  | 'borbena'
  | 'muzicka'
  | 'horor'
  | 'sportska'
  | 'mmo'
  | 'trka'
  | 'detektivska'
  | 'zivotna-simulacija'
  | 'retro';

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
  /** IT proizvodi preporučeni za ovu igricu */
  preporuceniProizvodi: string[];
  /** Zahtevi — Digitalni Kompjuter i Digitalni Brauzer su obavezni */
  zahtevi: string[];
  /** Eksterni link ka repozitorijumu ili resursu igrice */
  link?: string;
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
  /** Digitalni Kompjuter + Digitalni Brauzer su neophodni za pokretanje */
  obavezniZahtevi: string[];
}

// ─── Obavezni zahtevi za sve igrice ────────────────────────────────

export const OBAVEZNI_ZAHTEVI = ['digitalni-kompjuter', 'digitalni-brauzer'];

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
// IGRICE — Preporuke prema IT proizvodima
// ═══════════════════════════════════════════════════════════════════

const sveDimenzije: DimenzijaNivo[] = ['360D', '720D', '1440D', '2880D', '5760D'];

export const igrice: Igrica[] = [
  // ─── Originalne igrice ────────────────────────────────────────
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
    preporuceniProizvodi: ['spaja-accelerator', 'omega-ai-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
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
    preporuceniProizvodi: ['spaja-accelerator', 'spaja-turbo'],
    zahtevi: OBAVEZNI_ZAHTEVI,
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
    preporuceniProizvodi: ['spaja-optimizer', 'omega-ai-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
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
    preporuceniProizvodi: ['spaja-turbo', 'spaja-optimizer', 'spaja-monitor'],
    zahtevi: OBAVEZNI_ZAHTEVI,
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
    preporuceniProizvodi: ['omega-ai-engine', 'spaja-data-sync', 'spaja-integrator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── NOVE IGRICE — Preporuke prema IT proizvodima ────────────
  {
    id: 'igrica-proksi-signal-lovac',
    naziv: 'Proksi Signal Lovac',
    opis: 'Lovi rezonantne, koncentrične i ekscentrične signale kroz Proksi mrežu u dimenzionalnom prostoru. Koristi SPAJA Monitor za praćenje signala i SPAJA Shield za zaštitu od lažnih signala. Dimenzija (D) određuje jačinu i broj signala.',
    ikona: '📡',
    kategorija: 'akcija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Proksi signal detekcija u dimenzijama',
      'Rezonantni, koncentrični, ekscentrični signali',
      'SPAJA Monitor prikaz jačine signala',
      'SPAJA Shield zaštita od lažnih signala',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-monitor', 'spaja-shield', 'spaja-metrics'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-spajapro-prompt-quest',
    naziv: 'SpajaPro Prompt Quest',
    opis: 'Edukativna avantura gde učiš SpajaPro Prompt sistem kroz dimenzionalne izazove. Svaka dimenzija (D) donosi nove kategorije promptova. Koristi SpajaPro Prompt Engine za generisanje zadataka i OMEGA AI Engine za evaluaciju.',
    ikona: '🌟',
    kategorija: 'edukativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SpajaPro Prompt izazovi po dimenzijama',
      'OMEGA AI evaluacija odgovora',
      '10 kategorija promptova za učenje',
      'Progresija kroz dimenzije kao nagrade',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spajapro-prompt-engine', 'omega-ai-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-firewall-odbrana',
    naziv: 'Firewall Odbrana',
    opis: 'Strateška odbrana od digitalnih pretnji u dimenzionalnom prostoru. Postavi SPAJA Firewall i SPAJA Shield na ključne pozicije. Viša dimenzija (D) = složeniji napadi. SPAJA Crypto za enkripciju odbrambenih pozicija.',
    ikona: '🔒',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA Firewall pozicioniranje u dimenzijama',
      'SPAJA Shield aktivacija i upravljanje',
      'SPAJA Crypto enkripcija zone',
      'AI detekcija pretnji sa OMEGA AI',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-firewall', 'spaja-shield', 'spaja-crypto'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-deploy-misija',
    naziv: 'Deploy Misija',
    opis: 'Simulacija deploy-a aplikacija kroz dimenzionalni prostor. Koristi SPAJA Deploy i SPAJA CI/CD za automatski deploy. Svaka dimenzija (D) dodaje nove servise i infrastrukturu. Cilj: deploy bez downtime-a u svakoj dimenziji.',
    ikona: '🚀',
    kategorija: 'simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA Deploy simulacija u dimenzijama',
      'SPAJA CI/CD pipeline upravljanje',
      'Zero-downtime izazov po dimenziji',
      'Preview environment kreiranje',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-deploy', 'spaja-cicd', 'spaja-monitor'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-data-sync-utrka',
    naziv: 'Data Sync Utrka',
    opis: 'Arkadna igra sinhronizacije podataka između dimenzija. Koristi SPAJA Data Sync za prenos i SPAJA Integrator za povezivanje. Brža sinhronizacija = više poena. Dimenzija (D) određuje količinu podataka i brzinu.',
    ikona: '📡',
    kategorija: 'arkadna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA Data Sync u realnom vremenu',
      'SPAJA Integrator za međudimenzionalno povezivanje',
      'Conflict resolution kao mini-igra',
      'Backup strategija bodovanje',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-data-sync', 'spaja-integrator', 'spaja-connector'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-api-gateway-masters',
    naziv: 'API Gateway Masters',
    opis: 'Strateška igra upravljanja API saobraćajem kroz dimenzije. Koristi SPAJA API Gateway za rutiranje i SPAJA Connector za povezivanje. Viša dimenzija (D) = više API endpoinata i složeniji saobraćaj.',
    ikona: '🌐',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA API Gateway upravljanje',
      'Rate limiting strategija po dimenziji',
      'Load balancing optimizacija',
      'SPAJA Connector integracija',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-api-gateway', 'spaja-connector', 'spaja-integrator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-ai-akademija',
    naziv: 'OMEGA AI Akademija',
    opis: 'Edukativna igra gde treniraš 21 OMEGA AI personu kroz dimenzionalne izazove. Svaka persona ima zadatke specifične za svoju ulogu (Arhitekta, Čuvar, Lekar...). Koristi OMEGA AI Engine i SpajaPro. Dimenzija (D) određuje težinu treninga.',
    ikona: '🧠',
    kategorija: 'edukativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '21 OMEGA AI persona za treniranje',
      'Uloge: Arhitekta, Čuvar, Lekar, Graditelj...',
      'OMEGA AI Engine evaluacija napretka',
      'SpajaPro Prompt za zadatke',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['omega-ai-engine', 'spajapro-prompt-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-turbo-optimizer',
    naziv: 'Turbo Optimizer',
    opis: 'Logička igra optimizacije koda i performansi u dimenzionalnom prostoru. Koristi SPAJA Turbo za ubrzanje i SPAJA Optimizer za smanjenje resursa. Svaka dimenzija (D) donosi kompleksnije optimizacione zadatke.',
    ikona: '⚡',
    kategorija: 'logicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA Turbo ubrzanje procesiranja',
      'SPAJA Optimizer resursi i bundle size',
      'Tree shaking i code splitting zadaci',
      'Parallel build optimizacija',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-turbo', 'spaja-optimizer', 'spaja-accelerator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-logger-detektiv',
    naziv: 'Logger Detektiv',
    opis: 'Avanturistička igra gde si detektiv koji analizira logove kroz dimenzije. Koristi SPAJA Logger za pretragu i SPAJA Metrics za analizu. Svaka dimenzija (D) sadrži nove slučajeve za rešavanje.',
    ikona: '🔍',
    kategorija: 'avantura',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA Logger analiza strukturiranih logova',
      'SPAJA Metrics KPI traganje',
      'Log aggregacija kao trag za rešenje',
      'Anomaly detection kao hint sistem',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-logger', 'spaja-metrics', 'spaja-monitor'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-messenger-arena',
    naziv: 'Messenger Arena',
    opis: 'Arkadna igra slanja poruka kroz dimenzionalne kanale. Koristi SPAJA Messenger za komunikaciju i SPAJA Connector za međudimenzionalno povezivanje. Brže slanje = veći skor. Dimenzija (D) određuje broj kanala.',
    ikona: '💬',
    kategorija: 'arkadna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA Messenger kanali po dimenzijama',
      'Real-time poruke između dimenzija',
      'Notifikacioni izazovi u vremenu',
      'SPAJA Connector multi-dimenzionalni mostovi',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-messenger', 'spaja-connector'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-kripto-lavirint',
    naziv: 'Kripto Lavirint',
    opis: 'Logička igra enkripcije i dekripcije kroz dimenzionalni lavirint. Koristi SPAJA Crypto za šifrovanje prolaza i SPAJA Shield za zaštitu. Svaka dimenzija (D) dodaje nove kriptografske algoritme i teže šifre.',
    ikona: '🔐',
    kategorija: 'logicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA Crypto E2E enkripcija puteva',
      'Digitalni potpisi kao ključevi',
      'Key management slagalice',
      'SPAJA Shield kriptografska zaštita',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-crypto', 'spaja-shield', 'spaja-firewall'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-mobilna-mreza-pilot',
    naziv: 'Mobilna Mreža Pilot',
    opis: 'Simulacija upravljanja SPAJA Mobilnom Mrežom u dimenzionalnom prostoru. Upravljaj 4 centrale, 5 servisa (Glas HD, Podaci Turbo, Stream, IoT Mesh, Enterprise Link). Dimenzija (D) određuje mrežni kapacitet.',
    ikona: '📱',
    kategorija: 'simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '4 centrale: +38177, +38188, +38178, +38187',
      '5 servisa mobilne mreže',
      'Proksi integracija za signal',
      'Dimenzionalni kapacitet upravljanje',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-monitor', 'spaja-integrator', 'spaja-data-sync'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-umetnik',
    naziv: 'Dimenzionalni Umetnik',
    opis: 'Kreativna igra crtanja i animacije u dimenzionalnom prostoru. Koristi Elipsoid, Rezonance, Hiperbole i Spirale kao alate za crtanje. U 5760D reprodukuje slike, animacije i video. Dimenzija (D) određuje paletu alata.',
    ikona: '🎨',
    kategorija: 'kreativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Elipsoid, Rezonanca, Hiperbola, Spirala olovke',
      'Dimenzionalno platno 360D–5760D',
      'Reprodukcija slika i animacija u 5760D',
      'Geometrijski slojevi kao stilovi',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-accelerator', 'spaja-turbo', 'spaja-optimizer'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-accelerator-rally',
    naziv: 'Accelerator Rally',
    opis: 'Akciona igra ubrzanja kroz dimenzionalne tunele. Koristi SPAJA Accelerator za CDN boost, Edge caching za prečice i Lazy loading za dinamično učitavanje staze. Svaka dimenzija (D) ubrzava trku eksponencijalno.',
    ikona: '💨',
    kategorija: 'akcija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA Accelerator CDN tuneli',
      'Edge caching prečice',
      'Lazy loading dinamična staza',
      'Eksponencijalno ubrzanje po dimenziji',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-accelerator', 'spaja-turbo'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-ecosystem-tycoon',
    naziv: 'Ekosistem Tycoon',
    opis: 'Strateška igra građenja digitalnog ekosistema kroz dimenzije. Upravljaj platformama, AI personama, Proksi mrežom i mobilnom mrežom. Svaka dimenzija (D) otvara nove platforme i servise za upravljanje.',
    ikona: '🌍',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '5760D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '11 platformi za upravljanje',
      '21 OMEGA AI persona za delegiranje',
      'Proksi mreža i mobilna mreža integracija',
      'IT proizvodi kao nadogradnje',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-integrator', 'spaja-api-gateway', 'omega-ai-engine', 'spaja-deploy'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ═══════════════════════════════════════════════════════════════════
  // GAMING INDUSTRIJA — Masovne preporuke igrica
  // ═══════════════════════════════════════════════════════════════════

  // ─── RPG igrice ──────────────────────────────────────────────────
  {
    id: 'igrica-omega-rpg-saga',
    naziv: 'Omega RPG Saga',
    opis: 'Epska RPG avantura kroz sve dimenzije (360D–5760D). Kreiraj heroja, biraj klasu baziranu na geometrijskim formama (Elipsoid Vitez, Rezonantni Mag, Hiperbolički Strijelac, Spiralni Monah). AI NPC-ovi sa OMEGA AI dialogom. Svaka dimenzija je novi kontinent sa unikатним questovima.',
    ikona: '⚔️',
    kategorija: 'rpg',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '4 klase: Elipsoid Vitez, Rezonantni Mag, Hiperbolički Strijelac, Spiralni Monah',
      '5 dimenzionalnih kontinenata sa questovima',
      'OMEGA AI NPC dijalozi i questovi',
      'Skill tree po geometrijskim slojevima',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-ai-npc', 'omega-ai-engine', 'spaja-level-generator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-dungeon-crawler',
    naziv: 'Dimenzionalni Dungeon Crawler',
    opis: 'Proceduralno generisani tamnice kroz dimenzije. Svaka dimenzija (D) generiše nove tipove tamnica koristeći cirkularne formule. Loot sistem baziran na geometrijskim formama — Elipsoidni oklopi, Rezonantni štitovi, Hiperbolički mačevi, Spiralni štapovi.',
    ikona: '🏰',
    kategorija: 'rpg',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Proceduralno generisane tamnice po D',
      'Loot: Elipsoidni, Rezonantni, Hiperbolički, Spiralni predmeti',
      'Boss fight u svakoj dimenziji',
      'Co-op multiplayer do 4 igrača',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-level-generator', 'spaja-multiplayer-server', 'spaja-physics-engine', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-open-world',
    naziv: 'Omega Open World',
    opis: 'Otvoreni svet koji se prostire kroz 5 dimenzija. Svaka dimenzija je zaseban region sa sopstvenom klimom, florom i faunom baziranom na geometrijskim zakonima. Slobodna eksploracija, craftanje, građenje baza. VR režim za spoljašnje dimenzije.',
    ikona: '🌎',
    kategorija: 'rpg',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '5 dimenzionalnih regiona za eksploraciju',
      'Craftanje sa geometrijskim materijalima',
      'Građenje baza u svim dimenzijama',
      'VR režim za 1440D+ dimenzije',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-vr-ar-engine', 'spaja-physics-engine', 'spaja-ai-npc', 'spaja-level-generator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Battle Royale / PvP ─────────────────────────────────────────
  {
    id: 'igrica-omega-battle-royale',
    naziv: 'Omega Battle Royale',
    opis: '100 igrača se bore u dimenzionalnoj areni koja se smanjuje kroz dimenzije. Počinje u 5760D — sa svakim krugom dimenzija pada (5760D → 2880D → 1440D → 720D → 360D). Poslednji preživeli u 360D pobeđuje. Cross-dimenzionalni loot.',
    ikona: '🏆',
    kategorija: 'borbena',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '5760D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '100 igrača multiplayer battle royale',
      'Arena se smanjuje kroz dimenzije: 5760D → 360D',
      'Cross-dimenzionalni loot sistem',
      'Anti-cheat dimenzionalna zaštita',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-anti-cheat', 'spaja-game-engine', 'spaja-physics-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalna-arena',
    naziv: 'Dimenzionalna Arena',
    opis: 'MOBA-stil igra sa 5v5 timovima u dimenzionalnoj areni. Svaki heroj je baziran na geometrijskoj formi sa unikatnim sposobnostima. Lane-ovi se protežu kroz dimenzije. Dimenzija (D) određuje veličinu mape i kompleksnost.',
    ikona: '⚔️',
    kategorija: 'borbena',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '5v5 MOBA sa dimenzionalnim herojima',
      'Heroji: Elipsoid Tank, Rezonantni Support, Hiperbolički DPS, Spiralni Assassin',
      'Lane sistem kroz dimenzije',
      'Ranked matchmaking po dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-anti-cheat', 'spaja-game-analytics', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-fighter',
    naziv: 'Omega Fighter',
    opis: 'Fighting igra sa dimenzionalnim borcima. Svaki borac koristi jednu geometrijsku formu kao osnovu borbe. Elipsoidni udari, Rezonantni blokovi, Hiperbolički kontra-napadi, Spiralni specijalni potezi. Dimenzija (D) = brzina i snaga.',
    ikona: '🥊',
    kategorija: 'borbena',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Geometrijski borilački stilovi',
      'Elipsoidni, Rezonantni, Hiperbolički, Spiralni potezi',
      'Online PvP sa rangiranjem',
      'Turnir mod po dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-physics-engine', 'spaja-anti-cheat', 'spaja-streaming-platform'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Sandbox / Kreativne ─────────────────────────────────────────
  {
    id: 'igrica-dimenzionalni-sandbox',
    naziv: 'Dimenzionalni Sandbox',
    opis: 'Sandbox igra gde gradis i uništavaš u dimenzionalnom prostoru. Minecraft-stil ali sa dimenzijama — svaka dimenzija ima drugačije blokove, fiziku i pravila. Multiplayer sa prijateljima. Beskonačni proceduralni svetovi.',
    ikona: '🧱',
    kategorija: 'kreativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Beskonačni proceduralni svetovi po D',
      'Geometrijski blokovi: Elipsoid, Rezonanca, Hiperbola, Spirala',
      'Multiplayer gradnja i eksploracija',
      'Redstone-stil automatizacija sa cirkularnim formulama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-level-generator', 'spaja-multiplayer-server', 'spaja-physics-engine', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-kreator-studio',
    naziv: 'Omega Kreator Studio',
    opis: 'Kreativni studio za pravljenje sopstvenih dimenzionalnih igrica! Koristi SPAJA Game Engine vizuelno. Drag-and-drop level dizajn, skripting sa SpajaUltraOmegaCore jezikom, deljenje kreacija sa zajednicom.',
    ikona: '🎬',
    kategorija: 'kreativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Vizuelni game engine editor',
      'SpajaUltraOmegaCore skripting za igrice',
      'Drag-and-drop level dizajn',
      'Deljenje kreacija sa zajednicom',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-level-generator', 'spaja-physics-engine', 'spaja-audio-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Survival / Horror ───────────────────────────────────────────
  {
    id: 'igrica-dimenzionalni-survival',
    naziv: 'Dimenzionalni Survival',
    opis: 'Survival igra u neprijateljskim dimenzijama. Sakupljaj resurse, gradi sklonište, brani se od dimenzionalnih stvorenja. Svaka dimenzija ima drugačije pretnje — u 360D su blage, u 5760D su smrtonosne. Co-op do 4 igrača.',
    ikona: '🏕️',
    kategorija: 'avantura',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Sakupljanje resursa po dimenzijama',
      'Gradnja skloništa sa geometrijskim materijalima',
      'Dimenzionalna stvorenja (teža u višim D)',
      'Co-op multiplayer do 4 igrača',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-multiplayer-server', 'spaja-ai-npc', 'spaja-physics-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-horor',
    naziv: 'Omega Horor',
    opis: 'Horor igra u mračnim dimenzijama. Dimenzionalni prostor se izobličava — Elipsoidi se deformišu, Rezonance stvaraju jezive zvukove, Hiperbole otvaraju portale u nepoznato. U 5760D horor je najintenzivniji sa VR podrškom.',
    ikona: '👻',
    kategorija: 'horor',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalna deformacija prostora',
      'Rezonantni jezivi zvučni efekti',
      'Hiperbolički portali u nepoznato',
      'VR horor režim za 1440D+',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-audio-engine', 'spaja-vr-ar-engine', 'spaja-physics-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Racing / Sportske ───────────────────────────────────────────
  {
    id: 'igrica-omega-grand-prix',
    naziv: 'Omega Grand Prix',
    opis: 'Profesionalni racing simulator u dimenzionalnom prostoru. Staze se formiraju prema dimenzionalnim formulama — spiralne krivine, elipsoidne chicane, rezonantne ravnice. Viša dimenzija = brži automobili i složenije staze. Multiplayer trke.',
    ikona: '🏁',
    kategorija: 'sportska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Realistična fizika vožnje po dimenzijama',
      'Staze sa spiralnim krivinama i elipsoidnim chicane-ovima',
      'Multiplayer trke do 20 igrača',
      'Sezonski šampionat po dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-multiplayer-server', 'spaja-game-engine', 'spaja-streaming-platform'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-fudbal',
    naziv: 'Dimenzionalni Fudbal',
    opis: 'Fudbal u dimenzionalnom prostoru! Teren se menja prema dimenziji — u 360D je standardan, u 5760D je heksa-deka-cirkularni sa spiralnim golovima. Lopta prati elipsoidnu putanju. Online timovi 5v5.',
    ikona: '⚽',
    kategorija: 'sportska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni fudbalski teren po D',
      'Elipsoidna putanja lopte',
      'Spiralni golovi u višim dimenzijama',
      '5v5 online timovi',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-multiplayer-server', 'spaja-anti-cheat', 'spaja-game-analytics'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-olimpijada',
    naziv: 'Omega Olimpijada',
    opis: 'Dimenzionalne olimpijske igre sa 10+ disciplina. Atletika, plivanje, gimnastika — sve u dimenzionalnom prostoru. Svaka disciplina koristi drugačiju geometrijsku formu. Dimenzija (D) = težina i spektakularnost.',
    ikona: '🏅',
    kategorija: 'sportska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '10+ olimpijskih disciplina u dimenzijama',
      'Geometrijske forme za svaku disciplinu',
      'Multiplayer takmičenje',
      'Dimenzionalni rekord tabela',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-multiplayer-server', 'spaja-game-analytics', 'spaja-streaming-platform'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Tower Defense / Strategija ──────────────────────────────────
  {
    id: 'igrica-dimenzionalna-odbrana-kula',
    naziv: 'Dimenzionalna Odbrana Kula',
    opis: 'Tower defense sa dimenzionalnim kulama. Gradi kule bazirane na geometrijskim formama — Elipsoidne kule pucaju u krug, Rezonantne usporavaju, Hiperboličke probijaju štitove, Spiralne prave tornado. Dimenzija (D) = broj talasa neprijatelja.',
    ikona: '🏰',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '4 tipa kula: Elipsoidna, Rezonantna, Hiperbolička, Spiralna',
      'Dimenzionalni talasi neprijatelja',
      'Upgrade sistem po geometrijskim slojevima',
      'Boss talasi na kraju svake dimenzije',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-ai-npc', 'spaja-level-generator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-rts',
    naziv: 'Omega RTS',
    opis: 'Real-time strategija sa dimenzionalnim armijama. 4 frakcije bazirane na geometrijama. Elipsoid Imperija (odbrana), Rezonantni Savez (podrška), Hiperbolička Horda (napad), Spiralni Nomadi (brzina). Multiplayer do 8 igrača.',
    ikona: '🎖️',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '4 frakcije: Elipsoid, Rezonantni, Hiperbolički, Spiralni',
      'Baza izgradnja po dimenzijama',
      'Multiplayer RTS do 8 igrača',
      'AI protivnici sa OMEGA AI strategijom',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-ai-npc', 'spaja-multiplayer-server', 'spaja-game-analytics'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Puzzle / Platformer ─────────────────────────────────────────
  {
    id: 'igrica-omega-platformer',
    naziv: 'Omega Platformer',
    opis: 'Dimenzionalni platformer gde skačeš između geometrijskih platformi. Elipsoidne platforme se okreću, Rezonantne vibriraju, Hiperboličke se teleportuju, Spiralne se kreću po spirali. Svaka dimenzija dodaje nove mehanike skakanja.',
    ikona: '🦘',
    kategorija: 'akcija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Geometrijske platforme sa unikatnim ponašanjem',
      'Elipsoidne, Rezonantne, Hiperboličke, Spiralne platforme',
      'Speedrun mod sa dimenzionalnim tajmerima',
      'Level editor za zajednicu',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-physics-engine', 'spaja-level-generator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-puzzle-master',
    naziv: 'Omega Puzzle Master',
    opis: 'Napredna puzzle igra sa dimenzionalnim zagonetkama. Svaka dimenzija (D) uvodi nove zakone fizike koji menjaju kako se zagonetke rešavaju. U 5760D sve zagonetke se rešavaju istovremeno u svim dimenzijama — ultimativni izazov.',
    ikona: '🧠',
    kategorija: 'logicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalne zagonetke sa promenljivom fizikom',
      '100+ nivoa po dimenziji',
      'Multi-dimenzionalne zagonetke u 5760D',
      'Hint sistem sa OMEGA AI',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'omega-ai-engine', 'spaja-level-generator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Muzika / Ritam ──────────────────────────────────────────────
  {
    id: 'igrica-rezonantni-ritam',
    naziv: 'Rezonantni Ritam',
    opis: 'Ritam igra bazirana na dimenzionalnim rezonantnim frekvencijama! Svaka dimenzija (D) ima svoj zvučni spektar — od bazičnih ritmova u 360D do kompleksnih poliritam u 5760D. Geometrijski vizuali prate muziku.',
    ikona: '🎵',
    kategorija: 'muzicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Rezonantne frekvencije kao ritmovi',
      'Geometrijski vizuali sinhronizovani sa muzikom',
      'Dimenzionalni zvučni spektar po D',
      'Multiplayer ritam bitke',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-audio-engine', 'spaja-game-engine', 'spaja-multiplayer-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-spiralni-dj',
    naziv: 'Spiralni DJ',
    opis: 'Kreativna muzička igra gde miksaš zvukove koristeći spiralne formule. Svaka dimenzija (D) otključava nove instrumente i efekte. U 5760D si puni dimenzionalni DJ sa svim zvučnim slojevima i VR vizualima.',
    ikona: '🎧',
    kategorija: 'muzicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Spiralne formule za miksovanje zvuka',
      'Dimenzionalni instrumenti i efekti',
      'VR DJ kabina za 1440D+',
      'Live streaming DJ setova',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-audio-engine', 'spaja-vr-ar-engine', 'spaja-streaming-platform'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Stealth / Špijunske ─────────────────────────────────────────
  {
    id: 'igrica-dimenzionalni-agent',
    naziv: 'Dimenzionalni Agent',
    opis: 'Stealth igra gde si tajni agent koji se kreće između dimenzija da izbegne detekciju. Prebacuj se iz 360D u 5760D da prođeš kroz zidove, izbegneš kamere i završiš misije. SPAJA Crypto za hakovanje, SPAJA Shield za zaštitu.',
    ikona: '🕵️',
    kategorija: 'avantura',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Cross-dimenzionalni stealth mehanike',
      'Prebacivanje između dimenzija za izbegavanje',
      'Hakovanje sa SPAJA Crypto',
      'AI čuvari sa OMEGA AI ponašanjem',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-ai-npc', 'spaja-crypto', 'spaja-audio-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Card / Collectible ──────────────────────────────────────────
  {
    id: 'igrica-omega-card-battles',
    naziv: 'Omega Card Battles',
    opis: 'Kolekcionarska kartična igra sa dimenzionalnim kartama. Svaka karta je bazirana na geometrijskoj formi, zakonu manifestacije ili dimenzionalnom entitetu. Deckbuilding po dimenzijama — svaka dimenzija otključava nove karte.',
    ikona: '🃏',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Kolekcionarske karte po dimenzijama',
      'Geometrijske forme kao kartične klase',
      'Deckbuilding sa 200+ karata',
      'Online PvP rangirana borba',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-game-analytics', 'spaja-anti-cheat'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Flight / Space Simulator ────────────────────────────────────
  {
    id: 'igrica-omega-flight-sim',
    naziv: 'Omega Flight Simulator',
    opis: 'Let kroz dimenzionalni prostor! Pilotiraj letelice koje putuju između dimenzija. Svaka dimenzija ima drugačiju atmosferu, gravitaciju i prepreke. U 5760D letiš kroz heksa-deka-cirkularni prostor sa VR kokpitom.',
    ikona: '✈️',
    kategorija: 'simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalne letelice sa unikatnom fizikom',
      'Atmosfera i gravitacija po D',
      'VR kokpit za 1440D+',
      'Slobodni let i misije',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-vr-ar-engine', 'spaja-game-engine', 'spaja-audio-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-space-explorer',
    naziv: 'Dimenzionalni Space Explorer',
    opis: 'Istraži svemir kroz 5 dimenzija! Svaka dimenzija je zasebna galaksija sa planetama, zvezdama i svemirskim stanicama generisanim cirkularnim formulama. Trgovina, borba, eksploracija. Multiplayer svemir.',
    ikona: '🚀',
    kategorija: 'simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '5760D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '5 dimenzionalnih galaksija za istraživanje',
      'Proceduralno generisane planete po D',
      'Trgovina i borba u svemiru',
      'Multiplayer svemir sa stanicama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-level-generator', 'spaja-multiplayer-server', 'spaja-game-engine', 'spaja-physics-engine', 'spaja-ai-npc'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Tycoon / Management ─────────────────────────────────────────
  {
    id: 'igrica-gaming-studio-tycoon',
    naziv: 'Gaming Studio Tycoon',
    opis: 'Upravljaj gaming studiom u dimenzionalnom prostoru! Zaposli programere, dizajnere i umetnice — svaki ima specijalizaciju po dimenziji. Pravi igrice, objavi ih, osvoji nagrade. Viša dimenzija (D) = veći studio, složenije igrice.',
    ikona: '🏢',
    kategorija: 'simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Upravljanje gaming studiom',
      'Zaposleni specijalizovani po dimenzijama',
      'Pravljenje i objavljivanje igrica',
      'Dimenzionalne nagrade i rangiranje',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-analytics', 'omega-ai-engine', 'spaja-monitor'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-esport-menadzer',
    naziv: 'eSport Menadžer',
    opis: 'Upravljaj eSport timom u dimenzionalnim turnirima! Regrutiraj igrače, treniraj ih u različitim dimenzijama, takmič se na dimenzionalnim šampionatima. AI evaluacija performansi sa OMEGA AI.',
    ikona: '🏆',
    kategorija: 'simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Regrutacija i trening igrača',
      'Dimenzionalni turniri i šampionati',
      'OMEGA AI evaluacija performansi',
      'Streaming integracija za praćenje',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-analytics', 'omega-ai-engine', 'spaja-streaming-platform', 'spaja-multiplayer-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Co-op / Party igrice ────────────────────────────────────────
  {
    id: 'igrica-omega-party',
    naziv: 'Omega Party',
    opis: 'Party igra sa kolekcijom mini-igrica u dimenzionalnom prostoru! 50+ mini-igrica baziranih na svim dimenzijama i geometrijskim formama. Do 8 igrača lokalno ili online. Svaka dimenzija otključava nove mini-igrice.',
    ikona: '🎉',
    kategorija: 'arkadna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '50+ dimenzionalnih mini-igrica',
      'Do 8 igrača lokalno ili online',
      'Geometrijske mini-igre po formama',
      'Party mod i turnir mod',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-game-engine', 'spaja-audio-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-kviz',
    naziv: 'Dimenzionalni Kviz',
    opis: 'Kviz igra sa pitanjima iz svih dimenzija, geometrija, cirkularnih formula i SpajaUltraOmegaCore sistema. Multiplayer do 100 igrača. Svaka dimenzija donosi teža pitanja. OMEGA AI generiše beskonačna pitanja.',
    ikona: '❓',
    kategorija: 'edukativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'OMEGA AI generisana pitanja',
      'Pitanja iz dimenzija, geometrija, formula',
      'Multiplayer kviz do 100 igrača',
      'Rangiranje po dimenzionalnom znanju',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['omega-ai-engine', 'spajapro-prompt-engine', 'spaja-multiplayer-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ═══════════════════════════════════════════════════════════════════
  // GAMING INDUSTRIJA — Proširenje: Engine inovacije & novi žanrovi
  // "mali milion inovacija" — svi IT proizvodi u akciji
  // ═══════════════════════════════════════════════════════════════════

  // ─── MMO igrice ──────────────────────────────────────────────────
  {
    id: 'igrica-omega-mmo-world',
    naziv: 'Omega MMO World',
    opis: 'Masivni multiplayer online RPG u dimenzionalnom prostoru! 1000+ igrača istovremeno u svakoj dimenziji. 5 dimenzionalnih kontinenata, 20+ klasa baziranih na geometrijskim formama, guild sistem po dimenzijama, raid bossovi u svakom D.',
    ikona: '🌐',
    kategorija: 'mmo',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '1000+ igrača po dimenziji',
      '20+ klasa: Elipsoidni heroji, Rezonantni magi, Hiperbolički strelci, Spiralni monasi',
      'Guild sistem po dimenzijama',
      'Raid bossovi u svakoj D sa AI ponašanjem',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-networking-sdk', 'spaja-ai-npc', 'spaja-game-engine', 'spaja-quest-engine', 'spaja-cloud-save'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalna-mmo-arena',
    naziv: 'Dimenzionalna MMO Arena',
    opis: 'PvP MMO arena sa 100v100 bitkama između dimenzija! Svaka dimenzija je teritorija — osvoji ih sve od 360D do 5760D. Cross-dimenzionalni ratovi, siege borbeni sistem, dimenzionalne tvrđave.',
    ikona: '⚔️',
    kategorija: 'mmo',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '2880D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '100v100 PvP bitke između dimenzija',
      'Siege sistem za dimenzionalne tvrđave',
      'Cross-dimenzionalni ratovi',
      'Teritorijalna kontrola po D',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-networking-sdk', 'spaja-anti-cheat', 'spaja-physics-engine', 'spaja-destructible-env', 'spaja-leaderboard-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Auto-Battler / Idle ─────────────────────────────────────────
  {
    id: 'igrica-omega-auto-battler',
    naziv: 'Omega Auto-Battler',
    opis: 'Dimenzionalni auto-battler gde postavljaš jedinice na board koji se menja po dimenzijama. Elipsoidni board u 360D, spiralni u 5760D. OMEGA AI protivnici. Ranked multiplayer sa dimenzionalnim ligama.',
    ikona: '🎲',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni board koji se menja po D',
      'Geometrijske jedinice: Elipsoid, Rezonantni, Hiperbolički, Spiralni',
      'OMEGA AI protivnici sa strategijom',
      'Ranked dimenzionalne lige',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-ai-npc', 'spaja-multiplayer-server', 'spaja-game-analytics', 'spaja-leaderboard-server', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-idle-clicker',
    naziv: 'Dimenzionalni Idle Clicker',
    opis: 'Idle/clicker igra gde automatski sakupljaš dimenzionalnu energiju. Napreduj od 360D do 5760D kroz prestige sistem. Svaka dimenzija eksponencijalno uvećava zaradu. Offline progress sa cloud save.',
    ikona: '🔄',
    kategorija: 'arkadna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni prestige sistem: 360D → 5760D',
      'Eksponencijalni rast po dimenzijama',
      'Offline progress sa cloud save',
      'Geometrijski upgrade-ovi',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-cloud-save', 'spaja-game-analytics', 'spaja-achievement-system', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Visual Novel / Detektivske ──────────────────────────────────
  {
    id: 'igrica-omega-visual-novel',
    naziv: 'Omega Visual Novel',
    opis: 'Interaktivna priča u dimenzionalnom prostoru. SpajaPro generiše branching narative u svakoj dimenziji. 5 krajeva — po jedan za svaku dimenziju. OMEGA AI NPC-ovi sa emocijama. VR čitanje za spoljašnje dimenzije.',
    ikona: '📖',
    kategorija: 'avantura',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SpajaPro branching narativi po D',
      '5 krajeva — jedan za svaku dimenziju',
      'OMEGA AI NPC-ovi sa emocijama',
      'VR čitanje za 1440D+',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spajapro-prompt-engine', 'spaja-ai-npc', 'spaja-cinematic-engine', 'spaja-audio-engine', 'spaja-vr-ar-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-detektiv',
    naziv: 'Dimenzionalni Detektiv',
    opis: 'Detektivska igra gde rešavaš slučajeve koji se prostiru kroz sve dimenzije. Dokazi se nalaze u različitim D — moraš putovati između 360D i 5760D da sastaviš sliku. OMEGA AI generiše beskonačne slučajeve.',
    ikona: '🔎',
    kategorija: 'detektivska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Cross-dimenzionalni detektivski slučajevi',
      'Dokazi razbacani po dimenzijama',
      'OMEGA AI generisani beskonačni slučajevi',
      'Forenzika sa geometrijskim alatima',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['omega-ai-engine', 'spaja-quest-engine', 'spaja-ai-npc', 'spajapro-prompt-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-mystery-manor',
    naziv: 'Omega Mystery Manor',
    opis: 'Escape room igra u dimenzionalnoj vili! Svaka soba postoji u drugoj dimenziji. Rešavaj zagonetke koristeći geometrijske forme, cirkularne formule i zakone manifestacije. 50+ soba, multiplayer do 4 igrača.',
    ikona: '🏚️',
    kategorija: 'detektivska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalne escape sobe',
      'Zagonetke sa geometrijskim formama',
      '50+ soba u 5 dimenzija',
      'Co-op multiplayer do 4 igrača',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-level-generator', 'spaja-physics-engine', 'spaja-multiplayer-server', 'spaja-audio-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Životna simulacija ──────────────────────────────────────────
  {
    id: 'igrica-dimenzionalna-farma',
    naziv: 'Dimenzionalna Farma',
    opis: 'Farming simulacija u dimenzionalnom prostoru! Gaji useve koji rastu prema cirkularnim formulama. Elipsoidno voće, spiralno povrće, rezonantno cveće. Svaka dimenzija ima drugačije sezone i klimu.',
    ikona: '🌾',
    kategorija: 'zivotna-simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Usevi koji rastu po cirkularnim formulama',
      'Elipsoidno voće, spiralno povrće, rezonantno cveće',
      'Dimenzionalne sezone i klima',
      'Multiplayer farma sa prijateljima',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-weather-system', 'spaja-terrain-generator', 'spaja-multiplayer-server', 'spaja-crafting-engine', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-pet-simulator',
    naziv: 'Omega Pet Simulator',
    opis: 'Uzgajaj dimenzionalne ljubimce! Svaka dimenzija ima unikatne životinje bazirane na geometrijskim formama. Elipsoidni zec, Spiralna mačka, Hiperbolički pas, Rezonantna ptica. Takmičenja i izložbe.',
    ikona: '🐾',
    kategorija: 'zivotna-simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni ljubimci po geometrijskim formama',
      'Uzgajanje, trening i evolucija po D',
      'Pet takmičenja i izložbe',
      'Multiplayer pet bitke',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-ai-npc', 'spaja-animation-engine', 'spaja-game-engine', 'spaja-achievement-system'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-cooking-master',
    naziv: 'Omega Cooking Master',
    opis: 'Kulinarska igra u dimenzionalnom prostoru! Recepti se formiraju cirkularnim formulama. Sastojci iz svih dimenzija — elipsoidni paradajz, spiralna testo, rezonantni začini. Cooking timeri se menjaju po D.',
    ikona: '🍳',
    kategorija: 'zivotna-simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Recepti po cirkularnim formulama',
      'Geometrijski sastojci iz svih dimenzija',
      'Cooking timeri koji se menjaju po D',
      'Online cooking duel',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-crafting-engine', 'spaja-multiplayer-server', 'spaja-game-engine', 'spaja-particle-system'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-ribolov',
    naziv: 'Dimenzionalni Ribolov',
    opis: 'Pecaj dimenzionalne ribe! Svaka dimenzija ima unikatne vrste riba baziranih na geometrijskim formama. Elipsoidne ribe u mirnim vodama, Spiralne u brzacima, Hiperboličke u dubinama. Turniri i kolekcija.',
    ikona: '🎣',
    kategorija: 'zivotna-simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Geometrijske ribe po dimenzijama',
      'Dimenzionalna fizika pecanja',
      'Kolekcija svih vrsta riba',
      'Online ribolovni turniri',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-weather-system', 'spaja-terrain-generator', 'spaja-multiplayer-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Trke — prošireno ────────────────────────────────────────────
  {
    id: 'igrica-omega-kart-racing',
    naziv: 'Omega Kart Racing',
    opis: 'Kart racing u dimenzionalnom prostoru! Mario Kart stil sa dimenzionalnim power-up-ovima. Elipsoidni štit, Spiralni turbo, Hiperbolička raketa, Rezonantni usporač. 20+ dimenzionalnih staza.',
    ikona: '🏎️',
    kategorija: 'trka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni kart power-up-ovi',
      'Elipsoidni, Spiralni, Hiperbolički, Rezonantni power-upi',
      '20+ dimenzionalnih staza',
      'Multiplayer do 12 igrača',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-multiplayer-server', 'spaja-game-engine', 'spaja-particle-system', 'spaja-level-generator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-rally',
    naziv: 'Dimenzionalni Rally',
    opis: 'Rally trke kroz dimenzionalne terene! Off-road staze generirane cirkularnim formulama. Blato, sneg, pesak, šljunak — sve se menja po dimenzijama. Realistična fizika i oštećenje vozila.',
    ikona: '🚗',
    kategorija: 'trka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Off-road staze po cirkularnim formulama',
      'Dimenzionalni tereni: blato, sneg, pesak',
      'Realistična fizika po D',
      'Oštećenje vozila sa destruktivnim okruženjem',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-terrain-generator', 'spaja-weather-system', 'spaja-destructible-env', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Sportske — prošireno ────────────────────────────────────────
  {
    id: 'igrica-omega-golf',
    naziv: 'Omega Golf',
    opis: 'Golf u dimenzionalnom prostoru! Tereni se formiraju prema dimenzionalnim formulama. U 360D je standardan golf, u 5760D teren ima spiralne bunkere, elipsoidne jezera i hiperboličke rampe. Multiplayer turniri.',
    ikona: '⛳',
    kategorija: 'sportska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni golf tereni po formulama',
      'Spiralni bunkeri i elipsoidna jezera',
      'Hiperboličke rampe za trikove',
      'Online turniri do 20 igrača',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-terrain-generator', 'spaja-multiplayer-server', 'spaja-weather-system'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-tenis',
    naziv: 'Dimenzionalni Tenis',
    opis: 'Tenis na dimenzionalnom terenu! Lopta prati elipsoidnu putanju u 360D, spiralnu u 720D, hiperboličku u 1440D. Mreža se menja po dimenzijama. Online singles i doubles.',
    ikona: '🎾',
    kategorija: 'sportska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalna putanja lopte po D',
      'Teren i mreža se menjaju po dimenziji',
      'Online singles i doubles',
      'Turnir mod sa AI protivnicima',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-multiplayer-server', 'spaja-animation-engine', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-skijanje',
    naziv: 'Omega Skijanje',
    opis: 'Ski simulator na dimenzionalnim planinama! Staze se formiraju terenom generisanim cirkularnim formulama. Spiralni slalom, elipsoidni moguli, hiperbolički skokovi. Vremenski uslovi po dimenzijama.',
    ikona: '⛷️',
    kategorija: 'sportska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalne ski staze po formulama',
      'Spiralni slalom, elipsoidni moguli',
      'Vremenski uslovi sa Weather System',
      'VR skijanje za 1440D+',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-terrain-generator', 'spaja-weather-system', 'spaja-physics-engine', 'spaja-vr-ar-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-skateboard',
    naziv: 'Dimenzionalni Skateboard',
    opis: 'Skateboarding u dimenzionalnom prostoru! Rampe, rails i parkovi se formiraju geometrijskim formulama. Trikovi imaju dimenzionalne varijante — spiralni kickflip, elipsoidni ollie, hiperbolički grind.',
    ikona: '🛹',
    kategorija: 'sportska',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Geometrijski skateboard parkovi',
      'Dimenzionalni trikovi: spiralni kickflip, elipsoidni ollie',
      'Park editor za zajednicu',
      'Online trick competition',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-animation-engine', 'spaja-level-generator', 'spaja-replay-system'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Strategija — prošireno ──────────────────────────────────────
  {
    id: 'igrica-omega-chess',
    naziv: 'Omega Šah',
    opis: 'Dimenzionalni šah na tabla koja se menja po dimenzijama! U 360D je 8×8, u 720D je 12×12, u 5760D je heksa-deka tabla sa novim figurama. Geometrijske figure: Elipsoidni top, Spiralni lovac, Hiperbolički konj.',
    ikona: '♟️',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalna šahovska tabla po D',
      'Geometrijske figure sa unikatnim kretanjima',
      'OMEGA AI protivnik sa prilagodljivom težinom',
      'Online rangirana borba',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-ai-npc', 'spaja-multiplayer-server', 'spaja-leaderboard-server', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-poker-arena',
    naziv: 'Omega Poker Arena',
    opis: 'Poker sa dimenzionalnim kartama! Svaka dimenzija dodaje nove karte i kombinacije. U 360D je klasičan Texas Hold\'em, u 5760D imaš 5 boja, geometrijske karte i dimenzionalne jackpotove.',
    ikona: '🃏',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalne karte i kombinacije',
      'Od klasičnog do 5-boja u 5760D',
      'Geometrijske specijalne karte',
      'Online multiplayer stolovi',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-anti-cheat', 'spaja-game-analytics', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Edukativne — prošireno ──────────────────────────────────────
  {
    id: 'igrica-omega-math-arena',
    naziv: 'Omega Math Arena',
    opis: 'Matematička borba u dimenzionalnom prostoru! Rešavaj jednačine bazirane na cirkularnim formulama. Svaka dimenzija dodaje složenost — 360D je aritmetika, 5760D je napredna algebra sa geometrijskim varijablama.',
    ikona: '📐',
    kategorija: 'edukativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Cirkularne formula matematički izazovi',
      'Dimenzionalna složenost: 360D aritmetika → 5760D algebra',
      'Multiplayer matematičke bitke',
      'OMEGA AI prilagođena težina',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['omega-ai-engine', 'spaja-multiplayer-server', 'spaja-leaderboard-server', 'spaja-achievement-system'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-science-lab',
    naziv: 'Dimenzionalni Science Lab',
    opis: 'Naučna laboratorija u dimenzionalnom prostoru! Eksperimentisaj sa geometrijskim formama, zakonima manifestacije i cirkularnim formulama. Svaka dimenzija je drugačiji naučni domen.',
    ikona: '🔬',
    kategorija: 'edukativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni naučni eksperimenti',
      'Geometrijske forme kao eksperimentalni materijali',
      'Zakoni manifestacije kao fizičke konstante',
      'Simulacija po dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'omega-ai-engine', 'spaja-particle-system', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-typing-speed',
    naziv: 'Omega Typing Speed',
    opis: 'Typing speed igra sa dimenzionalnim rečima! Kucaj reči iz SpajaUltraOmegaCore jezika — naredbe, tipove, operatore. Svaka dimenzija dodaje teže reči. Multiplayer trka u kucanju.',
    ikona: '⌨️',
    kategorija: 'edukativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SpajaUltraOmegaCore reči za kucanje',
      'Dimenzionalni nivoi težine',
      'Multiplayer typing trka',
      'WPM leaderboard po dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-leaderboard-server', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalna-geografija',
    naziv: 'Dimenzionalna Geografija',
    opis: 'Istraži dimenzionalnu geografiju! Svaka dimenzija ima svoju mapu — 360D ima 2 kontinenta, 720D ima 4, 5760D ima celokupni heksa-deka-cirkularni svet. Kviz, eksploracija, flagovi i glavno gradovi.',
    ikona: '🗺️',
    kategorija: 'edukativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalne mape i geografija',
      'Kviz o dimenzionalnim lokacijama',
      'Eksploracija kontinenata po D',
      'Multiplayer geografski izazov',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['omega-ai-engine', 'spaja-terrain-generator', 'spaja-multiplayer-server', 'spaja-level-generator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Retro / Klasici u dimenzijama ───────────────────────────────
  {
    id: 'igrica-omega-tetris',
    naziv: 'Omega Tetris',
    opis: 'Tetris u dimenzionalnom prostoru! Blokovi su geometrijske forme — Elipsoidni, Rezonantni, Hiperbolički, Spiralni. U 360D je klasičan 2D, u 5760D je 3D sa dimenzionalnim rotacijama. Speed raste po D.',
    ikona: '🟦',
    kategorija: 'retro',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Geometrijski Tetris blokovi',
      '2D u 360D, 3D u 5760D',
      'Dimenzionalne rotacije i gravitacija',
      'Versus mod sa multiplayer-om',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-multiplayer-server', 'spaja-leaderboard-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-snake',
    naziv: 'Omega Snake',
    opis: 'Snake igra u dimenzionalnom prostoru! Zmija raste po geometrijskim formama — spiralni rep, elipsoidna glava. U višim dimenzijama zmija se kreće kroz 3D prostor. Multiplayer snake battle.',
    ikona: '🐍',
    kategorija: 'retro',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalna snake igra',
      'Geometrijsko telo zmije po D',
      '2D → 3D tranzicija po dimenzijama',
      'Multiplayer snake battle do 20 igrača',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-multiplayer-server', 'spaja-networking-sdk'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-pong',
    naziv: 'Omega Pong',
    opis: 'Pong u dimenzijama! Lopta i reketi se menjaju po dimenzijama. U 360D je klasičan 2D pong, u 5760D je 3D sa spiralnim lopticama, elipsoidnim reketima i hiperboličkim zidovima.',
    ikona: '🏓',
    kategorija: 'retro',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni pong sa geometrijskim elementima',
      '2D u 360D, 3D u 5760D',
      'Spiralne loptice i elipsoidni reketi',
      'Local i online multiplayer',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-multiplayer-server', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-breakout',
    naziv: 'Omega Breakout',
    opis: 'Breakout/Arkanoid u dimenzionalnom prostoru! Cigle su geometrijske forme po dimenzijama. Elipsoidne cigle se raspršuju, Spiralne cigle se okreću, Hiperboličke teleportuju loptu. Power-up-ovi po D.',
    ikona: '🧱',
    kategorija: 'retro',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Geometrijske cigle po dimenzijama',
      'Dimenzionalni power-up-ovi',
      'Elipsoidne, Spiralne, Hiperboličke cigle',
      '100+ nivoa po dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-level-generator', 'spaja-particle-system'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-pac-dimension',
    naziv: 'Omega Pac-Dimension',
    opis: 'Pac-Man u dimenzionalnom lavirintu! Lavirint se generiše cirkularnim formulama za svaku dimenziju. Duhovi koriste OMEGA AI za praćenje. U 5760D lavirint je 3D sa portalima između dimenzija.',
    ikona: '🟡',
    kategorija: 'retro',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni lavirint po cirkularnim formulama',
      'OMEGA AI duhovi sa adaptivnom strategijom',
      '2D → 3D lavirint po dimenzijama',
      'Power-up-ovi po geometrijskim formama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-level-generator', 'spaja-ai-npc', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-pinball',
    naziv: 'Omega Pinball',
    opis: 'Pinball u dimenzionalnom prostoru! Stol se menja po dimenzijama — spiralni bumpers, elipsoidni ramps, hiperbolički flippers, rezonantni multipliers. Svaka dimenzija je novi stol sa novim fizičkim pravilima.',
    ikona: '🪩',
    kategorija: 'retro',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni pinball stolovi',
      'Spiralni bumpers, elipsoidni ramps',
      'Fizika kuglice po D',
      'Online skor tabele po dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-game-engine', 'spaja-particle-system', 'spaja-leaderboard-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Memory / Logičke — prošireno ────────────────────────────────
  {
    id: 'igrica-omega-memory-match',
    naziv: 'Omega Memory Match',
    opis: 'Memory match igra sa dimenzionalnim kartama! Karte prikazuju geometrijske forme, zakone manifestacije i dimenzionalne entitete. U višim dimenzijama više karata i teža pravila.',
    ikona: '🧩',
    kategorija: 'logicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalne karte za memorizaciju',
      'Geometrijske forme, zakoni, entiteti',
      'Progresivna težina po D',
      'Multiplayer memory bitka',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-multiplayer-server', 'spaja-animation-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-sudoku-dimension',
    naziv: 'Omega Sudoku Dimension',
    opis: 'Sudoku u dimenzionalnom prostoru! U 360D je standardan 9×9, u 720D je 12×12, u 5760D je heksa-dimenzionalni sudoku sa geometrijskim brojevima. AI generisane beskonačne zagonetke.',
    ikona: '🔢',
    kategorija: 'logicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni sudoku od 9×9 do heksa',
      'AI generisane beskonačne zagonetke',
      'Geometrijski brojevi i simboli',
      'Daily challenge po dimenzijama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['omega-ai-engine', 'spaja-level-generator', 'spaja-game-engine', 'spaja-leaderboard-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-word-puzzle',
    naziv: 'Omega Word Puzzle',
    opis: 'Dimenzionalna igra sa rečima! Reci se formiraju iz SpajaUltraOmegaCore jezika — naredbe, tipovi, operatori. Crossword, word search, anagram — sve po dimenzijama. SpajaPro generiše beskonačne puzzle-ove.',
    ikona: '📝',
    kategorija: 'logicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SpajaUltraOmegaCore reči za puzzle',
      'Crossword, word search, anagram po D',
      'SpajaPro generisani beskonačni puzzle-ovi',
      'Multiplayer word battle',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spajapro-prompt-engine', 'spaja-level-generator', 'spaja-multiplayer-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Board Game / Društvene ──────────────────────────────────────
  {
    id: 'igrica-omega-board-game-collection',
    naziv: 'Omega Board Game Kolekcija',
    opis: '20+ klasičnih društvenih igara u dimenzionalnom prostoru! Čoveče ne ljuti se, Monopoly, Risk, Ludo — sve sa dimenzionalnim twist-ovima. Boardovi se menjaju po D. Online multiplayer za sve igre.',
    ikona: '🎯',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '20+ dimenzionalnih board igara',
      'Klasične igre sa dimenzionalnim twist-ovima',
      'Boardovi koji se menjaju po D',
      'Online multiplayer za sve igre',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-multiplayer-server', 'spaja-game-engine', 'spaja-ai-npc'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Horor — prošireno ───────────────────────────────────────────
  {
    id: 'igrica-dimenzionalni-ghost-hunter',
    naziv: 'Dimenzionalni Ghost Hunter',
    opis: 'Lovi duhove kroz dimenzije! Koristi dimenzionalne detektore za pronalaženje duhova. Duhovi se sakrivaju u različitim D — moraš skenirati sve dimenzije. Co-op do 4 igrača. VR režim za maksimalnu jezivost.',
    ikona: '👻',
    kategorija: 'horor',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Cross-dimenzionalni lov na duhove',
      'Dimenzionalni detektori i oružja',
      'Co-op multiplayer do 4 igrača',
      'VR horor režim za 1440D+',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-audio-engine', 'spaja-vr-ar-engine', 'spaja-multiplayer-server', 'spaja-ai-npc'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-zombie-survival',
    naziv: 'Omega Zombie Survival',
    opis: 'Dimenzionalni zombie apokalipsa! Zombiji se rađaju u nižim dimenzijama i napadaju više. Brani bazu kroz sve dimenzije. Wave survival sa AI Director-om koji prilagođava težinu. Co-op do 8 igrača.',
    ikona: '🧟',
    kategorija: 'horor',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Wave survival sa AI Director-om',
      'Zombiji iz svih dimenzija',
      'Baza gradnja i odbrana',
      'Co-op multiplayer do 8 igrača',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-ai-director', 'spaja-multiplayer-server', 'spaja-physics-engine', 'spaja-destructible-env', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Muzičke — prošireno ─────────────────────────────────────────
  {
    id: 'igrica-omega-karaoke',
    naziv: 'Omega Karaoke',
    opis: 'Dimenzionalni karaoke! Pesme sa rezonantnim frekvencijama po dimenzijama. Glas se evaluira OMEGA AI-jem. Svaka dimenzija menja tonalitet i tempo. Online karaoke bitke i dueti.',
    ikona: '🎤',
    kategorija: 'muzicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni karaoke sa rezonantnim frekvencijama',
      'OMEGA AI evaluacija glasa',
      'Tonalitet i tempo po D',
      'Online karaoke bitke i dueti',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-audio-engine', 'spaja-procedural-music', 'omega-ai-engine', 'spaja-multiplayer-server', 'spaja-streaming-platform'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-band-simulator',
    naziv: 'Dimenzionalni Band Simulator',
    opis: 'Upravljaj dimenzionalnim bendom! Svaki instrument je baziran na geometrijskoj formi — Elipsoidna gitara, Spiralni bubnjevi, Rezonantni bas, Hiperbolička klavijatura. Komponuj pesme sa proceduralnom muzikom.',
    ikona: '🎸',
    kategorija: 'muzicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Geometrijski instrumenti za svaku formu',
      'Proceduralna muzika sa SPAJA Procedural Music',
      'Band menadžment po dimenzijama',
      'Online koncerti sa streaming platformom',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-procedural-music', 'spaja-audio-engine', 'spaja-streaming-platform', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Maze Runner / Parkour ───────────────────────────────────────
  {
    id: 'igrica-omega-maze-runner',
    naziv: 'Omega Maze Runner',
    opis: 'Trči kroz dimenzionalne lavirinte koji se generišu u realnom vremenu! Zidovi se pomeraju prema cirkularnim formulama. Svaka dimenzija ima drugačiji tip lavirinta. Speedrun režim sa globalnim leaderboardom.',
    ikona: '🏃',
    kategorija: 'akcija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Real-time generisani lavirinti po D',
      'Dinamički zidovi po cirkularnim formulama',
      'Speedrun režim sa globalnim leaderboardom',
      'Multiplayer trka kroz lavirint',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-level-generator', 'spaja-multiplayer-server', 'spaja-leaderboard-server', 'spaja-game-engine', 'spaja-replay-system'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-omega-parkour',
    naziv: 'Omega Parkour',
    opis: 'Dimenzionalni parkour sa fizikom koja se menja po D! Zidovi, stubovi, krovovi — sve je od geometrijskih formi. Wall run na spiralnim zidovima, vaulting preko elipsoidnih prepreka, sliding pod hiperboličkim tunelima.',
    ikona: '🤸',
    kategorija: 'akcija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalni parkour sa geometrijskim preprekama',
      'Wall run, vault, slide po D fizici',
      'VR parkour za 1440D+',
      'Community kreiran level dizajn',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-animation-engine', 'spaja-vr-ar-engine', 'spaja-level-generator', 'spaja-replay-system'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Civilization / 4X ───────────────────────────────────────────
  {
    id: 'igrica-omega-civilizacija',
    naziv: 'Omega Civilizacija',
    opis: '4X strategija u dimenzionalnom prostoru! Gradi civilizaciju od 360D do 5760D. Istraživanje, ekspanzija, eksploatacija, eksterminacija — sve u dimenzijama. Epohe se menjaju po dimenzijama umesto po vremenu.',
    ikona: '🏛️',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '4X strategija u dimenzijama',
      'Epohe po dimenzijama umesto po vremenu',
      'Dimenzionalno tehnološko stablo',
      'AI civilizacije sa OMEGA AI strategijom',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-ai-npc', 'spaja-ai-director', 'spaja-game-engine', 'spaja-terrain-generator', 'spaja-multiplayer-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Rhythm Battle ───────────────────────────────────────────────
  {
    id: 'igrica-omega-rhythm-battle',
    naziv: 'Omega Rhythm Battle',
    opis: 'Ritam + borba u dimenzionalnom prostoru! Tvoji napadi su sinhronizovani sa muzikom. Rezonantne frekvencije = jači udari. Spiralni ritam = brži combo. Hiperbolički beat = specijalni napad. PvP ritam bitke.',
    ikona: '🥁',
    kategorija: 'muzicka',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Ritam + borba kombinirani gameplay',
      'Napadi sinhronizovani sa muzikom',
      'Geometrijski kombinirani potezi po ritmu',
      'PvP ritam bitke online',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-audio-engine', 'spaja-procedural-music', 'spaja-multiplayer-server', 'spaja-physics-engine', 'spaja-game-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ─── Crafting / Building ─────────────────────────────────────────
  {
    id: 'igrica-omega-factory',
    naziv: 'Omega Factory',
    opis: 'Factorio-stil igra u dimenzionalnom prostoru! Gradi fabrike koje proizvode dimenzionalne resurse. Transportni pojasevi, mašine, logistika — sve se menja po dimenzijama. Automatiziraj proizvodnju od 360D do 5760D.',
    ikona: '🏭',
    kategorija: 'simulacija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalna automatizacija fabrika',
      'Transportni pojasevi po D',
      'Cross-dimenzionalna logistika',
      'Multiplayer fabrika gradnja',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-crafting-engine', 'spaja-level-generator', 'spaja-multiplayer-server', 'spaja-physics-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },
  {
    id: 'igrica-dimenzionalni-architect',
    naziv: 'Dimenzionalni Architect',
    opis: 'Arhitektonska igra gde dizajniraš zgrade i strukture u dimenzionalnom prostoru. Koristi sve geometrijske forme kao građevinski materijal. Elipsoidne kupole, spiralne stepenice, hiperbolički lukovi. Showcase za zajednicu.',
    ikona: '🏗️',
    kategorija: 'kreativna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Dimenzionalna arhitektura i dizajn',
      'Geometrijske forme kao materijali',
      'Realistična fizika struktura po D',
      'Showcase i glasanje zajednice',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-physics-engine', 'spaja-game-engine', 'spaja-shader-compiler', 'spaja-terrain-generator'],
    zahtevi: OBAVEZNI_ZAHTEVI,
  },

  // ═══════════════════════════════════════════════════════════════════
  // IO-OPENUI-AO IGRICE — Ekstremno napredne igrice sa pojedinačnim linkovima
  // Ovo nisu klasične igrice — ovo je ekstremni napredak koji ne postoji nigde na planeti!
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'igrica-dota-1350',
    naziv: 'Dota 1350',
    opis: 'Ekstremno napredna strateška MOBA — nije klasična igrica, nego revolucionarni napredak koji ne postoji nigde na planeti! 1350 dimenzionalnih heroja sa jedinstvenim sposobnostima. Svaka dimenzija donosi nove heroje, sposobnosti i terene. U 360D klasičan 5v5, u 5760D dimenzionalni portali povezuju više arene.',
    ikona: '⚔️',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '1350 dimenzionalnih heroja',
      'MOBA 5v5 sa dimenzionalnim mapama',
      'Dimenzionalni portali između arena',
      'Rang sistem po dimenzijama',
      'Ekstremni napredak — ne postoji na planeti',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-multiplayer-server', 'spaja-ai-npc', 'spaja-networking-sdk', 'spaja-anti-cheat'],
    zahtevi: OBAVEZNI_ZAHTEVI,
    link: 'https://chatgpt.com/g/g-p-67c080727f6c8191bba48cc3999f24e9-igrice/c/69237695-71c8-8330-a8c1-1a6f09b1da24',
  },
  {
    id: 'igrica-transformers-1350',
    naziv: 'TRANSFORMERS 1350',
    opis: 'Ekstremno napredna akciona transformerska igrica — nije klasična igrica, nego revolucionarni napredak koji ne postoji nigde na planeti! 1350 dimenzionalnih robota koji se transformišu između formi. Svaka dimenzija otključava nove transformacije — od vozila do letećih mašina i dimenzionalnih entiteta.',
    ikona: '🤖',
    kategorija: 'akcija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '1440D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '1350 dimenzionalnih transformera',
      'Transformacija između formi po dimenzijama',
      'Epske bitke u dimenzionalnom prostoru',
      'Kooperativni i kompetitivni režimi',
      'Ekstremni napredak — ne postoji na planeti',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-physics-engine', 'spaja-animation-engine', 'spaja-multiplayer-server', 'spaja-vr-ar-engine'],
    zahtevi: OBAVEZNI_ZAHTEVI,
    link: 'https://chatgpt.com/g/g-p-67c080727f6c8191bba48cc3999f24e9-igrice/c/692376be-8280-8332-a476-5e3d619972cf',
  },
  {
    id: 'igrica-bubli-babli-1250',
    naziv: 'BUBLI BABLI 1250',
    opis: 'Ekstremno napredna arkadna igrica — nije klasična igrica, nego revolucionarni napredak koji ne postoji nigde na planeti! 1250 dimenzionalnih balončića i puzzle mehanika. Svaka dimenzija menja fiziku balona — u 360D klasični baloni, u 5760D geometrijski baloni sa spiralnim putanjama i rezonantnim efektima.',
    ikona: '🫧',
    kategorija: 'arkadna',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      '1250 dimenzionalnih nivoa sa balonima',
      'Puzzle mehanika sa geometrijskim balonima',
      'Dimenzionalna fizika balona',
      'Multiplayer balončić izazovi',
      'Ekstremni napredak — ne postoji na planeti',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-physics-engine', 'spaja-particle-system', 'spaja-audio-engine', 'spaja-multiplayer-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
    link: 'https://chatgpt.com/g/g-p-67c080727f6c8191bba48cc3999f24e9-igrice/c/692376e3-7b48-832f-9b3e-34cb7625f098',
  },
  {
    id: 'igrica-spaja-poker',
    naziv: 'SPAJA POKER',
    opis: 'Ekstremno napredni poker — nije klasična igrica, nego revolucionarni napredak koji ne postoji nigde na planeti! SPAJA dimenzionalne karte i pravila. Svaka dimenzija dodaje nove karte, boje i kombinacije. U 360D klasičan Texas Hold\'em, u 5760D geometrijske karte, dimenzionalni jackpotovi i spiralni turniri. Kompanija SPAJA zvanični poker.',
    ikona: '🃏',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '720D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'SPAJA dimenzionalne karte i boje',
      'Texas Hold\'em sa dimenzionalnim pravilima',
      'Turniri i dimenzionalni jackpotovi',
      'Multiplayer poker stolovi po dimenzijama',
      'Ekstremni napredak — ne postoji na planeti',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-multiplayer-server', 'spaja-anti-cheat', 'spaja-networking-sdk', 'spaja-leaderboard'],
    zahtevi: OBAVEZNI_ZAHTEVI,
    link: 'https://chatgpt.com/g/g-p-67c080727f6c8191bba48cc3999f24e9-igrice/c/6923762b-07a8-832b-94b6-4565a93fb7e7',
  },
  {
    id: 'igrica-omega-dimenzionalni-sah',
    naziv: 'Omega Dimenzionalni Šah',
    opis: 'Revolucionarni šah u dimenzijama 360D–5760D. Svaka dimenzija dodaje nove figure, pravila kretanja i geometrijske slojeve. U 360D klasičan šah, u 1440D+ heksagonalna tabla sa spiralnim figurama, u 5760D potpuno nova igra sa dimenzionalnim portalima između tabli. Kompanija SPAJA zvanični dimenzionalni šah.',
    ikona: '♟️',
    kategorija: 'strategija',
    podrzaneDimenzije: sveDimenzije,
    podrazumevanaDimenzija: '360D',
    dimenzionalniRezimi: kreirajDimenzionalneRezime(sveDimenzije),
    funkcije: [
      'Klasičan šah u 360D dimenziji',
      'Heksagonalna tabla u 1440D+',
      'Dimenzionalni portali između tabli',
      'Spiralne figure sa geometrijskim pokretima',
      'AI protivnik sa OMEGA AI personama',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['spaja-game-engine', 'spaja-ai-engine', 'spaja-multiplayer-server', 'spaja-leaderboard'],
    zahtevi: OBAVEZNI_ZAHTEVI,
    link: 'https://chatgpt.com/g/g-p-67c080727f6c8191bba48cc3999f24e9-igrice',
  },
];

// ═══════════════════════════════════════════════════════════════════
// SISTEM
// ═══════════════════════════════════════════════════════════════════

export const igriceSistem: IgriceSistem = {
  naziv: 'SpajaUltraOmegaCore Igrice — Dimenzionalni Gaming Sistem',
  opis: 'Sistem igara vezan za dimenzije (360D–5760D). Prilikom pokretanja svake igrice, sistem pita igrača koju dimenziju želi (D). Izabrana dimenzija određuje geometrijske slojeve, zakone manifestacije, vizuelni prikaz i snagu renderovanja. Spoljašnje dimenzije (1440D+) zahtevaju 3D naočare. ZAHTEV: Digitalni Kompjuter + Digitalni Brauzer su neophodni za pokretanje igrica!',
  igrice,
  podrzaneDimenzije: sveDimenzije,
  pitaDimenzijuPriPokretanju: true,
  ukupnoIgrica: igrice.length,
  obavezniZahtevi: OBAVEZNI_ZAHTEVI,
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

/** Vraća igrice koje preporučuju određeni IT proizvod */
export function getIgricePoProizvodu(proizvodId: string): Igrica[] {
  return igrice.filter((i) => i.preporuceniProizvodi.includes(proizvodId));
}

/** Vraća sve preporučene proizvode za sve igrice (unique) */
export function getSvePreporuceneProizvode(): string[] {
  const svi = igrice.flatMap((i) => i.preporuceniProizvodi);
  return [...new Set(svi)];
}

/** Vraća podrazumevani status zahteva (Digitalni Kompjuter + Brauzer su dostupni u sistemu) */
export function getDefaultZahteviStatus(): { kompjuter: boolean; brauzer: boolean; spreman: boolean } {
  return {
    kompjuter: true,
    brauzer: true,
    spreman: true,
  };
}
