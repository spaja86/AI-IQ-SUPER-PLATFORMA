// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI: Instrukcija Za Sve Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  INSTRUKCIJA_REGISTRY,
  getInstrukcija,
  listInstrukcije,
  buildExtrimliExportBundle,
  EXTRIMLI_EXPORT_BUNDLE_VERSION,
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_MODULE_VERSION,
  EXTRIMLI_PERSONA_ID,
  SPORT_REGISTRY,
} from '../../lib/extrimli';

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string): void {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

// ─── listInstrukcije ──────────────────────────────────────────────────────────

console.log('\n[listInstrukcije]');

const all = listInstrukcije();
assert(all.length === 9, 'returns exactly 9 modules');
assert(Array.isArray(all), 'returns an array');
assert(all !== INSTRUKCIJA_REGISTRY, 'returns a copy (not the same reference)');

const requiredFields: (keyof typeof all[0])[] = ['id', 'naziv', 'opis', 'endpointPath', 'methods', 'edgeCases'];
for (const field of requiredFields) {
  assert(all.every((e) => e[field] !== undefined && e[field] !== ''), `every entry has "${field}"`);
}

const moduleIds = all.map((e) => e.id);
for (const id of ['risk', 'destruction', 'gear', 'events', 'performance', 'sports', 'weather', 'read-voice', 'health']) {
  assert(moduleIds.includes(id), `contains module "${id}"`);
}

// ─── getInstrukcija ───────────────────────────────────────────────────────────

console.log('\n[getInstrukcija]');

const riskEntry = getInstrukcija('risk');
assert(riskEntry !== undefined, 'getInstrukcija("risk") returns entry');
assert(riskEntry?.id === 'risk', 'id is "risk"');
assert(riskEntry?.inputType === 'RiskInput', 'inputType is RiskInput');
assert(riskEntry?.outputType === 'RiskResult', 'outputType is RiskResult');
assert(typeof riskEntry?.primerInput === 'object' && riskEntry.primerInput !== null, 'primerInput is an object');
assert(typeof riskEntry?.primerOutput === 'object' && riskEntry.primerOutput !== null, 'primerOutput is an object');
assert(Array.isArray(riskEntry?.edgeCases) && riskEntry.edgeCases.length > 0, 'edgeCases is non-empty array');
assert(riskEntry?.endpointPath === '/api/extrimli/risk', 'endpointPath correct');

const healthEntry = getInstrukcija('health');
assert(healthEntry !== undefined, 'getInstrukcija("health") returns entry');
assert(healthEntry?.methods.includes('GET'), 'health entry has GET method');

const readVoiceEntry = getInstrukcija('read-voice');
assert(readVoiceEntry !== undefined, 'getInstrukcija("read-voice") returns entry');
assert(readVoiceEntry?.methods.includes('POST'), 'read-voice entry has POST method');
assert(readVoiceEntry?.endpointPath === '/api/extrimli/read-voice', 'read-voice endpointPath correct');

const destructionEntry = getInstrukcija('destruction');
assert(destructionEntry !== undefined, 'getInstrukcija("destruction") returns entry');

// ─── edge cases: getInstrukcija ───────────────────────────────────────────────

console.log('\n[getInstrukcija — edge cases]');

assert(getInstrukcija('unknown') === undefined, 'unknown module → undefined');
assert(getInstrukcija('') === undefined, 'empty string → undefined');
assert(getInstrukcija(null as unknown as string) === undefined, 'null → undefined');
assert(getInstrukcija(undefined as unknown as string) === undefined, 'undefined → undefined');
assert(getInstrukcija(Infinity as unknown as string) === undefined, 'Infinity → undefined');
assert(getInstrukcija(0 as unknown as string) === undefined, 'number 0 → undefined');

// ─── buildExtrimliExportBundle ────────────────────────────────────────────────

console.log('\n[buildExtrimliExportBundle]');

const bundle = buildExtrimliExportBundle();

assert(bundle.bundleVersion === EXTRIMLI_EXPORT_BUNDLE_VERSION, 'bundleVersion matches constant');
assert(bundle.bundleVersion === 'v1', 'bundleVersion is v1');
assert(bundle.contractVersion === EXTRIMLI_CONTRACT_VERSION, 'contractVersion matches');
assert(bundle.moduleVersion === EXTRIMLI_MODULE_VERSION, 'moduleVersion matches');
assert(bundle.personaId === EXTRIMLI_PERSONA_ID, 'personaId matches');
assert(typeof bundle.generatedAt === 'string' && bundle.generatedAt.length > 0, 'generatedAt is non-empty string');

// sport registry
assert(Array.isArray(bundle.sportRegistry), 'sportRegistry is array');
assert(bundle.sportRegistry.length === SPORT_REGISTRY.length, 'sportRegistry has all sports');
assert(bundle.sportRegistry.every((s) => typeof s.id === 'string'), 'all sport entries have id');

// gear listing
assert(Array.isArray(bundle.gearListing), 'gearListing is array');
assert(bundle.gearListing.length >= 6, 'gearListing has at least 6 seeded items');
assert(bundle.gearListing.every((g) => typeof (g as { sku: string }).sku === 'string'), 'all gear entries have sku');
// export bundle gear items should not expose primerInput/primerOutput — they are full GearCatalogEntry
const gearEntry = bundle.gearListing[0] as Record<string, unknown>;
assert(typeof gearEntry.affiliateCommission === 'number', 'gear listing includes affiliateCommission');

// instrukcije (no primerInput / primerOutput)
assert(bundle.instrukcije.length === 9, 'instrukcije has 9 entries');
const instrEntry = bundle.instrukcije[0] as Record<string, unknown>;
assert(instrEntry.primerInput === undefined, 'export bundle instrukcije omit primerInput');
assert(instrEntry.primerOutput === undefined, 'export bundle instrukcije omit primerOutput');
assert(typeof instrEntry.id === 'string', 'instrukcije entry has id');
assert(typeof instrEntry.endpointPath === 'string', 'instrukcije entry has endpointPath');

// idempotency: second call should produce independent objects
const bundle2 = buildExtrimliExportBundle();
assert(bundle2.sportRegistry !== bundle.sportRegistry, 'each call returns new sportRegistry reference');
assert(bundle2.gearListing !== bundle.gearListing, 'each call returns new gearListing reference');

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
