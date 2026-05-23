export type ProtokolKategorija =
  | 'komunikacioni'
  | 'bezbednosni'
  | 'poslovni'
  | 'operativni'
  | 'autentifikacioni'
  | 'transfer';

export type ProtokolStatus = 'aktivan' | 'neaktivan' | 'deprecated' | 'u-testu' | 'incident';

export type ProtokolDogadjajTip = 'start' | 'end' | 'error' | 'verifikacija' | 'update';

export interface Protokol {
  id: string;
  naziv: string;
  verzija: string;
  kategorija: ProtokolKategorija;
  status: ProtokolStatus;
  opis: string;
  kapacitet: string;
  latency: string;
  kreiran: string;
  azuriran: string;
  vlasnickiModul: string;
  izvor: 'spaja-protokoli' | 'autofinish-protokol-verifikacija' | 'vlasnicki-vip-plan-dispatch-protokoli';
}

export interface ProtokolDogadjaj {
  tip: ProtokolDogadjajTip;
  timestamp: string;
  userId?: string;
  detalji?: Record<string, unknown>;
}

export interface ProtokolCheckRezultat {
  naziv: string;
  prolaz: boolean;
  poruka: string;
  durationMs: number;
}

export interface VerifikacijaRezultat {
  protokolId: string;
  uspesno: boolean;
  ukupnoProvera: number;
  uspesneProvere: number;
  neuspesneProvere: number;
  checks: ProtokolCheckRezultat[];
  timestamp: string;
}

export interface ProtokolFilter {
  kategorija?: ProtokolKategorija;
  status?: ProtokolStatus;
}

export interface AuditZapis {
  id: string;
  protokolId: string;
  tip: ProtokolDogadjajTip;
  userId?: string;
  reqId: string;
  pre?: Record<string, unknown>;
  posle?: Record<string, unknown>;
  timestamp: string;
}
