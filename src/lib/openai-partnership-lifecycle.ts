/**
 * OpenAI Partnership Lifecycle
 *
 * Formalni lifecycle za OpenAI Enterprise + Partnership request:
 *   u_pripremi → spreman_za_slanje → poslato → kontaktiran
 *     → u_pregovorima → prihvaceno / odbijeno / fallback_aktiviran
 *
 * Sadrži:
 * - Lifecycle stanja sa tranzicijskim pravilima
 * - Evidence pack za OpenAI
 * - Post-acceptance orchestration plan
 * - Acceptance gate (auto vs. ručno odobrenje)
 * - Fallback plan ako OpenAI odbije ili kasni
 */

import { APP_VERSION, OWNER_EMAIL, OWNER_IME, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';
import { getKompanijaEpilog } from './kompanija-epilog';

// ─── Lifecycle stanja ─────────────────────────────────────

export type OpenAIPartnershipState =
  | 'u_pripremi'
  | 'spreman_za_slanje'
  | 'poslato'
  | 'kontaktiran'
  | 'u_pregovorima'
  | 'prihvaceno'
  | 'odbijeno'
  | 'fallback_aktiviran';

export interface LifecycleStanje {
  id: OpenAIPartnershipState;
  naziv: string;
  opis: string;
  sledecaStanja: OpenAIPartnershipState[];
  zahtevaRucnoOdobrenje: boolean;
  envSignal: string | null;
}

export const LIFECYCLE_STANJA: LifecycleStanje[] = [
  {
    id: 'u_pripremi',
    naziv: 'U pripremi',
    opis: 'Request paket se priprema; epilog, evidence pack i kontakti se finalizuju.',
    sledecaStanja: ['spreman_za_slanje'],
    zahtevaRucnoOdobrenje: false,
    envSignal: null,
  },
  {
    id: 'spreman_za_slanje',
    naziv: 'Spreman za slanje',
    opis: 'Request paket je finalizovan i spreman za podnošenje na openai.com/contact-sales.',
    sledecaStanja: ['poslato'],
    zahtevaRucnoOdobrenje: true,
    envSignal: 'SPAJA_OPENAI_ENTERPRISE_REQUEST_READY',
  },
  {
    id: 'poslato',
    naziv: 'Poslato',
    opis: 'Request je podnet OpenAI Sales timu. Čekamo inicijalni odgovor.',
    sledecaStanja: ['kontaktiran', 'u_pregovorima'],
    zahtevaRucnoOdobrenje: true,
    envSignal: 'SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED',
  },
  {
    id: 'kontaktiran',
    naziv: 'Kontaktiran',
    opis: 'OpenAI Sales tim je kontaktirao. Dogovaraju se sledeći koraci ili poziv.',
    sledecaStanja: ['u_pregovorima', 'odbijeno'],
    zahtevaRucnoOdobrenje: true,
    envSignal: 'SPAJA_OPENAI_ENTERPRISE_CONTACTED',
  },
  {
    id: 'u_pregovorima',
    naziv: 'U pregovorima',
    opis: 'Aktivni pregovori sa OpenAI o enterprise planu i partnerskim uslovima.',
    sledecaStanja: ['prihvaceno', 'odbijeno'],
    zahtevaRucnoOdobrenje: true,
    envSignal: 'SPAJA_OPENAI_ENTERPRISE_NEGOTIATING',
  },
  {
    id: 'prihvaceno',
    naziv: 'Prihvaćeno',
    opis: 'OpenAI je prihvatio enterprise/partnerski zahtev. Aktivira se post-acceptance orchestration plan.',
    sledecaStanja: [],
    zahtevaRucnoOdobrenje: true,
    envSignal: 'SPAJA_OPENAI_ENTERPRISE_ACCEPTED',
  },
  {
    id: 'odbijeno',
    naziv: 'Odbijeno',
    opis: 'OpenAI je odbio zahtev ili nije odgovorio. Aktivira se fallback plan.',
    sledecaStanja: ['fallback_aktiviran'],
    zahtevaRucnoOdobrenje: false,
    envSignal: 'SPAJA_OPENAI_ENTERPRISE_REJECTED',
  },
  {
    id: 'fallback_aktiviran',
    naziv: 'Fallback aktiviran',
    opis: 'OMEGA roadmap nastavlja bez blokade. Alternativni AI provideri se evaluiraju.',
    sledecaStanja: [],
    zahtevaRucnoOdobrenje: false,
    envSignal: 'SPAJA_OPENAI_FALLBACK_ACTIVATED',
  },
];

// ─── Current state from env ──────────────────────────────

function envFlag(name: string): boolean {
  return /^(1|true|yes|ok|ready|active|done|signed|contacted|accepted|negotiating)$/i.test(
    process.env[name] ?? '',
  );
}

export function getCurrentOpenAIState(): OpenAIPartnershipState {
  if (envFlag('SPAJA_OPENAI_FALLBACK_ACTIVATED')) return 'fallback_aktiviran';
  if (envFlag('SPAJA_OPENAI_ENTERPRISE_REJECTED')) return 'odbijeno';
  if (envFlag('SPAJA_OPENAI_ENTERPRISE_ACCEPTED')) return 'prihvaceno';
  if (envFlag('SPAJA_OPENAI_ENTERPRISE_NEGOTIATING')) return 'u_pregovorima';
  if (envFlag('SPAJA_OPENAI_ENTERPRISE_CONTACTED')) return 'kontaktiran';
  if (envFlag('SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED')) return 'poslato';
  if (envFlag('SPAJA_OPENAI_ENTERPRISE_REQUEST_READY')) return 'spreman_za_slanje';
  return 'u_pripremi';
}

export function getLifecycleStanje(state: OpenAIPartnershipState): LifecycleStanje {
  return LIFECYCLE_STANJA.find((s) => s.id === state) ?? LIFECYCLE_STANJA[0];
}

// ─── Evidence Pack ───────────────────────────────────────

export interface EvidencePackSekcija {
  id: string;
  naziv: string;
  sadrzaj: string | string[];
}

export interface OpenAIEvidencePack {
  naziv: string;
  verzija: string;
  generisanoAt: string;
  sekcije: EvidencePackSekcija[];
}

export function getOpenAIEvidencePack(): OpenAIEvidencePack {
  const epilog = getKompanijaEpilog();
  return {
    naziv: 'OpenAI Enterprise + Partnership — Evidence Pack',
    verzija: APP_VERSION,
    generisanoAt: new Date().toISOString(),
    sekcije: [
      {
        id: 'identitet',
        naziv: '1. Kompanijski identitet',
        sadrzaj: [
          `Formalni naziv: ${epilog.identitet.formalniNaziv}`,
          `Kompanija: ${epilog.identitet.kompanija}`,
          `Adresa: ${epilog.identitet.adresa}`,
          `Vlasnik: ${epilog.identitet.vlasnik} (${epilog.identitet.email})`,
          `GitHub: github.com/${epilog.identitet.github}`,
          `Platforma URL: ${epilog.identitet.platformaUrl}`,
        ],
      },
      {
        id: 'platforma',
        naziv: '2. Platforma pregled',
        sadrzaj: [
          `Naziv: ${epilog.platforma.naziv} v${epilog.platforma.verzija}`,
          epilog.platforma.opis,
          `Kapacitet: ${TOTAL_ROUTES} ruta, ${TOTAL_API_ROUTES} API endpointa`,
          `OMEGA AI: ${epilog.platforma.omegaPersona} persona (${epilog.platforma.omegaPersonaUkupno.toLocaleString()} ukupno)`,
        ],
      },
      {
        id: 'misija',
        naziv: '3. Misija i vizija',
        sadrzaj: [epilog.misijaVizija.misija, epilog.misijaVizija.vizija],
      },
      {
        id: 'omega_roadmap',
        naziv: '4. OMEGA AI Roadmap',
        sadrzaj: [
          `Trenutna faza: ${epilog.omegaRoadmap.trenutnaFaza}`,
          epilog.omegaRoadmap.fazaOpis,
          'Sledeći koraci:',
          ...epilog.omegaRoadmap.sledeceKoraci,
        ],
      },
      {
        id: 'trazimo_od_openai',
        naziv: '5. Šta tražimo od OpenAI',
        sadrzaj: [
          'OpenAI Enterprise API ugovor — kompanijski pristup bez rate-limit ograničenja',
          'ChatGPT Enterprise nalog za primarnog vlasnika (spajicn@yahoo.com)',
          `Partnerski razgovor o SpajaPro v6-15 integraciji sa OpenAI modelima`,
          'Uvid u API mogućnosti za duboku integraciju (gpt-4o, o3-mini, fine-tuning)',
          'Dedicated support i SLA za enterprise operativu',
        ],
      },
      {
        id: 'compliance',
        naziv: '6. Compliance i bezbednosna spremnost',
        sadrzaj: [
          `GDPR usklađenost: ${epilog.complianceSpremnost.gdpr ? 'DA' : 'NE'}`,
          `Audit trag: ${epilog.complianceSpremnost.auditTrag ? 'DA' : 'NE'}`,
          `Bezbednosni protokoli: ${epilog.complianceSpremnost.bezbednosniProtokoli ? 'DA' : 'NE'}`,
          `Enterprise governance: ${epilog.complianceSpremnost.enterpriseGovernance ? 'DA' : 'NE'}`,
          `Rate limiting: ${epilog.complianceSpremnost.rateLimiting ? 'DA' : 'NE'}`,
          `Secret management: ${epilog.complianceSpremnost.secretManagement ? 'DA' : 'NE'}`,
          `Ukupni compliance status: ${epilog.complianceSpremnost.status}`,
        ],
      },
      {
        id: 'kontakti',
        naziv: '7. Kontakti',
        sadrzaj: [
          `Sales: ${epilog.kontakti.sales}`,
          `Business: ${epilog.kontakti.business}`,
          `Tech: ${epilog.kontakti.tech}`,
          `Billing: ${epilog.kontakti.billing}`,
          `Security: ${epilog.kontakti.security}`,
          `Primarni owner: ${OWNER_IME} (${OWNER_EMAIL})`,
        ],
      },
    ],
  };
}

// ─── Post-acceptance orchestration plan ─────────────────

export type PostAcceptanceFaza = 'pilot' | 'ogranicena_produkcija' | 'puna_integracija';

export interface PostAcceptanceAktivnost {
  id: string;
  naziv: string;
  opis: string;
  tip: 'auto' | 'rucno';
  sistemi: string[];
  zahtevaOdobrenje: string[];
}

export interface PostAcceptancePlan {
  faza: PostAcceptanceFaza;
  naziv: string;
  opis: string;
  uslov: string;
  aktivnosti: PostAcceptanceAktivnost[];
  trajanje: string;
}

export function getPostAcceptancePlan(): PostAcceptancePlan[] {
  return [
    {
      faza: 'pilot',
      naziv: 'Faza 1 — Pilot',
      opis: 'Ograničena integracija OpenAI Enterprise API-ja u izolovanom SpajaPro test okruženju.',
      uslov: 'SPAJA_OPENAI_ENTERPRISE_ACCEPTED = true',
      trajanje: '2–4 nedelje',
      aktivnosti: [
        {
          id: 'pilot-01',
          naziv: 'Aktivacija Enterprise API ključa',
          opis: 'Postaviti OPENAI_API_KEY sa enterprise dozvolama u Vercel env (encrypted).',
          tip: 'rucno',
          sistemi: ['Vercel Env', 'SpajaPro engine'],
          zahtevaOdobrenje: ['Vlasnik naloga', 'Security kontakt'],
        },
        {
          id: 'pilot-02',
          naziv: 'SpajaPro v6-15 enterprise model aktivacija',
          opis: 'Uključiti gpt-4o i o3-mini modele u AVAILABLE_MODELS bez rate-limit ograničenja.',
          tip: 'rucno',
          sistemi: ['src/lib/openai/client.ts', 'SpajaPro chat'],
          zahtevaOdobrenje: ['Tehnički admin'],
        },
        {
          id: 'pilot-03',
          naziv: 'OMEGA AI enterprise persona vezivanje',
          opis: 'Povući OMEGA AI persone na enterprise OpenAI endpoint.',
          tip: 'auto',
          sistemi: ['/api/omega-ai', '/api/omega-dispatch-status'],
          zahtevaOdobrenje: [],
        },
        {
          id: 'pilot-04',
          naziv: 'Monitoring i audit aktivacija',
          opis: 'Pokrenuti dijagnostiku i audit trag za sve enterprise API pozive.',
          tip: 'auto',
          sistemi: ['/api/ai-iq-monitoring', '/api/openai-platforma-monitoring'],
          zahtevaOdobrenje: [],
        },
      ],
    },
    {
      faza: 'ogranicena_produkcija',
      naziv: 'Faza 2 — Ograničena produkcija',
      opis: 'Proširena integracija sa enterprise billing-om i selektivnim agentskim pristupom.',
      uslov: 'Pilot faza uspešno završena i monitoring stabilan minimum 7 dana',
      trajanje: '4–8 nedelja',
      aktivnosti: [
        {
          id: 'prod-01',
          naziv: 'Enterprise billing integracija',
          opis: 'Vezati OpenAI usage na AI IQ World Bank billing modul.',
          tip: 'rucno',
          sistemi: ['AI IQ World Bank', '/api/billing-runbook'],
          zahtevaOdobrenje: ['Billing owner', 'Vlasnik naloga'],
        },
        {
          id: 'prod-02',
          naziv: 'GitHub Copilot Enterprise aktivacija',
          opis: 'Aktivirati GitHub Copilot Enterprise ako je GitHub Enterprise prihvatio.',
          tip: 'rucno',
          sistemi: ['GitHub org', 'OMEGA AI dispatch'],
          zahtevaOdobrenje: ['Vlasnik naloga', 'Tehnički admin'],
        },
        {
          id: 'prod-03',
          naziv: 'Interni agenti — SpajaPro i OMEGA orkestracija',
          opis: 'Automatsko vezivanje internih agent poziva na enterprise endpoint.',
          tip: 'auto',
          sistemi: ['/api/omega-ai', '/api/spaja-pro/chat', 'OMEGA dispatch'],
          zahtevaOdobrenje: [],
        },
        {
          id: 'prod-04',
          naziv: 'Eksterni agentski pristup — gate aktivacija',
          opis: 'Otvoriti OMEGA agentima pristup eksternim sistemima samo uz eksplicitno odobrenje.',
          tip: 'rucno',
          sistemi: ['Middleware gate', 'Security protokol'],
          zahtevaOdobrenje: ['Security kontakt', 'Vlasnik naloga'],
        },
      ],
    },
    {
      faza: 'puna_integracija',
      naziv: 'Faza 3 — Puna integracija',
      opis: 'Kompletan OpenAI Enterprise ekosistem: modeli, agenti, billing, monitoring i governance.',
      uslov: 'Ograničena produkcija stabilna minimum 30 dana, svi blokatori rešeni',
      trajanje: 'Trajno',
      aktivnosti: [
        {
          id: 'full-01',
          naziv: 'Svi OMEGA AI moduli na enterprise endpoint',
          opis: 'Sve persone, svi SpajaPro endpointi, sve diagnostičke rute — enterprise OpenAI.',
          tip: 'auto',
          sistemi: ['Celokupna AI infrastruktura'],
          zahtevaOdobrenje: [],
        },
        {
          id: 'full-02',
          naziv: 'GitHub org tranzicija',
          opis: 'Prelaz sa spaja86 owner modela na Kompanija SPAJA GitHub organizaciju.',
          tip: 'rucno',
          sistemi: ['GitHub', 'Vercel Git integracija'],
          zahtevaOdobrenje: ['Vlasnik naloga', 'Billing owner', 'Tehnički admin'],
        },
        {
          id: 'full-03',
          naziv: 'Ownership transfer repozitorijuma',
          opis: 'Prenos AI-IQ-SUPER-PLATFORMA repozitorijuma na kompanijski GitHub nalog/organizaciju.',
          tip: 'rucno',
          sistemi: ['GitHub repo settings', 'Vercel project'],
          zahtevaOdobrenje: ['Vlasnik naloga', 'Security kontakt', 'Backup admin'],
        },
        {
          id: 'full-04',
          naziv: 'Enterprise SLA i podrška aktivacija',
          opis: 'Aktivirati dedicated OpenAI support, SLA ugovor i priority queue.',
          tip: 'rucno',
          sistemi: ['OpenAI Enterprise portal'],
          zahtevaOdobrenje: ['Vlasnik naloga'],
        },
      ],
    },
  ];
}

// ─── Acceptance gate ─────────────────────────────────────

export interface AcceptanceGate {
  id: string;
  naziv: string;
  tip: 'auto' | 'rucno';
  sistemi: string[];
  blokiraSledecuFazu: boolean;
  odobravajeUloge: string[];
}

export function getAcceptanceGates(): AcceptanceGate[] {
  return [
    {
      id: 'gate-security',
      naziv: 'Security gate — eksterni API pristup',
      tip: 'rucno',
      sistemi: ['Sve rute sa eksternim API pozivima'],
      blokiraSledecuFazu: true,
      odobravajeUloge: ['Security kontakt', 'Vlasnik naloga'],
    },
    {
      id: 'gate-billing',
      naziv: 'Billing gate — enterprise troškovi',
      tip: 'rucno',
      sistemi: ['AI IQ World Bank', 'Stripe billing'],
      blokiraSledecuFazu: true,
      odobravajeUloge: ['Billing owner', 'Vlasnik naloga'],
    },
    {
      id: 'gate-ownership',
      naziv: 'Ownership gate — repo i org transfer',
      tip: 'rucno',
      sistemi: ['GitHub repo', 'Vercel project'],
      blokiraSledecuFazu: true,
      odobravajeUloge: ['Vlasnik naloga', 'Backup admin', 'Security kontakt'],
    },
    {
      id: 'gate-monitoring',
      naziv: 'Monitoring gate — stabilnost',
      tip: 'auto',
      sistemi: ['/api/ai-iq-monitoring', '/api/openai-platforma-zdravlje-provera'],
      blokiraSledecuFazu: false,
      odobravajeUloge: [],
    },
    {
      id: 'gate-compliance',
      naziv: 'Compliance gate — audit trag',
      tip: 'auto',
      sistemi: ['/api/openai-platforma-audit-sistem', '/api/openai-platforma-compliance'],
      blokiraSledecuFazu: false,
      odobravajeUloge: [],
    },
  ];
}

// ─── Fallback plan ────────────────────────────────────────

export interface FallbackPlan {
  naziv: string;
  uslov: string;
  alternativeAIProvider: string[];
  omegaRoadmapNastavak: string[];
  timeout: string;
  napomena: string;
}

export function getFallbackPlan(): FallbackPlan {
  return {
    naziv: 'OpenAI Fallback Plan — OMEGA roadmap nastavlja bez blokade',
    uslov:
      'Aktivira se ako OpenAI odbije zahtev ili ne odgovori u roku od 90 dana od slanja.',
    alternativeAIProvider: [
      'Anthropic Claude Enterprise — alternativni reasoning/chat engine',
      'Google Gemini Enterprise — alternativni multimodal engine',
      'Azure OpenAI Service — OpenAI modeli kroz Microsoft enterprise kanal',
      'AWS Bedrock — multi-model enterprise pristup',
    ],
    omegaRoadmapNastavak: [
      'OMEGA AI nastavlja evoluciju sa postojećim API ključem (rate-limited)',
      'SpajaPro v6-15 ostaje operativan na svim postojećim planovima',
      'GitHub i Vercel enterprise requests se nastavljaju nezavisno',
      'Interna OMEGA orkestracija ne zavisi od OpenAI enterprise statusa',
      'Evaluation alternativnih AI providera startuje odmah po aktivaciji fallback-a',
    ],
    timeout: '90 dana od slanja zahteva',
    napomena:
      'Fallback nije poraz — OMEGA ekosistem je dizajniran da bude provider-agnostičan. ' +
      'OpenAI enterprise saradnja je preferirana ali ne i blokator evolucije.',
  };
}

// ─── Kompletni lifecycle status ──────────────────────────

export function getOpenAILifecycleStatus() {
  const trenutnoStanje = getCurrentOpenAIState();
  const stanje = getLifecycleStanje(trenutnoStanje);
  const evidencePack = getOpenAIEvidencePack();
  const postAcceptancePlan = getPostAcceptancePlan();
  const acceptanceGates = getAcceptanceGates();
  const fallbackPlan = getFallbackPlan();

  return {
    naziv: 'OpenAI Partnership Lifecycle — Status',
    appVerzija: APP_VERSION,
    trenutnoStanje,
    stanjeDetalji: stanje,
    svaStanja: LIFECYCLE_STANJA,
    evidencePack,
    postAcceptancePlan,
    acceptanceGates,
    fallbackPlan,
    summary: {
      state: trenutnoStanje,
      ready: trenutnoStanje !== 'u_pripremi',
      submitted: ['poslato', 'kontaktiran', 'u_pregovorima', 'prihvaceno'].includes(trenutnoStanje),
      accepted: trenutnoStanje === 'prihvaceno',
      fallbackActive: trenutnoStanje === 'fallback_aktiviran',
      manualApprovalRequired: stanje.zahtevaRucnoOdobrenje,
    },
  };
}
