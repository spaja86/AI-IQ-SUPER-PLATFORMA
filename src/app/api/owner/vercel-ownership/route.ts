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
const KV_VERCEL_AUTOPAY_CORPORATE_ONLY_KEY = 'owner:vercel:autopay-corporate-only';
const KV_VERCEL_FINANCE_CHANNEL_CONFIGURED_KEY = 'owner:vercel:finance-channel-configured';
const KV_VERCEL_FINOPS_THRESHOLDS_ENABLED_KEY = 'owner:vercel:finops-thresholds-enabled';
const KV_VERCEL_MONTHLY_RECONCILIATION_ENABLED_KEY = 'owner:vercel:monthly-reconciliation-enabled';
const KV_VERCEL_QUARTERLY_VENDOR_REVIEW_ENABLED_KEY = 'owner:vercel:quarterly-vendor-review-enabled';

const EXPECTED_BILLING_OWNER = 'Digitalna Industrija — Kompanija SPAJA';
const EXPECTED_INVOICE_NUMBER = '5JJYX4KN-0015';
const EXPECTED_INVOICE_AMOUNT = '385.52';

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
          paid: billing.currentInvoicePaid,
          correctionRequested: billing.invoiceCorrectionRequested,
          correctedInvoiceResolved: billing.correctedInvoiceResolved,
          evidenceCaptured: billing.currentInvoiceEvidenceCaptured,
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
          billing.currentInvoicePaid || billing.correctedInvoiceResolved
            ? '✅ Trenutna faktura 5JJYX4KN-0015 je plaćena ili korigovana faktura je rešena'
            : '⬜ Platiti fakturu 5JJYX4KN-0015 ($385.52) ili otvoriti support correction',
          billing.currentInvoiceEvidenceCaptured ? '✅ Sačuvan dokaz o uplati/invoice-u' : '⬜ Sačuvati invoice PDF + payment dokaz + timestamp + odgovorno lice',
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
    | 'set-current-invoice-paid'
    | 'set-corrected-invoice-resolved'
    | 'set-current-invoice-evidence-captured'
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
    'set-current-invoice-paid',
    'set-corrected-invoice-resolved',
    'set-current-invoice-evidence-captured',
    'set-invoice-correction-requested',
    'set-autopay-corporate-only',
    'set-finance-channel-configured',
    'set-finops-thresholds-enabled',
    'set-monthly-reconciliation-enabled',
    'set-quarterly-vendor-review-enabled',
    'reset',
  ].includes(akcija)) {
    return NextResponse.json(
      { greska: 'Nepoznata akcija. Dostupne: set-ready, set-submitted, set-billing-owner-locked, set-legal-intake-complete, set-enterprise-governed-model, set-current-invoice-paid, set-corrected-invoice-resolved, set-current-invoice-evidence-captured, set-invoice-correction-requested, set-autopay-corporate-only, set-finance-channel-configured, set-finops-thresholds-enabled, set-monthly-reconciliation-enabled, set-quarterly-vendor-review-enabled, reset.' },
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
