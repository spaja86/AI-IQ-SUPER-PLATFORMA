// SpajaUltraOmegaCore -∞Ω+∞ — API Contract Testovi
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. Standardizovani API response format (src/lib/api/response.ts)
//   2. Rate limiter logiku (src/lib/rate-limit.ts)
//   3. Billing konfiguracija i plan konzistentnost
//   4. Evolution engine kontrakt
//
// Pokretanje: npx tsx src/tests/api/api-contracts.test.ts

// ─── Importi ──────────────────────────────────────────────────────────────────

import type { ApiError, ApiSuccess, ApiErrorCode } from '../../lib/api/response';
import { checkRateLimitGlobal, rateLimitKey, isKVConfigured } from '../../lib/rate-limit';
import { PLANOVI, getPlanById, getPlanByPriceId, UNLIMITED_CHAT } from '../../lib/stripe/config';
import {
  kreirajEvolucijskiCiklus,
  kreirajISnimiCiklus,
  getEvolucijskaIstorija,
  getEvolucijskaIstorijaAsync,
} from '../../lib/evolucija/engine';
import { APP_VERSION } from '../../lib/constants';

// ─── Minimal test runner ──────────────────────────────────────────────────────

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

function assertDefined<T>(value: T | null | undefined, label?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${label ?? 'assertDefined'}: value is ${String(value)}`);
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {

  // ── 1. API Response Format ─────────────────────────────────────────────────
  console.log('\n📋 API Response Format');

  await test('ApiError interfejs ima sva obavezna polja', () => {
    const sample: ApiError = {
      error: 'Test greška',
      code: 'BAD_REQUEST',
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    };
    assert(typeof sample.error === 'string', 'error mora biti string');
    assert(typeof sample.code === 'string', 'code mora biti string');
    assert(typeof sample.verzija === 'string', 'verzija mora biti string');
    assert(typeof sample.timestamp === 'string', 'timestamp mora biti string');
    assert(sample.timestamp.includes('T'), 'timestamp mora biti ISO format');
  });

  await test('ApiSuccess interfejs ima sva obavezna polja', () => {
    const sample: ApiSuccess<{ token: string }> = {
      data: { token: 'abc123' },
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    };
    assertDefined(sample.data, 'data');
    assert(typeof sample.data.token === 'string', 'data.token mora biti string');
    assertEqual(sample.verzija, APP_VERSION, 'verzija');
  });

  await test('Svi error kodovi su validni stringovi', () => {
    const kodovi: ApiErrorCode[] = [
      'BAD_REQUEST', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'CONFLICT',
      'UNPROCESSABLE_ENTITY', 'TOO_MANY_REQUESTS', 'INTERNAL_SERVER_ERROR',
      'SERVICE_UNAVAILABLE', 'CONFIGURATION_ERROR',
      'AUTH_INVALID_CREDENTIALS', 'AUTH_BRUTE_FORCE_BLOCKED',
      'AUTH_TOKEN_EXPIRED', 'AUTH_TOKEN_INVALID', 'AUTH_MFA_REQUIRED',
      'BILLING_PLAN_NOT_FOUND', 'BILLING_FREE_PLAN', 'BILLING_STRIPE_NOT_CONFIGURED',
      'BILLING_CHECKOUT_FAILED', 'CRON_UNAUTHORIZED',
    ];
    for (const kod of kodovi) {
      assert(typeof kod === 'string' && kod.length > 0, `Error kod '${kod}' mora biti neprazan string`);
      assert(!kod.includes(' '), `Error kod '${kod}' ne sme sadržati razmake`);
    }
    assert(kodovi.length >= 20, `Mora biti definisano najmanje 20 kodova, ima ${kodovi.length}`);
  });

  await test('APP_VERSION je definisana i nije prazna', () => {
    assert(typeof APP_VERSION === 'string', 'APP_VERSION mora biti string');
    assert(APP_VERSION.length > 0, 'APP_VERSION ne sme biti prazna');
    assert(APP_VERSION.includes('.'), 'APP_VERSION mora imati tačku (semver format)');
  });

  // ── 2. Rate Limiter ────────────────────────────────────────────────────────
  console.log('\n🚦 Rate Limiter');

  await test('checkRateLimitGlobal dozvoljava zahteve ispod limita', async () => {
    const key = `test-rl-${Date.now()}`;
    const result = await checkRateLimitGlobal(key, 10, 60);
    assert(result === true, 'prvi zahtev mora biti dozvoljen');
  });

  await test('checkRateLimitGlobal blokira zahteve iznad limita', async () => {
    const key = `test-rl-block-${Date.now()}`;
    const limit = 3;
    for (let i = 0; i < limit; i++) {
      await checkRateLimitGlobal(key, limit, 60);
    }
    const blocked = await checkRateLimitGlobal(key, limit, 60);
    assert(blocked === false, `${limit + 1}. zahtev mora biti blokiran`);
  });

  await test('rateLimitKey generiše konzistentan ključ', () => {
    const key1 = rateLimitKey('1.2.3.4', '/api/auth/login');
    const key2 = rateLimitKey('1.2.3.4', '/api/auth/login');
    assertEqual(key1, key2, 'isti ulaz mora dati isti ključ');
  });

  await test('rateLimitKey je različit za različite IP adrese', () => {
    const key1 = rateLimitKey('1.2.3.4', '/api/auth/login');
    const key2 = rateLimitKey('5.6.7.8', '/api/auth/login');
    assert(key1 !== key2, 'različite IP adrese moraju imati različite ključeve');
  });

  await test('rateLimitKey format je ispravan', () => {
    const key = rateLimitKey('1.2.3.4', '/api/auth/login');
    assert(key.startsWith('rl:'), 'ključ mora početi sa rl:');
    assert(key.includes('1.2.3.4'), 'ključ mora sadržati IP adresu');
  });

  await test('isKVConfigured vraća boolean', () => {
    const result = isKVConfigured();
    assert(typeof result === 'boolean', 'isKVConfigured mora vratiti boolean');
    assert(result === false, 'u test okruženju KV nije konfigurisan');
  });

  // ── 3. Billing — Stripe Planovi ───────────────────────────────────────────
  console.log('\n💳 Billing — Stripe Planovi');

  await test('Svi planovi imaju obavezna polja', () => {
    assert(PLANOVI.length > 0, 'mora biti definisan bar 1 plan');
    for (const plan of PLANOVI) {
      assertDefined(plan.id, `plan.id za ${plan.naziv}`);
      assertDefined(plan.naziv, `plan.naziv za ${plan.id}`);
      assert(typeof plan.cenaEur === 'number', `plan.cenaEur mora biti broj (${plan.id})`);
      assert(plan.cenaEur >= 0, `plan.cenaEur mora biti >= 0 (${plan.id})`);
      assert(Array.isArray(plan.funkcije), `plan.funkcije mora biti array (${plan.id})`);
      assert(plan.funkcije.length > 0, `plan.funkcije ne sme biti prazan array (${plan.id})`);
    }
  });

  await test('Planovi su sortirani po ceni (rastuće)', () => {
    for (let i = 1; i < PLANOVI.length; i++) {
      assert(
        PLANOVI[i].cenaEur >= PLANOVI[i - 1].cenaEur,
        `Plan ${PLANOVI[i].naziv} (${PLANOVI[i].cenaEur}€) mora biti skuplji od ${PLANOVI[i - 1].naziv}`,
      );
    }
  });

  await test('Starter plan je besplatan', () => {
    const starter = PLANOVI.find((p) => p.id === 'starter');
    assertDefined(starter, 'starter plan');
    assertEqual(starter.cenaEur, 0, 'starter cena mora biti 0');
    assertEqual(starter.stripePriceId, '', 'starter nema Stripe Price ID');
  });

  await test('Plaćeni planovi imaju chat limit > starter ili UNLIMITED', () => {
    const starter = PLANOVI.find((p) => p.id === 'starter');
    assertDefined(starter, 'starter plan');
    const plateniPlanovi = PLANOVI.filter((p) => p.cenaEur > 0);
    assert(plateniPlanovi.length > 0, 'mora biti bar 1 plaćeni plan');
    for (const plan of plateniPlanovi) {
      assert(
        plan.chatLimit > starter.chatLimit || plan.chatLimit === UNLIMITED_CHAT,
        `Plan ${plan.naziv} mora imati viši chat limit od starter-a ili biti UNLIMITED`,
      );
    }
  });

  await test('getPlanById vraća ispravan plan', () => {
    const plan = getPlanById('starter');
    assertDefined(plan, 'starter plan');
    assertEqual(plan.id, 'starter', 'id');
  });

  await test('getPlanById vraća undefined za nepostojeći plan', () => {
    const plan = getPlanById('nepostojeci-plan-xyz');
    assert(plan === undefined, 'nepostojeći plan mora vraćati undefined');
  });

  await test('getPlanByPriceId ne baca grešku za prazan priceId', () => {
    const plan = getPlanByPriceId('');
    assert(plan === undefined || typeof plan === 'object', 'ne sme baciti grešku');
  });

  // ── 4. Evolution Engine ───────────────────────────────────────────────────
  console.log('\n🧬 Evolution Engine');

  await test('kreirajEvolucijskiCiklus vraća validan ciklus', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    assertDefined(ciklus.id, 'ciklus.id');
    assertDefined(ciklus.pocetak, 'ciklus.pocetak');
    assertDefined(ciklus.dijagnostika, 'ciklus.dijagnostika');
    assertDefined(ciklus.akcije, 'ciklus.akcije');
    assert(Array.isArray(ciklus.akcije), 'akcije mora biti array');
    assertEqual(ciklus.status, 'zavrsen', 'status mora biti zavrsen');
  });

  await test('dijagnostika ima validno zdravlje (0-100)', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    const { zdravlje } = ciklus.dijagnostika;
    assert(typeof zdravlje === 'number', 'zdravlje mora biti broj');
    assert(zdravlje >= 0 && zdravlje <= 100, `zdravlje mora biti između 0 i 100, ima ${zdravlje}`);
  });

  await test('preporuke imaju obavezna polja', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    const { preporuke } = ciklus.dijagnostika;
    assert(Array.isArray(preporuke), 'preporuke mora biti array');
    assert(preporuke.length > 0, 'mora biti definisana bar 1 preporuka');
    for (const p of preporuke) {
      assertDefined(p.id, `preporuka.id`);
      assertDefined(p.naslov, `preporuka.naslov (${p.id})`);
      assertDefined(p.tip, `preporuka.tip (${p.id})`);
      assertDefined(p.prioritet, `preporuka.prioritet (${p.id})`);
      assertDefined(p.githubIssueNaslov, `githubIssueNaslov (${p.id})`);
      assertDefined(p.githubIssueTelo, `githubIssueTelo (${p.id})`);
      assert(
        ['popravka', 'optimizacija', 'nadogradnja', 'nova-funkcija', 'bezbednost'].includes(p.tip),
        `tip '${p.tip}' mora biti validan (${p.id})`,
      );
      assert(
        ['kritican', 'visok', 'srednji', 'nizak'].includes(p.prioritet),
        `prioritet '${p.prioritet}' mora biti validan (${p.id})`,
      );
    }
  });

  await test('akcije odgovaraju preporukama', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    for (const akcija of ciklus.akcije) {
      assertDefined(akcija.id, 'akcija.id');
      assertDefined(akcija.preporukaId, 'akcija.preporukaId');
      assertDefined(akcija.tip, 'akcija.tip');
      assertDefined(akcija.status, 'akcija.status');
      const preporuka = ciklus.dijagnostika.preporuke.find((p) => p.id === akcija.preporukaId);
      assertDefined(preporuka, `preporuka za akciju ${akcija.id}`);
    }
  });

  await test('getEvolucijskaIstorija vraća validnu istoriju', () => {
    const istorija = getEvolucijskaIstorija();
    assertDefined(istorija, 'istorija');
    assert(Array.isArray(istorija.ciklusi), 'ciklusi mora biti array');
    assert(istorija.ukupnoCiklusa >= 0, 'ukupnoCiklusa mora biti >= 0');
    assert(istorija.uspesnihCiklusa >= 0, 'uspesnihCiklusa mora biti >= 0');
    assert(
      istorija.uspesnihCiklusa <= istorija.ukupnoCiklusa,
      'uspesnihCiklusa ne sme biti > ukupnoCiklusa',
    );
  });

  await test('kreirajISnimiCiklus vraća validan ciklus (async, bez Supabase)', async () => {
    // U test okruženju Supabase nije konfigurisan — treba da vrati ciklus bez greške
    const ciklus = await kreirajISnimiCiklus();
    assertDefined(ciklus.id, 'ciklus.id');
    assertDefined(ciklus.pocetak, 'ciklus.pocetak');
    assertEqual(ciklus.status, 'zavrsen', 'status mora biti zavrsen');
    assert(ciklus.dijagnostika.zdravlje >= 0 && ciklus.dijagnostika.zdravlje <= 100, 'zdravlje 0-100');
  });

  await test('getEvolucijskaIstorijaAsync fallback na stub bez Supabase', async () => {
    // U test okruženju Supabase nije konfigurisan — mora da koristi sinhroni fallback
    const istorija = await getEvolucijskaIstorijaAsync();
    assertDefined(istorija, 'istorija');
    assert(Array.isArray(istorija.ciklusi), 'ciklusi mora biti array');
    assert(istorija.ukupnoCiklusa >= 1, 'mora biti bar 1 ciklus (stub fallback)');
    assertDefined(istorija.poslednjiCiklus, 'poslednjiCiklus');
  });

  // ── 5. Konzistentnost ID-jeva ─────────────────────────────────────────────
  console.log('\n🔑 Konzistentnost ID-jeva');

  await test('Evolucioni ciklusi imaju ispravan ID format', () => {
    const ciklus = kreirajEvolucijskiCiklus();
    assert(ciklus.id.startsWith('ciklus-'), `ID mora početi sa 'ciklus-': ${ciklus.id}`);
  });

  await test('Plan ID-jevi su konzistentni (bez razmaka, lowercase)', () => {
    for (const plan of PLANOVI) {
      assert(!plan.id.includes(' '), `plan.id '${plan.id}' ne sme sadržati razmake`);
      assertEqual(plan.id, plan.id.toLowerCase(), `plan.id '${plan.id}' mora biti lowercase`);
    }
  });

  // ── Rezultati ─────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('─'.repeat(50));

  if (failures.length > 0) {
    console.log('\nNeuspešni testovi:');
    for (const f of failures) {
      console.log(`  - ${f}`);
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err: unknown) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
