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
  matricnoJezgro: MatricnoJezgro;
  neuroloskaMreza: NeuroloskaMreza;
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

/* ─── Matrično jezgro ──────────────────────────────────── */

/**
 * Sekvencioni odaziv — odgovor jedne oktave na drugu.
 *
 * Matrica 8×8 modeluje kako oktave međusobno utiču:
 *   - izvornaOktava šalje signal
 *   - ciljnaOktava prima i generiše odaziv
 *   - jacina (0.0–1.0) predstavlja intenzitet veze
 *   - tip odaziva definira prirodu uticaja
 */
export interface SekvencioniOdaziv {
  izvornaOktava: OktavniNivo;
  ciljnaOktava: OktavniNivo;
  jacina: number;             // 0.0–1.0
  tip: 'ekscitatorni' | 'inhibitorni' | 'modulatorni';
  latencija: number;          // ms — kašnjenje odaziva
  aktivan: boolean;
}

export interface MatricnoJezgro {
  dimenzija: number;          // 8 (8×8 matrica)
  odazivi: SekvencioniOdaziv[];
  ukupnoVeza: number;
  aktivnihVeza: number;
  prosecnaJacina: number;
  status: 'inicijalizovano' | 'aktivno' | 'kompletno';
}

/**
 * Bazna latencija odaziva između oktava u ms.
 * Bliže oktave imaju manju latenciju (bržu komunikaciju).
 */
const BAZNA_LATENCIJA = 50;

/**
 * Izračunava jačinu veze između dve oktave.
 *
 * Pravila:
 * - Susedne oktave imaju najjaču vezu (0.9)
 * - Udaljenost smanjuje jačinu
 * - Temelj (1) i Evolucija (8) imaju specijalnu povratnu vezu (0.7)
 * - Dijagonala (samo-odaziv) je uvek 1.0
 */
function izracunajJacinuVeze(izvor: OktavniNivo, cilj: OktavniNivo): number {
  if (izvor === cilj) return 1.0;
  const razmak = Math.abs(izvor - cilj);
  // Specijalna povratna petlja: Evolucija → Temelj
  if ((izvor === 8 && cilj === 1) || (izvor === 1 && cilj === 8)) return 0.7;
  // Susedne oktave
  if (razmak === 1) return 0.9;
  if (razmak === 2) return 0.6;
  // Udaljenije oktave
  return Math.max(0.1, +(0.9 - razmak * 0.15).toFixed(2));
}

/**
 * Određuje tip odaziva na osnovu odnosa oktava.
 *
 * - ekscitatorni: signal pojačava rad ciljne oktave (napred u sekvenci)
 * - inhibitorni: signal koči ciljnu oktavu (nazad u sekvenci — feedback)
 * - modulatorni: samo-odaziv ili petlja Evolucija↔Temelj
 */
function odrediTipOdaziva(izvor: OktavniNivo, cilj: OktavniNivo): SekvencioniOdaziv['tip'] {
  if (izvor === cilj) return 'modulatorni';
  if ((izvor === 8 && cilj === 1) || (izvor === 1 && cilj === 8)) return 'modulatorni';
  return izvor < cilj ? 'ekscitatorni' : 'inhibitorni';
}

export function createMatricnoJezgro(): MatricnoJezgro {
  const oktave: OktavniNivo[] = [1, 2, 3, 4, 5, 6, 7, 8];
  const odazivi: SekvencioniOdaziv[] = [];

  for (const izvor of oktave) {
    for (const cilj of oktave) {
      const jacina = izracunajJacinuVeze(izvor, cilj);
      const razmak = Math.abs(izvor - cilj);
      odazivi.push({
        izvornaOktava: izvor,
        ciljnaOktava: cilj,
        jacina,
        tip: odrediTipOdaziva(izvor, cilj),
        latencija: izvor === cilj ? 0 : BAZNA_LATENCIJA + razmak * 15,
        aktivan: jacina >= 0.3,
      });
    }
  }

  const aktivnihVeza = odazivi.filter((o) => o.aktivan).length;
  const zbir = odazivi.reduce((s, o) => s + o.jacina, 0);

  return {
    dimenzija: 8,
    odazivi,
    ukupnoVeza: odazivi.length,
    aktivnihVeza,
    prosecnaJacina: +(zbir / odazivi.length).toFixed(3),
    status: 'kompletno',
  };
}

