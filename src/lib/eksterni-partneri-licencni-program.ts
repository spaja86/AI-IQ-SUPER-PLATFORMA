/**
 * Eksterni Partneri — Licencni Program Saradnje
 *
 * Formalizuje nabavku svih Vercel/GitHub/OpenAI licenci i uvezuje
 * taj program sa eksternim bankama i kompanijama (uplate, fakture,
 * odobrenja, operativa) kao jedan kontrolisani enterprise tok.
 *
 * Faze A–F prema implementacionom planu:
 *  A – Definicija opsega (obavezne licence, add-on, status tok)
 *  B – Model eksternih partnera (banke/kompanije, uloge, SLA)
 *  C – Integracija sa enterprise API slojem (financial + partner readiness)
 *  D – B2B checklist-to-payment pipeline
 *  E – KPI signali i go/no-go kriterijumi
 *  F – Audit trag i compliance evidencija
 */

import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getEnterpriseZahtevi } from '@/lib/kompanija-spaja-operativa';
import { getLicencniPortfolioVendorStatus } from '@/lib/digitalna-industrija-licencni-portfolio';

// ─── Faza A — Tipovi i status tok ────────────────────────────────────────────

/** Statusni tok po vendoru: levo → desno, jednosmjerno */
export type LicencniProgramStatus =
  | 'identifikovano'
  | 'spremno'
  | 'poslato'
  | 'pregovori'
  | 'potpisano'
  | 'aktivno';

export type LicencnaObaveznost = 'obavezna' | 'preporucena' | 'opciona';

export type LicencniVendor = 'vercel' | 'github' | 'openai';

export interface LicencniProgramStavka {
  id: string;
  vendor: LicencniVendor;
  naziv: string;
  plan: string;
  obaveznost: LicencnaObaveznost;
  poslovniRazlog: string;
  seats: number | null;
  budzetRSD: number;
  valuta: 'RSD' | 'EUR' | 'USD';
  status: LicencniProgramStatus;
  rok: string;
  addOn: boolean;
}

const LICENCNI_PROGRAM_STAVKE: LicencniProgramStavka[] = [
  // ─ Vercel ─
  {
    id: 'prog-vercel-enterprise',
    vendor: 'vercel',
    naziv: 'Vercel Enterprise — centralni billing i governance',
    plan: 'Vercel Enterprise',
    obaveznost: 'obavezna',
    poslovniRazlog:
      'Centralizovani billing, SSO, enterprise governance i team ownership za celu Digitalnu Industriju.',
    seats: null,
    budzetRSD: 2_400_000,
    valuta: 'RSD',
    status: 'identifikovano',
    rok: '2027-01-31',
    addOn: false,
  },
  {
    id: 'prog-vercel-advanced-observability',
    vendor: 'vercel',
    naziv: 'Vercel Advanced Observability — Analytics + Speed Insights',
    plan: 'Vercel Enterprise Add-On',
    obaveznost: 'preporucena',
    poslovniRazlog:
      'Puna vidljivost u performanse platforme; zahtev eksternih poslovnih partnera za SLA reporting.',
    seats: null,
    budzetRSD: 480_000,
    valuta: 'RSD',
    status: 'identifikovano',
    rok: '2027-01-31',
    addOn: true,
  },
  // ─ GitHub ─
  {
    id: 'prog-github-enterprise',
    vendor: 'github',
    naziv: 'GitHub Enterprise — advanced security i centralni billing',
    plan: 'GitHub Enterprise',
    obaveznost: 'obavezna',
    poslovniRazlog:
      'GHAS, audit log, centralni billing; prenos plaćanja sa spajicn@yahoo.com na kompanijski billing.',
    seats: 25,
    budzetRSD: 1_800_000,
    valuta: 'RSD',
    status: 'identifikovano',
    rok: '2027-01-31',
    addOn: false,
  },
  {
    id: 'prog-github-copilot-enterprise',
    vendor: 'github',
    naziv: 'GitHub Copilot Enterprise — AI assisted development',
    plan: 'GitHub Copilot Enterprise',
    obaveznost: 'preporucena',
    poslovniRazlog:
      'AI-assisted development za sve developere Digitalne Industrije; integracija sa OMEGA AI operativom.',
    seats: 25,
    budzetRSD: 900_000,
    valuta: 'RSD',
    status: 'identifikovano',
    rok: '2027-01-31',
    addOn: true,
  },
  // ─ OpenAI ─
  {
    id: 'prog-openai-enterprise',
    vendor: 'openai',
    naziv: 'OpenAI Enterprise — dedicated capacity i SLA',
    plan: 'OpenAI Enterprise',
    obaveznost: 'obavezna',
    poslovniRazlog:
      'Dedicated API kapacitet, data privacy garantije i SLA za SpajaPro engine i AI IQ SUPER PLATFORMU.',
    seats: null,
    budzetRSD: 3_600_000,
    valuta: 'RSD',
    status: 'identifikovano',
    rok: '2026-12-31',
    addOn: false,
  },
  {
    id: 'prog-openai-chatgpt-enterprise',
    vendor: 'openai',
    naziv: 'ChatGPT Enterprise — kompanijski nalog',
    plan: 'ChatGPT Enterprise',
    obaveznost: 'preporucena',
    poslovniRazlog:
      'Kompanijski ChatGPT Enterprise nalog kao komplementaran kanal uz SpajaPro v6-15 engine.',
    seats: 10,
    budzetRSD: 720_000,
    valuta: 'RSD',
    status: 'identifikovano',
    rok: '2026-12-31',
    addOn: true,
  },
];

