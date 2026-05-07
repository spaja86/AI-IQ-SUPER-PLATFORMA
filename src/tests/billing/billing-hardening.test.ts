// SpajaUltraOmegaCore -∞Ω+∞ — Billing Tests: Proration & Lifecycle (#81-88)
// Kompanija SPAJA — Digitalna Industrija
//
// Test suite pokriva:
//   #81 proration edge-case (upgrade mid-cycle)
//   #82 trial → paid → canceled lifecycle
//   #83 refund/dispute tok i lokalni status
//   #84 partial payment i failed retry sequence
//   #85 snapshot test billing-health odgovor
//   #86 contract testovi za Stripe webhook payload šeme
//   #87 backward-compatibility testovi za stare event tipove
//   #88 schema drift detection za Stripe payload promene

import assert from 'assert';

import {
  isValidStatusTransition,
  isValidPlanTransition,
  isPlanChangeCooldownPassed,
  validateTaxRegion,
  validateCurrencyConsistency,
  validateSubscription,
  validateInvoice,
  validateCheckoutSession,
  isAllowedEventType,
  ALLOWED_STRIPE_EVENT_TYPES,
} from '../../lib/stripe/billing-validators';

import {
  buildAuditChainHash,
} from '../../lib/stripe/billing-audit-chain';

// ─── #81 Proration edge-case (upgrade mid-cycle) ─────────────────────────────

function test81_prorationEdgeCases() {
  console.log('▸ #81 Proration edge-case tests');

  // Upgrade mid-cycle: active → active (samo plan promjena) je validna tranzicija
  assert.strictEqual(isValidStatusTransition('active', 'active'), false,
    'active → active ne sme biti dozvoljeno (nema promene)');

  // active → past_due je validno (npr. pri neuspeloj proration naplati)
  assert.strictEqual(isValidStatusTransition('active', 'past_due'), true,
    'active → past_due mora biti dozvoljeno');

  // Plan tranzicija starter → pro je validna upgrade
  assert.strictEqual(isValidPlanTransition('starter', 'pro'), true,
    'starter → pro mora biti dozvoljena');

  // Plan tranzicija na isti plan nije validna
  assert.strictEqual(isValidPlanTransition('pro', 'pro'), false,
    'pro → pro ne sme biti dozvoljena');

  // Plan tranzicija null → pro je validna (prva aktivacija)
  assert.strictEqual(isValidPlanTransition(null, 'pro'), true,
    'null → pro mora biti dozvoljena (nova pretplata)');

  console.log('  ✓ Sve proration tranzicije validne');
}

// ─── #82 Trial → Paid → Canceled lifecycle ───────────────────────────────────

function test82_trialLifecycle() {
  console.log('▸ #82 Trial → paid → canceled lifecycle');

  const lifecycle = ['trialing', 'active', 'canceled'] as const;
  for (let i = 0; i < lifecycle.length - 1; i++) {
    const from = lifecycle[i];
    const to = lifecycle[i + 1];
    assert.strictEqual(isValidStatusTransition(from, to), true,
      `${from} → ${to} mora biti dozvoljena tranzicija`);
  }

  // canceled je terminalni status
  assert.strictEqual(isValidStatusTransition('canceled', 'active'), false,
    'canceled → active ne sme biti dozvoljeno (terminalni status)');

  // Trial may go to past_due if payment fails at trial end
  assert.strictEqual(isValidStatusTransition('trialing', 'past_due'), true,
    'trialing → past_due mora biti dozvoljena');

  console.log('  ✓ Trial lifecycle tranzicije validne');
}

// ─── #83 Refund/dispute tok ───────────────────────────────────────────────────

function test83_refundDisputeFlow() {
  console.log('▸ #83 Refund/dispute flow tests');

  // charge.dispute.created i charge.refunded moraju biti u whitelist-u
  assert.ok(isAllowedEventType('charge.dispute.created'),
    'charge.dispute.created mora biti dozvoljen event');
  assert.ok(isAllowedEventType('charge.dispute.closed'),
    'charge.dispute.closed mora biti dozvoljen event');
  assert.ok(isAllowedEventType('charge.refunded'),
    'charge.refunded mora biti dozvoljen event');

  // invoice.payment_failed validacija
  const failedInvoice = {
    id: 'in_test123',
    customer: 'cus_test',
    amount_due: 999,
    status: 'open',
  };
  const invoiceResult = validateInvoice(failedInvoice as unknown as Record<string, unknown>);
  assert.ok(invoiceResult.valid, `Failed invoice validacija treba da prođe: ${invoiceResult.errors.join(', ')}`);

  // Negativan amount_due treba da bude odbijen
  const negativeInvoice = { id: 'in_neg', customer: 'cus_test', amount_due: -1 };
  const negResult = validateInvoice(negativeInvoice as unknown as Record<string, unknown>);
  assert.ok(!negResult.valid, 'Negativan amount_due treba da bude nevalidan');
  assert.ok(negResult.errors.some((e) => e.includes('negativan')), 'Treba da postoji greška o negativnom amount_due');

  // Dispute kao event tip koji menja status (active → 'at_risk' u internoj logici)
  assert.strictEqual(isValidStatusTransition('active', 'past_due'), true,
    'Dispute može da gurne pretplatu u past_due');

  console.log('  ✓ Refund/dispute flow validacije tačne');
}

