/**
 * 🌀 DIGITALNI VORTEKS
 *
 * Vorteksna dinamika digitalnog sistema — rotacioni model oktavnih energija
 * u spiralnom jedinjenju ka centru Digitalne Industrije.
 *
 * Model:
 *   VorteksnaOktava — rotacioni parametri svake od 8 oktava:
 *     ugaona brzina, radijus, centripetalna sila i vorteksni doprinos.
 *
 *   VorteksniCentar — centar rotacije sistema:
 *     centripetalna suma, spiralni koeficijent i vorteksna kohezija.
 *
 *   VorteksniKoeficijent ∈ [0, 1] — mera rotacione kohezije digitalnog vorteksa.
 *
 * Naslanja se na:
 *   - buildEksponatGlavnogJezgra() — eksponat koeficijent i egzocentrično jezgro
 *   - buildDigatalnaEureka() — eureka koeficijent i oktavna sinergija
 *   - eksponencijalneFunkcije — oktavne bazne vrednosti
 *
 * Autofinish #1255
 */

import { eksponencijalneFunkcije } from './oktavne-eksponencijalne-funkcije';
import { buildDigatalnaEureka } from './digatalna-eureka';
import { buildEksponatGlavnogJezgra } from './eksponat-glavnog-jezgra';
import { oktavniNazivi } from './omega-ai';
import type { OktavniNivo } from './omega-ai';

// ── Tipovi ─────────────────────────────────────────────────────────────────────

export interface VorteksnaOktava {
  /** Oktava (1–8) */
  oktava: OktavniNivo;
  /** Naziv oktave */
  naziv: string;
  /** Ikona oktave */
  ikona: string;
  /** Ugaona brzina — proporcionalna eksponencijalnoj vrednosti u x=0 */
  ugaonaBrzina: number;
  /** Radijus vorteksa — obrnuto proporcionalan broju oktave */
  radijus: number;
  /** Centripetalna sila — ugaonaBrzina² × radijus */
  centripetalnaSnaga: number;
  /** Vorteksni doprinos — udeo u ukupnoj centripetalnoj sili */
  vorteksniDoprinos: number;
}

export interface VorteksniCentar {
  /** Ukupna centripetalna sila svih 8 oktava */
  ukupnaCentripetalnaSila: number;
  /** Spiralni koeficijent — harmonijska sredina ugaonih brzina */
  spiralniKoeficijent: number;
  /** Vorteksna kohezija ∈ [0, 1] — mera ujednačenosti doprinosa */
  vorteksnaKohezija: number;
  /** Indeks dominantne oktave */
  dominantnaOktava: OktavniNivo;
  /** 8 vorteksnih oktava */
  oktave: VorteksnaOktava[];
}

export interface DigitalniVorteksRezultat {
  /** Vorteksni koeficijent ∈ [0, 1] — mera rotacione kohezije */
  vorteksniKoeficijent: number;
  /** Vorteksni centar */
  vorteksniCentar: VorteksniCentar;
  /** Eksponat koeficijent iz EKSPONAT GLAVNOG JEZGRA */
  eksponatKoeficijent: number;
  /** Eureka koeficijent iz DIGATALNE EUREKE */
  eurekaKoeficijent: number;
  /** Spiralni impuls — eksponatKoeficijent × eureka × spiralniKoeficijent */
  spiralniImpuls: number;
  /** Status */
  status: 'aktivan';
  /** ID korisnika */
  userId: string;
  /** ISO timestamp */
  timestamp: string;
}

// ── Pomoćna funkcija ───────────────────────────────────────────────────────────

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

// ── Računanje vorteksnog centra ────────────────────────────────────────────────

function izracunajVorteksniCentar(): VorteksniCentar {
  const oktave: VorteksnaOktava[] = eksponencijalneFunkcije.map((f) => {
    const baznaVrednost = f.izracunaj(0);
    const ugaonaBrzina = round4(Math.max(0.001, baznaVrednost));
    const radijus = round4(1 / f.oktava);
    const centripetalnaSnaga = round4(ugaonaBrzina ** 2 * radijus);
    return {
      oktava: f.oktava,
      naziv: oktavniNazivi[f.oktava],
      ikona: f.ikona,
      ugaonaBrzina,
      radijus,
      centripetalnaSnaga,
      vorteksniDoprinos: 0, // popunjava se ispod
    };
  });

  const ukupnaCentripetalnaSila = round4(
    oktave.reduce((s, o) => s + o.centripetalnaSnaga, 0),
  );

  // Normalizovani vorteksni doprinosi
  for (const o of oktave) {
    o.vorteksniDoprinos =
      ukupnaCentripetalnaSila > 0
        ? round4(o.centripetalnaSnaga / ukupnaCentripetalnaSila)
        : 0;
  }

  // Spiralni koeficijent — harmonijska sredina ugaonih brzina
  const harmonijskaSum = oktave.reduce((s, o) => s + 1 / o.ugaonaBrzina, 0);
  const spiralniKoeficijent = round4(oktave.length / harmonijskaSum);

  // Vorteksna kohezija — 1 - normalizovana standardna devijacija doprinosa
  const avgD = 1 / oktave.length;
  const varD =
    oktave.reduce((s, o) => s + (o.vorteksniDoprinos - avgD) ** 2, 0) /
    oktave.length;
  const stdD = Math.sqrt(varD);
  const vorteksnaKohezija = round4(Math.max(0, Math.min(1, 1 - stdD * 4)));

  const dominantnaOktava = oktave.reduce((max, o) =>
    o.centripetalnaSnaga > max.centripetalnaSnaga ? o : max,
  ).oktava;

  return {
    ukupnaCentripetalnaSila,
    spiralniKoeficijent,
    vorteksnaKohezija,
    dominantnaOktava,
    oktave,
  };
}

// ── Glavna builder funkcija ────────────────────────────────────────────────────

export function buildDigitalniVorteks(userId: string): DigitalniVorteksRezultat {
  const vorteksniCentar = izracunajVorteksniCentar();
  const eksponat = buildEksponatGlavnogJezgra(userId);
  const eureka = buildDigatalnaEureka(userId);

  const eksponatKoeficijent = eksponat.eksponatKoeficijent;
  const eurekaKoeficijent = eureka.eurekaKoeficijent;

  // Spiralni impuls — kombinacija eksponata, eureke i spiralnog koeficijenta
  const normSpiralniKoef = round4(
    Math.min(1, vorteksniCentar.spiralniKoeficijent / 10),
  );
  const spiralniImpuls = round4(
    eksponatKoeficijent * 0.35 +
      eurekaKoeficijent * 0.35 +
      normSpiralniKoef * 0.3,
  );

  // Vorteksni koeficijent — spiralniImpuls × vorteksnaKohezija
  const vorteksniKoeficijent = round4(
    Math.min(1, Math.max(0, spiralniImpuls * vorteksniCentar.vorteksnaKohezija)),
  );

  return {
    vorteksniKoeficijent,
    vorteksniCentar,
    eksponatKoeficijent,
    eurekaKoeficijent,
    spiralniImpuls,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