/* ─── Neurološka mreža ─────────────────────────────────── */

/**
 * Neurološki čvor — svaka persona je čvor u neuronskoj mreži
 * sa sinaptičkim vezama ka drugim personama.
 *
 * Modeluje eksperimentalni neurološki sloj gde persone
 * formiraju mrežu sa težinskim vezama (sinapsa), grupišu se
 * po oktavama (klasterima) i imaju sekvencionalne odazive.
 */
export interface NeuroloskiCvor {
  personaId: string;
  personaNaziv: string;
  personaIkona: string;
  oktavniNivo: OktavniNivo;
  aktivacija: number;         // 0.0–1.0 — nivo aktivacije čvora
  sinapse: NeuroloskaSinapsa[];
  klaster: string;            // naziv oktave — neurološki klaster
}

export interface NeuroloskaSinapsa {
  ciljPersonaId: string;
  tezina: number;             // -1.0 do 1.0 (negativna = inhibitorna)
  tip: 'intra-oktavna' | 'inter-oktavna' | 'povratna';
}

export interface NeuroloskaMreza {
  cvorovi: NeuroloskiCvor[];
  ukupnoCvorova: number;
  ukupnoSinapsi: number;
  klasteri: NeuroloskiKlaster[];
  prosecnaAktivacija: number;
  status: 'aktivna' | 'neaktivna';
}

export interface NeuroloskiKlaster {
  oktavniNivo: OktavniNivo;
  naziv: string;
  cvorova: number;
  interneVeze: number;
  eksterneVeze: number;
  klasterAktivacija: number;  // prosek aktivacija čvorova u klasteru
}

/**
 * Izračunava težinu sinapse između dve persone.
 *
 * - Intra-oktavne (isti nivo): jaka pozitivna veza (0.7–0.9)
 * - Susedne oktave: umerena pozitivna (0.3–0.5)
 * - Udaljenije oktave: slabija (0.1–0.3)
 * - Povratna Evolucija→Temelj: specijalna (0.6)
 */
function izracunajTezinuSinapse(izvorNivo: OktavniNivo, ciljNivo: OktavniNivo): number {
  if (izvorNivo === ciljNivo) return +(0.7 + Math.random() * 0.2).toFixed(2);
  const razmak = Math.abs(izvorNivo - ciljNivo);
  if (razmak === 1) return +(0.3 + Math.random() * 0.2).toFixed(2);
  if ((izvorNivo === 8 && ciljNivo === 1) || (izvorNivo === 1 && ciljNivo === 8)) return 0.6;
  return +(Math.max(0.05, 0.3 - razmak * 0.05)).toFixed(2);
}

/**
 * Kreira neurološku mrežu svih OMEGA AI persona.
 *
 * Svaka persona se povezuje sa:
 * 1. Svim personama u istoj oktavi (intra-oktavne sinapse)
 * 2. Svim personama u susednim oktavama (inter-oktavne sinapse)
 * 3. Specijalnim povratnim vezama (Evolucija ↔ Temelj)
 *
 * Aktivacija čvora se računa na osnovu prioriteta persone i pozicije u oktavi.
 */
