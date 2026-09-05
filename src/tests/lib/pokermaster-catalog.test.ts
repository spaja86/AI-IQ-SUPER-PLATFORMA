import { igrice } from '../../lib/igrice';
import { TOTAL_IGRICA } from '../../lib/constants';
import { getRunnerKompatibilnostZaIgricu } from '../../lib/gaming-endzin';
import { GET as getIgriceRoute } from '../../app/api/igrice/route';
import { GET as getIgriceStatsRoute } from '../../app/api/igrice-stats/route';
import { GET as getGamingIgriceRoute } from '../../app/api/io-openui-ao-gaming-platforma-igrice/route';
import { GET as getRealCreateQvadersRoute } from '../../app/api/master-poker-real-create-qvaders/route';

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
  console.log('\n🃏 MASTER POKER — Katalog i API test suite\n');

  await test('TOTAL_IGRICA ostaje usklađen sa katalogom', () => {
    assertEqual(TOTAL_IGRICA, igrice.length, 'TOTAL_IGRICA === igrice.length');
  });

  await test('MASTER POKER postoji u katalogu sa postojećim ID-jem', () => {
    const pokerMaster = igrice.find((igrica) => igrica.id === 'igrica-spaja-poker');
    assert(pokerMaster !== undefined, 'igrica-spaja-poker mora postojati');
    assertEqual(pokerMaster?.naziv, 'MASTER POKER', 'naziv');
    assertEqual(pokerMaster?.status, 'aktivna', 'status');
    assertEqual(pokerMaster?.podrazumevanaDimenzija, '720D', 'podrazumevanaDimenzija');
  });

  await test('MASTER POKER opis i funkcije jasno označavaju simulacioni poker scope', () => {
    const pokerMaster = igrice.find((igrica) => igrica.id === 'igrica-spaja-poker');
    assert(pokerMaster !== undefined, 'igrica-spaja-poker mora postojati');
    assert(pokerMaster.opis.includes('bez real-money klađenja'), 'opis mora sadržati simulacioni scope');
    assert(
      pokerMaster.funkcije.some((funkcija) => funkcija.includes('bez real-money klađenja')),
      'funkcije moraju sadržati simulacioni scope',
    );
  });

  await test('/api/igrice uključuje MASTER POKER', async () => {
    const body = await readJson(await getIgriceRoute()) as {
      igrice: Array<{ id: string; naziv: string }>;
    };
    const pokerMaster = body.igrice.find((igrica) => igrica.id === 'igrica-spaja-poker');
    assert(pokerMaster !== undefined, '/api/igrice mora vratiti igrica-spaja-poker');
    assertEqual(pokerMaster?.naziv, 'MASTER POKER', '/api/igrice naziv');
  });

  await test('/api/igrice-stats ostaje konzistentan posle MASTER POKER rename-a', async () => {
    const body = await readJson(await getIgriceStatsRoute()) as {
      pregled: { ukupnoIgrica: number; detektovano: number };
    };
    assertEqual(body.pregled.ukupnoIgrica, TOTAL_IGRICA, '/api/igrice-stats ukupnoIgrica');
    assertEqual(body.pregled.detektovano, igrice.length, '/api/igrice-stats detektovano');
  });

  await test('/api/io-openui-ao-gaming-platforma-igrice uključuje MASTER POKER', async () => {
    const body = await readJson(await getGamingIgriceRoute()) as {
      igrice: Array<{ id: string; naziv: string }>;
    };
    const pokerMaster = body.igrice.find((igrica) => igrica.id === 'igrica-spaja-poker');
    assert(pokerMaster !== undefined, 'gaming platforma route mora vratiti igrica-spaja-poker');
    assertEqual(pokerMaster?.naziv, 'MASTER POKER', 'gaming platforma route naziv');
  });

  await test('/api/master-poker-real-create-qvaders izlaže ugovor', async () => {
    const body = await readJson(await getRealCreateQvadersRoute()) as {
      status: string;
      track: string;
      contract: { name: string; canonicalRank: string; aliases: string[] };
    };
    assertEqual(body.status, 'aktivan', 'status');
    assertEqual(body.track, 'master-poker', 'track');
    assertEqual(body.contract.name, 'REAL CREATE QVADERS', 'contract.name');
    assertEqual(body.contract.canonicalRank, 'four-of-kind', 'canonicalRank');
    assert(body.contract.aliases.includes('qvaders'), 'aliases mora sadržati qvaders');
  });

  await test('GAMELORD postoji u katalogu i koristi postojeći runner', () => {
    const gamelord = igrice.find((igrica) => igrica.id === 'igrica-gamelord');
    assert(gamelord !== undefined, 'igrica-gamelord mora postojati');
    assertEqual(gamelord?.naziv, 'GAMES (GAMELORD)', 'naziv');
    const kompat = getRunnerKompatibilnostZaIgricu(gamelord!);
    assertEqual(kompat.status, 'existing-runner', 'runner kompatibilnost');
  });

  await test('MAKIN i Back to Spaces zadržavaju očekivane granice objekata', () => {
    const makin = igrice.find((igrica) => igrica.id === 'igrica-makin');
    const backToSpaces = igrice.find((igrica) => igrica.id === 'igrica-back-to-spaces-another-races');
    assert(makin !== undefined, 'igrica-makin mora postojati');
    assert(backToSpaces !== undefined, 'igrica-back-to-spaces-another-races mora postojati');
    assertEqual(makin?.status, 'aktivna', 'MAKIN status');
    assertEqual(backToSpaces?.status, 'beta', 'Back to Spaces status');
    assert(makin?.funkcije.some((stavka) => stavka.includes('Market Maker')), 'MAKIN funkcije moraju ostati fintech');
    assert(backToSpaces?.funkcije.some((stavka) => stavka.includes('Fairness validacija')), 'Back to Spaces funkcije moraju ostati fairness');
  });

  await test('/api/igrice uključuje GAMELORD scope metadata', async () => {
    const body = await readJson(await getIgriceRoute()) as {
      gamesScope: { targetSurface: { api: string[] }; requiredOutputs: string[] };
      igrice: Array<{ id: string; naziv: string }>;
    };
    const gamelord = body.igrice.find((igrica) => igrica.id === 'igrica-gamelord');
    assert(gamelord !== undefined, '/api/igrice mora vratiti igrica-gamelord');
    assert(body.gamesScope.targetSurface.api.includes('/api/gamelord/evaluate'), 'scope mora uključiti gamelord evaluate');
    assert(body.gamesScope.requiredOutputs.includes('rollout-guardrails'), 'required outputs mora uključiti rollout guardrails');
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
