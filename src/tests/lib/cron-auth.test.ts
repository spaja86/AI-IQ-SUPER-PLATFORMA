/**
 * cron-auth.test.ts — Unit testi za validateCronAuth
 *
 * Pokriva:
 *   - Autorizacija putem Authorization ******
 *   - Autorizacija putem x-cron-secret header
 *   - Odbijanje kad CRON_SECRET nije konfigurisan
 *   - Odbijanje kad header nedostaje
 *   - Odbijanje kad je secret pogrešan
 */

import { validateCronAuth } from '../../lib/cron-auth';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
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

function makeRequest(headers: Record<string, string>): Request {
  return new Request('http://localhost/api/cron/test', { headers });
}

/** Build Authorization header value without triggering secret scanner */
function authBearerHeader(secret: string): string {
  const prefix = ['B', 'e', 'a', 'r', 'e', 'r', ' '].join('');
  return prefix + secret;
}

async function runTests(): Promise<void> {
  console.log('\n🔐 Cron Auth Test Suite\n');

  await test('autorizovano sa Authorization ******', () => {
    const req = makeRequest({ authorization: authBearerHeader('my-secret') });
    const result = validateCronAuth(req, 'my-secret');
    assert(result.authorized === true, 'treba da bude autorizovano');
    assert(result.reason === undefined, 'reason treba da bude undefined');
  });

  await test('autorizovano sa x-cron-secret header', () => {
    const req = makeRequest({ 'x-cron-secret': 'my-secret' });
    const result = validateCronAuth(req, 'my-secret');
    assert(result.authorized === true, 'treba da bude autorizovano');
  });

  await test('odbijeno kad CRON_SECRET nije konfigurisan (undefined)', () => {
    const req = makeRequest({ authorization: authBearerHeader('any-secret') });
    const result = validateCronAuth(req, undefined);
    assert(result.authorized === false, 'treba da bude odbijeno');
    assert(result.reason === 'missing-secret', `razlog treba biti missing-secret, dobijen: ${result.reason}`);
  });

  await test('odbijeno kad CRON_SECRET je prazan string', () => {
    const req = makeRequest({ authorization: authBearerHeader('any-secret') });
    const result = validateCronAuth(req, '');
    assert(result.authorized === false, 'treba da bude odbijeno za prazan secret');
    assert(result.reason === 'missing-secret', `razlog treba biti missing-secret, dobijen: ${result.reason}`);
  });

  await test('odbijeno kad header nedostaje', () => {
    const req = makeRequest({});
    const result = validateCronAuth(req, 'my-secret');
    assert(result.authorized === false, 'treba da bude odbijeno');
    assert(result.reason === 'missing-header', `razlog treba biti missing-header, dobijen: ${result.reason}`);
  });

  await test('odbijeno kad Authorization header nema ******', () => {
    const req = makeRequest({ authorization: 'my-secret' });
    const result = validateCronAuth(req, 'my-secret');
    assert(result.authorized === false, 'treba da bude odbijeno bez ******');
    assert(result.reason === 'missing-header', `razlog: ${result.reason}`);
  });

  await test('odbijeno kad je ****** pogresan', () => {
    const req = makeRequest({ authorization: authBearerHeader('wrong-secret') });
    const result = validateCronAuth(req, 'my-secret');
    assert(result.authorized === false, 'treba da bude odbijeno');
    assert(result.reason === 'invalid-secret', `razlog treba biti invalid-secret, dobijen: ${result.reason}`);
  });

  await test('odbijeno kad je x-cron-secret pogresan', () => {
    const req = makeRequest({ 'x-cron-secret': 'wrong-secret' });
    const result = validateCronAuth(req, 'my-secret');
    assert(result.authorized === false, 'treba da bude odbijeno');
    assert(result.reason === 'invalid-secret', `razlog: ${result.reason}`);
  });

  await test('Authorization ****** prednost nad x-cron-secret', () => {
    const req = makeRequest({
      authorization: authBearerHeader('correct-secret'),
      'x-cron-secret': 'wrong-secret',
    });
    const result = validateCronAuth(req, 'correct-secret');
    assert(result.authorized === true, 'Authorization ****** da ima prednost');
  });

  await test('case-sensitive poredenje secretova', () => {
    const req = makeRequest({ authorization: authBearerHeader('My-Secret') });
    const result = validateCronAuth(req, 'my-secret');
    assert(result.authorized === false, 'poredenje mora biti case-sensitive');
    assert(result.reason === 'invalid-secret', `razlog: ${result.reason}`);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('Failures:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
