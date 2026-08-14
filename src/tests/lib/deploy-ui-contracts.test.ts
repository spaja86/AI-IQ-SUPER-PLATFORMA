import {
  buildOverviewFromList,
  normalizeStatusApiPayload,
  stateToLabel,
} from '../../lib/deploy/deploy-ui-contracts';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assert failed: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function runTests(): void {
  console.log('\n🧪 Deploy UI Contracts Test Suite\n');

  test('normalizeStatusApiPayload mapira validne stavke i fallback state', () => {
    const payload = normalizeStatusApiPayload({
      status: 'ok',
      lista: [
        {
          platformId: 'a',
          naziv: 'Platforma A',
          ikona: '🚀',
          vercelProjectId: 'project-a',
          state: 'ready',
          url: 'https://example.com',
          checkedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          platformId: 'b',
          naziv: '',
          vercelProjectId: 'project-b',
          state: 'not-real-state',
        },
      ],
      timestamp: '2026-01-01T00:00:00.000Z',
    });

    assertEqual(payload.status, 'ok', 'status');
    assertEqual(payload.lista.length, 2, 'lista.length');
    assertEqual(payload.lista[0].state, 'READY', 'first.state');
    assertEqual(payload.lista[1].state, 'UNKNOWN', 'second.state');
    assertEqual(payload.lista[1].naziv, 'b', 'fallback naziv');
  });

  test('normalizeStatusApiPayload koristi server counters kada su dostupni', () => {
    const payload = normalizeStatusApiPayload({
      status: 'ok',
      lista: [],
      platforme: {
        ukupno: 12,
        aktivan: 7,
        grade: 3,
        greska: 1,
        nepoznato: 1,
      },
    });

    assertEqual(payload.platforme.ukupno, 12, 'ukupno');
    assertEqual(payload.platforme.aktivan, 7, 'aktivan');
    assertEqual(payload.platforme.grade, 3, 'grade');
    assertEqual(payload.platforme.greska, 1, 'greska');
    assertEqual(payload.platforme.nepoznato, 1, 'nepoznato');
  });

  test('buildOverviewFromList računa READY/BUILDING/ERROR i nepoznato', () => {
    const summary = buildOverviewFromList([
      { platformId: 'a', naziv: 'A', ikona: 'A', vercelProjectId: 'a', state: 'READY', url: null, deploymentId: null, createdAt: null, error: null, checkedAt: 'x' },
      { platformId: 'b', naziv: 'B', ikona: 'B', vercelProjectId: 'b', state: 'BUILDING', url: null, deploymentId: null, createdAt: null, error: null, checkedAt: 'x' },
      { platformId: 'c', naziv: 'C', ikona: 'C', vercelProjectId: 'c', state: 'ERROR', url: null, deploymentId: null, createdAt: null, error: null, checkedAt: 'x' },
      { platformId: 'd', naziv: 'D', ikona: 'D', vercelProjectId: 'd', state: 'UNKNOWN', url: null, deploymentId: null, createdAt: null, error: null, checkedAt: 'x' },
    ]);

    assertEqual(summary.ukupno, 4, 'ukupno');
    assertEqual(summary.aktivan, 1, 'aktivan');
    assertEqual(summary.grade, 1, 'grade');
    assertEqual(summary.greska, 1, 'greska');
    assertEqual(summary.nepoznato, 1, 'nepoznato');
  });

  test('stateToLabel vraća očekivane UI label-e', () => {
    assertEqual(stateToLabel('READY'), 'Aktivan');
    assertEqual(stateToLabel('BUILDING'), 'Gradi se');
    assertEqual(stateToLabel('ERROR'), 'Greška');
    assertEqual(stateToLabel(null), 'Nepoznato');
  });

  console.log(`\n✅ Passed: ${passed}  ❌ Failed: ${failed}\n`);
  assert(failed === 0, `${failed} test(ova) nije prošlo`);
}

runTests();
