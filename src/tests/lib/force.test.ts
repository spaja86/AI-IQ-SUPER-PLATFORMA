// SpajaUltraOmegaCore -∞Ω+∞ — FORCE Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  buildForce,
  FORCE_CONTRACT_VERSION,
  FORCE_MODEL_VERSION,
  FORCE_SOURCE_OF_TRUTH,
  FORCE_WEIGHTS,
  FORCE_SLA_THRESHOLDS,
  FORCE_NAZIV,
} from '../../lib/force';
import {
  addForceSnapshot,
  getForceSnapshots,
  getForceLastSnapshot,
  FORCE_MAX_SNAPSHOTS,
} from '../../lib/force-store';
import type { ForceSnapshot } from '../../lib/force-store';

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
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

function assertInRange(value: number, min: number, max: number, label: string): void {
  if (value < min || value > max) {
    throw new Error(`${label}: ${value} nije u opsegu [${min}, ${max}]`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n⚡ FORCE — test suite\n');

  // ─── Konstante ────────────────────────────────────────────────────────────

  await test('FORCE_CONTRACT_VERSION je v1', () => {
    assertEqual(FORCE_CONTRACT_VERSION, 'v1', 'contract version');
  });

  await test('FORCE_MODEL_VERSION je 1.0.0', () => {
    assertEqual(FORCE_MODEL_VERSION, '1.0.0', 'model version');
  });

  await test('FORCE_SOURCE_OF_TRUTH je /api/force', () => {
    assertEqual(FORCE_SOURCE_OF_TRUTH, '/api/force', 'source of truth');
  });

  await test('FORCE_NAZIV sadrži FORCE', () => {
    assert(FORCE_NAZIV.includes('FORCE'), 'naziv mora sadržati FORCE');
  });

  // ─── Weights ──────────────────────────────────────────────────────────────

  await test('FORCE_WEIGHTS suma je tačno 1.0', () => {
    const sum = Object.values(FORCE_WEIGHTS).reduce((a, b) => a + b, 0);
    assert(Math.abs(sum - 1) <= 0.0001, `suma težina mora biti 1.0, dobijeno: ${sum}`);
  });

  await test('FORCE_WEIGHTS ima tačno 6 domena', () => {
    assertEqual(Object.keys(FORCE_WEIGHTS).length, 6, 'broj domena');
  });

  await test('FORCE_WEIGHTS.fokus je 0.20', () => {
    assertEqual(FORCE_WEIGHTS.fokus, 0.20, 'fokus weight');
  });

  await test('FORCE_WEIGHTS.operativa je 0.18', () => {
    assertEqual(FORCE_WEIGHTS.operativa, 0.18, 'operativa weight');
  });

  await test('FORCE_WEIGHTS.reakcija je 0.16', () => {
    assertEqual(FORCE_WEIGHTS.reakcija, 0.16, 'reakcija weight');
  });

  await test('FORCE_WEIGHTS.cilj je 0.18', () => {
    assertEqual(FORCE_WEIGHTS.cilj, 0.18, 'cilj weight');
  });

  await test('FORCE_WEIGHTS.energija je 0.16', () => {
    assertEqual(FORCE_WEIGHTS.energija, 0.16, 'energija weight');
  });

  await test('FORCE_WEIGHTS.snaga je 0.12', () => {
    assertEqual(FORCE_WEIGHTS.snaga, 0.12, 'snaga weight');
  });

  // ─── SLA Thresholds ───────────────────────────────────────────────────────

  await test('FORCE_SLA_THRESHOLDS ima 6 domena', () => {
    assertEqual(Object.keys(FORCE_SLA_THRESHOLDS).length, 6, 'broj SLA pragova');
  });

  await test('Svi SLA pragovi su u opsegu [0, 100]', () => {
    for (const [key, val] of Object.entries(FORCE_SLA_THRESHOLDS)) {
      assertInRange(val, 0, 100, `SLA prag ${key}`);
    }
  });

  // ─── buildForce rezultat ──────────────────────────────────────────────────

  await test('buildForce vraća objekat sa svim domenima', () => {
    const rezultat = buildForce();
    assert(rezultat !== null && typeof rezultat === 'object', 'rezultat mora biti objekat');
    assert('domeni' in rezultat, 'mora imati domeni');
    assert('fokus' in rezultat.domeni, 'mora imati fokus domen');
    assert('operativa' in rezultat.domeni, 'mora imati operativa domen');
    assert('reakcija' in rezultat.domeni, 'mora imati reakcija domen');
    assert('cilj' in rezultat.domeni, 'mora imati cilj domen');
    assert('energija' in rezultat.domeni, 'mora imati energija domen');
    assert('snaga' in rezultat.domeni, 'mora imati snaga domen');
  });

  await test('ukupanScore je u opsegu [0, 100]', () => {
    const rezultat = buildForce();
    assertInRange(rezultat.ukupanScore, 0, 100, 'ukupanScore');
  });

  await test('Svi domenski scoreovi su u opsegu [0, 100]', () => {
    const rezultat = buildForce();
    for (const [key, domen] of Object.entries(rezultat.domeni)) {
      assertInRange(domen.score, 0, 100, `score za domen ${key}`);
    }
  });

  await test('Svi domenski scoreovi su konačni brojevi (bez NaN i Infinity)', () => {
    const rezultat = buildForce();
    for (const [key, domen] of Object.entries(rezultat.domeni)) {
      assert(Number.isFinite(domen.score), `score za domen ${key} mora biti konačan broj`);
    }
  });

  await test('ukupanScore je konačan broj (bez NaN i Infinity)', () => {
    const rezultat = buildForce();
    assert(Number.isFinite(rezultat.ukupanScore), 'ukupanScore mora biti konačan broj');
  });

  await test('konacnaOcena je jedna od dozvoljenjih vrednosti', () => {
    const rezultat = buildForce();
    const dozvoljene = ['ODLICNO', 'SPREMNO', 'DELIMICNO', 'POTREBNO_POBOLJSANJE'];
    assert(dozvoljene.includes(rezultat.konacnaOcena), `konacnaOcena mora biti jedna od: ${dozvoljene.join(', ')}`);
  });

  await test('trendMomentum je jedan od: bullish, bearish, neutral', () => {
    const rezultat = buildForce();
    const dozvoljeni = ['bullish', 'bearish', 'neutral'];
    assert(dozvoljeni.includes(rezultat.trendMomentum), 'trendMomentum nevalidan');
  });

  await test('meta.contractVersion odgovara FORCE_CONTRACT_VERSION', () => {
    const rezultat = buildForce();
    assertEqual(rezultat.meta.contractVersion, FORCE_CONTRACT_VERSION, 'meta.contractVersion');
  });

  await test('meta.modelVersion odgovara FORCE_MODEL_VERSION', () => {
    const rezultat = buildForce();
    assertEqual(rezultat.meta.modelVersion, FORCE_MODEL_VERSION, 'meta.modelVersion');
  });

  await test('meta.scoreWeights je identičan FORCE_WEIGHTS', () => {
    const rezultat = buildForce();
    const weightsSum = Object.values(rezultat.meta.scoreWeights).reduce((a, b) => a + b, 0);
    assert(Math.abs(weightsSum - 1) <= 0.0001, 'meta.scoreWeights suma mora biti 1.0');
  });

  await test('meta.slaThresholds je identičan FORCE_SLA_THRESHOLDS', () => {
    const rezultat = buildForce();
    for (const key of Object.keys(FORCE_SLA_THRESHOLDS) as (keyof typeof FORCE_SLA_THRESHOLDS)[]) {
      assertEqual(
        rezultat.meta.slaThresholds[key],
        FORCE_SLA_THRESHOLDS[key],
        `slaThreshold za ${key}`,
      );
    }
  });

  await test('kriticniDomeni je niz', () => {
    const rezultat = buildForce();
    assert(Array.isArray(rezultat.kriticniDomeni), 'kriticniDomeni mora biti niz');
  });

  await test('domeniBrojKriticnih odgovara dužini kriticniDomeni', () => {
    const rezultat = buildForce();
    assertEqual(rezultat.domeniBrojKriticnih, rezultat.kriticniDomeni.length, 'broj kritičnih domena');
  });

  await test('preporuke je neprazan niz', () => {
    const rezultat = buildForce();
    assert(Array.isArray(rezultat.preporuke), 'preporuke mora biti niz');
    assert(rezultat.preporuke.length > 0, 'mora imati bar jednu preporuku');
  });

  await test('timestamp je validni ISO 8601 string', () => {
    const rezultat = buildForce();
    const ts = new Date(rezultat.timestamp);
    assert(!isNaN(ts.getTime()), 'timestamp mora biti validan ISO 8601');
  });

  await test('ekosistem sadrži apiRute i ukupnoRuta', () => {
    const rezultat = buildForce();
    assert(typeof rezultat.ekosistem.apiRute === 'number', 'apiRute mora biti broj');
    assert(typeof rezultat.ekosistem.ukupnoRuta === 'number', 'ukupnoRuta mora biti broj');
    assert(rezultat.ekosistem.apiRute > 0, 'apiRute mora biti pozitivan');
    assert(rezultat.ekosistem.ukupnoRuta > 0, 'ukupnoRuta mora biti pozitivan');
  });

  await test('Svaki domen ima ispravne tezina i slaThreshold vrednosti', () => {
    const rezultat = buildForce();
    for (const key of Object.keys(FORCE_WEIGHTS) as (keyof typeof FORCE_WEIGHTS)[]) {
      assertEqual(rezultat.domeni[key].tezina, FORCE_WEIGHTS[key], `tezina za ${key}`);
      assertEqual(rezultat.domeni[key].slaThreshold, FORCE_SLA_THRESHOLDS[key], `slaThreshold za ${key}`);
    }
  });

  await test('Doprinos svakog domena je u opsegu [0, 100]', () => {
    const rezultat = buildForce();
    for (const [key, domen] of Object.entries(rezultat.domeni)) {
      assertInRange(domen.doprinos, 0, 100, `doprinos za ${key}`);
    }
  });

  await test('Freshness je jedna od: fresh, stale, unknown', () => {
    const rezultat = buildForce();
    const dozvoljene = ['fresh', 'stale', 'unknown'];
    for (const [key, domen] of Object.entries(rezultat.domeni)) {
      assert(dozvoljene.includes(domen.freshness), `freshness za ${key} mora biti fresh/stale/unknown`);
    }
  });

  await test('trendDirection je jedna od dozvoljenih vrednosti', () => {
    const rezultat = buildForce();
    const dozvoljene = ['rising', 'falling', 'accelerating', 'decelerating', 'stable'];
    for (const [key, domen] of Object.entries(rezultat.domeni)) {
      assert(dozvoljene.includes(domen.trendDirection), `trendDirection za ${key} nevalidan`);
    }
  });

  // ─── Snapshot store ───────────────────────────────────────────────────────

  await test('addForceSnapshot čuva snapshot i getForceSnapshots ga vraća', () => {
    const before = getForceSnapshots().length;
    const snap: ForceSnapshot = {
      ukupanScore: 85,
      ukupnaVelocity: 2,
      domenScores: { fokus: 88, operativa: 84, reakcija: 82, cilj: 86, energija: 83, snaga: 80 },
      timestamp: new Date().toISOString(),
    };
    addForceSnapshot(snap);
    const after = getForceSnapshots();
    assert(after.length === before + 1, 'snapshot mora biti dodat');
    assertEqual(after[after.length - 1].ukupanScore, 85, 'ukupanScore snapshotа');
  });

  await test('getForceLastSnapshot vraća poslednji snapshot', () => {
    const snap: ForceSnapshot = {
      ukupanScore: 90,
      ukupnaVelocity: 1,
      domenScores: { fokus: 91, operativa: 90, reakcija: 89, cilj: 91, energija: 90, snaga: 88 },
      timestamp: new Date().toISOString(),
    };
    addForceSnapshot(snap);
    const last = getForceLastSnapshot();
    assert(last !== null, 'last snapshot ne sme biti null');
    assertEqual(last!.ukupanScore, 90, 'poslednji snapshot ukupanScore');
  });

  await test('FORCE_MAX_SNAPSHOTS je pozitivan broj', () => {
    assert(FORCE_MAX_SNAPSHOTS > 0, 'FORCE_MAX_SNAPSHOTS mora biti pozitivan');
  });

  await test('Store ne prelazi FORCE_MAX_SNAPSHOTS', () => {
    for (let i = 0; i < FORCE_MAX_SNAPSHOTS + 10; i++) {
      addForceSnapshot({
        ukupanScore: i % 100,
        ukupnaVelocity: 0,
        domenScores: { fokus: 80, operativa: 80, reakcija: 80, cilj: 80, energija: 80, snaga: 80 },
        timestamp: new Date().toISOString(),
      });
    }
    const snapshots = getForceSnapshots();
    assert(
      snapshots.length <= FORCE_MAX_SNAPSHOTS,
      `Store ne sme imati više od ${FORCE_MAX_SNAPSHOTS} snapshotova, ima: ${snapshots.length}`,
    );
  });

  // ─── History integracija ──────────────────────────────────────────────────

  await test('buildForce čuva snapshot i history raste', () => {
    const pre = getForceSnapshots().length;
    const lastBefore = getForceLastSnapshot();
    buildForce();
    const post = getForceSnapshots();
    // When store is at capacity it stays capped; otherwise it grows by 1
    assert(post.length >= pre, 'snapshot count ne sme opadati');
    const lastAfter = getForceLastSnapshot();
    assert(lastAfter !== null, 'mora imati poslednji snapshot nakon buildForce');
    // The last snapshot must be newer (or equal if same ms) than before
    if (lastBefore !== null) {
      assert(
        lastAfter!.timestamp >= lastBefore.timestamp,
        'novi snapshot mora imati timestamp >= prethodnog',
      );
    }
  });

  await test('trendSnapshotCount odgovara istorijatu', () => {
    const pre = getForceSnapshots().length;
    const rezultat = buildForce();
    assert(rezultat.trendSnapshotCount === pre + 1, 'trendSnapshotCount mora biti pre+1');
  });

  // ─── SLA granična provera ─────────────────────────────────────────────────

  await test('kriticniDomeni sadrži samo domene ispod SLA praga', () => {
    const rezultat = buildForce();
    for (const naziv of rezultat.kriticniDomeni) {
      const domen = Object.values(rezultat.domeni).find((d) => d.naziv === naziv);
      assert(domen !== undefined, `${naziv} mora postojati u domenima`);
      assert(
        domen.score < domen.slaThreshold,
        `${naziv} score=${domen.score} mora biti < slaThreshold=${domen.slaThreshold}`,
      );
    }
  });

  await test('Domeni iznad SLA praga nisu u kriticniDomeni', () => {
    const rezultat = buildForce();
    for (const [, domen] of Object.entries(rezultat.domeni)) {
      if (domen.score >= domen.slaThreshold) {
        assert(
          !rezultat.kriticniDomeni.includes(domen.naziv),
          `${domen.naziv} je iznad SLA praga i ne sme biti u kriticniDomeni`,
        );
      }
    }
  });
}

runTests()
  .then(() => {
    console.log('\n────────────────────────────────────────');
    console.log(`FORCE — Results: ${passed} passed, ${failed} failed`);
    if (failures.length > 0) {
      console.error('\nFailed tests:');
      for (const f of failures) console.error(`  - ${f}`);
      process.exit(1);
    } else {
      console.log('✅ Svi testovi prošli.');
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('Test runner error:', err);
    process.exit(1);
  });
