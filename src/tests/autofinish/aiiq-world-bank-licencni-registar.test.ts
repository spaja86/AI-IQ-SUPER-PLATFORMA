import {
  buildAIIQWorldBankLicencniRegistar,
  getLicencniChecklistPoDelatnosti,
  getLicencniComplianceIzvestaj,
  getLicencniExpirations,
} from '../../lib/aiiq-world-bank-licencni-registar';
import { APP_VERSION } from '../../lib/constants';

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
  console.log('\n📑 AI IQ WORLD BANK Licencni Registar — Unit Test Suite\n');

  const reg = buildAIIQWorldBankLicencniRegistar();

  await test('Registar vraća osnovne metapodatke', () => {
    assert(reg.naziv.includes('Licencni registar'), 'naziv');
    assertEqual(reg.verzija, APP_VERSION, 'verzija');
    assert(!Number.isNaN(Date.parse(reg.timestamp)), 'timestamp');
    assertEqual(reg.jurisdikcija.drzava, 'Srbija', 'jurisdikcija');
  });

  await test('Postoji scope i delatnosti', () => {
    assert(reg.scope.length >= 5, 'scope.length');
    assert(reg.delatnosti.length >= 10, 'delatnosti.length');
  });

  await test('Registar ima licence sa validnim statusima', () => {
    assert(reg.licence.length > 0, 'licence.length > 0');
    const statuses = new Set(reg.licence.map((x) => x.status));
    assert(statuses.has('potvrdjena'), 'ima potvrdjene');
    assert(statuses.has('u_nabavci'), 'ima aktivne nabavke');
  });

  await test('Gap analiza vraća prioritetne stavke', () => {
    assert(reg.gapovi.length > 0, 'gapovi.length');
    const first = reg.gapovi[0];
    assert(typeof first.prioritet === 'number' && first.prioritet > 0, 'first.prioritet');
  });

  await test('Srbija regulatorne licence su prebačene u kupovinu', () => {
    const srRegulatorne = reg.licence.filter(
      (item) => item.zahtev.klasifikacija === 'regulatorna' && /srbij|nbs|komisija/i.test(item.zahtev.regulatorIliIzdavalac),
    );
    assert(srRegulatorne.length > 0, 'srRegulatorne.length');
    assert(srRegulatorne.every((item) => item.status === 'u_nabavci'), 'srpske regulatorne licence nisu sve u nabavci');
  });

  await test('Nabavka status postoji za nedostajuće licence', () => {
    assert(reg.nabavka.length > 0, 'nabavka.length');
    assert(reg.nabavka.every((x) => x.status === 'u_toku'), 'aktivne nabavke');
  });

  await test('Checklista po delatnosti je dostupna', () => {
    const delatnost = reg.delatnosti[0];
    const lista = getLicencniChecklistPoDelatnosti(delatnost.id);
    assert(lista.length > 0, 'checklista ima stavke');
  });

  await test('Compliance izvestaji su konzistentni', () => {
    const mesecni = getLicencniComplianceIzvestaj('mesecni');
    const kvartalni = getLicencniComplianceIzvestaj('kvartalni');
    assert(mesecni.ukupnoLicenci > 0, 'mesecni.ukupnoLicenci');
    assert(kvartalni.ukupnoLicenci === mesecni.ukupnoLicenci, 'ukupnoLicenci match');
    assert(typeof mesecni.coverageProcenat === 'number', 'coverageProcenat');
  });

  await test('Expirations endpoint helper vraća rezultate', () => {
    const expirations = getLicencniExpirations(365);
    assert(expirations.length > 0, 'expirations > 0');
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
