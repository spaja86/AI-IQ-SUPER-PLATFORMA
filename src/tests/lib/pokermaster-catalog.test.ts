import { igrice } from '../../lib/igrice';
import { TOTAL_IGRICA } from '../../lib/constants';
import { GET as getIgriceRoute } from '../../app/api/igrice/route';
import { GET as getIgriceStatsRoute } from '../../app/api/igrice-stats/route';
import { GET as getGamingIgriceRoute } from '../../app/api/io-openui-ao-gaming-platforma-igrice/route';

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

async function readJson(response: Response): Promise<unknown> {
  return response.clone().json();
}

async function runTests(): Promise<void> {
  console.log('\n🃏 POKERMASTER — Katalog i API test suite\n');

  await test('TOTAL_IGRICA ostaje usklađen sa katalogom', () => {
    assertEqual(TOTAL_IGRICA, igrice.length, 'TOTAL_IGRICA === igrice.length');
  });

  await test('POKERMASTER postoji u katalogu sa postojećim ID-jem', () => {
    const pokerMaster = igrice.find((igrica) => igrica.id === 'igrica-spaja-poker');
    assert(pokerMaster !== undefined, 'igrica-spaja-poker mora postojati');
    assertEqual(pokerMaster?.naziv, 'POKERMASTER', 'naziv');
    assertEqual(pokerMaster?.status, 'aktivna', 'status');
    assertEqual(pokerMaster?.podrazumevanaDimenzija, '720D', 'podrazumevanaDimenzija');
  });

  await test('POKERMASTER opis i funkcije jasno označavaju simulacioni poker scope', () => {
    const pokerMaster = igrice.find((igrica) => igrica.id === 'igrica-spaja-poker');
    assert(pokerMaster !== undefined, 'igrica-spaja-poker mora postojati');
    assert(pokerMaster.opis.includes('bez real-money klađenja'), 'opis mora sadržati simulacioni scope');
    assert(
      pokerMaster.funkcije.some((funkcija) => funkcija.includes('bez real-money klađenja')),
      'funkcije moraju sadržati simulacioni scope',
    );
  });

  await test('/api/igrice uključuje POKERMASTER', async () => {
    const body = await readJson(await getIgriceRoute()) as {
      igrice: Array<{ id: string; naziv: string }>;
    };
    const pokerMaster = body.igrice.find((igrica) => igrica.id === 'igrica-spaja-poker');
    assert(pokerMaster !== undefined, '/api/igrice mora vratiti igrica-spaja-poker');
    assertEqual(pokerMaster?.naziv, 'POKERMASTER', '/api/igrice naziv');
  });

  await test('/api/igrice-stats ostaje konzistentan posle POKERMASTER rename-a', async () => {
    const body = await readJson(await getIgriceStatsRoute()) as {
      pregled: { ukupnoIgrica: number; detektovano: number };
    };
    assertEqual(body.pregled.ukupnoIgrica, TOTAL_IGRICA, '/api/igrice-stats ukupnoIgrica');
    assertEqual(body.pregled.detektovano, igrice.length, '/api/igrice-stats detektovano');
  });

  await test('/api/io-openui-ao-gaming-platforma-igrice uključuje POKERMASTER', async () => {
    const body = await readJson(await getGamingIgriceRoute()) as {
      igrice: Array<{ id: string; naziv: string }>;
    };
    const pokerMaster = body.igrice.find((igrica) => igrica.id === 'igrica-spaja-poker');
    assert(pokerMaster !== undefined, 'gaming platforma route mora vratiti igrica-spaja-poker');
    assertEqual(pokerMaster?.naziv, 'POKERMASTER', 'gaming platforma route naziv');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((failure) => console.error(`  • ${failure}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
