/**
 * 🔬 EKSPONAT GLAVNOG JEZGRA
 *
 * Eksponat glavnog jezgra u ilustrovanom oktavnom sistemu.
 *
 * Model:
 *   CinemetricnoJedinjenje — eksponicionalni oblik cinemetričnog jedinjenja
 *     u oktavi, u srazmernom centimentarnom sjedinjavanju sistematskog
 *     infrajedinkonalnog skvence ka celom oktodomolnom kuzmetrijskom paravanu.
 *
 *   IlustrovaniOktavniSistem — 8 oktavnih jedinjenja sa cinemetričnim
 *     komponentama, centimentarnim vrednostima, infrajedinkonalnim sekvencama
 *     i oktodomolnim kuzmetrijskim paravanima.
 *
 *   EksponatKoeficijent ∈ [0, 1] — mera eksponata jezgra u oktavnom sistemu.
 *
 * Naslanja se na:
 *   - getOktavniMonolog() — egzocentrično jezgro i matricno jedinjenje
 *   - eksponencijalneFunkcije, getFiguracioniCentar, getKorelacionaMatrica —
 *     oktavne eksponencijalne funkcije
 *   - buildDigatalnaEureka() — eureka koeficijent i oktavna sinergija
 *   - buildLaucentricniSpektar() — spektralna gustina
 *
 * Autofinish #1253
 */

import { getOktavniMonolog } from './oktavni-monolog';
import {
  eksponencijalneFunkcije,
  getFiguracioniCentar,
  getKorelacionaMatrica,
} from './oktavne-eksponencijalne-funkcije';
import { buildDigatalnaEureka } from './digatalna-eureka';
import { buildLaucentricniSpektar } from './laucentricni-spektar';
import { oktavniNazivi } from './omega-ai';
import type { OktavniNivo } from './omega-ai';

// ── Tipovi ─────────────────────────────────────────────────────────────────────

export interface CinemetricnoJedinjenje {
  /** Oktava (1–8) */
  oktava: OktavniNivo;
  /** Naziv oktave */
  naziv: string;
  /** Ikona oktave */
  ikona: string;
  /** Eksponicionalni oblik — f(centroidX) za tu oktavu */
  eksponicijalnaVrednost: number;
  /** Cinemetrička komponenta — normalizovani log eksponata */
  cinemetricnaKomponenta: number;
  /** Centimentarna vrednost — udeo oktave u ukupnoj super-poziciji */
  centimentarnaVrednost: number;
  /** Infrajedinkonalna sekvenca — korelacija oktave sa prvom oktavom */
  infrajedinkonalnaSekvenca: number;
}

export interface IlustrovaniOktavniSistem {
  /** 8 cinemetričnih jedinjenja — po jedno za svaku oktavu */
  jedinjenja: CinemetricnoJedinjenje[];
  /** Srazmerno centimentarno sjedinjavanje — prosek centimentarnih vrednosti */
  srazmernoCentimentarnoSjedinjavanje: number;
  /** Oktodomolni kuzmetrijski paravan — 8×8 korelaciona matrica jedinjenja */
  oktodomolniKuzmetrijskiParavan: number[][];
  /** Sistematski infrajedinkonalni skvenc — suma infra sekvenci */
  sistematskiInfrajedinkonalniSkvenc: number;
  /** Srazmerni faktor konvergencije — mera konvergencije ka centru jezgra */
  srazmerniFaktorKonvergencije: number;
}

