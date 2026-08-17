// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateEkvivalentNetwork,
  getEkvivalentHealthReport,
  _resetEkvivalentMetrics,
  _resetRegistry,
  upsertNode,
  getNodeById,
  listAllNodes,
  removeNode,
  addEdge,
  getEdgesByNode,
  getTotalNodes,
  EKVIVALENT_CONTRACT_VERSION,
  EKVIVALENT_DISCLAIMER,
  EKVIVALENT_PERFORMANCE_MAX_MS,
  EKVIVALENT_PERSONA_ID,
  EKVIVALENT_VALID_DOMAINS,
  EKVIVALENT_VALID_RELATION_TYPES,
  EKVIVALENT_OCTAVE,
  EKVIVALENT_HIPERMREZA_NODE,
} from '../../lib/ekvivalent-network';
import type { EkvivalentInput, EkvivalentNode } from '../../lib/ekvivalent-network';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

// ─── Test data helpers ────────────────────────────────────────────────────────

function makeInput(overrides: Partial<EkvivalentInput> = {}): EkvivalentInput {
  return {
    referenceId: 'test-ref',
    nodes: [
      { id: 'n1', label: 'Node 1', domain: 'MODULE' },
      { id: 'n2', label: 'Node 2', domain: 'MODULE' },
      { id: 'n3', label: 'Node 3', domain: 'AGENT' },
    ],
    edges: [
      { fromId: 'n1', toId: 'n2', relationType: 'FULL', score: 95 },
      { fromId: 'n1', toId: 'n3', relationType: 'FUNCTIONAL', score: 72 },
    ],
    queryNodeId: 'n1',
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  _resetEkvivalentMetrics();
  _resetRegistry();

  console.log('\n🔎 [ekvivalent-network] constants');

  await test('contract version is non-empty', () => {
    assert(EKVIVALENT_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is ekvivalent-network-core', () => {
    assert(EKVIVALENT_PERSONA_ID === 'ekvivalent-network-core', `unexpected persona id: ${EKVIVALENT_PERSONA_ID}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(EKVIVALENT_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  await test('valid domains list has 8 entries', () => {
    assert(EKVIVALENT_VALID_DOMAINS.length === 8, `expected 8 domains, got ${EKVIVALENT_VALID_DOMAINS.length}`);
  });

  await test('valid relation types list has 5 entries', () => {
    assert(EKVIVALENT_VALID_RELATION_TYPES.length === 5, `expected 5 relation types, got ${EKVIVALENT_VALID_RELATION_TYPES.length}`);
  });

  await test('octave is 15', () => {
    assert(EKVIVALENT_OCTAVE === 15, `expected 15, got ${EKVIVALENT_OCTAVE}`);
  });

  await test('hipermreza node is 120', () => {
    assert(EKVIVALENT_HIPERMREZA_NODE === 120, `expected 120, got ${EKVIVALENT_HIPERMREZA_NODE}`);
  });

  console.log('\n🔎 [ekvivalent-network] engine — valid cases');

  await test('happy path: returns valid result with matches', () => {
    const result = evaluateEkvivalentNetwork(makeInput());
    assert(result.valid, 'result should be valid');
    assert(result.equivalentNodes.length === 2, `expected 2 matches, got ${result.equivalentNodes.length}`);
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('matches are ranked descending by equivalenceScore', () => {
    const result = evaluateEkvivalentNetwork(makeInput());
    assert(result.valid, 'result should be valid');
    assert(result.equivalentNodes[0].equivalenceScore >= result.equivalentNodes[1].equivalenceScore,
      'first match should have higher or equal score');
    assert(result.equivalentNodes[0].rank === 1, 'first match rank should be 1');
    assert(result.equivalentNodes[1].rank === 2, 'second match rank should be 2');
  });

  await test('activationHint is present for each match', () => {
    const result = evaluateEkvivalentNetwork(makeInput());
    for (const match of result.equivalentNodes) {
      assert(typeof match.activationHint === 'string' && match.activationHint.length > 0,
        `activationHint missing for node ${match.node.id}`);
    }
  });

  await test('cluster detection: high-score edges produce clusters', () => {
    const input = makeInput({
      nodes: [
        { id: 'a', label: 'A', domain: 'MODULE' },
        { id: 'b', label: 'B', domain: 'MODULE' },
        { id: 'c', label: 'C', domain: 'AGENT' },
      ],
      edges: [
        { fromId: 'a', toId: 'b', relationType: 'FULL', score: 90 },
      ],
      queryNodeId: 'a',
    });
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should be valid');
    assert(result.clusterMap.length >= 1, 'should detect at least 1 cluster');
    const cluster = result.clusterMap[0];
    assert(cluster.members.includes('a'), 'cluster should include node a');
    assert(cluster.members.includes('b'), 'cluster should include node b');
    assert(cluster.cohesion >= 0 && cluster.cohesion <= 1, 'cohesion must be 0–1');
  });

  await test('networkScore is computed (geometric mean of top-3)', () => {
    const result = evaluateEkvivalentNetwork(makeInput());
    assert(result.networkScore >= 0 && result.networkScore <= 100, 'networkScore must be 0–100');
  });

  await test('referenceId is echoed in result', () => {
    const result = evaluateEkvivalentNetwork(makeInput({ referenceId: 'my-ref-123' }));
    assert(result.referenceId === 'my-ref-123', `expected my-ref-123, got ${result.referenceId}`);
  });

  await test('queryDomain filter: only matching domain nodes returned', () => {
    const result = evaluateEkvivalentNetwork(makeInput({ queryDomain: 'MODULE' }));
    assert(result.valid, 'should be valid');
    for (const match of result.equivalentNodes) {
      assert(match.node.domain === 'MODULE', `expected MODULE domain, got ${match.node.domain}`);
    }
  });

  await test('default queryNode is first node when queryNodeId is absent', () => {
    const input = makeInput({ queryNodeId: undefined });
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should be valid');
    assert(result.queryNode?.id === 'n1', `expected n1 as default, got ${result.queryNode?.id}`);
  });

  await test('disclaimer always present in valid result', () => {
    const result = evaluateEkvivalentNetwork(makeInput());
    assert(result.disclaimer.length > 0, 'disclaimer must always be present');
  });

  await test('disclaimer always present in invalid result', () => {
    const result = evaluateEkvivalentNetwork({ nodes: [], edges: [], referenceId: 'disc-test' });
    assert(result.disclaimer.length > 0, 'disclaimer must always be present in invalid result');
  });

  await test('performance gate: durationMs <= 50ms', () => {
    const result = evaluateEkvivalentNetwork(makeInput());
    assert(result.durationMs <= EKVIVALENT_PERFORMANCE_MAX_MS,
      `durationMs ${result.durationMs}ms exceeds ${EKVIVALENT_PERFORMANCE_MAX_MS}ms`);
  });

  console.log('\n🔎 [ekvivalent-network] engine — edge cases');

  await test('empty nodes → invalid result', () => {
    const result = evaluateEkvivalentNetwork({ nodes: [], edges: [] });
    assert(result.valid === false, 'empty nodes should produce invalid result');
    assert(result.warnings.length > 0, 'should have warnings');
  });

  await test('queryNodeId not found → invalid result', () => {
    const result = evaluateEkvivalentNetwork(makeInput({ queryNodeId: 'nonexistent-node' }));
    assert(result.valid === false, 'unknown queryNodeId should produce invalid result');
  });

  await test('NaN score → normalized to 0, warning, still valid', () => {
    const input = makeInput({
      edges: [
        { fromId: 'n1', toId: 'n2', relationType: 'FULL', score: NaN },
      ],
    });
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should still be valid after normalization');
    assert(result.warnings.some((w) => w.includes('NaN') || w.includes('normalizovane')),
      'should warn about dirty scores');
  });

  await test('Infinity score → normalized to 100, warning, still valid', () => {
    const input = makeInput({
      edges: [
        { fromId: 'n1', toId: 'n2', relationType: 'FULL', score: Infinity },
      ],
    });
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should still be valid after normalization');
    assert(result.warnings.some((w) => w.includes('normalizovane') || w.includes('NaN')),
      'should warn about dirty scores');
    if (result.equivalentNodes.length > 0) {
      assert(result.equivalentNodes[0].equivalenceScore <= 100, 'score must be capped at 100');
    }
  });

  await test('negative score → normalized to 0, warning, still valid', () => {
    const input = makeInput({
      edges: [
        { fromId: 'n1', toId: 'n2', relationType: 'FULL', score: -50 },
      ],
    });
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should still be valid after normalization');
    assert(result.warnings.some((w) => w.includes('normalizovane') || w.includes('NaN')),
      'should warn about dirty scores');
  });

  await test('self-referencing edge → warning, edge ignored', () => {
    const input = makeInput({
      edges: [
        { fromId: 'n1', toId: 'n1', relationType: 'FULL', score: 80 },
        { fromId: 'n1', toId: 'n2', relationType: 'FULL', score: 90 },
      ],
    });
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should still be valid');
    assert(result.warnings.some((w) => w.includes('Samoreferencijalna')), 'should warn about self-reference');
  });

  await test('duplicate edges → second ignored with warning', () => {
    const input = makeInput({
      edges: [
        { fromId: 'n1', toId: 'n2', relationType: 'FULL', score: 90 },
        { fromId: 'n2', toId: 'n1', relationType: 'PARTIAL', score: 60 },
      ],
    });
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should be valid');
    assert(result.warnings.some((w) => w.includes('Duplikat')), 'should warn about duplicate edge');
  });

  await test('all zero scores → warning about quality', () => {
    const input = makeInput({
      edges: [
        { fromId: 'n1', toId: 'n2', relationType: 'PARTIAL', score: 0 },
        { fromId: 'n1', toId: 'n3', relationType: 'CONTEXTUAL', score: 0 },
      ],
    });
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should be valid');
    assert(result.warnings.some((w) => w.includes('0')), 'should warn about all-zero scores');
  });

  await test('disconnected query node → warning', () => {
    const input: EkvivalentInput = {
      nodes: [
        { id: 'lone', label: 'Lone Node', domain: 'KNOWLEDGE' },
        { id: 'other', label: 'Other', domain: 'SKILL' },
      ],
      edges: [
        { fromId: 'other', toId: 'other', relationType: 'FULL', score: 80 },
      ],
      queryNodeId: 'lone',
    };
    const result = evaluateEkvivalentNetwork(input);
    assert(result.valid, 'should be valid even with no edges');
    assert(result.warnings.some((w) => w.includes('lone') || w.includes('nijednu')),
      'should warn about disconnected node');
  });

  await test('null input → invalid result', () => {
    const result = evaluateEkvivalentNetwork(null as never);
    assert(result.valid === false, 'null input should produce invalid result');
  });

  await test('invalid domain on node → invalid result', () => {
    const result = evaluateEkvivalentNetwork({
      nodes: [{ id: 'x', label: 'X', domain: 'INVALID_DOMAIN' as never }],
      edges: [],
    });
    assert(result.valid === false, 'invalid domain should produce invalid result');
  });

  console.log('\n🔎 [ekvivalent-network] health report');

  await test('health report returns expected shape', () => {
    const report = getEkvivalentHealthReport();
    assert(report.personaId === EKVIVALENT_PERSONA_ID, `unexpected personaId: ${report.personaId}`);
    assert(report.contractVersion === EKVIVALENT_CONTRACT_VERSION, 'unexpected contract version');
    assert(typeof report.evaluations === 'number', 'evaluations must be a number');
    assert(report.performanceMaxMs === 50, `expected 50ms, got ${report.performanceMaxMs}`);
    assert(report.apiResponseMaxMs === 200, `expected 200ms, got ${report.apiResponseMaxMs}`);
    assert(typeof report.totalNodes === 'number', 'totalNodes must be a number');
    assert(typeof report.totalEdges === 'number', 'totalEdges must be a number');
  });

  await test('evaluations counter increments', () => {
    _resetEkvivalentMetrics();
    evaluateEkvivalentNetwork(makeInput({ referenceId: 'e1' }));
    evaluateEkvivalentNetwork(makeInput({ referenceId: 'e2' }));
    const report = getEkvivalentHealthReport();
    assert(report.evaluations === 2, `expected 2 evaluations, got ${report.evaluations}`);
  });

  console.log('\n🔎 [ekvivalent-network] registry');

  await test('seed nodes are present on init', () => {
    _resetRegistry();
    const all = listAllNodes();
    assert(all.length >= 10, `expected at least 10 seeded nodes, got ${all.length}`);
  });

  await test('ekvivalent-network-core is in seed', () => {
    _resetRegistry();
    const node = getNodeById('ekvivalent-network-core');
    assert(node !== undefined, 'ekvivalent-network-core must be seeded');
    assert(node?.domain === 'MODULE', `expected MODULE domain, got ${node?.domain}`);
  });

  await test('upsertNode adds a new node', () => {
    _resetRegistry();
    const before = getTotalNodes();
    upsertNode({ id: 'test-new-node', label: 'Test', domain: 'SKILL' });
    assert(getTotalNodes() === before + 1, 'should have one more node after upsert');
    assert(getNodeById('test-new-node') !== undefined, 'new node must be retrievable');
  });

  await test('upsertNode updates existing node', () => {
    _resetRegistry();
    upsertNode({ id: 'adutiv-core', label: 'Updated Label', domain: 'AGENT' });
    const node = getNodeById('adutiv-core');
    assert(node?.label === 'Updated Label', `expected Updated Label, got ${node?.label}`);
  });

  await test('removeNode deletes a node', () => {
    _resetRegistry();
    upsertNode({ id: 'to-remove', label: 'Remove Me', domain: 'RESOURCE' });
    const removed = removeNode('to-remove');
    assert(removed, 'removeNode should return true for existing node');
    assert(getNodeById('to-remove') === undefined, 'node should not exist after removal');
  });

  await test('removeNode returns false for non-existent node', () => {
    _resetRegistry();
    const removed = removeNode('does-not-exist');
    assert(removed === false, 'removeNode should return false for missing node');
  });

  await test('addEdge and getEdgesByNode', () => {
    _resetRegistry();
    addEdge({ fromId: 'adutiv-core', toId: 'ekzist-core', relationType: 'PARTIAL', score: 60 });
    const edges = getEdgesByNode('adutiv-core');
    assert(edges.length >= 1, 'should find at least 1 edge for adutiv-core');
    assert(edges.some((e) => e.toId === 'ekzist-core'), 'edge to ekzist-core must be present');
  });

  // ─── Summary ──────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Unexpected test runner error:', error);
  process.exit(1);
});
