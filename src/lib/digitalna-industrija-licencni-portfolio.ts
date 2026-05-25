/**
 * Digitalna Industrija — Licencni Portfolio
 *
 * Centralni 4-nivoski portfolio licenci za Digitalnu Industriju i sve što je na njoj:
 *   1. maticni-subjekt    — Digitalna Industrija (matični pravni subjekt)
 *   2. povezani-entitet   — AI IQ World Bank Operativa, SPAJA Tehnološki Centar
 *   3. platforma-asset    — platforme i IT proizvodi ekosistema
 *   4. vendor-enterprise  — enterprise ugovori sa Vercel, GitHub, OpenAI
 *
 * Svaka stavka prolazi kroz statusni tok:
 *   identifikovano → spremno_za_nabavku → u_pregovorima → naruceno → placeno → aktivirano → verifikovano
 *
 * Blokatori su razdvojeni na:
 *   blokira_legalan_rad | blokira_platforme | neblokirajuca
 */

import { APP_VERSION, KOMPANIJA } from './constants';
import { buildDigitalnaIndustrijaPibMb } from './digitalna-industrija-pib-mb';
import { getEnterpriseZahtevi } from './kompanija-spaja-operativa';

export type LicencniPortfolioTip =
  | 'regulatorna'
  | 'softverska'
  | 'operativna'
  | 'enterprise-ugovor';

export type LicencniPortfolioNivo =
  | 'maticni-subjekt'
  | 'povezani-entitet'
  | 'platforma-asset'
  | 'vendor-enterprise';

export type LicencniPortfolioStatus =
  | 'identifikovano'
  | 'spremno_za_nabavku'
  | 'u_pregovorima'
  | 'naruceno'
  | 'placeno'
  | 'aktivirano'
  | 'verifikovano';

export type LicencniPortfolioObaveznost = 'obavezna' | 'preporucena' | 'opciona';

export type LicencniPortfolioBlokator =
  | 'blokira_legalan_rad'
  | 'blokira_platforme'
  | 'neblokirajuca';

export interface LicencniPortfolioDokaz {
  tip: 'ugovor' | 'faktura' | 'sertifikat' | 'interna-politika';
  referenca: string;
  napomena?: string;
  vaziOd: string | null;
  vaziDo: string | null;
}

export interface LicencniPortfolioStavka {
  id: string;
  entitet: string;
  nivo: LicencniPortfolioNivo;
  tip: LicencniPortfolioTip;
  naziv: string;
  regulatorIliVendor: string;
  obaveznost: LicencniPortfolioObaveznost;
  status: LicencniPortfolioStatus;
  blokator: LicencniPortfolioBlokator;
  budzetRSD: number;
  rok: string | null;
  vlasnik: string;
  dokaz: LicencniPortfolioDokaz | null;
  zavisnosti: string[];
  napomena: string;
}

export interface LicencniPortfolioSummary {
  ukupno: number;
  poNivou: Record<LicencniPortfolioNivo, number>;
  poStatusu: Record<LicencniPortfolioStatus, number>;
  poTipu: Record<LicencniPortfolioTip, number>;
  blokirajucihLegalanRad: number;
  blokirajucihPlatforme: number;
  neblokirajucih: number;
  ukupniBudzetRSD: number;
  verifikovano: number;
  procenatZavrsenih: number;
}

export interface DigitalnaIndustrijaLicencniPortfolio {
  naziv: string;
  kompanija: string;
  verzija: string;
  timestamp: string;
  jurisdikcija: 'Srbija';
  rezimNabavke: 'kupujemo_sve_licence';
  entiteti: string[];
  stavke: LicencniPortfolioStavka[];
  summary: LicencniPortfolioSummary;
  procurementQueue: LicencniPortfolioStavka[];
  vendorEnterpriseIntegrisan: VendorEnterpriseStatus[];
}

export interface VendorEnterpriseStatus {
  vendor: string;
  portfolioStavkaId: string;
  enterpriseZahtevStatus: string;
  portfolioStatus: LicencniPortfolioStatus;
  uskladen: boolean;
}

const VLASNIK_OPERATIVA = 'billing@spaja.rs';
const VLASNIK_TEHNICKO = 'tech@spaja.rs';
const VLASNIK_BIZNIS = 'business@spaja.rs';
const VLASNIK_COMPLIANCE = 'sales@spaja.rs';

