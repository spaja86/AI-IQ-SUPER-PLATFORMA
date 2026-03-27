import type { OktavniNivo } from './omega-ai';
import { omegaPersone, oktavniNazivi, getPersonePoOktavi } from './omega-ai';

export type DispatchStatus = 'ceka' | 'aktivan' | 'zavrsen' | 'preskocen' | 'greska';

export interface DispatchZadatak {
  id: string;
  personaId: string;
  personaNaziv: string;
  personaIkona: string;
  oktavniNivo: OktavniNivo;
  oktavniNaziv: string;
  status: DispatchStatus;
  redosled: number;
  timestamp: string;
}

export interface DispatchSekvenca {
  oktavniNivo: OktavniNivo;
  oktavniNaziv: string;
  zadaci: DispatchZadatak[];
  status: DispatchStatus;
}

export interface DispatchIzvestaj {
  ukupnoPersona: number;
  ukupnoOktava: number;
  zavrsenih: number;
  aktivnih: number;
  ceka: number;
  sekvence: DispatchSekvenca[];
  sinhronizacija: SinhronizacijaStanje;
  timestamp: string;
}

/* ─── Elastična specijalizovana sinhronizacija ─────────── */

/**
 * Svaka oktava ima svoju fazu sinhronizacije.
 * Elastično tajmovanje znači da svaka oktava može trajati duže/kraće
 * u zavisnosti od broja persona i kompleksnosti zadataka.
 */
export interface OktavaSinhronizacija {
  oktavniNivo: OktavniNivo;
  naziv: string;
  faza: 'skeleton' | 'inicijalizacija' | 'obrada' | 'sinhronizacija' | 'zavrseno';
  progres: number;           // 0–100
  elasticnoVreme: number;    // ms — bazno vreme za ovu oktavu
  persona: number;           // broj persona u oktavi
}

export interface SinhronizacijaStanje {
  aktivnaOktava: OktavniNivo;
  ukupniProgres: number;     // 0–100 za celu sekvencu
  oktave: OktavaSinhronizacija[];
  mod: 'sekvencijalni' | 'paralelni';
  status: 'skeleton' | 'u_toku' | 'kompletan';
}

/** Bazno vreme po personi u ms — množi se brojem persona u oktavi. */
const BAZNO_VREME_PO_PERSONI = 120;

/**
 * Težinski faktori po oktavi — niže oktave (temelj, zaštita) imaju veći
 * faktor jer postavljaju osnove sistema i moraju završiti temeljno.
 */
const OKTAVNI_TEZINSKI_FAKTORI: Record<OktavniNivo, number> = {
  1: 1.5,  // Temelj — kritično, strukturalne odluke
  2: 1.4,  // Zaštita — bezbednost zahteva pažnju
  3: 1.2,  // Kvalitet — osiguranje kvaliteta
  4: 1.0,  // Kreacija — standardno vreme
  5: 1.1,  // Optimizacija — zahteva merenje
  6: 1.0,  // Inteligencija — standardno vreme
  7: 0.8,  // Koordinacija — mnogo persona, kraće po jednoj
  8: 0.9,  // Evolucija — dugoročni zadaci, nešto kraći ciklus
};

/** Elastično vreme: bazno × broj persona × težinski faktor oktave. */
function izracunajElasticnoVreme(nivo: OktavniNivo, brojPersona: number): number {
  return Math.round(BAZNO_VREME_PO_PERSONI * brojPersona * OKTAVNI_TEZINSKI_FAKTORI[nivo]);
}

export function createSinhronizacija(): SinhronizacijaStanje {
  const oktave: OktavaSinhronizacija[] = ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => {
    const persone = getPersonePoOktavi(nivo);
    return {
      oktavniNivo: nivo,
      naziv: oktavniNazivi[nivo],
      faza: 'zavrseno',
      progres: 100,
      elasticnoVreme: izracunajElasticnoVreme(nivo, persone.length),
      persona: persone.length,
    };
  });

  return {
    aktivnaOktava: 8,
    ukupniProgres: 100,
    oktave,
    mod: 'sekvencijalni',
    status: 'kompletan',
  };
}

