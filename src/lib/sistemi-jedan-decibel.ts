const ZILIJARDA_FAKTOR = 10n ** 21n;
const PODRAZUMEVANI_BROJ_SISTEMA = 789n * ZILIJARDA_FAKTOR;

export type StatusValidacije = 'validno' | 'nevalidno';
export type StatusAudita = 'ok' | 'upozorenje' | 'greska';
export type AkcijaAudita =
  | 'generisanje'
  | 'validacija'
  | 'odstupanje'
  | 'ponovno-racunanje'
  | 'periodicna-provera'
  | 'prosirenje-modela';

export interface DefinicijaSistema {
  naziv: string;
  opis: string;
  ulaz: string[];
  izlaz: string[];
  granice: {
    minIndex: bigint;
    maxIndex: bigint;
  };
}

export interface ModelMerenjaDb {
  jedinica: 'dB';
  referentniNivoDb: bigint;
  korakDb: 1n;
  tolerancijaDb: number;
}

export interface VirtualniSkup {
  tip: 'parametarski';
  ukupnoSistema: bigint;
  faktorZilijarda: bigint;
  kolicinaZapisa: 'virtuelno';
  formula: 'nivoDb(i) = referentniNivoDb + i';
}

export interface Segment {
  indeks: bigint;
  odIndexa: bigint;
  doIndexa: bigint;
  brojStavki: bigint;
}

export interface SistemVarijanta {
  index: bigint;
  dbNivo: bigint;
  ulaz: {
    referentniNivoDb: bigint;
    korakDb: 1n;
    index: bigint;
  };
  izlaz: {
    dbNivo: bigint;
    oznaka: string;
  };
}

export interface ValidacijaKonzistentnosti {
  status: StatusValidacije;
  praviloJedanDb: {
    validno: boolean;
    ocekivanaRazlikaDb: 1n;
    stvarnaRazlikaDb: bigint;
    tolerancijaDb: number;
  };
  kardinalnost: {
    validno: boolean;
    ocekivanoUkupno: bigint;
    trenutnoUkupno: bigint;
  };
}

export interface AuditPravila {
  obaveznaPolja: Array<'timestamp' | 'akcija' | 'segment' | 'status' | 'poruka'>;
  dozvoljeneAkcije: AkcijaAudita[];
}

export interface AuditZapis {
  timestamp: string;
  akcija: AkcijaAudita;
  segment: Segment;
  status: StatusAudita;
  poruka: string;
}

export interface OperativniPlanOdrzavanja {
  ponovnoRacunanje: 'na-zahtev-ili-pri-promeni-parametara';
  periodicneProvere: 'dnevno-validacija-segmenata';
  prosirenjeModela: 'samo-uz-zadrzavanje-koraka-1db';
}

export interface SistemJedanDecibelModel {
  definicija: DefinicijaSistema;
  merenjeDb: ModelMerenjaDb;
  virtualniSkup: VirtualniSkup;
  auditPravila: AuditPravila;
  operativniPlan: OperativniPlanOdrzavanja;
}

function assertIndex(index: bigint, minIndex: bigint, maxIndex: bigint): void {
  if (index < minIndex || index > maxIndex) {
    throw new Error(`Index ${index.toString()} je van opsega [${minIndex.toString()}, ${maxIndex.toString()}].`);
  }
}

function assertPozitivanSegment(segmentSize: bigint): void {
  if (segmentSize <= 0n) {
    throw new Error('Veličina segmenta mora biti > 0.');
  }
}