// ─── Faza B — Eksterni partneri (banke + kompanije) ──────────────────────────

export type EksterniPartnerUloga =
  | 'payer'
  | 'reseller'
  | 'integrator'
  | 'compliance_partner';

export type EksterniPartnerTip = 'eksterna_banka' | 'eksterna_kompanija';

export type EksterniPartnerStatus =
  | 'identifikovan'
  | 'kontaktiran'
  | 'u_pregovorima'
  | 'aktivan'
  | 'pauziran';

export interface EksterniPartnerUplatniKanal {
  tip: 'swift' | 'sepa' | 'domaci_transfer' | 'kreditna_kartica' | 'platforma_api';
  detalji: string;
}

export interface EksterniPartner {
  id: string;
  naziv: string;
  tip: EksterniPartnerTip;
  uloga: EksterniPartnerUloga;
  trziste: string;
  status: EksterniPartnerStatus;
  sla: string;
  uplatniKanali: EksterniPartnerUplatniKanal[];
  obavezniDokumenti: string[];
  kontaktEmail: string;
  napomena: string;
}

const EKSTERNI_PARTNERI: EksterniPartner[] = [
  // ─ Banke ─
  {
    id: 'partner-erste-banka',
    naziv: 'Erste Banka Srbija',
    tip: 'eksterna_banka',
    uloga: 'payer',
    trziste: 'Srbija',
    status: 'identifikovan',
    sla: '3 radna dana za autorizaciju enterprise transakcija',
    uplatniKanali: [
      { tip: 'sepa', detalji: 'SEPA transfer za EUR plaćanja u inostranstvu' },
      { tip: 'domaci_transfer', detalji: 'Domaći platni promet za RSD' },
    ],
    obavezniDokumenti: [
      'Ugovor o poslovnom bankarstvu',
      'PIB/MB kompanije',
      'Ovlašćeno lice (OP obrazac)',
    ],
    kontaktEmail: 'poslovni@erstebanka.rs',
    napomena:
      'Primarna banka za enterprise licence plaćanja; postojeći račun AI IQ World Bank DIGI-IND-001.',
  },
  {
    id: 'partner-raiffeisen-banka',
    naziv: 'Raiffeisen Banka Srbija',
    tip: 'eksterna_banka',
    uloga: 'payer',
    trziste: 'Srbija',
    status: 'identifikovan',
    sla: '2 radna dana za autorizaciju',
    uplatniKanali: [
      { tip: 'swift', detalji: 'SWIFT/BIC za USD i EUR plaćanja u inostranstvu' },
      { tip: 'sepa', detalji: 'SEPA transfer za EUR zone' },
    ],
    obavezniDokumenti: [
      'Ugovor o poslovnom bankarstvu',
      'PIB/MB kompanije',
      'Izvod iz APR-a',
    ],
    kontaktEmail: 'korporativno@raiffeisenbank.rs',
    napomena: 'Sekundarna banka za SWIFT/USD plaćanja Vercel i OpenAI licenci.',
  },
  {
    id: 'partner-komercijalna-banka',
    naziv: 'Komercijalna Banka Srbija',
    tip: 'eksterna_banka',
    uloga: 'compliance_partner',
    trziste: 'Srbija',
    status: 'identifikovan',
    sla: '5 radnih dana za compliance pregled',
    uplatniKanali: [
      { tip: 'domaci_transfer', detalji: 'Domaći platni promet RSD' },
    ],
    obavezniDokumenti: [
      'Ugovor o usluzi',
      'AML dokumentacija',
      'Izvod iz APR-a',
    ],
    kontaktEmail: 'korporativni@kombank.com',
    napomena: 'Compliance partner za AML i NBS regulatorne zahteve pri enterprise uplatama.',
  },
  // ─ Kompanije ─
  {
    id: 'partner-gigatron',
    naziv: 'GIGATRON d.o.o.',
    tip: 'eksterna_kompanija',
    uloga: 'reseller',
    trziste: 'Srbija',
    status: 'u_pregovorima',
    sla: '48h za enterprise ponudu',
    uplatniKanali: [
      { tip: 'domaci_transfer', detalji: 'Domaći platni promet RSD' },
      { tip: 'kreditna_kartica', detalji: 'Business kreditna kartica EUR' },
    ],
    obavezniDokumenti: [
      'Ugovor o resellerstvu',
      'Faktura/predračun',
      'PIB/MB prodavca',
    ],
    kontaktEmail: 'b2b@gigatron.rs',
    napomena:
      'Ovlašćeni IT reseller za softverske licence; u aktivnim pregovorima (B2B case B2B-LUX-001).',
  },
  {
    id: 'partner-mts-telekom',
    naziv: 'MTS — Telekom Srbija (Biznis)',
    tip: 'eksterna_kompanija',
    uloga: 'integrator',
    trziste: 'Srbija',
    status: 'identifikovan',
    sla: '72h za integratorski odgovor',
    uplatniKanali: [
      { tip: 'domaci_transfer', detalji: 'RSD transfer MTS Biznis' },
      { tip: 'platforma_api', detalji: 'MTS Biznis API za automatske uplate' },
    ],
    obavezniDokumenti: [
      'Ugovor o integratorskim uslugama',
      'NDA',
      'PIB/MB',
    ],
    kontaktEmail: 'biznis@mts.rs',
    napomena:
      'Infrastrukturni integrator; relevantno za mobilnu mrežu i API payment gateway integracije.',
  },
  {
    id: 'partner-a1-srbija',
    naziv: 'A1 Srbija (Biznis)',
    tip: 'eksterna_kompanija',
    uloga: 'integrator',
    trziste: 'Srbija',
    status: 'identifikovan',
    sla: '72h za ponudu',
    uplatniKanali: [
      { tip: 'domaci_transfer', detalji: 'RSD transfer A1 Biznis' },
    ],
    obavezniDokumenti: [
      'Ugovor o poslovnoj saradnji',
      'PIB/MB',
    ],
    kontaktEmail: 'poslovni@a1.rs',
    napomena: 'Sekundarni integrator za telekomunikacione i platne API integracije.',
  },
];

