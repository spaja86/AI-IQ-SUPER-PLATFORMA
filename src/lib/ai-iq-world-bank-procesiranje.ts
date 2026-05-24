/**
 * 🏦 AI IQ WORLD BANK — Procesiranje Transakcija
 *
 * Aktivni sloj obrade: transakcije, kamatna obrada, AI fraud detekcija,
 * SWIFT/blockchain rutiranje i KPI procesiranja.
 *
 * Sve ostale komponente (sekvence, API rute) čitaju podatke isključivo odavde.
 */

import { APP_VERSION, KOMPANIJA } from './constants';
import { AIIQ_WORLD_BANK_KAMATNA_STOPA } from './ai-iq-world-bank';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const AIIQWB_PROC_SUCCESS_RATE = 99.7;
export const AIIQWB_PROC_AVG_TIME_MS = 43;
export const AIIQWB_PROC_PER_DAY = 12_000;

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type TransakcijaStatusTip = 'pending' | 'izvrsavanje' | 'potvrdjena' | 'odbijena';
export type RutingTip = 'SWIFT' | 'blockchain' | 'instant';
export type PipelineFaza = 'validacija' | 'odobrenje' | 'izvrsavanje' | 'settlement';

export interface TransakcijaStatus {
  id: string;
  iznos: number;
  valuta: string;
  status: TransakcijaStatusTip;
  tip: string;
  vrijemePocetkaMs: number;
  procesirano: boolean;
  fraudCheck: 'prosao' | 'blokiran' | 'na_pregledu';
}

export interface KamatnaIzracunavanje {
  ulog: number;
  valuta: string;
  stopaProcent: number;
  period: string;
  zarada: number;
  ukupno: number;
  statusObrade: 'aktivno' | 'zavrseno';
}

export interface RacunProcessing {
  racunId: string;
  tip: string;
  valuta: string;
  trenutnaFaza: PipelineFaza;
  faze: Array<{ naziv: PipelineFaza; status: 'zavrsena' | 'u_toku' | 'cekanje' }>;
}

export interface FraudCheckRezultat {
  transakcijaId: string;
  rezultat: 'ok' | 'upozorenje' | 'blokiran';
  sigurnostScore: number;
  razlog: string;
}

export interface RutingOdluka {
  transakcijaId: string;
  odabranaMetoda: RutingTip;
  obrazlozenje: string;
  procenjeniMs: number;
  provizija: string;
}

export interface KpiProcesiranja {
  transakcijaUDanu: number;
  uspesnostProcenata: number;
  prosecnoVremeMs: number;
  fraudBlokirano: number;
  swiftTransfera: number;
  blockchainTransfera: number;
  instantTransfera: number;
  aktivnihRacuna: number;
}

