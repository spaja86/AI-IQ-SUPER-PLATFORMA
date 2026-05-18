import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import {
  buildAIIQWorldBankLicencniRegistar,
  getLicencniComplianceIzvestaj,
  type LicencaRizik,
} from '@/lib/aiiq-world-bank-licencni-registar';

export type BudzetKategorija =
  | 'regulatorna_nbs'
  | 'regulatorna_komisija'
  | 'regulatorna_aml_dpo'
  | 'softverska'
  | 'operativna'
  | 'ostalo';

export type PlacanjeModel = 'jednokratno' | 'godisnje' | 'mesecno';

export type BudzetFaza = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ongoing';

export interface BudzetStavka {
  id: string;
  licencaCode: string;
  licencaNaziv: string;
  delatnost: string;
  kategorija: BudzetKategorija;
  rizik: LicencaRizik;
  procenjeniTrosak: number;
  valuta: 'RSD';
  placanjeModel: PlacanjeModel;
  faza: BudzetFaza;
  partnerNaziv: string;
  napomena: string;
}

export interface BudzetSumarPoKategoriji {
  kategorija: BudzetKategorija;
  ukupnoStavki: number;
  ukupnoRSD: number;
}

export interface LicencniBudzetSrbijaRezultat {
  status: 'aktivan';
  verzija: string;
  kompanija: string;
  timestamp: string;
  userId: string;
  kontekst: {
    modul: string;
    drzava: 'Srbija';
    valuta: 'RSD';
    rezimNabavke: 'kupujemo_sve_licence';
  };
  summary: {
    ukupnoStavki: number;
    ukupnoRSD: number;
    kriticneStavke: number;
    godisnjeBudzet: number;
    mesecnoBudzet: number;
    jednokratnoBudzet: number;
  };
  stavke: BudzetStavka[];
  sumarPoKategoriji: BudzetSumarPoKategoriji[];
  preporuke: string[];
}

const RSD_PROCENA: Record<string, { iznos: number; model: PlacanjeModel; faza: BudzetFaza }> = {
  'REG-KYC-KYB':           { iznos: 360_000,   model: 'godisnje',   faza: 'Q1' },
  'REG-RS-AML-CTF':        { iznos: 480_000,   model: 'godisnje',   faza: 'Q1' },
  'REG-RS-DPO':            { iznos: 240_000,   model: 'godisnje',   faza: 'Q1' },
  'REG-SOC2-TYPE2':        { iznos: 720_000,   model: 'godisnje',   faza: 'Q2' },
  'REG-RS-NBS-PI-EMI':     { iznos: 2_400_000, model: 'jednokratno', faza: 'Q1' },
  'REG-RS-NBS-FX':         { iznos: 1_200_000, model: 'jednokratno', faza: 'Q1' },
  'REG-RS-PSD2-AISP-PISP': { iznos: 600_000,   model: 'jednokratno', faza: 'Q2' },
  'REG-RS-NBS-BANKA':      { iznos: 4_800_000, model: 'jednokratno', faza: 'Q1' },
  'REG-RS-DIGITALNA-IMOVINA': { iznos: 1_800_000, model: 'jednokratno', faza: 'Q2' },
  'SW-GH-ENTERPRISE':      { iznos: 960_000,   model: 'godisnje',   faza: 'Q1' },
  'SW-GH-COPILOT-ENTERPRISE': { iznos: 480_000, model: 'godisnje',  faza: 'Q1' },
  'OPS-RBAC-MATRIX':       { iznos: 0,          model: 'godisnje',   faza: 'ongoing' },
};

function kategorijaZaCode(code: string): BudzetKategorija {
  if (code.includes('NBS') || code.includes('KYC') || code.includes('PSD2'))
    return 'regulatorna_nbs';
  if (code.includes('KOMISIJA') || code.includes('DIGITALNA-IMOVINA'))
    return 'regulatorna_komisija';
  if (code.includes('AML') || code.includes('DPO') || code.includes('SOC2'))
    return 'regulatorna_aml_dpo';
  if (code.startsWith('SW-'))
    return 'softverska';
  if (code.startsWith('OPS-'))
    return 'operativna';
  return 'ostalo';
}

