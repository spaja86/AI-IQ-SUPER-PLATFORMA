import { createRuntime, parseSpajaUltra, transpile } from '../../lib/spaja-ultra-core';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed += 1;
  } catch (error) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${String(error)}`);
    failed += 1;
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assert failed: ${message}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n🧪 SpajaUltra Core Test Suite\n');

  await test('parser podržava MOŽE/ŽELIM i srpska slova', () => {
    const ast = parseSpajaUltra('MOŽE: pristup\nŽELIM: test želja');
    assert(ast.length === 2, 'treba 2 čvora');
    assert(ast[0].name === 'MOŽE', 'prva naredba');
    assert(ast[1].args[0] === 'test želja', 'drugi argument');
  });

  await test('parser podržava ASCII alias naredbi', () => {
    const ast = parseSpajaUltra('MOZE: pristup\nZELIM: plan');
    assert(ast[0].name === 'MOŽE', 'MOZE normalizacija');
    assert(ast[1].name === 'ŽELIM', 'ZELIM normalizacija');
  });

  await test('parser baca grešku za nevalidnu liniju', () => {
    let thrown = false;
    try {
      parseSpajaUltra('OVO NIJE VALIDNO');
    } catch {
      thrown = true;
    }
    assert(thrown, 'mora baciti grešku');
  });

  await test('transpiler mapira naredbe na runtime pozive', () => {
    const ast = parseSpajaUltra('MOŽE: x\nWAIT: 20\nASSERT: a == true\nPRIV: user');
    const code = transpile(ast);
    assert(code.includes('await runtime.moze("x", ctx);'), 'moze mapiranje');
    assert(code.includes('await runtime.wait("20", ctx);'), 'wait mapiranje');
    assert(code.includes('await runtime.assert("a == true", ctx);'), 'assert mapiranje');
    assert(code.includes('await runtime.priv("user", ctx);'), 'priv mapiranje');
  });

  await test('runtime izvršava komande i puni audit log', async () => {
    const runtime = createRuntime();
    const output: string[] = [];
    const ctx = { roles: ['user'], korisnik_ima_pravo: true, vreme: 14, onOutput: (line: string) => output.push(line) };

    await runtime.moze('pristup', ctx);
    await runtime.zelim('analiza', ctx);
    await runtime.do('ECHO zdravo', ctx);
    await runtime.wait('10', ctx);
    await runtime.assert('korisnik_ima_pravo == true && vreme < 18', ctx);
    await runtime.priv('user', ctx);

    const audit = runtime.getAuditLog();
    assert(output[0] === 'zdravo', 'echo output');
    assert(audit.length === 6, 'broj audit zapisa');
    assert(audit.every((record) => record.status === 'ok'), 'status ok');
  });

  await test('runtime WAIT ograničava čekanje maxWaitMs', async () => {
    const runtime = createRuntime({ maxWaitMs: 5 });
    const started = Date.now();
    await runtime.wait('100', {});
    const elapsed = Date.now() - started;
    assert(elapsed < 30, 'čekanje mora biti ograničeno');
  });

  await test('runtime ASSERT i PRIV upisuju error audit kada padnu', async () => {
    const runtime = createRuntime();
    const ctx = { roles: ['user'], flag: false };

    let assertError = false;
    try {
      await runtime.assert('flag == true', ctx);
    } catch {
      assertError = true;
    }

    let privError = false;
    try {
      await runtime.priv('admin', ctx);
    } catch {
      privError = true;
    }

    const log = runtime.getAuditLog();
    assert(assertError, 'assert mora pasti');
    assert(privError, 'priv mora pasti');
    assert(log.length === 2, 'dva zapisa');
    assert(log.every((item) => item.status === 'error'), 'oba error');
  });

  console.log(`\n✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Runner error:', error);
  process.exit(1);
});
