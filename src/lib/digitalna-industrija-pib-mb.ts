import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { companies } from '@/lib/companies';
import { platforms } from '@/lib/platforms';
import type { PibMbRegistar, PibMbRegistarStavka } from '@/lib/types';

export interface DigitalnaIndustrijaPibMbEntitet {
  id: string;
  naziv: string;
  tip: 'digitalna-industrija' | 'kompanija' | 'platforma';
  pib: string;
  maticniBroj: string;
  statusZahteva: 'hitna_procedura';
  napomena: string;
}

export interface HitnaProceduraZahtev {
  id: string;
  entitetId: string;
  entitetNaziv: string;
  instanca: 'APR — Agencija za Privredne Registre' | 'Poreska Uprava Srbije';
  tip: 'registracija_mb' | 'dodela_pib';
  prioritet: 'HITAN';
  status: 'spreman_za_slanje';
  statusZahteva: 'hitna_procedura';
  zahtevSlat: boolean;
}

export interface DigitalnaIndustrijaPibMbRezultat {
  status: 'aktivan';
  verzija: string;
  kompanija: string;
  userId: string;
  timestamp: string;
  zahtevSlat: boolean;
  digitalnaIndustrija: {
    naziv: string;
    pib: string;
    maticniBroj: string;
    statusZahteva: 'hitna_procedura';
    napomena: string;
  };
  entiteti: DigitalnaIndustrijaPibMbEntitet[];
  zahtevi: HitnaProceduraZahtev[];
  registar: PibMbRegistar;
  preporuke: string[];
}

const ROOT_DIGITALNA_INDUSTRIJA: PibMbRegistarStavka = {
  id: 'digitalna-industrija',
  naziv: 'Digitalna Industrija (Kompanija SPAJA — matični entitet)',
  tip: 'digitalna-industrija',
  pib: 'ZAHTEV_U_TOKU-PIB-100000001',
  maticniBroj: 'ZAHTEV_U_TOKU-MB-200000001',
  statusZahteva: 'hitna_procedura',
  napomena: 'Čeka dodelu zvaničnog PIB i M/B od nadležnih institucija.',
};

function numerickiSuffix(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33 + seed.charCodeAt(i)) % 1_000_000_000;
  }
  return String(hash).padStart(9, '0');
}

function buildPlaceholderPib(entitetId: string): string {
  return `ZAHTEV_U_TOKU-PIB-${numerickiSuffix(`PIB:${entitetId}`)}`;
}

function buildPlaceholderMb(entitetId: string): string {
  return `ZAHTEV_U_TOKU-MB-${numerickiSuffix(`MB:${entitetId}`)}`;
}

function kompanijeRegistarStavke(): PibMbRegistarStavka[] {
  return companies.map((company) => ({
    id: company.id,
    naziv: company.name,
    tip: 'kompanija',
    pib: company.pib ?? buildPlaceholderPib(company.id),
    maticniBroj: company.maticniBroj ?? buildPlaceholderMb(company.id),
    statusZahteva: 'hitna_procedura',
    napomena: 'Poseban PIB i M/B za entitet u Digitalnoj Industriji — hitna procedura.',
  }));
}

function platformeRegistarStavke(): PibMbRegistarStavka[] {
  return platforms.map((platform) => ({
    id: platform.id,
    naziv: platform.name,
    tip: 'platforma',
    pib: platform.pib ?? buildPlaceholderPib(platform.id),
    maticniBroj: platform.maticniBroj ?? buildPlaceholderMb(platform.id),
    statusZahteva: 'hitna_procedura',
    napomena: 'Poseban PIB i M/B za platformu unutar Digitalne Industrije — hitna procedura.',
  }));
}

export function buildPibMbRegistar(): PibMbRegistar {
  return {
    status: 'aktivan',
    azurirano: new Date().toISOString(),
    digitalnaIndustrija: ROOT_DIGITALNA_INDUSTRIJA,
    kompanije: kompanijeRegistarStavke(),
    platforme: platformeRegistarStavke(),
  };
}

