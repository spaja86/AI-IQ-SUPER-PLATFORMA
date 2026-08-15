// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  EkvivalentCluster,
  EkvivalentDomain,
  EkvivalentEdge,
  EkvivalentHealthReport,
  EkvivalentInput,
  EkvivalentMatch,
  EkvivalentNode,
  EkvivalentRelationType,
  EkvivalentResult,
} from './types';
import {
  EKVIVALENT_API_RESPONSE_MAX_MS,
  EKVIVALENT_CLUSTER_THRESHOLD,
  EKVIVALENT_CONTRACT_VERSION,
  EKVIVALENT_DISCLAIMER,
  EKVIVALENT_MAX_SCORE,
  EKVIVALENT_MIN_SCORE,
  EKVIVALENT_MODULE_VERSION,
  EKVIVALENT_PERFORMANCE_MAX_MS,
  EKVIVALENT_PERSONA_ID,
  EKVIVALENT_VALID_DOMAINS,
  EKVIVALENT_VALID_RELATION_TYPES,
} from './types';
import { getTotalEdges, getTotalNodes } from './registry';

// ─── In-memory metrics ───────────────────────────────────────────────────────

let evaluations = 0;
let lastNetworkScore = 0;

// ─── Activation hint catalog ─────────────────────────────────────────────────

const RELATION_HINTS: Record<EkvivalentRelationType, string> = {
  FULL: 'Ovaj entitet je potpuni ekvivalent — može se koristiti kao direktna zamena bez prilagođavanja.',
  PARTIAL: 'Postoji delimična ekvivalencija — razmatraj adaptaciju interfejsa ili konteksta pre zamene.',
  FUNCTIONAL: 'Funkcionalna ekvivalencija potvrđena — entiteti dele isti poslovni cilj, ali se razlikuju u implementaciji.',
  CONTEXTUAL: 'Ekvivalencija zavisi od konteksta — proceni okruženje primene pre aktivacije.',
  SUBSTITUTABLE: 'Entitet je zamenjiv u određenim scenarijima — verifikuj kompatibilnost zahteva.',
};

