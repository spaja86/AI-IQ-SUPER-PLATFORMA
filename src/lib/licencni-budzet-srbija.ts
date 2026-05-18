import { APP_VERSION } from './constants';

export type LicencaStatus = 'aktivna-nabavka' | 'planirano' | 'odobreno';
export type LicencaPrioritet = 'visok' | 'srednji' | 'nizak';

export interface LicencnaStavkaSrbija {
  id: string;
  naziv: string;
  kategorija: string;
  regulator: string;
  periodVazenjaMeseci: number;
  godisnjiTrosakRSD: number;
  status: LicencaStatus;
  prioritet: LicencaPrioritet;
  rok: string;
}

export interface LicencniBudzetSrbijaRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  ukupanGodisnjiBudzetRSD: number;
  rezervisanoRSD: number;
  slobodnoRSD: number;
  stavke: LicencnaStavkaSrbija[];
  kpi: {
    ukupnoLicenci: number;
    aktivnaNabavka: number;
    prosecniTrosakRSD: number;
    visokiPrioritet: number;
  };
}

export function buildLicencniBudzetSrbija(userId: string): LicencniBudzetSrbijaRezultat {
  const stavke: LicencnaStavkaSrbija[] = [
    {
      id: 'nbs-platni-servisi',
      naziv: 'NBS licenca za platne servise',
      kategorija: 'Finansijska regulativa',
      regulator: 'Narodna banka Srbije',
      periodVazenjaMeseci: 12,
      godisnjiTrosakRSD: 3_600_000,
      status: 'aktivna-nabavka',
      prioritet: 'visok',
      rok: '2026-09-30',
    },
    {
      id: 'apu-zastita-podataka',
      naziv: 'Program usklađenosti zaštite podataka',
      kategorija: 'Privatnost i bezbednost',
      regulator: 'Poverenik za informacije od javnog značaja',
      periodVazenjaMeseci: 12,
      godisnjiTrosakRSD: 1_150_000,
      status: 'aktivna-nabavka',
      prioritet: 'visok',
      rok: '2026-08-15',
    },
    {
      id: 'iso-27001-audit',
      naziv: 'ISO 27001 sertifikacioni audit',
      kategorija: 'Bezbednosni standard',
      regulator: 'Akreditovano sertifikaciono telo',
      periodVazenjaMeseci: 12,
      godisnjiTrosakRSD: 920_000,
      status: 'planirano',
      prioritet: 'srednji',
      rok: '2026-11-20',
    },
    {
      id: 'aml-kyt-monitoring',
      naziv: 'AML/KYT monitoring licenca',
      kategorija: 'Sprečavanje pranja novca',
      regulator: 'Uprava za sprečavanje pranja novca',
      periodVazenjaMeseci: 12,
      godisnjiTrosakRSD: 1_780_000,
      status: 'odobreno',
      prioritet: 'visok',
      rok: '2026-07-10',
    },
    {
      id: 'e-fakture-integracija',
      naziv: 'Integracija sa sistemom eFaktura',
      kategorija: 'Poreska interoperabilnost',
      regulator: 'Ministarstvo finansija',
      periodVazenjaMeseci: 12,
      godisnjiTrosakRSD: 540_000,
      status: 'planirano',
      prioritet: 'nizak',
      rok: '2026-12-01',
    },
  ];

  const rezervisanoRSD = stavke.reduce((sum, s) => sum + s.godisnjiTrosakRSD, 0);
  const ukupanGodisnjiBudzetRSD = 10_000_000;
  const slobodnoRSD = Math.max(0, ukupanGodisnjiBudzetRSD - rezervisanoRSD);
  const aktivnaNabavka = stavke.filter((s) => s.status === 'aktivna-nabavka').length;
  const visokiPrioritet = stavke.filter((s) => s.prioritet === 'visok').length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    ukupanGodisnjiBudzetRSD,
    rezervisanoRSD,
    slobodnoRSD,
    stavke,
    kpi: {
      ukupnoLicenci: stavke.length,
      aktivnaNabavka,
      prosecniTrosakRSD: Math.round(rezervisanoRSD / stavke.length),
      visokiPrioritet,
    },
  };
}