// Pomoćna funkcija za seeding verifikovanog dokaza
function verifikovanDokaz(
  tip: LicencniPortfolioDokaz['tip'],
  referenca: string,
  napomena?: string,
): LicencniPortfolioDokaz {
  return {
    tip,
    referenca,
    napomena,
    vaziOd: '2026-01-01',
    vaziDo: '2026-12-31',
  };
}

// ─── Nivo 1: Matični subjekt — Digitalna Industrija ─────────────────────────

function buildMaticniSubjektStavke(): LicencniPortfolioStavka[] {
  return [
    {
      id: 'lic-ms-apr-registracija',
      entitet: 'Digitalna Industrija',
      nivo: 'maticni-subjekt',
      tip: 'regulatorna',
      naziv: 'APR registracija privrednog društva',
      regulatorIliVendor: 'Agencija za privredne registre (APR)',
      obaveznost: 'obavezna',
      status: 'verifikovano',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 0,
      rok: '2026-12-31',
      vlasnik: VLASNIK_OPERATIVA,
      dokaz: verifikovanDokaz('sertifikat', 'APR-REG-2024-DI-001', 'Rešenje APR o osnivanju privrednog društva'),
      zavisnosti: [],
      napomena: 'Osnivačka registracija — PIB i MB su aktivni u registru.',
    },
    {
      id: 'lic-ms-apr-godisnji-izvestaj',
      entitet: 'Digitalna Industrija',
      nivo: 'maticni-subjekt',
      tip: 'regulatorna',
      naziv: 'Godišnji finansijski izveštaj (APR)',
      regulatorIliVendor: 'APR / Ministarstvo finansija',
      obaveznost: 'obavezna',
      status: 'u_pregovorima',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 0,
      rok: '2026-03-31',
      vlasnik: VLASNIK_OPERATIVA,
      dokaz: null,
      zavisnosti: ['lic-ms-apr-registracija'],
      napomena: 'Obaveza podnošenja godišnjeg finansijskog izveštaja prema APR.',
    },
    {
      id: 'lic-ms-aml-ctf-program',
      entitet: 'Digitalna Industrija',
      nivo: 'maticni-subjekt',
      tip: 'regulatorna',
      naziv: 'AML/CTF program i prijava odgovornog lica',
      regulatorIliVendor: 'Uprava za sprečavanje pranja novca (USPN)',
      obaveznost: 'obavezna',
      status: 'u_pregovorima',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 1_780_000,
      rok: '2026-07-10',
      vlasnik: VLASNIK_COMPLIANCE,
      dokaz: null,
      zavisnosti: ['lic-ms-apr-registracija'],
      napomena: 'AML/KYT monitoring i prijava odgovornog lica USPN-u.',
    },
    {
      id: 'lic-ms-dpo-zastita-podataka',
      entitet: 'Digitalna Industrija',
      nivo: 'maticni-subjekt',
      tip: 'regulatorna',
      naziv: 'Program zaštite podataka i DPO evidencija',
      regulatorIliVendor: 'Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti',
      obaveznost: 'obavezna',
      status: 'u_pregovorima',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 1_150_000,
      rok: '2026-08-15',
      vlasnik: VLASNIK_COMPLIANCE,
      dokaz: null,
      zavisnosti: ['lic-ms-apr-registracija'],
      napomena: 'Godišnji program usklađenosti sa Zakonom o zaštiti podataka o ličnosti.',
    },
    {
      id: 'lic-ms-efaktura',
      entitet: 'Digitalna Industrija',
      nivo: 'maticni-subjekt',
      tip: 'softverska',
      naziv: 'Integracija sa sistemom eFaktura (Ministarstvo finansija)',
      regulatorIliVendor: 'Ministarstvo finansija / Poreska uprava',
      obaveznost: 'obavezna',
      status: 'spremno_za_nabavku',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 540_000,
      rok: '2026-12-01',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: null,
      zavisnosti: ['lic-ms-apr-registracija'],
      napomena: 'Obaveza elektronske razmene faktura za pravna lica u Srbiji.',
    },
  ];
}

// ─── Nivo 2: Povezani entiteti ───────────────────────────────────────────────

