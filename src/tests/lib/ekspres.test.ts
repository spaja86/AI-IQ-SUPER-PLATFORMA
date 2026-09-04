import {
  buildEkspres,
  EKSPRES_CONTRACT_VERSION,
  EKSPRES_SOURCE_OF_TRUTH,
  EKSPRES_SLA_THRESHOLDS,
  EKSPRES_WEIGHTS,
} from '../../lib/ekspres';
import {
  _resetEkspresSnapshots,
  addEkspresSnapshot,
  getEkspresSnapshots,
} from '../../lib/ekspres-store';

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
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n⚡ EKSPRES Test Suite\n');

  _resetEkspresSnapshots();

  await test('weights su normalizovane', () => {
    const sum = Object.values(EKSPRES_WEIGHTS).reduce((a, b) => a + b, 0);
    assert(Math.abs(sum - 1) < 0.0001, 'weights moraju biti 1.0');
  });

  await test('buildEkspres vraća validan payload', () => {
    const out = buildEkspres({ persistSnapshot: false });
    assert(out.ukupanScore >= 0 && out.ukupanScore <= 100, 'ukupanScore range');
    assert(typeof out.konacnaOcena === 'string' && out.konacnaOcena.length > 0, 'konacnaOcena');
    assertEqual(out.meta.contractVersion, EKSPRES_CONTRACT_VERSION, 'contractVersion');
    assertEqual(out.meta.sourceOfTruth, EKSPRES_SOURCE_OF_TRUTH, 'sourceOfTruth');
    assertEqual(Object.keys(out.domeni).length, 4, 'domen count');
  });

  await test('persistSnapshot=false ne upisuje snapshot', () => {
    _resetEkspresSnapshots();
    buildEkspres({ persistSnapshot: false });
    assertEqual(getEkspresSnapshots().length, 0, 'snapshot length');
  });

  await test('persistSnapshot=true upisuje prvi snapshot', () => {
    _resetEkspresSnapshots();
    const out = buildEkspres({ persistSnapshot: true });
    assertEqual(getEkspresSnapshots().length, 1, 'snapshot length');
    assertEqual(out.trendSnapshotCount, 1, 'trendSnapshotCount');
  });

  await test('snapshot throttling sprečava drugi upis odmah', () => {
    _resetEkspresSnapshots();
    buildEkspres({ persistSnapshot: true });
    const second = buildEkspres({ persistSnapshot: true });
    assertEqual(getEkspresSnapshots().length, 1, 'snapshot length after immediate second write');
    assertEqual(second.trendSnapshotCount, 1, 'trendSnapshotCount after throttle');
  });

  await test('neispravan timestamp u prethodnom snapshotu blokira persist', () => {
    _resetEkspresSnapshots();
    addEkspresSnapshot({
      ukupanScore: 80,
      ukupnaVelocity: 1,
      domenScores: { brzina: 80, pouzdanost: 80, automatizacija: 80, kvalitetIzlaza: 80 },
      timestamp: 'invalid-ts',
    });
    buildEkspres({ persistSnapshot: true });
    assertEqual(getEkspresSnapshots().length, 1, 'invalid timestamp should block extra persist');
  });

  await test('kritični domeni prate SLA pragove', () => {
    const out = buildEkspres({ persistSnapshot: false });
    const manualCritical = Object.values(out.domeni)
      .filter((domen) => domen.score < domen.slaThreshold)
      .map((domen) => domen.naziv);
    assertEqual(out.domeniBrojKriticnih, manualCritical.length, 'domeniBrojKriticnih');
    assertEqual(out.kriticniDomeni.join('|'), manualCritical.join('|'), 'kriticniDomeni');
    assertEqual(out.domeni.brzina.slaThreshold, EKSPRES_SLA_THRESHOLDS.brzina, 'brzina sla');
  });

  console.log(`\n📊 Rezultati: ${passed} prošlo, ${failed} palo\n`);
  if (failures.length > 0) {
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatalna greška u EKSPRES test suite-u:', err);
  process.exit(1);
});
