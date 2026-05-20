import { buildGejmingIndustrija } from '../../lib/gejming-industrija';
import {
  APP_VERSION,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from '../../lib/constants';
import { igrice } from '../../lib/igrice';

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

async function runTests(): Promise<void> {
  console.log('\n🎮 Gejming Industrija — Unit Test Suite\n');

  const r = buildGejmingIndustrija('test-user-id');

  await test('Vraća objekat i status=aktivan', () => {
    assert(typeof r === 'object' && r !== null, 'rezultat je objekat');
    assertEqual(r.status, 'aktivan', 'status');
  });

  await test('Timestamp je validan ISO string', () => {
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Pregled ima očekivane KPI vrednosti', () => {
    assertEqual(r.pregled.ukupnoIgrica, igrice.length, 'ukupno igrica');
    assert(r.pregled.katalogKategorija > 0, 'katalog kategorija > 0');
    assert(r.pregled.aktivnihIgrica >= 0, 'aktivnih >= 0');
    assert(r.pregled.planiranihIgrica >= 0, 'planiranih >= 0');
    assert(r.pregled.starihIgrica >= 0, 'starih >= 0');
    assert(r.pregled.novihIgrica >= 0, 'novih >= 0');
  });

  await test('Lifecycle tokovi imaju svih 6 faza', () => {
    const faze = r.domeni.lifecycleIgara.tokovi.map((t) => t.faza);
    assertEqual(faze.length, 6, 'tokovi.length');
    assert(faze.includes('vizioniranje'), 'faza vizioniranje');
    assert(faze.includes('izmisljanje'), 'faza izmisljanje');
    assert(faze.includes('stvaranje'), 'faza stvaranje');
    assert(faze.includes('dodavanje'), 'faza dodavanje');
    assert(faze.includes('omogucavanje'), 'faza omogucavanje');
    assert(faze.includes('eksploatisanje'), 'faza eksploatisanje');
  });

  await test('Katalog po kategoriji je konzistentan', () => {
    const suma = r.domeni.katalogIgara.poKategoriji.reduce((s, k) => s + k.brojIgrica, 0);
    assertEqual(suma, r.pregled.ukupnoIgrica, 'suma po kategorijama');
  });

  await test('Distribucija/monetizacija i pristup su popunjeni', () => {
    assert(r.domeni.distribucijaMonetizacija.monetizacijaKanali.length > 0, 'monetizacija kanali');
    assert(r.domeni.distribucijaMonetizacija.distribucijaKanali.length > 0, 'distribucija kanali');
    assert(r.domeni.pristupKorisnika.loginObavezan === true, 'login obavezan');
    assert(r.domeni.pristupKorisnika.url.gejmingIndustrija === '/gejming-industrija', 'url gejming');
  });

  await test('KPI sekcija ima pozitivne vrednosti gde je očekivano', () => {
    assert(r.kpi.engineGamingEndzina > 0, 'gaming endžina > 0');
    assert(r.kpi.gejmingKategorija > 0, 'gaming kategorija > 0');
    assert(r.kpi.gejmingSaPrevucenimEndzinom > 0, 'prevučeno endžinom > 0');
    assert(r.kpi.aktivneIgriceSaEndzinom > 0, 'aktivne sa endžinom > 0');
  });

  await test('Verzija i brojači su ažurirani za novu rutu + API', () => {
    assertEqual(APP_VERSION, '57.3.0', 'APP_VERSION');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
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
