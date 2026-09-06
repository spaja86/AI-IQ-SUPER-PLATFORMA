import assert from 'node:assert';
import {
  GET,
  KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY,
  KV_VERCEL_BILLING_OWNER_KEY,
  KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY,
  KV_VERCEL_BILLING_OWNER_LOCKED_KEY,
  KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY,
  KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY,
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
  KV_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED_KEY,
  KV_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED_KEY,
  KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY,
  buildVercelPretplataStatus,
  resolveOwnerPhone,
} from '../../app/api/vercel-status/route';
import { OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from '../../lib/constants';
import { kvSet } from '../../lib/kv-client';

async function testRouteResponse() {
  const response = await GET();
  assert.strictEqual(response.status, 200);
  const json = (await response.json()) as {
    status: string;
    pretplataVercel?: { status: string; blokatori: string[] };
  };
  assert.ok(typeof json.status === 'string' && json.status.length > 0);
  assert.ok(json.pretplataVercel, 'pretplataVercel mora biti prisutan');
  assert.ok(['service-active', 'blocked-until-validated'].includes(json.pretplataVercel?.status ?? ''));
  assert.ok(Array.isArray(json.pretplataVercel?.blokatori), 'blokatori mora biti niz');
}

async function testRouteResponseUsesKvGovernanceFlags() {
  try {
    await kvSet(KV_VERCEL_BILLING_OWNER_KEY, 'Digitalna Industrija — Kompanija SPAJA');
    await kvSet(KV_VERCEL_BILLING_OWNER_LOCKED_KEY, true);
    await kvSet(KV_VERCEL_LEGAL_INTAKE_COMPLETE_KEY, true);
    await kvSet(KV_VERCEL_ENTERPRISE_GOVERNED_MODEL_KEY, true);
    await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, '5JJYX4KN-0015');
    await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, '385.52');
    await kvSet(KV_VERCEL_CURRENT_INVOICE_PAID_KEY, true);
    await kvSet(KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY, false);
    await kvSet(KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY, true);
    await kvSet(KV_VERCEL_INVOICE_REQUESTED_KEY, true);
    await kvSet(KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY, true);
    await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY, true);
    await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY, 'public-safe');
    await kvSet(KV_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED_KEY, true);
    await kvSet(KV_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED_KEY, true);
    await kvSet(KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY, true);
    await kvSet(KV_VERCEL_FINANCE_CHANNEL_CONFIGURED_KEY, true);
    await kvSet(KV_VERCEL_FINOPS_THRESHOLDS_ENABLED_KEY, true);
    await kvSet(KV_VERCEL_MONTHLY_RECONCILIATION_ENABLED_KEY, true);
    await kvSet(KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY, true);

    const response = await GET();
    const json = (await response.json()) as {
      pretplataVercel?: {
        blokatori: string[];
        billingGovernance?: {
          billingOwner?: string;
          publicAnnouncement?: { status?: string; blockers?: string[] };
        };
      };
    };
    const blokatori = json.pretplataVercel?.blokatori ?? [];
    assert.strictEqual(json.pretplataVercel?.billingGovernance?.billingOwner, 'Digitalna Industrija — Kompanija SPAJA');
    assert.strictEqual(json.pretplataVercel?.billingGovernance?.publicAnnouncement?.status, 'published');
    assert.deepStrictEqual(json.pretplataVercel?.billingGovernance?.publicAnnouncement?.blockers ?? [], []);
    assert.ok(!blokatori.includes('Billing owner nije zaključan na Digitalna Industrija.'));
    assert.ok(!blokatori.includes('Trenutna faktura nije rešena (pay ili support correction/re-issue).'));
  } finally {
    await kvSet(KV_VERCEL_BILLING_OWNER_KEY, '');
    await kvSet(KV_VERCEL_BILLING_OWNER_LOCKED_KEY, false);
    await kvSet(KV_VERCEL_LEGAL_INTAKE_COMPLETE_KEY, false);
    await kvSet(KV_VERCEL_ENTERPRISE_GOVERNED_MODEL_KEY, false);
    await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, '');
    await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, '');
    await kvSet(KV_VERCEL_CURRENT_INVOICE_PAID_KEY, false);
    await kvSet(KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY, false);
    await kvSet(KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY, false);
    await kvSet(KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY, false);
    await kvSet(KV_VERCEL_INVOICE_REQUESTED_KEY, false);
    await kvSet(KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY, false);
    await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY, false);
    await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY, '');
    await kvSet(KV_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED_KEY, false);
    await kvSet(KV_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED_KEY, false);
    await kvSet(KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY, false);
    await kvSet(KV_VERCEL_FINANCE_CHANNEL_CONFIGURED_KEY, false);
    await kvSet(KV_VERCEL_FINOPS_THRESHOLDS_ENABLED_KEY, false);
    await kvSet(KV_VERCEL_MONTHLY_RECONCILIATION_ENABLED_KEY, false);
    await kvSet(KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY, false);
  }
}