// ─── Faza C — Integrisani enterprise status (financial + partner readiness) ──

export interface EnterpriseProsirenjeStatus {
  vendor: LicencniVendor;
  vendorStatus: string;
  portfolioStatus: string;
  uskladen: boolean;
  finansijskaSpremnost: boolean;
  partnerSpremnost: boolean;
  goNoGo: 'go' | 'no-go' | 'uslovni-go';
  blokatori: string[];
}

function izracunajEnterpriseProsirenjeStatus(): EnterpriseProsirenjeStatus[] {
  const zahtevi = getEnterpriseZahtevi();
  const vendorStatus = getLicencniPortfolioVendorStatus();
  const paymentSource = 'AI IQ World Bank';

  return (['vercel', 'github', 'openai'] as LicencniVendor[]).map((vendor) => {
    const zahtev = zahtevi.find((z) => z.id === vendor);
    const vs = vendorStatus.find((v) => v.portfolioStavkaId.includes(vendor));
    const stavke = LICENCNI_PROGRAM_STAVKE.filter((s) => s.vendor === vendor);
    const blokatori: string[] = [];

    if (!zahtev) blokatori.push(`Enterprise zahtev za ${vendor} nije pronađen.`);
    if (!stavke.length) blokatori.push(`Nema licencnih stavki za ${vendor}.`);

    const finansijskaSpremnost = Boolean(paymentSource);
    const partnerSpremnost = EKSTERNI_PARTNERI.some(
      (p) => p.uloga === 'payer' && p.status !== 'pauziran',
    );

    if (!finansijskaSpremnost) blokatori.push('Izvor financiranja nije definisan.');
    if (!partnerSpremnost)
      blokatori.push('Nema aktivnog payer partnera za enterprise uplate.');

    const uskladen = vs?.uskladen ?? false;
    if (!uskladen) blokatori.push(`Vendor status za ${vendor} nije usklađen sa portfolio statusom.`);

    let goNoGo: 'go' | 'no-go' | 'uslovni-go';
    if (blokatori.length === 0) goNoGo = 'go';
    else if (!finansijskaSpremnost || !partnerSpremnost) goNoGo = 'no-go';
    else goNoGo = 'uslovni-go';

    return {
      vendor,
      vendorStatus: zahtev?.status ?? 'u_pripremi',
      portfolioStatus: vs?.portfolioStatus ?? 'identifikovano',
      uskladen,
      finansijskaSpremnost,
      partnerSpremnost,
      goNoGo,
      blokatori,
    };
  });
}

