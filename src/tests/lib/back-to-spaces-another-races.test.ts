import {
  BACK_TO_SPACES_FOR_ANOTHER_RACES,
  calculateRaceScore,
  normalizeRaceResult,
  validateRaceSetup,
} from '../../lib/back-to-spaces-another-races';
import { igrice } from '../../lib/igrice';
import { TOTAL_IGRICA } from '../../lib/constants';
import { GET as getIgriceRoute } from '../../app/api/igrice/route';

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
  console.log('\n🏁 Back to Spaces for Another Races — test suite\n');

  await test('Plan ima osnovne sekcije', () => {
    assert(BACK_TO_SPACES_FOR_ANOTHER_RACES.goal.length > 0, 'goal mora postojati');
    assert(BACK_TO_SPACES_FOR_ANOTHER_RACES.successCriteria.length >= 3, 'success criteria moraju biti definisani');
    assert(BACK_TO_SPACES_FOR_ANOTHER_RACES.targetUsers.length >= 2, 'target users moraju biti definisani');
  });

  await test('Validan setup prolazi fairness validaciju', () => {
    const result = validateRaceSetup({
      lobbyId: 'lobby-1',
      platform: 'web',
      dimenzija: '720D',
      players: ['p1', 'p2', 'p3'],
      nitroBoostsPerPlayer: 2,
      collisionPenaltyMs: 1200,
      latencyCompensationMs: 80,
    });
    assertEqual(result.valid, true, 'setup valid');
    assertEqual(result.errors.length, 0, 'nema grešaka');
  });

  await test('Setup sa duplim player ID i previše nitro boostova pada', () => {
    const result = validateRaceSetup({
      lobbyId: 'lobby-2',
      platform: 'mobile',
      dimenzija: '1440D',
      players: ['p1', 'p1'],
      nitroBoostsPerPlayer: 7,
      collisionPenaltyMs: 1000,
      latencyCompensationMs: 50,
    });
    assertEqual(result.valid, false, 'setup ne sme biti validan');
    assert(result.errors.some((e) => e.includes('jedinstveni')), 'mora detektovati duplikate');
    assert(result.errors.some((e) => e.includes('nitroBoostsPerPlayer')), 'mora detektovati nitro granicu');
  });

  await test('normalizeRaceResult rešava NaN/negativne edge-case vrednosti', () => {
    const normalized = normalizeRaceResult({
      playerId: 'p1',
      finishPosition: Number.NaN,
      lapTimeMs: -5,
      penaltiesMs: Number.NaN,
      disconnected: false,
    });
    assertEqual(normalized.finishPosition, 9999, 'fallback pozicija');
    assertEqual(normalized.lapTimeMs, 0, 'fallback lapTime');
    assertEqual(normalized.penaltiesMs, 0, 'fallback penalties');
  });

  await test('calculateRaceScore vraća 0 za disconnected igrača', () => {
    const score = calculateRaceScore({
      playerId: 'p2',
      finishPosition: 1,
      lapTimeMs: 20000,
      penaltiesMs: 0,
      disconnected: true,
    });
    assertEqual(score, 0, 'score mora biti 0');
  });

  await test('calculateRaceScore preferira bolji plasman i niže vreme', () => {
    const first = calculateRaceScore({
      playerId: 'p1',
      finishPosition: 1,
      lapTimeMs: 23000,
      penaltiesMs: 500,
      disconnected: false,
    });
    const third = calculateRaceScore({
      playerId: 'p3',
      finishPosition: 3,
      lapTimeMs: 34000,
      penaltiesMs: 1500,
      disconnected: false,
    });
    assert(first > third, 'bolji rezultat mora imati veći score');
  });

  await test('Igrica je registrovana u katalogu i TOTAL_IGRICA ostaje konzistentan', () => {
    const game = igrice.find((i) => i.id === 'igrica-back-to-spaces-another-races');
    assert(game !== undefined, 'igrica mora postojati');
    assertEqual(TOTAL_IGRICA, igrice.length, 'TOTAL_IGRICA mora pratiti katalog');
  });

  await test('/api/igrice vraća novu igricu', async () => {
    const response = await getIgriceRoute();
    const body = await response.json() as { igrice: Array<{ id: string; naziv: string }> };
    const game = body.igrice.find((i) => i.id === 'igrica-back-to-spaces-another-races');
    assert(game !== undefined, 'API mora vratiti novu igricu');
    assertEqual(game?.naziv, 'Back to Spaces for Another Races', 'naziv');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((failure) => console.error(`  • ${failure}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
