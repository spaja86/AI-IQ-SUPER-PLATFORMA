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

  const first = protokolManager.getAll()[0];
  if (!first) throw new Error('Nema protokola za test');

  await test('getAll vraća protokole sa runtime i ownership metapodacima', () => {
    const all = protokolManager.getAll();
    assert(all.length > 0, 'lista protokola ne sme biti prazna');
    assert(Boolean(all[0]?.vlasnik.tim), 'owner tim mora postojati');
    assert(Boolean(all[0]?.sourceOfTruth), 'sourceOfTruth mora postojati');
    assert(Boolean(all[0]?.runtime), 'runtime snapshot mora postojati');
  });

  await test('Filter po kritičnosti i izvoru vraća podudarne rezultate', () => {
    const kriticni = protokolManager.getAll({ kriticnost: 'kriticna' });
    assert(kriticni.length > 0, 'mora postojati bar jedan kritičan protokol');
    assert(kriticni.every((item) => item.kriticnost === 'kriticna'), 'svi moraju biti kritični');

    const spaja = protokolManager.getAll({ izvor: 'spaja-protokoli' });
    assert(spaja.length > 0, 'mora postojati bar jedan spaja protokol');
    assert(spaja.every((item) => item.izvor === 'spaja-protokoli'), 'svi moraju biti iz spaja izvora');
  });

  await test('verifikuj upisuje latest snapshot i istoriju', async () => {
    const before = protokolManager.getVerificationHistory(first.id, 100).length;
    const result = await protokolManager.verifikuj(first.id);
    const history = protokolManager.getVerificationHistory(first.id, 100);
    const latest = protokolManager.getById(first.id)?.runtime?.poslednjaVerifikacija;

    assert(result.protokolId === first.id, 'result.protokolId mora odgovarati protokolu');
    assert(history.length === before + 1, 'istorija verifikacija mora porasti za 1');
    assert(latest?.protokolId === first.id, 'latest snapshot mora postojati');
  });

  await test('predloziPromenuStatusa povećava pending broj', async () => {
    const beforePending = protokolManager.getById(first.id)?.runtime?.pendingPromene ?? 0;
    const promena = await protokolManager.predloziPromenuStatusa(first.id, 'u-testu', { reason: 'unit-proposal' });
    const afterPending = protokolManager.getById(first.id)?.runtime?.pendingPromene ?? 0;

    assert(promena.stanje === 'na-cekanju', 'promena mora biti na čekanju');
    assert(afterPending === beforePending + 1, 'pending promene moraju porasti');
  });

  await test('odobriPromenuStatusa primenjuje status i omogućava rollback', async () => {
    const proposal = await protokolManager.predloziPromenuStatusa(first.id, 'incident', {
      reason: 'unit-approval-flow',
      userId: 'tester-1',
    });
    const approved = await protokolManager.odobriPromenuStatusa(first.id, proposal.id, {
      approvedBy: 'admin-1',
      reqId: 'unit-approve-1',
    });
    assert(approved.protokol.status === 'incident', 'status mora biti incident nakon odobrenja');

    const rolledBack = await protokolManager.rollbackPromenuStatusa(first.id, {
      approvedBy: 'admin-1',
      reqId: 'unit-rollback-1',
      reason: 'unit-reset',
    });
    assert(rolledBack.protokol.status === first.status, 'rollback mora vratiti početni status');
  });

  await test('Catalog summary vraća agregacije i pending broj', () => {
    const summary = protokolManager.getCatalogSummary();
    assert(summary.ukupno >= 1, 'ukupno mora biti >= 1');
    assert(typeof summary.byStatus['aktivan'] === 'number', 'byStatus.aktivan mora postojati');
    assert(typeof summary.byKategorija['operativni'] === 'number', 'byKategorija.operativni mora postojati');
    assert(typeof summary.pendingPromene === 'number', 'pendingPromene mora biti broj');
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
