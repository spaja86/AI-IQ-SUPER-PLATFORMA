/**
 * GET /api/vercel-status
 *
 * Živi status Vercel priključenosti:
 *  - Da li su VERCEL_TOKEN i VERCEL_PROJECT_ID postavljeni
 *  - Da li KV store odgovara
 *  - Status poslednjeg deploymenta (ako je VERCEL_DEPLOYMENT_ID dostupan)
 *  - Checklist konfiguracije
 *
 * Autofinish — VERCEL PRIKLJUČENJE
 */

import { NextResponse } from 'next/server';
import { APP_VERSION, OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from '@/lib/constants';
import { getVercelHealthCheck, probeVercelDeployment } from '@/lib/deploy-diagnostics';
import { FUNNEL_EVENTS } from '@/lib/analytics-events';
import { getOwnerPhoneVerifikacijaStatus } from '@/lib/owner-phone-auth';
import {
  VERCEL_STATUS_ROUTE_PATH,
  buildVercelDeployGovernanceSummary,
} from '@/lib/vercel-deploy-governance';
import { resolveVercelBillingGovernanceEnv } from '@/lib/vercel-governance-env';
import {
  EXPECTED_VERCEL_BILLING_OWNER,
  EXPECTED_VERCEL_INVOICE_AMOUNT,
  EXPECTED_VERCEL_INVOICE_NUMBER,
  buildVercelPublicAnnouncementState,
  isVercelInvoiceResolved,
  normalizePaymentReferenceClassification,
} from '@/lib/vercel-billing-governance';
export {
  KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY,
  KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY,
  KV_VERCEL_BILLING_OWNER_KEY,
  KV_VERCEL_BILLING_OWNER_LOCKED_KEY,
  KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY,
  KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY,
  KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY,
  KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY,
  KV_VERCEL_CURRENT_INVOICE_PAID_KEY,
  KV_VERCEL_ENTERPRISE_GOVERNED_MODEL_KEY,
  KV_VERCEL_FINANCE_CHANNEL_CONFIGURED_KEY,
  KV_VERCEL_FINOPS_THRESHOLDS_ENABLED_KEY,
  KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY,
  KV_VERCEL_INVOICE_REQUESTED_KEY,
  KV_VERCEL_LEGAL_INTAKE_COMPLETE_KEY,
  KV_VERCEL_MONTHLY_RECONCILIATION_ENABLED_KEY,
  KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY,
  KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY,
  KV_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED_KEY,
  KV_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED_KEY,
  KV_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED_KEY,
  KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY,
} from '@/lib/vercel-governance-keys';

export const dynamic = 'force-dynamic';

export function resolveOwnerPhone(env: Record<string, string | undefined>): string {
  const configuredPhone = env[OWNER_PHONE_NUMBER_ENV_KEY]?.trim();
  return configuredPhone && configuredPhone.length > 0 ? configuredPhone : OWNER_PHONE_DEFAULT;
}

export function buildVercelPretplataStatus(
  env: Record<string, string | undefined>,
  {
    tokenKonfigurisan,
    projectIdKonfigurisan,
    phoneVerified,
  }: {
    tokenKonfigurisan: boolean;
    projectIdKonfigurisan: boolean;
    phoneVerified: boolean;
  },
) {
  const boolFlag = (value: string | undefined): boolean => /^(1|true|yes)$/i.test(value ?? '');
  const enterpriseRequestReady = /^(1|true|yes)$/i.test(env.SPAJA_VERCEL_ENTERPRISE_REQUEST_READY ?? '');
  const enterpriseRequestRequested = /^(1|true|yes)$/i.test(env.SPAJA_VERCEL_ENTERPRISE_REQUESTED ?? '');
  const enterpriseRequestSubmitted = /^(1|true|yes)$/i.test(env.SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED ?? '');
  const enterpriseRequestStarted = enterpriseRequestRequested || enterpriseRequestSubmitted;
  const expectedInvoiceNumber = EXPECTED_VERCEL_INVOICE_NUMBER;
  const expectedInvoiceAmount = EXPECTED_VERCEL_INVOICE_AMOUNT;
  const expectedBillingOwner = EXPECTED_VERCEL_BILLING_OWNER;
  const currentInvoiceNumber = (env.SPAJA_VERCEL_CURRENT_INVOICE_NUMBER ?? '').trim();
  const currentInvoiceAmount = (env.SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT ?? '').trim();
  const billingOwner = (env.SPAJA_VERCEL_BILLING_OWNER ?? '').trim();

  const billingOwnerLocked = boolFlag(env.SPAJA_VERCEL_BILLING_OWNER_LOCKED);
  const legalIntakeComplete = boolFlag(env.SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE);
  const enterpriseGovernedModel = boolFlag(env.SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL);
  const currentInvoicePaid = boolFlag(env.SPAJA_VERCEL_CURRENT_INVOICE_PAID);
  const currentInvoiceEvidenceCaptured = boolFlag(env.SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED);
  const invoiceCorrectionRequested = boolFlag(env.SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED);
  const correctedInvoiceResolved = boolFlag(env.SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED);
  const invoiceRequested = boolFlag(env.SPAJA_VERCEL_INVOICE_REQUESTED);
  const bankStatementCaptured = boolFlag(env.SPAJA_VERCEL_BANK_STATEMENT_CAPTURED);
  const paymentReferenceCaptured = boolFlag(env.SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED);
  const paymentReferenceClassification = normalizePaymentReferenceClassification(
    env.SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION,
  );
  const paymentReferencePublicSafeApproved = boolFlag(env.SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED);
  const publicAnnouncementRedacted = boolFlag(env.SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED);
  const publicAnnouncementPublished = boolFlag(env.SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED);
  const invoiceMatchesExpected =
    currentInvoiceNumber === expectedInvoiceNumber
    && currentInvoiceAmount === expectedInvoiceAmount;
  const invoiceResolutionSatisfied = isVercelInvoiceResolved({
    currentInvoiceNumber,
    currentInvoiceAmount,
    currentInvoicePaid,
    invoiceCorrectionRequested,
    correctedInvoiceResolved,
  });
  const publicAnnouncement = buildVercelPublicAnnouncementState({
    invoiceRequested,
    currentInvoiceNumber,
    currentInvoiceAmount,
    currentInvoicePaid,
    invoiceCorrectionRequested,
    correctedInvoiceResolved,
    currentInvoiceEvidenceCaptured,
    bankStatementCaptured,
    paymentReferenceCaptured,
    paymentReferenceClassification,
    paymentReferencePublicSafeApproved,
    publicAnnouncementRedacted,
    publicAnnouncementPublished,
  });
  const autopayCorporateOnly = boolFlag(env.SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY);
  const financeChannelConfigured = boolFlag(env.SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED);
  const finopsThresholdsEnabled = boolFlag(env.SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED);
  const monthlyReconciliationEnabled = boolFlag(env.SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED);
  const quarterlyVendorReviewEnabled = boolFlag(env.SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED);
  const teamConfigured =
    Boolean(env.VERCEL_TEAM_ID?.trim())
    || Boolean(env.VERCEL_ORG_ID?.trim());
  const blokatori = [
    ...(!tokenKonfigurisan ? ['Nedostaje VERCEL_TOKEN.'] : []),
    ...(!projectIdKonfigurisan ? ['Nedostaje VERCEL_PROJECT_ID.'] : []),
    ...(!teamConfigured ? ['Nedostaje VERCEL_TEAM_ID ili VERCEL_ORG_ID.'] : []),
    ...(!phoneVerified ? ['Telefon vlasnika nije verifikovan (OTP).'] : []),
    ...(!enterpriseRequestReady ? ['Enterprise zahtev nije označen kao spreman (set-ready).'] : []),
    ...(!enterpriseRequestStarted ? ['Enterprise zahtev nije pokrenut (REQUESTED/SUBMITTED).'] : []),
    ...(!enterpriseRequestSubmitted ? ['Enterprise zahtev nije označen kao poslat (set-submitted).'] : []),
    ...(!billingOwnerLocked ? ['Billing owner nije zaključan na Digitalna Industrija.'] : []),
    ...(billingOwner !== expectedBillingOwner ? [`Billing owner mora biti: ${expectedBillingOwner}.`] : []),
    ...(!legalIntakeComplete ? ['Privredni intake podaci (PIB/MB, potpisnik, PDV/eFaktura) nisu kompletni.'] : []),
    ...(!enterpriseGovernedModel ? ['Pretplata nije označena kao privreda / enterprise-governed model.'] : []),
    ...(currentInvoiceNumber !== expectedInvoiceNumber ? [`Trenutni invoice mora biti ${expectedInvoiceNumber}.`] : []),
    ...(currentInvoiceAmount !== expectedInvoiceAmount ? [`Trenutni invoice iznos mora biti ${expectedInvoiceAmount}.`] : []),
    ...(!invoiceResolutionSatisfied
      ? ['Trenutna faktura nije rešena (pay ili support correction/re-issue).']
      : []),
    ...(!currentInvoiceEvidenceCaptured && invoiceMatchesExpected && (currentInvoicePaid || correctedInvoiceResolved)
      ? ['Nedostaje dokaz o fakturi/plaćanju (PDF, potvrda, timestamp, odgovorno lice).']
      : []),
    ...(!autopayCorporateOnly ? ['Autopay nije ograničen na korporativni metod plaćanja Digitalna Industrija.'] : []),
    ...(!financeChannelConfigured ? ['Invoice delivery/notifikacije nisu postavljene na finansijski kanal Digitalna Industrija.'] : []),
    ...(!finopsThresholdsEnabled ? ['FinOps pragovi 50/75/90/100 nisu aktivirani.'] : []),
    ...(!monthlyReconciliationEnabled ? ['Mesečni billing reconciliation nije aktiviran.'] : []),
    ...(!quarterlyVendorReviewEnabled ? ['Kvartalni vendor review za Vercel nije aktiviran.'] : []),
  ];

  return {
    status: blokatori.length === 0 ? 'service-active' : 'blocked-until-validated',
    blokatori,
    ownership: {
      phoneVerified,
      enterpriseRequestReady,
      enterpriseRequestRequested,
      enterpriseRequestSubmitted,
    },
    billingGovernance: {
      expectedBillingOwner,
      billingOwner,
      billingOwnerLocked,
      legalIntakeComplete,
      enterpriseGovernedModel,
      currentInvoice: {
        number: currentInvoiceNumber,
        amountUsd: currentInvoiceAmount,
        requested: invoiceRequested,
        paid: currentInvoicePaid,
        correctionRequested: invoiceCorrectionRequested,
        correctedInvoiceResolved,
        evidenceCaptured: currentInvoiceEvidenceCaptured,
        bankStatementCaptured,
        paymentReferenceCaptured,
        paymentReferenceClassification: publicAnnouncement.paymentReferenceClassification || 'unclassified',
        paymentReferencePublicSafeApproved,
      },
      publicAnnouncement: {
        redacted: publicAnnouncementRedacted,
        published: publicAnnouncementPublished,
        status: publicAnnouncement.status,
        blockers: publicAnnouncement.blockers,
      },
      futurePayments: {
        autopayCorporateOnly,
        financeChannelConfigured,
        finopsThresholdsEnabled,
        monthlyReconciliationEnabled,
        quarterlyVendorReviewEnabled,
      },
    },
    sledeciKoraci: [
      'POST /api/owner-phone-auth/request-otp',
      'POST /api/owner-phone-auth/verify-otp',
      'POST /api/owner/vercel-ownership { "akcija": "set-ready" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-submitted" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-billing-owner-locked" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-legal-intake-complete" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-enterprise-governed-model" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-invoice-requested" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-current-invoice-paid" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-corrected-invoice-resolved" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-current-invoice-evidence-captured" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-bank-statement-captured" }',
      'POST /api/owner/vercel-ownership { "akcija": "approve-payment-reference-public-safe" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-payment-reference-public-safe" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-payment-reference-internal-only" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-public-announcement-redacted" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-public-announcement-published" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-invoice-correction-requested" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-autopay-corporate-only" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-finance-channel-configured" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-finops-thresholds-enabled" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-monthly-reconciliation-enabled" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-quarterly-vendor-review-enabled" }',
    ],
  };
}

export async function GET() {
  const health = await getVercelHealthCheck();
  const env = await resolveVercelBillingGovernanceEnv(process.env as Record<string, string | undefined>);
  const phone = resolveOwnerPhone(env);
  const phoneVerified = getOwnerPhoneVerifikacijaStatus(phone) === 'verifikovan';
  const pretplataVercel = buildVercelPretplataStatus(env, {
    tokenKonfigurisan: health.tokenKonfigurisan,
    projectIdKonfigurisan: health.projectIdKonfigurisan,
    phoneVerified,
  });

  // Pokušaj dohvatiti deployment ID iz Vercel env (automatski postavljeno)
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA;
  const vercelProbe = deploymentId
    ? await probeVercelDeployment(deploymentId)
    : null;

  const checklist = {
    tokenKonfigurisan: {
      status: health.tokenKonfigurisan,
      opis: 'VERCEL_TOKEN env varijabla',
      uputstvo: 'Vercel → Account Settings → Tokens → Create Token',
    },
    projectIdKonfigurisan: {
      status: health.projectIdKonfigurisan,
      opis: 'VERCEL_PROJECT_ID env varijabla',
      uputstvo: 'Vercel → Project → Settings → General → Project ID',
    },
    kvKonfigurisan: {
      status: health.kvKonfigurisan,
      opis: 'Vercel KV store (KV_REST_API_URL + KV_REST_API_TOKEN)',
      uputstvo: 'Vercel → Storage → Create KV Store → Connect to Project',
    },
    kvOdgovara: {
      status: health.kvOdgovara,
      opis: 'KV store je dostupan i odgovara na ping',
      uputstvo: health.kvKonfigurisan ? 'Proverite KV store u Vercel dashboard-u' : 'Prvo konfigurisati KV store',
    },
    deployHookKonfigurisan: {
      status: Boolean(process.env.VERCEL_DEPLOY_HOOK_AI_IQ),
      opis: 'VERCEL_DEPLOY_HOOK_AI_IQ (za ručni deploy trigger)',
      uputstvo: 'Vercel → Project → Settings → Git → Deploy Hooks → Create Hook',
    },
  };

  const ukupnoKonfigurisan = Object.values(checklist).filter((c) => c.status).length;
  const ukupnoProvera = Object.keys(checklist).length;
  const teamOrOrgConfigured =
    Boolean(env.VERCEL_TEAM_ID?.trim())
    || Boolean(env.VERCEL_ORG_ID?.trim());
  const deployGovernance = buildVercelDeployGovernanceSummary({
    sourceOfTruthPath: VERCEL_STATUS_ROUTE_PATH,
    blockers: pretplataVercel.blokatori,
    tokenConfigured: health.tokenKonfigurisan,
    projectIdConfigured: health.projectIdKonfigurisan,
    teamOrOrgConfigured,
    deployHookConfigured: checklist.deployHookKonfigurisan.status,
  });

  // Analytics event (pasivno — ne blokira odgovor)
  const eventTip = health.vercelPriključeno
    ? FUNNEL_EVENTS.VERCEL_CONNECTED
    : FUNNEL_EVENTS.ERROR_ENCOUNTERED;

  return NextResponse.json({
    status: health.vercelPriključeno ? 'priključeno' : 'nije-priključeno',
    vercelPriključeno: health.vercelPriključeno,
    verzija: APP_VERSION,
    checklist,
    progres: {
      konfigurisan: ukupnoKonfigurisan,
      ukupno: ukupnoProvera,
      procenat: Math.round((ukupnoKonfigurisan / ukupnoProvera) * 100),
    },
    deployment: vercelProbe
      ? {
          deploymentId,
          status: vercelProbe.status,
          url: vercelProbe.url,
          available: vercelProbe.available,
          signal: vercelProbe.signal,
        }
      : null,
    pretplataVercel,
    deployGovernance,
    uputstvo: {
      korak1: 'Kreirati Personal Access Token na Vercel → Account Settings → Tokens',
      korak2: 'Dodati VERCEL_TOKEN u Vercel → Project → Settings → Environment Variables',
      korak3: 'Dodati VERCEL_PROJECT_ID iz Vercel → Project → Settings → General',
      korak4: 'Kreirati KV Store: Vercel → Storage → Create KV Store',
      korak5: 'Kreirati Deploy Hook: Vercel → Project → Settings → Git → Deploy Hooks',
    },
    analyticsEvent: eventTip,
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-App-Version': APP_VERSION,
    },
  });
}
