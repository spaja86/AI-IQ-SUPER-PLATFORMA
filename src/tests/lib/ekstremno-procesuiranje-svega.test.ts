// Unit testovi za signal-driven ekstremno procesuiranje svega model
// Pokretanje: npx tsx src/tests/lib/ekstremno-procesuiranje-svega.test.ts

import { strict as assert } from 'node:assert';
import {
  buildEkstremnoProcesuiranjeSvega,
  PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
  PROCESUIRANJE_SVEGA_MODEL_VERSION,
} from '../../lib/procesuiranje-svega';

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    throw error;
  }
}

function run(): void {
  const rezultat = buildEkstremnoProcesuiranjeSvega();

  test('Backward compatibility — legacy polja postoje', () => {
    assert.equal(typeof rezultat.sistem, 'string');
    assert.equal(typeof rezultat.kompanija, 'string');
    assert.equal(typeof rezultat.verzija, 'string');
    assert.equal(typeof rezultat.autofinishBroj, 'number');
    assert.equal(typeof rezultat.ukupanProcenat, 'number');
    assert.equal(typeof rezultat.aktivnihProcesa, 'number');
    assert.equal(typeof rezultat.cekajucihProcesa, 'number');
    assert.equal(typeof rezultat.gresakaUkupno, 'number');
    assert.equal(typeof rezultat.zavrsenihProcesa, 'number');
    assert.ok(Array.isArray(rezultat.aktivneStavke));
    assert.equal(typeof rezultat.domeni, 'object');
  });

  test('Meta contract/model/version i sourceOfTruth su validni', () => {
    assert.equal(rezultat.meta.contractVersion, PROCESUIRANJE_SVEGA_CONTRACT_VERSION);
    assert.equal(rezultat.meta.modelVersion, PROCESUIRANJE_SVEGA_MODEL_VERSION);
    assert.equal(rezultat.meta.sourceOfTruth, '/api/procesuiranje-svega');
    assert.equal(typeof rezultat.meta.generatedAt, 'string');
    assert.ok(!Number.isNaN(Date.parse(rezultat.meta.generatedAt)));
    assert.equal(typeof rezultat.meta.degraded, 'boolean');
    assert.ok(Array.isArray(rezultat.meta.degradedSources));
  });

  test('Granice score/procenata su u dozvoljenom opsegu', () => {
    assert.ok(rezultat.ukupanProcenat >= 0 && rezultat.ukupanProcenat <= 100);
    assert.ok(rezultat.scheduler.fairnessIndex >= 0 && rezultat.scheduler.fairnessIndex <= 100);
    assert.ok(rezultat.scheduler.starvationRizik >= 0 && rezultat.scheduler.starvationRizik <= 100);
    assert.ok(rezultat.scheduler.saturacijaPct >= 0 && rezultat.scheduler.saturacijaPct <= 100);
    assert.ok(rezultat.score.errorRatePct >= 0 && rezultat.score.errorRatePct <= 100);
    assert.ok(rezultat.score.throughputPerMin >= 0);
    assert.ok(rezultat.score.latencyMsP95 >= 0);
  });

  test('Scheduler queueDepth je konzistentan sa redovima', () => {
    assert.equal(rezultat.scheduler.queueDepth, rezultat.scheduler.redovi.length);
  });

  test('Prioritetni red je sortiran kriticno→visoko→srednje→nisko', () => {
    const rank: Record<string, number> = { kriticno: 0, visoko: 1, srednje: 2, nisko: 3 };
    for (let i = 1; i < rezultat.scheduler.redovi.length; i++) {
      const prev = rank[rezultat.scheduler.redovi[i - 1].prioritet];
      const curr = rank[rezultat.scheduler.redovi[i].prioritet];
      assert.ok(prev <= curr, `Neispravan prioritetni red na indeksu ${i}`);
    }
  });

  test('Svi domeni imaju freshness i barem jednu stavku', () => {
    const domeni = Object.values(rezultat.domeni);
    assert.equal(domeni.length, Object.keys(rezultat.domeni).length);
    for (const domen of domeni) {
      assert.ok(domen.stavke.length > 0);
      assert.ok(domen.freshness === 'fresh' || domen.freshness === 'stale');
    }
  });
}

run();
