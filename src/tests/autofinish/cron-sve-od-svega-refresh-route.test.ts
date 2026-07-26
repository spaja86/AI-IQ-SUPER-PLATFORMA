// Cron SVE OD SVEGA Refresh — Route Coverage Test
// Kompanija SPAJA — Digitalna Industrija

import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION } from '../../lib/constants';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

const _lintUseHelpers = [isObject];
void _lintUseHelpers;

import { GET } from '../../app/api/cron/sve-od-svega-refresh/route';

async function runTests(): Promise<void> {
  console.log('\n⏰ cron/sve-od-svega-refresh — Route Coverage Test Suite\n');

  const routePath = path.resolve(
    process.cwd(),
    'src/app/api/cron/sve-od-svega-refresh/route.ts',
  );

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje GET handler', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('validateCronAuth'), 'Nedostaje validateCronAuth poziv');
  });

  await test('GET bez autorizacije vraca 401', async () => {
    process.env['CRON_SECRET'] = 'test-secret-xyz';
    const request = new Request('http://localhost/api/cron/sve-od-svega-refresh');
    const response = await GET(request);
    assert(response.status === 401, `Ocekivan 401 bez auth, dobijen: ${response.status}`);
    delete process.env['CRON_SECRET'];
  });

  await test('GET sa ispravnim ****** vraca 200 ili 500', async () => {
    const secret = 'test-secret-abc';
    process.env['CRON_SECRET'] = secret;
    const request = new Request('http://localhost/api/cron/sve-od-svega-refresh', {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const response = await GET(request);
    assert(
      response.status === 200 || response.status === 500,
      `Ocekivan 200 ili 500 sa auth, dobijen: ${response.status}`,
    );
    delete process.env['CRON_SECRET'];
  });

  await test('GET sa ispravnim x-cron-secret header-om vraca 200 ili 500', async () => {
    const secret = 'test-secret-header';
    process.env['CRON_SECRET'] = secret;
    const request = new Request('http://localhost/api/cron/sve-od-svega-refresh', {
      headers: { 'x-cron-secret': secret },
    });
    const response = await GET(request);
    assert(
      response.status === 200 || response.status === 500,
      `Ocekivan 200 ili 500 sa x-cron-secret, dobijen: ${response.status}`,
    );
    delete process.env['CRON_SECRET'];
  });

  await test('Uspesni GET response sadrzi ocekivana polja', async () => {
    const secret = 'test-secret-fields';
    process.env['CRON_SECRET'] = secret;
    const request = new Request('http://localhost/api/cron/sve-od-svega-refresh', {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const response = await GET(request);
    if (response.status === 200) {
      const body = (await response.clone().json()) as unknown;
      assert(isObject(body), 'Response mora biti objekat');
      assert('ukupanScore' in body, 'Nedostaje ukupanScore');
      assert('konacnaOcena' in body, 'Nedostaje konacnaOcena');
      assert('historyLength' in body, 'Nedostaje historyLength');
      assert('alert' in body, 'Nedostaje alert');
      assert(isObject(body['alert']), 'alert mora biti objekat');
      assert('verzija' in body, 'Nedostaje verzija');
      assert(body['verzija'] === APP_VERSION, `verzija mora biti ${APP_VERSION}`);
    }
    delete process.env['CRON_SECRET'];
  });

  await test('Alert polje ima ocekivanu strukturu', async () => {
    const secret = 'test-secret-alert';
    process.env['CRON_SECRET'] = secret;
    const request = new Request('http://localhost/api/cron/sve-od-svega-refresh', {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const response = await GET(request);
    if (response.status === 200) {
      const body = (await response.clone().json()) as unknown;
      if (isObject(body) && isObject(body['alert'])) {
        assert('sent' in body['alert'], 'alert.sent mora postojati');
        assert('reason' in body['alert'], 'alert.reason mora postojati');
        assert(typeof body['alert']['sent'] === 'boolean', 'alert.sent mora biti boolean');
        assert(typeof body['alert']['reason'] === 'string', 'alert.reason mora biti string');
      }
    }
    delete process.env['CRON_SECRET'];
  });

  console.log(`
⏰ Rezultat: ${passed} prošlo, ${failed} palo`);
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
