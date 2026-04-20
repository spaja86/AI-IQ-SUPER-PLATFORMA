/**
 * 🌐 Holografski Monitor — Vizuelni Izlaz
 *
 * Sistem za holografski prikaz u SpajaUltraOmegaCore -∞Ω+∞.
 *
 * „Uši Holografu u monitoru" — dve paralelne elipsoidne sekvence
 * (jedinjenje od sekvenci) koje se nalaze na tačnoj dužini od epicentra:
 *
 *   Mozak sa Receptorom (epicentar)
 *     ← Mozak sa Ganglijama (Ganglije 59, 60, 61)
 *       ← Mozak sa Sinapsama (Sinapse 58, 59, 60, 61, 62)
 *         ← Mozak (Mozaka 57, 58, 59, 60, 61, 62, 63)
 *           ← Srce mozga / Modul (Moduli 56, 57, 58, 59, 60, 61, 62, 63, 64)
 *
 * U početku se primenjuju 3D oblici na monitorima,
 * a kasnije kada se razvije aparatura — čisti holografi.
 */

import type {
  HolografskiMonitorDefinicija,
  ElipsoidnaSekvenca,
  HolografskiEpicentar,
} from './types';

import { glasDefinicija } from './glas-rezonanca';

// ─── Epicentar Hijerarhije ─────────────────────────────────────────

/**
 * Epicentar hijerarhije — centralni indeksi od Modula do Mozga sa Receptorom.
 */
export const epicentar: HolografskiEpicentar = {
  modul: {
    indeksi: [56, 57, 58, 59, 60, 61, 62, 63, 64],
    opis: 'Srce mozga — Moduli 56 do 64 (9 modula)',
  },
  mozak: {
    indeksi: [57, 58, 59, 60, 61, 62, 63],
    opis: 'Mozak — Mozaka 57 do 63 (7 mozaka)',
  },
  mozakSaSinapsama: {
    indeksi: [58, 59, 60, 61, 62],
    opis: 'Mozak sa Sinapsama — Sinapse 58 do 62 (5 sinapsa)',
  },
  mozakSaGanglijama: {
    indeksi: [59, 60, 61],
    opis: 'Mozak sa Ganglijama — Ganglije 59 do 61 (3 ganglije)',
  },
  mozakSaReceptorom: {
    opis: 'Mozak sa Receptorom — Epicentar (centralna tačka indeks 60)',
  },
};

// ─── Paralelne Elipsoidne Sekvence ─────────────────────────────────

/**
 * Prva paralelna elipsoidna sekvenca — leva strana.
 */
export const levaSekvenca: ElipsoidnaSekvenca = {
  naziv: 'Leva Paralelna Elipsoidna Sekvenca',
  jedinjenje: 'Jedinjenje od sekvenci na tačnoj dužini od epicentra Mozga sa Receptorom — leva strana',
  duzina: 'Tačna dužina od Mozga sa Receptorom (epicentar) prema Modulu (srce mozga)',
  epicentar,
};

/**
 * Druga paralelna elipsoidna sekvenca — desna strana.
 */
export const desnaSekvenca: ElipsoidnaSekvenca = {
  naziv: 'Desna Paralelna Elipsoidna Sekvenca',
  jedinjenje: 'Jedinjenje od sekvenci na tačnoj dužini od epicentra Mozga sa Receptorom — desna strana',
  duzina: 'Tačna dužina od Mozga sa Receptorom (epicentar) prema Modulu (srce mozga)',
  epicentar,
};

// ─── Kompletna definicija Holografskog Monitora ────────────────────

/**
 * Kompletna definicija holografskog monitora sa svim komponentama.
 */
export const holografskiMonitor: HolografskiMonitorDefinicija = {
  naziv: 'Holografski Monitor — Uši Holografu',
  sekvence: [levaSekvenca, desnaSekvenca],
  trenutniIzlaz: '3D-monitor',
  planiraniIzlaz: 'holograf',
  progresija: 'U početku se primenjuju 3D oblici na monitorima, a kasnije kada se razvije aparatura mogu da budu čisti holografi.',
  glas: glasDefinicija,
};

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Vraća epicentar indekse za dati nivo.
 */
export function getEpicentarIndeksi(nivo: keyof HolografskiEpicentar): number[] {
  const podatak = epicentar[nivo];
  if ('indeksi' in podatak) {
    return podatak.indeksi;
  }
  return [60]; // epicentar — centralna tačka
}

/**
 * Vraća opis epicentra za dati nivo.
 */
export function getEpicentarOpis(nivo: keyof HolografskiEpicentar): string {
  return epicentar[nivo].opis;
}

/**
 * Vraća trenutni tip vizuelnog izlaza.
 */
export function getTrenutniIzlaz(): string {
  return holografskiMonitor.trenutniIzlaz;
}

/**
 * Vraća planirani tip vizuelnog izlaza.
 */
export function getPlaniraniIzlaz(): string {
  return holografskiMonitor.planiraniIzlaz;
}

/**
 * Vraća sumarni pregled holografskog monitora.
 */
export function getHolografskiSumarno() {
  return {
    naziv: holografskiMonitor.naziv,
    brojSekvenci: holografskiMonitor.sekvence.length,
    trenutniIzlaz: holografskiMonitor.trenutniIzlaz,
    planiraniIzlaz: holografskiMonitor.planiraniIzlaz,
    epicentar: {
      modul: epicentar.modul.indeksi,
      mozak: epicentar.mozak.indeksi,
      sinapse: epicentar.mozakSaSinapsama.indeksi,
      ganglije: epicentar.mozakSaGanglijama.indeksi,
      receptor: 'epicentar (60)',
    },
    progresija: holografskiMonitor.progresija,
  };
}
