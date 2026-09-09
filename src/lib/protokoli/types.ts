export type ProtokolKategorija =
  | 'komunikacioni'
  | 'bezbednosni'
  | 'poslovni'
  | 'operativni'
  | 'autentifikacioni'
  | 'transfer';

export type ProtokolStatus = 'aktivan' | 'neaktivan' | 'deprecated' | 'u-testu' | 'incident';

export type ProtokolDogadjajTip = 'start' | 'end' | 'error' | 'verifikacija' | 'update';

export type ProtokolIzvor =
  | 'spaja-protokoli'
  | 'autofinish-protokol-verifikacija'
  | 'vlasnicki-vip-plan-dispatch-protokoli';

export type ProtokolKriticnost = 'niska' | 'srednja' | 'visoka' | 'kriticna';

export type ProtokolOkruzenje = 'razvoj' | 'staging' | 'produkcija' | 'hibridno';

export type ProtokolProveraSloj =
  | 'struktura'
  | 'bezbednost'
  | 'autentifikacija'
  | 'performanse'
  | 'integracija'
  | 'compliance';

export type ProtokolPromenaTip = 'predlog' | 'odobrenje' | 'incident' | 'rollback';

export type ProtokolPromenaStanje = 'na-cekanju' | 'odobreno' | 'odbijeno' | 'izvrseno';

export interface ProtokolVlasnik {
  tim: string;
  kontakt: string;
  uloga: string;
}

export interface ProtokolSlo {
  latencyTargetMs: number;
  availabilityTargetPct: number;
  maxIncidentResponseMin: number;
}

export interface ProtokolRuntimeSnapshot {
  poslednjaVerifikacija: ProtokolVerificationSnapshot | null;
  poslednjaUspesnaVerifikacijaAt: string | null;
  poslednjaNeuspesnaVerifikacijaAt: string | null;
  pendingPromene: number;
}

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
  izvor: ProtokolIzvor;
  vlasnik: ProtokolVlasnik;
  kriticnost: ProtokolKriticnost;
  okruzenje: ProtokolOkruzenje;
  zavisnosti: string[];
  slo: ProtokolSlo;
  sourceOfTruth: string;
  runtime?: ProtokolRuntimeSnapshot;
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
  sloj: ProtokolProveraSloj;
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

export interface ProtokolVerificationSnapshot {
  protokolId: string;
  status: 'uspesno' | 'neuspesno';
  timestamp: string;
  ukupnoProvera: number;
  uspesneProvere: number;
  neuspesneProvere: number;
  failedChecks: string[];
  slojevi: Record<ProtokolProveraSloj, { ukupno: number; uspesno: number }>;
}

export interface ProtokolStatusPromena {
  id: string;
  protokolId: string;
  prethodniStatus: ProtokolStatus;
  noviStatus: ProtokolStatus;
  razlog: string;
  tip: ProtokolPromenaTip;
  stanje: ProtokolPromenaStanje;
  requestedBy?: string;
  approvedBy?: string;
  rollbackStatus?: ProtokolStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProtokolFilter {
  kategorija?: ProtokolKategorija;
  status?: ProtokolStatus;
  izvor?: ProtokolIzvor;
  kriticnost?: ProtokolKriticnost;
  okruzenje?: ProtokolOkruzenje;
  vlasnikTim?: string;
  q?: string;
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
