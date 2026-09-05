// SpajaUltraOmegaCore -∞Ω+∞ — Persona Bank Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  registerPersona,
  getPersona,
  updatePersona,
  archivePersona,
  listPersonas,
  getPersonaBankStats,
  bulkImportPersonas,
  autoArchiveStalePersonas,
  _resetPersonaBankStore,
  PERSONA_BANK_CONTRACT_VERSION,
  PERSONA_BANK_MAX_OCTAVE,
  PERSONA_BANK_MAX_HIPERMREZA_NODE,
  SEED_PERSONAS,
  PERSONA_BANK_SEED_AGENT_ID,
  PersonaBankClient,
  createPersonaBankClient,
} from '../../lib/persona-bank';
import type { PersonaRegistrationInput } from '../../lib/persona-bank';

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

const BASE_INPUT: PersonaRegistrationInput = {
  id: 'test-persona-1',
  name: 'Test Persona Alpha',
  type: 'creative',
  octave: 3,
  hipermrezaNode: 42,
  attributes: {
    traits: ['bold', 'visionary'],
    skills: ['design', 'storytelling'],
    tone: 'inspirational',
    domain: 'creative',
  },
  linkedAgents: ['another-maks-agent'],
};

async function runTests(): Promise<void> {
  console.log('\n🏦 PERSONA BANK — test suite\n');

  // ─── Constants ─────────────────────────────────────────────────────────────

  await test('CONTRACT_VERSION je definisan', () => {
    assert(typeof PERSONA_BANK_CONTRACT_VERSION === 'string' && PERSONA_BANK_CONTRACT_VERSION.length > 0, 'version mora biti string');
  });

  await test('MAX_OCTAVE je 16', () => {
    assertEqual(PERSONA_BANK_MAX_OCTAVE, 16, 'MAX_OCTAVE');
  });

  await test('MAX_HIPERMREZA_NODE je 256', () => {
    assertEqual(PERSONA_BANK_MAX_HIPERMREZA_NODE, 256, 'MAX_HIPERMREZA_NODE');
  });

  // ─── Store: register ────────────────────────────────────────────────────────

  await test('registerPersona kreira novu personu sa ispravnim poljima', () => {
    _resetPersonaBankStore();
    const p = registerPersona(BASE_INPUT, 'ci-bot');
    assertEqual(p.id, 'test-persona-1', 'id');
    assertEqual(p.name, 'Test Persona Alpha', 'name');
    assertEqual(p.type, 'creative', 'type');
    assertEqual(p.octave, 3, 'octave');
    assertEqual(p.hipermrezaNode, 42, 'hipermrezaNode');
    assertEqual(p.status, 'active', 'status');
    assertEqual(p.version, 1, 'version');
    assert(p.linkedAgents.includes('another-maks-agent'), 'linkedAgents');
    assert(p.auditLog.length === 1, 'auditLog length');
    assertEqual(p.auditLog[0].changeType, 'register', 'auditLog[0].changeType');
    assertEqual(p.auditLog[0].agentId, 'ci-bot', 'auditLog[0].agentId');
  });

  await test('registerPersona upsertuje postojeću personu (version bump)', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    const updated = registerPersona({ ...BASE_INPUT, name: 'Updated Alpha' }, 'ci-bot');
    assertEqual(updated.version, 2, 'version posle upsert');
    assertEqual(updated.name, 'Updated Alpha', 'name posle upsert');
    assert(updated.auditLog.length === 2, 'auditLog length posle upsert');
  });

  await test('registerPersona generiše id ako nije prosleđen', () => {
    _resetPersonaBankStore();
    const input: PersonaRegistrationInput = { ...BASE_INPUT };
    delete (input as { id?: string }).id;
    const p = registerPersona(input, 'ci-bot');
    assert(p.id.length > 0, 'id mora biti generisan');
  });

  // ─── Store: get ─────────────────────────────────────────────────────────────

  await test('getPersona vraća personu po id', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    const p = getPersona('test-persona-1');
    assert(p !== null, 'persona mora biti pronađena');
    assertEqual(p!.id, 'test-persona-1', 'id');
  });

  await test('getPersona vraća null za nepostojeci id', () => {
    _resetPersonaBankStore();
    const p = getPersona('nonexistent-id');
    assertEqual(p, null, 'mora biti null');
  });

  // ─── Store: update ──────────────────────────────────────────────────────────

  await test('updatePersona ažurira polja i bumps version', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    const p = updatePersona('test-persona-1', { name: 'Updated Name', octave: 7 }, 'ci-bot');
    assertEqual(p.name, 'Updated Name', 'name');
    assertEqual(p.octave, 7, 'octave');
    assertEqual(p.version, 2, 'version');
    assert(p.auditLog.length === 2, 'auditLog posle update');
    assertEqual(p.auditLog[1].changeType, 'update', 'changeType');
  });

  await test('updatePersona spaja attributes (merge, ne zamena)', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    const p = updatePersona('test-persona-1', { attributes: { tone: 'calm', traits: ['calm'], skills: ['calm'], domain: 'test' } }, 'ci-bot');
    assertEqual(p.attributes.tone, 'calm', 'tone ažuriran');
    assert(Array.isArray(p.attributes.traits), 'traits postoji');
  });

  await test('updatePersona baca grešku za nepostojeci id', () => {
    _resetPersonaBankStore();
    let threw = false;
    try {
      updatePersona('no-such-id', { name: 'X' }, 'ci-bot');
    } catch {
      threw = true;
    }
    assert(threw, 'mora baciti grešku');
  });

  await test('updatePersona baca grešku za arhiviranu personu', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    archivePersona('test-persona-1', 'ci-bot');
    let threw = false;
    try {
      updatePersona('test-persona-1', { name: 'X' }, 'ci-bot');
    } catch {
      threw = true;
    }
    assert(threw, 'mora baciti grešku za arhiviranje');
  });

  await test('updatePersona baca grešku kada status pokušava da pređe na archived', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    let threw = false;
    try {
      updatePersona('test-persona-1', { status: 'archived' }, 'ci-bot');
    } catch {
      threw = true;
    }
    assert(threw, 'mora baciti grešku za direktan archived update');
  });

  // ─── Store: archive ─────────────────────────────────────────────────────────

  await test('archivePersona postavlja status na archived', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    const p = archivePersona('test-persona-1', 'ci-bot');
    assertEqual(p.status, 'archived', 'status');
    assertEqual(p.version, 2, 'version posle arhiviranja');
    assertEqual(p.auditLog[1].changeType, 'archive', 'changeType');
  });

  await test('archivePersona baca grešku za nepostojeci id', () => {
    _resetPersonaBankStore();
    let threw = false;
    try {
      archivePersona('no-such-id', 'ci-bot');
    } catch {
      threw = true;
    }
    assert(threw, 'mora baciti grešku');
  });

  // ─── Store: list ─────────────────────────────────────────────────────────────

  await test('listPersonas vraća sve persone bez filtera', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    registerPersona({ ...BASE_INPUT, id: 'p2', name: 'P2', type: 'analytical', octave: 5, hipermrezaNode: 50 }, 'ci-bot');
    const all = listPersonas();
    assertEqual(all.length, 2, 'count');
  });

  await test('listPersonas filtrira po type', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    registerPersona({ ...BASE_INPUT, id: 'p2', name: 'P2', type: 'analytical', octave: 5, hipermrezaNode: 50 }, 'ci-bot');
    const creative = listPersonas({ type: 'creative' });
    assertEqual(creative.length, 1, 'creative count');
    assertEqual(creative[0].type, 'creative', 'type');
  });

  await test('listPersonas filtrira po status', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    registerPersona({ ...BASE_INPUT, id: 'p2', name: 'P2', type: 'analytical', octave: 5, hipermrezaNode: 50 }, 'ci-bot');
    archivePersona('p2', 'ci-bot');
    const active = listPersonas({ status: 'active' });
    assertEqual(active.length, 1, 'active count');
  });

  await test('listPersonas filtrira po octave', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    registerPersona({ ...BASE_INPUT, id: 'p2', name: 'P2', type: 'analytical', octave: 5, hipermrezaNode: 50 }, 'ci-bot');
    const oct3 = listPersonas({ octave: 3 });
    assertEqual(oct3.length, 1, 'octave 3 count');
  });

  await test('listPersonas filtrira po agent', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    registerPersona({ ...BASE_INPUT, id: 'p2', name: 'P2', type: 'analytical', octave: 5, hipermrezaNode: 50, linkedAgents: ['deploy-bot'] }, 'ci-bot');
    const filtered = listPersonas({ agent: 'another-maks-agent' });
    assertEqual(filtered.length, 1, 'agent filter count');
  });

  // ─── Store: stats ─────────────────────────────────────────────────────────────

  await test('getPersonaBankStats vraća ispravne ukupne statistike', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    registerPersona({ ...BASE_INPUT, id: 'p2', name: 'P2', type: 'analytical', octave: 5, hipermrezaNode: 50 }, 'ci-bot');
    archivePersona('p2', 'ci-bot');
    const stats = getPersonaBankStats();
    assertEqual(stats.total, 2, 'total');
    assertEqual(stats.byStatus.active, 1, 'active');
    assertEqual(stats.byStatus.archived, 1, 'archived');
    assertEqual(stats.byType.creative, 1, 'creative type count');
    assertEqual(stats.byType.analytical, 1, 'analytical type count');
    assert(stats.generatedAt.length > 0, 'generatedAt');
  });

  await test('getPersonaBankStats octaveCoverage broji aktivne oktave', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot'); // octave 3
    registerPersona({ ...BASE_INPUT, id: 'p2', name: 'P2', type: 'analytical', octave: 7, hipermrezaNode: 70 }, 'ci-bot');
    const stats = getPersonaBankStats();
    assertEqual(stats.octaveCoverage, 2, 'octaveCoverage');
  });

  // ─── Store: bulkImport ────────────────────────────────────────────────────────

  await test('bulkImportPersonas uvozi više persona', () => {
    _resetPersonaBankStore();
    const result = bulkImportPersonas([
      BASE_INPUT,
      { ...BASE_INPUT, id: 'b2', name: 'B2', octave: 9, hipermrezaNode: 90 },
    ], 'ci-bot');
    assertEqual(result.imported, 2, 'imported count');
    assertEqual(result.errors.length, 0, 'errors count');
  });

  // ─── Store: autoArchiveStalePersonas ─────────────────────────────────────────

  await test('autoArchiveStalePersonas ne arhivira sveže dormant persone', () => {
    _resetPersonaBankStore();
    registerPersona(BASE_INPUT, 'ci-bot');
    updatePersona('test-persona-1', { name: 'Dormant Alpha' }, 'ci-bot');
    // Manually set dormant status by archiving then pretending it's dormant
    // We just verify that a fresh persona is NOT archived
    const count = autoArchiveStalePersonas('lifecycle-agent');
    assertEqual(count, 0, 'ne sme arhivirati svezih');
  });

  // ─── PersonaBankClient ────────────────────────────────────────────────────────

  await test('PersonaBankClient.register radi ispravno', () => {
    _resetPersonaBankStore();
    const client = createPersonaBankClient('test-agent');
    const p = client.register(BASE_INPUT);
    assertEqual(p.id, 'test-persona-1', 'id');
    assertEqual(p.auditLog[0].agentId, 'test-agent', 'agentId u auditLogu');
  });

  await test('PersonaBankClient.get vraća personu', () => {
    _resetPersonaBankStore();
    const client = new PersonaBankClient('test-agent');
    client.register(BASE_INPUT);
    const p = client.get('test-persona-1');
    assert(p !== null, 'mora biti pronađeno');
  });

  await test('PersonaBankClient.list vraća sve persone', () => {
    _resetPersonaBankStore();
    const client = new PersonaBankClient('test-agent');
    client.register(BASE_INPUT);
    client.register({ ...BASE_INPUT, id: 'c2', name: 'C2', octave: 8, hipermrezaNode: 80 });
    const all = client.list();
    assertEqual(all.length, 2, 'list count');
  });

  await test('PersonaBankClient.stats vraća statistike', () => {
    _resetPersonaBankStore();
    const client = new PersonaBankClient('test-agent');
    client.register(BASE_INPUT);
    const stats = client.stats();
    assertEqual(stats.total, 1, 'stats total');
  });

  await test('PersonaBankClient.archive arhivira personu', () => {
    _resetPersonaBankStore();
    const client = new PersonaBankClient('test-agent');
    client.register(BASE_INPUT);
    const p = client.archive('test-persona-1');
    assertEqual(p.status, 'archived', 'archived status');
  });

  await test('PersonaBankClient.bulkImport radi ispravno', () => {
    _resetPersonaBankStore();
    const client = new PersonaBankClient('test-agent');
    const result = client.bulkImport([BASE_INPUT, { ...BASE_INPUT, id: 'bk2', name: 'BK2', octave: 11, hipermrezaNode: 110 }]);
    assertEqual(result.imported, 2, 'bulk import count');
  });

  // ─── Seed personas ────────────────────────────────────────────────────────────

  await test('SEED_PERSONAS sadrži barem jednu personu', () => {
    assert(SEED_PERSONAS.length > 0, 'SEED_PERSONAS mora biti neprazan');
  });

  await test('SEED_PERSONAS persone imaju ispravna obavezna polja', () => {
    for (const s of SEED_PERSONAS) {
      assert(typeof s.name === 'string' && s.name.length > 0, `${s.id}: name`);
      assert(typeof s.type === 'string', `${s.id}: type`);
      assert(typeof s.octave === 'number' && s.octave >= 1, `${s.id}: octave`);
      assert(typeof s.hipermrezaNode === 'number' && s.hipermrezaNode >= 1, `${s.id}: hipermrezaNode`);
    }
  });

  await test('PERSONA_BANK_SEED_AGENT_ID je definisan', () => {
    assert(typeof PERSONA_BANK_SEED_AGENT_ID === 'string' && PERSONA_BANK_SEED_AGENT_ID.length > 0, 'seed agent id');
  });

  await test('Bulk import seed personas sve uspesno uvozi', () => {
    _resetPersonaBankStore();
    const result = bulkImportPersonas(SEED_PERSONAS, PERSONA_BANK_SEED_AGENT_ID);
    assertEqual(result.errors.length, 0, 'seed import errors');
    assertEqual(result.imported, SEED_PERSONAS.length, 'seed import count');
  });

  // ─── Summary ──────────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  • ${f}`);
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