// ─── Faza D — B2B checklist-to-payment pipeline ──────────────────────────────

export type ChecklistGateStatus = 'ceka' | 'u_toku' | 'zavrseno';

export interface LicencniChecklistGate {
  redniBroj: number;
  naziv: string;
  opis: string;
  status: ChecklistGateStatus;
  blokiraNarednu: boolean;
}

export interface LicencniPaymentPipeline {
  vendor: LicencniVendor;
  stavkaId: string;
  naziv: string;
  gates: LicencniChecklistGate[];
  readyForPayment: boolean;
  missing: string[];
}

function buildPaymentPipeline(stavka: LicencniProgramStavka): LicencniPaymentPipeline {
  const baseGates: Array<Omit<LicencniChecklistGate, 'status'>> = [
    {
      redniBroj: 1,
      naziv: 'Dokumentacija',
      opis: 'Pravno lice, PIB/MB, ovlašćeno lice i OP obrazac su verifikovani.',
      blokiraNarednu: true,
    },
    {
      redniBroj: 2,
      naziv: 'Odobrenje',
      opis: 'Vlasničko i billing odobrenje su dati (Nikola Spajić + poslovni kontakt).',
      blokiraNarednu: true,
    },
    {
      redniBroj: 3,
      naziv: 'Uplata',
      opis: `Predračun je primljen od ${stavka.naziv}; uplata ide preko AI IQ World Bank.`,
      blokiraNarednu: true,
    },
    {
      redniBroj: 4,
      naziv: 'Aktivacija',
      opis: 'Licenca je aktivirana i enterprise onboarding je potvrđen od vendora.',
      blokiraNarednu: false,
    },
  ];

  const gateStatus = (redniBroj: number): ChecklistGateStatus => {
    if (stavka.status === 'aktivno') return 'zavrseno';
    if (stavka.status === 'potpisano' && redniBroj <= 3) return 'zavrseno';
    if (stavka.status === 'pregovori' && redniBroj <= 2) return 'zavrseno';
    if (stavka.status === 'pregovori' && redniBroj === 3) return 'u_toku';
    if (stavka.status === 'poslato' && redniBroj === 1) return 'zavrseno';
    if (stavka.status === 'poslato' && redniBroj === 2) return 'u_toku';
    if (stavka.status === 'spremno' && redniBroj === 1) return 'u_toku';
    return 'ceka';
  };

  const gates: LicencniChecklistGate[] = baseGates.map((g) => ({
    ...g,
    status: gateStatus(g.redniBroj),
  }));

  const missing: string[] = [];
  for (const gate of gates) {
    if (gate.status !== 'zavrseno' && gate.blokiraNarednu) {
      missing.push(`${gate.naziv}: ${gate.opis}`);
    }
  }

  const readyForPayment =
    gates[0].status === 'zavrseno' &&
    gates[1].status === 'zavrseno' &&
    ['pregovori', 'potpisano', 'aktivno'].includes(stavka.status);

  return {
    vendor: stavka.vendor,
    stavkaId: stavka.id,
    naziv: stavka.naziv,
    gates,
    readyForPayment,
    missing,
  };
}

// ─── Faza E — KPI signali i go/no-go kriterijumi ─────────────────────────────

export interface EnterpriseKPI {
  procenatAktivnihLicenci: number;
  procenatSpremniZaUplatu: number;
  brojOtvorenihBlokatora: number;
  ukupnoLicenci: number;
  aktivnihLicenci: number;
  potpisanihUgovora: number;
  prosecnoVremeDoPotpisivanjaDana: number | null;
  paymentSource: string;
  centralniPayer: string;
}

