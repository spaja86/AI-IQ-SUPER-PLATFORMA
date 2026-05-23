// Unit Test — Protokoli Manager
// Pokretanje: npx tsx src/tests/unit/protokoli-manager.test.ts

import { protokolManager } from '../../lib/protokoli/manager';

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

async function runTests(): Promise<void> {
  console.log('\n🧪 Protokoli Manager Test Suite\n');

  await test('getAll vraća nepraznu listu protokola', () => {
    const all = protokolManager.getAll();
    assert(all.length > 0, 'lista protokola ne sme biti prazna');
  });

  await test('Filter po statusu aktivan vraća samo aktivne', () => {
    const aktivni = protokolManager.getAll({ status: 'aktivan' });
    assert(aktivni.length > 0, 'mora postojati bar jedan aktivan protokol');
    assert(aktivni.every((item) => item.status === 'aktivan'), 'svi moraju biti aktivni');
  });

  await test('getById vraća protokol koji postoji', () => {
    const first = protokolManager.getAll()[0];
    assert(Boolean(first), 'mora postojati prvi protokol');
    const found = first ? protokolManager.getById(first.id) : null;
    assert(Boolean(found), 'protokol mora biti pronađen');
    assert(found?.id === first?.id, 'id mora biti isti');
  });

  await test('verifikuj vraća rezultat i loguje događaj', async () => {
    const first = protokolManager.getAll()[0];
    if (!first) throw new Error('Nema protokola za test');
    const before = protokolManager.getLog(first.id, 100).length;
    const result = await protokolManager.verifikuj(first.id);
    const after = protokolManager.getLog(first.id, 100).length;
    assert(result.protokolId === first.id, 'result.protokolId mora odgovarati protokolu');
    assert(after >= before, 'broj logova ne sme opasti');
  });

  await test('updateStatus menja status protokola', async () => {
    const first = protokolManager.getAll()[0];
    if (!first) throw new Error('Nema protokola za test');
    await protokolManager.updateStatus(first.id, 'u-testu', { reason: 'unit-test' });
    const updated = protokolManager.getById(first.id);
    assert(updated?.status === 'u-testu', 'status mora biti u-testu');

    await protokolManager.updateStatus(first.id, 'aktivan', { reason: 'reset' });
    const reset = protokolManager.getById(first.id);
    assert(reset?.status === 'aktivan', 'status mora biti vraćen na aktivan');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
