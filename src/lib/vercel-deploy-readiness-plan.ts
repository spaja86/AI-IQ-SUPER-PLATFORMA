import {
  VERCEL_CANONICAL_APEX_DOMAIN,
  VERCEL_CANONICAL_WILDCARD_DOMAIN,
  VERCEL_FALLBACK_DEPLOY_WORKFLOW_PATH,
  VERCEL_INVALID_DOMAIN_PATTERN,
  VERCEL_PRIMARY_DEPLOY_WORKFLOW,
} from '@/lib/vercel-deploy-governance';
import {
  EXPECTED_VERCEL_BILLING_OWNER,
  EXPECTED_VERCEL_INVOICE_AMOUNT,
  EXPECTED_VERCEL_INVOICE_NUMBER,
} from '@/lib/vercel-billing-governance';

export type VercelDeployReadinessPlanStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface VercelDeployReadinessPlanStep {
  order: number;
  id:
    | 'source-of-truth'
    | 'billing-gate'
    | 'evidence-gate'
    | 'ownership-gate'
    | 'finops-gate'
    | 'deploy-infra-gate'
    | 'domain-gate'
    | 'wawe3-release-gate'
    | 'wawe4-wawe5-promotion';
  title: string;
  status: VercelDeployReadinessPlanStatus;
  blockers: string[];
  watchItems: string[];
  sourceOfTruth: string[];
  nextActions: string[];
}

export interface BuildVercelDeployReadinessPlanOptions {
  primaryEndpoint: string;
  mirroredEndpoint: string;
  phoneVerified: boolean;
  enterpriseRequestReady: boolean;
  enterpriseRequestStarted: boolean;
  enterpriseRequestSubmitted: boolean;
  billingOwnerLocked: boolean;
  billingOwner: string;
  legalIntakeComplete: boolean;
  enterpriseGovernedModel: boolean;
  currentInvoiceNumber: string;
  currentInvoiceAmount: string;
  currentInvoicePaid: boolean;
  correctedInvoiceResolved: boolean;
  invoiceRequested: boolean;
  currentInvoiceEvidenceCaptured: boolean;
  bankStatementCaptured: boolean;
  paymentReferenceCaptured: boolean;
  paymentReferenceClassification: string;
  paymentReferencePublicSafeApproved: boolean;
  publicAnnouncementRedacted: boolean;
  publicAnnouncementPublished: boolean;
  autopayCorporateOnly: boolean;
  financeChannelConfigured: boolean;
  finopsThresholdsEnabled: boolean;
  monthlyReconciliationEnabled: boolean;
  quarterlyVendorReviewEnabled: boolean;
  tokenConfigured: boolean;
  projectIdConfigured: boolean;
  teamOrOrgConfigured: boolean;
  deployHookConfigured: boolean;
}

function resolveStepStatus(
  blockers: string[],
  watchItems: string[] = [],
): VercelDeployReadinessPlanStatus {
  if (blockers.length > 0) return 'BLOCKED';
  if (watchItems.length > 0) return 'WATCH';
  return 'READY';
}

