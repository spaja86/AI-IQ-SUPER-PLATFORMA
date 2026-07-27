import {
  assertIndukcijaWeights,
  momentumFromVelocity,
  safeCallSync,
  velocityToTrendDirection,
} from '../../lib/indukcija';
import { addIndukcijaSnapshot, getIndukcijaSnapshots, INDUKCIJA_MAX_SNAPSHOTS } from '../../lib/indukcija-store';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (error) {
    failed++;
    console.error(`  ❌ ${name}`);
    console.error(error);
  }
}

async function run() {
  console.log('\n🏁 indukcija-core.test.ts\n');

  await test('assertIndukcijaWeights prolazi za validne težine', () => {
    assertIndukcijaWeights({
      a: 0.4,
      b: 0.3,
      c: 0.3,
    });
  });

  await test('assertIndukcijaWeights baca grešku za nevalidne težine', () => {
    let thrown = false;
    try {
      assertIndukcijaWeights({ a: 0.6, b: 0.6 });
    } catch {
      thrown = true;
    }
    assert(thrown, 'Očekivana je greška kada zbir težina nije 1.0');
  });

  await test('velocityToTrendDirection pokriva epsilon, rising, accelerating, decelerating, falling', () => {
    assertEqual(velocityToTrendDirection(0.0001, null), 'stable', 'epsilon->stable');
    assertEqual(velocityToTrendDirection(3, null), 'rising', 'positive no previous');
    assertEqual(velocityToTrendDirection(6, 2), 'accelerating', 'positive acceleration');
    assertEqual(velocityToTrendDirection(3, 5), 'decelerating', 'positive deceleration');
    assertEqual(velocityToTrendDirection(-3, null), 'falling', 'negative no previous');
    assertEqual(velocityToTrendDirection(-4, -6), 'decelerating', 'negative with positive acceleration');
    assertEqual(velocityToTrendDirection(-6, -2), 'falling', 'negative with stronger fall');
  });

  await test('momentumFromVelocity poštuje granične vrednosti', () => {
    assertEqual(momentumFromVelocity(2), 'neutral', 'at +2 neutral');
    assertEqual(momentumFromVelocity(2.01), 'bullish', 'above +2 bullish');
    assertEqual(momentumFromVelocity(-2), 'neutral', 'at -2 neutral');
    assertEqual(momentumFromVelocity(-2.01), 'bearish', 'below -2 bearish');
    assertEqual(momentumFromVelocity(0), 'neutral', 'zero neutral');
  });

  await test('safeCallSync vraća rezultat kada nema greške', () => {
    const degraded: string[] = [];
    const result = safeCallSync('ok-source', degraded, () => 42);
    assertEqual(result, 42, 'safeCallSync success result');
    assertEqual(degraded.length, 0, 'safeCallSync success degraded length');
  });

  await test('safeCallSync hvata grešku i degradira source', () => {
    const degraded: string[] = [];
    const result = safeCallSync('fail-source', degraded, () => {
      throw new Error('boom');
    });
    assertEqual(result, null, 'safeCallSync fail result');
    assertEqual(degraded.length, 1, 'safeCallSync fail degraded length');
    assertEqual(degraded[0], 'fail-source', 'safeCallSync fail degraded source');
  });

  await test('indukcija-store održava circular buffer reda i veličine', () => {
    for (let i = 0; i < INDUKCIJA_MAX_SNAPSHOTS + 7; i++) {
      addIndukcijaSnapshot({
        ukupanScore: i,
        ukupnaVelocity: i,
        domenScores: {
          indukcija: i,
          koherencija: i,
          amplifikacija: i,
          rezonancija: i,
          polarizacija: i,
          konvergencija: i,
        },
        timestamp: `t-${i}`,
      });
    }

    const snapshots = getIndukcijaSnapshots();
    assertEqual(snapshots.length, INDUKCIJA_MAX_SNAPSHOTS, 'max snapshots');
    assertEqual(snapshots[0].timestamp, 't-7', 'oldest retained snapshot');
    assertEqual(snapshots[snapshots.length - 1].timestamp, `t-${INDUKCIJA_MAX_SNAPSHOTS + 6}`, 'newest retained snapshot');
  });

  if (failed > 0) {
    console.error(`\n❌ indukcija-core.test.ts: ${failed} failed, ${passed} passed`);
    process.exit(1);
  }

  console.log(`\n✅ indukcija-core.test.ts: ${passed} passed`);
}

run().catch((error) => {
  console.error('❌ indukcija-core.test.ts failed', error);
  process.exit(1);
});
