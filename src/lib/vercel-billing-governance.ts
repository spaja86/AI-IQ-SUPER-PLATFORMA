import {
  DEVELOPER_CREATE_REPO_WIDE_BOUNDED_VOCABULARY_PHRASE,
  DEVELOPER_CREATE_SARADNJA_READY_AUTOMATIC_SUBSCRIPTION_GATES,
  DEVELOPER_CREATE_SARADNJA_READY_COST_TO_ZERO_FALLBACK_PLAN,
  DEVELOPER_CREATE_SARADNJA_READY_EXTRONDOL_NEGOTIATION_QUESTIONS,
  DEVELOPER_CREATE_SARADNJA_READY_EXTREM_COST_HOTSPOTS,
  DEVELOPER_CREATE_SARADNJA_READY_FINAL_AUDIT_PACKAGE_CONTENTS,
  DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK,
  DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_SCOPE_LOCK,
  DEVELOPER_CREATE_SARADNJA_READY_SCOPE_LOCK,
  DEVELOPER_CREATE_SARADNJA_READY_VERCEL_COST_TARGETS,
  DEVELOPER_CREATE_SARADNJA_READY_VERCEL_GOVERNANCE_BLOCKERS,
} from './extrimli/developer-create-vrh-ekviladenta-contract';

export const EXPECTED_VERCEL_BILLING_OWNER = 'Digitalna Industrija — Kompanija SPAJA';
export const EXPECTED_VERCEL_INVOICE_NUMBER = '5JJYX4KN-0015';
export const EXPECTED_VERCEL_INVOICE_AMOUNT = '385.52';
export const PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE = 'public-safe';
export const PAYMENT_REFERENCE_CLASSIFICATION_INTERNAL_ONLY = 'internal-only';

export interface VercelPublicAnnouncementInput {
  invoiceRequested: boolean;
  currentInvoiceNumber: string;
  currentInvoiceAmount: string;
  currentInvoicePaid: boolean;
  invoiceCorrectionRequested: boolean;
  correctedInvoiceResolved: boolean;
  currentInvoiceEvidenceCaptured: boolean;
  bankStatementCaptured: boolean;
  paymentReferenceCaptured: boolean;
  paymentReferenceClassification: string;
  paymentReferencePublicSafeApproved: boolean;
  publicAnnouncementRedacted: boolean;
  publicAnnouncementPublished: boolean;
}

export interface VercelCostGovernancePackage {
  canonicalTopicLock: typeof DEVELOPER_CREATE_SARADNJA_READY_SCOPE_LOCK;
  boundedBusinessPackage: typeof DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_SCOPE_LOCK;
  pretplataExtension: typeof DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK;
  boundedVocabularyPhrase: typeof DEVELOPER_CREATE_REPO_WIDE_BOUNDED_VOCABULARY_PHRASE;
  governanceBlockers: typeof DEVELOPER_CREATE_SARADNJA_READY_VERCEL_GOVERNANCE_BLOCKERS;
  dualCostTargets: typeof DEVELOPER_CREATE_SARADNJA_READY_VERCEL_COST_TARGETS;
  extremCostHotspots: typeof DEVELOPER_CREATE_SARADNJA_READY_EXTREM_COST_HOTSPOTS;
  extrondolNegotiationQuestions: typeof DEVELOPER_CREATE_SARADNJA_READY_EXTRONDOL_NEGOTIATION_QUESTIONS;
  costToZeroFallbackPlan: typeof DEVELOPER_CREATE_SARADNJA_READY_COST_TO_ZERO_FALLBACK_PLAN;
  automaticSubscriptionGates: typeof DEVELOPER_CREATE_SARADNJA_READY_AUTOMATIC_SUBSCRIPTION_GATES;
  finalAuditPackageContents: typeof DEVELOPER_CREATE_SARADNJA_READY_FINAL_AUDIT_PACKAGE_CONTENTS;
}

export interface VercelCostGovernanceGuidance {
  reviewHotspots: string;
  prepareNegotiationPackage: string;
  activateAutopayOnlyAfterGates: string;
}

export function normalizePaymentReferenceClassification(value: string | null | undefined): string {
  const normalized = (value ?? '').trim().toLowerCase();
  return [
    PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE,
    PAYMENT_REFERENCE_CLASSIFICATION_INTERNAL_ONLY,
  ].includes(normalized)
    ? normalized
    : '';
}

export function isVercelInvoiceResolved(flags: {
  currentInvoiceNumber: string;
  currentInvoiceAmount: string;
  currentInvoicePaid: boolean;
  invoiceCorrectionRequested: boolean;
  correctedInvoiceResolved: boolean;
}): boolean {
  const invoiceMatchesExpected =
    flags.currentInvoiceNumber === EXPECTED_VERCEL_INVOICE_NUMBER
    && flags.currentInvoiceAmount === EXPECTED_VERCEL_INVOICE_AMOUNT;
  return invoiceMatchesExpected
    && (flags.currentInvoicePaid || (flags.invoiceCorrectionRequested && flags.correctedInvoiceResolved));
}

