// Autofinish #1155 — API Milestone 1000 Test

import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES, TOTAL_DIAGNOSTIKA } from '../../lib/constants';
import { GET } from '../../app/api/autofinish-api-milestone-1000/route';

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
    console.error(`  ❌ ${name}\n     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

async function runTests(): Promise<void> {
  console.log('\n📋 Autofinish API Milestone 1000 Test (#1155)\n');

  await test('GET vraća 200', async () => {
    const response = await GET();
    assert(response.status === 200, `status expected 200, got ${response.status}`);
  });

  await test('GET payload sadrži osnovna polja', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    assert(body['naziv'] === 'Autofinish API Milestone 1000', 'naziv mismatch');
    assert(body['appVerzija'] === APP_VERSION, 'appVerzija mismatch');
    assert(body['autofinishIteracija'] === AUTOFINISH_COUNT, 'autofinishIteracija mismatch');
    assert(body['status'] === 'aktivan', 'status mismatch');
    assert(typeof body['timestamp'] === 'string', 'timestamp must be string');
  });

  await test('GET payload ima milestone objekat', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const milestone = body['milestone'] as Record<string, unknown>;
    assert(typeof milestone === 'object' && milestone !== null, 'milestone missing');
    assert(Number(milestone['ciljBroj']) === 1000, 'ciljBroj must be 1000');
    assert(Number(milestone['trenutniBroj']) === TOTAL_API_ROUTES, 'trenutniBroj mismatch');
    assert(typeof milestone['postignut'] === 'boolean', 'postignut must be boolean');
    assert(Number(milestone['procenat']) >= 0, 'procenat invalid');
  });

  await test('GET payload ima ekosistem objekat', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const ekosistem = body['ekosistem'] as Record<string, unknown>;
    assert(typeof ekosistem === 'object' && ekosistem !== null, 'ekosistem missing');
    assert(Number(ekosistem['ukupnoApiRuta']) === TOTAL_API_ROUTES, 'ukupnoApiRuta mismatch');
    assert(Number(ekosistem['ukupnoRuta']) === TOTAL_ROUTES, 'ukupnoRuta mismatch');
    assert(Number(ekosistem['ukupnoDijagnostika']) === TOTAL_DIAGNOSTIKA, 'ukupnoDijagnostika mismatch');
  });

  await test('TOTAL_API_ROUTES je >= 1000 (milestone postignut)', () => {
    assert(TOTAL_API_ROUTES >= 1000, `TOTAL_API_ROUTES=${TOTAL_API_ROUTES} < 1000`);
  });

  await test('poruka sadrži milestone broj', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const poruka = body['poruka'] as string;
    assert(typeof poruka === 'string' && poruka.length > 0, 'poruka must be non-empty string');
    assert(poruka.includes('1000'), 'poruka must mention 1000');
  });
}

runTests()
  .then(() => {
    console.log(`\n📊 Rezultati: ${passed} prošlo, ${failed} nije prošlo\n`);
    if (failures.length > 0) {
      console.error('Neuspeli testovi:\n' + failures.map((f) => `  • ${f}`).join('\n'));
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Neočekivana greška:', err);
    process.exit(1);
  });
