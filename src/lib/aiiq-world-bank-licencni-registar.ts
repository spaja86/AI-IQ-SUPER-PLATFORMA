import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { platforme } from '@/lib/platforme';
import { platforms } from '@/lib/platforms';
import { companies } from '@/lib/companies';
import { getB2BWorkflowMeta } from '@/lib/b2b-procurement-workflow';
import { getIssuerLicensingBlockers, getIssuerLicensingSummary } from '@/lib/issuer-licensing';

export type LicencaKlasifikacija = 'regulatorna' | 'softverska' | 'operativna';
export type LicencaStatus = 'potvrdjena' | 'nedostaje' | 'u_nabavci' | 'istekla' | 'neprimenljivo';
export type LicencaRizik = 'kriticno' | 'visoko' | 'srednje' | 'nisko';
export type LicencaProcurementStatus = 'nije_pokrenuto' | 'u_toku' | 'zavrseno';
export type GlobalnaJurisdikcijaOznaka = 'RS' | 'EU' | 'US' | 'UK' | 'UAE' | 'SG' | 'JP' | 'IN' | 'BR' | 'CA' | 'AU' | 'ZA';
export type DelatnostSektor =
  | 'bankarstvo'
  | 'platni_sistemi'
  | 'ai_sistemi'
  | 'infrastruktura'
  | 'gejming'
  | 'telekom'
  | 'identitet_i_bezbednost'
  | 'analitika_i_operativa'
  | 'trgovina_i_partnerstva';

export interface AIIQWorldBankScopeModul {
  id: string;
  naziv: string;
  opis: string;
}

export interface PoslovnaDelatnost {
  id: string;
  naziv: string;
  izvor: 'login-api' | 'platform-model' | 'company-model' | 'world-bank-services';
  domen: 'finansije' | 'ai' | 'infrastruktura' | 'poslovanje' | 'gejming';
  sektor: DelatnostSektor;
  prioritet: {
    rizik: LicencaRizik;
    regulatornaStrogost: number;
    trzisteVaznost: number;
    score: number;
  };
}

export interface GlobalnaJurisdikcija {
  oznaka: GlobalnaJurisdikcijaOznaka;
  naziv: string;
  valuta: string;
  region: 'Evropa' | 'Severna Amerika' | 'Bliski Istok' | 'Azija' | 'Juzna Amerika' | 'Afrika' | 'Okeanija';
  regulatori: string[];
  rezimNabavke: 'kupujemo_sve_licence_globalno';
}

export interface LicencaGlobalniStatus {
  jurisdikcija: GlobalnaJurisdikcijaOznaka;
  status: LicencaStatus;
  regulatorIliIzdavalac: string;
  rizik: LicencaRizik;
}

export interface LicencniDokaz {
  tip: 'ugovor' | 'sertifikat' | 'interna-politika' | 'faktura';
  referenca: string;
  link?: string;
  napomena?: string;
  potvrzenoAt: string;
}

export interface LicencniZahtev {
  code: string;
  naziv: string;
  klasifikacija: LicencaKlasifikacija;
  regulatorIliIzdavalac: string;
  rizik: LicencaRizik;
}

export interface LicencaPoDelatnosti {
  id: string;
  delatnostId: string;
  delatnost: string;
  zahtev: LicencniZahtev;
  status: LicencaStatus;
  validFrom: string | null;
  validTo: string | null;
  dokaz: LicencniDokaz | null;
  procurementStatus: LicencaProcurementStatus;
  procurementReferenca: string | null;
  poslednjaIzmenaAt: string;
  globalniStatusi: LicencaGlobalniStatus[];
}

export interface LicencniGapStavka {
  licencaId: string;
  delatnost: string;
  licenca: string;
  status: LicencaStatus;
  rizik: LicencaRizik;
  prioritet: number;
  razlog: string;
}

export interface LicencniChecklistItem {
  licencaId: string;
  licenca: string;
  status: LicencaStatus;
  imaDokaz: boolean;
  isticeZaDana: number | null;
}

export interface LicencnaNabavkaKorak {
  redniBroj: number;
  naziv: string;
  status: 'ceka' | 'u_toku' | 'zavrseno';
}

export interface LicencnaNabavkaStavka {
  licencaId: string;
  delatnost: string;
  licenca: string;
  rizik: LicencaRizik;
  status: LicencaProcurementStatus;
  b2bEndpoint: '/api/b2b-procurement';
  paymentSource: string;
  preporucenPayload: {
    partnerNaziv: string;
    partnerTip: 'tehnoloski_partner' | 'ovlasceni_diler';
    opisNabavke: string;
  };
  koraci: LicencnaNabavkaKorak[];
}

export interface LicencniAuditZapis {
  id: string;
  akcija: string;
  status: 'uspesno' | 'upozorenje';
  detalji: string;
  timestamp: string;
}

export interface DelatnostCoverage {
  delatnostId: string;
  delatnost: string;
  ukupnoLicenci: number;
  pokrivene: number;
  procenat: number;
}

