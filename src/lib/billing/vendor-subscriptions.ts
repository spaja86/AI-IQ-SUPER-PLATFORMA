export type VendorSubscriptionProvider = 'GitHub' | 'Vercel';
export type VendorSubscriptionSegment = 'gradjanstvo' | 'privreda';
export type VendorSubscriptionStatus =
  | 'draft'
  | 'incomplete-intake'
  | 'legal-review'
  | 'tax-review'
  | 'approved-for-invoice'
  | 'payment-pending'
  | 'payment-confirmed'
  | 'service-active'
  | 'rollback'
  | 'closed'
  | 'blocked-until-validated';

export interface VendorSubscriptionStatusDefinition {
  status: VendorSubscriptionStatus;
  label: string;
  description: string;
}

export interface VendorSubscriptionOffering {
  id: string;
  name: string;
  summary: string;
}

export interface VendorSubscriptionBenefits {
  seats: string;
  privateRepos: string;
  copilotAiRights: string;
  buildDeployLimits: string;
  analyticsObservability: string;
  slaSupport: string;
  auditGovernance: string;
  projectsTeamsDomains: string;
}

export interface VendorSubscriptionFormalPackage {
  id: string;
  provider: VendorSubscriptionProvider;
  segment: VendorSubscriptionSegment;
  title: string;
  summary: string;
  targetUsers: string[];
  billingCadence: string[];
  paymentMethods: string[];
  offerings: VendorSubscriptionOffering[];
  benefits: VendorSubscriptionBenefits;
  activationRequirements: string[];
  blockedScenarios: string[];
  pilotPhase: string;
}

export interface VendorSubscriptionRulesBySegment {
  gradjanstvo: string[];
  privreda: string[];
}

export interface VendorSubscriptionFinOpsFramework {
  budgetOwnership: VendorSubscriptionRulesBySegment;
  alertThresholdsPercent: number[];
  kpis: string[];
  antiOverageRules: VendorSubscriptionRulesBySegment;
}

export interface VendorSubscriptionProcurementFlow {
  provider: VendorSubscriptionProvider;
  steps: string[];
}

export interface VendorSubscriptionIntakeField {
  key: string;
  label: string;
  required: boolean;
  appliesTo: VendorSubscriptionSegment[];
}

export interface VendorSubscriptionAuditPackage {
  events: string[];
  downstreamReferenceRule: string;
}

export interface VendorSubscriptionGoLivePhase {
  phase: string;
  description: string;
}

export const VENDOR_SUBSCRIPTION_STATUS_MODEL: VendorSubscriptionStatusDefinition[] = [
  { status: 'draft', label: 'Draft', description: 'Predmet otvoren i još nije spreman za operativnu obradu.' },
  {
    status: 'incomplete-intake',
    label: 'Incomplete intake',
    description: 'Nedostaju obavezni identifikacioni, komercijalni ili compliance podaci.',
  },
  { status: 'legal-review', label: 'Legal review', description: 'U toku je pravna validacija ugovora ili uslova.' },
  { status: 'tax-review', label: 'Tax review', description: 'U toku je poreski i računovodstveni pregled.' },
  {
    status: 'approved-for-invoice',
    label: 'Approved for invoice',
    description: 'Dozvoljeno je izdavanje proforme ili fakture za konkretan ciklus.',
  },
  { status: 'payment-pending', label: 'Payment pending', description: 'Račun je izdat i čeka se potvrda uplate.' },
  {
    status: 'payment-confirmed',
    label: 'Payment confirmed',
    description: 'Uplata je potvrđena i aktivacija može biti razmotrena.',
  },
  {
    status: 'service-active',
    label: 'Service active',
    description: 'Pretplata je aktivirana posle potvrđene uplate i validiranog osnova.',
  },
  { status: 'rollback', label: 'Rollback', description: 'Aktivacija ili promena plana je vraćena zbog rizika ili neusaglašenosti.' },
  { status: 'closed', label: 'Closed', description: 'Predmet je zatvoren bez daljih operativnih koraka.' },
  {
    status: 'blocked-until-validated',
    label: 'Blocked until validated',
    description: 'Model ostaje blokiran dok ne postane pravno, poreski i operativno određen.',
  },
];

export const VENDOR_SUBSCRIPTION_ACTIVATION_RULES = [
  'Nema aktivacije bez statusa payment-confirmed.',
  'Nema enterprise benefita bez validiranog ugovornog i billing osnova.',
  'Neodređeni ili “beskonačni” modeli ostaju blocked-until-validated dok se ne prevedu u periodični obračun.',
];

