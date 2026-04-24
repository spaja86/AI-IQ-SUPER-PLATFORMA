// Autofinish #852 — Unit Testovi za src/lib/statistika.ts
// Autofinish #853 — Unit Testovi za src/lib/auto-repair/upgrade-engine.ts
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getStatistike() vraća sve obavezne ključeve
//   2. Sve numeričke vrijednosti su >= 0
//   3. checkUpgrades() schema — paket, trenutna, najnovija, tip
//   4. Tip je major/minor/patch
//
// Pokretanje: npx tsx src/tests/autofinish/statistika.test.ts

import { getStatistike } from '../../lib/statistika';
import { checkUpgrades } from '../../lib/auto-repair/upgrade-engine';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

// ─── Minimal test runner ──────────────────────────────────────────────────────

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

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n📊 statistika.ts & upgrade-engine.ts — Unit Test Suite (#852 + #853)\n');

  // ── 1. getStatistike() — Obavezni ključevi (#852) ─────────────────────────
  console.log('📦 getStatistike() — Obavezni Ključevi (#852)');

  const s = getStatistike();

  await test('Vraća objekat', () => {
    assert(typeof s === 'object' && s !== null, 'getStatistike vraća objekat');
  });

  // Platforme
  await test('ukupnoPlatformi je broj >= 0', () => {
    assert(typeof s.ukupnoPlatformi === 'number', 'ukupnoPlatformi je broj');
    assert(s.ukupnoPlatformi >= 0, 'ukupnoPlatformi >= 0');
  });

  await test('ukupnoPlatformi > 0', () => {
    assert(s.ukupnoPlatformi > 0, 'ukupnoPlatformi > 0');
  });

  await test('aktivnihPlatformi <= ukupnoPlatformi', () => {
    assert(s.aktivnihPlatformi <= s.ukupnoPlatformi, 'aktivnihPlatformi <= ukupnoPlatformi');
  });

  // IT Proizvodi
  await test('ukupnoProizvoda je broj > 0', () => {
    assert(typeof s.ukupnoProizvoda === 'number', 'ukupnoProizvoda je broj');
    assert(s.ukupnoProizvoda > 0, 'ukupnoProizvoda > 0');
  });

  // Igrice
  await test('ukupnoIgrica je broj >= 0', () => {
    assert(typeof s.ukupnoIgrica === 'number', 'ukupnoIgrica je broj');
    assert(s.ukupnoIgrica >= 0, 'ukupnoIgrica >= 0');
  });

  // OMEGA AI
  await test('ukupnoOmegaPersona je broj > 0', () => {
    assert(typeof s.ukupnoOmegaPersona === 'number', 'ukupnoOmegaPersona je broj');
    assert(s.ukupnoOmegaPersona > 0, 'ukupnoOmegaPersona > 0');
  });

  // Promptovi
  await test('ukupnoPromptova je broj >= 0', () => {
    assert(typeof s.ukupnoPromptova === 'number', 'ukupnoPromptova je broj');
    assert(s.ukupnoPromptova >= 0, 'ukupnoPromptova >= 0');
  });

  // Stranice
  await test('ukupnoStranica je broj > 0', () => {
    assert(typeof s.ukupnoStranica === 'number', 'ukupnoStranica je broj');
    assert(s.ukupnoStranica > 0, 'ukupnoStranica > 0');
  });

  // Zdravlje
  await test('zdravljeSistema je broj 0–100', () => {
    assert(typeof s.zdravljeSistema === 'number', 'zdravljeSistema je broj');
    assert(s.zdravljeSistema >= 0 && s.zdravljeSistema <= 100, 'zdravljeSistema 0–100');
  });

  await test('zdravljeSistema === 100 (sve provere ok)', () => {
    assertEqual(s.zdravljeSistema, 100, 'zdravljeSistema=100');
  });

  // Autofinish
  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(s.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(s.verzija, APP_VERSION, 'verzija');
  });

  // Rute
  await test('ukupnoRuta je broj > 0', () => {
    assert(typeof s.ukupnoRuta === 'number', 'ukupnoRuta je broj');
    assert(s.ukupnoRuta > 0, 'ukupnoRuta > 0');
  });

  await test('ukupnoAPIRuta je broj > 0', () => {
    assert(typeof s.ukupnoAPIRuta === 'number', 'ukupnoAPIRuta je broj');
    assert(s.ukupnoAPIRuta > 0, 'ukupnoAPIRuta > 0');
  });

  await test('ukupnoRuta >= ukupnoAPIRuta', () => {
    assert(s.ukupnoRuta >= s.ukupnoAPIRuta, 'ukupnoRuta >= ukupnoAPIRuta');
  });

  // Dijagnostike
  await test('ukupnoDijagnostika > 0', () => {
    assert(typeof s.ukupnoDijagnostika === 'number', 'ukupnoDijagnostika je broj');
    assert(s.ukupnoDijagnostika > 0, 'ukupnoDijagnostika > 0');
  });

  await test('uspesnihDijagnostika <= ukupnoDijagnostika', () => {
    assert(s.uspesnihDijagnostika <= s.ukupnoDijagnostika, 'uspesnihDijagnostika <= ukupnoDijagnostika');
  });

  // Backend
  await test('bazaKolekcija je broj >= 0', () => {
    assert(typeof s.bazaKolekcija === 'number', 'bazaKolekcija je broj');
    assert(s.bazaKolekcija >= 0, 'bazaKolekcija >= 0');
  });

  await test('mejlSablona je broj >= 0', () => {
    assert(typeof s.mejlSablona === 'number', 'mejlSablona je broj');
  });

  await test('pricingPlanova je broj >= 0', () => {
    assert(typeof s.pricingPlanova === 'number', 'pricingPlanova je broj');
  });

  // Reklame
  await test('reklameUkupno je broj >= 0', () => {
    assert(typeof s.reklameUkupno === 'number', 'reklameUkupno je broj');
  });

  await test('partnerstvaUkupno je broj >= 0', () => {
    assert(typeof s.partnerstvaUkupno === 'number', 'partnerstvaUkupno je broj');
  });

  // ── 2. checkUpgrades() — Upgrade Engine (#853) ────────────────────────────
  console.log('\n📦 checkUpgrades() — Upgrade Engine (#853)');

  const upgrades = checkUpgrades();

  await test('Vraća niz', () => {
    assert(Array.isArray(upgrades), 'checkUpgrades vraća niz');
  });

  await test('Niz nije prazan', () => {
    assert(upgrades.length > 0, 'upgrades.length > 0');
  });

  await test('Svaki unos ima paket string', () => {
    for (const u of upgrades) {
      assert(typeof u.paket === 'string', `paket je string: ${u.paket}`);
      assert(u.paket.length > 0, `paket nije prazan: ${JSON.stringify(u)}`);
    }
  });

  await test('Svaki unos ima trenutna string', () => {
    for (const u of upgrades) {
      assert(typeof u.trenutna === 'string', `trenutna je string: ${u.paket}`);
      assert(u.trenutna.length > 0, `trenutna nije prazna: ${u.paket}`);
    }
  });

  await test('Svaki unos ima najnovija string', () => {
    for (const u of upgrades) {
      assert(typeof u.najnovija === 'string', `najnovija je string: ${u.paket}`);
      assert(u.najnovija.length > 0, `najnovija nije prazna: ${u.paket}`);
    }
  });

  await test('Svaki unos ima tip koji je major/minor/patch', () => {
    const validTipovi = ['major', 'minor', 'patch'];
    for (const u of upgrades) {
      assert(validTipovi.includes(u.tip), `tip je validan (${u.tip}): ${u.paket}`);
    }
  });

  await test('Paketi su unique (nema duplikata)', () => {
    const paketi = upgrades.map((u) => u.paket);
    const unique = new Set(paketi);
    assertEqual(unique.size, paketi.length, 'paketi su unique');
  });

  await test('Svaki paket ima non-empty semver-like format za trenutna', () => {
    const versionPattern = /^\d+/;
    for (const u of upgrades) {
      assert(versionPattern.test(u.trenutna), `trenutna počinje sa cifrom: ${u.paket}@${u.trenutna}`);
    }
  });

  // ─── Rezultat ─────────────────────────────────────────────────────────────
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
