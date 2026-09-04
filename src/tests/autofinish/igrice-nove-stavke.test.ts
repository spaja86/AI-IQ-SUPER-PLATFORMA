import { TOTAL_IGRICA } from '../../lib/constants';
import { igrice, getIgricePoKategoriji } from '../../lib/igrice';
import { GET as getIgrice } from '../../app/api/igrice/route';
import { GET as getIgriceStats } from '../../app/api/igrice-stats/route';
import { GET as getIgriceKategorije } from '../../app/api/igrice-kategorije/route';

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

async function runTests(): Promise<void> {
  console.log('\n🎮 Igrice — Nove Stavke (Filmska Industrija + Biskop sa Dimenzijama + COLD AND FIRE)\n');

  await test('TOTAL_IGRICA prati stvarni broj stavki', () => {
    assertEqual(TOTAL_IGRICA, igrice.length, 'TOTAL_IGRICA === igrice.length');
  });

  await test('Postoji Filmska Industrija i aktivna je', () => {
    const filmska = igrice.find((i) => i.id === 'igrica-filmska-industrija');
    assert(Boolean(filmska), 'igrica-filmska-industrija postoji');
    assertEqual(filmska?.naziv, 'Filmska Industrija', 'naziv');
    assertEqual(filmska?.kategorija, 'simulacija', 'kategorija');
    assertEqual(filmska?.status, 'aktivna', 'status');
    assert(filmska?.podrzaneDimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(filmska?.podrzaneDimenzije.includes('5760D') ?? false, 'podrzava 5760D');
  });

  await test('Postoji Biskop sa Dimenzijama i aktivna je', () => {
    const biskop = igrice.find((i) => i.id === 'igrica-biskop-sa-dimenzijama');
    assert(Boolean(biskop), 'igrica-biskop-sa-dimenzijama postoji');
    assertEqual(biskop?.naziv, 'Biskop sa Dimenzijama', 'naziv');
    assertEqual(biskop?.kategorija, 'strategija', 'kategorija');
    assertEqual(biskop?.status, 'aktivna', 'status');
    assert(biskop?.podrzaneDimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(biskop?.podrzaneDimenzije.includes('5760D') ?? false, 'podrzava 5760D');
  });

  await test('Postoji COLD AND FIRE i aktivna je', () => {
    const coldFire = igrice.find((i) => i.id === 'igrica-cold-and-fire');
    assert(Boolean(coldFire), 'igrica-cold-and-fire postoji');
    assertEqual(coldFire?.naziv, 'COLD AND FIRE', 'naziv');
    assertEqual(coldFire?.kategorija, 'borbena', 'kategorija');
    assertEqual(coldFire?.status, 'aktivna', 'status');
    assert(coldFire?.podrzaneDimenzije.includes('360D') ?? false, 'podrzava 360D');
    assert(coldFire?.podrzaneDimenzije.includes('5760D') ?? false, 'podrzava 5760D');
    assertEqual(coldFire?.podrazumevanaDimenzija, '720D', 'podrazumevana dimenzija');
  });

  await test('COLD AND FIRE ima sve obavezne funkcije', () => {
    const coldFire = igrice.find((i) => i.id === 'igrica-cold-and-fire');
    assert(Boolean(coldFire), 'igrica-cold-and-fire postoji');
    assert((coldFire?.funkcije.length ?? 0) > 0, 'ima funkcije');
    assert((coldFire?.preporuceniProizvodi.length ?? 0) > 0, 'ima preporucene proizvode');
    assert((coldFire?.zahtevi.length ?? 0) > 0, 'ima zahteve');
  });

  await test('COLD AND FIRE ulazi u kategorički pregled', () => {
    const borbene = getIgricePoKategoriji('borbena');
    assert(borbene.some((i) => i.id === 'igrica-cold-and-fire'), 'cold-and-fire je u borbena');
  });

  await test('Nove stavke ulaze u kategorički pregled', () => {
    const simulacije = getIgricePoKategoriji('simulacija');
    const strategije = getIgricePoKategoriji('strategija');
    assert(simulacije.some((i) => i.id === 'igrica-filmska-industrija'), 'filmska je u simulacija');
    assert(strategije.some((i) => i.id === 'igrica-biskop-sa-dimenzijama'), 'biskop je u strategija');
  });

  await test('Postoje Neon Ops Squad, Quantum Kart League i Hram Koda', () => {
    const neonOps = igrice.find((i) => i.id === 'igrica-neon-ops-squad');
    const quantumKart = igrice.find((i) => i.id === 'igrica-quantum-kart-league');
    const hramKoda = igrice.find((i) => i.id === 'igrica-hram-koda');

    assert(Boolean(neonOps), 'igrica-neon-ops-squad postoji');
    assertEqual(neonOps?.status, 'aktivna', 'Neon Ops status');
    assertEqual(neonOps?.kategorija, 'akcija', 'Neon Ops kategorija');

    assert(Boolean(quantumKart), 'igrica-quantum-kart-league postoji');
    assertEqual(quantumKart?.status, 'beta', 'Quantum Kart status');
    assertEqual(quantumKart?.kategorija, 'trka', 'Quantum Kart kategorija');

    assert(Boolean(hramKoda), 'igrica-hram-koda postoji');
    assertEqual(hramKoda?.status, 'planirana', 'Hram Koda status');
    assertEqual(hramKoda?.kategorija, 'edukativna', 'Hram Koda kategorija');
  });

  await test('/api/igrice uključuje gamesScope i runner kompatibilnost', async () => {
    const response = await getIgrice();
    assertEqual(response.status, 200, 'status /api/igrice');
    const body = await response.json() as {
      gamesScope?: unknown;
      igrice?: Array<{ id: string; runnerKompatibilnost?: { status?: string } }>;
    };
    assert(Boolean(body.gamesScope), 'gamesScope postoji');
    const hram = body.igrice?.find((i) => i.id === 'igrica-hram-koda');
    assert(Boolean(hram), 'hram-koda postoji u /api/igrice');
    assertEqual(hram?.runnerKompatibilnost?.status, 'existing-runner', 'runner kompatibilnost');
  });

  await test('/api/igrice-stats i /api/igrice-kategorije uključuju status i runner analitiku', async () => {
    const statsResponse = await getIgriceStats();
    const stats = await statsResponse.json() as {
      pregled?: { poStatusu?: { planirana?: number } };
      runnerCoverage?: { existingRunner?: number };
    };
    assertEqual(statsResponse.status, 200, 'status /api/igrice-stats');
    assert((stats.pregled?.poStatusu?.planirana ?? 0) >= 1, 'stats poStatusu.planirana >= 1');
    assert((stats.runnerCoverage?.existingRunner ?? 0) > 0, 'stats existing runner > 0');

    const kategorijeResponse = await getIgriceKategorije();
    const kategorije = await kategorijeResponse.json() as {
      pregled?: { poStatusu?: { beta?: number } };
      poKategorijama?: Array<{ kategorija: string; runnerTipovi?: string[] }>;
    };
    assertEqual(kategorijeResponse.status, 200, 'status /api/igrice-kategorije');
    assert((kategorije.pregled?.poStatusu?.beta ?? 0) >= 1, 'kategorije poStatusu.beta >= 1');
    const trka = kategorije.poKategorijama?.find((k) => k.kategorija === 'trka');
    assert((trka?.runnerTipovi ?? []).includes('akcija'), 'trka kategorija ima akcija runner');
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
