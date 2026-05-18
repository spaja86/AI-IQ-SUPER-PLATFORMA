import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { platforme } from '@/lib/platforme';
import { platforms } from '@/lib/platforms';
import { companies } from '@/lib/companies';
import { getB2BWorkflowMeta } from '@/lib/b2b-procurement-workflow';

export type LicencaKlasifikacija = 'regulatorna' | 'softverska' | 'operativna';
export type LicencaStatus = 'potvrdjena' | 'nedostaje' | 'u_nabavci' | 'istekla' | 'neprimenljivo';
export type LicencaRizik = 'kriticno' | 'visoko' | 'srednje' | 'nisko';
export type LicencaProcurementStatus = 'nije_pokrenuto' | 'u_toku' | 'zavrseno';

export interface AIIQWorldBankScopeModul {
  id: string;
  naziv: string;
  opis: string;
}

export interface PoslovnaDelatnost {
  id: string;
  naziv: string;
  izvor: 'login-api' | 'platform-model' | 'company-model';
  domen: 'finansije' | 'ai' | 'infrastruktura' | 'poslovanje' | 'gejming';
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

export interface AIIQWorldBankLicencniRegistar {
  naziv: string;
  kompanija: string;
  verzija: string;
  timestamp: string;
  scope: AIIQWorldBankScopeModul[];
  delatnosti: PoslovnaDelatnost[];
  licence: LicencaPoDelatnosti[];
  coveragePoDelatnosti: DelatnostCoverage[];
  gapovi: LicencniGapStavka[];
  nabavka: LicencnaNabavkaStavka[];
  audit: LicencniAuditZapis[];
  roleMatrica: Record<'viewer' | 'editor' | 'approver', string[]>;
  b2bMeta: ReturnType<typeof getB2BWorkflowMeta>;
}

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

const LOGIN_DELATNOSTI: Array<Pick<PoslovnaDelatnost, 'naziv' | 'domen'>> = [
  { naziv: 'Digitalna Industrija', domen: 'poslovanje' },
  { naziv: 'Gaming Platforma', domen: 'gejming' },
  { naziv: 'AI Platforma', domen: 'ai' },
  { naziv: 'Finansije', domen: 'finansije' },
  { naziv: 'Proksi Mreza', domen: 'infrastruktura' },
  { naziv: 'Mobilna Mreza', domen: 'infrastruktura' },
  { naziv: 'IT Proizvodi', domen: 'poslovanje' },
  { naziv: 'SpajaPro Engine', domen: 'ai' },
  { naziv: 'SPAJA Generator za Endzine', domen: 'ai' },
  { naziv: 'OpenAI Platforma', domen: 'ai' },
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

function buildDelatnosti(): PoslovnaDelatnost[] {
  const fromLogin = LOGIN_DELATNOSTI.map((item, idx) => ({
    id: `login-${idx + 1}-${slug(item.naziv)}`,
    naziv: item.naziv,
    izvor: 'login-api' as const,
    domen: item.domen,
  }));

  const fromPlatformModel = platforme
    .filter((p) => p.kategorija === 'finansije')
    .map((p) => ({
      id: `platform-model-${slug(p.id)}`,
      naziv: `${p.naziv} (${p.kategorija})`,
      izvor: 'platform-model' as const,
      domen: 'finansije' as const,
    }))
    .concat(
      platforms
        .filter((p) => p.category === 'finance')
        .map((p) => ({
          id: `platform-en-${slug(p.id)}`,
          naziv: p.name,
          izvor: 'platform-model' as const,
          domen: 'finansije' as const,
        })),
    );

  const fromCompanyModel = companies
    .filter((c) => c.industry.toLowerCase().includes('fintech') || c.industry.toLowerCase().includes('finance'))
    .map((c) => ({
      id: `company-model-${slug(c.id)}`,
      naziv: c.name,
      izvor: 'company-model' as const,
      domen: 'finansije' as const,
    }));

  return uniqByNaziv([...fromLogin, ...fromPlatformModel, ...fromCompanyModel]);
}

function seedStatusForRequirement(req: LicencniZahtev): LicencaStatus {
  switch (req.code) {
    case 'REG-NBS-EMI':
      return 'nedostaje';
    case 'REG-PSD2-SCA':
    case 'SW-GH-ENTERPRISE':
    case 'SW-GH-COPILOT-ENTERPRISE':
      return 'u_nabavci';
    case 'REG-SOC2-TYPE2':
      return 'istekla';
    case 'OPS-RBAC-MATRIX':
      return 'potvrdjena';
    default:
      return 'potvrdjena';
  }
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
  if (status === 'istekla') return '2026-03-15';
  if (req.code === 'REG-SOC2-TYPE2') return '2026-03-15';
  if (req.code === 'SW-GH-ENTERPRISE' || req.code === 'SW-GH-COPILOT-ENTERPRISE') return '2027-01-31';
  return '2026-12-31';
}

function requirementsForActivity(activity: PoslovnaDelatnost): LicencniZahtev[] {
  const commonRegulatorne: LicencniZahtev[] = [
    {
      code: 'REG-KYC-KYB',
      naziv: 'KYC/KYB verifikacijski okvir',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'Interni compliance + lokalni regulator',
      rizik: 'kriticno',
    },
    {
      code: 'REG-AML-CTF',
      naziv: 'AML/CTF kontrolni okvir',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'Interni AML officer + regulator',
      rizik: 'kriticno',
    },
    {
      code: 'REG-GDPR-DPO',
      naziv: 'GDPR/DPO program usklađenosti',
      klasifikacija: 'regulatorna',
      regulatorIliIzdavalac: 'EU GDPR okvir',
      rizik: 'visoko',
    },
    {
      code: 'REG-SOC2-TYPE2',
      naziv: 'SOC2 Type II atestacija',
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

  if (naziv.includes('finans') || naziv.includes('banka') || naziv.includes('menja')) {
    dodatne.push(
      {
        code: 'REG-NBS-EMI',
        naziv: 'Dozvola za platne usluge / EMI model',
        klasifikacija: 'regulatorna',
        regulatorIliIzdavalac: 'NBS ili nadležni regulator',
        rizik: 'kriticno',
      },
      {
        code: 'REG-PSD2-SCA',
        naziv: 'PSD2 SCA usklađenost',
        klasifikacija: 'regulatorna',
        regulatorIliIzdavalac: 'EU PSD2 okvir',
        rizik: 'visoko',
      },
    );
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
        validFrom: status === 'neprimenljivo' ? null : '2026-01-01',
        validTo,
        dokaz,
        procurementStatus,
        procurementReferenca: procurementStatus === 'u_toku' ? `PROC-${slug(req.code)}-${slug(delatnost.id)}` : null,
        poslednjaIzmenaAt: now,
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
      akcija: 'gap_analysis_completed',
      status: kriticni > 0 ? 'upozorenje' : 'uspesno',
      detalji: `Gap analiza završena: ${gaps.length} otvorenih gap-ova, kritičnih: ${kriticni}, u nabavci: ${uNabavci}.`,
      timestamp: new Date().toISOString(),
    },
  ];
}

export function buildAIIQWorldBankLicencniRegistar(): AIIQWorldBankLicencniRegistar {
  const delatnosti = buildDelatnosti();
  const licence = buildLicenceRows(delatnosti);
  const gapovi = buildGapovi(licence);
  const coveragePoDelatnosti = buildCoverage(licence, delatnosti);
  const nabavka = buildNabavkaStavke(licence);

  return {
    naziv: 'AI IQ WORLD BANK — Licencni registar po delatnostima',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
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
