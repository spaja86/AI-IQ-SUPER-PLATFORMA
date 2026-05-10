import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_ROUTES,
} from '../../lib/constants';
import { GET } from '../../app/api/autofinish-api-milestone-1046/route';

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (error) {
    failed++;
    const msg = error instanceof Error ? error.message : String(error);
    failures.push(`${name}: ${msg}`);
    console.error(`  ❌ ${name}\n     ${msg}`);
  }
}

async function run(): Promise<void> {
  console.log('\n📋 Autofinish API Milestone 1046 Test (#1193)\n');

  await test('GET vraća 200', async () => {
    const res = await GET();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('Payload ima osnovna polja', async () => {
    const res = await GET();
    const body = (await res.json()) as Record<string, unknown>;
    assert(body.naziv === 'Autofinish API Milestone 1046', 'naziv mismatch');
    assert(body.status === 'aktivan', 'status mismatch');
    assert(body.appVerzija === APP_VERSION, 'appVerzija mismatch');
    assert(body.autofinishIteracija === AUTOFINISH_COUNT, 'autofinishIteracija mismatch');
  });

  await test('Milestone blok ima očekivane vrednosti', async () => {
    const res = await GET();
    const body = (await res.json()) as Record<string, unknown>;
    const milestone = body.milestone as Record<string, unknown>;
    assert(Number(milestone.ciljBroj) === 1046, 'ciljBroj must be 1046');
    assert(Number(milestone.trenutniBroj) === TOTAL_API_ROUTES, 'trenutniBroj mismatch');
    assert(Boolean(milestone.postignut) === true, 'postignut must be true');
    assert(Number(milestone.procenat) >= 100, 'procenat must be >= 100');
  });

  await test('Ekosistem blok je usklađen sa konstantama', async () => {
    const res = await GET();
    const body = (await res.json()) as Record<string, unknown>;
    const eco = body.ekosistem as Record<string, unknown>;
    assert(Number(eco.ukupnoRuta) === TOTAL_ROUTES, 'ukupnoRuta mismatch');
    assert(Number(eco.ukupnoApiRuta) === TOTAL_API_ROUTES, 'ukupnoApiRuta mismatch');
    assert(Number(eco.ukupnoDijagnostika) === TOTAL_DIAGNOSTIKA, 'ukupnoDijagnostika mismatch');
  });

  await test('AUTOFINISH_COUNT je 1193', () => {
    assert(AUTOFINISH_COUNT === 1193, `AUTOFINISH_COUNT expected 1193, got ${AUTOFINISH_COUNT}`);
  });

  await test('TOTAL_API_ROUTES je 1046', () => {
    assert(TOTAL_API_ROUTES === 1046, `TOTAL_API_ROUTES expected 1046, got ${TOTAL_API_ROUTES}`);
  });

  await test('TOTAL_ROUTES je 1105', () => {
    assert(TOTAL_ROUTES === 1105, `TOTAL_ROUTES expected 1105, got ${TOTAL_ROUTES}`);
  });

  await test('TOTAL_DIAGNOSTIKA je 2360', () => {
    assert(TOTAL_DIAGNOSTIKA === 2360, `TOTAL_DIAGNOSTIKA expected 2360, got ${TOTAL_DIAGNOSTIKA}`);
  });

  await test('Poruka sadrži 1046', async () => {
    const res = await GET();
    const body = (await res.json()) as Record<string, unknown>;
    const poruka = String(body.poruka ?? '');
    assert(poruka.includes('1046'), 'poruka mora sadržati 1046');
  });

  console.log(`\n📊 Rezultati: ${passed} prošlo, ${failed} nije prošlo\n`);
  if (failed > 0) {
    console.error(failures.map((f) => `  • ${f}`).join('\n'));
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Neočekivana greška', e);
  process.exit(1);
});