export function getPrimarniPibMbDigitalneIndustrije(): { pib: string; maticniBroj: string } {
  return {
    pib: ROOT_DIGITALNA_INDUSTRIJA.pib,
    maticniBroj: ROOT_DIGITALNA_INDUSTRIJA.maticniBroj,
  };
}

function buildHitnaProceduraZahtevi(entiteti: DigitalnaIndustrijaPibMbEntitet[]): HitnaProceduraZahtev[] {
  return entiteti.flatMap((entitet) => ([
    {
      id: `zahtev-apr-${entitet.id}`,
      entitetId: entitet.id,
      entitetNaziv: entitet.naziv,
      instanca: 'APR — Agencija za Privredne Registre',
      tip: 'registracija_mb',
      prioritet: 'HITAN',
      status: 'spreman_za_slanje',
      statusZahteva: 'hitna_procedura',
      zahtevSlat: false,
    },
    {
      id: `zahtev-poreska-${entitet.id}`,
      entitetId: entitet.id,
      entitetNaziv: entitet.naziv,
      instanca: 'Poreska Uprava Srbije',
      tip: 'dodela_pib',
      prioritet: 'HITAN',
      status: 'spreman_za_slanje',
      statusZahteva: 'hitna_procedura',
      zahtevSlat: false,
    },
  ]));
}

export function buildDigitalnaIndustrijaPibMb(userId = 'public'): DigitalnaIndustrijaPibMbRezultat {
  const registar = buildPibMbRegistar();
  const entiteti: DigitalnaIndustrijaPibMbEntitet[] = [
    {
      id: registar.digitalnaIndustrija.id,
      naziv: registar.digitalnaIndustrija.naziv,
      tip: registar.digitalnaIndustrija.tip,
      pib: registar.digitalnaIndustrija.pib,
      maticniBroj: registar.digitalnaIndustrija.maticniBroj,
      statusZahteva: 'hitna_procedura',
      napomena: registar.digitalnaIndustrija.napomena ?? 'Hitna procedura u toku.',
    },
    ...registar.kompanije.map((stavka): DigitalnaIndustrijaPibMbEntitet => ({
      id: stavka.id,
      naziv: stavka.naziv,
      tip: stavka.tip,
      pib: stavka.pib,
      maticniBroj: stavka.maticniBroj,
      statusZahteva: 'hitna_procedura',
      napomena: stavka.napomena ?? 'Hitna procedura u toku.',
    })),
    ...registar.platforme.map((stavka): DigitalnaIndustrijaPibMbEntitet => ({
      id: stavka.id,
      naziv: stavka.naziv,
      tip: stavka.tip,
      pib: stavka.pib,
      maticniBroj: stavka.maticniBroj,
      statusZahteva: 'hitna_procedura',
      napomena: stavka.napomena ?? 'Hitna procedura u toku.',
    })),
  ];

  const zahtevi = buildHitnaProceduraZahtevi(entiteti);

  return {
    status: 'aktivan',
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
    userId,
    timestamp: new Date().toISOString(),
    zahtevSlat: false,
    digitalnaIndustrija: {
      naziv: registar.digitalnaIndustrija.naziv,
      pib: registar.digitalnaIndustrija.pib,
      maticniBroj: registar.digitalnaIndustrija.maticniBroj,
      statusZahteva: 'hitna_procedura',
      napomena: registar.digitalnaIndustrija.napomena ?? 'Hitna procedura u toku.',
    },
    entiteti,
    zahtevi,
    registar,
    preporuke: [
      'Podneti sve APR zahteve za M/B istog dana kroz režim HITNA PROCEDURA.',
      'Podneti sve zahteve ka Poreskoj Upravi za PIB odmah nakon APR potvrde prijema.',
      'Do dobijanja zvaničnih brojeva držati oznaku ZAHTEV_U_TOKU u svim sistemima i izveštajima.',
      'Po dodeli zvaničnih brojeva ažurirati centralni registar i propagirati izmene na sve API/module.',
    ],
  };
}
