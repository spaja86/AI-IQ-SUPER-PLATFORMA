import {
  polygonscanTxUrl,
  polygonscanAddressUrl,
  kreirajAuditEntry,
} from '../../lib/wollet/audit';
import type { WolletTransaction } from '../../lib/wollet/types';

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

const MOCK_TX: WolletTransaction = {
  id: 1,
  naziv: 'Test Transakcija',
  opis: 'Test opis',
  iznosMinor: 1_000_000,
  valuta: 'USD',
  izvor: 'DIGI-IND-001',
  destinacija: 'Test',
  status: 'IZVRSENO',
  datumBlok: 0,
  inicijator: '0xdeadbeef',
};

async function run() {
  console.log('\n🔗 Wollet Audit Test Suite\n');

  await test('polygonscanTxUrl generiše mainnet URL', () => {
    const url = polygonscanTxUrl('0xabc123');
    assert(url.startsWith('https://polygonscan.com/tx/'), `Expected mainnet URL, got ${url}`);
    assert(url.endsWith('0xabc123'), `Expected hash in URL, got ${url}`);
  });

  await test('polygonscanTxUrl generiše amoy testnet URL', () => {
    const url = polygonscanTxUrl('0xabc123', 'amoy');
    assert(url.startsWith('https://amoy.polygonscan.com/tx/'), `Expected amoy URL, got ${url}`);
  });

  await test('polygonscanAddressUrl generiše mainnet address URL', () => {
    const url = polygonscanAddressUrl('0xdeadbeef');
    assert(url.includes('polygonscan.com/address/'), `Expected address URL, got ${url}`);
    assert(url.endsWith('0xdeadbeef'), `Expected address in URL, got ${url}`);
  });

  await test('polygonscanAddressUrl generiše amoy address URL', () => {
    const url = polygonscanAddressUrl('0xdeadbeef', 'amoy');
    assert(url.includes('amoy.polygonscan.com/address/'), `Expected amoy address URL, got ${url}`);
  });

  await test('kreirajAuditEntry kreira ispravan entry bez hash-a', () => {
    const entry = kreirajAuditEntry(MOCK_TX, 'write', '0xdeadbeef');
    assert(entry.transakcijId === 1, 'transakcijId treba da bude 1');
    assert(entry.akcija === 'write', 'akcija treba da bude write');
    assert(entry.inicijator === '0xdeadbeef', 'inicijator nije ispravan');
    assert(entry.blockchainHash === undefined, 'blockchainHash treba da bude undefined');
    assert(entry.polygonscanUrl === undefined, 'polygonscanUrl treba da bude undefined');
    assert(entry.id.startsWith('audit-1-'), 'id format nije ispravan');
  });

  await test('kreirajAuditEntry kreira ispravan entry sa hash-om', () => {
    const entry = kreirajAuditEntry(MOCK_TX, 'transfer', '0xdeadbeef', '0xhash123');
    assert(entry.blockchainHash === '0xhash123', 'blockchainHash nije ispravan');
    assert(entry.polygonscanUrl?.includes('0xhash123') === true, 'polygonscanUrl treba da sadrži hash');
  });

  await test('kreirajAuditEntry sadrži naziv transakcije u akcijaMeta', () => {
    const entry = kreirajAuditEntry(MOCK_TX, 'read', '0xdeadbeef');
    assert(entry.akcijaMeta.includes('Test Transakcija'), 'akcijaMeta treba da sadrži naziv');
    assert(entry.akcijaMeta.includes('Test opis'), 'akcijaMeta treba da sadrži opis');
  });

  await test('kreirajAuditEntry vreme je Date instanca', () => {
    const entry = kreirajAuditEntry(MOCK_TX, 'deposit', '0xdeadbeef');
    assert(entry.vreme instanceof Date, 'vreme treba da bude Date');
  });

  const ok = failed === 0;
  console.log(`\n${ok ? '✅' : '❌'} ${passed} passed, ${failed} failed\n`);
  if (!ok) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