export const VENDOR_SUBSCRIPTION_LEGAL_AND_TAX_RULES: VendorSubscriptionRulesBySegment = {
  gradjanstvo: [
    'Identitet korisnika i prihvatanje uslova korišćenja su obavezni.',
    'Mora postojati fiskalno prihvatljiv račun ili računovodstveni trag.',
    'Refund, otkazivanje i downgrade pravila moraju biti javno definisani.',
  ],
  privreda: [
    'Pravno lice, PIB/MB i ovlašćeni potpisnik moraju biti potvrđeni.',
    'Ugovor ili aneks, PDV/eFaktura i approval lanac su obavezni.',
    'Bez potvrđenog poreskog modela nema approved-for-invoice statusa.',
  ],
};

export const VENDOR_SUBSCRIPTION_FINOPS_FRAMEWORK: VendorSubscriptionFinOpsFramework = {
  budgetOwnership: {
    gradjanstvo: [
      'Lični ili individualni limit potrošnje mora biti unapred definisan.',
      'Anti-overage pravilo mora zaustaviti add-on aktivacije iznad odobrenog limita.',
    ],
    privreda: [
      'Cost center i odgovorni owner su obavezni za svaku firmu, tim ili agenciju.',
      'Vendor review, budžet i ownership moraju biti povezani sa governance evidencijom.',
    ],
  },
  alertThresholdsPercent: [50, 75, 90, 100],
  kpis: ['Trošak po deploy-u', 'Trošak po korisniku', 'Build duration', 'Deployment success rate'],
  antiOverageRules: {
    gradjanstvo: [
      'Dodaci i seat-ovi se ne aktiviraju automatski bez eksplicitne saglasnosti korisnika.',
      'Kod prekoračenja limita aktivira se upozorenje pre narednog ciklusa.',
    ],
    privreda: [
      'Overage odluke zahtevaju approval owner-a ili cost center-a.',
      'Enterprise i compliance add-on-i se prate kroz kvartalni vendor review.',
    ],
  },
};

export const VENDOR_SUBSCRIPTION_INTAKE_FIELDS: VendorSubscriptionIntakeField[] = [
  { key: 'segment', label: 'Segment korisnika', required: true, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'identity', label: 'Identitet / naziv pravnog lica', required: true, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'contactChannel', label: 'Kontakt kanal', required: true, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'desiredPlan', label: 'Željeni plan', required: true, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'currencyCadence', label: 'Valuta i ciklus naplate', required: true, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'paymentMethod', label: 'Način plaćanja', required: true, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'expectedUsage', label: 'Očekivani obim korišćenja', required: true, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'addons', label: 'Potrebni add-on-i', required: false, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'complianceNeeds', label: 'Compliance zahtevi', required: false, appliesTo: ['gradjanstvo', 'privreda'] },
  { key: 'pibMb', label: 'PIB / MB', required: true, appliesTo: ['privreda'] },
  { key: 'authorizedSigner', label: 'Ovlašćeni potpisnik', required: true, appliesTo: ['privreda'] },
];

export const VENDOR_SUBSCRIPTION_AUDIT_PACKAGE: VendorSubscriptionAuditPackage = {
  events: [
    'Svaka promena plana',
    'Svaki invoice ciklus',
    'Svaki approval',
    'Svaki payment event',
    'Svaki upgrade, downgrade ili rollback',
  ],
  downstreamReferenceRule:
    'Ako postoji vendor ili multi-repo uticaj, evidencija mora sadržati downstream reference ka povezanim repo dokumentima.',
};

export const VENDOR_SUBSCRIPTION_GO_LIVE_SEQUENCE: VendorSubscriptionGoLivePhase[] = [
  { phase: 'pilot-gradjanstvo', description: 'Prvo građanstvo pilot sa ograničenim planovima.' },
  { phase: 'privreda-standard', description: 'Zatim privreda standardni planovi.' },
  { phase: 'enterprise-procurement', description: 'Tek potom enterprise i procurement tokovi za GitHub i Vercel.' },
  { phase: 'post-pilot-alignment', description: 'Nakon pilota uskladiti cene, pragove i upgrade pravila.' },
];

export const VENDOR_SUBSCRIPTION_OPERATIONAL_MODEL = {
  vercel:
    'Vercel ostaje primarni source of truth za deploy i build, posebno za frontend, SSR i runtime surface.',
  github:
    'GitHub Actions ostaje quality gate, audit i governance sloj i ne duplira Vercel deploy ownership.',
};

