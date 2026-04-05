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
  | 'sportska';

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
    opis: 'MOBA-stil igra sa 5v5 timovima u dimenzionalnoj areni. Svaki heroj je baziran na geometrijskoj formi sa unikатnim sposobnostima. Lane-ovi se protežu kroz dimenzije. Dimenzija (D) određuje veličinu mape i kompleksnost.',
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
      'Multiplayer kviz do 100 igrача',
      'Rangiranje po dimenzionalnom znanju',
      'Pita dimenziju (D) prilikom pokretanja',
    ],
    status: 'aktivna',
    preporuceniProizvodi: ['omega-ai-engine', 'spajapro-prompt-engine', 'spaja-multiplayer-server'],
    zahtevi: OBAVEZNI_ZAHTEVI,
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
