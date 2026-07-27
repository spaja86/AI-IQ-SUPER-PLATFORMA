import { APP_VERSION, KOMPANIJA } from './constants';

export type ObservatorijaStatus = 'aktivan' | 'planiran';
export type InstrumentStatus = 'aktivan' | 'odrzavanje' | 'pasivan';
export type MetaPrioritet = 'kritican' | 'visok' | 'srednji';
export type SesijaStatus = 'zavrsena' | 'u_toku' | 'planirana';
export type AlarmStatus = 'otvoren' | 'u_obradi' | 'zatvoren';

export interface ObservatorijaInstrument {
  id: string;
  naziv: string;
  tip: string;
  status: InstrumentStatus;
  opseg: string;
  lokacija: string;
  preciznost: number;
}

export interface ObservatorijaMeta {
  id: string;
  naziv: string;
  tip: string;
  prioritet: MetaPrioritet;
  magnituda: string;
  vidljivost: string;
}

export interface ObservatorijaSesija {
  id: string;
  naziv: string;
  metaId: string;
  instrumentId: string;
  status: SesijaStatus;
  trajanje: string;
  signal: number;
  timestamp: string;
}

export interface ObservatorijaAlarm {
  id: string;
  naziv: string;
  status: AlarmStatus;
  ozbiljnost: 'niska' | 'srednja' | 'visoka';
  opis: string;
}

export interface ObservatorijaStatistika {
  ukupnoInstrumenata: number;
  aktivnihInstrumenata: number;
  ukupnoMeta: number;
  kriticnihMeta: number;
  ukupnoSesija: number;
  aktivnihSesija: number;
  otvorenihAlarma: number;
  prosecniSignal: number;
}

export interface DigitalnaObservatorija {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  status: ObservatorijaStatus;
  link: string;
  instrumenti: ObservatorijaInstrument[];
  mete: ObservatorijaMeta[];
  sesije: ObservatorijaSesija[];
  alarmi: ObservatorijaAlarm[];
  mogucnosti: string[];
  statistika: ObservatorijaStatistika;
}

export const observatorijaInstrumenti: ObservatorijaInstrument[] = [
  {
    id: 'inst-optika-001',
    naziv: 'Spaja Optički Teleskop A1',
    tip: 'optički',
    status: 'aktivan',
    opseg: '380-750nm',
    lokacija: 'Node Sever-1',
    preciznost: 96,
  },
  {
    id: 'inst-radio-002',
    naziv: 'Spaja Radio Array R2',
    tip: 'radio',
    status: 'aktivan',
    opseg: '30MHz-3GHz',
    lokacija: 'Node Istok-4',
    preciznost: 94,
  },
  {
    id: 'inst-spektar-003',
    naziv: 'Spaja Spektralni Analizator S3',
    tip: 'spektar',
    status: 'odrzavanje',
    opseg: 'UV/IR',
    lokacija: 'Node Centar-2',
    preciznost: 89,
  },
  {
    id: 'inst-planetarni-004',
    naziv: 'Spaja Planetarni Tracker P4',
    tip: 'planetarni',
    status: 'aktivan',
    opseg: 'Objekti Sunčevog sistema',
    lokacija: 'Node Jug-3',
    preciznost: 92,
  },
];

export const observatorijaMete: ObservatorijaMeta[] = [
  {
    id: 'meta-jupiter',
    naziv: 'Jupiter',
    tip: 'planeta',
    prioritet: 'visok',
    magnituda: '-2.3',
    vidljivost: 'visoka',
  },
  {
    id: 'meta-m31',
    naziv: 'Andromeda (M31)',
    tip: 'galaksija',
    prioritet: 'srednji',
    magnituda: '3.4',
    vidljivost: 'srednja',
  },
  {
    id: 'meta-betelgeuse',
    naziv: 'Betelgeuse',
    tip: 'zvezda',
    prioritet: 'kritican',
    magnituda: '0.5',
    vidljivost: 'visoka',
  },
  {
    id: 'meta-neowise',
    naziv: 'C/2020 F3 (NEOWISE)',
    tip: 'kometa',
    prioritet: 'visok',
    magnituda: '2.1',
    vidljivost: 'srednja',
  },
];

export const observatorijaSesije: ObservatorijaSesija[] = [
  {
    id: 'sesija-001',
    naziv: 'Noćno mapiranje Jupitera',
    metaId: 'meta-jupiter',
    instrumentId: 'inst-planetarni-004',
    status: 'zavrsena',
    trajanje: '02h 10m',
    signal: 98,
    timestamp: '2026-07-20T22:10:00Z',
  },
  {
    id: 'sesija-002',
    naziv: 'Spektralna analiza Betelgeuse',
    metaId: 'meta-betelgeuse',
    instrumentId: 'inst-optika-001',
    status: 'u_toku',
    trajanje: '01h 05m',
    signal: 91,
    timestamp: '2026-07-26T23:40:00Z',
  },
  {
    id: 'sesija-003',
    naziv: 'Radio skeniranje Andromede',
    metaId: 'meta-m31',
    instrumentId: 'inst-radio-002',
    status: 'planirana',
    trajanje: '03h 00m',
    signal: 0,
    timestamp: '2026-07-28T01:00:00Z',
  },
];

