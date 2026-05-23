// Kastler TV Signal Request — Lib Test
// Pokretanje: npx tsx src/tests/lib/kastler-tv-signal-request.test.ts

import {
  KASTLER_TV_ACCEPTANCE_TEXT,
  KASTLER_TV_REQUEST_VERSION,
  buildKastlerRequestRecord,
  getKastlerSignalOperationalState,
  getKastlerSignalReadinessSummary,
  getKastlerTVSignalRequestPackage,
  validateKastlerRequestPayload,
} from '../../lib/kastler-tv-signal-request';

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
  console.log('\n🏁 Kastler TV Signal Request — Lib Test Suite\n');

  await test('Operativno stanje vraća validne status vrednosti', () => {
    const state = getKastlerSignalOperationalState();
    assert(['u_pripremi', 'spremno_za_slanje', 'poslato'].includes(state.requestStatus), 'requestStatus');
    assert(['mock', 'pending', 'approved', 'active'].includes(state.signalLifecycle), 'signalLifecycle');
    assert(['cekanje_partnera', 'odobreno', 'aktivno'].includes(state.signalStatus), 'signalStatus');
  });

  await test('Signal paket ima očekivanu strukturu', () => {
    const paket = getKastlerTVSignalRequestPackage();
    assertEqual(paket.verzija, KASTLER_TV_REQUEST_VERSION, 'paket.verzija');
    assertEqual(paket.partner.id, 'kastler', 'paket.partner.id');
    assert(paket.trazeniKanali.length >= 12, 'paket.trazeniKanali.length');
    assert(paket.preduslovi.length >= 4, 'paket.preduslovi.length');
  });

  await test('Validation odbija neispravan payload', () => {
    const invalid = validateKastlerRequestPayload({
      expectedPartner: 'kastler',
      expectedVersion: 'bad',
      requestedChannelIds: ['x'],
      monetizationModel: 'hibrid',
      acceptanceText: 'bad',
      autoSendToPartner: false,
    });
    assertEqual(invalid.valid, false, 'invalid.valid');
    assert(invalid.errors.length >= 1, 'invalid.errors');
  });

  await test('Validation prihvata validan payload i generiše record', () => {
    const paket = getKastlerTVSignalRequestPackage();
    const payload = {
      expectedPartner: 'kastler' as const,
      expectedVersion: KASTLER_TV_REQUEST_VERSION,
      requestedChannelIds: paket.trazeniKanali.map((k) => k.kanalId),
      monetizationModel: 'hibrid' as const,
      acceptanceText: KASTLER_TV_ACCEPTANCE_TEXT,
      autoSendToPartner: true,
    };
    const valid = validateKastlerRequestPayload(payload);
    assertEqual(valid.valid, true, 'valid.valid');

    const record = buildKastlerRequestRecord(payload);
    assert(record.requestId.startsWith('KASTLER-'), 'record.requestId');
    assertEqual(record.partnerId, 'kastler', 'record.partnerId');
    assert(typeof record.auditHash === 'string' && record.auditHash.length === 64, 'record.auditHash');
  });

  await test('Readiness summary je konzistentan sa paketom', () => {
    const paket = getKastlerTVSignalRequestPackage();
    const summary = getKastlerSignalReadinessSummary();
    assertEqual(summary.partner, paket.partner.naziv, 'summary.partner');
    assertEqual(summary.trazenihKanala, paket.trazeniKanali.length, 'summary.trazenihKanala');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
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
