import { kvGet } from '@/lib/kv-client';
import {
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
import { normalizePaymentReferenceClassification } from '@/lib/vercel-billing-governance';

function mergeBoolEnv(
  env: Record<string, string | undefined>,
  envKey: string,
  kvValue: boolean | null,
): string | undefined {
  const rawEnv = env[envKey];
  if (/^(1|true|yes)$/i.test(rawEnv ?? '')) return 'true';
  if (/^(0|false|no)$/i.test(rawEnv ?? '')) return 'false';
  if (kvValue === true) return 'true';
  if (kvValue === false) return 'false';
  return rawEnv;
}

export async function resolveVercelBillingGovernanceEnv(
  env: Record<string, string | undefined>,
): Promise<Record<string, string | undefined>> {
  try {
    const normalizedEnvPaymentReferenceClassification = normalizePaymentReferenceClassification(
      env.SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION,
    );
    const [
      kvBillingOwner,
      kvBillingOwnerLocked,
      kvLegalIntakeComplete,
      kvEnterpriseGovernedModel,
      kvCurrentInvoiceNumber,
      kvCurrentInvoiceAmount,
      kvCurrentInvoicePaid,
      kvCurrentInvoiceEvidenceCaptured,
      kvInvoiceCorrectionRequested,
      kvCorrectedInvoiceResolved,
      kvInvoiceRequested,
      kvBankStatementCaptured,
      kvPaymentReferenceCaptured,
      kvPaymentReferenceClassification,
      kvPaymentReferencePublicSafeApproved,
      kvPublicAnnouncementRedacted,
      kvPublicAnnouncementPublished,
      kvAutopayCorporateOnly,
      kvFinanceChannelConfigured,
      kvFinopsThresholdsEnabled,
      kvMonthlyReconciliationEnabled,
      kvQuarterlyVendorReviewEnabled,
    ] = await Promise.all([
      kvGet<string>(KV_VERCEL_BILLING_OWNER_KEY),
      kvGet<boolean>(KV_VERCEL_BILLING_OWNER_LOCKED_KEY),
      kvGet<boolean>(KV_VERCEL_LEGAL_INTAKE_COMPLETE_KEY),
      kvGet<boolean>(KV_VERCEL_ENTERPRISE_GOVERNED_MODEL_KEY),
      kvGet<string>(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY),
      kvGet<string>(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY),
      kvGet<boolean>(KV_VERCEL_CURRENT_INVOICE_PAID_KEY),
      kvGet<boolean>(KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY),
      kvGet<boolean>(KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY),
      kvGet<boolean>(KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY),
      kvGet<boolean>(KV_VERCEL_INVOICE_REQUESTED_KEY),
      kvGet<boolean>(KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY),
      kvGet<boolean>(KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY),
      kvGet<string>(KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY),
      kvGet<boolean>(KV_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED_KEY),
      kvGet<boolean>(KV_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED_KEY),
      kvGet<boolean>(KV_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED_KEY),
      kvGet<boolean>(KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY),
      kvGet<boolean>(KV_VERCEL_FINANCE_CHANNEL_CONFIGURED_KEY),
      kvGet<boolean>(KV_VERCEL_FINOPS_THRESHOLDS_ENABLED_KEY),
      kvGet<boolean>(KV_VERCEL_MONTHLY_RECONCILIATION_ENABLED_KEY),
      kvGet<boolean>(KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY),
    ]);

    const hasEnvPaymentReferenceClassification =
      Object.prototype.hasOwnProperty.call(env, 'SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION');

    return {
      ...env,
      SPAJA_VERCEL_BILLING_OWNER: env.SPAJA_VERCEL_BILLING_OWNER ?? kvBillingOwner ?? undefined,
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: mergeBoolEnv(env, 'SPAJA_VERCEL_BILLING_OWNER_LOCKED', kvBillingOwnerLocked),
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: mergeBoolEnv(env, 'SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE', kvLegalIntakeComplete),
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: mergeBoolEnv(env, 'SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL', kvEnterpriseGovernedModel),
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: env.SPAJA_VERCEL_CURRENT_INVOICE_NUMBER ?? kvCurrentInvoiceNumber ?? undefined,
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: env.SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT ?? kvCurrentInvoiceAmount ?? undefined,
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: mergeBoolEnv(env, 'SPAJA_VERCEL_CURRENT_INVOICE_PAID', kvCurrentInvoicePaid),
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: mergeBoolEnv(env, 'SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED', kvCurrentInvoiceEvidenceCaptured),
      SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED: mergeBoolEnv(env, 'SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED', kvInvoiceCorrectionRequested),
      SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED: mergeBoolEnv(env, 'SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED', kvCorrectedInvoiceResolved),
      SPAJA_VERCEL_INVOICE_REQUESTED: mergeBoolEnv(env, 'SPAJA_VERCEL_INVOICE_REQUESTED', kvInvoiceRequested),
      SPAJA_VERCEL_BANK_STATEMENT_CAPTURED: mergeBoolEnv(env, 'SPAJA_VERCEL_BANK_STATEMENT_CAPTURED', kvBankStatementCaptured),
      SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED: mergeBoolEnv(env, 'SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED', kvPaymentReferenceCaptured),
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION:
        hasEnvPaymentReferenceClassification
          ? env.SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION === ''
            ? undefined
            : normalizedEnvPaymentReferenceClassification
              || normalizePaymentReferenceClassification(kvPaymentReferenceClassification ?? undefined)
              || undefined
          : normalizePaymentReferenceClassification(kvPaymentReferenceClassification ?? undefined) || undefined,
      SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED: mergeBoolEnv(
        env,
        'SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED',
        kvPaymentReferencePublicSafeApproved,
      ),
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: mergeBoolEnv(env, 'SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED', kvPublicAnnouncementRedacted),
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED: mergeBoolEnv(env, 'SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED', kvPublicAnnouncementPublished),
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: mergeBoolEnv(env, 'SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY', kvAutopayCorporateOnly),
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: mergeBoolEnv(env, 'SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED', kvFinanceChannelConfigured),
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: mergeBoolEnv(env, 'SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED', kvFinopsThresholdsEnabled),
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: mergeBoolEnv(env, 'SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED', kvMonthlyReconciliationEnabled),
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: mergeBoolEnv(env, 'SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED', kvQuarterlyVendorReviewEnabled),
    };
  } catch (error) {
    console.warn('[vercel-governance-env] KV governance merge failed; falling back to env-only status.', error);
    return env;
  }
}

export function getVercelDeployInfrastructureState(
  env: Record<string, string | undefined>,
  rawInfraEnv?: Record<string, string | undefined>,
) {
  const sourceEnv = rawInfraEnv ?? env;
  return {
    tokenConfigured: Boolean(sourceEnv.VERCEL_TOKEN?.trim()),
    projectIdConfigured: Boolean(sourceEnv.VERCEL_PROJECT_ID?.trim()),
    teamOrOrgConfigured: Boolean(sourceEnv.VERCEL_TEAM_ID?.trim()) || Boolean(sourceEnv.VERCEL_ORG_ID?.trim()),
    deployHookConfigured: Boolean(sourceEnv.VERCEL_DEPLOY_HOOK_AI_IQ?.trim()),
  };
}
