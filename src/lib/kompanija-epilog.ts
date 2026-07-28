/**
 * Kanonski Epilog — Kompanija SPAJA / Digitalna Industrija
 *
 * Jedan izvor istine o tome ko smo i šta smo, korišćen u svim
 * outbound enterprise zahtevima (OpenAI, GitHub, Vercel) i UI prikazima.
 *
 * Verzionisan + audit trag — svaka izmena mora biti dokumentovana.
 */

import {
  APP_VERSION,
  BASE_URL,
  KOMPANIJA,
  KOMPANIJA_FORMALNA_ADRESA,
  KOMPANIJA_FORMALNI_IDENTITET,
  KOMPANIJA_FORMALNI_NAZIV,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_PERSONA_UKUPNO,
  OWNER_EMAIL,
  OWNER_GITHUB,
  OWNER_IME,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from './constants';

// ─── Tip definicije ──────────────────────────────────────

export interface EpilogIdentitet {
  vlasnik: string;
  email: string;
  github: string;
  formalniNaziv: string;
  adresa: string;
  punNaziv: string;
  kompanija: string;
  platformaUrl: string;
}

export interface EpilogPlatforma {
  naziv: string;
  verzija: string;
  ukupnoRuta: number;
  ukupnoApiRuta: number;
  omegaPersona: number;
  omegaPersonaUkupno: number;
  opis: string;
}

export interface EpilogMisijaVizija {
  misija: string;
  vizija: string;
  vrednosti: string[];
}

export interface EpilogOmegaRoadmap {
  trenutnaFaza: string;
  fazaOpis: string;
  sledeceKoraci: string[];
  kapaciteti: string[];
}

export interface EpilogComplianceSpremnost {
  gdpr: boolean;
  auditTrag: boolean;
  bezbednosniProtokoli: boolean;
  enterpriseGovernance: boolean;
  rateLimiting: boolean;
  secretManagement: boolean;
  status: 'spreman' | 'delimicno' | 'u_pripremi';
}

export interface EpilogKontakti {
  sales: string;
  business: string;
  tech: string;
  billing: string;
  security: string;
  support: string;
}

export interface EpilogAuditStavka {
  verzija: string;
  datum: string;
  izmena: string;
  autor: string;
}

export interface KompanijaEpilog {
  epilogVerzija: string;
  appVerzija: string;
  identitet: EpilogIdentitet;
  platforma: EpilogPlatforma;
  misijaVizija: EpilogMisijaVizija;
  omegaRoadmap: EpilogOmegaRoadmap;
  complianceSpremnost: EpilogComplianceSpremnost;
  kontakti: EpilogKontakti;
  auditTrail: EpilogAuditStavka[];
  generisanoAt: string;
}

// ─── Verzija epiloga ─────────────────────────────────────

export const EPILOG_VERZIJA = '1.0.0';

// ─── Audit trag epiloga ──────────────────────────────────

export const epilogAuditTrail: EpilogAuditStavka[] = [
  {
    verzija: '1.0.0',
    datum: '2026-07-28',
    izmena: 'Inicijalna verzija kanonskog epiloga — ko smo i šta smo',
    autor: OWNER_IME,
  },
];

// ─── Kanonski epilog ─────────────────────────────────────

export function getKompanijaEpilog(): KompanijaEpilog {
  return {
    epilogVerzija: EPILOG_VERZIJA,
    appVerzija: APP_VERSION,
    identitet: {
      vlasnik: OWNER_IME,
      email: OWNER_EMAIL,
      github: OWNER_GITHUB,
      formalniNaziv: KOMPANIJA_FORMALNI_NAZIV,
      adresa: KOMPANIJA_FORMALNA_ADRESA,
      punNaziv: KOMPANIJA_FORMALNI_IDENTITET,
      kompanija: KOMPANIJA,
      platformaUrl: BASE_URL,
    },
    platforma: {
      naziv: 'AI IQ SUPER PLATFORMA',
      verzija: APP_VERSION,
      ukupnoRuta: TOTAL_ROUTES,
      ukupnoApiRuta: TOTAL_API_ROUTES,
      omegaPersona: OMEGA_AI_PERSONA_COUNT,
      omegaPersonaUkupno: OMEGA_AI_PERSONA_UKUPNO,
      opis:
        'Sveobuhvatna industrijska platforma koja integriše 21 OMEGA AI personu, SpajaPro engine v6-15, ' +
        'finansijski ekosistem (AI IQ World Bank, menjačnica, kripto trezor), gaming industriju, ' +
        'dijagnostički sistem i enterprise governance infrastrukturu za Digitalnu Industriju Srbije.',
    },
    misijaVizija: {
      misija:
        'Izgraditi najnapredniju srpsku digitalnu industrijsku platformu koja spaja AI, finansije, ' +
        'gaming i enterprise operativu u jedan ekosistem — dostupan svima, operativan 24/7.',
      vizija:
        'Digitalna Industrija kao globalni lider u AI-vođenoj industrializaciji digitalnih usluga, ' +
        'sa centrom u Srbiji i međunarodnim prisustvom kroz OpenAI, GitHub i Vercel enterprise partnerstva.',
      vrednosti: [
        'Transparentnost i audit-ready operativa',
        'Otvorena saradnja sa enterprise provajderima',
        'Neprestana evolucija kroz OMEGA AI sistem',
        'Bezbednost i compliance kao osnova, ne kao opcija',
        'Srpski digitalni ekosistem kao pokretač regionalnog razvoja',
      ],
    },
    omegaRoadmap: {
      trenutnaFaza: 'Faza 7 — Transcendencija',
      fazaOpis:
        'OMEGA AI dostigla je transcendentnu fazu: 21 persona, 8 oktava, SpajaPro v6-15 engine integracija, ' +
        'enterprise governance, audit trag i industrijna orkestracija operativni su na punom kapacitetu.',
      sledeceKoraci: [
        'OpenAI Enterprise API ugovor — kompanijski API pristup bez rate-limit ograničenja',
        'GitHub Enterprise — centralizovani billing, ownership governance i Copilot Enterprise',
        'Vercel Enterprise — CDN proxy trust, team governance i pro support',
        'Post-acceptance agent integracija: pilot → ograničena produkcija → puna integracija',
        'GitHub organizacija: prelaz sa spaja86 owner modela na Kompanija SPAJA org model',
      ],
      kapaciteti: [
        `${TOTAL_ROUTES} operativnih ruta`,
        `${TOTAL_API_ROUTES} API endpointa`,
        `${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona (${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} ukupno)`,
        'SpajaPro v6-15 engine sa 10 verzija',
        'AI IQ World Bank — finansijska infrastruktura',
        'Dijagnostički sistem sa kontinuiranim health-check-om',
      ],
    },
    complianceSpremnost: {
      gdpr: true,
      auditTrag: true,
      bezbednosniProtokoli: true,
      enterpriseGovernance: true,
      rateLimiting: true,
      secretManagement: true,
      status: 'spreman',
    },
    kontakti: {
      sales: 'sales@spaja.rs',
      business: 'business@spaja.rs',
      tech: 'tech@spaja.rs',
      billing: 'billing@spaja.rs',
      security: 'security@kompanija-spaja.rs',
      support: 'suport@omega-ai.spaja.rs',
    },
    auditTrail: epilogAuditTrail,
    generisanoAt: new Date().toISOString(),
  };
}

// ─── Formatiranje za outbound zahteve ────────────────────

export type OutboundProvider = 'openai' | 'github' | 'vercel' | 'generic';

export function getEpilogForOutbound(provider: OutboundProvider): string {
  const e = getKompanijaEpilog();
  const id = e.identitet;
  const p = e.platforma;
  const m = e.misijaVizija;

  const base = [
    `Kompanija: ${id.formalniNaziv} | ${id.kompanija}`,
    `Adresa: ${id.adresa}`,
    `Vlasnik: ${id.vlasnik} (${id.email})`,
    `GitHub: github.com/${id.github}`,
    `Platforma: ${p.naziv} v${p.verzija} — ${p.ukupnoApiRuta} API ruta, ${p.omegaPersona} OMEGA AI persona`,
    `URL: ${id.platformaUrl}`,
  ].join('\n');

  if (provider === 'openai') {
    return [
      base,
      '',
      'KONTEKST ZA OPENAI:',
      m.misija,
      '',
      'OMEGA ROADMAP:',
      ...e.omegaRoadmap.sledeceKoraci,
      '',
      'COMPLIANCE:',
      `GDPR: ${e.complianceSpremnost.gdpr ? 'DA' : 'NE'} | Audit trag: ${e.complianceSpremnost.auditTrag ? 'DA' : 'NE'} | Enterprise governance: ${e.complianceSpremnost.enterpriseGovernance ? 'DA' : 'NE'}`,
    ].join('\n');
  }

  if (provider === 'github') {
    return [
      base,
      '',
      'GITHUB GOVERNANCE KONTEKST:',
      `Trenutni owner: ${id.github}`,
      `Cilj: GitHub Enterprise + Copilot Enterprise za Digitalnu Industriju`,
      `Repozitorijum: github.com/${id.github}/AI-IQ-SUPER-PLATFORMA`,
    ].join('\n');
  }

  return base;
}

// ─── Rezime za API response ──────────────────────────────

export function getEpilogRezime(): {
  verzija: string;
  kompanija: string;
  vlasnik: string;
  platformaVerzija: string;
  complianceStatus: string;
  misijaKratko: string;
} {
  const e = getKompanijaEpilog();
  return {
    verzija: e.epilogVerzija,
    kompanija: e.identitet.formalniNaziv,
    vlasnik: e.identitet.vlasnik,
    platformaVerzija: e.appVerzija,
    complianceStatus: e.complianceSpremnost.status,
    misijaKratko: e.misijaVizija.misija.substring(0, 120) + '…',
  };
}
