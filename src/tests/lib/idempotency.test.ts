// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Idempotency
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/idempotency.test.ts

import {
  validateIdempotencyKey,
  generateIdempotencyKey,
  extractIdempotencyKey,
  withIdempotency,
  deleteIdempotencyRecord,
  IDEMPOTENCY_HEADER,
  IDEMPOTENCY_TTL_SEC,
  IDEMPOTENCY_KEY_MAX_LEN,
} from '../../lib/idempotency';

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

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🔑 Idempotency Test Suite\n');

  // ── Konstante ──────────────────────────────────────────────────────────────
  console.log('📋 Konstante');

  await test('IDEMPOTENCY_HEADER je ispravna vrednost', () => {
    assertEqual(IDEMPOTENCY_HEADER, 'Idempotency-Key', 'header naziv');
  });

  await test('IDEMPOTENCY_TTL_SEC je 24 sata', () => {
    assertEqual(IDEMPOTENCY_TTL_SEC, 86_400, 'TTL mora biti 86400 sekundi');
  });

  await test('IDEMPOTENCY_KEY_MAX_LEN je 255', () => {
    assertEqual(IDEMPOTENCY_KEY_MAX_LEN, 255, 'maksimalna dužina mora biti 255');
  });

  // ── validateIdempotencyKey ─────────────────────────────────────────────────
  console.log('\n✅ validateIdempotencyKey — validni ključevi');

  await test('UUID v4 je validan ključ', () => {
    const key = '550e8400-e29b-41d4-a716-446655440000';
    const result = validateIdempotencyKey(key);
    assert(result.valid === true, 'UUID mora biti validan');
    assert(result.reason === undefined, 'ne sme imati razlog za odbijanje');
  });

  await test('Alfanumerički ključ je validan', () => {
    const result = validateIdempotencyKey('checkout-abc123');
    assert(result.valid === true, 'alfanumerički ključ mora biti validan');
  });

  await test('Ključ sa tačkom i dvotačkom je validan', () => {
    const result = validateIdempotencyKey('order:123.456-789_abc');
    assert(result.valid === true, 'ključ sa specijalnim znakovima mora biti validan');
  });

  await test('Ključ sa slash-om je validan', () => {
    const result = validateIdempotencyKey('api/checkout/abc123');
    assert(result.valid === true, 'ključ sa / mora biti validan');
  });

  await test('Ključ maksimalne dužine je validan', () => {
    const key = 'a'.repeat(IDEMPOTENCY_KEY_MAX_LEN);
    const result = validateIdempotencyKey(key);
    assert(result.valid === true, `ključ dužine ${IDEMPOTENCY_KEY_MAX_LEN} mora biti validan`);
  });

  console.log('\n❌ validateIdempotencyKey — nevalidni ključevi');

  await test('Prazan ključ je nevalidan', () => {
    const result = validateIdempotencyKey('');
    assert(result.valid === false, 'prazan ključ mora biti nevalidan');
    assert(typeof result.reason === 'string', 'mora imati razlog');
  });

  await test('Ključ samo od razmaka je nevalidan', () => {
    const result = validateIdempotencyKey('   ');
    assert(result.valid === false, 'ključ od razmaka mora biti nevalidan');
  });

  await test('Predugačak ključ je nevalidan', () => {
    const key = 'a'.repeat(IDEMPOTENCY_KEY_MAX_LEN + 1);
    const result = validateIdempotencyKey(key);
    assert(result.valid === false, 'predugačak ključ mora biti nevalidan');
    assert(result.reason !== undefined, 'mora imati razlog');
  });

  await test('Ključ sa razmacima je nevalidan', () => {
    const result = validateIdempotencyKey('key with spaces');
    assert(result.valid === false, 'ključ sa razmacima mora biti nevalidan');
  });

  await test('Ključ sa specijalnim znakovima je nevalidan', () => {
    const result = validateIdempotencyKey('key@#$%');
    assert(result.valid === false, 'ključ sa @#$ mora biti nevalidan');
  });

  await test('Ključ sa srpskim slovima je nevalidan', () => {
    const result = validateIdempotencyKey('ključ-šdfgč');
    assert(result.valid === false, 'ključ sa srpskim slovima mora biti nevalidan');
  });

  // ── generateIdempotencyKey ─────────────────────────────────────────────────
  console.log('\n🎲 generateIdempotencyKey');

  await test('generateIdempotencyKey vraća validan UUID', () => {
    const key = generateIdempotencyKey();
    assert(typeof key === 'string', 'mora biti string');
    assert(key.length > 0, 'mora biti neprazan');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    assert(uuidRegex.test(key), `generirani ključ mora biti UUID: ${key}`);
  });

  await test('generateIdempotencyKey vraća jedinstvene ključeve', () => {
    const keys = new Set<string>();
    for (let i = 0; i < 10; i++) {
      keys.add(generateIdempotencyKey());
    }
    assertEqual(keys.size, 10, '10 generiranih ključeva mora biti jedinstveno');
  });

  await test('generateIdempotencyKey generiše validirabilni ključ', () => {
    const key = generateIdempotencyKey();
    const result = validateIdempotencyKey(key);
    assert(result.valid === true, 'generirani ključ mora proći validaciju');
  });

  // ── extractIdempotencyKey ──────────────────────────────────────────────────
  console.log('\n📤 extractIdempotencyKey');

  await test('Dohvata ključ iz Headers-like objekta (get metoda)', () => {
    const headers = {
      get: (h: string) => (h === 'Idempotency-Key' ? 'test-key-123' : null),
    };
    const key = extractIdempotencyKey(headers);
    assertEqual(key, 'test-key-123', 'mora dohvatiti ključ');
  });

  await test('Dohvata ključ iz plain objekta (Record)', () => {
    const headers: Record<string, string> = { 'Idempotency-Key': 'plain-key-456' };
    const key = extractIdempotencyKey(headers);
    assertEqual(key, 'plain-key-456', 'mora dohvatiti ključ iz plain objekta');
  });

  await test('Dohvata ključ case-insensitive iz plain objekta', () => {
    const headers: Record<string, string> = { 'idempotency-key': 'lower-case-key' };
    const key = extractIdempotencyKey(headers);
    assertEqual(key, 'lower-case-key', 'mora dohvatiti ključ lowercase');
  });

  await test('Vraća null ako header nije prisutan', () => {
    const headers = { get: (_h: string) => null };
    const key = extractIdempotencyKey(headers);
    assert(key === null, 'mora vratiti null ako nema headera');
  });

  await test('Vraća null iz praznog plain objekta', () => {
    const headers: Record<string, string> = {};
    const key = extractIdempotencyKey(headers);
    assert(key === null, 'mora vratiti null iz praznog objekta');
  });

  // ── withIdempotency ────────────────────────────────────────────────────────
  console.log('\n🔄 withIdempotency');

  await test('Izvršava fn i vraća fromCache=false za novi ključ', async () => {
    const key = `idem-test-${Date.now()}-1`;
    let callCount = 0;

    const result = await withIdempotency(key, async () => {
      callCount++;
      return { result: { value: 42 }, statusCode: 200 };
    });

    assert(result.fromCache === false, 'prvi poziv mora biti fromCache=false');
    assertEqual(callCount, 1, 'fn mora biti pozvan tačno jednom');
    assert(result.result.value === 42, 'rezultat mora biti ispravan');
    assertEqual(result.statusCode, 200, 'statusCode mora biti 200');
  });

  await test('Vraća keširani rezultat za isti ključ (fromCache=true)', async () => {
    const key = `idem-test-${Date.now()}-2`;
    let callCount = 0;

    await withIdempotency(key, async () => {
      callCount++;
      return { result: 'first-result', statusCode: 201 };
    });

    const cached = await withIdempotency(key, async () => {
      callCount++;
      return { result: 'second-result', statusCode: 201 };
    });

    assert(cached.fromCache === true, 'drugi poziv mora biti fromCache=true');
    assertEqual(cached.result as string, 'first-result', 'mora vratiti keširani rezultat');
    assertEqual(callCount, 1, 'fn mora biti pozvan samo jednom');
  });

  await test('Različiti ključevi se tretiraju kao različiti zahtevi', async () => {
    const key1 = `idem-test-${Date.now()}-3a`;
    const key2 = `idem-test-${Date.now()}-3b`;

    const r1 = await withIdempotency(key1, async () => ({ result: 'result-1', statusCode: 200 }));
    const r2 = await withIdempotency(key2, async () => ({ result: 'result-2', statusCode: 200 }));

    assert(r1.fromCache === false, 'prvi ključ mora biti fromCache=false');
    assert(r2.fromCache === false, 'drugi ključ mora biti fromCache=false');
    assert(r1.result !== r2.result, 'različiti ključevi moraju imati različite rezultate');
  });

  await test('Namespace razdvaja ključeve', async () => {
    const key = `idem-ns-test-${Date.now()}`;
    let callCountA = 0;
    let callCountB = 0;

    await withIdempotency(key, async () => {
      callCountA++;
      return { result: 'ns-a', statusCode: 200 };
    }, { namespace: 'ns-a' });

    await withIdempotency(key, async () => {
      callCountB++;
      return { result: 'ns-b', statusCode: 200 };
    }, { namespace: 'ns-b' });

    assertEqual(callCountA, 1, 'ns-a fn mora biti pozvan');
    assertEqual(callCountB, 1, 'ns-b fn mora biti pozvan — namespace razdvaja ključeve');
  });

  await test('deleteIdempotencyRecord uklanja keš', async () => {
    const key = `idem-del-test-${Date.now()}`;
    let callCount = 0;

    await withIdempotency(key, async () => {
      callCount++;
      return { result: 'to-delete', statusCode: 200 };
    });

    await deleteIdempotencyRecord(key);

    await withIdempotency(key, async () => {
      callCount++;
      return { result: 'after-delete', statusCode: 200 };
    });

    assertEqual(callCount, 2, 'fn mora biti pozvan dva puta posle brisanja');
  });

  await test('withIdempotency čuva statusCode iz originalnog poziva', async () => {
    const key = `idem-status-${Date.now()}`;

    await withIdempotency(key, async () => ({ result: 'created', statusCode: 201 }));
    const cached = await withIdempotency(key, async () => ({ result: 'ok', statusCode: 200 }));

    assertEqual(cached.statusCode, 201, 'keširani statusCode mora biti 201');
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
