import {
  APP_VERSION,
  BASE_URL,
  KOMPANIJA,
  MOBILNI_POZIVNI,
  OMEGA_AI_PERSONA_COUNT,
} from './constants';
import { platforme } from './platforme';
import { getKastlerSignalReadinessSummary, getKastlerTVSignalRequestPackage } from './kastler-tv-signal-request';

export type KontaktNamena =
  | 'support'
  | 'billing'
  | 'business'
  | 'sales'
  | 'confirmations'
  | 'security'
  | 'tech';

export interface JavniKontaktKanal {
  id: KontaktNamena;
  naziv: string;
  email: string;
  domen: string;
  opis: string;
  vlasnikUloge: string;
  rokOdgovora: string;
  fallbackKontakt: string;
  status: 'aktivan' | 'u_pripremi';
}

export interface OperativnaUloga {
  id:
    | 'nalog-owner'
    | 'billing-owner'
    | 'tehnicki-admin'
    | 'security-kontakt'
    | 'poslovni-kontakt'
    | 'potvrde-fakture';
  naziv: string;
  odgovornoLice: string;
  kontakt: string;
  sistemi: string[];
  odgovornosti: string[];
}

export interface TelefonskiKanal {
  id: 'centrala' | 'sales' | 'tehnicka-podrska' | 'billing' | 'omega-dispec';
  broj: string;
  naziv: string;
  opis: string;
  ivrOpcija: string;
  prioritet: 'javni' | 'prioritetni' | 'incidentni';
  fallbackKontakt: string;
}

export interface DispatchRoutingPravilo {
  id: string;
  kanal: 'mejl' | 'telefon' | 'tiket' | 'live-chat';
  tipZahteva: 'b2b' | 'potvrde' | 'confirmations' | 'billing' | 'incident' | 'vercel-github' | 'onboarding';
  departman: string;
  odgovornaPersonaId: string;
  odgovornaPersonaNaziv: string;
  sla: 'enterprise' | 'biznis' | 'profesionalni' | 'starter';
  eskalacijaNivo: 1 | 2 | 3;
}

export interface OperativniTok {
  id: string;
  naziv: string;
  ulazniKanal: string;
  vlasnik: string;
  sla: string;
  audit: boolean;
  fallbackKontakt: string;
}

export type EnterpriseProvajder = 'vercel' | 'github' | 'openai';
export type EnterpriseZahtevStatus = 'u_pripremi' | 'spremno_za_slanje' | 'poslato';

export interface EnterpriseKanalPodnosenja {
  tip: 'kontakt_forma' | 'support_portal';
  url: string;
  opis: string;
  zahtevaKompanijskiMejl: boolean;
}

export interface EnterpriseZahtevPaket {
  id: EnterpriseProvajder;
  naziv: string;
  provajder: 'Vercel' | 'GitHub' | 'OpenAI';
  status: EnterpriseZahtevStatus;
  posiljalac: string;
  replyTo: string;
  cc: string[];
  eksplicitniKontekst?: {
    accountEmail: string;
    ownerName: string;
    companyBillingIntent: string;
    najboljePretplate: boolean;
  };
  kanalPodnosenja: EnterpriseKanalPodnosenja;
  naslov: string;
  sazetak: string;
  telo: string;
  trazeniPlanovi: string[];
  trazeneOpcije: string[];
  prilozi: string[];
  odobrenja: string[];
  auditVlasnik: string;
  auditKontakt: string;
  envSignal: string;
}

type ReadinessStatus = 'spremno' | 'delimicno' | 'blokirano';
type ReadinessMode = 'runtime-ready' | 'runtime-incomplete' | 'ops-ready' | 'ops-incomplete' | 'enterprise-in-progress' | 'enterprise-ready';
const RUNTIME_READY_THRESHOLD = 67;
const OPS_READY_THRESHOLD = 50;

function envSet(name: string): boolean {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() !== '';
}

function envFlag(name: string): boolean {
  return /^(1|true|yes|ok|ready|active)$/i.test(process.env[name] ?? '');
}

function getSectionStatus(completed: number, total: number): ReadinessStatus {
  if (completed <= 0) return 'blokirano';
  if (completed >= total) return 'spremno';
  return 'delimicno';
}

function getSectionScore(completed: number, total: number): number {
  return Math.round((completed / total) * 100);
}

export const primarniOperativniNalog = {
  email: 'spajicn@yahoo.com',
  vercelNalog: 'spajicn@yahoo.com',
  githubOwner: 'spaja86',
  kompanija: KOMPANIJA,
  napomena:
    'Primarni operativni nalog ostaje spajicn@yahoo.com dok se kompanijski kanali ne potvrde i aktiviraju na Vercel/GitHub strani.',
};

