import assert from 'node:assert';
import type { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/owner/vercel-ownership/route';
import { OWNER_PHONE_DEFAULT } from '../../lib/constants';
import { getOwnerPhoneVerifikacijaStatus, requestOwnerOtp, verifyOwnerOtp } from '../../lib/owner-phone-auth';
import { kvSet } from '../../lib/kv-client';

const KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY = 'owner:vercel:current-invoice-number';
const KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY = 'owner:vercel:current-invoice-amount';
const KV_VERCEL_CURRENT_INVOICE_PAID_KEY = 'owner:vercel:current-invoice-paid';
const KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY = 'owner:vercel:current-invoice-evidence-captured';
const KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY = 'owner:vercel:invoice-correction-requested';
const KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY = 'owner:vercel:corrected-invoice-resolved';
const EXPECTED_INVOICE_NUMBER = '5JJYX4KN-0015';
const EXPECTED_INVOICE_AMOUNT = '385.52';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/owner/vercel-ownership', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function postAction(akcija: string) {
  return POST(makeRequest({ akcija }));
}

async function resetState(): Promise<void> {
  await postAction('reset');
}

function ensureVerifiedOwnerPhone(): void {
  if (getOwnerPhoneVerifikacijaStatus(OWNER_PHONE_DEFAULT) === 'verifikovan') return;
  const otpRequest = requestOwnerOtp(OWNER_PHONE_DEFAULT);
  assert(otpRequest.uspesno, 'owner OTP request must succeed in tests');
  assert(otpRequest.devOtp, 'dev OTP must be available in non-production tests');
  const otpVerify = verifyOwnerOtp(OWNER_PHONE_DEFAULT, otpRequest.devOtp);
  assert(otpVerify.uspesno, 'owner OTP verification must succeed in tests');
  assert(otpVerify.jeOwner, 'verified phone must belong to owner');
}

async function seedApprovedOpenInvoiceState(): Promise<void> {
  await resetState();
  ensureVerifiedOwnerPhone();

  await postAction('set-ready');
  await postAction('set-submitted');
  await postAction('set-billing-owner-locked');
  await postAction('set-legal-intake-complete');
  await postAction('set-enterprise-governed-model');
  await postAction('set-autopay-corporate-only');
  await postAction('set-finance-channel-configured');
  await postAction('set-finops-thresholds-enabled');
  await postAction('set-monthly-reconciliation-enabled');
  await postAction('set-quarterly-vendor-review-enabled');

  await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, EXPECTED_INVOICE_NUMBER);
  await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, EXPECTED_INVOICE_AMOUNT);
  await kvSet(KV_VERCEL_CURRENT_INVOICE_PAID_KEY, false);
  await kvSet(KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY, false);
  await kvSet(KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY, false);
  await kvSet(KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY, false);
}

async function runTests(): Promise<void> {
  console.log('\n🧾 Vercel ownership route tests\n');

  await resetState();

  await test('POST rejects ownership updates before phone verification', async () => {
    const response = await postAction('set-ready');
    assert.strictEqual(response.status, 403);
    const body = await response.json() as { greska?: string };
    assert.strictEqual(body.greska, 'Telefonska verifikacija je obavezna pre ažuriranja Vercel ownership statusa.');
  });

  await test('approved/open invoice stays unpaid until paid or resolved', async () => {
    await seedApprovedOpenInvoiceState();
    const response = await GET();
    assert.strictEqual(response.status, 200);
    const body = await response.json() as {
      vercel: {
        checklist: { enterpriseRequestSpreman: boolean; enterpriseRequestPoslato: boolean };
        billingGovernance: { currentInvoice: { number: string; amountUsd: string; paid: boolean; evidenceCaptured: boolean } };
      };
      'sledećiKoraci': string[];
    };

    assert.strictEqual(body.vercel.checklist.enterpriseRequestSpreman, true);
    assert.strictEqual(body.vercel.checklist.enterpriseRequestPoslato, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.number, EXPECTED_INVOICE_NUMBER);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.amountUsd, EXPECTED_INVOICE_AMOUNT);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paid, false);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.evidenceCaptured, false);
    assert(body['sledećiKoraci'].includes(`⬜ Platiti fakturu ${EXPECTED_INVOICE_NUMBER} ($${EXPECTED_INVOICE_AMOUNT}) ili otvoriti support correction`));
    assert(body['sledećiKoraci'].includes('⬜ Sačuvati invoice PDF + payment dokaz + timestamp + odgovorno lice'));
  });

  await test('corrected invoice resolve requires prior correction request', async () => {
    await seedApprovedOpenInvoiceState();
    const response = await postAction('set-corrected-invoice-resolved');
    assert.strictEqual(response.status, 409);
    const body = await response.json() as { poruka?: string };
    assert.strictEqual(body.poruka, 'Nije aktivan correction workflow. Prvo pozvati set-invoice-correction-requested.');
  });

  await test('paid invoice still requires evidence until captured', async () => {
    await seedApprovedOpenInvoiceState();
    const paidResponse = await postAction('set-current-invoice-paid');
    assert.strictEqual(paidResponse.status, 200);
    const paidBody = await paidResponse.json() as { poruka?: string };
    assert.strictEqual(paidBody.poruka, `Trenutna faktura ${EXPECTED_INVOICE_NUMBER} je označena kao plaćena.`);

    const response = await GET();
    const body = await response.json() as {
      vercel: { billingGovernance: { currentInvoice: { paid: boolean; evidenceCaptured: boolean } } };
      'sledećiKoraci': string[];
    };

    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paid, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.evidenceCaptured, false);
    assert(body['sledećiKoraci'].includes(`✅ Trenutna faktura ${EXPECTED_INVOICE_NUMBER} je plaćena ili korigovana faktura je rešena`));
    assert(body['sledećiKoraci'].includes('⬜ Sačuvati invoice PDF + payment dokaz + timestamp + odgovorno lice'));

    await postAction('set-current-invoice-evidence-captured');
    const evidenceResponse = await GET();
    const evidenceBody = await evidenceResponse.json() as {
      vercel: { billingGovernance: { currentInvoice: { evidenceCaptured: boolean } } };
      'sledećiKoraci': string[];
    };

    assert.strictEqual(evidenceBody.vercel.billingGovernance.currentInvoice.evidenceCaptured, true);
    assert(evidenceBody['sledećiKoraci'].includes('✅ Sačuvan dokaz o uplati/invoice-u'));
  });

  await test('correction-requested plus resolved clears unpaid open invoice state', async () => {
    await seedApprovedOpenInvoiceState();
    const correctionResponse = await postAction('set-invoice-correction-requested');
    assert.strictEqual(correctionResponse.status, 200);

    const resolvedResponse = await postAction('set-corrected-invoice-resolved');
    assert.strictEqual(resolvedResponse.status, 200);

    const response = await GET();
    const body = await response.json() as {
      vercel: { billingGovernance: { currentInvoice: { paid: boolean; correctionRequested: boolean; correctedInvoiceResolved: boolean } } };
      'sledećiKoraci': string[];
    };

    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paid, false);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.correctionRequested, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.correctedInvoiceResolved, true);
    assert(body['sledećiKoraci'].includes(`✅ Trenutna faktura ${EXPECTED_INVOICE_NUMBER} je plaćena ili korigovana faktura je rešena`));
  });

  await resetState();

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