function buildPovezaniEntitetiStavke(): LicencniPortfolioStavka[] {
  return [
    // AI IQ World Bank Operativa
    {
      id: 'lic-pe-nbs-pi',
      entitet: 'AI IQ World Bank Operativa',
      nivo: 'povezani-entitet',
      tip: 'regulatorna',
      naziv: 'NBS dozvola za platne usluge (Platna institucija / EMI)',
      regulatorIliVendor: 'Narodna banka Srbije (NBS)',
      obaveznost: 'obavezna',
      status: 'u_pregovorima',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 3_600_000,
      rok: '2026-09-30',
      vlasnik: VLASNIK_OPERATIVA,
      dokaz: null,
      zavisnosti: ['lic-ms-apr-registracija', 'lic-ms-aml-ctf-program'],
      napomena: 'Licenca NBS za pružanje platnih usluga i e-novčanik (PI/EMI model).',
    },
    {
      id: 'lic-pe-nbs-fx',
      entitet: 'AI IQ World Bank Operativa',
      nivo: 'povezani-entitet',
      tip: 'regulatorna',
      naziv: 'NBS odobrenje za menjačke i devizne poslove',
      regulatorIliVendor: 'Narodna banka Srbije (NBS)',
      obaveznost: 'obavezna',
      status: 'u_pregovorima',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 1_200_000,
      rok: '2026-09-30',
      vlasnik: VLASNIK_OPERATIVA,
      dokaz: null,
      zavisnosti: ['lic-pe-nbs-pi'],
      napomena: 'Odobrenje NBS za obavljanje menjačkih i deviznih transakcija.',
    },
    {
      id: 'lic-pe-aml-monitoring',
      entitet: 'AI IQ World Bank Operativa',
      nivo: 'povezani-entitet',
      tip: 'softverska',
      naziv: 'AML/KYT monitoring licenca',
      regulatorIliVendor: 'Uprava za sprečavanje pranja novca + NBS',
      obaveznost: 'obavezna',
      status: 'naruceno',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 1_780_000,
      rok: '2026-07-10',
      vlasnik: VLASNIK_COMPLIANCE,
      dokaz: null,
      zavisnosti: ['lic-ms-aml-ctf-program'],
      napomena: 'Softverska licenca za AML/KYT monitoring sistem.',
    },
    {
      id: 'lic-pe-iso27001',
      entitet: 'AI IQ World Bank Operativa',
      nivo: 'povezani-entitet',
      tip: 'regulatorna',
      naziv: 'ISO 27001 sertifikacioni audit',
      regulatorIliVendor: 'Akreditovano sertifikaciono telo',
      obaveznost: 'preporucena',
      status: 'spremno_za_nabavku',
      blokator: 'blokira_platforme',
      budzetRSD: 920_000,
      rok: '2026-11-20',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: null,
      zavisnosti: ['lic-pe-nbs-pi'],
      napomena: 'ISO 27001 sertifikacija za informacionu bezbednost operativnih sistema.',
    },
    // SPAJA Tehnološki Centar
    {
      id: 'lic-pe-poverenik-audit',
      entitet: 'SPAJA Tehnološki Centar',
      nivo: 'povezani-entitet',
      tip: 'regulatorna',
      naziv: 'Godišnja revizija zaštite podataka (Poverenik)',
      regulatorIliVendor: 'Poverenik za informacije od javnog značaja',
      obaveznost: 'obavezna',
      status: 'u_pregovorima',
      blokator: 'blokira_legalan_rad',
      budzetRSD: 600_000,
      rok: '2026-05-30',
      vlasnik: VLASNIK_COMPLIANCE,
      dokaz: null,
      zavisnosti: ['lic-ms-dpo-zastita-podataka'],
      napomena: 'Godišnja revizija i izveštaj Povereniku o zaštiti podataka o ličnosti.',
    },
    {
      id: 'lic-pe-ratel-mrezna',
      entitet: 'SPAJA Tehnološki Centar',
      nivo: 'povezani-entitet',
      tip: 'regulatorna',
      naziv: 'RATEL — obnova mrežne sertifikacije',
      regulatorIliVendor: 'Regulatorna agencija za elektronske komunikacije i poštanske usluge (RATEL)',
      obaveznost: 'preporucena',
      status: 'u_pregovorima',
      blokator: 'blokira_platforme',
      budzetRSD: 480_000,
      rok: '2026-07-20',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: null,
      zavisnosti: [],
      napomena: 'Sertifikacija mrežnih servisa i infrastrukture prema RATEL regulativi.',
    },
  ];
}