export const javniKontaktKanali: JavniKontaktKanal[] = [
  {
    id: 'support',
    naziv: 'Korisnička podrška',
    email: 'support@spaja.rs',
    domen: 'spaja.rs',
    opis: 'Opšti upiti korisnika, onboarding i standardna tehnička pitanja',
    vlasnikUloge: 'Tehnički admin',
    rokOdgovora: '< 2 sata',
    fallbackKontakt: primarniOperativniNalog.email,
    status: 'aktivan',
  },
  {
    id: 'billing',
    naziv: 'Billing i fakture',
    email: 'billing@spaja.rs',
    domen: 'spaja.rs',
    opis: 'Računi, fakture, plaćanja, Vercel/GitHub troškovi i finansijske potvrde',
    vlasnikUloge: 'Billing owner',
    rokOdgovora: '< 1 sat',
    fallbackKontakt: primarniOperativniNalog.email,
    status: 'aktivan',
  },
  {
    id: 'business',
    naziv: 'Biznis kontakt',
    email: 'business@spaja.rs',
    domen: 'spaja.rs',
    opis: 'Partnerstva, B2B saradnja i operativni zahtevi Digitalne Industrije',
    vlasnikUloge: 'Poslovni kontakt',
    rokOdgovora: '< 4 sata',
    fallbackKontakt: primarniOperativniNalog.email,
    status: 'aktivan',
  },
  {
    id: 'sales',
    naziv: 'Pregovori i enterprise prodaja',
    email: 'sales@spaja.rs',
    domen: 'spaja.rs',
    opis: 'Enterprise planovi, pregovori, Vercel Enterprise zahtev i komercijalni upiti',
    vlasnikUloge: 'Poslovni kontakt',
    rokOdgovora: '< 4 sata',
    fallbackKontakt: primarniOperativniNalog.email,
    status: 'aktivan',
  },
  {
    id: 'confirmations',
    naziv: 'Potvrde i obaveštenja',
    email: 'confirmations@spaja.rs',
    domen: 'spaja.rs',
    opis: 'Potvrde transakcija, pretplata, onboarding potvrde i operativne notifikacije',
    vlasnikUloge: 'Potvrde i fakture',
    rokOdgovora: '< 30 minuta',
    fallbackKontakt: primarniOperativniNalog.email,
    status: 'aktivan',
  },
  {
    id: 'security',
    naziv: 'Security i incidenti',
    email: 'security@kompanija-spaja.rs',
    domen: 'kompanija-spaja.rs',
    opis: 'Bezbednosni incidenti, prijave ranjivosti i eskalacije visokog prioriteta',
    vlasnikUloge: 'Security kontakt',
    rokOdgovora: '< 30 minuta',
    fallbackKontakt: primarniOperativniNalog.email,
    status: 'aktivan',
  },
  {
    id: 'tech',
    naziv: 'Tehnička operativa',
    email: 'tech@spaja.rs',
    domen: 'spaja.rs',
    opis: 'Deploy, integracije, Vercel/GitHub operativa i OMEGA AI dispeč',
    vlasnikUloge: 'Tehnički admin',
    rokOdgovora: '< 1 sat',
    fallbackKontakt: primarniOperativniNalog.email,
    status: 'aktivan',
  },
];

export const operativnaMatricaVlasnistva: OperativnaUloga[] = [
  {
    id: 'nalog-owner',
    naziv: 'Vlasnik naloga',
    odgovornoLice: 'Nikola Spajić',
    kontakt: primarniOperativniNalog.email,
    sistemi: ['Vercel', 'GitHub', 'AI IQ World Bank'],
    odgovornosti: [
      'Primarni operativni identitet i fallback kontakt',
      'Finalna potvrda za promene ownership/billing modela',
    ],
  },
  {
    id: 'billing-owner',
    naziv: 'Billing owner',
    odgovornoLice: 'AI IQ World Bank — Digitalna Industrija',
    kontakt: 'billing@spaja.rs',
    sistemi: ['Vercel Billing', 'GitHub Billing', 'AI IQ World Bank'],
    odgovornosti: [
      'Centralizovano fakturisanje i potvrde troškova',
      'Upravljanje Vercel/GitHub troškovima i audit tragom',
    ],
  },
  {
    id: 'tehnicki-admin',
    naziv: 'Tehnički admin',
    odgovornoLice: 'OMEGA AI Operativa',
    kontakt: 'tech@spaja.rs',
    sistemi: ['Vercel Deploy', 'GitHub Workflows', 'OMEGA AI'],
    odgovornosti: [
      'Deploy, integracije, env varijable i operativna spremnost',
      'Vođenje dispeča za tehničke zahteve i incidente',
    ],
  },
  {
    id: 'security-kontakt',
    naziv: 'Security kontakt',
    odgovornoLice: 'Bezbednosni tim Kompanije SPAJA',
    kontakt: 'security@kompanija-spaja.rs',
    sistemi: ['Security', 'Incident response', 'GitHub/Vercel pristup'],
    odgovornosti: [
      'Incidenti, ranjivosti i emergency eskalacije',
      'Kontrola pristupa i revizija privilegija',
    ],
  },
  {
    id: 'poslovni-kontakt',
    naziv: 'Poslovni kontakt',
    odgovornoLice: 'Kompanija SPAJA — Digitalna Industrija',
    kontakt: 'sales@spaja.rs',
    sistemi: ['B2B', 'Partnerstva', 'Vercel Enterprise request'],
    odgovornosti: [
      'Pregovori, enterprise ponude i partnerstva',
      'Formalizacija enterprise readiness paketa',
    ],
  },
  {
    id: 'potvrde-fakture',
    naziv: 'Potvrde i fakture',
    odgovornoLice: 'Kompanijska operativa',
    kontakt: 'confirmations@spaja.rs',
    sistemi: ['Pretplate', 'Potvrde', 'Korisnička obaveštenja'],
    odgovornosti: [
      'Isporuka potvrda za pretplate, transakcije i onboarding',
      'Audit trag poslovnih notifikacija',
    ],
  },
];