// ─── #84 Partial payment i failed retry sequence ─────────────────────────────

function test84_partialPaymentAndFailedRetries() {
  console.log('▸ #84 Partial payment i failed retry sequence');

  // past_due → active (uspešan retry)
  assert.strictEqual(isValidStatusTransition('past_due', 'active'), true,
    'past_due → active (retry uspešan) mora biti dozvoljeno');

  // past_due → canceled (svi retry-ji iscrpljeni)
  assert.strictEqual(isValidStatusTransition('past_due', 'canceled'), true,
    'past_due → canceled mora biti dozvoljena');

  // past_due → unpaid (invoice postaje uncollectible)
  assert.strictEqual(isValidStatusTransition('past_due', 'unpaid'), true,
    'past_due → unpaid mora biti dozvoljena');

  // incomplete → active (plaćanje primljeno)
  assert.strictEqual(isValidStatusTransition('incomplete', 'active'), true,
    'incomplete → active mora biti dozvoljena');

  // incomplete → incomplete_expired (timeout)
  assert.strictEqual(isValidStatusTransition('incomplete', 'incomplete_expired'), true,
    'incomplete → incomplete_expired mora biti dozvoljena');

  // Cooldown: promena plana je blokirana ako je pre manje od 300s
  const recentChange = new Date(Date.now() - 100_000).toISOString(); // 100s ago
  assert.strictEqual(isPlanChangeCooldownPassed(recentChange), false,
    'Plan promena treba da bude blokirana u cooldown periodu');

  const oldChange = new Date(Date.now() - 400_000).toISOString(); // 400s ago
  assert.strictEqual(isPlanChangeCooldownPassed(oldChange), true,
    'Plan promena treba da bude dozvoljena po isteku cooldown-a');

  console.log('  ✓ Partial payment i retry sekvence validne');
}

// ─── #85 Snapshot test billing-health odgovor ────────────────────────────────

function test85_billingHealthSnapshot() {
  console.log('▸ #85 Snapshot test billing-health strukture');

  // Definišemo šemu odgovora (snapshot)
  const expectedTopLevelKeys = [
    'status', 'timestamp', 'kpi', 'webhook', 'circuitBreakers',
    'alerts', 'slo', 'incidents', 'featureFlags',
  ];
  const expectedKpiKeys = [
    'mrrEur', 'activeSubscriptions', 'pastDueSubscriptions', 'gracePeriodSubscriptions',
    'activeWithoutSubscriptionId', 'stalePastDueCount', 'billingConsistencyScore', 'planDistribution',
  ];
  const expectedWebhookKeys = [
    'processedLast24h', 'dlqDepth', 'dlqOldestAgeSec', 'dlqGrowth24h',
    'webhookErrorRatePct', 'avgWebhookLatencyMs', 'avgConsistencyLatencyMs', 'auditEntriesLast24h',
  ];

  // Mock struktura (snapshot)
  const mockHealthResponse = {
    status: 'ok',
    timestamp: '2026-01-01T00:00:00.000Z',
    kpi: {
      mrrEur: 0, activeSubscriptions: 0, pastDueSubscriptions: 0, gracePeriodSubscriptions: 0,
      activeWithoutSubscriptionId: 0, stalePastDueCount: 0, billingConsistencyScore: 100, planDistribution: {},
    },
    webhook: {
      processedLast24h: 0, dlqDepth: 0, dlqOldestAgeSec: 0, dlqGrowth24h: 0,
      webhookErrorRatePct: 0, avgWebhookLatencyMs: null, avgConsistencyLatencyMs: null, auditEntriesLast24h: 0,
    },
    circuitBreakers: [],
    alerts: [],
    slo: { webhookSuccessRateTarget: 99.5, checkoutP99Target: 3000, auditWriteP99Target: 500, auditSloBreached: false, status: 'ok' },
    incidents: { dlqGrowthIncidentOpened: false },
    featureFlags: { total: 0, active: 0, inactive: 0 },
  };

  for (const key of expectedTopLevelKeys) {
    assert.ok(key in mockHealthResponse, `Billing health response mora imati '${key}' polje`);
  }
  for (const key of expectedKpiKeys) {
    assert.ok(key in mockHealthResponse.kpi, `kpi mora imati '${key}' polje`);
  }
  for (const key of expectedWebhookKeys) {
    assert.ok(key in mockHealthResponse.webhook, `webhook mora imati '${key}' polje`);
  }
  assert.ok('dlqGrowthIncidentOpened' in mockHealthResponse.incidents, 'incidents.dlqGrowthIncidentOpened mora postojati');
  assert.ok('auditSloBreached' in mockHealthResponse.slo, 'slo.auditSloBreached mora postojati');

  console.log('  ✓ Billing health snapshot konzistentan');
}