// ─── Nivo 3: Platforme i IT imovina ekosistema ───────────────────────────────

function buildPlatformaAssetStavke(): LicencniPortfolioStavka[] {
  return [
    {
      id: 'lic-pa-vercel-hosting',
      entitet: 'AI IQ SUPER PLATFORMA',
      nivo: 'platforma-asset',
      tip: 'softverska',
      naziv: 'Vercel hosting i deployment (Pro plan)',
      regulatorIliVendor: 'Vercel Inc.',
      obaveznost: 'obavezna',
      status: 'aktivirano',
      blokator: 'blokira_platforme',
      budzetRSD: 240_000,
      rok: '2027-01-31',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: verifikovanDokaz('ugovor', 'VERCEL-PRO-2026-001', 'Vercel Pro subscription — aktivan'),
      zavisnosti: [],
      napomena: 'Hosting i CI/CD za sve platforme Digitalne Industrije na Vercel-u.',
    },
    {
      id: 'lic-pa-github-repo',
      entitet: 'AI IQ SUPER PLATFORMA',
      nivo: 'platforma-asset',
      tip: 'softverska',
      naziv: 'GitHub repozitorijum i Actions (Team plan)',
      regulatorIliVendor: 'GitHub / Microsoft',
      obaveznost: 'obavezna',
      status: 'aktivirano',
      blokator: 'blokira_platforme',
      budzetRSD: 180_000,
      rok: '2027-01-31',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: verifikovanDokaz('ugovor', 'GITHUB-TEAM-2026-001', 'GitHub Team subscription — aktivan'),
      zavisnosti: [],
      napomena: 'Centralni repozitorijum i workflows za CI/CD Digitalne Industrije.',
    },
    {
      id: 'lic-pa-openai-api',
      entitet: 'AI IQ SUPER PLATFORMA',
      nivo: 'platforma-asset',
      tip: 'softverska',
      naziv: 'OpenAI API — OMEGA AI i SpajaPro Engine',
      regulatorIliVendor: 'OpenAI',
      obaveznost: 'obavezna',
      status: 'aktivirano',
      blokator: 'blokira_platforme',
      budzetRSD: 600_000,
      rok: '2026-12-31',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: verifikovanDokaz('ugovor', 'OPENAI-API-2026-001', 'OpenAI API subscription — aktivan'),
      zavisnosti: [],
      napomena: 'API za sve OMEGA AI persone, SpajaPro Engine i generativne funkcionalnosti.',
    },
    {
      id: 'lic-pa-supabase',
      entitet: 'AI IQ SUPER PLATFORMA',
      nivo: 'platforma-asset',
      tip: 'softverska',
      naziv: 'Supabase — baza podataka i auth',
      regulatorIliVendor: 'Supabase Inc.',
      obaveznost: 'obavezna',
      status: 'aktivirano',
      blokator: 'blokira_platforme',
      budzetRSD: 120_000,
      rok: '2026-12-31',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: verifikovanDokaz('ugovor', 'SUPABASE-PRO-2026-001', 'Supabase Pro subscription — aktivan'),
      zavisnosti: [],
      napomena: 'PostgreSQL baza i auth sistem za B2B, bilans i poslovne tokove.',
    },
    {
      id: 'lic-pa-domen-rs',
      entitet: 'AI IQ SUPER PLATFORMA',
      nivo: 'platforma-asset',
      tip: 'operativna',
      naziv: 'Domen spaja.rs — RNIDS registracija',
      regulatorIliVendor: 'RNIDS (Registar nacionalnog internet domena Srbije)',
      obaveznost: 'obavezna',
      status: 'verifikovano',
      blokator: 'blokira_platforme',
      budzetRSD: 24_000,
      rok: '2026-12-31',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: verifikovanDokaz('sertifikat', 'RNIDS-SPAJA-RS-2026', 'Domen .rs aktivan u RNIDS registru'),
      zavisnosti: [],
      napomena: 'Nacionalni .rs domen za sve platforme Digitalne Industrije.',
    },
    {
      id: 'lic-pa-ssl',
      entitet: 'AI IQ SUPER PLATFORMA',
      nivo: 'platforma-asset',
      tip: 'operativna',
      naziv: 'SSL/TLS sertifikati za sve domene',
      regulatorIliVendor: 'Let\'s Encrypt / Vercel Managed Certs',
      obaveznost: 'obavezna',
      status: 'verifikovano',
      blokator: 'blokira_platforme',
      budzetRSD: 0,
      rok: '2026-12-31',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: verifikovanDokaz('interna-politika', 'SSL-MANAGED-VERCEL-2026', 'Managed SSL kroz Vercel — automatska obnova'),
      zavisnosti: ['lic-pa-vercel-hosting', 'lic-pa-domen-rs'],
      napomena: 'Automatski upravljani SSL sertifikati kroz Vercel infrastrukturu.',
    },
    {
      id: 'lic-pa-omega-rbac',
      entitet: 'AI IQ SUPER PLATFORMA',
      nivo: 'platforma-asset',
      tip: 'operativna',
      naziv: 'OMEGA AI RBAC matrica operativnih dozvola',
      regulatorIliVendor: 'Interna bezbednosna politika',
      obaveznost: 'obavezna',
      status: 'verifikovano',
      blokator: 'neblokirajuca',
      budzetRSD: 0,
      rok: null,
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: verifikovanDokaz('interna-politika', 'OMEGA-RBAC-MATRIX-V3', 'RBAC matrica operativnih dozvola v3'),
      zavisnosti: [],
      napomena: 'Interna matrica pristupnih prava za sve OMEGA AI persone i operativne tokove.',
    },
  ];
}

