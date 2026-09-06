import assert from 'node:assert';
import type { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/owner/vercel-ownership/route';
import { OWNER_PHONE_NUMBER_ENV_KEY } from '../../lib/constants';
import { requestOwnerOtp, verifyOwnerOtp } from '../../lib/owner-phone-auth';
import { kvSet } from '../../lib/kv-client';

const KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY = 'owner:vercel:current-invoice-number';
const KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY = 'owner:vercel:current-invoice-amount';
const KV_VERCEL_CURRENT_INVOICE_PAID_KEY = 'owner:vercel:current-invoice-paid';
const KV_VERCEL_CURRENT_INVOICE_EVIDENCE_KEY = 'owner:vercel:current-invoice-evidence-captured';
const KV_VERCEL_INVOICE_CORRECTION_REQUESTED_KEY = 'owner:vercel:invoice-correction-requested';
const KV_VERCEL_CORRECTED_INVOICE_RESOLVED_KEY = 'owner:vercel:corrected-invoice-resolved';
const KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY = 'owner:vercel:bank-statement-captured';
const KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY = 'owner:vercel:payment-reference-captured';
const KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY = 'owner:vercel:payment-reference-classification';
const EXPECTED_INVOICE_NUMBER = '5JJYX4KN-0015';
const EXPECTED_INVOICE_AMOUNT = '385.52';
const ORIGINAL_OWNER_PHONE_ENV = process.env[OWNER_PHONE_NUMBER_ENV_KEY];

let passed = 0;
let failed = 0;
const failures: string[] = [];
let scenarioCounter = 0;

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

async function expectOkAction(akcija: string) {
  const response = await postAction(akcija);
  assert.strictEqual(response.status, 200, `${akcija} should succeed`);
  return response;
}

async function resetState(): Promise<void> {
  await expectOkAction('reset');
}

function nextScenarioOwnerPhone(): string {
  scenarioCounter += 1;
  const phone = `+3816000${String(scenarioCounter).padStart(6, '0')}`;
  process.env[OWNER_PHONE_NUMBER_ENV_KEY] = phone;
  return phone;
}

function ensureVerifiedOwnerPhone(phone: string): void {
  const otpRequest = requestOwnerOtp(phone);
  assert(otpRequest.uspesno, 'owner OTP request must succeed in tests');
  assert(otpRequest.devOtp, 'dev OTP must be available in non-production tests');
  const otpVerify = verifyOwnerOtp(phone, otpRequest.devOtp);
  assert(otpVerify.uspesno, 'owner OTP verification must succeed in tests');
  assert(otpVerify.jeOwner, 'verified phone must belong to owner');
}

async function seedApprovedOpenInvoiceState(): Promise<void> {
  await resetState();
  const phone = nextScenarioOwnerPhone();
  ensureVerifiedOwnerPhone(phone);

  await expectOkAction('set-ready');
  await expectOkAction('set-submitted');
  await expectOkAction('set-billing-owner-locked');
  await expectOkAction('set-legal-intake-complete');
  await expectOkAction('set-enterprise-governed-model');
  await expectOkAction('set-invoice-requested');
  await expectOkAction('set-autopay-corporate-only');
  await expectOkAction('set-finance-channel-configured');
  await expectOkAction('set-finops-thresholds-enabled');
  await expectOkAction('set-monthly-reconciliation-enabled');
  await expectOkAction('set-quarterly-vendor-review-enabled');

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
  nextScenarioOwnerPhone();

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
        billingGovernance: {
          currentInvoice: { number: string; amountUsd: string; requested: boolean; paid: boolean; evidenceCaptured: boolean };
          publicAnnouncement: { status: string; blockers: string[] };
        };
      };
      'sledećiKoraci': string[];
    };

    assert.strictEqual(body.vercel.checklist.enterpriseRequestSpreman, true);
    assert.strictEqual(body.vercel.checklist.enterpriseRequestPoslato, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.number, EXPECTED_INVOICE_NUMBER);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.amountUsd, EXPECTED_INVOICE_AMOUNT);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.requested, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paid, false);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.evidenceCaptured, false);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.status, 'not-ready');
    assert(body.vercel.billingGovernance.publicAnnouncement.blockers.includes('Javno ozvaničenje je blokirano dok faktura nije plaćena ili korekcija nije rešena.'));
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

  await test('set-invoice-requested preserves already recorded invoice metadata', async () => {
    await resetState();
    const phone = nextScenarioOwnerPhone();
    ensureVerifiedOwnerPhone(phone);
    await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, 'CUSTOM-INVOICE-42');
    await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, '999.99');

    await expectOkAction('set-invoice-requested');

    const response = await GET();
    const body = await response.json() as {
      vercel: {
        billingGovernance: {
          currentInvoice: { number: string; amountUsd: string; requested: boolean };
        };
      };
    };

    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.number, 'CUSTOM-INVOICE-42');
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.amountUsd, '999.99');
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.requested, true);
  });

  await test('set-current-invoice-paid preserves already recorded invoice metadata', async () => {
    await resetState();
    const phone = nextScenarioOwnerPhone();
    ensureVerifiedOwnerPhone(phone);
    await kvSet(KV_VERCEL_CURRENT_INVOICE_NUMBER_KEY, 'CUSTOM-INVOICE-PAID');
    await kvSet(KV_VERCEL_CURRENT_INVOICE_AMOUNT_KEY, '777.77');
    await kvSet(KV_VERCEL_BANK_STATEMENT_CAPTURED_KEY, true);
    await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY, true);
    await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY, 'internal-only');

    await expectOkAction('set-current-invoice-paid');

    const response = await GET();
    const body = await response.json() as {
      vercel: {
        billingGovernance: {
          currentInvoice: {
            number: string;
            amountUsd: string;
            paid: boolean;
            bankStatementCaptured: boolean;
            paymentReferenceCaptured: boolean;
          };
          publicAnnouncement: { redacted: boolean; published: boolean };
        };
      };
    };

    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.number, 'CUSTOM-INVOICE-PAID');
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.amountUsd, '777.77');
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paid, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.bankStatementCaptured, false);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferenceCaptured, false);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.redacted, false);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.published, false);
  });

  await test('paid invoice still requires evidence until captured', async () => {
    await seedApprovedOpenInvoiceState();
    const paidResponse = await expectOkAction('set-current-invoice-paid');
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

    await expectOkAction('set-current-invoice-evidence-captured');
    const evidenceResponse = await GET();
    const evidenceBody = await evidenceResponse.json() as {
      vercel: { billingGovernance: { currentInvoice: { evidenceCaptured: boolean } } };
      'sledećiKoraci': string[];
    };

    assert.strictEqual(evidenceBody.vercel.billingGovernance.currentInvoice.evidenceCaptured, true);
    assert(evidenceBody['sledećiKoraci'].includes('✅ Sačuvan dokaz o uplati/invoice-u'));
  });

  await test('public announcement stays blocked until statement, barcode/reference, and redaction are captured', async () => {
    await seedApprovedOpenInvoiceState();
    await expectOkAction('set-current-invoice-paid');

    const blockedStatementBeforeEvidence = await postAction('set-bank-statement-captured');
    assert.strictEqual(blockedStatementBeforeEvidence.status, 409);
    const blockedStatementBody = await blockedStatementBeforeEvidence.json() as { poruka?: string };
    assert.strictEqual(
      blockedStatementBody.poruka,
      'Izvod platnog računa se beleži tek nakon resolved invoice i osnovnog payment dokaza.',
    );

    const blockedReferenceBeforeEvidence = await postAction('set-payment-reference-internal-only');
    assert.strictEqual(blockedReferenceBeforeEvidence.status, 409);
    const blockedReferenceBody = await blockedReferenceBeforeEvidence.json() as { poruka?: string };
    assert.strictEqual(
      blockedReferenceBody.poruka,
      'Barkod / payment reference se beleži tek nakon resolved invoice i osnovnog payment dokaza.',
    );

    await expectOkAction('set-current-invoice-evidence-captured');

    const blockedPublicSafeReference = await postAction('set-payment-reference-public-safe');
    assert.strictEqual(blockedPublicSafeReference.status, 409);
    const blockedPublicSafeBody = await blockedPublicSafeReference.json() as { poruka?: string };
    assert.strictEqual(
      blockedPublicSafeBody.poruka,
      'Public-safe klasifikacija zahteva prethodno approve-payment-reference-public-safe odobrenje.',
    );

    const blockedRedactionResponse = await postAction('set-public-announcement-redacted');
    assert.strictEqual(blockedRedactionResponse.status, 409);
    const blockedRedactionBody = await blockedRedactionResponse.json() as { poruka?: string };
    assert.strictEqual(
      blockedRedactionBody.poruka,
      'Redigovan javni sažetak se beleži tek nakon resolved invoice, payment dokaza, izvoda i klasifikovanog barkoda/payment reference.',
    );

    const blockedPublishResponse = await postAction('set-public-announcement-published');
    assert.strictEqual(blockedPublishResponse.status, 409);
    const blockedPublishBody = await blockedPublishResponse.json() as { poruka?: string };
    assert.strictEqual(
      blockedPublishBody.poruka,
      'Javno ozvaničenje je dozvoljeno tek kada postoje resolved invoice, payment dokaz, izvod, barkod/payment reference i redigovan javni sažetak.',
    );

    const response = await GET();
    const body = await response.json() as {
      vercel: {
        billingGovernance: {
          publicAnnouncement: { status: string; blockers: string[] };
        };
      };
      'sledećiKoraci': string[];
    };

    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.status, 'not-ready');
    assert(body.vercel.billingGovernance.publicAnnouncement.blockers.includes('Nedostaje izvod platnog računa.'));
    assert(body.vercel.billingGovernance.publicAnnouncement.blockers.includes('Nedostaje barkod / payment reference.'));
    assert(body.vercel.billingGovernance.publicAnnouncement.blockers.includes('Javni sažetak mora biti redigovan.'));
    assert(body['sledećiKoraci'].includes('⬜ Sačuvati izvod platnog računa sa vezom ka uplati'));
    assert(body['sledećiKoraci'].includes('⬜ Sačuvati barkod ili payment reference i klasifikovati ga'));
    assert(body['sledećiKoraci'].includes('⬜ Pripremiti redigovan audit-ready javni sažetak'));
  });

  await test('complete paid evidence package can be published as a redacted public announcement', async () => {
    await seedApprovedOpenInvoiceState();
    await expectOkAction('set-current-invoice-paid');
    await expectOkAction('set-current-invoice-evidence-captured');
    await expectOkAction('set-bank-statement-captured');
    await expectOkAction('set-payment-reference-internal-only');
    await expectOkAction('set-public-announcement-redacted');
    await expectOkAction('set-public-announcement-published');

    const response = await GET();
    const body = await response.json() as {
      vercel: {
        billingGovernance: {
          currentInvoice: {
            bankStatementCaptured: boolean;
            paymentReferenceCaptured: boolean;
            paymentReferenceClassification: string;
          };
          publicAnnouncement: { redacted: boolean; published: boolean; status: string; blockers: string[] };
        };
      };
      'sledećiKoraci': string[];
    };

    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.bankStatementCaptured, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferenceCaptured, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferenceClassification, 'internal-only');
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.redacted, true);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.published, true);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.status, 'published');
    assert.deepStrictEqual(body.vercel.billingGovernance.publicAnnouncement.blockers, []);
    assert(body['sledećiKoraci'].includes('✅ Javno ozvaničenje je objavljeno'));
  });

  await test('public-safe payment reference requires explicit approval before classification', async () => {
    await seedApprovedOpenInvoiceState();
    await expectOkAction('set-current-invoice-paid');
    await expectOkAction('set-current-invoice-evidence-captured');
    await expectOkAction('approve-payment-reference-public-safe');
    await expectOkAction('set-payment-reference-public-safe');

    const response = await GET();
    const body = await response.json() as {
      vercel: {
        billingGovernance: {
          currentInvoice: {
            paymentReferenceCaptured: boolean;
            paymentReferenceClassification: string;
            paymentReferencePublicSafeApproved: boolean;
          };
        };
      };
    };

    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferenceCaptured, true);
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferenceClassification, 'public-safe');
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferencePublicSafeApproved, true);
  });

  await test('approving public-safe classification invalidates prior announcement artifacts', async () => {
    await seedApprovedOpenInvoiceState();
    await expectOkAction('set-current-invoice-paid');
    await expectOkAction('set-current-invoice-evidence-captured');
    await expectOkAction('set-bank-statement-captured');
    await expectOkAction('set-payment-reference-internal-only');
    await expectOkAction('set-public-announcement-redacted');
    await expectOkAction('set-public-announcement-published');
    await expectOkAction('approve-payment-reference-public-safe');

    const response = await GET();
    const body = await response.json() as {
      vercel: {
        billingGovernance: {
          currentInvoice: { paymentReferencePublicSafeApproved: boolean };
          publicAnnouncement: { redacted: boolean; published: boolean };
        };
      };
    };

    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferencePublicSafeApproved, true);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.redacted, false);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.published, false);
  });

  await test('reclassifying a published public-safe reference to internal-only invalidates prior announcement artifacts', async () => {
    await seedApprovedOpenInvoiceState();
    await expectOkAction('set-current-invoice-paid');
    await expectOkAction('set-current-invoice-evidence-captured');
    await expectOkAction('set-bank-statement-captured');
    await expectOkAction('approve-payment-reference-public-safe');
    await expectOkAction('set-payment-reference-public-safe');
    await expectOkAction('set-public-announcement-redacted');
    await expectOkAction('set-public-announcement-published');
    await expectOkAction('set-payment-reference-internal-only');

    const response = await GET();
    const body = await response.json() as {
      vercel: {
        billingGovernance: {
          currentInvoice: {
            paymentReferenceClassification: string;
            paymentReferencePublicSafeApproved: boolean;
          };
          publicAnnouncement: { redacted: boolean; published: boolean };
        };
      };
    };

    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferenceClassification, 'internal-only');
    assert.strictEqual(body.vercel.billingGovernance.currentInvoice.paymentReferencePublicSafeApproved, false);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.redacted, false);
    assert.strictEqual(body.vercel.billingGovernance.publicAnnouncement.published, false);
  });

  await test('redaction rejects drifted public-safe reference without approval', async () => {
    await seedApprovedOpenInvoiceState();
    await expectOkAction('set-current-invoice-paid');
    await expectOkAction('set-current-invoice-evidence-captured');
    await expectOkAction('set-bank-statement-captured');
    await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CAPTURED_KEY, true);
    await kvSet(KV_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION_KEY, 'public-safe');

    const response = await postAction('set-public-announcement-redacted');
    assert.strictEqual(response.status, 409);
    const body = await response.json() as { poruka?: string };
    assert.strictEqual(
      body.poruka,
      'Redigovan javni sažetak se beleži tek nakon resolved invoice, payment dokaza, izvoda i klasifikovanog barkoda/payment reference.',
    );
  });

  await test('correction-requested plus resolved clears unpaid open invoice state', async () => {
    await seedApprovedOpenInvoiceState();
    await expectOkAction('set-invoice-correction-requested');

    await expectOkAction('set-corrected-invoice-resolved');

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
  if (ORIGINAL_OWNER_PHONE_ENV) {
    process.env[OWNER_PHONE_NUMBER_ENV_KEY] = ORIGINAL_OWNER_PHONE_ENV;
  } else {
    delete process.env[OWNER_PHONE_NUMBER_ENV_KEY];
  }

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
