// Autofinish #1139 — GitHub Billing Sumarno API Test

import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';
import { GET } from '../../app/api/autofinish-github-billing-sumarno/route';

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
  console.log('\n📋 Autofinish GitHub Billing Sumarno API Test (#1139)\n');

  await test('GET vraća 200', async () => {
    const response = await GET();
    assert(response.status === 200, `status expected 200, got ${response.status}`);
  });

  await test('GET payload sadrži osnovna polja', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;

    assert(body['naziv'] === 'Autofinish GitHub Billing Sumarno', 'naziv mismatch');
    assert(body['appVerzija'] === APP_VERSION, 'appVerzija mismatch');
    assert(body['autofinishIteracija'] === AUTOFINISH_COUNT, 'autofinishIteracija mismatch');
    assert(body['status'] === 'aktivan', 'status mismatch');
    assert(typeof body['timestamp'] === 'string', 'timestamp must be string');
  });

  await test('GET payload ima pilot, rollout i statistike', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const pilot = body['pilot'] as Record<string, unknown>;
    const rollout = body['rollout'] as Record<string, unknown>;
    const statistike = body['statistike'] as Record<string, unknown>;

    assert(typeof pilot === 'object' && pilot !== null, 'pilot missing');
    assert(typeof rollout === 'object' && rollout !== null, 'rollout missing');
    assert(typeof statistike === 'object' && statistike !== null, 'statistike missing');
    assert(Number(pilot['ukupnoPilotUSD']) >= 0, 'ukupnoPilotUSD invalid');
    assert(Number(pilot['budzetIskoriscenPct']) >= 0, 'budzetIskoriscenPct invalid');
    assert(Number(rollout['ukupnoFaza']) >= 1, 'ukupnoFaza invalid');
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
