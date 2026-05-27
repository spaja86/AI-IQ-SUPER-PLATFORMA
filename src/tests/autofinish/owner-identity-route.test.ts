// Autofinish #1353 — Owner Identity & Phone Auth Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/owner-identity-route.test.ts
// Napomena: Ovaj test je inicijalno dodat u iteraciji #1353 i održava se kroz naredne iteracije.

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT, OWNER_EMAIL, OWNER_BANK_RACUN_ID } from '../../lib/constants';
import { maskirajTelefon, isOwnerEmail, getOwnerIdentity, getOwnerInstalacionaPoruka } from '../../lib/owner-identity';
import { requestOwnerOtp, verifyOwnerOtp, getOtpStatus } from '../../lib/owner-phone-auth';

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
  console.log('\n🏁 Owner Identity & Phone Auth — Route Coverage Test Suite (#1353)\n');

  // ─── Fajl provere ─────────────────────────────────────────────────────────

  const fajlovi = [
    'src/lib/owner-identity.ts',
    'src/lib/owner-phone-auth.ts',
    'src/app/api/owner-phone-auth/request-otp/route.ts',
    'src/app/api/owner-phone-auth/verify-otp/route.ts',
    'src/app/api/owner-identity/route.ts',
    'src/app/api/owner-account-bank/route.ts',
  ];

  for (const fajl of fajlovi) {
    const fullPath = path.resolve(process.cwd(), fajl);
    await test(`Fajl postoji: ${fajl}`, () => {
      assert(fs.existsSync(fullPath), `${fullPath} ne postoji`);
    });
  }

  // ─── Konstante ────────────────────────────────────────────────────────────

  await test('Konstante su ispravne', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1359, 'AUTOFINISH_COUNT baseline');
    assertEqual(OWNER_EMAIL, 'spajicn@yahoo.com', 'OWNER_EMAIL');
    assertEqual(OWNER_BANK_RACUN_ID, 'DIGI-IND-001', 'OWNER_BANK_RACUN_ID');
  });

  // ─── maskirajTelefon ───────────────────────────────────────────────────────

  await test('maskirajTelefon maskira sredinu broja', () => {
    const maskiran = maskirajTelefon('+38177-001-0001');
    assert(!maskiran.includes('001-0'), 'Sredina broja ne sme biti vidljiva');
    assert(maskiran.startsWith('+381'), 'Treba početi sa +381');
    assert(maskiran.endsWith('0001'), 'Treba završiti sa 0001');
  });

  await test('maskirajTelefon vraća **** za kratke brojeve', () => {
    const maskiran = maskirajTelefon('1234');
    assertEqual(maskiran, '****', 'Kratki broj');
  });

  // ─── isOwnerEmail ──────────────────────────────────────────────────────────

  await test('isOwnerEmail prepoznaje vlasnika', () => {
    assert(isOwnerEmail('spajicn@yahoo.com'), 'lowercase');
    assert(isOwnerEmail('SPAJICN@YAHOO.COM'), 'uppercase');
    assert(isOwnerEmail('  spajicn@yahoo.com  '), 'sa razmacima');
    assert(!isOwnerEmail('drugi@yahoo.com'), 'tuđi email');
  });

  // ─── getOwnerIdentity ─────────────────────────────────────────────────────

  await test('getOwnerIdentity vraća ispravne podatke', () => {
    const identity = getOwnerIdentity('nije-verifikovan');
    assertEqual(identity.email, 'spajicn@yahoo.com', 'email');
    assertEqual(identity.githubOwner, 'spaja86', 'githubOwner');
    assertEqual(identity.bankRacun.id, 'DIGI-IND-001', 'bankRacun.id');
    assertEqual(identity.bankRacun.banka, 'AI IQ World Bank', 'bankRacun.banka');
    assertEqual(identity.bankRacun.status, 'aktivan', 'bankRacun.status');
    assert(!identity.verifikovan, 'nije verifikovan bez OTP-a');
  });

  await test('getOwnerIdentity — verifikovan telefon', () => {
    const identity = getOwnerIdentity('verifikovan', new Date().toISOString());
    assert(identity.verifikovan, 'verifikovan');
    assertEqual(identity.telefon.status, 'verifikovan', 'telefon.status');
    assert(identity.telefon.instalacioniSpremnost, 'instalacioniSpremnost');
    assert(identity.vercel.checklist.phoneVerified, 'vercel.checklist.phoneVerified');
    assertEqual(identity.vercel.blokator, null, 'nema blokatora kada je verifikovan');
  });

  await test('getOwnerIdentity — nije verifikovan ima blokator', () => {
    const identity = getOwnerIdentity('nije-verifikovan');
    assert(!identity.vercel.checklist.phoneVerified, 'phoneVerified false');
    assert(typeof identity.vercel.blokator === 'string', 'blokator postoji');
    assert(identity.vercel.blokator!.length > 0, 'blokator nije prazan');
  });

  await test('getOwnerIdentity — telefon je uvek maskiran', () => {
    const identity = getOwnerIdentity('nije-verifikovan');
    const maskiranBroj = identity.telefon.maskiranBroj;
    // Pun broj ne sme biti vidljiv (ne sme sadržati 001-0001 ni razmaknuto)
    assert(!maskiranBroj.includes('001-0'), 'Sredina nije maskirana');
  });

  // ─── getOwnerInstalacionaPoruka ───────────────────────────────────────────

  await test('getOwnerInstalacionaPoruka vraća instrukcije za dodelu-broja', () => {
    const poruka = getOwnerInstalacionaPoruka('dodela-broja', 'nije-verifikovan');
    assertEqual(poruka.tip, 'dodela-broja', 'tip');
    assertEqual(poruka.racunBroj, 'DIGI-IND-001', 'racunBroj');
    assert(poruka.instrukcije.length > 0, 'instrukcije nisu prazne');
    assert(poruka.poruka.includes('DIGI-IND-001'), 'poruka sadrži račun');
  });

  await test('getOwnerInstalacionaPoruka za potvrdu sadrži Vercel korak', () => {
    const poruka = getOwnerInstalacionaPoruka('potvrda', 'verifikovan');
    assert(poruka.instrukcije.some(i => i.toLowerCase().includes('vercel')), 'Vercel korak u instrukcijama');
  });

  // ─── OTP flow ──────────────────────────────────────────────────────────────

  await test('requestOwnerOtp vraća maskiran telefon i devOtp u dev okruženju', () => {
    const rezultat = requestOwnerOtp('+38177-001-0001');
    assert(rezultat.uspesno, 'uspesno');
    assert(typeof rezultat.maskiranTelefon === 'string', 'maskiranTelefon string');
    assert(!rezultat.maskiranTelefon.includes('001-0'), 'maskiran — sredina nije vidljiva');
    assert(rezultat.isteceZaSekundi > 0, 'isteceZaSekundi > 0');
    // devOtp dostupan van produkcije
    if (process.env.NODE_ENV !== 'production') {
      assert(typeof rezultat.devOtp === 'string', 'devOtp postoji van produkcije');
      assert(rezultat.devOtp!.length === 6, 'devOtp je 6 cifara');
      assert(/^\d{6}$/.test(rezultat.devOtp!), 'devOtp sadrži samo cifre');
    }
  });

  await test('verifyOwnerOtp — neispravan OTP vraća grešku', () => {
    const tel = '+38177-777-0001';
    requestOwnerOtp(tel);
    const rez = verifyOwnerOtp(tel, '000000');
    assert(!rez.uspesno, 'nije uspesno');
    assert(!rez.jeOwner, 'jeOwner false');
  });

  await test('verifyOwnerOtp — ispravni OTP za vlasnički broj', () => {
    const tel = '+38177-001-0001';
    const reqRez = requestOwnerOtp(tel);
    assert(reqRez.uspesno, 'OTP zahtev uspešan');

    if (process.env.NODE_ENV !== 'production' && reqRez.devOtp) {
      const rez = verifyOwnerOtp(tel, reqRez.devOtp);
      assert(rez.uspesno, 'verifikacija uspešna');
      assert(rez.jeOwner, 'jeOwner true za vlasnički broj');
      assertEqual(rez.ownerRacun, 'DIGI-IND-001', 'ownerRacun');
      assertEqual(rez.ownerEmail, 'spajicn@yahoo.com', 'ownerEmail');
    }
  });

  await test('verifyOwnerOtp — iskorišćeni OTP se ne može reupotrebiti', () => {
    const tel = '+38177-002-0002';
    const reqRez = requestOwnerOtp(tel);

    if (process.env.NODE_ENV !== 'production' && reqRez.devOtp) {
      verifyOwnerOtp(tel, reqRez.devOtp); // Prva upotreba
      const rez2 = verifyOwnerOtp(tel, reqRez.devOtp); // Druga upotreba
      assert(!rez2.uspesno, 'Iskorišćeni OTP ne prolazi');
    }
  });

  await test('getOtpStatus vraća null za nepoznat broj', () => {
    const status = getOtpStatus('+99999-999-9999');
    assertEqual(status, null, 'null za nepoznat broj');
  });

  await test('Anti-flood: previše zahteva blokira naredni', () => {
    const tel = '+38177-flood-001';
    // Koristimo novi broj — prve 3 su ok, 4. blokira
    requestOwnerOtp(tel);
    requestOwnerOtp(tel);
    requestOwnerOtp(tel);
    const rez4 = requestOwnerOtp(tel);
    assert(!rez4.uspesno, 'Anti-flood blokira 4. zahtev');
  });

  // ─── API route fajlovi — source provera ────────────────────────────────────

  await test('request-otp route koristi rate limit i maskirajTelefon', () => {
    const src = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/api/owner-phone-auth/request-otp/route.ts'),
      'utf8',
    );
    assert(src.includes('checkRateLimitGlobal'), 'checkRateLimitGlobal');
    assert(src.includes('requestOwnerOtp'), 'requestOwnerOtp');
    assert(src.includes('devOtp'), 'devOtp guard');
  });

  await test('verify-otp route koristi rate limit i verifyOwnerOtp', () => {
    const src = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/api/owner-phone-auth/verify-otp/route.ts'),
      'utf8',
    );
    assert(src.includes('checkRateLimitGlobal'), 'checkRateLimitGlobal');
    assert(src.includes('verifyOwnerOtp'), 'verifyOwnerOtp');
    assert(src.includes('jeOwner'), 'jeOwner');
  });

  await test('owner-identity route koristi getOwnerIdentity i getOwnerInstalacionaPoruka', () => {
    const src = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/api/owner-identity/route.ts'),
      'utf8',
    );
    assert(src.includes('getOwnerIdentity'), 'getOwnerIdentity');
    assert(src.includes('getOwnerInstalacionaPoruka'), 'getOwnerInstalacionaPoruka');
    assert(src.includes('blokator'), 'blokator polje');
  });

  await test('owner-account-bank route koristi getOwnerIdentity', () => {
    const src = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/api/owner-account-bank/route.ts'),
      'utf8',
    );
    assert(src.includes('getOwnerIdentity'), 'getOwnerIdentity');
    assert(src.includes('vercelBillingRef'), 'vercelBillingRef');
    assert(src.includes('DIGI-IND-001') || src.includes('racun.brojRacuna'), 'račun referenca');
  });

  await test('login route koristi isOwnerEmail umesto hardkodovanog emaila', () => {
    const src = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/api/login/route.ts'),
      'utf8',
    );
    assert(src.includes('isOwnerEmail'), 'isOwnerEmail');
    // Proveravamo da email nije hardkodovan ni sa single ni sa double quotes
    assert(!src.includes('spajicn@yahoo.com'), 'Nema hardkodovanog email stringa u login ruti');
  });

  await test('enterprise-zahtevi route sadrži ownerChecklist i vercelBlokator', () => {
    const src = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/api/enterprise-zahtevi/route.ts'),
      'utf8',
    );
    assert(src.includes('ownerChecklist'), 'ownerChecklist');
    assert(src.includes('vercelBlokator'), 'vercelBlokator');
    assert(src.includes('getOwnerPhoneVerifikacijaStatus'), 'getOwnerPhoneVerifikacijaStatus');
  });

  // ─── GET rute — endpoint testovi ──────────────────────────────────────────

  await test('GET /api/owner-identity vraća 200 i očekivana polja', async () => {
    const { GET } = await import('../../app/api/owner-identity/route');
    const response = await GET();
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['owner'] === 'object', 'owner objekat');
    assert(typeof body['telefon'] === 'object', 'telefon objekat');
    assert(typeof body['bankRacun'] === 'object', 'bankRacun objekat');
    assert(typeof body['vercel'] === 'object', 'vercel objekat');
    assert(typeof body['instalacionaPoruka'] === 'object', 'instalacionaPoruka objekat');
    const bankRacun = body['bankRacun'] as Record<string, unknown>;
    assertEqual(bankRacun['id'] as string, 'DIGI-IND-001', 'bankRacun.id');
    const telefon = body['telefon'] as Record<string, unknown>;
    assert(typeof telefon['maskiranBroj'] === 'string', 'maskiranBroj string');
  });

  await test('GET /api/owner-account-bank vraća 200 i račun', async () => {
    const { GET } = await import('../../app/api/owner-account-bank/route');
    const response = await GET();
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['racun'] === 'object', 'racun objekat');
    const racun = body['racun'] as Record<string, unknown>;
    assertEqual(racun['id'] as string, 'DIGI-IND-001', 'racun.id');
    assert(typeof body['vercelBillingRef'] === 'string', 'vercelBillingRef string');
  });

  await test('GET /api/owner-phone-auth/request-otp vraća 200', async () => {
    const { GET } = await import('../../app/api/owner-phone-auth/request-otp/route');
    const response = await GET();
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof (body['data'] as Record<string, unknown>)['opis'] === 'string', 'opis');
  });

  await test('GET /api/owner-phone-auth/verify-otp vraća 200', async () => {
    const { GET } = await import('../../app/api/owner-phone-auth/verify-otp/route');
    const response = await GET();
    assertEqual(response.status, 200, 'status');
  });

  await test('POST /api/owner-phone-auth/request-otp — nedostaje telefon → 400', async () => {
    const { POST } = await import('../../app/api/owner-phone-auth/request-otp/route');
    const req = new Request('http://localhost/api/owner-phone-auth/request-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({}),
    });
    const response = await POST(req as NextRequest);
    assertEqual(response.status, 400, 'status 400');
  });

  await test('POST /api/owner-phone-auth/verify-otp — nedostaju polja → 400', async () => {
    const { POST } = await import('../../app/api/owner-phone-auth/verify-otp/route');
    const req = new Request('http://localhost/api/owner-phone-auth/verify-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({ telefon: '+38177-001-0001' }),
    });
    const response = await POST(req as NextRequest);
    assertEqual(response.status, 400, 'status 400');
  });

  await test('POST /api/owner-phone-auth/verify-otp — neispravan OTP → 401', async () => {
    const { POST } = await import('../../app/api/owner-phone-auth/verify-otp/route');
    const req = new Request('http://localhost/api/owner-phone-auth/verify-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.99' },
      body: JSON.stringify({ telefon: '+38177-999-9999', otp: '000000' }),
    });
    const response = await POST(req as NextRequest);
    assertEqual(response.status, 401, 'status 401');
  });

  // ─── Summary ───────────────────────────────────────────────────────────────

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
