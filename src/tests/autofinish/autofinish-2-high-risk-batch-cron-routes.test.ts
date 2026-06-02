// Autofinish #1409 — AUTOFINISH 2 Batch #3 High-Risk Cron Route Security Tests
// Pokretanje: npx tsx src/tests/autofinish/autofinish-2-high-risk-batch-cron-routes.test.ts
//
// Verifikuje bezbednosne gate-ove svih cron endpointova:
// - /api/cron/zdravlje
// - /api/cron/evolucija
// - /api/cron/protokoli-verifikacija
// - /api/cron/ekstremno-procesuiranje-svega

import fs from 'node:fs';
import path from 'node:path';
import { GET as zdravljeGET } from '../../app/api/cron/zdravlje/route';
import { GET as evolacijaGET } from '../../app/api/cron/evolucija/route';
import { GET as protokoliGET } from '../../app/api/cron/protokoli-verifikacija/route';
import { GET as ekstremnoGET } from '../../app/api/cron/ekstremno-procesuiranje-svega/route';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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

function assertIncludes(text: string, fragment: string, label: string): void {
  assert(text.includes(fragment), `${label} — nedostaje "${fragment}"`);
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Autofinish #1409 — AUTOFINISH 2 Batch #3 (cron route security)\n');

  const routeFiles = {
    zdravlje: path.resolve(process.cwd(), 'src/app/api/cron/zdravlje/route.ts'),
    evolucija: path.resolve(process.cwd(), 'src/app/api/cron/evolucija/route.ts'),
    protokoliVerifikacija: path.resolve(
      process.cwd(),
      'src/app/api/cron/protokoli-verifikacija/route.ts',
    ),
    ekstremnoProcesuiranjeSvega: path.resolve(
      process.cwd(),
      'src/app/api/cron/ekstremno-procesuiranje-svega/route.ts',
    ),
  };

  await test('Batch #3 cron route fajlovi postoje', () => {
    Object.values(routeFiles).forEach((routeFile) => {
      assert(fs.existsSync(routeFile), `${routeFile} ne postoji`);
    });
  });

  await test('Svi cron endpointi koriste validateCronAuth security gate', () => {
    Object.entries(routeFiles).forEach(([name, routeFile]) => {
      const src = fs.readFileSync(routeFile, 'utf8');
      assertIncludes(src, 'validateCronAuth', `${name} — validateCronAuth`);
      assertIncludes(src, "{ error: 'Neautorizovan pristup' }", `${name} — 401 poruka`);
      assertIncludes(src, 'status: 401', `${name} — status 401`);
    });
  });

  await test('cron/zdravlje koristi APP_VERSION i lib helpers', () => {
    const src = fs.readFileSync(routeFiles.zdravlje, 'utf8');
    assertIncludes(src, 'APP_VERSION', 'zdravlje APP_VERSION');
    assertIncludes(src, 'runDiagnostics', 'zdravlje runDiagnostics');
    assertIncludes(src, 'getDispatchSummary', 'zdravlje getDispatchSummary');
    assertIncludes(src, 'saveHealthSnapshot', 'zdravlje saveHealthSnapshot');
  });

  await test('cron/evolucija koristi APP_VERSION i evolucion helpers', () => {
    const src = fs.readFileSync(routeFiles.evolucija, 'utf8');
    assertIncludes(src, 'APP_VERSION', 'evolucija APP_VERSION');
    assertIncludes(src, 'kreirajISnimiCiklus', 'evolucija kreirajISnimiCiklus');
    assertIncludes(src, 'getKonfiguracija', 'evolucija getKonfiguracija');
  });

  await test('cron/protokoli-verifikacija koristi protokolManager', () => {
    const src = fs.readFileSync(routeFiles.protokoliVerifikacija, 'utf8');
    assertIncludes(src, 'protokolManager', 'protokoli-verifikacija protokolManager');
    assertIncludes(src, 'verifikujSveAktivne', 'protokoli-verifikacija verifikujSveAktivne');
    assertIncludes(src, 'INCIDENT_THRESHOLD', 'protokoli-verifikacija INCIDENT_THRESHOLD');
  });

  await test('cron/ekstremno-procesuiranje-svega koristi buildEkstremnoProcesuiranjeSvega', () => {
    const src = fs.readFileSync(routeFiles.ekstremnoProcesuiranjeSvega, 'utf8');
    assertIncludes(src, 'buildEkstremnoProcesuiranjeSvega', 'ekstremno buildEkstremnoProcesuiranjeSvega');
    assertIncludes(src, 'APP_VERSION', 'ekstremno APP_VERSION');
  });

  await test('cron/zdravlje vraća 401 bez CRON_SECRET', async () => {
    const prevSecret = process.env['CRON_SECRET'];
    delete process.env['CRON_SECRET'];
    try {
      const req = new Request('http://localhost/api/cron/zdravlje');
      const res = await zdravljeGET(req);
      assertEqual(res.status, 401, 'cron/zdravlje status');
    } finally {
      if (prevSecret !== undefined) process.env['CRON_SECRET'] = prevSecret;
    }
  });

  await test('cron/evolucija vraća 401 bez CRON_SECRET', async () => {
    const prevSecret = process.env['CRON_SECRET'];
    delete process.env['CRON_SECRET'];
    try {
      const req = new Request('http://localhost/api/cron/evolucija');
      const res = await evolacijaGET(req);
      assertEqual(res.status, 401, 'cron/evolucija status');
    } finally {
      if (prevSecret !== undefined) process.env['CRON_SECRET'] = prevSecret;
    }
  });

  await test('cron/protokoli-verifikacija vraća 401 bez CRON_SECRET', async () => {
    const prevSecret = process.env['CRON_SECRET'];
    delete process.env['CRON_SECRET'];
    try {
      const req = new Request('http://localhost/api/cron/protokoli-verifikacija');
      const res = await protokoliGET(req);
      assertEqual(res.status, 401, 'cron/protokoli-verifikacija status');
    } finally {
      if (prevSecret !== undefined) process.env['CRON_SECRET'] = prevSecret;
    }
  });

  await test('cron/ekstremno-procesuiranje-svega vraća 401 bez CRON_SECRET', async () => {
    const prevSecret = process.env['CRON_SECRET'];
    delete process.env['CRON_SECRET'];
    try {
      const req = new Request('http://localhost/api/cron/ekstremno-procesuiranje-svega');
      const res = await ekstremnoGET(req);
      assertEqual(res.status, 401, 'cron/ekstremno-procesuiranje-svega status');
    } finally {
      if (prevSecret !== undefined) process.env['CRON_SECRET'] = prevSecret;
    }
  });

  await test('cron/zdravlje vraća 401 sa pogrešnim CRON_SECRET', async () => {
    const prevSecret = process.env['CRON_SECRET'];
    process.env['CRON_SECRET'] = 'pravi-secret';
    try {
      const req = new Request('http://localhost/api/cron/zdravlje', {
        headers: { 'x-cron-secret': 'pogresni-secret' },
      });
      const res = await zdravljeGET(req);
      assertEqual(res.status, 401, 'cron/zdravlje invalid-secret status');
    } finally {
      if (prevSecret !== undefined) {
        process.env['CRON_SECRET'] = prevSecret;
      } else {
        delete process.env['CRON_SECRET'];
      }
    }
  });

  await test('Konstante su konzistentne sa Autofinish #1409 baseline-om', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1409, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1158, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1258, 'TOTAL_ROUTES baseline');
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