export const javniTelefonskiKanali: TelefonskiKanal[] = [
  {
    id: 'centrala',
    broj: `${MOBILNI_POZIVNI[0]}-000-0000`,
    naziv: 'Glavna centrala',
    opis: 'Javni ulaz za Kompaniju SPAJA sa IVR trijažom i preusmeravanjem',
    ivrOpcija: '1',
    prioritet: 'javni',
    fallbackKontakt: primarniOperativniNalog.email,
  },
  {
    id: 'sales',
    broj: `${MOBILNI_POZIVNI[1]}-700-0001`,
    naziv: 'Sales / Pregovori',
    opis: 'Enterprise/B2B pregovori i komercijalni zahtevi',
    ivrOpcija: '2',
    prioritet: 'prioritetni',
    fallbackKontakt: 'sales@spaja.rs',
  },
  {
    id: 'tehnicka-podrska',
    broj: `${MOBILNI_POZIVNI[1]}-200-0002`,
    naziv: 'Tehnička podrška',
    opis: 'Deploy, integracije, produkcioni incidenti i korisnička podrška',
    ivrOpcija: '3',
    prioritet: 'javni',
    fallbackKontakt: 'tech@spaja.rs',
  },
  {
    id: 'billing',
    broj: `${MOBILNI_POZIVNI[1]}-700-0005`,
    naziv: 'Billing / Administracija',
    opis: 'Fakture, potvrde, Vercel/GitHub troškovi i pretplate',
    ivrOpcija: '4',
    prioritet: 'prioritetni',
    fallbackKontakt: 'billing@spaja.rs',
  },
  {
    id: 'omega-dispec',
    broj: `${MOBILNI_POZIVNI[3]}-800-0002`,
    naziv: 'OMEGA AI dispeč',
    opis: 'Incidenti, monitoring i prioritetno rutiranje prema OMEGA AI operativi',
    ivrOpcija: '9',
    prioritet: 'incidentni',
    fallbackKontakt: 'tech@spaja.rs',
  },
];

export const omegaDispatchRoutingPravila: DispatchRoutingPravilo[] = [
  {
    id: 'dispatch-b2b-sales',
    kanal: 'mejl',
    tipZahteva: 'b2b',
    departman: 'Korporacije — Enterprise Rešenja',
    odgovornaPersonaId: 'strateg',
    odgovornaPersonaNaziv: 'Strateg',
    sla: 'biznis',
    eskalacijaNivo: 1,
  },
  {
    id: 'dispatch-confirmations-billing',
    kanal: 'mejl',
    tipZahteva: 'confirmations',
    departman: 'Banka — AI IQ World Bank',
    odgovornaPersonaId: 'finansijer',
    odgovornaPersonaNaziv: 'Finansijer',
    sla: 'enterprise',
    eskalacijaNivo: 1,
  },
  {
    id: 'dispatch-vercel-github-tech',
    kanal: 'tiket',
    tipZahteva: 'vercel-github',
    departman: 'Platforma — AI IQ SUPER PLATFORMA',
    odgovornaPersonaId: 'integrator',
    odgovornaPersonaNaziv: 'Integrator',
    sla: 'enterprise',
    eskalacijaNivo: 2,
  },
  {
    id: 'dispatch-incidents-monitoring',
    kanal: 'telefon',
    tipZahteva: 'incident',
    departman: 'Tehnička Podrška — 24/7',
    odgovornaPersonaId: 'monitor',
    odgovornaPersonaNaziv: 'Monitor',
    sla: 'enterprise',
    eskalacijaNivo: 3,
  },
  {
    id: 'dispatch-onboarding',
    kanal: 'live-chat',
    tipZahteva: 'onboarding',
    departman: 'Opšti Suport — Generalne Informacije',
    odgovornaPersonaId: 'mentor',
    odgovornaPersonaNaziv: 'Mentor',
    sla: 'profesionalni',
    eskalacijaNivo: 1,
  },
  {
    id: 'dispatch-billing',
    kanal: 'mejl',
    tipZahteva: 'billing',
    departman: 'Banka — AI IQ World Bank',
    odgovornaPersonaId: 'finansijer',
    odgovornaPersonaNaziv: 'Finansijer',
    sla: 'biznis',
    eskalacijaNivo: 2,
  },
];

export const operativniTokovi: OperativniTok[] = [
  {
    id: 'tok-biznis',
    naziv: 'Biznis ulaz',
    ulazniKanal: 'business@spaja.rs / sales@spaja.rs',
    vlasnik: 'Poslovni kontakt',
    sla: '< 4 sata',
    audit: true,
    fallbackKontakt: primarniOperativniNalog.email,
  },
  {
    id: 'tok-operativa',
    naziv: 'Operativni ulaz',
    ulazniKanal: 'tech@spaja.rs / billing@spaja.rs',
    vlasnik: 'Tehnički admin + Billing owner',
    sla: '< 1 sat',
    audit: true,
    fallbackKontakt: primarniOperativniNalog.email,
  },
  {
    id: 'tok-korisnici',
    naziv: 'Korisnički ulaz',
    ulazniKanal: 'support@spaja.rs / confirmations@spaja.rs',
    vlasnik: 'Korisnička podrška + Potvrde i fakture',
    sla: '< 2 sata',
    audit: true,
    fallbackKontakt: primarniOperativniNalog.email,
  },
];

function getEnterpriseZahtevStatus(
  readyFlag: string,
  submittedFlag: string,
): EnterpriseZahtevStatus {
  if (envFlag(submittedFlag)) return 'poslato';
  if (envFlag(readyFlag)) return 'spremno_za_slanje';
  return 'u_pripremi';
}