function testMissingTeamBlocker() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: '',
      VERCEL_ORG_ID: '',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'blocked-until-validated');
  assert.ok(status.blokatori.includes('Nedostaje VERCEL_TEAM_ID ili VERCEL_ORG_ID.'));
}

function testRequestedWithoutSubmittedState() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'false',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.ownership.enterpriseRequestReady, true);
  assert.strictEqual(status.ownership.enterpriseRequestRequested, true);
  assert.strictEqual(status.ownership.enterpriseRequestSubmitted, false);
  assert.ok(!status.blokatori.includes('Enterprise zahtev nije pokrenut (REQUESTED/SUBMITTED).'));
  assert.ok(status.blokatori.includes('Enterprise zahtev nije označen kao poslat (set-submitted).'));
}

function testOrgFallbackWhenTeamEmpty() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: '',
      VERCEL_ORG_ID: 'org-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.ok(!status.blokatori.includes('Nedostaje VERCEL_TEAM_ID ili VERCEL_ORG_ID.'));
}

function testOwnerPhoneFallbackWhenEnvEmpty() {
  assert.strictEqual(resolveOwnerPhone({ [OWNER_PHONE_NUMBER_ENV_KEY]: '   ' }), OWNER_PHONE_DEFAULT);
}

function testPhoneNotVerifiedBlocker() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: false },
  );
  assert.strictEqual(status.ownership.phoneVerified, false);
  assert.ok(status.blokatori.includes('Telefon vlasnika nije verifikovan (OTP).'));
}

function testDigitalnaIndustrijaBillingBlockers() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Pogresan entitet',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'false',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: 'INV-XYZ',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '1.00',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'false',
      SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED: 'false',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.ok(status.blokatori.includes('Billing owner nije zaključan na Digitalna Industrija.'));
  assert.ok(status.blokatori.includes('Billing owner mora biti: Digitalna Industrija — Kompanija SPAJA.'));
  assert.ok(status.blokatori.includes('Trenutni invoice mora biti 5JJYX4KN-0015.'));
  assert.ok(status.blokatori.includes('Trenutni invoice iznos mora biti 385.52.'));
  assert.ok(status.blokatori.includes('Trenutna faktura nije rešena (pay ili support correction/re-issue).'));
}

function testDigitalnaIndustrijaBillingCanBeCleared() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0015',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '385.52',
      SPAJA_VERCEL_INVOICE_REQUESTED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'service-active');
}

function testPaidInvoiceNeedsBankStatementAndRedactedPublicSummaryBeforeAnnouncement() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0015',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '385.52',
      SPAJA_VERCEL_INVOICE_REQUESTED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_BANK_STATEMENT_CAPTURED: 'false',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION: 'public-safe',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: 'false',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'service-active');
  assert.strictEqual(status.billingGovernance.publicAnnouncement.status, 'not-ready');
  assert.ok(status.billingGovernance.publicAnnouncement.blockers.includes('Nedostaje izvod platnog računa sa vidljivom vezom ka uplati.'));
  assert.ok(status.billingGovernance.publicAnnouncement.blockers.includes('Javni sažetak mora biti redigovan pre objave.'));
}

function testPaidInvoiceWithCompleteArtifactsCanBeReadyOrPublished() {
  const readyStatus = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0015',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '385.52',
      SPAJA_VERCEL_INVOICE_REQUESTED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_BANK_STATEMENT_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION: 'internal-only',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: 'true',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED: 'false',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(readyStatus.billingGovernance.publicAnnouncement.status, 'ready-to-publish');
  assert.ok(readyStatus.billingGovernance.publicAnnouncement.blockers.includes('Javni audit-ready sažetak još nije objavljen.'));

  const publishedStatus = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0015',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '385.52',
      SPAJA_VERCEL_INVOICE_REQUESTED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_BANK_STATEMENT_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION: 'internal-only',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: 'true',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED: 'true',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(publishedStatus.billingGovernance.publicAnnouncement.status, 'published');
  assert.deepStrictEqual(publishedStatus.billingGovernance.publicAnnouncement.blockers, []);
}