// ─── Nivo 4: Vendor Enterprise ugovori ──────────────────────────────────────

function buildVendorEnterpriseStavke(): LicencniPortfolioStavka[] {
  const enterpriseZahtevi = getEnterpriseZahtevi();

  function statusFromEnterpriseZahtev(zahtevStatus: string): LicencniPortfolioStatus {
    if (zahtevStatus === 'poslato') return 'u_pregovorima';
    if (zahtevStatus === 'spremno_za_slanje') return 'spremno_za_nabavku';
    return 'identifikovano';
  }

  const vercelZahtev = enterpriseZahtevi.find((z) => z.id === 'vercel');
  const githubZahtev = enterpriseZahtevi.find((z) => z.id === 'github');
  const openaiZahtev = enterpriseZahtevi.find((z) => z.id === 'openai');

  return [
    {
      id: 'lic-ve-vercel-enterprise',
      entitet: 'Digitalna Industrija',
      nivo: 'vendor-enterprise',
      tip: 'enterprise-ugovor',
      naziv: 'Vercel Enterprise — centralni billing i governance',
      regulatorIliVendor: 'Vercel Inc.',
      obaveznost: 'preporucena',
      status: statusFromEnterpriseZahtev(vercelZahtev?.status ?? 'u_pripremi'),
      blokator: 'blokira_platforme',
      budzetRSD: 2_400_000,
      rok: '2027-01-31',
      vlasnik: VLASNIK_BIZNIS,
      dokaz: null,
      zavisnosti: ['lic-pa-vercel-hosting'],
      napomena: 'Enterprise plan za centralizovani billing, SSO, governance i team management.',
    },
    {
      id: 'lic-ve-github-enterprise',
      entitet: 'Digitalna Industrija',
      nivo: 'vendor-enterprise',
      tip: 'enterprise-ugovor',
      naziv: 'GitHub Enterprise — advanced security i billing',
      regulatorIliVendor: 'GitHub / Microsoft',
      obaveznost: 'preporucena',
      status: statusFromEnterpriseZahtev(githubZahtev?.status ?? 'u_pripremi'),
      blokator: 'blokira_platforme',
      budzetRSD: 1_800_000,
      rok: '2027-01-31',
      vlasnik: VLASNIK_BIZNIS,
      dokaz: null,
      zavisnosti: ['lic-pa-github-repo'],
      napomena: 'Enterprise plan za advanced security, GHAS, audit log i centralni billing.',
    },
    {
      id: 'lic-ve-github-copilot-enterprise',
      entitet: 'Digitalna Industrija',
      nivo: 'vendor-enterprise',
      tip: 'enterprise-ugovor',
      naziv: 'GitHub Copilot Enterprise — AI assisted development',
      regulatorIliVendor: 'GitHub / Microsoft',
      obaveznost: 'opciona',
      status: statusFromEnterpriseZahtev(githubZahtev?.status ?? 'u_pripremi'),
      blokator: 'neblokirajuca',
      budzetRSD: 900_000,
      rok: '2027-01-31',
      vlasnik: VLASNIK_TEHNICKO,
      dokaz: null,
      zavisnosti: ['lic-ve-github-enterprise'],
      napomena: 'Copilot Enterprise za sve developere Digitalne Industrije.',
    },
    {
      id: 'lic-ve-openai-enterprise',
      entitet: 'Digitalna Industrija',
      nivo: 'vendor-enterprise',
      tip: 'enterprise-ugovor',
      naziv: 'OpenAI Enterprise — dedicated capacity i SLA',
      regulatorIliVendor: 'OpenAI',
      obaveznost: 'preporucena',
      status: statusFromEnterpriseZahtev(openaiZahtev?.status ?? 'u_pripremi'),
      blokator: 'blokira_platforme',
      budzetRSD: 3_600_000,
      rok: '2026-12-31',
      vlasnik: VLASNIK_BIZNIS,
      dokaz: null,
      zavisnosti: ['lic-pa-openai-api'],
      napomena: 'Enterprise ugovor za dedicated capacity, SLA i data privacy guarantees.',
    },
  ];
}