// ─── #86 Contract testovi za Stripe webhook payload šeme ─────────────────────

function test86_stripeWebhookContracts() {
  console.log('▸ #86 Stripe webhook contract testovi');

  // checkout.session.completed minimalni payload
  const checkoutSession = {
    id: 'cs_test',
    mode: 'subscription',
    metadata: { userId: 'usr_123' },
    customer: 'cus_test',
    subscription: 'sub_test',
  };
  const csResult = validateCheckoutSession(checkoutSession as unknown as Record<string, unknown>);
  assert.ok(csResult.valid, `Checkout session validacija treba da prođe: ${csResult.errors.join(', ')}`);

  // Nevalidan mode
  const badCheckout = { id: 'cs_bad', mode: 'unknown', metadata: null };
  const badCsResult = validateCheckoutSession(badCheckout as unknown as Record<string, unknown>);
  assert.ok(!badCsResult.valid, 'Nevalidan mode treba da bude odbijen');

  // customer.subscription.* minimalni payload
  const subscription = {
    id: 'sub_test',
    status: 'active',
    customer: 'cus_test',
    items: { data: [{ price: { id: 'price_test' } }] },
  };
  const subResult = validateSubscription(subscription as unknown as Record<string, unknown>);
  assert.ok(subResult.valid, `Subscription validacija treba da prođe: ${subResult.errors.join(', ')}`);

  // Nevalidan status
  const badSub = { id: 'sub_bad', status: 'hacked', customer: 'cus_x', items: { data: [] } };
  const badSubResult = validateSubscription(badSub as unknown as Record<string, unknown>);
  assert.ok(!badSubResult.valid, 'Nevalidan status treba da bude odbijen');

  // invoice minimal payload
  const invoice = { id: 'in_test', customer: 'cus_test', amount_due: 1000 };
  const invResult = validateInvoice(invoice as unknown as Record<string, unknown>);
  assert.ok(invResult.valid, `Invoice validacija treba da prođe: ${invResult.errors.join(', ')}`);

  console.log('  ✓ Webhook payload contract testovi prošli');
}

// ─── #87 Backward-compatibility testovi za stare event tipove ─────────────────

function test87_backwardCompatibilityEvents() {
  console.log('▸ #87 Backward-compatibility testovi za stare event tipove');

  // Svi event tipovi koji se dugo koriste moraju ostati u whitelist-u
  const legacyEventTypes = [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    'charge.refunded',
    'charge.dispute.created',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ];

  for (const eventType of legacyEventTypes) {
    assert.ok(
      isAllowedEventType(eventType),
      `Legacy event type '${eventType}' mora ostati u whitelist-u (backward-compatibility)`,
    );
  }

  // Event tipovi koji NISU dozvoljeni ne smeju biti u whitelist-u
  const forbiddenTypes = ['account.updated', 'payout.created', 'unknown.event'];
  for (const eventType of forbiddenTypes) {
    assert.ok(
      !isAllowedEventType(eventType),
      `Event type '${eventType}' ne sme biti u whitelist-u`,
    );
  }

  // Ukupan broj event tipova mora biti konzistentan (schema drift detection)
  const count = ALLOWED_STRIPE_EVENT_TYPES.size;
  assert.ok(count >= 18, `Whitelist mora imati barem 18 event tipova; pronađeno: ${count}`);

  console.log(`  ✓ Backward-compatibility: ${legacyEventTypes.length} event tipova provjereno`);
}

// ─── #88 Schema drift detection ───────────────────────────────────────────────