export const VENDOR_SUBSCRIPTION_PROCUREMENT_FLOWS: VendorSubscriptionProcurementFlow[] = [
  {
    provider: 'GitHub',
    steps: [
      'Podneti GitHub enterprise zahtev.',
      'Potvrditi ownership i billing transfer.',
      'Dokumentovati governance matricu vlasništva, admin backup i security kontakt.',
      'Voditi kvartalni vendor review i godišnji komercijalni review.',
    ],
  },
  {
    provider: 'Vercel',
    steps: [
      'Podneti Vercel sales zahtev.',
      'Potvrditi enterprise billing, SSO, domene i governance readiness.',
      'Dokumentovati ownership, admin backup i security kontakt.',
      'Voditi kvartalni vendor review i godišnji komercijalni review.',
    ],
  },
];

export const VENDOR_SUBSCRIPTION_FORMAL_PACKAGES: VendorSubscriptionFormalPackage[] = [
  {
    id: 'github-gradjanstvo',
    provider: 'GitHub',
    segment: 'gradjanstvo',
    title: 'GitHub Građanstvo',
    summary: 'Individualni GitHub paket za fizička lica, kreatore i freelance korisnike.',
    targetUsers: ['Fizička lica', 'Individualni kreatori', 'Freelance korisnici'],
    billingCadence: ['Mesečno', 'Godišnje'],
    paymentMethods: ['Kartica', 'PayPal', 'GitHub Sponsors gde je primenljivo'],
    offerings: [
      { id: 'gh-individual-basic', name: 'Osnovni individualni paket', summary: 'Osnovni rad sa javnim repozitorijumima i ličnim projektima.' },
      { id: 'gh-copilot', name: 'Paket sa Copilot pristupom', summary: 'Individualni AI asistirani razvoj sa Copilot pravima.' },
      { id: 'gh-portfolio-private', name: 'Portfolio + privatni repo paket', summary: 'Portfolio showcase i privatni repozitorijumi za profesionalni rad.' },
    ],
    benefits: {
      seats: '1 seat',
      privateRepos: 'Dozvoljeni u višem individualnom tier-u',
      copilotAiRights: 'Opcioni Copilot/AI pristup po paketu',
      buildDeployLimits: 'Ograničen CI/CD i repo operativni budžet',
      analyticsObservability: 'Osnovni usage i billing audit trag',
      slaSupport: 'Standardna podrška bez enterprise SLA',
      auditGovernance: 'Osnovni audit i prihvatanje uslova',
      projectsTeamsDomains: 'Lični projekti i portfolio use-case',
    },
    activationRequirements: VENDOR_SUBSCRIPTION_ACTIVATION_RULES,
    blockedScenarios: [
      'Nedostaje identitet ili prihvatanje uslova.',
      'Anti-overage limit nije prihvaćen za add-on aktivacije.',
    ],
    pilotPhase: 'pilot-gradjanstvo',
  },
  {
    id: 'github-privreda',
    provider: 'GitHub',
    segment: 'privreda',
    title: 'GitHub Privreda',
    summary: 'GitHub komercijalni tok za firme, preduzetnike, agencije i timove.',
    targetUsers: ['Firme', 'Preduzetnici', 'Agencije', 'Timovi'],
    billingCadence: ['Mesečno', 'Godišnje', 'Ugovorni enterprise ciklus'],
    paymentMethods: ['Kartica', 'Fakturisanje', 'Ugovorno fakturisanje'],
    offerings: [
      { id: 'gh-team', name: 'Team paket', summary: 'Kolaboracija, privatni repozitorijumi i seat model za timove.' },
      { id: 'gh-compliance', name: 'Compliance paket', summary: 'Prošireni audit, approval trag i governance matrica.' },
      { id: 'gh-enterprise', name: 'Enterprise paket', summary: 'Seat-ovi, audit, governance i procurement readiness za enterprise.' },
    ],
    benefits: {
      seats: 'Više seat-ova po ugovoru i timu',
      privateRepos: 'Privatni repozitorijumi i organizaciona kontrola pristupa',
      copilotAiRights: 'Team i enterprise AI prava sa ownership kontrolom',
      buildDeployLimits: 'Budžetirani Actions i operativni limiti po cost center-u',
      analyticsObservability: 'Audit izveštaji, usage nadzor i approval evidencija',
      slaSupport: 'Business podrška; enterprise SLA uz poseban ugovor',
      auditGovernance: 'Compliance, admin backup i security kontakt matrica',
      projectsTeamsDomains: 'Više timova, organizacija i projekata',
    },
    activationRequirements: VENDOR_SUBSCRIPTION_ACTIVATION_RULES,
    blockedScenarios: [
      'Nedostaju PIB/MB, ugovor ili approval lanac.',
      'Enterprise benefit nije validiran kroz billing i procurement tok.',
    ],
    pilotPhase: 'privreda-standard',
  },
  {
    id: 'vercel-gradjanstvo',
    provider: 'Vercel',
    segment: 'gradjanstvo',
    title: 'Vercel Građanstvo',
    summary: 'Vercel paket za lične sajtove, showcase projekte i freelance isporuku.',
    targetUsers: ['Fizička lica', 'Individualni kreatori', 'Freelance korisnici'],
    billingCadence: ['Mesečno', 'Godišnje'],
    paymentMethods: ['Kartica', 'PayPal gde je dostupno'],
    offerings: [
      { id: 'vercel-personal-showcase', name: 'Lični / showcase paket', summary: 'Hosting i preview workflow za portfolio i lične sajtove.' },
      { id: 'vercel-basic-hosting', name: 'Osnovni hosting paket', summary: 'Osnovni deployment i runtime kapacitet za manje web aplikacije.' },
      { id: 'vercel-preview', name: 'Preview workflow paket', summary: 'Organizovan preview tok za freelance i pro showcase rad.' },
    ],
    benefits: {
      seats: '1 seat ili mali individualni scope',
      privateRepos: 'Povezivanje privatnih repo-a u skladu sa planom',
      copilotAiRights: 'N/A na Vercel sloju; AI prava ostaju u GitHub ili aplikacionom sloju',
      buildDeployLimits: 'Osnovni build/deploy limiti i preview disciplina',
      analyticsObservability: 'Osnovna analitika i deployment health praćenje',
      slaSupport: 'Standardna podrška bez enterprise prioriteta',
      auditGovernance: 'Osnovni deploy audit trag i prihvatanje uslova',
      projectsTeamsDomains: 'Lični projekti i ograničen broj domena',
    },
    activationRequirements: VENDOR_SUBSCRIPTION_ACTIVATION_RULES,
    blockedScenarios: [
      'Preview churn ili build overage nisu pokriveni prihvaćenim limitom.',
      'Nije definisan plan otkazivanja i refunda za individualni model.',
    ],
    pilotPhase: 'pilot-gradjanstvo',
  },
  {
    id: 'vercel-privreda',
    provider: 'Vercel',
    segment: 'privreda',
    title: 'Vercel Privreda',
    summary: 'Vercel komercijalni tok za timski hosting, performance i enterprise governance.',
    targetUsers: ['Firme', 'Preduzetnici', 'Agencije', 'Timovi'],
    billingCadence: ['Mesečno', 'Godišnje', 'Ugovorni enterprise ciklus'],
    paymentMethods: ['Kartica', 'Fakturisanje', 'Ugovorno fakturisanje'],
    offerings: [
      { id: 'vercel-team-hosting', name: 'Team hosting paket', summary: 'Timski hosting, projektni ownership i operativni deployment model.' },
      { id: 'vercel-performance', name: 'Performance / analytics paket', summary: 'Analitika, observability i performance add-on-i.' },
      { id: 'vercel-enterprise', name: 'Enterprise paket', summary: 'SSO, domene, governance i prioritetna podrška kroz sales/procurement tok.' },
    ],
    benefits: {
      seats: 'Više seat-ova i timova po ugovoru',
      privateRepos: 'Povezivanje privatnih organizacionih repo-a',
      copilotAiRights: 'N/A na deploy sloju; kontrola ostaje u GitHub governance tokovima',
      buildDeployLimits: 'Viši build/deploy limiti uz budžetske kontrole i preview disciplinu',
      analyticsObservability: 'Performance, analytics i deployment KPI nadzor',
      slaSupport: 'Business podrška; prioritetna enterprise podrška po ugovoru',
      auditGovernance: 'SSO, ownership, admin backup i governance sloj',
      projectsTeamsDomains: 'Više projekata, timova i domena',
    },
    activationRequirements: VENDOR_SUBSCRIPTION_ACTIVATION_RULES,
    blockedScenarios: [
      'Nedostaje cost center ili sales/procurement potvrda za enterprise paket.',
      'Vercel ownership i governance matrica nisu dokumentovani.',
    ],
    pilotPhase: 'privreda-standard',
  },
];

export function getVendorFormalPackages(provider: VendorSubscriptionProvider): VendorSubscriptionFormalPackage[] {
  return VENDOR_SUBSCRIPTION_FORMAL_PACKAGES.filter((pkg) => pkg.provider === provider);
}