export function buildVercelDeployReadinessPlan(
  options: BuildVercelDeployReadinessPlanOptions,
) {
  const invoiceResolved = options.currentInvoicePaid || options.correctedInvoiceResolved;
  const paymentReferenceClassified = options.paymentReferenceClassification.length > 0;

  const billingBlockers = [
    ...(!options.billingOwnerLocked ? ['Billing owner mora biti zaključan na Digitalna Industrija.'] : []),
    ...(options.billingOwner !== EXPECTED_VERCEL_BILLING_OWNER
      ? [`Billing owner mora biti ${EXPECTED_VERCEL_BILLING_OWNER}.`]
      : []),
    ...(!options.enterpriseGovernedModel ? ['Pretplata mora biti označena kao enterprise-governed model.'] : []),
    ...(options.currentInvoiceNumber !== EXPECTED_VERCEL_INVOICE_NUMBER
      ? [`Invoice broj mora biti ${EXPECTED_VERCEL_INVOICE_NUMBER}.`]
      : []),
    ...(options.currentInvoiceAmount !== EXPECTED_VERCEL_INVOICE_AMOUNT
      ? [`Invoice iznos mora biti ${EXPECTED_VERCEL_INVOICE_AMOUNT} USD.`]
      : []),
    ...(!invoiceResolved ? ['Invoice mora biti plaćen ili correction-resolved.'] : []),
  ];

  const evidenceBlockers = [
    ...(!options.invoiceRequested ? ['Invoice requested / support eskalacija mora biti evidentirana.'] : []),
    ...(!options.currentInvoiceEvidenceCaptured ? ['Invoice/payment evidence paket mora biti sačuvan.'] : []),
    ...(!options.bankStatementCaptured ? ['Bank statement mora biti sačuvan.'] : []),
    ...(!options.paymentReferenceCaptured ? ['Payment reference mora biti sačuvan.'] : []),
    ...(!paymentReferenceClassified ? ['Payment reference mora biti klasifikovan kao public-safe ili internal-only.'] : []),
    ...(options.paymentReferenceClassification === 'public-safe' && !options.paymentReferencePublicSafeApproved
      ? ['Public-safe payment reference zahteva eksplicitno odobrenje.']
      : []),
    ...(!options.publicAnnouncementRedacted ? ['Redigovan javni summary mora biti pripremljen.'] : []),
    ...(!options.publicAnnouncementPublished ? ['Audit-ready javni summary mora biti objavljen nakon validacije.'] : []),
  ];

  const ownershipBlockers = [
    ...(!options.phoneVerified ? ['Telefon vlasnika mora biti verifikovan putem OTP-a.'] : []),
    ...(!options.enterpriseRequestReady ? ['Enterprise zahtev mora biti označen kao ready.'] : []),
    ...(!options.enterpriseRequestStarted ? ['Enterprise zahtev mora biti pokrenut (requested/submitted).'] : []),
    ...(!options.enterpriseRequestSubmitted ? ['Enterprise zahtev mora biti označen kao submitted.'] : []),
    ...(!options.legalIntakeComplete ? ['Legal intake mora biti kompletiran.'] : []),
  ];

  const finopsBlockers = [
    ...(!options.autopayCorporateOnly ? ['Autopay mora biti zaključan na korporativni metod plaćanja.'] : []),
    ...(!options.financeChannelConfigured ? ['Finance channel notifikacije moraju biti konfigurisane.'] : []),
    ...(!options.finopsThresholdsEnabled ? ['FinOps pragovi 50/75/90/100 moraju biti aktivirani.'] : []),
    ...(!options.monthlyReconciliationEnabled ? ['Monthly reconciliation mora biti aktiviran.'] : []),
    ...(!options.quarterlyVendorReviewEnabled ? ['Quarterly vendor review mora biti aktiviran.'] : []),
  ];

  const deployInfraBlockers = [
    ...(!options.tokenConfigured ? ['VERCEL_TOKEN mora biti konfigurisan.'] : []),
    ...(!options.projectIdConfigured ? ['VERCEL_PROJECT_ID mora biti konfigurisan.'] : []),
    ...(!options.teamOrOrgConfigured ? ['VERCEL_TEAM_ID ili VERCEL_ORG_ID mora biti konfigurisan.'] : []),
  ];
  const deployInfraWatchItems = [
    ...(!options.deployHookConfigured
      ? ['VERCEL_DEPLOY_HOOK_AI_IQ nije konfigurisan; manual fallback deploy ostaje nedostupan.']
      : []),
  ];

  const sourceOfTruthStep: VercelDeployReadinessPlanStep = {
    order: 1,
    id: 'source-of-truth',
    title: 'Potvrditi source-of-truth status',
    status: 'READY',
    blockers: [],
    watchItems: [],
    sourceOfTruth: [options.primaryEndpoint, options.mirroredEndpoint],
    nextActions: [
      `Pročitati ${options.primaryEndpoint} i ${options.mirroredEndpoint} pre svakog production pokušaja.`,
      'Koristiti oba endpointa kao kanonski par za deploy/billing governance odluku.',
    ],
  };

  const billingStep: VercelDeployReadinessPlanStep = {
    order: 2,
    id: 'billing-gate',
    title: 'Zatvoriti billing gate',
    status: resolveStepStatus(billingBlockers),
    blockers: billingBlockers,
    watchItems: [],
    sourceOfTruth: [options.primaryEndpoint, options.mirroredEndpoint],
    nextActions: [
      `Potvrditi billing owner ${EXPECTED_VERCEL_BILLING_OWNER}.`,
      `Potvrditi invoice ${EXPECTED_VERCEL_INVOICE_NUMBER} / ${EXPECTED_VERCEL_INVOICE_AMOUNT} USD.`,
      'Obezbediti status paid ili correction-resolved.',
    ],
  };

  const evidenceStep: VercelDeployReadinessPlanStep = {
    order: 3,
    id: 'evidence-gate',
    title: 'Zatvoriti evidence gate',
    status: resolveStepStatus(evidenceBlockers),
    blockers: evidenceBlockers,
    watchItems: [],
    sourceOfTruth: [options.primaryEndpoint, options.mirroredEndpoint],
    nextActions: [
      'Sačuvati invoice/payment dokaz.',
      'Sačuvati bank statement i payment reference sa klasifikacijom.',
      'Objaviti redigovan javni summary tek nakon validacije.',
    ],
  };

  const ownershipStep: VercelDeployReadinessPlanStep = {
    order: 4,
    id: 'ownership-gate',
    title: 'Zatvoriti ownership / enterprise gate',
    status: resolveStepStatus(ownershipBlockers),
    blockers: ownershipBlockers,
    watchItems: [],
    sourceOfTruth: [options.primaryEndpoint, options.mirroredEndpoint],
    nextActions: [
      'Verifikovati telefon vlasnika.',
      'Označiti enterprise zahtev kao ready i submitted.',
      'Kompletirati legal intake.',
    ],
  };

  const finopsStep: VercelDeployReadinessPlanStep = {
    order: 5,
    id: 'finops-gate',
    title: 'Zatvoriti FinOps gate',
    status: resolveStepStatus(finopsBlockers),
    blockers: finopsBlockers,
    watchItems: [],
    sourceOfTruth: [options.primaryEndpoint, options.mirroredEndpoint],
    nextActions: [
      'Ograničiti autopay na korporativni metod.',
      'Konfigurisati finance channel notifikacije.',
      'Aktivirati pragove, monthly reconciliation i quarterly vendor review.',
    ],
  };

  const deployInfraStep: VercelDeployReadinessPlanStep = {
    order: 6,
    id: 'deploy-infra-gate',
    title: 'Zatvoriti deploy infra gate',
    status: resolveStepStatus(deployInfraBlockers, deployInfraWatchItems),
    blockers: deployInfraBlockers,
    watchItems: deployInfraWatchItems,
    sourceOfTruth: [options.primaryEndpoint, options.mirroredEndpoint],
    nextActions: [
      'Konfigurisati VERCEL_TOKEN, VERCEL_PROJECT_ID i VERCEL_TEAM_ID/VERCEL_ORG_ID.',
      `Koristiti ${VERCEL_PRIMARY_DEPLOY_WORKFLOW} kao primarni deploy put.`,
      `Konfigurisati ${VERCEL_FALLBACK_DEPLOY_WORKFLOW_PATH} fallback hook samo kao rezervu.`,
    ],
  };

  const domainStep: VercelDeployReadinessPlanStep = {
    order: 7,
    id: 'domain-gate',
    title: 'Zatvoriti domain gate',
    status: 'WATCH',
    blockers: [],
    watchItems: [
      `Workflow je zaključan na ${VERCEL_CANONICAL_APEX_DOMAIN} + ${VERCEL_CANONICAL_WILDCARD_DOMAIN}.`,
      `Nevažeći pattern ${VERCEL_INVALID_DOMAIN_PATTERN} ostaje zabranjen.`,
      'DNS/TLS aktivacija za apex i wildcard ostaje spoljašnja operativna potvrda.',
    ],
    sourceOfTruth: [
      'docs/EXTRIMLI-START-DEPLOY.md',
      '.github/workflows/extrimli-spaja-deploy.yml',
    ],
    nextActions: [
      `Potvrditi apex domen ${VERCEL_CANONICAL_APEX_DOMAIN}.`,
      `Potvrditi wildcard domen ${VERCEL_CANONICAL_WILDCARD_DOMAIN}.`,
      'Potvrditi aktivan DNS/TLS za oba domena u Vercel projektu.',
    ],
  };

  const wawe3ReleaseStep: VercelDeployReadinessPlanStep = {
    order: 8,
    id: 'wawe3-release-gate',
    title: 'Zatvoriti WAWE 3 / release gate',
    status: 'WATCH',
    blockers: [],
    watchItems: [
      'Workflow već traži downstream_sync_evidence za production deploy.',
      'Workflow već traži downstream_issue_reference u formatu AI-IQ-SUPER-PLATFORMA#EXTRIMLI-START-001 -> IO-OPENUI-AO#<number>.',
      'Human review ostaje obavezan pre WAWE 4 promocije.',
    ],
    sourceOfTruth: [
      'docs/MULTI-REPO-LINKS.md',
      '.github/workflows/extrimli-spaja-deploy.yml',
      'AGENTS.md',
    ],
    nextActions: [
      'Dodati konkretan downstream sync evidence reference.',
      'Dodati konkretan IO-OPENUI-AO issue reference.',
      'Obezbediti human review pre production promocije.',
    ],
  };

  const priorSteps = [
    billingStep,
    evidenceStep,
    ownershipStep,
    finopsStep,
    deployInfraStep,
    domainStep,
    wawe3ReleaseStep,
  ];
  const promotionBlockers = priorSteps
    .filter((step) => step.status === 'BLOCKED')
    .map((step) => `${step.id}: ${step.blockers[0] ?? 'gate-not-closed'}`);
  const promotionWatchItems = priorSteps
    .filter((step) => step.status === 'WATCH')
    .map((step) => `${step.id}: ${step.watchItems[0] ?? 'manual-proof-required'}`);

  const promotionStep: VercelDeployReadinessPlanStep = {
    order: 9,
    id: 'wawe4-wawe5-promotion',
    title: 'Pustiti WAWE 4 promociju i WAWE 5 audit tek nakon zatvaranja svih gate-ova',
    status: resolveStepStatus(promotionBlockers, promotionWatchItems),
    blockers: promotionBlockers,
    watchItems: promotionWatchItems,
    sourceOfTruth: [
      'docs/EXTRIMLI-START-DEPLOY.md',
      '.github/workflows/extrimli-spaja-deploy.yml',
    ],
    nextActions: [
      'Pustiti WAWE 4 tek kada billing, evidence, ownership, FinOps, infra, domain i downstream gates više nemaju blokere.',
      'Zatvoriti WAWE 5 post-release audit odmah nakon uspešne produkcione promocije.',
    ],
  };

  const steps = [
    sourceOfTruthStep,
    billingStep,
    evidenceStep,
    ownershipStep,
    finopsStep,
    deployInfraStep,
    domainStep,
    wawe3ReleaseStep,
    promotionStep,
  ];

  return {
    summary: {
      ready: steps.filter((step) => step.status === 'READY').length,
      watch: steps.filter((step) => step.status === 'WATCH').length,
      blocked: steps.filter((step) => step.status === 'BLOCKED').length,
      total: steps.length,
      productionPromotionReady: steps.every((step) => step.status === 'READY'),
      nextBlockingGate:
        steps.find((step) => step.status === 'BLOCKED')?.id
        ?? steps.find((step) => step.status === 'WATCH')?.id
        ?? null,
    },
    steps,
  };
}