export const vercelEnterprisePaket = {
  naziv: 'Vercel Enterprise Readiness — Kompanija SPAJA',
  kompanija: `${KOMPANIJA} / Digitalna Industrija`,
  opis:
    'Formalni paket za Vercel Enterprise pregovore: centralizovani billing, domain management, SSO/access governance i podrška za više projekata Digitalne Industrije.',
  primarniPosiljalac: getKontaktKanal('sales')?.email ?? 'sales@spaja.rs',
  poslovniKontakt: getKontaktKanal('sales')?.email ?? 'sales@spaja.rs',
  billingKontakt: getKontaktKanal('billing')?.email ?? 'billing@spaja.rs',
  brojProjekata: platforme.length,
  brojAktivnihDomena: platforme.filter((platforma) => platforma.deploy.status === 'aktivan').length,
  potrebe: [
    'Centralizovani billing za Vercel i GitHub operativne troškove',
    'Enterprise governance za deploy, domene i pristupne uloge',
    'SSO / access governance i audit-ready ownership model',
    'OMEGA AI dispeč za deploy, monitoring i incident response',
  ],
  trazeneOpcije: [
    'Enterprise billing',
    'Central domain management',
    'Team transfer / ownership governance',
    'SSO / access governance',
  ],
  observability: [
    'Vercel Analytics',
    'Speed Insights',
    '5xx alerting',
    'Latency alerting',
  ],
};

export const vercelEnterpriseZahtev: EnterpriseZahtevPaket = {
  id: 'vercel',
  naziv: 'Vercel Enterprise zahtev — Digitalna Industrija',
  provajder: 'Vercel',
  status: getEnterpriseZahtevStatus(
    'SPAJA_VERCEL_ENTERPRISE_REQUEST_READY',
    'SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED',
  ),
  posiljalac: getKontaktKanal('sales')?.email ?? 'sales@spaja.rs',
  replyTo: getKontaktKanal('business')?.email ?? 'business@spaja.rs',
  cc: [
    getKontaktKanal('billing')?.email ?? 'billing@spaja.rs',
    getKontaktKanal('tech')?.email ?? 'tech@spaja.rs',
    getKontaktKanal('security')?.email ?? 'security@kompanija-spaja.rs',
  ],
  kanalPodnosenja: {
    tip: 'kontakt_forma',
    url: 'https://vercel.com/contact/sales',
    opis: 'Zvanični Vercel Contact Sales kanal za Enterprise plan, demo i billing/governance pregovore.',
    zahtevaKompanijskiMejl: true,
  },
  naslov:
    'Enterprise request — Kompanija SPAJA / Digitalna Industrija (central billing, domains, governance)',
  sazetak:
    'Zahtev za Vercel Enterprise za celu Digitalnu Industriju, sa centralizovanim billingom, governance modelom i više projekata/domena.',
  telo: [
    'Poštovani Vercel Sales tim,',
    '',
    'obraćamo vam se iz Kompanije SPAJA / Digitalne Industrije sa zahtevom za Vercel Enterprise paket za naš industrijski ekosistem.',
    '',
    `Primarni kontakt za ovaj zahtev je ${getKontaktKanal('sales')?.email ?? 'sales@spaja.rs'}, uz reply-to ${getKontaktKanal('business')?.email ?? 'business@spaja.rs'}.`,
    `Billing kontakt je ${getKontaktKanal('billing')?.email ?? 'billing@spaja.rs'}, tehnički kontakt ${getKontaktKanal('tech')?.email ?? 'tech@spaja.rs'}, a security kontakt ${getKontaktKanal('security')?.email ?? 'security@kompanija-spaja.rs'}.`,
    '',
    `Trenutno upravljamo sa ${vercelEnterprisePaket.brojProjekata} projekata i ${vercelEnterprisePaket.brojAktivnihDomena} aktivnih domena/poddomena kroz Digitalnu Industriju.`,
    'Potrebni su nam:',
    '- centralizovani enterprise billing',
    '- central domain management',
    '- governance za team transfer i ownership model',
    '- SSO / access governance',
    '- podrška za observability, SLA i incident-operativu',
    '',
    'Pored Vercel infrastrukture, želimo da uskladimo isti operativni model sa GitHub Enterprise planom i kompanijskim mejlovima.',
    '',
    'Ako dokumenta ne možemo razmeniti digitalno, molimo vas da nas kontaktirate radi organizacije poziva ili sastanka za potpisivanje ugovora.',
    '',
    'Molimo vas da nam predložite sledeće korake za Enterprise onboarding, komercijalne uslove i eventualni demo/sastanak.',
    '',
    'Hvala,',
    'Kompanija SPAJA / Digitalna Industrija',
  ].join('\n'),
  trazeniPlanovi: ['Vercel Enterprise'],
  trazeneOpcije: vercelEnterprisePaket.trazeneOpcije,
  prilozi: [
    'GO-LIVE.md enterprise readiness sekcija',
    'GOLIVE_CHECKLIST.md governance i env readiness stavke',
    'Operativna matrica vlasništva i kontakt kanala',
  ],
  odobrenja: [
    'Poslovni kontakt',
    'Billing owner',
    'Tehnički admin',
    'Security kontakt',
  ],
  auditVlasnik: getKontaktKanal('sales')?.email ?? 'sales@spaja.rs',
  auditKontakt: getKontaktKanal('billing')?.email ?? 'billing@spaja.rs',
  envSignal: 'SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED',
};