function sumarPoKategoriji(stavke: BudzetStavka[]): BudzetSumarPoKategoriji[] {
  const acc: Record<BudzetKategorija, { count: number; rsd: number }> = {
    regulatorna_nbs: { count: 0, rsd: 0 },
    regulatorna_komisija: { count: 0, rsd: 0 },
    regulatorna_aml_dpo: { count: 0, rsd: 0 },
    softverska: { count: 0, rsd: 0 },
    operativna: { count: 0, rsd: 0 },
    ostalo: { count: 0, rsd: 0 },
  };
  for (const s of stavke) {
    acc[s.kategorija].count++;
    acc[s.kategorija].rsd += s.procenjeniTrosak;
  }
  return (Object.entries(acc) as [BudzetKategorija, { count: number; rsd: number }][])
    .filter(([, v]) => v.count > 0)
    .map(([kategorija, v]) => ({
      kategorija,
      ukupnoStavki: v.count,
      ukupnoRSD: v.rsd,
    }))
    .sort((a, b) => b.ukupnoRSD - a.ukupnoRSD);
}

export function buildLicencniBudzetSrbija(userId = 'public'): LicencniBudzetSrbijaRezultat {
  const reg = buildAIIQWorldBankLicencniRegistar();
  const compliance = getLicencniComplianceIzvestaj('mesecni');

  const seen = new Set<string>();
  const stavke: BudzetStavka[] = [];

  for (const nabavka of reg.nabavka) {
    const licencaEntry = reg.licence.find((l) => l.id === nabavka.licencaId);
    if (!licencaEntry) continue;
    const code = licencaEntry.zahtev.code;
    const key = `${code}:${nabavka.delatnost}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const procena = RSD_PROCENA[code] ?? { iznos: 120_000, model: 'godisnje' as PlacanjeModel, faza: 'Q3' as BudzetFaza };

    stavke.push({
      id: `budzet-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${slug(nabavka.delatnost)}`,
      licencaCode: code,
      licencaNaziv: licencaEntry.zahtev.naziv,
      delatnost: nabavka.delatnost,
      kategorija: kategorijaZaCode(code),
      rizik: nabavka.rizik,
      procenjeniTrosak: procena.iznos,
      valuta: 'RSD',
      placanjeModel: procena.model,
      faza: procena.faza,
      partnerNaziv: nabavka.preporucenPayload.partnerNaziv,
      napomena: nabavka.preporucenPayload.opisNabavke,
    });
  }

  stavke.sort((a, b) => riskWeight(b.rizik) - riskWeight(a.rizik) || b.procenjeniTrosak - a.procenjeniTrosak);

  const totalRSD = stavke.reduce((s, x) => s + x.procenjeniTrosak, 0);
  const godisnjeBudzet = stavke
    .filter((x) => x.placanjeModel === 'godisnje')
    .reduce((s, x) => s + x.procenjeniTrosak, 0);
  const mesecnoBudzet = stavke
    .filter((x) => x.placanjeModel === 'mesecno')
    .reduce((s, x) => s + x.procenjeniTrosak, 0);
  const jednokratnoBudzet = stavke
    .filter((x) => x.placanjeModel === 'jednokratno')
    .reduce((s, x) => s + x.procenjeniTrosak, 0);
  const kriticneStavke = stavke.filter((x) => x.rizik === 'kriticno').length;

  const preporuke: string[] = [];
  if (kriticneStavke > 0)
    preporuke.push(`Prioritetno zatvoriti ${kriticneStavke} kritičnih nabavki u Q1 (NBS, KYC/KYB, AML/CTF).`);
  if (compliance.kriticniGapovi > 0)
    preporuke.push(`Kritični gapovi (${compliance.kriticniGapovi}) direktno koreliraju sa neplaćenim licencama — pokrenuti procurement odmah.`);
  preporuke.push('Godišnji budžet predati trezoru do 31.01 za odobrenje Board-a.');
  preporuke.push('Softverske licence (GitHub Enterprise + Copilot) potvrditi kroz centralni IT nabavni proces.');
  preporuke.push('Pratiti status NBS dozvola na mesečnom review-u registra.');

  return {
    status: 'aktivan',
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
    timestamp: new Date().toISOString(),
    userId,
    kontekst: {
      modul: 'Licencni Budžet Srbija',
      drzava: 'Srbija',
      valuta: 'RSD',
      rezimNabavke: 'kupujemo_sve_licence',
    },
    summary: {
      ukupnoStavki: stavke.length,
      ukupnoRSD: totalRSD,
      kriticneStavke,
      godisnjeBudzet,
      mesecnoBudzet,
      jednokratnoBudzet,
    },
    stavke,
    sumarPoKategoriji: sumarPoKategoriji(stavke),
    preporuke,
  };
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function riskWeight(rizik: LicencaRizik): number {
  switch (rizik) {
    case 'kriticno': return 4;
    case 'visoko':   return 3;
    case 'srednje':  return 2;
    default:         return 1;
  }
}
