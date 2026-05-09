import {
  APP_VERSION,
  BASE_URL,
  KOMPANIJA,
  MOBILNI_POZIVNI,
  OMEGA_AI_PERSONA_COUNT,
} from './constants';
import { platforme } from './platforme';

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

type ReadinessStatus = 'spremno' | 'delimicno' | 'blokirano';

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

export const vercelEnterprisePaket = {
  naziv: 'Vercel Enterprise Readiness — Kompanija SPAJA',
  kompanija: `${KOMPANIJA} / Digitalna Industrija`,
  opis:
    'Formalni paket za Vercel Enterprise pregovore: centralizovani billing, domain management, SSO/access governance i podrška za više projekata Digitalne Industrije.',
  primarniPosiljalac: primarniOperativniNalog.vercelNalog,
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

export function getKontaktKanal(id: KontaktNamena): JavniKontaktKanal | undefined {
  return javniKontaktKanali.find((kanal) => kanal.id === id);
}

export function getJavniKontaktEmailove(): string[] {
  return javniKontaktKanali.map((kanal) => kanal.email);
}

export function getOperativnaSpremnost() {
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
  const vercelChecks = [
    envSet('VERCEL_TOKEN'),
    envSet('VERCEL_PROJECT_ID'),
    envSet('VERCEL_TEAM_ID') || envSet('VERCEL_ORG_ID'),
    envFlag('SPAJA_VERCEL_ENTERPRISE_REQUEST_READY'),
    envFlag('SPAJA_VERCEL_ENTERPRISE_REQUESTED'),
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

  const mailScore = getSectionScore(mailChecks.filter(Boolean).length, mailChecks.length);
  const vercelScore = getSectionScore(vercelChecks.filter(Boolean).length, vercelChecks.length);
  const githubScore = getSectionScore(githubChecks.filter(Boolean).length, githubChecks.length);
  const supportScore = getSectionScore(supportChecks.filter(Boolean).length, supportChecks.length);

  const missingEnv = [
    ...(!envSet('SPAJA_MAIL_PROVIDER') && !envSet('MAIL_PROVIDER') ? ['SPAJA_MAIL_PROVIDER'] : []),
    ...(!envSet('SMTP_HOST') ? ['SMTP_HOST'] : []),
    ...(!envSet('SMTP_PORT') ? ['SMTP_PORT'] : []),
    ...(!envSet('SMTP_USER') ? ['SMTP_USER'] : []),
    ...(!envSet('SMTP_PASS') ? ['SMTP_PASS'] : []),
    ...(!envSet('VERCEL_TOKEN') ? ['VERCEL_TOKEN'] : []),
    ...(!envSet('VERCEL_PROJECT_ID') ? ['VERCEL_PROJECT_ID'] : []),
    ...(!envSet('VERCEL_TEAM_ID') && !envSet('VERCEL_ORG_ID') ? ['VERCEL_TEAM_ID'] : []),
    ...(!envSet('GITHUB_TOKEN') ? ['GITHUB_TOKEN'] : []),
  ];

  const ukupniScore = Math.round((mailScore + vercelScore + githubScore + supportScore) / 4);

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
    spremnost: {
      ukupanScore: ukupniScore,
      status:
        ukupniScore >= 85 ? 'spremno' : ukupniScore >= 50 ? 'delimicno' : 'blokirano',
      mail: {
        score: mailScore,
        status: getSectionStatus(mailChecks.filter(Boolean).length, mailChecks.length),
        domenskiKanali: javniKontaktKanali.length,
      },
      vercel: {
        score: vercelScore,
        status: getSectionStatus(vercelChecks.filter(Boolean).length, vercelChecks.length),
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
      missingEnv,
      zahtevaAktivaciju:
        missingEnv.length > 0 ||
        !envFlag('SPAJA_MAIL_DOMAINS_VERIFIED') ||
        !envFlag('SPAJA_VERCEL_ENTERPRISE_REQUEST_READY') ||
        !envFlag('SPAJA_GITHUB_GOVERNANCE_READY'),
    },
  };
}
