import {
  buildDigitalnaIndustrijaPregled,
  getDigitalnaIndustrijaDomenModel,
} from '../../lib/digitalna-industrija-domen';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${e instanceof Error ? e.message : String(e)}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function run() {
  console.log('\n🏭 Digitalna Industrija — Domen Test Suite\n');

  await test('kanonski model sadrži umbrella nivoe', () => {
    const model = getDigitalnaIndustrijaDomenModel();
    assert(model.umbrellaNivoi.includes('industrija'), 'industrija mora biti umbrella nivo');
    assert(
      model.umbrellaNivoi.includes('glavni-endzin-digitalne-industrije'),
      'glavni-endzin-digitalne-industrije mora biti umbrella nivo',
    );
  });

  await test('scope pokriva sve kanonske oblasti', () => {
    const model = getDigitalnaIndustrijaDomenModel();
    const oblasti = model.scope.map((oblast) => oblast.oblast);
    for (const o of ['overview', 'finansije', 'rizici', 'compliance', 'licensing', 'kadrovi', 'operativa']) {
      assert(oblasti.includes(o), `Nedostaje oblast ${o}`);
    }
  });

  await test('pregled sadrži poslovne tokove i prioritetne blokatore', () => {
    const pregled = buildDigitalnaIndustrijaPregled();
    assert(pregled.poslovniTokovi.length >= 5, 'Očekuje se najmanje 5 poslovnih tokova');
    assert(pregled.prioritetniBlokatori.length > 0, 'Prioritetni blokatori moraju biti prisutni');
  });

  await test('operativni pregled referencira Glavni Endžin i budžet licenci', () => {
    const pregled = buildDigitalnaIndustrijaPregled();
    assert(pregled.operativniPregled.glavniEndzin.ukupnoSpojenih > 0, 'ukupnoSpojenih mora biti > 0');
    assert(pregled.operativniPregled.ukupniBudzetRSD > 0, 'ukupniBudzetRSD mora biti > 0');
  });

  await test('governance čuva quality gate i secret boundary pravila', () => {
    const pregled = buildDigitalnaIndustrijaPregled();
    assert(pregled.governance.qualityGate.includes('security'), 'security mora biti quality gate');
    assert(pregled.governance.secretsBoundary.length > 0, 'secrets boundary mora postojati');
  });

  console.log(`\n✅ Passed: ${passed}  ❌ Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