export interface LicencniComplianceIzvestaj {
  periodTip: 'mesecni' | 'kvartalni';
  period: string;
  ukupnoLicenci: number;
  potvrdjene: number;
  uNabavci: number;
  nedostaju: number;
  istekle: number;
  neprimenljive: number;
  coverageProcenat: number;
  kriticniGapovi: number;
}

export interface LicencnaJurisdikcija {
  drzava: 'Srbija';
  oznaka: 'RS';
  valuta: 'RSD';
  regulatori: string[];
  rezimNabavke: 'kupujemo_sve_licence';
}

export interface AIIQWorldBankLicencniRegistar {
  naziv: string;
  kompanija: string;
  verzija: string;
  timestamp: string;
  jurisdikcija: LicencnaJurisdikcija;
  scope: AIIQWorldBankScopeModul[];
  delatnosti: PoslovnaDelatnost[];
  licence: LicencaPoDelatnosti[];
  coveragePoDelatnosti: DelatnostCoverage[];
  gapovi: LicencniGapStavka[];
  nabavka: LicencnaNabavkaStavka[];
  audit: LicencniAuditZapis[];
  roleMatrica: Record<'viewer' | 'editor' | 'approver', string[]>;
  b2bMeta: ReturnType<typeof getB2BWorkflowMeta>;
  issuerLicensing: {
    summary: ReturnType<typeof getIssuerLicensingSummary>;
    blockers: ReturnType<typeof getIssuerLicensingBlockers>;
  };
  globalneJurisdikcije: GlobalnaJurisdikcija[];
  globalniCoverage: {
    ukupnoLicenci: number;
    ukupnoStatusa: number;
    potvrdjene: number;
    uNabavci: number;
    nedostaju: number;
    istekle: number;
    coverageProcenat: number;
    kriticniGlobalniGapovi: number;
    poJurisdikciji: Array<{
      jurisdikcija: GlobalnaJurisdikcijaOznaka;
      ukupno: number;
      pokrivene: number;
      coverageProcenat: number;
    }>;
  };
  rolloutFazeGlobalnihLicenci: Array<{
    faza: 'FAZA-1-READ-ONLY' | 'FAZA-2-GOVERNANCE' | 'FAZA-3-DOWNSTREAM-SYNC';
    status: 'aktivno' | 'planirano';
    opis: string;
  }>;
}

const SRBIJA_JURISDIKCIJA: LicencnaJurisdikcija = {
  drzava: 'Srbija',
  oznaka: 'RS',
  valuta: 'RSD',
  regulatori: [
    'Narodna banka Srbije (NBS)',
    'Komisija za hartije od vrednosti',
    'Uprava za sprečavanje pranja novca',
    'Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti',
  ],
  rezimNabavke: 'kupujemo_sve_licence',
};

