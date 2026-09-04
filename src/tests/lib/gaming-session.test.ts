import {
  createGamingSession,
  getSessionReport,
  transitionSessionStatus,
  validateGameAction,
  terminateGamingSession,
} from '../../lib/gaming-session';

let passed = 0;
let failed = 0;

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
  console.log('\n🛡️ Gaming Session — test suite\n');

  await test('Prva akcija u novoj sesiji nije blokirana rate-limitom', () => {
    const created = createGamingSession(`u-${Date.now()}`, 'igrica-1');
    assert(created.created, 'sesija mora biti kreirana');
    const res = validateGameAction(created.session.sessionId, {
      tip: 'move',
      actionHash: `h-${Date.now()}`,
    });
    assert(res.allowed, 'prva akcija mora biti dozvoljena');
  });

  await test('Replay guard detektuje duplikat hash i upisuje audit summary', () => {
    const created = createGamingSession(`u-replay-${Date.now()}`, 'igrica-2');
    const hash = `dup-${Date.now()}`;
    const first = validateGameAction(created.session.sessionId, { tip: 'move', actionHash: hash });
    assert(first.allowed, 'prva akcija mora proći');

    const second = validateGameAction(created.session.sessionId, { tip: 'move', actionHash: hash });
    assert(!second.allowed, 'duplikat mora biti blokiran');

    const report = getSessionReport(created.session.sessionId);
    assert(report, 'report mora postojati');
    assert(report.violationSummary.replay >= 1, 'replay violation mora biti evidentiran');
  });

  await test('Timestamp drift detektuje impossible timing', () => {
    const created = createGamingSession(`u-drift-${Date.now()}`, 'igrica-3');
    const res = validateGameAction(created.session.sessionId, {
      tip: 'move',
      actionHash: `drift-${Date.now()}`,
      clientTimestamp: Date.now() + 120_000,
    });
    assert(!res.allowed, 'akcija sa velikim drift-om mora biti blokirana');

    const report = getSessionReport(created.session.sessionId);
    assert(report, 'report mora postojati');
    assert(report.violationSummary.impossible_timing >= 1, 'impossible_timing mora biti evidentiran');
    assert(report.lastViolation?.tip === 'impossible_timing', 'last violation mora biti impossible_timing');
  });

  await test('Lifecycle guard zabranjuje nedozvoljen status prelaz', () => {
    const created = createGamingSession(`u-life-${Date.now()}`, 'igrica-4');
    assert(created.created, 'sesija mora biti kreirana');

    const terminated = transitionSessionStatus(created.session.sessionId, 'terminated');
    assert(terminated, 'active -> terminated mora biti dozvoljeno');

    const denied = transitionSessionStatus(created.session.sessionId, 'active');
    assertEqual(denied, false, 'terminated -> active ne sme biti dozvoljeno');

    terminateGamingSession(created.session.sessionId, 'terminated');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