function testDigitalnaIndustrijaOpenInvoiceRemainsBlockedUntilPaidOrResolved() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0015',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '385.52',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'false',
      SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED: 'false',
      SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED: 'false',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'false',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'blocked-until-validated');
  assert.ok(!status.blokatori.includes('Trenutni invoice mora biti 5JJYX4KN-0015.'));
  assert.ok(!status.blokatori.includes('Trenutni invoice iznos mora biti 385.52.'));
  assert.ok(status.blokatori.includes('Trenutna faktura nije rešena (pay ili support correction/re-issue).'));
}

function testDigitalnaIndustrijaCorrectedInvoiceResolutionCanClearInvoiceBlocker() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0015',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '385.52',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'false',
      SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED: 'true',
      SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'service-active');
  assert.ok(!status.blokatori.includes('Trenutna faktura nije rešena (pay ili support correction/re-issue).'));
}

function testDigitalnaIndustrijaIncorrectInvoiceRemainsBlockedEvenIfMarkedPaid() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0014',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '385.52',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'blocked-until-validated');
  assert.ok(status.blokatori.includes('Trenutni invoice mora biti 5JJYX4KN-0015.'));
  assert.ok(status.blokatori.includes('Trenutna faktura nije rešena (pay ili support correction/re-issue).'));
}

function testDigitalnaIndustrijaCorrectionRequestAloneIsNotResolved() {
  const status = buildVercelPretplataStatus(
    {
      VERCEL_TEAM_ID: 'team-ok',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_READY: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUESTED: 'true',
      SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED: 'true',
      SPAJA_VERCEL_BILLING_OWNER: 'Digitalna Industrija — Kompanija SPAJA',
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_LEGAL_INTAKE_COMPLETE: 'true',
      SPAJA_VERCEL_ENTERPRISE_GOVERNED_MODEL: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: '5JJYX4KN-0015',
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: '385.52',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'false',
      SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED: 'true',
      SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED: 'false',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'false',
      SPAJA_VERCEL_AUTOPAY_CORPORATE_ONLY: 'true',
      SPAJA_VERCEL_FINANCE_CHANNEL_CONFIGURED: 'true',
      SPAJA_VERCEL_FINOPS_THRESHOLDS_ENABLED: 'true',
      SPAJA_VERCEL_MONTHLY_RECONCILIATION_ENABLED: 'true',
      SPAJA_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED: 'true',
    },
    { tokenKonfigurisan: true, projectIdKonfigurisan: true, phoneVerified: true },
  );
  assert.strictEqual(status.status, 'blocked-until-validated');
  assert.ok(status.blokatori.includes('Trenutna faktura nije rešena (pay ili support correction/re-issue).'));
}

async function run() {
  console.log('\n🌐 Vercel status route tests\n');
  await testRouteResponse();
  console.log('✓ route response includes pretplata blokatori');
  await testRouteResponseUsesKvGovernanceFlags();
  console.log('✓ route response supports KV-backed governance flags');
  testMissingTeamBlocker();
  console.log('✓ missing team/org blocker');
  testRequestedWithoutSubmittedState();
  console.log('✓ requested vs submitted blocker logic');
  testOrgFallbackWhenTeamEmpty();
  console.log('✓ org fallback when team is empty');
  testOwnerPhoneFallbackWhenEnvEmpty();
  console.log('✓ owner phone env empty fallback');
  testPhoneNotVerifiedBlocker();
  console.log('✓ phone verification blocker');
  testDigitalnaIndustrijaBillingBlockers();
  console.log('✓ Digitalna Industrija billing blockers');
  testDigitalnaIndustrijaBillingCanBeCleared();
  console.log('✓ Digitalna Industrija billing blockers can be cleared');
  testPaidInvoiceNeedsBankStatementAndRedactedPublicSummaryBeforeAnnouncement();
  console.log('✓ paid invoice needs bank statement and redacted public summary before announcement');
  testPaidInvoiceWithCompleteArtifactsCanBeReadyOrPublished();
  console.log('✓ paid invoice with complete artifacts can become ready or published');
  testDigitalnaIndustrijaOpenInvoiceRemainsBlockedUntilPaidOrResolved();
  console.log('✓ approved/open invoice remains blocked until paid or resolved');
  testDigitalnaIndustrijaCorrectedInvoiceResolutionCanClearInvoiceBlocker();
  console.log('✓ corrected invoice resolution can clear unresolved invoice blocker');
  testDigitalnaIndustrijaIncorrectInvoiceRemainsBlockedEvenIfMarkedPaid();
  console.log('✓ incorrect invoice remains blocked even if marked paid');
  testDigitalnaIndustrijaCorrectionRequestAloneIsNotResolved();
  console.log('✓ correction request alone remains unresolved');
  console.log('\n✅ Vercel status route tests passed\n');
}

run().catch((error) => {
  console.error('❌ Vercel status route tests failed');
  console.error(error);
  process.exit(1);
});