function izracunajKPI(pipelines: LicencniPaymentPipeline[]): EnterpriseKPI {
  const ukupno = LICENCNI_PROGRAM_STAVKE.length;
  const aktivnih = LICENCNI_PROGRAM_STAVKE.filter((s) => s.status === 'aktivno').length;
  const potpisanih = LICENCNI_PROGRAM_STAVKE.filter((s) =>
    ['potpisano', 'aktivno'].includes(s.status),
  ).length;
  const spremniZaUplatu = pipelines.filter((p) => p.readyForPayment).length;
  const blokatori = pipelines.reduce((sum, p) => sum + p.missing.length, 0);

  return {
    procenatAktivnihLicenci: ukupno === 0 ? 0 : Math.round((aktivnih / ukupno) * 100),
    procenatSpremniZaUplatu: ukupno === 0 ? 0 : Math.round((spremniZaUplatu / ukupno) * 100),
    brojOtvorenihBlokatora: blokatori,
    ukupnoLicenci: ukupno,
    aktivnihLicenci: aktivnih,
    potpisanihUgovora: potpisanih,
    prosecnoVremeDoPotpisivanjaDana: null,
    paymentSource: 'AI IQ World Bank',
    centralniPayer: 'AI IQ World Bank — DIGI-IND-001',
  };
}

// ─── Faza F — Audit trag ─────────────────────────────────────────────────────

export interface AuditTrailStavka {
  id: string;
  akcija: string;
  entitet: string;
  status: 'uspesno' | 'upozorenje' | 'greska';
  detalji: string;
  timestamp: string;
}

function buildAuditTrail(
  prosirenjeStatusi: EnterpriseProsirenjeStatus[],
): AuditTrailStavka[] {
  const now = new Date().toISOString();
  const audit: AuditTrailStavka[] = [
    {
      id: `AUDIT-PROG-${Date.now()}-01`,
      akcija: 'program_scope_finalized',
      entitet: 'LicencniProgramSaradnje',
      status: 'uspesno',
      detalji: `Definisan opseg za ${LICENCNI_PROGRAM_STAVKE.length} licencnih stavki (Vercel/GitHub/OpenAI).`,
      timestamp: now,
    },
    {
      id: `AUDIT-PROG-${Date.now()}-02`,
      akcija: 'partner_registry_created',
      entitet: 'EksterniPartneri',
      status: 'uspesno',
      detalji: `Registrovano ${EKSTERNI_PARTNERI.length} eksternih partnera (${EKSTERNI_PARTNERI.filter((p) => p.tip === 'eksterna_banka').length} banke, ${EKSTERNI_PARTNERI.filter((p) => p.tip === 'eksterna_kompanija').length} kompanije).`,
      timestamp: now,
    },
  ];

  for (const ps of prosirenjeStatusi) {
    audit.push({
      id: `AUDIT-PROG-${Date.now()}-${ps.vendor}`,
      akcija: 'vendor_enterprise_status_checked',
      entitet: `vendor:${ps.vendor}`,
      status: ps.blokatori.length === 0 ? 'uspesno' : 'upozorenje',
      detalji:
        ps.blokatori.length === 0
          ? `Vendor ${ps.vendor}: go/no-go = ${ps.goNoGo}. Nema blokatora.`
          : `Vendor ${ps.vendor}: go/no-go = ${ps.goNoGo}. Blokatori: ${ps.blokatori.join(' | ')}`,
      timestamp: now,
    });
  }

  return audit;
}

// ─── Faza G — Summary i metrike ──────────────────────────────────────────────

export interface LicencniProgramSaradnjeSummary {
  ukupnoLicenci: number;
  obaveznihLicenci: number;
  preporukenihLicenci: number;
  opcionihLicenci: number;
  ukupniBudzetRSD: number;
  poVendoru: Record<LicencniVendor, { ukupno: number; budzetRSD: number }>;
  poStatusu: Record<LicencniProgramStatus, number>;
  eksterniPartneri: {
    ukupno: number;
    banke: number;
    kompanije: number;
    aktivnih: number;
  };
}

