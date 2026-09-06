/**
 * /api/owner/vercel-ownership
 *
 * GET  — Vraća kompletni Vercel ownership status i checklist
 * POST — Ažurira status enterprise zahteva (postavljanjem env flag-a u memoriju)
 *
 * Ownership prenos zahteva:
 *  1. Telefonska verifikacija vlasnika (owner-phone-auth)
 *  2. SPAJA_VERCEL_ENTERPRISE_REQUEST_READY=true (spreman za slanje)
 *  3. SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED=true (zahtev poslat)
 *
 * Autofinish — VERCEL PRIKLJUČENJE Faza 4
 */

import { NextRequest, NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getOwnerIdentity } from '@/lib/owner-identity';
import { getOwnerPhoneVerifikacijaStatus, getOwnerPoslednja_verifikacija } from '@/lib/owner-phone-auth';
import { OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from '@/lib/constants';
import { kvGet, kvSet } from '@/lib/kv-client';

// KV ključevi za enterprise request status (persists over restarts)
const KV_ENTERPRISE_READY_KEY = 'owner:vercel:enterprise-request-ready';
const KV_ENTERPRISE_SUBMITTED_KEY = 'owner:vercel:enterprise-request-submitted';
const KV_VERCEL_BILLING_OWNER_KEY = 'owner:vercel:billing-owner';
const KV_VERCEL_BILLING_OWNER_LOCKED_KEY = 'owner:vercel:billing-owner-locked';
const KV_VERCEL_LEGAL_INTAKE_COMPLETE_KEY = 'owner:vercel:legal-intake-complete';
const KV_VERCEL_ENTERPRISE_GOVERNED_MODEL_KEY = 'owner:vercel:enterprise-governed-model';
const KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY = 'owner:vercel:current-invoice-number';
const KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY = 'owner:vercel:current-invoice-amount';
const KV_VERCEL_CURRENT_INVOICE_PAID_KEY = 'owner:vercel:current-invoice-paid';
const KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY = 'owner:vercel:current-invoice-evidence-captured';
const KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY = 'owner:vercel:invoice-correction-requested';
const KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY = 'owner:vercel:corrected-invoice-resolved';
const KV_VERCEL_INVOICE_REQUESTED_KEY = 'owner:vercel:invoice-requested';
const KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY = 'owner:vercel:bank-statement-captured';
const KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY = 'owner:vercel:payment-reference-captured';
const KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY = 'owner:vercel:payment-reference-classification';
const KV_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED_KEY = 'owner:vercel:public-announcement-redacted';
const KV_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED_KEY = 'owner:vercel:public-announcement-published';
const KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY = 'owner:vercel:autopay-corporate-only';
const KV_VERCEL_FINANCE_CHANNEL_CONFIGURED_KEY = 'owner:vercel:finance-channel-configured';
const KV_VERCEL_FINOPS_THRESHOLDS_ENABLED_KEY = 'owner:vercel:finops-thresholds-enabled';
const KV_VERCEL_MONTHLY_RECONCILIATION_ENABLED_KEY = 'owner:vercel:monthly-reconciliation-enabled';
const KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY = 'owner:vercel:quarterly-vendor-review-enabled';

const EXPECTED_BILLING_OWNER = 'Digitalna Industrija — Kompanija SPAJA';
const EXPECTED_INVOICE_NUMBER = '5JJYX4KN-0015';
const EXPECTED_INVOICE_AMOUNT = '385.52';
const PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE = 'public-safe';
const PAYMENT_REFERENCE_CLASSIFICATION_INTERNAL_ONLY = 'internal-only';

function normalizePaymentReferenceClassification(value: string | null | undefined): string {
  const normalized = (value ?? '').trim().toLowerCase();
  return [
    PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE,
    PAYMENT_REFERENCE_CLASSIFICATION_INTERNAL_ONLY,
  ].includes(normalized)
    ? normalized
    : '';
}

function isInvoiceResolved(flags: {
  currentInvoiceNumber: string;
  currentInvoiceAmount: string;
  currentInvoicePaid: boolean;
  invoiceCorrectionRequested: boolean;
  correctedInvoiceResolved: boolean;
}): boolean {
  const invoiceMatchesExpected =
    flags.currentInvoiceNumber === EXPECTED_INVOICE_NUMBER
    && flags.currentInvoiceAmount === EXPECTED_INVOICE_AMOUNT;
  return invoiceMatchesExpected
    && (flags.currentInvoicePaid || (flags.invoiceCorrectionRequested && flags.correctedInvoiceResolved));
}

function isPublicAnnouncementReady(flags: {
  currentInvoiceNumber: string;
  currentInvoiceAmount: string;
  currentInvoicePaid: boolean;
  invoiceCorrectionRequested: boolean;
  correctedInvoiceResolved: boolean;
  currentInvoiceEvidenceCaptured: boolean;
  bankStatementCaptured: boolean;
  paymentReferenceCaptured: boolean;
  paymentReferenceClassification: string;
  publicAnnouncementRedacted: boolean;
}): boolean {
  return isInvoiceResolved(flags)
    && flags.currentInvoiceEvidenceCaptured
    && flags.bankStatementCaptured
    && flags.paymentReferenceCaptured
    && flags.paymentReferenceClassification.length > 0
    && flags.publicAnnouncementRedacted;
}

async function getEnterpriseFlags(): Promise<{ ready: boolean; submitted: boolean }> {
  // Env var ima prioritet, zatim KV, zatim false
  const envReady = /^(1|true|yes)$/i.test(process.env.SPAJA_VERCEL_ENTERPRISE_REQUEST_READY ?? '');
  const envSubmitted = /^(1|true|yes)$/i.test(process.env.SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED ?? '');

  if (envReady || envSubmitted) return { ready: envReady, submitted: envSubmitted };

  const kvReady = await kvGet<boolean>(KV_ENTERPRISE_READY_KEY);
  const kvSubmitted = await kvGet<boolean>(KV_ENTERPRISE_SUBMITTED_KEY);

  return {
    ready: kvReady === true,
    submitted: kvSubmitted === true,
  };
}

async function getBillingGovernanceFlags() {
  const [
    billingOwner,
    billingOwnerLocked,
    legalIntakeComplete,
    enterpriseGovernedModel,
    currentInvoiceNumber,
    currentInvoiceAmount,
    currentInvoicePaid,
    currentInvoiceEvidenceCaptured,
    invoiceCorrectionRequested,
    correctedInvoiceResolved,
    invoiceRequested,
    bankStatementCaptured,
    paymentReferenceCaptured,
    paymentReferenceClassification,
    publicAnnouncementRedacted,
    publicAnnouncementPublished,
    autopayCorporateOnly,
    financeChannelConfigured,
    finopsThresholdsEnabled,
    monthlyReconciliationEnabled,
    quarterlyVendorReviewEnabled,
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
    kvGet<boolean>(KV_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED_KEY),
    kvGet<boolean>(KV_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED_KEY),
    kvGet<boolean>(KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY),
    kvGet<boolean>(KV_VERCEL_FINANCE_CHANNEL_CONFIGURED_KEY),
    kvGet<boolean>(KV_VERCEL_FINOPS_THRESHOLDS_ENABLED_KEY),
    kvGet<boolean>(KV_VERCEL_MONTHLY_RECONCILIATION_ENABLED_KEY),
    kvGet<boolean>(KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY),
  ]);

  return {
    billingOwner: billingOwner ?? EXPECTED_BILLING_OWNER,
    billingOwnerLocked: billingOwnerLocked === true,
    legalIntakeComplete: legalIntakeComplete === true,
    enterpriseGovernedModel: enterpriseGovernedModel === true,
    currentInvoiceNumber: currentInvoiceNumber ?? EXPECTED_INVOICE_NUMBER,
    currentInvoiceAmount: currentInvoiceAmount ?? EXPECTED_INVOICE_AMOUNT,
    currentInvoicePaid: currentInvoicePaid === true,
    currentInvoiceEvidenceCaptured: currentInvoiceEvidenceCaptured === true,
    invoiceCorrectionRequested: invoiceCorrectionRequested === true,
    correctedInvoiceResolved: correctedInvoiceResolved === true,
    invoiceRequested: invoiceRequested === true,
    bankStatementCaptured: bankStatementCaptured === true,
    paymentReferenceCaptured: paymentReferenceCaptured === true,
    paymentReferenceClassification: normalizePaymentReferenceClassification(paymentReferenceClassification),
    publicAnnouncementRedacted: publicAnnouncementRedacted === true,
    publicAnnouncementPublished: publicAnnouncementPublished === true,
    autopayCorporateOnly: autopayCorporateOnly === true,
    financeChannelConfigured: financeChannelConfigured === true,
    finopsThresholdsEnabled: finopsThresholdsEnabled === true,
    monthlyReconciliationEnabled: monthlyReconciliationEnabled === true,
    quarterlyVendorReviewEnabled: quarterlyVendorReviewEnabled === true,
  };
}