export function createNeuroloskuMrezu(): NeuroloskaMreza {
  const cvorovi: NeuroloskiCvor[] = omegaPersone.map((p) => {
    // Aktivacija na osnovu prioriteta
    const aktivacijaMap: Record<string, number> = {
      kritican: 0.95,
      visok: 0.8,
      srednji: 0.6,
      nizak: 0.4,
    };
    const aktivacija = aktivacijaMap[p.prioritet] ?? 0.5;

    // Sinapse: svaka persona se povezuje sa personama iste i susednih oktava
    const sinapse: NeuroloskaSinapsa[] = [];

    for (const druga of omegaPersone) {
      if (druga.id === p.id) continue;

      const razmak = Math.abs(p.oktavniNivo - druga.oktavniNivo);

      // Intra-oktavne veze (isti nivo)
      if (p.oktavniNivo === druga.oktavniNivo) {
        sinapse.push({
          ciljPersonaId: druga.id,
          tezina: izracunajTezinuSinapse(p.oktavniNivo, druga.oktavniNivo),
          tip: 'intra-oktavna',
        });
      }
      // Inter-oktavne veze (susedne oktave)
      else if (razmak === 1) {
        sinapse.push({
          ciljPersonaId: druga.id,
          tezina: izracunajTezinuSinapse(p.oktavniNivo, druga.oktavniNivo),
          tip: 'inter-oktavna',
        });
      }
      // Povratna veza Evolucija ↔ Temelj
      else if (
        (p.oktavniNivo === 8 && druga.oktavniNivo === 1) ||
        (p.oktavniNivo === 1 && druga.oktavniNivo === 8)
      ) {
        sinapse.push({
          ciljPersonaId: druga.id,
          tezina: izracunajTezinuSinapse(p.oktavniNivo, druga.oktavniNivo),
          tip: 'povratna',
        });
      }
    }

    return {
      personaId: p.id,
      personaNaziv: p.naziv,
      personaIkona: p.ikona,
      oktavniNivo: p.oktavniNivo,
      aktivacija,
      sinapse,
      klaster: oktavniNazivi[p.oktavniNivo],
    };
  });

  const sveSinapse = cvorovi.flatMap((c) => c.sinapse);
  const ukupnoSinapsi = sveSinapse.length;
  const prosecnaAktivacija = +(
    cvorovi.reduce((s, c) => s + c.aktivacija, 0) / cvorovi.length
  ).toFixed(3);

  // Klasteri po oktavama
  const klasteri: NeuroloskiKlaster[] = ([1, 2, 3, 4, 5, 6, 7, 8] as OktavniNivo[]).map((nivo) => {
    const cvoroviOktave = cvorovi.filter((c) => c.oktavniNivo === nivo);
    const interneVeze = cvoroviOktave.flatMap((c) =>
      c.sinapse.filter((s) => s.tip === 'intra-oktavna'),
    ).length;
    const eksterneVeze = cvoroviOktave.flatMap((c) =>
      c.sinapse.filter((s) => s.tip !== 'intra-oktavna'),
    ).length;
    const klasterAktivacija = +(
      cvoroviOktave.reduce((s, c) => s + c.aktivacija, 0) / (cvoroviOktave.length || 1)
    ).toFixed(3);

    return {
      oktavniNivo: nivo,
      naziv: oktavniNazivi[nivo],
      cvorova: cvoroviOktave.length,
      interneVeze,
      eksterneVeze,
      klasterAktivacija,
    };
  });

  return {
    cvorovi,
    ukupnoCvorova: cvorovi.length,
    ukupnoSinapsi,
    klasteri,
    prosecnaAktivacija,
    status: 'aktivna',
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
 * Matrično jezgro modeluje 8×8 matricu interakcija između oktava
 * sa sekvencionim odazivima (ekscitatorni, inhibitorni, modulatorni).
 *
 * Neurološka mreža modeluje sinaptičke veze između persona
 * sa intra-oktavnim, inter-oktavnim i povratnim vezama.
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
    matricnoJezgro: createMatricnoJezgro(),
    neuroloskaMreza: createNeuroloskuMrezu(),
    timestamp,
  };
}

export function getDispatchSummary() {
  const dispatch = createDispatch();
  const sync = dispatch.sinhronizacija;
  const matrica = dispatch.matricnoJezgro;
  const neuro = dispatch.neuroloskaMreza;
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
    matricnoJezgro: {
      dimenzija: matrica.dimenzija,
      ukupnoVeza: matrica.ukupnoVeza,
      aktivnihVeza: matrica.aktivnihVeza,
      prosecnaJacina: matrica.prosecnaJacina,
      status: matrica.status,
    },
    neuroloskaMreza: {
      ukupnoCvorova: neuro.ukupnoCvorova,
      ukupnoSinapsi: neuro.ukupnoSinapsi,
      prosecnaAktivacija: neuro.prosecnaAktivacija,
      klasteri: neuro.klasteri.map((k) => ({
        oktava: k.oktavniNivo,
        naziv: k.naziv,
        cvorova: k.cvorova,
        interneVeze: k.interneVeze,
        eksterneVeze: k.eksterneVeze,
        aktivacija: k.klasterAktivacija,
      })),
      status: neuro.status,
    },
    sekvence: dispatch.sekvence.map((s) => ({
      oktava: s.oktavniNivo,
      naziv: s.oktavniNaziv,
      persona: s.zadaci.length,
      status: s.status,
    })),
  };
}