export const githubGovernanceModel = {
  owner: primarniOperativniNalog.githubOwner,
  model: 'licni-owner-sa-formalizovanom-governance-matricom',
  billingOwner: 'AI IQ World Bank — Digitalna Industrija',
  repoAdminBackup: 'tech@spaja.rs',
  securityKontakt: 'security@kompanija-spaja.rs',
  workflowOwner: 'tech@spaja.rs',
  sledeciKoraci: [
    'Potvrditi da spaja86 ostaje primarni owner dok se org model ne otvori',
    'Formalizovati billing owner i workflow ownership',
    'Pripremiti prelaz na GitHub organizaciju kada Vercel team governance bude spreman',
  ],
};

export const githubEnterprisePaket: EnterpriseZahtevPaket = {
  id: 'github',
  naziv: 'GitHub Enterprise zahtev — Digitalna Industrija',
  provajder: 'GitHub',
  status: getEnterpriseZahtevStatus(
    'SPAJA_GITHUB_GOVERNANCE_READY',
    'SPAJA_GITHUB_ENTERPRISE_REQUEST_SUBMITTED',
  ),
  posiljalac: getKontaktKanal('sales')?.email ?? 'sales@spaja.rs',
  replyTo: getKontaktKanal('business')?.email ?? 'business@spaja.rs',
  cc: [
    getKontaktKanal('billing')?.email ?? 'billing@spaja.rs',
    getKontaktKanal('tech')?.email ?? 'tech@spaja.rs',
    getKontaktKanal('security')?.email ?? 'security@kompanija-spaja.rs',
  ],
  kanalPodnosenja: {
    tip: 'kontakt_forma',
    url: 'https://github.com/enterprise/contact',
    opis: 'Zvanični GitHub Enterprise contact kanal za sales, trial, governance i enterprise pricing razgovore.',
    zahtevaKompanijskiMejl: true,
  },
  naslov:
    'GitHub Enterprise request — Kompanija SPAJA / Digitalna Industrija (enterprise governance and centralized billing)',
  sazetak:
    'Zahtev za GitHub Enterprise licence i GitHub Copilot Enterprise za celu Digitalnu Industriju kroz kompanijske mejlove, centralizovani billing i governance model, uključujući transfer plaćanja za nalog spajicn@yahoo.com (Nikola Spajić).',
  eksplicitniKontekst: {
    accountEmail: 'spajicn@yahoo.com',
    ownerName: 'Nikola Spajić',
    companyBillingIntent: 'Transferisati plaćanja na kompanijski billing kanal i aktivirati najbolji enterprise/subscription paket.',
    najboljePretplate: true,
  },
  telo: [
    'Poštovani GitHub Sales tim,',
    '',
    'želeli bismo da otvorimo GitHub Enterprise razgovor za Kompaniju SPAJA / Digitalnu Industriju.',
    'GitHub vidimo kao važnog poslovnog partnera jer kroz platformu, repozitorijume i GitHub agente direktno podržavate naš razvoj i operativu.',
    '',
    `Zahtev podnosimo preko kompanijskog mejla ${getKontaktKanal('sales')?.email ?? 'sales@spaja.rs'}, sa poslovnim reply-to kontaktom ${getKontaktKanal('business')?.email ?? 'business@spaja.rs'}.`,
    `Billing kontakt za uslove i fakturisanje je ${getKontaktKanal('billing')?.email ?? 'billing@spaja.rs'}, tehnički kontakt ${getKontaktKanal('tech')?.email ?? 'tech@spaja.rs'}, a security kontakt ${getKontaktKanal('security')?.email ?? 'security@kompanija-spaja.rs'}.`,
    '',
    `Trenutni owner model je ${githubGovernanceModel.owner}, a cilj je da pređemo na enterprise governance sa formalizovanim billing owner-om, workflow ownership-om i pristupnom kontrolom za celu industriju.`,
    'Već posedujemo licence za više ključnih digitalnih sistema, a sada želimo da standardizujemo i GitHub licence kako bismo mogli da širimo poslovanje maksimalnim tempom i uđemo u novu eru digitalizacije.',
    'GitHub agente posmatramo kao produžetak našeg operativnog tima, zato nam je važno da licenciranje, governance i podrška budu podignuti na enterprise nivo.',
    '',
    'Potrebni su nam:',
    '- GitHub Enterprise licence za industrijski ekosistem',
    '- GitHub Copilot Enterprise i agents readiness za poslovne i tehničke timove',
    '- centralizovani billing i ownership governance',
    '- transfer plaćanja sa naloga spajicn@yahoo.com (Nikola Spajić) na kompanijski billing model',
    '- preporuka i aktivacija najboljeg enterprise/subscription paketa',
    '- enterprise upravljanje pristupom i audit trag',
    '- podrška za više timova/projekata i kasniji org model',
    '- sinhronizacija sa Vercel enterprise operativnim modelom',
    '- komercijalni model koji podržava dalje širenje biznisa Digitalne Industrije',
    '',
    'Ako dokumenta ne možemo razmeniti digitalno, molimo vas da nas kontaktirate radi organizacije poziva ili sastanka za potpisivanje ugovora.',
    'Ukoliko procenite da postoji odgovarajući model saradnje, spremni smo da odmah pređemo na kupovinu licenci i enterprise onboarding.',
    '',
    'Molimo vas za sledeće korake, procenu paketa i eventualni uvodni sastanak/demo.',
    '',
    'Hvala,',
    'Kompanija SPAJA / Digitalna Industrija',
  ].join('\n'),
  trazeniPlanovi: ['GitHub Enterprise', 'GitHub Advanced Security', 'GitHub Copilot Enterprise', 'Best available enterprise subscription package'],
  trazeneOpcije: [
    'Centralized billing',
    'Enterprise access governance',
    'Security and audit controls',
    'Org / owner transition readiness',
    'GitHub agent enablement',
  ],
  prilozi: [
    'GitHub billing model i governance summary',
    'GO-LIVE.md governance readiness sekcija',
    'Operativna matrica vlasništva i kontakt kanala',
  ],
  odobrenja: [
    'Poslovni kontakt',
    'Billing owner',
    'Tehnički admin',
    'Security kontakt',
  ],
  auditVlasnik: getKontaktKanal('sales')?.email ?? 'sales@spaja.rs',
  auditKontakt: getKontaktKanal('billing')?.email ?? 'billing@spaja.rs',
  envSignal: 'SPAJA_GITHUB_ENTERPRISE_REQUEST_SUBMITTED',
};