export interface EksponatGlavnogJezgraRezultat {
  /** Eksponat koeficijent ∈ [0, 1] — mera eksponata jezgra u oktavnom sistemu */
  eksponatKoeficijent: number;
  /** Ilustrovani oktavni sistem sa cinemetričnim jedinjenjima */
  ilustrovaniOktavniSistem: IlustrovaniOktavniSistem;
  /** Snaga egzocentričnog jezgra */
  jezgroSnaga: number;
  /** Egzocentrično — rastojanje centra mase od geometrijskog centra */
  egzocentricnost: number;
  /** Matricna simetrija — trag 8×8 jedinjenja */
  matricnaSimetrija: number;
  /** Eureka koeficijent iz DIGATALNE EUREKE */
  eurekaKoeficijent: number;
  /** Spektralna gustina iz LAUCENTRIČNOG SPEKTRA */
  spektralnaGustina: number;
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

// ── Računanje ilustrovanog oktavnog sistema ────────────────────────────────────

function izracunajIlustrovaniOktavniSistem(): IlustrovaniOktavniSistem {
  const figCentar = getFiguracioniCentar();
  const centroidX = figCentar.centroidX;
  const korelacionaMatrica = getKorelacionaMatrica();

  // Eksponicionalne vrednosti u centroidu za svaku oktavu
  const ekspoVrednosti = eksponencijalneFunkcije.map((f) =>
    round4(f.izracunaj(centroidX)),
  );

  const maxEkspo = Math.max(...ekspoVrednosti);
  const totalEkspo = ekspoVrednosti.reduce((s, v) => s + v, 0);

  const jedinjenja: CinemetricnoJedinjenje[] = eksponencijalneFunkcije.map(
    (f, i) => {
      const eksponicijalnaVrednost = ekspoVrednosti[i];

      // Cinemetrička komponenta — normalizovani prirodni logaritam
      const cinemetricnaKomponenta =
        maxEkspo > 0
          ? round4(Math.log(eksponicijalnaVrednost + 1) / Math.log(maxEkspo + 1))
          : 0;

      // Centimentarna vrednost — udeo u ukupnoj super-poziciji
      const centimentarnaVrednost =
        totalEkspo > 0 ? round4(eksponicijalnaVrednost / totalEkspo) : 0;

      // Infrajedinkonalna sekvenca — korelacija sa prvom oktavom
      const infrajedinkonalnaSekvenca = round4(korelacionaMatrica[i][0]);

      return {
        oktava: f.oktava,
        naziv: oktavniNazivi[f.oktava],
        ikona: f.ikona,
        eksponicijalnaVrednost,
        cinemetricnaKomponenta,
        centimentarnaVrednost,
        infrajedinkonalnaSekvenca,
      };
    },
  );

  // Srazmerno centimentarno sjedinjavanje
  const srazmernoCentimentarnoSjedinjavanje = round4(
    jedinjenja.reduce((s, j) => s + j.centimentarnaVrednost, 0) /
      jedinjenja.length,
  );

  // Sistematski infrajedinkonalni skvenc
  const sistematskiInfrajedinkonalniSkvenc = round4(
    jedinjenja.reduce((s, j) => s + j.infrajedinkonalnaSekvenca, 0),
  );

  // Srazmerni faktor konvergencije — izvedeno iz figuracionog centra
  // Formula: 1 - k/(k+1) mapira k ∈ [0, ∞) na [0, 1), inverzno proporcionalno
  // sa konvergencioniKoeficijent — veći koeficijent daje manji faktor konvergencije.
  const kk = figCentar.konvergencioniKoeficijent;
  const srazmerniFaktorKonvergencije = round4(
    Math.min(1, Math.max(0, 1 - kk / (kk + 1))),
  );

  return {
    jedinjenja,
    srazmernoCentimentarnoSjedinjavanje,
    oktodomolniKuzmetrijskiParavan: korelacionaMatrica,
    sistematskiInfrajedinkonalniSkvenc,
    srazmerniFaktorKonvergencije,
  };
}

// ── Glavna builder funkcija ────────────────────────────────────────────────────

export function buildEksponatGlavnogJezgra(
  userId: string,
): EksponatGlavnogJezgraRezultat {
  const monolog = getOktavniMonolog();
  const eureka = buildDigatalnaEureka(userId);
  const spektar = buildLaucentricniSpektar(userId);
  const ilustrovaniOktavniSistem = izracunajIlustrovaniOktavniSistem();

  const jezgroSnaga = monolog.egzocentricnoJezgro.funkcionalnaSnaga;
  const egzocentricnost = monolog.egzocentricnoJezgro.egzocentricnost;
  const matricnaSimetrija = monolog.matricnoJedinjenje.trag;
  const eurekaKoeficijent = eureka.eurekaKoeficijent;
  const spektralnaGustina = spektar.spektralnaGustina;

  // Eksponat koeficijent — kombinacija eureke, centimentarnog sjedinjavanja i spektralne gustine
  const eksponatKoeficijent = Math.min(
    1,
    Math.max(
      0,
      round4(
        eurekaKoeficijent * 0.4 +
          ilustrovaniOktavniSistem.srazmernoCentimentarnoSjedinjavanje * 0.3 +
          spektralnaGustina * 0.3,
      ),
    ),
  );

  return {
    eksponatKoeficijent,
    ilustrovaniOktavniSistem,
    jezgroSnaga,
    egzocentricnost,
    matricnaSimetrija,
    eurekaKoeficijent,
    spektralnaGustina,
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
  };
}