export const observatorijaAlarmi: ObservatorijaAlarm[] = [
  {
    id: 'alarm-001',
    naziv: 'Spektralni drift kalibracije',
    status: 'u_obradi',
    ozbiljnost: 'srednja',
    opis: 'Potrebna recalibracija spektralnog modula S3 pre sledeće sesije.',
  },
  {
    id: 'alarm-002',
    naziv: 'Signal noise spike',
    status: 'otvoren',
    ozbiljnost: 'niska',
    opis: 'Detektovan kratkotrajan porast šuma na radio opsegu.',
  },
];

const observatorijaMogucnosti: string[] = [
  'Read-only katalog instrumenata i nebeskih meta',
  'Operativni pregled sesija posmatranja i statusa',
  'Praćenje alarmnih i anomalnih događaja',
  'Sažetak metrika za dashboard i dijagnostiku',
  'Integracija sa Glavnim Endžinom i Auto-Popravkom',
  `Sekvencijalni UI modul unutar ${KOMPANIJA} ekosistema`,
];

function izracunajStatistiku(): ObservatorijaStatistika {
  const aktivnihInstrumenata = observatorijaInstrumenti.filter((i) => i.status === 'aktivan').length;
  const kriticnihMeta = observatorijaMete.filter((m) => m.prioritet === 'kritican').length;
  const aktivnihSesija = observatorijaSesije.filter((s) => s.status === 'u_toku').length;
  const otvorenihAlarma = observatorijaAlarmi.filter((a) => a.status !== 'zatvoren').length;
  const sesijeSaSignalom = observatorijaSesije.filter((s) => s.signal > 0);
  const prosecniSignal = sesijeSaSignalom.length > 0
    ? Math.round(sesijeSaSignalom.reduce((acc, s) => acc + s.signal, 0) / sesijeSaSignalom.length)
    : 0;

  return {
    ukupnoInstrumenata: observatorijaInstrumenti.length,
    aktivnihInstrumenata,
    ukupnoMeta: observatorijaMete.length,
    kriticnihMeta,
    ukupnoSesija: observatorijaSesije.length,
    aktivnihSesija,
    otvorenihAlarma,
    prosecniSignal,
  };
}

export const digitalnaObservatorija: DigitalnaObservatorija = {
  naziv: 'Digitalna Observatorija',
  opis: `Astronomski AI modul za nebeska posmatranja, operativni nadzor instrumenata i sesija — ${KOMPANIJA}`,
  ikona: '🔭',
  verzija: APP_VERSION,
  status: 'aktivan',
  link: 'https://chatgpt.com/c/observatorija-digitalna',
  instrumenti: observatorijaInstrumenti,
  mete: observatorijaMete,
  sesije: observatorijaSesije,
  alarmi: observatorijaAlarmi,
  mogucnosti: observatorijaMogucnosti,
  statistika: izracunajStatistiku(),
};

export function getAktivniInstrumenti(): ObservatorijaInstrument[] {
  return observatorijaInstrumenti.filter((instrument) => instrument.status === 'aktivan');
}

export function getMetePoPrioritetu(prioritet: MetaPrioritet): ObservatorijaMeta[] {
  return observatorijaMete.filter((meta) => meta.prioritet === prioritet);
}

export function getSesijePoStatusu(status: SesijaStatus): ObservatorijaSesija[] {
  return observatorijaSesije.filter((sesija) => sesija.status === status);
}

export function getOtvoreneAlarme(): ObservatorijaAlarm[] {
  return observatorijaAlarmi.filter((alarm) => alarm.status !== 'zatvoren');
}

export function getObservatorijaStatistika(): ObservatorijaStatistika {
  return izracunajStatistiku();
}

export function getObservatorijaPregled(): {
  naziv: string;
  verzija: string;
  status: ObservatorijaStatus;
  ukupnoInstrumenata: number;
  aktivnihInstrumenata: number;
  ukupnoMeta: number;
  kriticnihMeta: number;
  ukupnoSesija: number;
  aktivnihSesija: number;
  otvorenihAlarma: number;
  prosecniSignal: number;
  ukupnoMogucnosti: number;
} {
  const statistika = izracunajStatistiku();

  return {
    naziv: digitalnaObservatorija.naziv,
    verzija: digitalnaObservatorija.verzija,
    status: digitalnaObservatorija.status,
    ukupnoInstrumenata: statistika.ukupnoInstrumenata,
    aktivnihInstrumenata: statistika.aktivnihInstrumenata,
    ukupnoMeta: statistika.ukupnoMeta,
    kriticnihMeta: statistika.kriticnihMeta,
    ukupnoSesija: statistika.ukupnoSesija,
    aktivnihSesija: statistika.aktivnihSesija,
    otvorenihAlarma: statistika.otvorenihAlarma,
    prosecniSignal: statistika.prosecniSignal,
    ukupnoMogucnosti: observatorijaMogucnosti.length,
  };
}