// ─── Summary ─────────────────────────────────────────────────────────────────

function buildSummary(stavke: LicencniPortfolioStavka[]): LicencniPortfolioSummary {
  const poNivou: Record<LicencniPortfolioNivo, number> = {
    'maticni-subjekt': 0,
    'povezani-entitet': 0,
    'platforma-asset': 0,
    'vendor-enterprise': 0,
  };
  const poStatusu: Record<LicencniPortfolioStatus, number> = {
    identifikovano: 0,
    spremno_za_nabavku: 0,
    u_pregovorima: 0,
    naruceno: 0,
    placeno: 0,
    aktivirano: 0,
    verifikovano: 0,
  };
  const poTipu: Record<LicencniPortfolioTip, number> = {
    regulatorna: 0,
    softverska: 0,
    operativna: 0,
    'enterprise-ugovor': 0,
  };

  let blokirajucihLegalanRad = 0;
  let blokirajucihPlatforme = 0;
  let neblokirajucih = 0;
  let ukupniBudzetRSD = 0;
  let verifikovano = 0;
  let zavrsenih = 0;

  for (const s of stavke) {
    poNivou[s.nivo]++;
    poStatusu[s.status]++;
    poTipu[s.tip]++;
    ukupniBudzetRSD += s.budzetRSD;

    if (s.blokator === 'blokira_legalan_rad') blokirajucihLegalanRad++;
    else if (s.blokator === 'blokira_platforme') blokirajucihPlatforme++;
    else neblokirajucih++;

    if (s.status === 'verifikovano') verifikovano++;
    if (s.status === 'aktivirano' || s.status === 'verifikovano') zavrsenih++;
  }

  const procenatZavrsenih = stavke.length === 0 ? 0 : Math.round((zavrsenih / stavke.length) * 100);

  return {
    ukupno: stavke.length,
    poNivou,
    poStatusu,
    poTipu,
    blokirajucihLegalanRad,
    blokirajucihPlatforme,
    neblokirajucih,
    ukupniBudzetRSD,
    verifikovano,
    procenatZavrsenih,
  };
}

// ─── Procurement queue — redosled nabavke ────────────────────────────────────