const DOMAIN_ACTIVATION: Record<EkvivalentDomain, string> = {
  SKILL: 'Proceni prenosivost veštine između entiteta — isti naziv ne garantuje isti nivo.',
  COMPETENCY: 'Verifikuj kompetencijski profil u ciljnom kontekstu pre zamene.',
  AGENT: 'Koordiniraj handoff protokol između agentskih ekvivalenata pre migracije.',
  MODULE: 'Proveri API kontrakt i verziju — ekvivalentni moduli moraju deliti isti contract version.',
  ORGANIZATION: 'Organizacijska ekvivalencija zahteva validaciju kulturnih i procesnih usklađenosti.',
  RESOURCE: 'Potvrdi dostupnost i kapacitet resursa pre aktivacije ekvivalenta.',
  PERSONA: 'Verifikuj persona-bank sync i octave kompatibilnost pre zamene persone.',
  KNOWLEDGE: 'Potvrdi aktuelnost i dubinu znanja ekvivalenta — datumi i izvori su ključni.',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function invalidResult(
  referenceId: string | undefined,
  warning: string,
  start: number,
): EkvivalentResult {
  return {
    referenceId: referenceId ?? 'n/a',
    queryNode: null,
    equivalentNodes: [],
    clusterMap: [],
    networkScore: 0,
    warnings: [warning],
    disclaimer: EKVIVALENT_DISCLAIMER,
    valid: false,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

/** Geometric mean of top-3 scores; returns 0 for empty array */
function computeNetworkScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => b - a);
  const top3 = sorted.slice(0, 3);
  const product = top3.reduce((acc, s) => acc * (s + 1), 1);
  const geoMean = Math.pow(product, 1 / top3.length) - 1;
  return Math.round(Math.min(EKVIVALENT_MAX_SCORE, geoMean) * 100) / 100;
}

/** Sanitize a score: return 0 for NaN/Infinity/negative, clamp to MAX */
function sanitizeScore(score: number): { value: number; dirty: boolean } {
  if (!Number.isFinite(score) || score < EKVIVALENT_MIN_SCORE) {
    return { value: 0, dirty: true };
  }
  if (score > EKVIVALENT_MAX_SCORE) {
    return { value: EKVIVALENT_MAX_SCORE, dirty: true };
  }
  return { value: score, dirty: false };
}

/** Build equivalence clusters using union-find on edges with score ≥ threshold */
function buildClusters(
  nodes: Map<string, EkvivalentNode>,
  edges: EkvivalentEdge[],
): EkvivalentCluster[] {
  const parent: Map<string, string> = new Map();

  function find(id: string): string {
    if (!parent.has(id)) parent.set(id, id);
    const p = parent.get(id)!;
    if (p !== id) {
      const root = find(p);
      parent.set(id, root);
      return root;
    }
    return id;
  }

  function union(a: string, b: string): void {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }

  // Union nodes connected by high-score edges
  for (const edge of edges) {
    if (edge.score >= EKVIVALENT_CLUSTER_THRESHOLD) {
      union(edge.fromId, edge.toId);
    }
  }

  // Group nodes by root
  const groups: Map<string, string[]> = new Map();
  for (const id of nodes.keys()) {
    const root = find(id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(id);
  }

  const clusters: EkvivalentCluster[] = [];
  let clusterIndex = 0;
  for (const [root, members] of groups.entries()) {
    if (members.length < 2) continue; // singleton — not a cluster

    // Compute cohesion: average score of intra-cluster edges
    const intraEdges = edges.filter(
      (e) =>
        members.includes(e.fromId) &&
        members.includes(e.toId) &&
        e.score >= EKVIVALENT_CLUSTER_THRESHOLD,
    );
    const cohesion =
      intraEdges.length > 0
        ? intraEdges.reduce((sum, e) => sum + e.score, 0) / intraEdges.length / 100
        : 0;

    const representative = root;
    const repNode = nodes.get(representative);
    const label = repNode ? `Cluster: ${repNode.label}` : `Cluster ${clusterIndex + 1}`;

    clusters.push({
      clusterId: `cluster-${clusterIndex++}`,
      label,
      members,
      cohesion: Math.round(cohesion * 1000) / 1000,
      representative,
    });
  }

  return clusters;
}

/** Build activation hint for a match */
function buildActivationHint(relationType: EkvivalentRelationType, domain: EkvivalentDomain): string {
  return `${RELATION_HINTS[relationType]} ${DOMAIN_ACTIVATION[domain]}`;
}

// ─── Main evaluate function ──────────────────────────────────────────────────

export function evaluateEkvivalentNetwork(input: EkvivalentInput): EkvivalentResult {
  const start = performance.now();

  // Basic type guard
  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input mora biti objekat', start);
  }

  if (!Array.isArray(input.nodes) || input.nodes.length === 0) {
    return invalidResult(input.referenceId, 'nodes mora biti neprazan niz', start);
  }

  if (!Array.isArray(input.edges)) {
    return invalidResult(input.referenceId, 'edges mora biti niz', start);
  }

  // Validate nodes
  const nodeMap: Map<string, EkvivalentNode> = new Map();
  for (const node of input.nodes) {
    if (!node || typeof node !== 'object' || typeof node.id !== 'string' || node.id.trim() === '') {
      return invalidResult(input.referenceId, 'svaki node mora imati string id', start);
    }
    if (!EKVIVALENT_VALID_DOMAINS.includes(node.domain as EkvivalentDomain)) {
      return invalidResult(input.referenceId, `nevalidan domain "${node.domain}" na node-u "${node.id}"`, start);
    }
    nodeMap.set(node.id, node);
  }

  // Validate and sanitize edges
  const warnings: string[] = [];
  let hadDirtyScores = false;
  const validEdges: EkvivalentEdge[] = [];
  const seenEdgePairs = new Set<string>();

  for (const edge of input.edges) {
    if (!edge || typeof edge !== 'object') continue;

    // Self-reference check
    if (edge.fromId === edge.toId) {
      warnings.push(`Samoreferencijalna veza na node-u "${edge.fromId}" je ignorisana.`);
      continue;
    }

    // Deduplication
    const pairKey = [edge.fromId, edge.toId].sort().join('::');
    if (seenEdgePairs.has(pairKey)) {
      warnings.push(`Duplikat veze između "${edge.fromId}" i "${edge.toId}" je ignorisan.`);
      continue;
    }
    seenEdgePairs.add(pairKey);

    // Validate relationType
    if (!EKVIVALENT_VALID_RELATION_TYPES.includes(edge.relationType as EkvivalentRelationType)) {
      warnings.push(`Nevalidan relationType "${edge.relationType}" na vezi "${edge.fromId}"→"${edge.toId}" — veza ignorisana.`);
      continue;
    }

    const { value: sanitizedScore, dirty } = sanitizeScore(edge.score);
    if (dirty) {
      hadDirtyScores = true;
    }

    validEdges.push({ ...edge, score: sanitizedScore });
  }

  if (hadDirtyScores) {
    warnings.push('Neke vrednosti score-a su bile NaN/Infinity/negativne ili prekoračuju 100 — normalizovane su.');
  }

  // Determine query node
  const queryNodeId = input.queryNodeId;
  let queryNode: EkvivalentNode | null = null;

  if (queryNodeId !== undefined && queryNodeId !== '') {
    queryNode = nodeMap.get(queryNodeId) ?? null;
    if (queryNode === null) {
      return invalidResult(
        input.referenceId,
        `queryNodeId "${queryNodeId}" nije pronađen u listi nodes`,
        start,
      );
    }
  } else {
    // Default to first node
    queryNode = input.nodes[0];
  }

  // Find equivalent nodes (edges connected to queryNode)
  const connectedEdges = validEdges.filter(
    (e) => e.fromId === queryNode!.id || e.toId === queryNode!.id,
  );

  if (connectedEdges.length === 0) {
    warnings.push(`Node "${queryNode.id}" nema nijednu validnu ekvivalentnu vezu.`);
  }

  // Build matches
  const matchMap: Map<string, EkvivalentMatch> = new Map();
  for (const edge of connectedEdges) {
    const otherId = edge.fromId === queryNode!.id ? edge.toId : edge.fromId;
    const otherNode = nodeMap.get(otherId);
    if (!otherNode) continue;

    // Filter by queryDomain if specified
    if (input.queryDomain !== undefined && otherNode.domain !== input.queryDomain) continue;

    // Keep highest-score edge per node pair
    const existing = matchMap.get(otherId);
    if (!existing || edge.score > existing.equivalenceScore) {
      matchMap.set(otherId, {
        node: otherNode,
        relationType: edge.relationType,
        equivalenceScore: edge.score,
        rank: 0,
        activationHint: buildActivationHint(edge.relationType, otherNode.domain),
      });
    }
  }

  // Sort and assign ranks
  const equivalentNodes: EkvivalentMatch[] = Array.from(matchMap.values())
    .sort((a, b) => b.equivalenceScore - a.equivalenceScore)
    .map((m, idx) => ({ ...m, rank: idx + 1 }));

  // Warn if all scores are zero
  if (
    equivalentNodes.length > 0 &&
    equivalentNodes.every((m) => m.equivalenceScore === 0)
  ) {
    warnings.push('Sve vrednosti equivalenceScore su 0 — proveri kvalitet ulaznih podataka.');
  }

  // Network score
  const networkScore = computeNetworkScore(equivalentNodes.map((m) => m.equivalenceScore));

  // Build clusters from the full node graph
  const clusterMap = buildClusters(nodeMap, validEdges);

  evaluations += 1;
  lastNetworkScore = networkScore;

  return {
    referenceId: input.referenceId ?? 'n/a',
    queryNode,
    equivalentNodes,
    clusterMap,
    networkScore,
    warnings,
    disclaimer: EKVIVALENT_DISCLAIMER,
    valid: true,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

// ─── Health report ───────────────────────────────────────────────────────────

export function getEkvivalentHealthReport(): EkvivalentHealthReport {
  return {
    personaId: EKVIVALENT_PERSONA_ID,
    contractVersion: EKVIVALENT_CONTRACT_VERSION,
    moduleVersion: EKVIVALENT_MODULE_VERSION,
    evaluations,
    lastNetworkScore,
    performanceMaxMs: EKVIVALENT_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: EKVIVALENT_API_RESPONSE_MAX_MS,
    totalNodes: getTotalNodes(),
    totalEdges: getTotalEdges(),
  };
}

export function _resetEkvivalentMetrics(): void {
  evaluations = 0;
  lastNetworkScore = 0;
}