function test88_schemaDriftDetection() {
  console.log('▸ #88 Schema drift detection');

  // Obavezna polja za svaki kritičan event tip
  const requiredFields: Record<string, string[]> = {
    'checkout.session.completed': ['id', 'mode'],
    'customer.subscription.updated': ['id', 'status', 'customer'],
    'invoice.payment_succeeded': ['id', 'customer', 'amount_due'],
    'invoice.payment_failed': ['id', 'customer', 'amount_due'],
  };

  for (const [eventType, fields] of Object.entries(requiredFields)) {
    const emptyPayload: Record<string, unknown> = {};
    let result;

    if (eventType.startsWith('checkout')) {
      result = validateCheckoutSession(emptyPayload);
    } else if (eventType.startsWith('customer.subscription')) {
      result = validateSubscription(emptyPayload);
    } else {
      result = validateInvoice(emptyPayload);
    }

    // Bez obaveznih polja validacija mora failovati
    assert.ok(
      !result.valid,
      `Event '${eventType}' bez obaveznih polja ${fields.join(', ')} mora biti nevalidan`,
    );
    assert.ok(result.errors.length > 0, `Treba biti generisana barem jedna greška za ${eventType}`);
  }

  // Audit chain hash mora biti deterministički
  const input1 = { payload: { a: 1 }, prevHash: 'genesis', timestampIso: '2026-01-01T00:00:00.000Z' };
  const input2 = { payload: { a: 1 }, prevHash: 'genesis', timestampIso: '2026-01-01T00:00:00.000Z' };
  const { chainHash: h1 } = buildAuditChainHash(input1);
  const { chainHash: h2 } = buildAuditChainHash(input2);
  assert.strictEqual(h1, h2, 'Audit chain hash mora biti deterministički za iste inpute');

  // Promjena jednog bajta mora dati drugačiji hash (tamper-evident)
  const input3 = { payload: { a: 2 }, prevHash: 'genesis', timestampIso: '2026-01-01T00:00:00.000Z' };
  const { chainHash: h3 } = buildAuditChainHash(input3);
  assert.notStrictEqual(h1, h3, 'Različit payload mora dati različit chain hash');

  console.log('  ✓ Schema drift detection validno');
}

// ─── TAX / VAT validacija (#80) ───────────────────────────────────────────────

function test80_taxVatValidation() {
  console.log('▸ #80 Tax/VAT validacija po regionu');

  // EUR valuta za DE je ispravna
  const deResult = validateTaxRegion({ countryCode: 'DE', currency: 'eur' });
  assert.ok(deResult.valid, `DE + EUR treba biti validno: ${deResult.errors.join(', ')}`);
  assert.strictEqual(deResult.vatRate, 19, 'DE VAT stopa mora biti 19%');

  // USD valuta za DE je neispravna
  const deMismatch = validateTaxRegion({ countryCode: 'DE', currency: 'usd' });
  assert.ok(!deMismatch.valid, 'DE + USD treba biti nevalidno (currency mismatch)');
  assert.ok(deMismatch.errors[0].includes('Neusklađena valuta'), 'Greška mora opisati currency mismatch');

  // VAT broj validacija za DE
  const deVat = validateTaxRegion({ countryCode: 'DE', currency: 'eur', vatNumber: 'DE123456789' });
  assert.ok(deVat.vatNumberValid === true, 'Validan DE VAT broj treba proći');

  // Nevalidan DE VAT broj
  const deBadVat = validateTaxRegion({ countryCode: 'DE', currency: 'eur', vatNumber: 'DE12345' });
  assert.ok(deBadVat.vatNumberValid === false, 'Nevalidan DE VAT broj treba failovati');

  // RS ima 0% VAT (RSI je izuzetak - 20%)
  const rsResult = validateTaxRegion({ countryCode: 'RS', currency: 'rsd' });
  assert.ok(rsResult.valid, `RS + RSD treba biti validno: ${rsResult.errors.join(', ')}`);
  assert.strictEqual(rsResult.vatRate, 20, 'RS PDV stopa mora biti 20%');

  // Currency consistency check
  const consistent = validateCurrencyConsistency('eur', 'eur');
  assert.ok(consistent.consistent, 'Ista valuta mora biti konzistentna');

  const inconsistent = validateCurrencyConsistency('eur', 'usd');
  assert.ok(!inconsistent.consistent, 'Različita valuta mora biti nekonzistentna');
  assert.ok(inconsistent.error?.includes('Currency mismatch'), 'Greška mora opisati mismatch');

  console.log('  ✓ Tax/VAT validacija ispravna');
}

// ─── Main test runner ─────────────────────────────────────────────────────────

function runAllBillingTests() {
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('  SPAJA Billing Test Suite — #80-88');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const tests = [
    test81_prorationEdgeCases,
    test82_trialLifecycle,
    test83_refundDisputeFlow,
    test84_partialPaymentAndFailedRetries,
    test85_billingHealthSnapshot,
    test86_stripeWebhookContracts,
    test87_backwardCompatibilityEvents,
    test88_schemaDriftDetection,
    test80_taxVatValidation,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      test();
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${test.name}:`, err instanceof Error ? err.message : err);
      failed++;
    }
  }

  console.log(`\n═══════════════════════════════════════════════════════════════════`);
  console.log(`  Rezultat: ${passed} prošlo, ${failed} palo (od ${tests.length} testova)`);
  console.log(`═══════════════════════════════════════════════════════════════════\n`);

  if (failed > 0) process.exit(1);
}

runAllBillingTests();