function buildProcurementQueue(stavke: LicencniPortfolioStavka[]): LicencniPortfolioStavka[] {
  const terminal: LicencniPortfolioStatus[] = ['aktivirano', 'verifikovano'];
  return stavke
    .filter((s) => !terminal.includes(s.status))
    .sort((a, b) => {
      // Blokatori legalan rad imaju najviši prioritet
      const blokatorScore = (s: LicencniPortfolioStavka): number => {
        if (s.blokator === 'blokira_legalan_rad') return 100;
        if (s.blokator === 'blokira_platforme') return 60;
        return 20;
      };
      // Obaveznost
      const obaveznostScore = (s: LicencniPortfolioStavka): number => {
        if (s.obaveznost === 'obavezna') return 50;
        if (s.obaveznost === 'preporucena') return 25;
        return 5;
      };
      // Rok — bliži rok ima veći prioritet
      const rokScore = (s: LicencniPortfolioStavka): number => {
        if (!s.rok) return 0;
        const days = Math.ceil((new Date(s.rok).getTime() - Date.now()) / 86_400_000);
        if (days <= 30) return 40;
        if (days <= 90) return 20;
        return 5;
      };

      const scoreA = blokatorScore(a) + obaveznostScore(a) + rokScore(a);
      const scoreB = blokatorScore(b) + obaveznostScore(b) + rokScore(b);
      return scoreB - scoreA;
    });
}

// ─── Vendor enterprise integrisan status ─────────────────────────────────────

function buildVendorEnterpriseIntegrisan(
  stavke: LicencniPortfolioStavka[],
): VendorEnterpriseStatus[] {
  const enterpriseZahtevi = getEnterpriseZahtevi();
  const vendorEntries = stavke.filter((s) => s.nivo === 'vendor-enterprise');

  return vendorEntries.map((stavka) => {
    const vendor = stavka.regulatorIliVendor.split(' ')[0];
    const zahtevId = vendor.toLowerCase() as 'vercel' | 'github' | 'openai';
    const zahtev = enterpriseZahtevi.find((z) => z.id === zahtevId);
    const enterpriseZahtevStatus = zahtev?.status ?? 'u_pripremi';

    const uskladen = (() => {
      if (enterpriseZahtevStatus === 'poslato' && stavka.status === 'u_pregovorima') return true;
      if (enterpriseZahtevStatus === 'spremno_za_slanje' && stavka.status === 'spremno_za_nabavku') return true;
      if (enterpriseZahtevStatus === 'u_pripremi' && stavka.status === 'identifikovano') return true;
      return false;
    })();

    return {
      vendor: stavka.naziv,
      portfolioStavkaId: stavka.id,
      enterpriseZahtevStatus,
      portfolioStatus: stavka.status,
      uskladen,
    };
  });
}

// ─── Glavni builder ───────────────────────────────────────────────────────────

export function buildDigitalnaIndustrijaLicencniPortfolio(): DigitalnaIndustrijaLicencniPortfolio {
  const pibMb = buildDigitalnaIndustrijaPibMb('system');

  const entiteti = pibMb.entiteti.map((e) => e.naziv);

  // Napomena: buildLicencniBudzetSrbija() je dostupan za buduću integraciju
  // budžetskih stavki po kategorijama direktno u portfolio stavke.

  const stavke: LicencniPortfolioStavka[] = [
    ...buildMaticniSubjektStavke(),
    ...buildPovezaniEntitetiStavke(),
    ...buildPlatformaAssetStavke(),
    ...buildVendorEnterpriseStavke(),
  ];

  const summary = buildSummary(stavke);
  const procurementQueue = buildProcurementQueue(stavke);
  const vendorEnterpriseIntegrisan = buildVendorEnterpriseIntegrisan(stavke);

  return {
    naziv: 'Digitalna Industrija — Licencni Portfolio',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
    jurisdikcija: 'Srbija',
    rezimNabavke: 'kupujemo_sve_licence',
    entiteti,
    stavke,
    summary,
    procurementQueue,
    vendorEnterpriseIntegrisan,
  };
}

// ─── Helpers za parcijalne upite ─────────────────────────────────────────────

export function getLicencniPortfolioBlokatori(): LicencniPortfolioStavka[] {
  const { stavke } = buildDigitalnaIndustrijaLicencniPortfolio();
  return stavke.filter(
    (s) => s.blokator !== 'neblokirajuca' && s.status !== 'verifikovano' && s.status !== 'aktivirano',
  );
}

export function getLicencniPortfolioProcurementQueue(): LicencniPortfolioStavka[] {
  const { procurementQueue } = buildDigitalnaIndustrijaLicencniPortfolio();
  return procurementQueue;
}

export function getLicencniPortfolioVendorStatus(): VendorEnterpriseStatus[] {
  const { vendorEnterpriseIntegrisan } = buildDigitalnaIndustrijaLicencniPortfolio();
  return vendorEnterpriseIntegrisan;
}
