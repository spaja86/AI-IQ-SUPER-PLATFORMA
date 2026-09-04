import { GET as getPlatforma } from '../../app/api/io-openui-ao-gaming-platforma/route';
import { GET as getStatus } from '../../app/api/io-openui-ao-gaming-platforma-status/route';
import { GET as getIgrice } from '../../app/api/io-openui-ao-gaming-platforma-igrice/route';
import { GET as getEndzin } from '../../app/api/io-openui-ao-gaming-platforma-endzin/route';
import { GET as getPregled } from '../../app/api/io-openui-ao-gaming-platforma-pregled/route';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🧪 Gaming API Consistency — test suite\n');

  const routes = [
    ['platforma', getPlatforma],
    ['status', getStatus],
    ['igrice', getIgrice],
    ['endzin', getEndzin],
    ['pregled', getPregled],
  ] as const;

  for (const [routeName, routeGet] of routes) {
    await test(`${routeName} endpoint vraća konzistentan domen payload`, async () => {
      const response = await routeGet();
      assert(response.status >= 200 && response.status < 300, `${routeName}: neočekivan status ${response.status}`);
      const body = await response.json();
      assert(isObject(body), `${routeName}: body mora biti objekat`);
      assert(typeof body['domenId'] === 'string', `${routeName}: domenId mora postojati`);
      assert(typeof body['domenVerzija'] === 'string', `${routeName}: domenVerzija mora postojati`);
      assert(typeof body['status'] === 'string', `${routeName}: status mora postojati`);
      assert(isObject(body['healthSignal']), `${routeName}: healthSignal mora postojati`);
      assert(isObject(body['funkcionalnostObim']), `${routeName}: funkcionalnostObim mora postojati`);
      assert(isObject(body['audit']), `${routeName}: audit mora postojati`);
    });
  }

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