export function createSistemiJedanDecibelModel(config?: {
  nazivSistema?: string;
  opisSistema?: string;
  referentniNivoDb?: bigint;
  tolerancijaDb?: number;
  ukupnoSistema?: bigint;
}): SistemJedanDecibelModel {
  const ukupnoSistema = config?.ukupnoSistema ?? PODRAZUMEVANI_BROJ_SISTEMA;
  if (ukupnoSistema <= 0n) {
    throw new Error('ukupnoSistema mora biti > 0.');
  }

  const minIndex = 0n;
  const maxIndex = ukupnoSistema - 1n;
  const referentniNivoDb = config?.referentniNivoDb ?? 0n;
  const tolerancijaDb = config?.tolerancijaDb ?? 0.0001;

  return {
    definicija: {
      naziv: config?.nazivSistema ?? 'Sistemi Jedan Decibel',
      opis:
        config?.opisSistema ??
        'Parametarski model sistema gde svaka uzastopna varijanta ima razliku od tačno 1 dB.',
      ulaz: ['referentniNivoDb', 'korakDb', 'index'],
      izlaz: ['dbNivo', 'oznaka'],
      granice: {
        minIndex,
        maxIndex,
      },
    },
    merenjeDb: {
      jedinica: 'dB',
      referentniNivoDb,
      korakDb: 1n,
      tolerancijaDb,
    },
    virtualniSkup: {
      tip: 'parametarski',
      ukupnoSistema,
      faktorZilijarda: ZILIJARDA_FAKTOR,
      kolicinaZapisa: 'virtuelno',
      formula: 'nivoDb(i) = referentniNivoDb + i',
    },
    auditPravila: {
      obaveznaPolja: ['timestamp', 'akcija', 'segment', 'status', 'poruka'],
      dozvoljeneAkcije: [
        'generisanje',
        'validacija',
        'odstupanje',
        'ponovno-racunanje',
        'periodicna-provera',
        'prosirenje-modela',
      ],
    },
    operativniPlan: {
      ponovnoRacunanje: 'na-zahtev-ili-pri-promeni-parametara',
      periodicneProvere: 'dnevno-validacija-segmenata',
      prosirenjeModela: 'samo-uz-zadrzavanje-koraka-1db',
    },
  };
}

export function getSistemByIndex(model: SistemJedanDecibelModel, index: bigint): SistemVarijanta {
  const { minIndex, maxIndex } = model.definicija.granice;
  assertIndex(index, minIndex, maxIndex);

  const dbNivo = model.merenjeDb.referentniNivoDb + index;
  return {
    index,
    dbNivo,
    ulaz: {
      referentniNivoDb: model.merenjeDb.referentniNivoDb,
      korakDb: 1n,
      index,
    },
    izlaz: {
      dbNivo,
      oznaka: `SISTEM-${index.toString()}`,
    },
  };
}

export function getSegment(model: SistemJedanDecibelModel, segmentIndex: bigint, segmentSize: bigint): Segment {
  assertPozitivanSegment(segmentSize);

  const { minIndex, maxIndex } = model.definicija.granice;
  const ukupno = model.virtualniSkup.ukupnoSistema;
  const maxSegmentIndex = (ukupno - 1n) / segmentSize;
  assertIndex(segmentIndex, 0n, maxSegmentIndex);

  const odIndexa = minIndex + segmentIndex * segmentSize;
  const doIndexa = odIndexa + segmentSize - 1n > maxIndex ? maxIndex : odIndexa + segmentSize - 1n;
  const brojStavki = doIndexa - odIndexa + 1n;

  return {
    indeks: segmentIndex,
    odIndexa,
    doIndexa,
    brojStavki,
  };
}

export function validateKonzistentnost(
  model: SistemJedanDecibelModel,
  indexA: bigint,
  indexB: bigint,
): ValidacijaKonzistentnosti {
  const sistemA = getSistemByIndex(model, indexA);
  const sistemB = getSistemByIndex(model, indexB);
  const stvarnaRazlikaDb = sistemB.dbNivo - sistemA.dbNivo;
  const ocekivanaRazlikaDb = indexB - indexA;

  const praviloJedanDb = indexB - indexA === 1n && stvarnaRazlikaDb === 1n && stvarnaRazlikaDb === ocekivanaRazlikaDb;

  const kardinalnostValidna = model.virtualniSkup.ukupnoSistema === model.definicija.granice.maxIndex + 1n;
  const status: StatusValidacije = praviloJedanDb && kardinalnostValidna ? 'validno' : 'nevalidno';

  return {
    status,
    praviloJedanDb: {
      validno: praviloJedanDb,
      ocekivanaRazlikaDb: 1n,
      stvarnaRazlikaDb,
      tolerancijaDb: model.merenjeDb.tolerancijaDb,
    },
    kardinalnost: {
      validno: kardinalnostValidna,
      ocekivanoUkupno: model.virtualniSkup.ukupnoSistema,
      trenutnoUkupno: model.definicija.granice.maxIndex + 1n,
    },
  };
}

export function createAuditZapis(
  model: SistemJedanDecibelModel,
  input: {
    akcija: AkcijaAudita;
    segment: Segment;
    status: StatusAudita;
    poruka: string;
    timestamp?: string;
  },
): AuditZapis {
  if (!model.auditPravila.dozvoljeneAkcije.includes(input.akcija)) {
    throw new Error(`Akcija ${input.akcija} nije dozvoljena audit pravilima.`);
  }

  return {
    timestamp: input.timestamp ?? new Date().toISOString(),
    akcija: input.akcija,
    segment: input.segment,
    status: input.status,
    poruka: input.poruka,
  };
}