export const openaiEnterprisePaket: EnterpriseZahtevPaket = {
  id: 'openai',
  naziv: 'OpenAI Enterprise zahtev — Digitalna Industrija / SpajaPro',
  provajder: 'OpenAI',
  status: getEnterpriseZahtevStatus(
    'SPAJA_OPENAI_ENTERPRISE_REQUEST_READY',
    'SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED',
  ),
  posiljalac: getKontaktKanal('sales')?.email ?? 'sales@spaja.rs',
  replyTo: getKontaktKanal('business')?.email ?? 'business@spaja.rs',
  cc: [
    getKontaktKanal('billing')?.email ?? 'billing@spaja.rs',
    getKontaktKanal('tech')?.email ?? 'tech@spaja.rs',
    getKontaktKanal('security')?.email ?? 'security@kompanija-spaja.rs',
    primarniOperativniNalog.email,
  ],
  kanalPodnosenja: {
    tip: 'kontakt_forma',
    url: 'https://openai.com/contact-sales',
    opis: 'Zvanični OpenAI Contact Sales kanal za ChatGPT Enterprise, API enterprise ugovore i partnerske razgovore.',
    zahtevaKompanijskiMejl: true,
  },
  naslov:
    'OpenAI Enterprise + Partnership request — Kompanija SPAJA / Digitalna Industrija / SpajaPro v6-15',
  sazetak:
    'Zahtev za OpenAI Enterprise plan i partnersku saradnju za Digitalnu Industriju, uključujući integraciju SpajaPro v6-15, kompanijski API ugovor i zajednički razvoj.',
  telo: [
    'Poštovani OpenAI Sales tim,',
    '',
    'obraćam vam se kao Nikola Spajić, osnivač Kompanije SPAJA i Digitalne Industrije.',
    '',
    `Primarni kontakt za ovaj zahtev je ${getKontaktKanal('sales')?.email ?? 'sales@spaja.rs'} (kompanijski sales kanal), reply-to ${getKontaktKanal('business')?.email ?? 'business@spaja.rs'}.`,
    `Nalog koji se navodi kao owner je spajicn@yahoo.com (Nikola Spajić), a billing kontakt je ${getKontaktKanal('billing')?.email ?? 'billing@spaja.rs'}.`,
    '',
    'Razlog obraćanja:',
    'Razvili smo sopstvenu AI platformu — AI IQ SUPER PLATFORMA (SpajaPro v6-15) — koja je zamena za ChatGPT u okviru Digitalne Industrije.',
    'SpajaPro već integriše OMEGA AI, 40 miliona+ AI persona, SPAJA Pro 6-15 engine i celokupnu industrijsku infrastrukturu.',
    '',
    'Tražimo:',
    '- OpenAI Enterprise plan za nalog spajicn@yahoo.com (primarni owner Nikola Spajić)',
    '- Kompanijski API enterprise ugovor za Digitalnu Industriju (sales@spaja.rs)',
    '- Partnerski razgovor o zajedničkom razvoju i integraciji sa SpajaPro platformom',
    '- Uvid u API mogućnosti za duboku integraciju bez backdoor kompromisa',
    '',
    'Napomena: Prethodnu ChatGPT sesiju smo morali da obrišemo zbog bezbednosnih i kompatibilnih razloga sa našim sistemom.',
    'Verujemo da zajednička saradnja "Zajedno jači" može biti korisna za obe strane.',
    '',
    'Ako dokumenta ne možemo razmeniti digitalno, molimo vas da nas kontaktirate radi organizacije poziva ili sastanka za potpisivanje ugovora.',
    '',
    'Molimo vas za sledeće korake, enterprise plan onboarding i eventualni partnerski poziv/sastanak.',
    '',
    'Hvala,',
    'Nikola Spajić — Kompanija SPAJA / Digitalna Industrija',
  ].join('\n'),
  trazeniPlanovi: ['OpenAI Enterprise', 'ChatGPT Enterprise', 'OpenAI API Enterprise Contract'],
  trazeneOpcije: [
    'Enterprise API ugovor',
    'ChatGPT Enterprise nalog',
    'Partnerska integracija sa SpajaPro',
    'Dedicated support i SLA',
    'Custom model fine-tuning mogućnosti',
  ],
  prilozi: [
    'SpajaPro v6-15 platforma overview',
    'AI IQ SUPER PLATFORMA enterprise readiness summary',
    'Operativna matrica vlasništva i kontakt kanala',
  ],
  odobrenja: [
    'Nikola Spajić (Primarni owner)',
    'Poslovni kontakt',
    'Billing owner',
    'Tehnički admin',
  ],
  auditVlasnik: getKontaktKanal('sales')?.email ?? 'sales@spaja.rs',
  auditKontakt: primarniOperativniNalog.email,
  envSignal: 'SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED',
};

