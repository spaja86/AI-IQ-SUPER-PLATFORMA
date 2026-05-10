// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Analytics Events
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/analytics-events.test.ts

import {
  trackEvent,
  flushAnalyticsEvents,
  getBufferSize,
  buildFunnelStats,
  determineUserSegment,
  registerAnalyticsFlush,
  FUNNEL_EVENTS,
  LTV_SIGNALS,
  COHORTS,
} from '../../lib/analytics-events';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// Helper za resetovanje buffer-a između testova
async function clearBuffer(): Promise<void> {
  await flushAnalyticsEvents();
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n📊 Analytics Events Test Suite\n');

  // ── Konstante ──────────────────────────────────────────────────────────────
  console.log('📋 Konstante');

  await test('FUNNEL_EVENTS sadrži sve ključne evente', () => {
    assert(typeof FUNNEL_EVENTS.PAGE_VIEW === 'string', 'PAGE_VIEW mora biti string');
    assert(typeof FUNNEL_EVENTS.SIGNUP_STARTED === 'string', 'SIGNUP_STARTED mora biti string');
    assert(typeof FUNNEL_EVENTS.SIGNUP_COMPLETED === 'string', 'SIGNUP_COMPLETED mora biti string');
    assert(typeof FUNNEL_EVENTS.CHECKOUT_STARTED === 'string', 'CHECKOUT_STARTED mora biti string');
    assert(typeof FUNNEL_EVENTS.CHECKOUT_COMPLETED === 'string', 'CHECKOUT_COMPLETED mora biti string');
    assert(typeof FUNNEL_EVENTS.AI_MESSAGE_SENT === 'string', 'AI_MESSAGE_SENT mora biti string');
    assert(typeof FUNNEL_EVENTS.GAME_STARTED === 'string', 'GAME_STARTED mora biti string');
  });

  await test('FUNNEL_EVENTS vrednosti su lowercase snake_case', () => {
    for (const [key, value] of Object.entries(FUNNEL_EVENTS)) {
      assert(typeof value === 'string', `${key} mora biti string`);
      assert(value === value.toLowerCase(), `${key} vrednost mora biti lowercase`);
      assert(!value.includes(' '), `${key} vrednost ne sme sadržati razmake`);
    }
  });

  await test('LTV_SIGNALS sadrži sve signal tipove', () => {
    assert(typeof LTV_SIGNALS.FIRST_PAYMENT === 'string', 'FIRST_PAYMENT mora biti string');
    assert(typeof LTV_SIGNALS.RECURRING_PAYMENT === 'string', 'RECURRING_PAYMENT mora biti string');
    assert(typeof LTV_SIGNALS.CHURN === 'string', 'CHURN mora biti string');
    assert(typeof LTV_SIGNALS.UPGRADE === 'string', 'UPGRADE mora biti string');
    assert(typeof LTV_SIGNALS.REACTIVATION === 'string', 'REACTIVATION mora biti string');
    assert(typeof LTV_SIGNALS.REFERRAL_CONVERTED === 'string', 'REFERRAL_CONVERTED mora biti string');
  });

  await test('COHORTS je neprazan niz sa ispravnom strukturom', () => {
    assert(Array.isArray(COHORTS), 'COHORTS mora biti niz');
    assert(COHORTS.length > 0, 'COHORTS mora biti neprazan');
    for (const cohort of COHORTS) {
      assert(typeof cohort.id === 'string' && cohort.id.length > 0, `cohort.id mora biti neprazan`);
      assert(typeof cohort.naziv === 'string', 'cohort.naziv mora biti string');
      assert(typeof cohort.entryEvent === 'string', 'cohort.entryEvent mora biti string');
      assert(typeof cohort.conversionEvent === 'string', 'cohort.conversionEvent mora biti string');
      assert(typeof cohort.windowDays === 'number' && cohort.windowDays > 0, 'cohort.windowDays mora biti pozitivan');
    }
  });

  await test('COHORTS ID-jevi su jedinstveni', () => {
    const ids = COHORTS.map((c) => c.id);
    const unique = new Set(ids);
    assert(ids.length === unique.size, 'cohort ID-jevi moraju biti jedinstveni');
  });

  // ── trackEvent ────────────────────────────────────────────────────────────
  console.log('\n📤 trackEvent');

  await test('trackEvent vraća enriched event sa eventId', async () => {
    await clearBuffer();
    const enriched = trackEvent({ tip: FUNNEL_EVENTS.PAGE_VIEW });
    assert(typeof enriched.eventId === 'string', 'eventId mora biti string');
    assert(enriched.eventId.startsWith('evt_'), 'eventId mora početi sa evt_');
    await clearBuffer();
  });

  await test('trackEvent postavlja timestamp ako nije naveden', async () => {
    await clearBuffer();
    const enriched = trackEvent({ tip: FUNNEL_EVENTS.SIGNUP_STARTED });
    assert(typeof enriched.timestamp === 'string', 'timestamp mora biti string');
    assert(enriched.timestamp.includes('T'), 'timestamp mora biti ISO format');
    await clearBuffer();
  });

  await test('trackEvent čuva zadati timestamp', async () => {
    await clearBuffer();
    const customTimestamp = '2026-01-01T12:00:00.000Z';
    const enriched = trackEvent({ tip: FUNNEL_EVENTS.PAGE_VIEW, timestamp: customTimestamp });
    assertEqual(enriched.timestamp, customTimestamp, 'mora čuvati zadati timestamp');
    await clearBuffer();
  });

  await test('trackEvent postavlja source na web po defaultu', async () => {
    await clearBuffer();
    const enriched = trackEvent({ tip: FUNNEL_EVENTS.AI_MESSAGE_SENT });
    assertEqual(enriched.source, 'web', 'podrazumevani source mora biti web');
    await clearBuffer();
  });

  await test('trackEvent čuva zadati source', async () => {
    await clearBuffer();
    const enriched = trackEvent({ tip: FUNNEL_EVENTS.GAME_STARTED, source: 'api' });
    assertEqual(enriched.source, 'api', 'mora čuvati zadati source');
    await clearBuffer();
  });

  await test('trackEvent čuva userId i sessionId', async () => {
    await clearBuffer();
    const enriched = trackEvent({
      tip: FUNNEL_EVENTS.CHECKOUT_STARTED,
      userId: 'user-123',
      sessionId: 'sess-456',
    });
    assertEqual(enriched.userId, 'user-123', 'userId mora biti sačuvan');
    assertEqual(enriched.sessionId, 'sess-456', 'sessionId mora biti sačuvan');
    await clearBuffer();
  });

  await test('trackEvent čuva properties', async () => {
    await clearBuffer();
    const enriched = trackEvent({
      tip: FUNNEL_EVENTS.AI_TOOL_USED,
      properties: { tool: 'web_search', duration: 1200 },
    });
    assert(enriched.properties !== undefined, 'properties moraju biti sačuvani');
    assertEqual((enriched.properties as Record<string, unknown>).tool as string, 'web_search', 'tool property mora biti sačuvan');
    await clearBuffer();
  });

  await test('trackEvent povećava buffer size', async () => {
    await clearBuffer();
    const before = getBufferSize();
    trackEvent({ tip: FUNNEL_EVENTS.SESSION_START });
    trackEvent({ tip: FUNNEL_EVENTS.SESSION_END });
    const after = getBufferSize();
    assert(after === before + 2, `buffer mora biti povećan za 2 (bio: ${before}, sada: ${after})`);
    await clearBuffer();
  });

  await test('Svaki event dobija jedinstven eventId', async () => {
    await clearBuffer();
    const ids = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const ev = trackEvent({ tip: FUNNEL_EVENTS.PAGE_VIEW });
      ids.add(ev.eventId);
    }
    assert(ids.size === 10, '10 evenata mora imati 10 jedinstvenih ID-jeva');
    await clearBuffer();
  });

  // ── flushAnalyticsEvents ───────────────────────────────────────────────────
  console.log('\n🚿 flushAnalyticsEvents');

  await test('flushAnalyticsEvents vraća empty array za prazan buffer', async () => {
    await clearBuffer();
    const flushed = await flushAnalyticsEvents();
    assert(Array.isArray(flushed), 'mora biti niz');
    assertEqual(flushed.length, 0, 'prazan buffer mora dati prazan niz');
  });

  await test('flushAnalyticsEvents vraća sve buffovane evente', async () => {
    await clearBuffer();
    trackEvent({ tip: FUNNEL_EVENTS.PAGE_VIEW });
    trackEvent({ tip: FUNNEL_EVENTS.PRICING_VIEW });
    trackEvent({ tip: FUNNEL_EVENTS.CHECKOUT_STARTED });

    const flushed = await flushAnalyticsEvents();
    assertEqual(flushed.length, 3, 'mora flushati sva 3 eventa');
  });

  await test('flushAnalyticsEvents prazni buffer', async () => {
    await clearBuffer();
    trackEvent({ tip: FUNNEL_EVENTS.LANDING_VIEW });
    await flushAnalyticsEvents();
    assertEqual(getBufferSize(), 0, 'buffer mora biti prazan posle flush-a');
  });

  await test('flushAnalyticsEvents poziva registrovani callback', async () => {
    await clearBuffer();
    let callbackEvents: unknown[] = [];
    registerAnalyticsFlush(async (events) => {
      callbackEvents = events;
    });

    trackEvent({ tip: FUNNEL_EVENTS.SIGNUP_COMPLETED, userId: 'u-1' });
    trackEvent({ tip: FUNNEL_EVENTS.EMAIL_VERIFIED, userId: 'u-1' });

    await flushAnalyticsEvents();

    assert(callbackEvents.length === 2, `callback mora primiti 2 eventa, primio: ${callbackEvents.length}`);

    // Reset callback
    registerAnalyticsFlush(async () => {});
    await clearBuffer();
  });

  // ── getBufferSize ──────────────────────────────────────────────────────────
  console.log('\n📦 getBufferSize');

  await test('getBufferSize vraća broj buffovanih eventa', async () => {
    await clearBuffer();
    assertEqual(getBufferSize(), 0, 'prazan buffer mora imati size 0');
    trackEvent({ tip: FUNNEL_EVENTS.PAGE_VIEW });
    assertEqual(getBufferSize(), 1, 'posle jednog eventa buffer mora biti 1');
    trackEvent({ tip: FUNNEL_EVENTS.PAGE_VIEW });
    assertEqual(getBufferSize(), 2, 'posle dva eventa buffer mora biti 2');
    await clearBuffer();
  });

  // ── buildFunnelStats ───────────────────────────────────────────────────────
  console.log('\n📈 buildFunnelStats');

  await test('buildFunnelStats računa conversion rate ispravno', () => {
    const steps = [
      { event: FUNNEL_EVENTS.PAGE_VIEW, naziv: 'Page View', count: 1000 },
      { event: FUNNEL_EVENTS.SIGNUP_STARTED, naziv: 'Signup Started', count: 200 },
      { event: FUNNEL_EVENTS.SIGNUP_COMPLETED, naziv: 'Signup Completed', count: 150 },
    ];
    const result = buildFunnelStats(steps);

    assertEqual(result.length, 3, 'mora biti 3 koraka');
    assertEqual(result[0].conversionRate, 1, 'prvi korak mora imati conversionRate 1');
    assertEqual(result[1].conversionRate, 0.2, '1000→200 mora biti 0.2');
    assertEqual(result[2].conversionRate, 0.75, '200→150 mora biti 0.75');
  });

  await test('buildFunnelStats čuva original podatke', () => {
    const steps = [
      { event: 'step_a', naziv: 'Korak A', count: 500 },
      { event: 'step_b', naziv: 'Korak B', count: 250 },
    ];
    const result = buildFunnelStats(steps);
    assertEqual(result[0].event, 'step_a', 'event mora biti sačuvan');
    assertEqual(result[0].naziv, 'Korak A', 'naziv mora biti sačuvan');
    assertEqual(result[0].count, 500, 'count mora biti sačuvan');
  });

  await test('buildFunnelStats vraća 0 conversionRate za prazan prethodni korak', () => {
    const steps = [
      { event: 'step_a', naziv: 'A', count: 0 },
      { event: 'step_b', naziv: 'B', count: 10 },
    ];
    const result = buildFunnelStats(steps);
    assertEqual(result[1].conversionRate, 0, 'mora biti 0 ako je prethodni korak 0');
  });

  await test('buildFunnelStats zaokružuje na 3 decimale', () => {
    const steps = [
      { event: 'step_a', naziv: 'A', count: 3 },
      { event: 'step_b', naziv: 'B', count: 1 },
    ];
    const result = buildFunnelStats(steps);
    // 1/3 = 0.333...
    assertEqual(result[1].conversionRate, 0.333, 'mora zaokružiti na 3 decimale');
  });

  await test('buildFunnelStats vraća prazan niz za prazan ulaz', () => {
    const result = buildFunnelStats([]);
    assertEqual(result.length, 0, 'prazan ulaz mora dati prazan niz');
  });

  await test('buildFunnelStats pravi realistični funnel (100% → 20% → 75%)', () => {
    const steps = [
      { event: FUNNEL_EVENTS.LANDING_VIEW, naziv: 'Landing', count: 10000 },
      { event: FUNNEL_EVENTS.PRICING_VIEW, naziv: 'Pricing', count: 2000 },
      { event: FUNNEL_EVENTS.CHECKOUT_STARTED, naziv: 'Checkout', count: 1500 },
      { event: FUNNEL_EVENTS.CHECKOUT_COMPLETED, naziv: 'Paid', count: 1200 },
    ];
    const result = buildFunnelStats(steps);

    assertEqual(result[0].conversionRate, 1, 'landing = 100%');
    assertEqual(result[1].conversionRate, 0.2, 'pricing = 20% od landing');
    assertEqual(result[2].conversionRate, 0.75, 'checkout started = 75% od pricing');
    assertEqual(result[3].conversionRate, 0.8, 'checkout completed = 80% od checkout started');
  });

  // ── determineUserSegment ───────────────────────────────────────────────────
  console.log('\n👤 determineUserSegment');

  await test('Otkazani korisnik sa prethodnim plaćanjem = churned', () => {
    const segment = determineUserSegment({
      plan: 'pro',
      messageCount: 50,
      daysSinceLastLogin: 5,
      hasEverPaid: true,
      isSubscriptionActive: false,
    });
    assertEqual(segment, 'churned', 'mora biti churned');
  });

  await test('Enterprise korisnik sa visokom aktivnošću = champion', () => {
    const segment = determineUserSegment({
      plan: 'enterprise',
      messageCount: 600,
      daysSinceLastLogin: 3,
      hasEverPaid: true,
      isSubscriptionActive: true,
    });
    assertEqual(segment, 'champion', 'mora biti champion');
  });

  await test('Enterprise korisnik sa niskom aktivnošću = enterprise', () => {
    const segment = determineUserSegment({
      plan: 'enterprise',
      messageCount: 100,
      daysSinceLastLogin: 10,
      hasEverPaid: true,
      isSubscriptionActive: true,
    });
    assertEqual(segment, 'enterprise', 'mora biti enterprise');
  });

  await test('Unlimited korisnik sa visokom aktivnošću = champion', () => {
    const segment = determineUserSegment({
      plan: 'unlimited',
      messageCount: 1000,
      daysSinceLastLogin: 1,
      hasEverPaid: true,
      isSubscriptionActive: true,
    });
    assertEqual(segment, 'champion', 'unlimited + visoka aktivnost mora biti champion');
  });

  await test('Pro korisnik bez aktivnosti dugo = at_risk', () => {
    const segment = determineUserSegment({
      plan: 'pro',
      messageCount: 200,
      daysSinceLastLogin: 15,
      hasEverPaid: true,
      isSubscriptionActive: true,
    });
    assertEqual(segment, 'at_risk', 'mora biti at_risk ako nije logovan 15 dana');
  });

  await test('Basic korisnik sa aktivnošću = paid', () => {
    const segment = determineUserSegment({
      plan: 'basic',
      messageCount: 30,
      daysSinceLastLogin: 2,
      hasEverPaid: true,
      isSubscriptionActive: true,
    });
    assertEqual(segment, 'paid', 'mora biti paid');
  });

  await test('Free korisnik sa malo poruka = free', () => {
    const segment = determineUserSegment({
      plan: 'starter',
      messageCount: 5,
      daysSinceLastLogin: 1,
      hasEverPaid: false,
      isSubscriptionActive: true,
    });
    assertEqual(segment, 'free', 'mora biti free');
  });

  await test('Free korisnik sa mnogo poruka = active_free', () => {
    const segment = determineUserSegment({
      plan: 'starter',
      messageCount: 10,
      daysSinceLastLogin: 1,
      hasEverPaid: false,
      isSubscriptionActive: true,
    });
    assertEqual(segment, 'active_free', 'mora biti active_free sa 10+ poruka');
  });

  await test('Free korisnik sa mnogo poruka (>10) = active_free', () => {
    const segment = determineUserSegment({
      plan: 'starter',
      messageCount: 50,
      daysSinceLastLogin: 3,
      hasEverPaid: false,
      isSubscriptionActive: true,
    });
    assertEqual(segment, 'active_free', 'mora biti active_free');
  });

  await test('Churned ima prednost nad ostalim segmentima', () => {
    // Čak i sa enterprise planom — ako nije aktivan i je plaćao, mora biti churned
    const segment = determineUserSegment({
      plan: 'enterprise',
      messageCount: 9999,
      daysSinceLastLogin: 1,
      hasEverPaid: true,
      isSubscriptionActive: false,
    });
    assertEqual(segment, 'churned', 'churned mora imati prednost');
  });

  await test('Korisnik bez prethodnog plaćanja i neaktivna pretplata = free segment', () => {
    const segment = determineUserSegment({
      plan: 'starter',
      messageCount: 3,
      daysSinceLastLogin: 30,
      hasEverPaid: false,
      isSubscriptionActive: false,
    });
    // Nema hasEverPaid=true, pa ne može biti churned. Mora biti free.
    assertEqual(segment, 'free', 'bez plaćanja mora biti free, ne churned');
  });

  // ─────────────────────────────────────────────────────────────────────────

  console.log('\n──────────────────────────────────────────────────');
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('──────────────────────────────────────────────────\n');

  if (failed > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Runner error:', error);
  process.exit(1);
});