export async function GET() {
  const telefonBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY] ?? OWNER_PHONE_DEFAULT;
  const phoneStatus = getOwnerPhoneVerifikacijaStatus(telefonBroj);
  const poslednja_verifikacija = getOwnerPoslednja_verifikacija(telefonBroj);

  const identity = getOwnerIdentity(phoneStatus, poslednja_verifikacija);
  const { ready, submitted } = await getEnterpriseFlags();
  const billing = await getBillingGovernanceFlags();

  // Override checklist sa KV vrednostima
  const checklist = {
    ...identity.vercel.checklist,
    enterpriseRequestSpreman: ready || identity.vercel.checklist.enterpriseRequestSpreman,
    enterpriseRequestPoslato: submitted || identity.vercel.checklist.enterpriseRequestPoslato,
  };

  const vercelStatus = submitted
    ? 'u-procesu'
    : identity.vercel.status;

  const blokator = !checklist.phoneVerified
    ? 'Telefonska verifikacija je obavezna pre slanja Vercel enterprise zahteva.'
    : null;
  const publicAnnouncementReady = isPublicAnnouncementReady(billing);
  const publicAnnouncementBlockers = [
    ...(!billing.invoiceRequested ? ['Zahtev za fakturisanje / support eskalacija nije dokumentovana.'] : []),
    ...(!isInvoiceResolved(billing)
      ? ['Javno ozvaničenje je blokirano dok faktura nije plaćena ili korekcija nije rešena.']
      : []),
    ...(!billing.currentInvoiceEvidenceCaptured && isInvoiceResolved(billing)
      ? ['Nedostaje payment confirmation paket.']
      : []),
    ...(!billing.bankStatementCaptured && isInvoiceResolved(billing)
      ? ['Nedostaje izvod platnog računa.']
      : []),
    ...(!billing.paymentReferenceCaptured && isInvoiceResolved(billing)
      ? ['Nedostaje barkod / payment reference.']
      : []),
    ...(billing.paymentReferenceCaptured && billing.paymentReferenceClassification.length === 0
      ? ['Barkod / payment reference mora biti klasifikovan kao public-safe ili internal-only.']
      : []),
    ...(!billing.publicAnnouncementRedacted && isInvoiceResolved(billing)
      ? ['Javni sažetak mora biti redigovan.']
      : []),
    ...(!billing.publicAnnouncementPublished && publicAnnouncementReady
      ? ['Audit-ready javni sažetak još nije objavljen.']
      : []),
  ];

  return NextResponse.json({
    sistem: 'Vercel Ownership — Kompanija SPAJA',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    vercel: {
      accountEmail: identity.vercel.accountEmail,
      billingKontakt: identity.vercel.billingKontakt,
      status: vercelStatus,
      checklist,
      billingGovernance: {
        expectedBillingOwner: EXPECTED_BILLING_OWNER,
        billingOwner: billing.billingOwner,
        billingOwnerLocked: billing.billingOwnerLocked,
        legalIntakeComplete: billing.legalIntakeComplete,
        enterpriseGovernedModel: billing.enterpriseGovernedModel,
        currentInvoice: {
          number: billing.currentInvoiceNumber,
          amountUsd: billing.currentInvoiceAmount,
          requested: billing.invoiceRequested,
          paid: billing.currentInvoicePaid,
          correctionRequested: billing.invoiceCorrectionRequested,
          correctedInvoiceResolved: billing.correctedInvoiceResolved,
          evidenceCaptured: billing.currentInvoiceEvidenceCaptured,
          bankStatementCaptured: billing.bankStatementCaptured,
          paymentReferenceCaptured: billing.paymentReferenceCaptured,
          paymentReferenceClassification: billing.paymentReferenceClassification || 'unclassified',
        },
        publicAnnouncement: {
          redacted: billing.publicAnnouncementRedacted,
          published: billing.publicAnnouncementPublished,
          status: billing.publicAnnouncementPublished
            ? 'published'
            : publicAnnouncementReady
              ? 'ready-to-publish'
              : 'not-ready',
          blockers: publicAnnouncementBlockers,
        },
        futurePayments: {
          autopayCorporateOnly: billing.autopayCorporateOnly,
          financeChannelConfigured: billing.financeChannelConfigured,
          finopsThresholdsEnabled: billing.finopsThresholdsEnabled,
          monthlyReconciliationEnabled: billing.monthlyReconciliationEnabled,
          quarterlyVendorReviewEnabled: billing.quarterlyVendorReviewEnabled,
        },
      },
      zahtevaTelefonVerifikaciju: identity.vercel.zahtevaTelefonVerifikaciju,
      blokator,
    },
    telefon: {
      maskiranBroj: identity.telefon.maskiranBroj,
      status: identity.telefon.status,
      verifikovan: identity.verifikovan,
    },
    sledećiKoraci: checklist.phoneVerified
      ? [
          ready ? '✅ Enterprise zahtev spreman za slanje' : '⬜ Postaviti SPAJA_VERCEL_ENTERPRISE_REQUEST_READY=true',
          submitted ? '✅ Enterprise zahtev poslat — čekamo potvrdu' : '⬜ Poslati Vercel Enterprise Request',
          billing.billingOwnerLocked ? '✅ Billing owner zaključan na Digitalna Industrija' : '⬜ Zaključati billing owner na Digitalna Industrija',
          billing.invoiceRequested ? '✅ Fakturisanje / support eskalacija dokumentovana' : '⬜ Evidentirati invoice requested / support eskalaciju',
          billing.currentInvoicePaid || billing.correctedInvoiceResolved
            ? '✅ Trenutna faktura 5JJYX4KN-0015 je plaćena ili korigovana faktura je rešena'
            : '⬜ Platiti fakturu 5JJYX4KN-0015 ($385.52) ili otvoriti support correction',
          billing.currentInvoiceEvidenceCaptured ? '✅ Sačuvan dokaz o uplati/invoice-u' : '⬜ Sačuvati invoice PDF + payment dokaz + timestamp + odgovorno lice',
          billing.bankStatementCaptured ? '✅ Izvod platnog računa je sačuvan' : '⬜ Sačuvati izvod platnog računa sa vezom ka uplati',
          billing.paymentReferenceCaptured
            ? `✅ Barkod / payment reference sačuvan (${billing.paymentReferenceClassification || 'unclassified'})`
            : '⬜ Sačuvati barkod ili payment reference i klasifikovati ga',
          billing.publicAnnouncementRedacted ? '✅ Javni sažetak je redigovan' : '⬜ Pripremiti redigovan audit-ready javni sažetak',
          billing.publicAnnouncementPublished ? '✅ Javno ozvaničenje je objavljeno' : '⬜ Objaviti javni sažetak tek nakon validacije uplata+dokaza+privatnosti',
          billing.autopayCorporateOnly ? '✅ Autopay ograničen na korporativni metod plaćanja' : '⬜ Uključiti autopay samo na Digitalna Industrija korporativni metod',
          billing.financeChannelConfigured ? '✅ Invoice notifikacije na finansijskom kanalu' : '⬜ Postaviti invoice delivery/notifikacije na finansijski kanal Digitalna Industrija',
          billing.finopsThresholdsEnabled ? '✅ FinOps pragovi 50/75/90/100 aktivni' : '⬜ Aktivirati FinOps pragove 50/75/90/100',
          '📧 Pratiti email: ' + identity.vercel.accountEmail,
        ]
      : [
          '📱 Pokrenuti OTP: POST /api/owner-phone-auth/request-otp',
          '🔑 Verifikovati OTP: POST /api/owner-phone-auth/verify-otp',
          '📋 Nakon verifikacije — enterprise zahtev se može poslati',
        ],
    uputstvo: {
      korak1: 'Verifikovati telefon vlasnika putem OTP sistema',
      korak2: 'Kontaktirati Vercel Enterprise tim sa zahtevom za ownership prenos',
      korak3: 'Priložiti: ime, email, GitHub nalog, billing podaci',
      korak4: 'Pratiti status na: https://vercel.com/account',
    },
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-App-Version': APP_VERSION,
    },
  });
}