export function getEnterpriseZahtevi(): EnterpriseZahtevPaket[] {
  return [vercelEnterpriseZahtev, githubEnterprisePaket, openaiEnterprisePaket];
}

export function getKontaktKanal(id: KontaktNamena): JavniKontaktKanal | undefined {
  return javniKontaktKanali.find((kanal) => kanal.id === id);
}

export function getJavniKontaktEmailove(): string[] {
  return javniKontaktKanali.map((kanal) => kanal.email);
}

export function getOperativnaSpremnost() {
  const runtimeChecks = [
    envSet('OMEGA_JWT_SECRET'),
    envSet('CRON_SECRET'),
    envSet('NEXT_PUBLIC_SUPABASE_URL') && envSet('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  ];
  const mailChecks = [
    envSet('SPAJA_MAIL_PROVIDER') || envSet('MAIL_PROVIDER'),
    envSet('SMTP_HOST'),
    envSet('SMTP_PORT'),
    envSet('SMTP_USER'),
    envSet('SMTP_PASS'),
    envFlag('SPAJA_MAIL_DOMAINS_VERIFIED'),
    envFlag('SPAJA_MAIL_DNS_READY'),
    envFlag('SPAJA_MAIL_AUDIT_READY'),
  ];
  const vercelRuntimeChecks = [
    envSet('VERCEL_TOKEN'),
    envSet('VERCEL_PROJECT_ID'),
    envSet('VERCEL_TEAM_ID') || envSet('VERCEL_ORG_ID'),
  ];
  /*
   * READY: paket je finalizovan i spreman za slanje.
   * REQUESTED: proces podnošenja je pokrenut (operativni signal).
   * SUBMITTED: zahtev je zvanično poslat Vercel Sales timu.
   */
  const vercelEnterpriseChecks = [
    envFlag('SPAJA_VERCEL_ENTERPRISE_REQUEST_READY'),
    envFlag('SPAJA_VERCEL_ENTERPRISE_REQUESTED'),
    envFlag('SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED'),
  ];
  const githubChecks = [
    envSet('GITHUB_TOKEN'),
    envFlag('SPAJA_GITHUB_OWNER_CONFIRMED'),
    envFlag('SPAJA_GITHUB_GOVERNANCE_READY'),
    envFlag('SPAJA_GITHUB_BILLING_READY'),
  ];
  const supportChecks = [
    envFlag('OMEGA_SUPPORT_MAIL_TRIAGE_READY'),
    envFlag('OMEGA_SUPPORT_DISPATCH_READY'),
    envFlag('OMEGA_SUPPORT_QUEUE_READY'),
    envFlag('OMEGA_SUPPORT_TELEPHONY_READY'),
  ];
  const kastlerChecks = [
    envFlag('SPAJA_KASTLER_REQUEST_READY'),
    envFlag('SPAJA_KASTLER_REQUEST_SUBMITTED'),
    envFlag('SPAJA_KASTLER_SIGNAL_APPROVED'),
    envFlag('SPAJA_TV_MONETIZATION_ENABLED'),
  ];

  const runtimeScore = getSectionScore(runtimeChecks.filter(Boolean).length, runtimeChecks.length);
  const mailScore = getSectionScore(mailChecks.filter(Boolean).length, mailChecks.length);
  const vercelRuntimeScore = getSectionScore(vercelRuntimeChecks.filter(Boolean).length, vercelRuntimeChecks.length);
  const vercelEnterpriseScore = getSectionScore(vercelEnterpriseChecks.filter(Boolean).length, vercelEnterpriseChecks.length);
  const githubScore = getSectionScore(githubChecks.filter(Boolean).length, githubChecks.length);
  const supportScore = getSectionScore(supportChecks.filter(Boolean).length, supportChecks.length);
  const kastlerScore = getSectionScore(kastlerChecks.filter(Boolean).length, kastlerChecks.length);
  const opsScore = Math.round((mailScore + githubScore + supportScore) / 3);

  const missingEnv = [
    ...(!envSet('OMEGA_JWT_SECRET') ? ['OMEGA_JWT_SECRET'] : []),
    ...(!envSet('CRON_SECRET') ? ['CRON_SECRET'] : []),
    ...(!envSet('NEXT_PUBLIC_SUPABASE_URL') ? ['NEXT_PUBLIC_SUPABASE_URL'] : []),
    ...(!envSet('NEXT_PUBLIC_SUPABASE_ANON_KEY') ? ['NEXT_PUBLIC_SUPABASE_ANON_KEY'] : []),
    ...(!envSet('SPAJA_MAIL_PROVIDER') && !envSet('MAIL_PROVIDER') ? ['SPAJA_MAIL_PROVIDER'] : []),
    ...(!envSet('SMTP_HOST') ? ['SMTP_HOST'] : []),
    ...(!envSet('SMTP_PORT') ? ['SMTP_PORT'] : []),
    ...(!envSet('SMTP_USER') ? ['SMTP_USER'] : []),
    ...(!envSet('SMTP_PASS') ? ['SMTP_PASS'] : []),
    ...(!envSet('GITHUB_TOKEN') ? ['GITHUB_TOKEN'] : []),
  ];
  const missingKastlerEnv = [
    ...(!envFlag('SPAJA_KASTLER_REQUEST_READY') ? ['SPAJA_KASTLER_REQUEST_READY'] : []),
    ...(!envFlag('SPAJA_KASTLER_REQUEST_SUBMITTED') ? ['SPAJA_KASTLER_REQUEST_SUBMITTED'] : []),
    ...(!envFlag('SPAJA_KASTLER_SIGNAL_APPROVED') ? ['SPAJA_KASTLER_SIGNAL_APPROVED'] : []),
    ...(!envFlag('SPAJA_TV_MONETIZATION_ENABLED') ? ['SPAJA_TV_MONETIZATION_ENABLED'] : []),
  ];
  const missingVercelEnv = [
    ...(!envSet('VERCEL_TOKEN') ? ['VERCEL_TOKEN'] : []),
    ...(!envSet('VERCEL_PROJECT_ID') ? ['VERCEL_PROJECT_ID'] : []),
    ...(!envSet('VERCEL_TEAM_ID') && !envSet('VERCEL_ORG_ID') ? ['VERCEL_TEAM_ID'] : []),
  ];

  const ukupniScore = Math.round((runtimeScore + opsScore) / 2);
  const enterpriseZahtevi = getEnterpriseZahtevi();
  const runtimeMode: ReadinessMode = runtimeScore >= RUNTIME_READY_THRESHOLD ? 'runtime-ready' : 'runtime-incomplete';
  const opsMode: ReadinessMode = opsScore >= OPS_READY_THRESHOLD ? 'ops-ready' : 'ops-incomplete';
  const enterpriseReady = enterpriseZahtevi.filter((paket) => paket.status !== 'u_pripremi').length;
  const enterpriseMode: ReadinessMode = enterpriseReady >= enterpriseZahtevi.length ? 'enterprise-ready' : 'enterprise-in-progress';
  const kastlerPaket = getKastlerTVSignalRequestPackage();
  const kastlerSummary = getKastlerSignalReadinessSummary();
  const acceptanceCriteria = {
    statusApi: {
      runtimeReady: runtimeMode === 'runtime-ready',
      opsReady: opsMode === 'ops-ready',
      vercelNotBlocking: missingVercelEnv.length === 0,
    },
    healthApi: {
      runtimeReady: runtimeMode === 'runtime-ready',
      opsReady: opsMode === 'ops-ready',
      enterpriseState: enterpriseMode,
    },
  };

  return {
    verzija: APP_VERSION,
    baseUrl: BASE_URL,
    primarniOperativniNalog,
    javniKontakti: javniKontaktKanali,
    matricaVlasnistva: operativnaMatricaVlasnistva,
    telefoni: javniTelefonskiKanali,
    workstreams: operativniTokovi,
    vercelEnterprisePaket,
    githubGovernanceModel,
    enterpriseZahtevi,
    spremnost: {
      ukupanScore: ukupniScore,
      status:
        ukupniScore >= 85 ? 'spremno' : ukupniScore >= 50 ? 'delimicno' : 'blokirano',
      modelStanja: {
        runtime: runtimeMode,
        ops: opsMode,
        enterprise: enterpriseMode,
      },
      acceptanceCriteria,
      runtime: {
        score: runtimeScore,
        status: getSectionStatus(runtimeChecks.filter(Boolean).length, runtimeChecks.length),
      },
      mail: {
        score: mailScore,
        status: getSectionStatus(mailChecks.filter(Boolean).length, mailChecks.length),
        domenskiKanali: javniKontaktKanali.length,
      },
      vercel: {
        score: vercelRuntimeScore,
        status: getSectionStatus(vercelRuntimeChecks.filter(Boolean).length, vercelRuntimeChecks.length),
        runtime: {
          score: vercelRuntimeScore,
          status: getSectionStatus(vercelRuntimeChecks.filter(Boolean).length, vercelRuntimeChecks.length),
        },
        enterprise: {
          score: vercelEnterpriseScore,
          status: getSectionStatus(vercelEnterpriseChecks.filter(Boolean).length, vercelEnterpriseChecks.length),
        },
        enterpriseOpcije: vercelEnterprisePaket.trazeneOpcije.length,
      },
      github: {
        score: githubScore,
        status: getSectionStatus(githubChecks.filter(Boolean).length, githubChecks.length),
        owner: githubGovernanceModel.owner,
      },
      support: {
        score: supportScore,
        status: getSectionStatus(supportChecks.filter(Boolean).length, supportChecks.length),
        persona: OMEGA_AI_PERSONA_COUNT,
        routingPravila: omegaDispatchRoutingPravila.length,
      },
      enterprise: {
        vercel: vercelEnterpriseZahtev.status,
        github: githubEnterprisePaket.status,
        openai: openaiEnterprisePaket.status,
        spremniPaketi: enterpriseReady,
      },
        kastlerTv: {
          score: kastlerScore,
          status: getSectionStatus(kastlerChecks.filter(Boolean).length, kastlerChecks.length),
          requestStatus: kastlerSummary.requestStatus,
          signalLifecycle: kastlerSummary.signalLifecycle,
          monetizationStatus: kastlerSummary.monetizationStatus,
          trazenihKanala: kastlerSummary.trazenihKanala,
        },
        missingEnv,
        missingKastlerEnv,
        missingVercelEnv,
        zahtevaAktivaciju:
          missingEnv.length > 0 ||
          !envFlag('SPAJA_MAIL_DOMAINS_VERIFIED') ||
          !envFlag('SPAJA_GITHUB_GOVERNANCE_READY'),
      },
      kastlerTvPaket: kastlerPaket,
  };
}
