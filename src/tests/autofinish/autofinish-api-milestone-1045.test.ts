import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_ROUTES,
} from '../../lib/constants';
import { GET } from '../../app/api/autofinish-api-milestone-1045/route';

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
  console.log('\n📋 Autofinish API Milestone 1045 Test (#1192)\n');

  await test('GET vraća 200', async () => {
    const res = await GET();
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('Payload ima osnovna polja', async () => {
    const res = await GET();
    const body = (await res.json()) as Record<string, unknown>;
    assert(body.naziv === 'Autofinish API Milestone 1045', 'naziv mismatch');
    assert(body.status === 'aktivan', 'status mismatch');
    assert(body.appVerzija === APP_VERSION, 'appVerzija mismatch');
    assert(body.autofinishIteracija === AUTOFINISH_COUNT, 'autofinishIteracija mismatch');
  });

  await test('Milestone blok ima očekivane vrednosti', async () => {
    const res = await GET();
    const body = (await res.json()) as Record<string, unknown>;
    const milestone = body.milestone as Record<string, unknown>;
    assert(Number(milestone.ciljBroj) === 1045, 'ciljBroj must be 1045');
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

  await test('AUTOFINISH_COUNT je 1192', () => {
    assert(AUTOFINISH_COUNT === 1192, `AUTOFINISH_COUNT expected 1192, got ${AUTOFINISH_COUNT}`);
  });

  await test('TOTAL_API_ROUTES je 1045', () => {
    assert(TOTAL_API_ROUTES === 1045, `TOTAL_API_ROUTES expected 1045, got ${TOTAL_API_ROUTES}`);
  });

  await test('TOTAL_ROUTES je 1104', () => {
    assert(TOTAL_ROUTES === 1104, `TOTAL_ROUTES expected 1104, got ${TOTAL_ROUTES}`);
  });

  await test('TOTAL_DIAGNOSTIKA je 2358', () => {
    assert(TOTAL_DIAGNOSTIKA === 2358, `TOTAL_DIAGNOSTIKA expected 2358, got ${TOTAL_DIAGNOSTIKA}`);
  });

  await test('Poruka sadrži 1045', async () => {
    const res = await GET();
    const body = (await res.json()) as Record<string, unknown>;
    const poruka = String(body.poruka ?? '');
    assert(poruka.includes('1045'), 'poruka mora sadržati 1045');
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