export function buildVercelPublicAnnouncementState(flags: VercelPublicAnnouncementInput) {
  const paymentReferenceClassification = normalizePaymentReferenceClassification(
    flags.paymentReferenceClassification,
  );
  const invoiceResolved = isVercelInvoiceResolved(flags);
  const invoiceWorkflowDocumented = flags.invoiceRequested;
  const publicSafeClassificationApproved =
    paymentReferenceClassification !== PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE
    || flags.paymentReferencePublicSafeApproved;
  const readyToPublish = invoiceWorkflowDocumented
    && invoiceResolved
    && flags.currentInvoiceEvidenceCaptured
    && flags.bankStatementCaptured
    && flags.paymentReferenceCaptured
    && paymentReferenceClassification.length > 0
    && publicSafeClassificationApproved
    && flags.publicAnnouncementRedacted;
  const invalidPublishedState = flags.publicAnnouncementPublished && !readyToPublish;
  const blockers = [
    ...(!invoiceWorkflowDocumented ? ['Zahtev za fakturisanje / support eskalacija nije dokumentovana.'] : []),
    ...(!invoiceResolved
      ? ['Javno ozvaničenje je blokirano dok faktura nije plaćena ili korekcija nije rešena.']
      : []),
    ...(!flags.currentInvoiceEvidenceCaptured && invoiceResolved && invoiceWorkflowDocumented
      ? ['Nedostaje payment confirmation paket.']
      : []),
    ...(!flags.bankStatementCaptured && invoiceResolved && invoiceWorkflowDocumented
      ? ['Nedostaje izvod platnog računa.']
      : []),
    ...(!flags.paymentReferenceCaptured && invoiceResolved && invoiceWorkflowDocumented
      ? ['Nedostaje barkod / payment reference.']
      : []),
    ...(flags.paymentReferenceCaptured && invoiceResolved && invoiceWorkflowDocumented && paymentReferenceClassification.length === 0
      ? ['Barkod / payment reference mora biti klasifikovan kao public-safe ili internal-only.']
      : []),
    ...(flags.paymentReferenceCaptured
      && invoiceResolved
      && invoiceWorkflowDocumented
      && paymentReferenceClassification === PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE
      && !flags.paymentReferencePublicSafeApproved
      ? ['Public-safe klasifikacija barkoda / payment reference zahteva posebno odobrenje.']
      : []),
    ...(!flags.publicAnnouncementRedacted && invoiceResolved && invoiceWorkflowDocumented
      ? ['Javni sažetak mora biti redigovan.']
      : []),
    ...(!flags.publicAnnouncementPublished && readyToPublish
      ? ['Audit-ready javni sažetak još nije objavljen.']
      : []),
    ...(invalidPublishedState
      ? ['Objavljeni javni sažetak je nevažeći dok svi billing i privacy preduslovi ponovo nisu ispunjeni.']
      : []),
  ];

  return {
    paymentReferenceClassification,
    invoiceResolved,
    readyToPublish,
    status: flags.publicAnnouncementPublished
      ? readyToPublish
        ? 'published'
        : 'published-invalid'
      : readyToPublish
        ? 'ready-to-publish'
        : 'not-ready',
    blockers,
  };
}

export function buildVercelCostGovernancePackage(): VercelCostGovernancePackage {
  return {
    canonicalTopicLock: DEVELOPER_CREATE_SARADNJA_READY_SCOPE_LOCK,
    boundedBusinessPackage: DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_SCOPE_LOCK,
    pretplataExtension: DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK,
    boundedVocabularyPhrase: DEVELOPER_CREATE_REPO_WIDE_BOUNDED_VOCABULARY_PHRASE,
    governanceBlockers: [...DEVELOPER_CREATE_SARADNJA_READY_VERCEL_GOVERNANCE_BLOCKERS],
    dualCostTargets: { ...DEVELOPER_CREATE_SARADNJA_READY_VERCEL_COST_TARGETS },
    extremCostHotspots: [...DEVELOPER_CREATE_SARADNJA_READY_EXTREM_COST_HOTSPOTS],
    extrondolNegotiationQuestions: [...DEVELOPER_CREATE_SARADNJA_READY_EXTRONDOL_NEGOTIATION_QUESTIONS],
    costToZeroFallbackPlan: [...DEVELOPER_CREATE_SARADNJA_READY_COST_TO_ZERO_FALLBACK_PLAN],
    automaticSubscriptionGates: {
      activationCriteria: [...DEVELOPER_CREATE_SARADNJA_READY_AUTOMATIC_SUBSCRIPTION_GATES.activationCriteria],
      mandatoryWaveOrder: [...DEVELOPER_CREATE_SARADNJA_READY_AUTOMATIC_SUBSCRIPTION_GATES.mandatoryWaveOrder],
      noSkippedWavePhases: DEVELOPER_CREATE_SARADNJA_READY_AUTOMATIC_SUBSCRIPTION_GATES.noSkippedWavePhases,
    },
    finalAuditPackageContents: [...DEVELOPER_CREATE_SARADNJA_READY_FINAL_AUDIT_PACKAGE_CONTENTS],
  };
}

export function buildVercelCostGovernanceGuidance(): VercelCostGovernanceGuidance {
  return {
    reviewHotspots: 'Pregledati EXTREM cost hotspotove kroz billingGovernance.costGovernancePackage.',
    prepareNegotiationPackage:
      'Pripremiti EXTRONDOL pregovarački paket kroz billingGovernance.costGovernancePackage.',
    activateAutopayOnlyAfterGates:
      'Automatsku pretplatu aktivirati tek nakon potvrđenih gate-ova iz billingGovernance.costGovernancePackage.',
  };
}
