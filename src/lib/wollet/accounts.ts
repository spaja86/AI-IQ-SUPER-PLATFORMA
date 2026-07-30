import type { WolletAccount } from './types';

/**
 * Kanonske definicije AI IQ World Bank računa.
 * Usklađeno sa AIIQWorldBank.sol konstruktorom.
 */
export const WOLLET_RACUNI: WolletAccount[] = [
  {
    brojRacuna: 'DIGI-IND-001',
    naziv: 'Digitalna Industrija — Dinarski',
    valuta: 'RSD',
    stanjeMinor: 0,
    aktivan: true,
  },
  {
    brojRacuna: 'DIGI-IND-002-EUR',
    naziv: 'Digitalna Industrija — Devizni EUR',
    valuta: 'EUR',
    stanjeMinor: 0,
    aktivan: true,
  },
  {
    brojRacuna: 'DIGI-IND-003-USD',
    naziv: 'Digitalna Industrija — Devizni USD',
    valuta: 'USD',
    stanjeMinor: 112_700_000,  // $1,127,000 * 100 centi = ukupno nabavki (zbir svih 50)
    aktivan: true,
  },
];

export function getWolletRacun(brojRacuna: string): WolletAccount | undefined {
  return WOLLET_RACUNI.find((r) => r.brojRacuna === brojRacuna);
}

export function getAktivniRacuni(): WolletAccount[] {
  return WOLLET_RACUNI.filter((r) => r.aktivan);
}