function buildSummary(): LicencniProgramSaradnjeSummary {
  const stavke = LICENCNI_PROGRAM_STAVKE;

  const poVendoru: Record<LicencniVendor, { ukupno: number; budzetRSD: number }> = {
    vercel: { ukupno: 0, budzetRSD: 0 },
    github: { ukupno: 0, budzetRSD: 0 },
    openai: { ukupno: 0, budzetRSD: 0 },
  };
  const poStatusu: Record<LicencniProgramStatus, number> = {
    identifikovano: 0,
    spremno: 0,
    poslato: 0,
    pregovori: 0,
    potpisano: 0,
    aktivno: 0,
  };

  let ukupniBudzetRSD = 0;
  let obaveznih = 0;
  let preporucenih = 0;
  let opcionih = 0;

  for (const s of stavke) {
    poVendoru[s.vendor].ukupno++;
    poVendoru[s.vendor].budzetRSD += s.budzetRSD;
    poStatusu[s.status]++;
    ukupniBudzetRSD += s.budzetRSD;
    if (s.obaveznost === 'obavezna') obaveznih++;
    else if (s.obaveznost === 'preporucena') preporucenih++;
    else opcionih++;
  }

  return {
    ukupnoLicenci: stavke.length,
    obaveznihLicenci: obaveznih,
    preporukenihLicenci: preporucenih,
    opcionihLicenci: opcionih,
    ukupniBudzetRSD,
    poVendoru,
    poStatusu,
    eksterniPartneri: {
      ukupno: EKSTERNI_PARTNERI.length,
      banke: EKSTERNI_PARTNERI.filter((p) => p.tip === 'eksterna_banka').length,
      kompanije: EKSTERNI_PARTNERI.filter((p) => p.tip === 'eksterna_kompanija').length,
      aktivnih: EKSTERNI_PARTNERI.filter((p) => p.status === 'aktivan').length,
    },
  };
}

// ─── Glavni builder ──────────────────────────────────────────────────────────

export interface LicencniProgramSaradnje {
  naziv: string;
  kompanija: string;
  verzija: string;
  timestamp: string;
  jurisdikcija: string;
  rezimNabavke: string;
  stavke: LicencniProgramStavka[];
  eksterniPartneri: EksterniPartner[];
  prosirenjeStatusi: EnterpriseProsirenjeStatus[];
  paymentPipelines: LicencniPaymentPipeline[];
  kpi: EnterpriseKPI;
  audit: AuditTrailStavka[];
  summary: LicencniProgramSaradnjeSummary;
}

export function buildLicencniProgramSaradnje(): LicencniProgramSaradnje {
  const prosirenjeStatusi = izracunajEnterpriseProsirenjeStatus();
  const paymentPipelines = LICENCNI_PROGRAM_STAVKE.map(buildPaymentPipeline);
  const kpi = izracunajKPI(paymentPipelines);
  const audit = buildAuditTrail(prosirenjeStatusi);
  const summary = buildSummary();

  return {
    naziv: 'Licencni Program Saradnje — Vercel / GitHub / OpenAI',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
    jurisdikcija: 'Srbija',
    rezimNabavke: 'kupujemo_sve_licence',
    stavke: LICENCNI_PROGRAM_STAVKE,
    eksterniPartneri: EKSTERNI_PARTNERI,
    prosirenjeStatusi,
    paymentPipelines,
    kpi,
    audit,
    summary,
  };
}

// ─── Helperi za parcijalne upite ─────────────────────────────────────────────

/** Vraća samo stavke koje nisu aktivne (procurement queue) */
export function getLicencniProgramProcurementQueue(): LicencniProgramStavka[] {
  return LICENCNI_PROGRAM_STAVKE.filter((s) => s.status !== 'aktivno');
}

/** Vraća samo externe banke */
export function getEksterneBanke(): EksterniPartner[] {
  return EKSTERNI_PARTNERI.filter((p) => p.tip === 'eksterna_banka');
}

/** Vraća samo externe kompanije */
export function getEksterneKompanije(): EksterniPartner[] {
  return EKSTERNI_PARTNERI.filter((p) => p.tip === 'eksterna_kompanija');
}

/** Vraća KPI menadžment pregled */
export function getLicencniProgramKPI(): EnterpriseKPI {
  const pipelines = LICENCNI_PROGRAM_STAVKE.map(buildPaymentPipeline);
  return izracunajKPI(pipelines);
}

/** Vraća go/no-go status po vendoru */
export function getGoNoGoPoVendoru(): EnterpriseProsirenjeStatus[] {
  return izracunajEnterpriseProsirenjeStatus();
}