interface OwnershipUpdateBody {
  akcija?:
    | 'set-ready'
    | 'set-submitted'
    | 'set-billing-owner-locked'
    | 'set-legal-intake-complete'
    | 'set-enterprise-governed-model'
    | 'set-invoice-requested'
    | 'set-current-invoice-paid'
    | 'set-corrected-invoice-resolved'
    | 'set-current-invoice-evidence-captured'
    | 'set-bank-statement-captured'
    | 'set-payment-reference-public-safe'
    | 'set-payment-reference-internal-only'
    | 'set-public-announcement-redacted'
    | 'set-public-announcement-published'
    | 'set-invoice-correction-requested'
    | 'set-autopay-corporate-only'
    | 'set-finance-channel-configured'
    | 'set-finops-thresholds-enabled'
    | 'set-monthly-reconciliation-enabled'
    | 'set-quarterly-vendor-review-enabled'
    | 'reset';
}

export async function POST(request: NextRequest) {
  let body: OwnershipUpdateBody = {};
  try {
    body = (await request.json()) as OwnershipUpdateBody;
  } catch {
    return NextResponse.json({ greska: 'Neispravan JSON u telu zahteva.' }, { status: 400 });
  }

  const { akcija } = body;
  if (!akcija || ![
    'set-ready',
    'set-submitted',
    'set-billing-owner-locked',
    'set-legal-intake-complete',
    'set-enterprise-governed-model',
    'set-invoice-requested',
    'set-current-invoice-paid',
    'set-corrected-invoice-resolved',
    'set-current-invoice-evidence-captured',
    'set-bank-statement-captured',
    'set-payment-reference-public-safe',
    'set-payment-reference-internal-only',
    'set-public-announcement-redacted',
    'set-public-announcement-published',
    'set-invoice-correction-requested',
    'set-autopay-corporate-only',
    'set-finance-channel-configured',
    'set-finops-thresholds-enabled',
    'set-monthly-reconciliation-enabled',
    'set-quarterly-vendor-review-enabled',
    'reset',
  ].includes(akcija)) {
    return NextResponse.json(
      { greska: 'Nepoznata akcija. Dostupne: set-ready, set-submitted, set-billing-owner-locked, set-legal-intake-complete, set-enterprise-governed-model, set-invoice-requested, set-current-invoice-paid, set-corrected-invoice-resolved, set-current-invoice-evidence-captured, set-bank-statement-captured, set-payment-reference-public-safe, set-payment-reference-internal-only, set-public-announcement-redacted, set-public-announcement-published, set-invoice-correction-requested, set-autopay-corporate-only, set-finance-channel-configured, set-finops-thresholds-enabled, set-monthly-reconciliation-enabled, set-quarterly-vendor-review-enabled, reset.' },
      { status: 400 },
    );
  }

  // Proveriti da li je vlasnik telefonski verifikovan
  const telefonBroj = process.env[OWNER_PHONE_NUMBER_ENV_KEY] ?? OWNER_PHONE_DEFAULT;
  const phoneStatus = getOwnerPhoneVerifikacijaStatus(telefonBroj);

  if (phoneStatus !== 'verifikovan' && akcija !== 'reset') {
    return NextResponse.json(
      {
        greska: 'Telefonska verifikacija je obavezna pre ažuriranja Vercel ownership statusa.',
        uputstvo: 'POST /api/owner-phone-auth/request-otp → POST /api/owner-phone-auth/verify-otp',
      },
      { status: 403 },
    );
  }

  switch (akcija) {
    case 'set-ready':
      await kvSet(KV_ENTERPRISE_READY_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Enterprise zahtev označen kao spreman za slanje.',
        sledeci: 'POST /api/owner/vercel-ownership { "akcija": "set-submitted" }',
        timestamp: new Date().toISOString(),
      });

    case 'set-submitted':
      await kvSet(KV_ENTERPRISE_READY_KEY, true);
      await kvSet(KV_ENTERPRISE_SUBMITTED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Enterprise zahtev označen kao poslat. Status: u-procesu.',
        sledeci: 'Pratiti email i Vercel dashboard za potvrdu ownership prenosa.',
        timestamp: new Date().toISOString(),
      });

    case 'set-billing-owner-locked':
      await kvSet(KV_VERCEL_BILLING_OWNER_KEY, EXPECTED_BILLING_OWNER);
      await kvSet(KV_VERCEL_BILLING_OWNER_LOCKED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Billing owner je zaključan na Digitalna Industrija — Kompanija SPAJA.',
        timestamp: new Date().toISOString(),
      });

    case 'set-legal-intake-complete':
      await kvSet(KV_VERCEL_LEGAL_INTAKE_COMPLETE_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Privredni intake podaci su označeni kao kompletni.',
        timestamp: new Date().toISOString(),
      });

    case 'set-enterprise-governed-model':
      await kvSet(KV_VERCEL_ENTERPRISE_GOVERNED_MODEL_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Pretplata je označena kao privreda / enterprise-governed.',
        timestamp: new Date().toISOString(),
      });

    case 'set-invoice-requested':
      await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, EXPECTED_INVOICE_NUMBER);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, EXPECTED_INVOICE_AMOUNT);
      await kvSet(KV_VERCEL_INVOICE_REQUESTED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Zahtev za fakturisanje / support eskalacija je dokumentovana za aktivnu Vercel fakturu.',
        timestamp: new Date().toISOString(),
      });

    case 'set-current-invoice-paid':
      await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, EXPECTED_INVOICE_NUMBER);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, EXPECTED_INVOICE_AMOUNT);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_PAID_KEY, true);
      await kvSet(KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY, false);
      await kvSet(KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY, false);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Trenutna faktura 5JJYX4KN-0015 je označena kao plaćena.',
        timestamp: new Date().toISOString(),
      });

    case 'set-corrected-invoice-resolved':
      {
        const kvCorrectionRequested = (await kvGet<boolean>(KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY)) === true;
        if (!kvCorrectionRequested) {
          return NextResponse.json({
            status: 'error',
            poruka: 'Nije aktivan correction workflow. Prvo pozvati set-invoice-correction-requested.',
            timestamp: new Date().toISOString(),
          }, { status: 409 });
        }
      }
      await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, EXPECTED_INVOICE_NUMBER);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, EXPECTED_INVOICE_AMOUNT);
      await kvSet(KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY, true);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_PAID_KEY, false);
      await kvSet(KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Korigovana/re-issued faktura je označena kao rešena.',
        timestamp: new Date().toISOString(),
      });

    case 'set-current-invoice-evidence-captured':
      await kvSet(KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Dokaz o fakturi/plaćanju je sačuvan.',
        timestamp: new Date().toISOString(),
      });

    case 'set-bank-statement-captured':
      {
        const flags = await getBillingGovernanceFlags();
        if (!isInvoiceResolved(flags) || !flags.currentInvoiceEvidenceCaptured) {
          return NextResponse.json({
            status: 'error',
            poruka: 'Izvod platnog računa se beleži tek nakon resolved invoice i osnovnog payment dokaza.',
            timestamp: new Date().toISOString(),
          }, { status: 409 });
        }
      }
      await kvSet(KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Izvod platnog računa je označen kao sačuvan.',
        timestamp: new Date().toISOString(),
      });

    case 'set-payment-reference-public-safe':
      {
        const flags = await getBillingGovernanceFlags();
        if (!isInvoiceResolved(flags) || !flags.currentInvoiceEvidenceCaptured) {
          return NextResponse.json({
            status: 'error',
            poruka: 'Barkod / payment reference se beleži tek nakon resolved invoice i osnovnog payment dokaza.',
            timestamp: new Date().toISOString(),
          }, { status: 409 });
        }
      }
      await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY, true);
      await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY, PAYMENT_REFERENCE_CLASSIFICATION_PUBLIC_SAFE);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Barkod / payment reference je sačuvan i označen kao public-safe.',
        timestamp: new Date().toISOString(),
      });

    case 'set-payment-reference-internal-only':
      {
        const flags = await getBillingGovernanceFlags();
        if (!isInvoiceResolved(flags) || !flags.currentInvoiceEvidenceCaptured) {
          return NextResponse.json({
            status: 'error',
            poruka: 'Barkod / payment reference se beleži tek nakon resolved invoice i osnovnog payment dokaza.',
            timestamp: new Date().toISOString(),
          }, { status: 409 });
        }
      }
      await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY, true);
      await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY, PAYMENT_REFERENCE_CLASSIFICATION_INTERNAL_ONLY);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Barkod / payment reference je sačuvan i označen kao internal-only.',
        timestamp: new Date().toISOString(),
      });

    case 'set-public-announcement-redacted':
      {
        const flags = await getBillingGovernanceFlags();
        if (
          !isInvoiceResolved(flags)
          || !flags.currentInvoiceEvidenceCaptured
          || !flags.bankStatementCaptured
          || !flags.paymentReferenceCaptured
          || flags.paymentReferenceClassification.length === 0
        ) {
          return NextResponse.json({
            status: 'error',
            poruka: 'Redigovan javni sažetak se beleži tek nakon resolved invoice, payment dokaza, izvoda i klasifikovanog barkoda/payment reference.',
            timestamp: new Date().toISOString(),
          }, { status: 409 });
        }
      }
      await kvSet(KV_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Javni audit-ready sažetak je označen kao redigovan.',
        timestamp: new Date().toISOString(),
      });

    case 'set-public-announcement-published':
      {
        const flags = await getBillingGovernanceFlags();
        if (!isPublicAnnouncementReady(flags)) {
          return NextResponse.json({
            status: 'error',
            poruka: 'Javno ozvaničenje je dozvoljeno tek kada postoje resolved invoice, payment dokaz, izvod, barkod/payment reference i redigovan javni sažetak.',
            timestamp: new Date().toISOString(),
          }, { status: 409 });
        }
      }
      await kvSet(KV_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Javni audit-ready sažetak je označen kao objavljen.',
        timestamp: new Date().toISOString(),
      });

    case 'set-invoice-correction-requested':
      const kvPaid = (await kvGet<boolean>(KV_VERCEL_CURRENT_INVOICE_PAID_KEY)) === true;
      if (kvPaid) {
        return NextResponse.json({
          status: 'ok',
          poruka: 'Faktura je već označena kao plaćena; correction request ne menja paid stanje.',
          timestamp: new Date().toISOString(),
        });
      }
      await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, EXPECTED_INVOICE_NUMBER);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, EXPECTED_INVOICE_AMOUNT);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_PAID_KEY, false);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY, false);
      await kvSet(KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY, false);
      await kvSet(KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY, true);
      await kvSet(KV_VERCEL_INVOICE_REQUESTED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Support zahtev za korekciju/re-issue fakture je označen kao poslat.',
        timestamp: new Date().toISOString(),
      });

    case 'set-autopay-corporate-only':
      await kvSet(KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Autopay je označen kao korporativni-only (Digitalna Industrija).',
        timestamp: new Date().toISOString(),
      });

    case 'set-finance-channel-configured':
      await kvSet(KV_VERCEL_FINANCE_CHANNEL_CONFIGURED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Invoice delivery i billing notifikacije su vezane za finansijski kanal Digitalna Industrija.',
        timestamp: new Date().toISOString(),
      });

    case 'set-finops-thresholds-enabled':
      await kvSet(KV_VERCEL_FINOPS_THRESHOLDS_ENABLED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'FinOps pragovi 50/75/90/100 su aktivirani.',
        timestamp: new Date().toISOString(),
      });

    case 'set-monthly-reconciliation-enabled':
      await kvSet(KV_VERCEL_MONTHLY_RECONCILIATION_ENABLED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Mesečni billing reconciliation je aktiviran.',
        timestamp: new Date().toISOString(),
      });

    case 'set-quarterly-vendor-review-enabled':
      await kvSet(KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY, true);
      return NextResponse.json({
        status: 'ok',
        poruka: 'Kvartalni vendor review je aktiviran.',
        timestamp: new Date().toISOString(),
      });

    case 'reset':
      await kvSet(KV_ENTERPRISE_READY_KEY, false);
      await kvSet(KV_ENTERPRISE_SUBMITTED_KEY, false);
      await kvSet(KV_VERCEL_BILLING_OWNER_KEY, '');
      await kvSet(KV_VERCEL_BILLING_OWNER_LOCKED_KEY, false);
      await kvSet(KV_VERCEL_LEGAL_INTAKE_COMPLETE_KEY, false);
      await kvSet(KV_VERCEL_ENTERPRISE_GOVERNED_MODEL_KEY, false);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, '');
      await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, '');
      await kvSet(KV_VERCEL_CURRENT_INVOICE_PAID_KEY, false);
      await kvSet(KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY, false);
      await kvSet(KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY, false);
      await kvSet(KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY, false);
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
      return NextResponse.json({
        status: 'ok',
        poruka: 'Vercel ownership status resetovan.',
        timestamp: new Date().toISOString(),
      });
  }
}