/* ─── Dispatch ─────────────────────────────────────────── */

/**
 * Sekvencijalno dispečovanje u oktavnom sistemu.
 *
 * Persone se dispečuju sekvencijalno po oktavama (1→8).
 * Unutar svake oktave, persone rade paralelno.
 * Sledeća oktava ne počinje dok tekuća ne završi.
 *
 * Elastična sinhronizacija osigurava:
 * - Skeleton faza: priprema layout-a pre učitavanja podataka
 * - Inicijalizacija: persone se pokreću
 * - Obrada: paralelno izvršavanje unutar oktave
 * - Sinhronizacija: čekanje da sve persone završe
 * - Zavrseno: prelaz na sledeću oktavu
 *
 * Redosled oktava:
 * 1. Temelj — Arhitekta i Graditelj postavljaju osnove
 * 2. Zaštita — Čuvar i Lekar osiguravaju bezbednost
 * 3. Kvalitet — Tester i Dokumentar garantuju kvalitet
 * 4. Kreacija — Dizajner i Kreator stvaraju
 * 5. Optimizacija — Optimizator i Skalator tuniraju
 * 6. Inteligencija — Naučnik i Analitičar istražuju
 * 7. Koordinacija — Strateg, Mentor, Integrator, Komunikator, Finansijer upravljaju
 * 8. Evolucija — Evolver, Monitor, Ekolog, Vizionar unapređuju
 */
export function createDispatch(): DispatchIzvestaj {
  const timestamp = new Date().toISOString();
  let redosled = 0;

  const sekvence: DispatchSekvenca[] = ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => {
    const persone = getPersonePoOktavi(nivo);
    const zadaci: DispatchZadatak[] = persone.map((p) => {
      redosled++;
      return {
        id: `dispatch-${p.id}`,
        personaId: p.id,
        personaNaziv: p.naziv,
        personaIkona: p.ikona,
        oktavniNivo: nivo,
        oktavniNaziv: oktavniNazivi[nivo],
        status: 'zavrsen' as DispatchStatus,
        redosled,
        timestamp,
      };
    });

    return {
      oktavniNivo: nivo,
      oktavniNaziv: oktavniNazivi[nivo],
      zadaci,
      status: 'zavrsen' as DispatchStatus,
    };
  });

  const sviZadaci = sekvence.flatMap((s) => s.zadaci);

  return {
    ukupnoPersona: omegaPersone.length,
    ukupnoOktava: 8,
    zavrsenih: sviZadaci.filter((z) => z.status === 'zavrsen').length,
    aktivnih: sviZadaci.filter((z) => z.status === 'aktivan').length,
    ceka: sviZadaci.filter((z) => z.status === 'ceka').length,
    sekvence,
    sinhronizacija: createSinhronizacija(),
    timestamp,
  };
}

export function getDispatchSummary() {
  const dispatch = createDispatch();
  const sync = dispatch.sinhronizacija;
  return {
    ukupnoPersona: dispatch.ukupnoPersona,
    ukupnoOktava: dispatch.ukupnoOktava,
    zavrsenih: dispatch.zavrsenih,
    status: dispatch.zavrsenih === dispatch.ukupnoPersona ? 'kompletan' : 'u_toku',
    sinhronizacija: {
      mod: sync.mod,
      status: sync.status,
      ukupniProgres: sync.ukupniProgres,
      oktave: sync.oktave.map((o) => ({
        oktava: o.oktavniNivo,
        naziv: o.naziv,
        faza: o.faza,
        progres: o.progres,
        elasticnoVremeMs: o.elasticnoVreme,
      })),
    },
    sekvence: dispatch.sekvence.map((s) => ({
      oktava: s.oktavniNivo,
      naziv: s.oktavniNaziv,
      persona: s.zadaci.length,
      status: s.status,
    })),
  };
}
