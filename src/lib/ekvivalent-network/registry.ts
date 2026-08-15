// SpajaUltraOmegaCore -∞Ω+∞ — EKVIVALENT NETWORK Registry
// Kompanija SPAJA — Digitalna Industrija

import type { EkvivalentEdge, EkvivalentNode } from './types';

// ─── In-memory stores ────────────────────────────────────────────────────────

const nodeStore: Map<string, EkvivalentNode> = new Map();
const edgeStore: EkvivalentEdge[] = [];

// ─── Seed: platform built-in nodes ───────────────────────────────────────────

const SEED_NODES: EkvivalentNode[] = [
  { id: 'adutiv-core', label: 'ADUTIV — Advantage Intelligence Engine', domain: 'MODULE', tags: ['advantage', 'portfolio', 'tier'] },
  { id: 'maksimus-core', label: 'MAKSIMUS — Analytical Apex Agent', domain: 'AGENT', tags: ['analytics', 'orchestration', 'strategy'] },
  { id: 'another-maks-core', label: 'ANOTHER MAKS — Creative Apex Agent', domain: 'AGENT', tags: ['creative', 'generative', 'innovation'] },
  { id: 'nova-generacija-agent', label: 'Nova Generacija — Platform Orchestration', domain: 'AGENT', tags: ['nova-generacija', 'gaming', 'hipermreza'] },
  { id: 'persona-bank-core', label: 'Persona Bank — Unified Persona Registry', domain: 'MODULE', tags: ['persona', 'identity', 'registry'] },
  { id: 'dijagnoza-core', label: 'DIJAGNOZA — Health Diagnostic Engine', domain: 'MODULE', tags: ['health', 'diagnostics', 'triage'] },
  { id: 'gigatron-core', label: 'GIGATRON — IT Procurement Engine', domain: 'MODULE', tags: ['procurement', 'catalog', 'affiliate'] },
  { id: 'extrimli-core', label: 'EXTRIMLI — Extreme Sports Intelligence', domain: 'MODULE', tags: ['sports', 'risk', 'gear'] },
  { id: 'extrimli-cuz-social', label: 'EXTRIMLI CUZ — Community & Social Hub', domain: 'MODULE', tags: ['community', 'crew', 'mentorship'] },
  { id: 'zlatni-racuni-core', label: 'ZLATNI RAČUNI — Loyalty Tier Engine', domain: 'MODULE', tags: ['loyalty', 'tier', 'points'] },
  { id: 'madagaskar-exotic-market', label: 'MADAGASKAR — Exotic Market Intelligence', domain: 'MODULE', tags: ['exotic', 'rarity', 'procurement'] },
  { id: 'discount-telecom-global', label: 'Discount Telecom — Global Operator Catalog', domain: 'MODULE', tags: ['telecom', 'discount', 'operator'] },
  { id: 'ekzist-core', label: 'EKZIST — Existential Profiler', domain: 'MODULE', tags: ['existential', 'meaning', 'balance'] },
  { id: 'konvenkcionalni-odnosi-core', label: 'KONVENKCIONALNI ODNOSI — Relation Management', domain: 'MODULE', tags: ['relations', 'lifecycle', 'interaction'] },
  { id: 'epekm-denter-core', label: 'EPEKM-D — Permanent Email Identity Engine', domain: 'MODULE', tags: ['email', 'identity', 'delivery'] },
  { id: 'decibil-core', label: 'DECIBIL — Audio Signal Measurement', domain: 'MODULE', tags: ['audio', 'dbfs', 'signal'] },
  { id: 'trenazer-coach-core', label: 'TRENAŽER — Training Readiness Engine', domain: 'MODULE', tags: ['training', 'readiness', 'intensity'] },
  { id: 'dumbir-wellness-core', label: 'ÐUMBIR — Ginger Wellness Engine', domain: 'MODULE', tags: ['wellness', 'potency', 'comfort'] },
  { id: 'great-sumbion-core', label: 'GREAT SUMBION — Weighted Score Engine', domain: 'MODULE', tags: ['score', 'tier', 'weighted'] },
  { id: 'digit-engine-core', label: 'Digit Intelligence Engine — Symbolic Layers', domain: 'MODULE', tags: ['digit', 'symbolic', 'registry'] },
  { id: 'tarken-hingil-ekolan-maksimus', label: 'THEM — Apex Strategic Orchestrator', domain: 'AGENT', tags: ['apex', 'strategy', 'hipermreza'] },
  { id: 'ekvivalent-network-core', label: 'EKVIVALENT NETWORK — Equivalence Mapping Engine', domain: 'MODULE', tags: ['equivalence', 'network', 'cluster'] },
];

// Initialize seed nodes
for (const node of SEED_NODES) {
  nodeStore.set(node.id, node);
}

// ─── Node CRUD ───────────────────────────────────────────────────────────────

export function getNodeById(id: string): EkvivalentNode | undefined {
  return nodeStore.get(id);
}

export function listAllNodes(): EkvivalentNode[] {
  return Array.from(nodeStore.values());
}

export function upsertNode(node: EkvivalentNode): void {
  nodeStore.set(node.id, node);
}

export function removeNode(id: string): boolean {
  return nodeStore.delete(id);
}

// ─── Edge operations ─────────────────────────────────────────────────────────

export function getEdgesByNode(id: string): EkvivalentEdge[] {
  return edgeStore.filter((e) => e.fromId === id || e.toId === id);
}

export function addEdge(edge: EkvivalentEdge): void {
  // Guard against self-referencing edges at the registry level
  if (edge.fromId === edge.toId) return;
  edgeStore.push(edge);
}

export function listAllEdges(): EkvivalentEdge[] {
  return [...edgeStore];
}

export function getTotalNodes(): number {
  return nodeStore.size;
}

export function getTotalEdges(): number {
  return edgeStore.length;
}

// ─── Test helpers ─────────────────────────────────────────────────────────────

export function _resetRegistry(): void {
  nodeStore.clear();
  edgeStore.length = 0;
  for (const node of SEED_NODES) {
    nodeStore.set(node.id, node);
  }
}