export interface AiIqWorldBankProcesiranjeRezultat {
  status: 'aktivan';
  sistem: string;
  kompanija: string;
  verzija: string;
  timestamp: string;
  transakcijeUObradi: TransakcijaStatus[];
  kamatnaObrada: KamatnaIzracunavanje[];
  racuniUObradi: RacunProcessing[];
  fraudChecks: FraudCheckRezultat[];
  rutingOdluke: RutingOdluka[];
  kpi: KpiProcesiranja;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildAiIqWorldBankProcesiranje(): AiIqWorldBankProcesiranjeRezultat {
  const transakcijeUObradi: TransakcijaStatus[] = [
    {
      id: 'TRX-PROC-001',
      iznos: 5_000,
      valuta: 'RSD',
      status: 'potvrdjena',
      tip: 'stedni-racun',
      vrijemePocetkaMs: 12,
      procesirano: true,
      fraudCheck: 'prosao',
    },
    {
      id: 'TRX-PROC-002',
      iznos: 500,
      valuta: 'EUR',
      status: 'izvrsavanje',
      tip: 'devizni-transfer',
      vrijemePocetkaMs: 38,
      procesirano: false,
      fraudCheck: 'prosao',
    },
    {
      id: 'TRX-PROC-003',
      iznos: 10_000,
      valuta: 'RSD',
      status: 'pending',
      tip: 'kredit-otplata',
      vrijemePocetkaMs: 0,
      procesirano: false,
      fraudCheck: 'na_pregledu',
    },
    {
      id: 'TRX-PROC-004',
      iznos: 250,
      valuta: 'USD',
      status: 'potvrdjena',
      tip: 'globalni-transfer',
      vrijemePocetkaMs: 55,
      procesirano: true,
      fraudCheck: 'prosao',
    },
    {
      id: 'TRX-PROC-005',
      iznos: 1_000,
      valuta: 'RSD',
      status: 'odbijena',
      tip: 'sumnjiva-aktivnost',
      vrijemePocetkaMs: 3,
      procesirano: true,
      fraudCheck: 'blokiran',
    },
  ];

  const kamatnaObrada: KamatnaIzracunavanje[] = [
    { ulog: 1_000, valuta: 'RSD', stopaProcent: AIIQWB_PROC_SUCCESS_RATE > 0 ? AIIQ_WORLD_BANK_KAMATNA_STOPA : 40, period: '30 dana', zarada: 400, ukupno: 1_400, statusObrade: 'aktivno' },
    { ulog: 5_000, valuta: 'RSD', stopaProcent: AIIQ_WORLD_BANK_KAMATNA_STOPA, period: '30 dana', zarada: 2_000, ukupno: 7_000, statusObrade: 'aktivno' },
    { ulog: 10_000, valuta: 'RSD', stopaProcent: AIIQ_WORLD_BANK_KAMATNA_STOPA, period: '30 dana', zarada: 4_000, ukupno: 14_000, statusObrade: 'aktivno' },
    { ulog: 50_000, valuta: 'RSD', stopaProcent: AIIQ_WORLD_BANK_KAMATNA_STOPA, period: '30 dana', zarada: 20_000, ukupno: 70_000, statusObrade: 'aktivno' },
    { ulog: 100_000, valuta: 'RSD', stopaProcent: AIIQ_WORLD_BANK_KAMATNA_STOPA, period: '30 dana', zarada: 40_000, ukupno: 140_000, statusObrade: 'zavrseno' },
  ];

  const racuniUObradi: RacunProcessing[] = [
    {
      racunId: 'RAC-RSD-001',
      tip: 'dinarski',
      valuta: 'RSD',
      trenutnaFaza: 'settlement',
      faze: [
        { naziv: 'validacija', status: 'zavrsena' },
        { naziv: 'odobrenje', status: 'zavrsena' },
        { naziv: 'izvrsavanje', status: 'zavrsena' },
        { naziv: 'settlement', status: 'u_toku' },
      ],
    },
    {
      racunId: 'RAC-EUR-002',
      tip: 'devizni',
      valuta: 'EUR',
      trenutnaFaza: 'odobrenje',
      faze: [
        { naziv: 'validacija', status: 'zavrsena' },
        { naziv: 'odobrenje', status: 'u_toku' },
        { naziv: 'izvrsavanje', status: 'cekanje' },
        { naziv: 'settlement', status: 'cekanje' },
      ],
    },
    {
      racunId: 'RAC-USD-003',
      tip: 'devizni',
      valuta: 'USD',
      trenutnaFaza: 'validacija',
      faze: [
        { naziv: 'validacija', status: 'u_toku' },
        { naziv: 'odobrenje', status: 'cekanje' },
        { naziv: 'izvrsavanje', status: 'cekanje' },
        { naziv: 'settlement', status: 'cekanje' },
      ],
    },
  ];

  const fraudChecks: FraudCheckRezultat[] = [
    { transakcijaId: 'TRX-PROC-001', rezultat: 'ok', sigurnostScore: 98, razlog: 'Regularni transfer štednog računa' },
    { transakcijaId: 'TRX-PROC-002', rezultat: 'ok', sigurnostScore: 95, razlog: 'Poznat korisnik, regularna suma' },
    { transakcijaId: 'TRX-PROC-003', rezultat: 'upozorenje', sigurnostScore: 72, razlog: 'Neobičan obrazac plaćanja, na pregledu' },
    { transakcijaId: 'TRX-PROC-004', rezultat: 'ok', sigurnostScore: 97, razlog: 'Verifikovani međunarodni transfer' },
    { transakcijaId: 'TRX-PROC-005', rezultat: 'blokiran', sigurnostScore: 18, razlog: 'Prijavljeni obrazac prevare — automatski blokiran' },
  ];

  const rutingOdluke: RutingOdluka[] = [
    { transakcijaId: 'TRX-PROC-001', odabranaMetoda: 'instant', obrazlozenje: 'Domaći RSD prenos — instant routing najbrži', procenjeniMs: 12, provizija: '0 RSD' },
    { transakcijaId: 'TRX-PROC-002', odabranaMetoda: 'SWIFT', obrazlozenje: 'EUR devizni transfer — SWIFT standardni kanal', procenjeniMs: 86_400_000, provizija: '5 EUR' },
    { transakcijaId: 'TRX-PROC-004', odabranaMetoda: 'blockchain', obrazlozenje: 'USD globalni transfer — Polygon blockchain za transparentnost', procenjeniMs: 120_000, provizija: '0.001 MATIC' },
  ];

  const kpi: KpiProcesiranja = {
    transakcijaUDanu: AIIQWB_PROC_PER_DAY,
    uspesnostProcenata: AIIQWB_PROC_SUCCESS_RATE,
    prosecnoVremeMs: AIIQWB_PROC_AVG_TIME_MS,
    fraudBlokirano: fraudChecks.filter((f) => f.rezultat === 'blokiran').length,
    swiftTransfera: rutingOdluke.filter((r) => r.odabranaMetoda === 'SWIFT').length,
    blockchainTransfera: rutingOdluke.filter((r) => r.odabranaMetoda === 'blockchain').length,
    instantTransfera: rutingOdluke.filter((r) => r.odabranaMetoda === 'instant').length,
    aktivnihRacuna: racuniUObradi.length,
  };

  return {
    status: 'aktivan',
    sistem: 'AI IQ World Bank — Procesiranje Transakcija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
    transakcijeUObradi,
    kamatnaObrada,
    racuniUObradi,
    fraudChecks,
    rutingOdluke,
    kpi,
  };
}
