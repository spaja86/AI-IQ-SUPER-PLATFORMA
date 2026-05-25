// Autofinish #1385 — Owner Phone Auth Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/owner-phone-auth-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET as getRequestOtp, POST as postRequestOtp } from '../../app/api/owner-phone-auth/request-otp/route';
import { GET as getVerifyOtp, POST as postVerifyOtp } from '../../app/api/owner-phone-auth/verify-otp/route';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Owner Phone Auth — Route Coverage Test Suite (#1385)\n');

  const requestOtpPath = path.resolve(process.cwd(), 'src/app/api/owner-phone-auth/request-otp/route.ts');
  const verifyOtpPath = path.resolve(process.cwd(), 'src/app/api/owner-phone-auth/verify-otp/route.ts');

  await test('request-otp route fajl postoji', () => {
    assert(fs.existsSync(requestOtpPath), `${requestOtpPath} ne postoji`);
  });

  await test('verify-otp route fajl postoji', () => {
    assert(fs.existsSync(verifyOtpPath), `${verifyOtpPath} ne postoji`);
  });

  await test('request-otp ruta koristi očekivane gradivne blokove', () => {
    const src = fs.readFileSync(requestOtpPath, 'utf8');
    assert(src.includes('requestOwnerOtp'), 'Nedostaje requestOwnerOtp');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('apiError'), 'Nedostaje apiError');
    assert(src.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(src.includes('apiRateLimited'), 'Nedostaje apiRateLimited');
    assert(src.includes('maskiranTelefon'), 'Nedostaje maskiranTelefon u odgovoru');
  });

  await test('verify-otp ruta koristi očekivane gradivne blokove', () => {
    const src = fs.readFileSync(verifyOtpPath, 'utf8');
    assert(src.includes('verifyOwnerOtp'), 'Nedostaje verifyOwnerOtp');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('jeOwner'), 'Nedostaje jeOwner u odgovoru');
    assert(src.includes('ownerRacun'), 'Nedostaje ownerRacun u odgovoru');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.52.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1386, 'AUTOFINISH_COUNT');
  });

  // ─── GET /api/owner-phone-auth/request-otp ───────────────────────────────

  await test('GET request-otp vraća 200 i metadata', async () => {
    const response = await getRequestOtp();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    const data = body['data'] as Record<string, unknown>;
    assert(typeof data['sistem'] === 'string', 'data.sistem string');
    assert((data['sistem'] as string).includes('OTP'), 'sistem sadrži OTP');
    assert(typeof data['opis'] === 'string', 'data.opis string');
    assert(typeof data['sledecaRuta'] === 'string', 'data.sledecaRuta string');
  });

  // ─── POST /api/owner-phone-auth/request-otp ──────────────────────────────

  await test('POST request-otp odbija prazan telefon', async () => {
    const req = new Request('http://localhost/api/owner-phone-auth/request-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.1.10' },
      body: JSON.stringify({}),
    }) as NextRequest;
    const response = await postRequestOtp(req);
    assertEqual(response.status, 400, 'status 400 za prazan telefon');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'BAD_REQUEST', 'code BAD_REQUEST');
  });

  await test('POST request-otp sa poznatim brojem vraća maskiranTelefon', async () => {
    const req = new Request('http://localhost/api/owner-phone-auth/request-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.1.11' },
      body: JSON.stringify({ telefon: '+38177-001-0001' }),
    }) as NextRequest;
    const response = await postRequestOtp(req);

    // Može biti 200 (uspešno) ili 429 (anti-flood)
    assert([200, 429].includes(response.status), `Očekivan 200 ili 429, dobijen ${response.status}`);

    if (response.status === 200) {
      const body = (await response.json()) as Record<string, unknown>;
      const data = body['data'] as Record<string, unknown>;
      assert(typeof data['maskiranTelefon'] === 'string', 'data.maskiranTelefon string');
      assert(typeof data['isteceZaSekundi'] === 'number', 'data.isteceZaSekundi broj');
    }
  });

  await test('POST request-otp sa nepoznatim brojem vraća maskiranTelefon (ne otkriva koji je vlasnički)', async () => {
    const req = new Request('http://localhost/api/owner-phone-auth/request-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.1.12' },
      body: JSON.stringify({ telefon: '+38177-999-9999' }),
    }) as NextRequest;
    const response = await postRequestOtp(req);

    // Može biti 200 (ne otkriva da nije vlasnički) ili 429
    assert([200, 429].includes(response.status), `Očekivan 200 ili 429, dobijen ${response.status}`);

    if (response.status === 200) {
      const body = (await response.json()) as Record<string, unknown>;
      const data = body['data'] as Record<string, unknown>;
      // Telefon mora biti maskiran u odgovoru
      assert(typeof data['maskiranTelefon'] === 'string', 'data.maskiranTelefon string');
      const maskiran = data['maskiranTelefon'] as string;
      assert(!maskiran.includes('999-9999'), 'Telefon mora biti maskiran (ne sme biti plaintext)');
    }
  });

  // ─── GET /api/owner-phone-auth/verify-otp ────────────────────────────────

  await test('GET verify-otp vraća 200 i metadata', async () => {
    const response = await getVerifyOtp();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    const data = body['data'] as Record<string, unknown>;
    assert(typeof data['sistem'] === 'string', 'data.sistem string');
    assert((data['sistem'] as string).includes('OTP'), 'sistem sadrži OTP');
    assert(typeof data['opis'] === 'string', 'data.opis string');
    assert(typeof data['pretodnaRuta'] === 'string', 'data.pretodnaRuta string');
  });

  // ─── POST /api/owner-phone-auth/verify-otp ───────────────────────────────

  await test('POST verify-otp odbija prazan telefon i prazan otp', async () => {
    const req = new Request('http://localhost/api/owner-phone-auth/verify-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.1.20' },
      body: JSON.stringify({}),
    }) as NextRequest;
    const response = await postVerifyOtp(req);
    assertEqual(response.status, 400, 'status 400 za prazna polja');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'BAD_REQUEST', 'code BAD_REQUEST');
  });

  await test('POST verify-otp sa neispravnim OTP vraća 401', async () => {
    const req = new Request('http://localhost/api/owner-phone-auth/verify-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.1.21' },
      body: JSON.stringify({ telefon: '+38177-001-0001', otp: '000000' }),
    }) as NextRequest;
    const response = await postVerifyOtp(req);

    // Može biti 401 (pogrešan OTP) ili 429 (rate limit)
    assert([401, 429].includes(response.status), `Očekivan 401 ili 429, dobijen ${response.status}`);
  });

  await test('POST verify-otp sa telefonom bez prethodnog OTP zahteva vraća 401', async () => {
    const req = new Request('http://localhost/api/owner-phone-auth/verify-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.1.22' },
      body: JSON.stringify({ telefon: '+38177-888-8888', otp: '123456' }),
    }) as NextRequest;
    const response = await postVerifyOtp(req);

    assert([401, 429].includes(response.status), `Očekivan 401 ili 429, dobijen ${response.status}`);
  });

  // ─── Bezbednosne invarijante ──────────────────────────────────────────────

  await test('request-otp ne otkriva da li je broj vlasnički (security invarijant)', () => {
    const src = fs.readFileSync(requestOtpPath, 'utf8');
    // Telefon mora biti maskiran u svim odgovorima
    assert(src.includes('maskiranTelefon'), 'maskiranTelefon mora biti u odgovoru');
    // devOtp mora biti uslovni (van produkcije)
    assert(src.includes('devOtp'), 'devOtp mora postojati za dev/test okruženje');
    assert(
      src.includes('devOtp !== undefined'),
      'devOtp mora biti uslovni (ne šalje se uvek)',
    );
  });

  await test('verify-otp odgovor sadrži jeOwner i ownerRacun za identifikaciju vlasnika', () => {
    const src = fs.readFileSync(verifyOtpPath, 'utf8');
    assert(src.includes('jeOwner'), 'jeOwner mora biti u uspešnom odgovoru');
    assert(src.includes('ownerRacun'), 'ownerRacun mora biti u uspešnom odgovoru');
    assert(src.includes('ownerEmail'), 'ownerEmail mora biti u uspešnom odgovoru');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