const GLOBALNE_JURISDIKCIJE: GlobalnaJurisdikcija[] = [
  { oznaka: 'RS', naziv: 'Srbija', valuta: 'RSD', region: 'Evropa', regulatori: ['NBS', 'Komisija za hartije od vrednosti', 'Poverenik za zaštitu podataka'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'EU', naziv: 'Evropska unija', valuta: 'EUR', region: 'Evropa', regulatori: ['EBA', 'ESMA', 'EDPB'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'US', naziv: 'Sjedinjene Američke Države', valuta: 'USD', region: 'Severna Amerika', regulatori: ['FinCEN', 'SEC', 'CFPB'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'UK', naziv: 'Ujedinjeno Kraljevstvo', valuta: 'GBP', region: 'Evropa', regulatori: ['FCA', 'PRA', 'ICO'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'UAE', naziv: 'Ujedinjeni Arapski Emirati', valuta: 'AED', region: 'Bliski Istok', regulatori: ['CBUAE', 'DFSA'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'SG', naziv: 'Singapur', valuta: 'SGD', region: 'Azija', regulatori: ['MAS', 'PDPC'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'JP', naziv: 'Japan', valuta: 'JPY', region: 'Azija', regulatori: ['JFSA', 'PPC Japan'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'IN', naziv: 'Indija', valuta: 'INR', region: 'Azija', regulatori: ['RBI', 'SEBI'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'BR', naziv: 'Brazil', valuta: 'BRL', region: 'Juzna Amerika', regulatori: ['BCB', 'CVM'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'CA', naziv: 'Kanada', valuta: 'CAD', region: 'Severna Amerika', regulatori: ['FINTRAC', 'OSFI'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'AU', naziv: 'Australija', valuta: 'AUD', region: 'Okeanija', regulatori: ['ASIC', 'AUSTRAC'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
  { oznaka: 'ZA', naziv: 'Južna Afrika', valuta: 'ZAR', region: 'Afrika', regulatori: ['SARB', 'FSCA'], rezimNabavke: 'kupujemo_sve_licence_globalno' },
];

const LICENCNI_SCOPE: AIIQWorldBankScopeModul[] = [
  {
    id: 'banka',
    naziv: 'Bankarski modul',
    opis: 'AI IQ World Bank javni i API sloj sa računima, transferima, partnerima i operativom.',
  },
  {
    id: 'github-billing',
    naziv: 'GitHub billing centralizacija',
    opis: 'Centralizovan model kupovine i budžeta za GitHub servise kroz AI IQ World Bank.',
  },
  {
    id: 'poslovni-novcanik',
    naziv: 'Poslovni novčanik',
    opis: 'Wallet, kartični tokovi, tokenizacija i regionalna orkestracija plaćanja.',
  },
  {
    id: 'menjacnica-i-platni-tok',
    naziv: 'Menjačnica i platni tokovi',
    opis: 'Integracija sa menjačnicom, konverzijama i platnim procesorima.',
  },
  {
    id: 'partneri-operativa',
    naziv: 'Partneri i operativa',
    opis: 'Ugovori, licence, odobrenja i nabavka licenci kroz B2B workflow.',
  },
];

const LOGIN_DELATNOSTI: Array<Pick<PoslovnaDelatnost, 'naziv' | 'domen' | 'sektor'>> = [
  { naziv: 'Digitalna Industrija', domen: 'poslovanje', sektor: 'analitika_i_operativa' },
  { naziv: 'Gaming Platforma', domen: 'gejming', sektor: 'gejming' },
  { naziv: 'AI Platforma', domen: 'ai', sektor: 'ai_sistemi' },
  { naziv: 'Finansije', domen: 'finansije', sektor: 'bankarstvo' },
  { naziv: 'Proksi Mreza', domen: 'infrastruktura', sektor: 'infrastruktura' },
  { naziv: 'Mobilna Mreza', domen: 'infrastruktura', sektor: 'telekom' },
  { naziv: 'IT Proizvodi', domen: 'poslovanje', sektor: 'trgovina_i_partnerstva' },
  { naziv: 'SpajaPro Engine', domen: 'ai', sektor: 'ai_sistemi' },
  { naziv: 'SPAJA Generator za Endzine', domen: 'ai', sektor: 'ai_sistemi' },
  { naziv: 'OpenAI Platforma', domen: 'ai', sektor: 'ai_sistemi' },
];

const WORLD_BANK_GLOBAL_ACTIVITY_SEEDS: Array<Pick<PoslovnaDelatnost, 'naziv' | 'domen' | 'sektor'>> = [
  { naziv: 'Globalni Platni Promet', domen: 'finansije', sektor: 'platni_sistemi' },
  { naziv: 'Cross-Border FX Settlement', domen: 'finansije', sektor: 'platni_sistemi' },
  { naziv: 'Treasury & Liquidity Ops', domen: 'finansije', sektor: 'bankarstvo' },
  { naziv: 'Digital Asset Custody', domen: 'finansije', sektor: 'bankarstvo' },
  { naziv: 'Licencni Compliance Orchestrator', domen: 'poslovanje', sektor: 'identitet_i_bezbednost' },
  { naziv: 'AML/KYC Intelligence', domen: 'ai', sektor: 'identitet_i_bezbednost' },
  { naziv: 'Fraud & Risk Scoring', domen: 'ai', sektor: 'ai_sistemi' },
  { naziv: 'B2B Procurement Governance', domen: 'poslovanje', sektor: 'analitika_i_operativa' },
  { naziv: 'Global Partner Marketplace', domen: 'poslovanje', sektor: 'trgovina_i_partnerstva' },
  { naziv: 'Telecom Discount Clearing', domen: 'infrastruktura', sektor: 'telekom' },
  { naziv: 'Cloud Infra Resilience', domen: 'infrastruktura', sektor: 'infrastruktura' },
  { naziv: 'Open Banking API Hub', domen: 'finansije', sektor: 'platni_sistemi' },
  { naziv: 'RegTech Evidence Vault', domen: 'poslovanje', sektor: 'identitet_i_bezbednost' },
  { naziv: 'Issuer Licensing Control', domen: 'poslovanje', sektor: 'identitet_i_bezbednost' },
  { naziv: 'World Bank Persona Sync', domen: 'ai', sektor: 'ai_sistemi' },
  { naziv: 'Merchant Settlement Network', domen: 'finansije', sektor: 'platni_sistemi' },
  { naziv: 'Gaming Compliance & Fairness', domen: 'gejming', sektor: 'gejming' },
  { naziv: 'Global Support Operations', domen: 'poslovanje', sektor: 'analitika_i_operativa' },
  { naziv: 'Data Residency Routing', domen: 'infrastruktura', sektor: 'infrastruktura' },
  { naziv: 'Trust & Safety Operations', domen: 'poslovanje', sektor: 'identitet_i_bezbednost' },
];

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqByNaziv(items: PoslovnaDelatnost[]): PoslovnaDelatnost[] {
  const seen = new Set<string>();
  const out: PoslovnaDelatnost[] = [];
  for (const item of items) {
    const key = item.naziv.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function riskBySektor(sektor: DelatnostSektor): LicencaRizik {
  if (sektor === 'bankarstvo' || sektor === 'platni_sistemi' || sektor === 'identitet_i_bezbednost') return 'kriticno';
  if (sektor === 'ai_sistemi' || sektor === 'infrastruktura' || sektor === 'telekom') return 'visoko';
  if (sektor === 'gejming') return 'srednje';
  return 'nisko';
}

function activityPriority(sektor: DelatnostSektor, domen: PoslovnaDelatnost['domen']) {
  const risk = riskBySektor(sektor);
  const regulatornaStrogost = sektor === 'bankarstvo' || sektor === 'platni_sistemi' || sektor === 'identitet_i_bezbednost' ? 95
    : sektor === 'telekom' || sektor === 'infrastruktura' ? 80
      : sektor === 'ai_sistemi' ? 75
        : sektor === 'gejming' ? 65
          : 55;
  const trzisteVaznost = domen === 'finansije' ? 95
    : domen === 'ai' ? 90
      : domen === 'infrastruktura' ? 85
        : domen === 'poslovanje' ? 75
          : 70;
  const score = Math.round((regulatornaStrogost * 0.6) + (trzisteVaznost * 0.4));
  return { rizik: risk, regulatornaStrogost, trzisteVaznost, score };
}

function buildDelatnost(params: {
  id: string;
  naziv: string;
  izvor: PoslovnaDelatnost['izvor'];
  domen: PoslovnaDelatnost['domen'];
  sektor: DelatnostSektor;
}): PoslovnaDelatnost {
  return {
    id: params.id,
    naziv: params.naziv,
    izvor: params.izvor,
    domen: params.domen,
    sektor: params.sektor,
    prioritet: activityPriority(params.sektor, params.domen),
  };
}

function buildDelatnosti(): PoslovnaDelatnost[] {
  const fromLogin = LOGIN_DELATNOSTI.map((item, idx) => buildDelatnost({
    id: `login-${idx + 1}-${slug(item.naziv)}`,
    naziv: item.naziv,
    izvor: 'login-api',
    domen: item.domen,
    sektor: item.sektor,
  }));

  const fromPlatformModel = platforme
    .filter((p) => p.kategorija === 'finansije')
    .map((p) => buildDelatnost({
      id: `platform-model-${slug(p.id)}`,
      naziv: `${p.naziv} (${p.kategorija})`,
      izvor: 'platform-model',
      domen: 'finansije',
      sektor: 'bankarstvo',
    }))
    .concat(
      platforms
        .filter((p) => p.category === 'finance')
        .map((p) => buildDelatnost({
          id: `platform-en-${slug(p.id)}`,
          naziv: p.name,
          izvor: 'platform-model',
          domen: 'finansije',
          sektor: 'bankarstvo',
        })),
    );

  const fromCompanyModel = companies
    .filter((c) => c.industry.toLowerCase().includes('fintech') || c.industry.toLowerCase().includes('finance'))
    .map((c) => buildDelatnost({
      id: `company-model-${slug(c.id)}`,
      naziv: c.name,
      izvor: 'company-model',
      domen: 'finansije',
      sektor: 'bankarstvo',
    }));

  const fromWorldBankSeeds = WORLD_BANK_GLOBAL_ACTIVITY_SEEDS.map((item, idx) => buildDelatnost({
    id: `world-bank-service-${idx + 1}-${slug(item.naziv)}`,
    naziv: item.naziv,
    izvor: 'world-bank-services',
    domen: item.domen,
    sektor: item.sektor,
  }));

  return uniqByNaziv([...fromLogin, ...fromPlatformModel, ...fromCompanyModel, ...fromWorldBankSeeds]);
}

function seedStatusForRequirement(req: LicencniZahtev): LicencaStatus {
  if (req.klasifikacija === 'operativna') return 'potvrdjena';
  return 'u_nabavci';
}

function dokazZa(req: LicencniZahtev, status: LicencaStatus): LicencniDokaz | null {
  if (status !== 'potvrdjena') return null;

  if (req.klasifikacija === 'operativna') {
    return {
      tip: 'interna-politika',
      referenca: 'OMEGA-PERMISSION-MATRIX-V3',
      napomena: 'Interna operativna dozvola (informativno, nije regulatorna zamena).',
      potvrzenoAt: new Date().toISOString(),
    };
  }

  if (req.klasifikacija === 'softverska') {
    return {
      tip: 'ugovor',
      referenca: `${req.code}-MASTER-AGREEMENT`,
      napomena: 'Softverski ugovor je evidentiran u centralnom registru.',
      potvrzenoAt: new Date().toISOString(),
    };
  }

  return {
    tip: 'sertifikat',
    referenca: `${req.code}-COMPLIANCE-CERT`,
    napomena: `Regulatorna usklađenost potvrđena za ${req.naziv}.`,
    potvrzenoAt: new Date().toISOString(),
  };
}

function validToByCode(req: LicencniZahtev, status: LicencaStatus): string | null {
  if (status === 'neprimenljivo') return null;
  if (status === 'u_nabavci' || status === 'nedostaje') return null;
  if (req.code === 'SW-GH-ENTERPRISE' || req.code === 'SW-GH-COPILOT-ENTERPRISE') return '2027-01-31';
  return '2026-12-31';
}

function requirementsForActivity(activity: PoslovnaDelatnost): LicencniZahtev[] {
  const commonRegulatorne: LicencniZahtev[] = [
    {
      code: 'REG-KYC-KYB',
      naziv: 'KYC/KYB verifikacijski okvir za Srbiju',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'Interni compliance + lokalni regulator u Srbiji',
      rizik: 'kriticno',
    },
    {
      code: 'REG-RS-AML-CTF',
      naziv: 'AML/CTF program i prijava odgovornog lica za Srbiju',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'Uprava za sprečavanje pranja novca + NBS',
      rizik: 'kriticno',
    },
    {
      code: 'REG-RS-DPO',
      naziv: 'Program zaštite podataka i DPO evidencija za Srbiju',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti',
      rizik: 'visoko',
    },
    {
      code: 'REG-SOC2-TYPE2',
      naziv: 'SOC2 Type II atestacija za operativu AI IQ World Bank',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'Nezavisni audit partner',
      rizik: 'srednje',
    },
  ];

  const commonOperativna: LicencniZahtev[] = [
    {
      code: 'OPS-RBAC-MATRIX',
      naziv: 'RBAC matrica operativnih dozvola',
      klasifikacija: 'operativna',
      regulatorIliIzdavalac: 'Interna bezbednost',
      rizik: 'nisko',
    },
  ];

  const naziv = activity.naziv.toLowerCase();
  const dodatne: LicencniZahtev[] = [];
  const jeFinansijskaDelatnost =
    activity.domen === 'finansije' ||
    naziv.includes('finans') ||
    naziv.includes('banka') ||
    naziv.includes('menja') ||
    naziv.includes('novcan') ||
    naziv.includes('novč');
  const jeKriptoDelatnost = naziv.includes('kripto') || naziv.includes('digital asset') || naziv.includes('trezor');

  if (jeFinansijskaDelatnost) {
    dodatne.push(
      {
        code: 'REG-RS-NBS-PI-EMI',
        naziv: 'NBS dozvola za platnu instituciju / EMI model u Srbiji',
        klasifikacija: 'regulatorna',
        regulatorIliIzdavalac: 'Narodna banka Srbije (NBS)',
        rizik: 'kriticno',
      },
      {
        code: 'REG-RS-NBS-FX',
        naziv: 'NBS odobrenje za menjačke i devizne poslove u Srbiji',
        klasifikacija: 'regulatorna',
        regulatorIliIzdavalac: 'Narodna banka Srbije (NBS)',
        rizik: 'kriticno',
      },
      {
        code: 'REG-RS-PSD2-AISP-PISP',
        naziv: 'PSD2 / open banking AISP-PISP usklađenost za Srbiju',
        klasifikacija: 'regulatorna',
        regulatorIliIzdavalac: 'Narodna banka Srbije (NBS)',
        rizik: 'visoko',
      },
    );
  }

  if (naziv.includes('banka')) {
    dodatne.push({
      code: 'REG-RS-NBS-BANKA',
      naziv: 'NBS dozvola za bankarsko poslovanje u Srbiji',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'Narodna banka Srbije (NBS)',
      rizik: 'kriticno',
    });
  }

  if (jeKriptoDelatnost || naziv.includes('menja')) {
    dodatne.push({
      code: 'REG-RS-DIGITALNA-IMOVINA',
      naziv: 'Dozvola po Zakonu o digitalnoj imovini za Srbiju',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'NBS i/ili Komisija za hartije od vrednosti',
      rizik: 'visoko',
    });
  }

  if (naziv.includes('github') || naziv.includes('spajapro') || naziv.includes('openai') || naziv.includes('ai')) {
    dodatne.push(
      {
        code: 'SW-GH-ENTERPRISE',
        naziv: 'GitHub Enterprise licenca',
        klasifikacija: 'softverska',
        regulatorIliIzdavalac: 'GitHub',
        rizik: 'visoko',
      },
      {
        code: 'SW-GH-COPILOT-ENTERPRISE',
        naziv: 'GitHub Copilot Enterprise licenca',
        klasifikacija: 'softverska',
        regulatorIliIzdavalac: 'GitHub',
        rizik: 'srednje',
      },
    );
  }

  return [...commonRegulatorne, ...dodatne, ...commonOperativna];
}

function daysUntil(dateIso: string | null): number | null {
  if (!dateIso) return null;
  const target = new Date(dateIso);
  if (Number.isNaN(target.getTime())) return null;
  const diffMs = target.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function priorityByRiskAndStatus(risk: LicencaRizik, status: LicencaStatus): number {
  const riskScore: Record<LicencaRizik, number> = {
    kriticno: 100,
    visoko: 70,
    srednje: 45,
    nisko: 20,
  };
  const statusScore: Record<LicencaStatus, number> = {
    nedostaje: 40,
    u_nabavci: 25,
    istekla: 35,
    potvrdjena: 0,
    neprimenljivo: 0,
  };
  return riskScore[risk] + statusScore[status];
}

function reasonForGap(item: LicencaPoDelatnosti): string {
  if (item.status === 'nedostaje') return 'Licenca nije pronađena u registru dokaza.';
  if (item.status === 'u_nabavci') return 'Licenca je u nabavnom toku i čeka zatvaranje.';
  if (item.status === 'istekla') return 'Licenca je istekla i zahteva obnovu.';
  if (item.status === 'potvrdjena' && !item.dokaz) return 'Licenca je označena kao potvrđena bez dokaza.';
  return 'Nema gap-a.';
}

function procurementStatusFor(item: LicencaPoDelatnosti): LicencaProcurementStatus {
  if (item.status === 'u_nabavci') return 'u_toku';
  if (item.status === 'potvrdjena' || item.status === 'neprimenljivo') return 'zavrseno';
  return 'nije_pokrenuto';
}

function statusForJurisdiction(req: LicencniZahtev, oznaka: GlobalnaJurisdikcijaOznaka): LicencaStatus {
  if (oznaka === 'RS') return seedStatusForRequirement(req);
  if (req.klasifikacija === 'operativna') return 'potvrdjena';
  if (req.klasifikacija === 'softverska') return ['US', 'EU', 'UK', 'CA', 'AU'].includes(oznaka) ? 'potvrdjena' : 'u_nabavci';
  return 'u_nabavci';
}

function buildGlobalniStatusi(req: LicencniZahtev): LicencaGlobalniStatus[] {
  return GLOBALNE_JURISDIKCIJE.map((jur) => ({
    jurisdikcija: jur.oznaka,
    status: statusForJurisdiction(req, jur.oznaka),
    regulatorIliIzdavalac: jur.regulatori[0] ?? req.regulatorIliIzdavalac,
    rizik: req.rizik,
  }));
}

function buildLicenceRows(delatnosti: PoslovnaDelatnost[]): LicencaPoDelatnosti[] {
  const now = new Date().toISOString();
  const rows: LicencaPoDelatnosti[] = [];

  for (const delatnost of delatnosti) {
    const requirements = requirementsForActivity(delatnost);
    for (const req of requirements) {
      const status = seedStatusForRequirement(req);
      const dokaz = dokazZa(req, status);
      const validTo = validToByCode(req, status);
      const procurementStatus =
        status === 'u_nabavci' ? 'u_toku' : status === 'potvrdjena' || status === 'neprimenljivo' ? 'zavrseno' : 'nije_pokrenuto';
      rows.push({
        id: `${delatnost.id}-${slug(req.code)}`,
        delatnostId: delatnost.id,
        delatnost: delatnost.naziv,
        zahtev: req,
        status,
        validFrom: status === 'potvrdjena' ? '2026-01-01' : null,
        validTo,
        dokaz,
        procurementStatus,
        procurementReferenca: procurementStatus === 'u_toku' ? `PROC-${slug(req.code)}-${slug(delatnost.id)}` : null,
        poslednjaIzmenaAt: now,
        globalniStatusi: buildGlobalniStatusi(req),
      });
    }
  }

  return rows;
}

function buildCoverage(licence: LicencaPoDelatnosti[], delatnosti: PoslovnaDelatnost[]): DelatnostCoverage[] {
  return delatnosti.map((delatnost) => {
    const related = licence.filter((x) => x.delatnostId === delatnost.id);
    const pokrivene = related.filter((x) => x.status === 'potvrdjena' || x.status === 'neprimenljivo').length;
    const procenat = related.length === 0 ? 0 : Math.round((pokrivene / related.length) * 100);
    return {
      delatnostId: delatnost.id,
      delatnost: delatnost.naziv,
      ukupnoLicenci: related.length,
      pokrivene,
      procenat,
    };
  });
}

function buildGapovi(licence: LicencaPoDelatnosti[]): LicencniGapStavka[] {
  return licence
    .filter(
      (item) =>
        item.status === 'nedostaje' ||
        item.status === 'u_nabavci' ||
        item.status === 'istekla' ||
        (item.status === 'potvrdjena' && !item.dokaz),
    )
    .map((item) => ({
      licencaId: item.id,
      delatnost: item.delatnost,
      licenca: item.zahtev.naziv,
      status: item.status,
      rizik: item.zahtev.rizik,
      prioritet: priorityByRiskAndStatus(item.zahtev.rizik, item.status),
      razlog: reasonForGap(item),
    }))
    .sort((a, b) => b.prioritet - a.prioritet);
}

function buildNabavkaStavke(licence: LicencaPoDelatnosti[]): LicencnaNabavkaStavka[] {
  const b2bMeta = getB2BWorkflowMeta();
  const target = licence.filter((item) => item.status === 'nedostaje' || item.status === 'u_nabavci');

  return target.map((item) => {
    const procurementStatus = procurementStatusFor(item);
    return {
      licencaId: item.id,
      delatnost: item.delatnost,
      licenca: item.zahtev.naziv,
      rizik: item.zahtev.rizik,
      status: procurementStatus,
      b2bEndpoint: '/api/b2b-procurement',
      paymentSource: b2bMeta.paymentSource,
      preporucenPayload: {
        partnerNaziv: item.zahtev.regulatorIliIzdavalac,
        partnerTip: item.zahtev.klasifikacija === 'softverska' ? 'tehnoloski_partner' : 'ovlasceni_diler',
        opisNabavke: `Nabavka licence ${item.zahtev.naziv} za delatnost ${item.delatnost}`,
      },
      koraci: [
        { redniBroj: 1, naziv: 'Zahtev za nabavku', status: procurementStatus === 'nije_pokrenuto' ? 'u_toku' : 'zavrseno' },
        { redniBroj: 2, naziv: 'Vlasničko i billing odobrenje', status: procurementStatus === 'u_toku' ? 'u_toku' : procurementStatus === 'zavrseno' ? 'zavrseno' : 'ceka' },
        { redniBroj: 3, naziv: 'Uplata i dokaz kupovine', status: procurementStatus === 'zavrseno' ? 'zavrseno' : 'ceka' },
        { redniBroj: 4, naziv: 'Compliance verifikacija i aktivacija', status: procurementStatus === 'zavrseno' ? 'zavrseno' : 'ceka' },
      ],
    };
  });
}

function buildAudit(licence: LicencaPoDelatnosti[], gaps: LicencniGapStavka[]): LicencniAuditZapis[] {
  const kriticni = gaps.filter((g) => g.rizik === 'kriticno').length;
  const uNabavci = licence.filter((l) => l.status === 'u_nabavci').length;
  return [
    {
      id: `AUD-LIC-${Date.now()}-01`,
      akcija: 'scope_finalized',
      status: 'uspesno',
      detalji: `Zaključen scope AI IQ World Bank licence analize za ${LICENCNI_SCOPE.length} modula.`,
      timestamp: new Date().toISOString(),
    },
    {
      id: `AUD-LIC-${Date.now()}-02`,
      akcija: 'inventory_snapshot_created',
      status: 'uspesno',
      detalji: `Kreiran licencni inventar sa ${licence.length} stavki i mapiranjem po delatnostima.`,
      timestamp: new Date().toISOString(),
    },
    {
      id: `AUD-LIC-${Date.now()}-03`,
      akcija: 'serbia_procurement_wave_started',
      status: 'uspesno',
      detalji: 'Aktivirana je centralna kupovina svih primenljivih licenci za Srbiju kroz AI IQ World Bank.',
      timestamp: new Date().toISOString(),
    },
    {
      id: `AUD-LIC-${Date.now()}-04`,
      akcija: 'gap_analysis_completed',
      status: kriticni > 0 ? 'upozorenje' : 'uspesno',
      detalji: `Gap analiza završena: ${gaps.length} otvorenih gap-ova, kritičnih: ${kriticni}, u nabavci: ${uNabavci}.`,
      timestamp: new Date().toISOString(),
    },
  ];
}

function buildGlobalniCoverage(licence: LicencaPoDelatnosti[]): AIIQWorldBankLicencniRegistar['globalniCoverage'] {
  const globalniStatusi = licence.flatMap((item) => item.globalniStatusi);
  const potvrdjene = globalniStatusi.filter((item) => item.status === 'potvrdjena' || item.status === 'neprimenljivo').length;
  const uNabavci = globalniStatusi.filter((item) => item.status === 'u_nabavci').length;
  const nedostaju = globalniStatusi.filter((item) => item.status === 'nedostaje').length;
  const istekle = globalniStatusi.filter((item) => item.status === 'istekla').length;
  const coverageProcenat = globalniStatusi.length === 0 ? 0 : Math.round((potvrdjene / globalniStatusi.length) * 100);
  const poJurisdikciji = GLOBALNE_JURISDIKCIJE.map((jur) => {
    const scoped = globalniStatusi.filter((item) => item.jurisdikcija === jur.oznaka);
    const scopedPokrivene = scoped.filter((item) => item.status === 'potvrdjena' || item.status === 'neprimenljivo').length;
    return {
      jurisdikcija: jur.oznaka,
      ukupno: scoped.length,
      pokrivene: scopedPokrivene,
      coverageProcenat: scoped.length === 0 ? 0 : Math.round((scopedPokrivene / scoped.length) * 100),
    };
  });
  const kriticniGlobalniGapovi = globalniStatusi.filter((item) => item.rizik === 'kriticno' && item.status !== 'potvrdjena' && item.status !== 'neprimenljivo').length;

  return {
    ukupnoLicenci: licence.length,
    ukupnoStatusa: globalniStatusi.length,
    potvrdjene,
    uNabavci,
    nedostaju,
    istekle,
    coverageProcenat,
    kriticniGlobalniGapovi,
    poJurisdikciji,
  };
}

export function buildAIIQWorldBankLicencniRegistar(): AIIQWorldBankLicencniRegistar {
  const delatnosti = buildDelatnosti();
  const licence = buildLicenceRows(delatnosti);
  const gapovi = buildGapovi(licence);
  const coveragePoDelatnosti = buildCoverage(licence, delatnosti);
  const globalniCoverage = buildGlobalniCoverage(licence);
  const nabavka = buildNabavkaStavke(licence);
  const issuerSummary = getIssuerLicensingSummary();
  const issuerBlockers = getIssuerLicensingBlockers();

  return {
    naziv: 'AI IQ WORLD BANK — Licencni registar za Srbiju',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
    jurisdikcija: SRBIJA_JURISDIKCIJA,
    scope: LICENCNI_SCOPE,
    delatnosti,
    licence,
    coveragePoDelatnosti,
    gapovi,
    nabavka,
    audit: buildAudit(licence, gapovi),
    roleMatrica: {
      viewer: ['pregled-licencnog-registra', 'pregled-gap-izvestaja', 'pregled-expiration-rizika'],
      editor: ['pokretanje-nabavke', 'dodavanje-dokaza', 'azuriranje-statusa-u-nabavci'],
      approver: ['potvrda-licence', 'zatvaranje-gap-a', 'odobrenje-compliance-izvestaja'],
    },
    b2bMeta: getB2BWorkflowMeta(),
    issuerLicensing: {
      summary: issuerSummary,
      blockers: issuerBlockers,
    },
    globalneJurisdikcije: GLOBALNE_JURISDIKCIJE,
    globalniCoverage,
    rolloutFazeGlobalnihLicenci: [
      {
        faza: 'FAZA-1-READ-ONLY',
        status: 'aktivno',
        opis: 'Globalni multi-jurisdiction model i read-only izveštavanje bez lomljenja postojećih endpointa.',
      },
      {
        faza: 'FAZA-2-GOVERNANCE',
        status: 'aktivno',
        opis: 'Governance gate integracija kroz EXTRIMLI EXTREM i EXTRONDOL freeze/signals tok.',
      },
      {
        faza: 'FAZA-3-DOWNSTREAM-SYNC',
        status: 'planirano',
        opis: 'Puna downstream sinhronizacija globalnih licencnih signala ka povezanim repozitorijumima.',
      },
    ],
  };
}

export function getLicencniChecklistPoDelatnosti(delatnostId: string): LicencniChecklistItem[] {
  const reg = buildAIIQWorldBankLicencniRegistar();
  return reg.licence
    .filter((item) => item.delatnostId === delatnostId)
    .map((item) => ({
      licencaId: item.id,
      licenca: item.zahtev.naziv,
      status: item.status,
      imaDokaz: Boolean(item.dokaz),
      isticeZaDana: daysUntil(item.validTo),
    }));
}

export function getLicencniExpirations(windowDays = 90): LicencaPoDelatnosti[] {
  const reg = buildAIIQWorldBankLicencniRegistar();
  return reg.licence.filter((item) => {
    if (!item.validTo) return false;
    const days = daysUntil(item.validTo);
    if (days === null) return false;
    return days <= windowDays;
  });
}

export function getLicencniComplianceIzvestaj(periodTip: 'mesecni' | 'kvartalni'): LicencniComplianceIzvestaj {
  const reg = buildAIIQWorldBankLicencniRegistar();
  const total = reg.licence.length;
  const potvrdjene = reg.licence.filter((x) => x.status === 'potvrdjena').length;
  const uNabavci = reg.licence.filter((x) => x.status === 'u_nabavci').length;
  const nedostaju = reg.licence.filter((x) => x.status === 'nedostaje').length;
  const istekle = reg.licence.filter((x) => x.status === 'istekla').length;
  const neprimenljive = reg.licence.filter((x) => x.status === 'neprimenljivo').length;
  const pokrivene = reg.licence.filter((x) => x.status === 'potvrdjena' || x.status === 'neprimenljivo').length;
  const coverageProcenat = total === 0 ? 0 : Math.round((pokrivene / total) * 100);

  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;

  return {
    periodTip,
    period: periodTip === 'mesecni'
      ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      : `${now.getFullYear()}-Q${quarter}`,
    ukupnoLicenci: total,
    potvrdjene,
    uNabavci,
    nedostaju,
    istekle,
    neprimenljive,
    coverageProcenat,
    kriticniGapovi: reg.gapovi.filter((x) => x.rizik === 'kriticno').length,
  };
}
